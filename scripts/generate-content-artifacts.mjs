import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCatalogEntry, digest, readTopics, rootDirectory } from "./content-utils.mjs";

const checkOnly = process.argv.includes("--check");
const topics = await readTopics();
const catalog = topics.map(({ document }) => createCatalogEntry(document));
const latestVerification = topics
  .flatMap(({ document }) => document.sources.map((source) => source.accessed))
  .sort()
  .at(-1);

const files = new Map([
  [path.join(rootDirectory, "src/generated/topic-catalog.ts"),
`import type { TopicCatalogEntry } from "@/types/content";\n\nexport const topicCatalog: TopicCatalogEntry[] = ${JSON.stringify(catalog, null, 2)};\n`],
  [path.join(rootDirectory, "public/search/topic-search-index.json"), `${JSON.stringify(catalog, null, 2)}\n`],
  [path.join(rootDirectory, "docs/topic-registry.json"), `${JSON.stringify({
    schemaVersion: 1,
    lastVerified: latestVerification,
    topicCount: topics.length,
    topics: topics.map(({ filename, raw, document }) => ({
      slug: document.slug,
      title: document.title,
      category: document.category,
      level: document.level,
      sourceFile: `public/content/topics/${filename}`,
      sha256: digest(raw),
      sectionCount: document.sections.length,
      sourceCount: document.sources.length,
    })),
  }, null, 2)}\n`],
]);

for (const [filename, expected] of files) {
  if (checkOnly) {
    const actual = await readFile(filename, "utf8").catch(() => "");
    if (actual !== expected) {
      console.error(`Generated artifact is stale: ${path.relative(rootDirectory, filename)}`);
      process.exitCode = 1;
    }
    continue;
  }

  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, expected, "utf8");
  console.log(`generated ${path.relative(rootDirectory, filename)}`);
}
