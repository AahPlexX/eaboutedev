import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { rootDirectory } from "./content-utils.mjs";

const failures = [];
const read = (relativePath) => readFile(path.join(rootDirectory, relativePath), "utf8");
const exists = async (relativePath) => access(path.join(rootDirectory, relativePath)).then(() => true).catch(() => false);

const [catalogRaw, searchRaw, bootstrapRaw, registryRaw, homeSource, appSource, hookSource] = await Promise.all([
  read("public/catalog/topic-catalog.json"),
  read("public/search/topic-search.minisearch.json"),
  read("src/generated/topic-bootstrap.ts"),
  read("docs/topic-registry.json"),
  read("src/pages/home-page.tsx"),
  read("src/app.tsx"),
  read("src/hooks/use-search.ts"),
]);

const catalog = JSON.parse(catalogRaw);
const registry = JSON.parse(registryRaw);
const topicCount = registry.topicCount;
const catalogLimit = 4_096 + topicCount * 1_500;
const searchLimit = 16_384 + topicCount * 8_000;
const bootstrapLimit = 32_768;

if (!Array.isArray(catalog) || catalog.length !== topicCount) failures.push("catalog topic count differs from registry");
if (Buffer.byteLength(catalogRaw) > catalogLimit) failures.push(`catalog asset exceeds ${catalogLimit} bytes`);
if (Buffer.byteLength(searchRaw) > searchLimit) failures.push(`search asset exceeds ${searchLimit} bytes`);
if (Buffer.byteLength(bootstrapRaw) > bootstrapLimit) failures.push(`homepage bootstrap exceeds ${bootstrapLimit} bytes`);
if (/generated\/topic-catalog/u.test(homeSource)) failures.push("homepage eagerly imports the full topic catalog");
if (/import\s+\{\s*TopicsPage\s*\}|import\s+\{\s*TopicPage\s*\}/u.test(appSource)) failures.push("heavy topic routes are statically imported");
if (/^import\s+\{[^}]*searchTopics[^}]*\}\s+from\s+["']@\/lib\/search["']/mu.test(hookSource)) failures.push("search implementation is statically imported by the shell path");

for (const obsolete of ["src/generated/topic-catalog.ts", "public/search/topic-search-index.json"]) {
  if (await exists(obsolete)) failures.push(`obsolete discovery artifact still exists: ${obsolete}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`validated discovery assets for ${topicCount} topics`);
