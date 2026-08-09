import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import MiniSearch from "minisearch";
import { SEARCH_OPTIONS } from "../src/lib/search-config.ts";
import { createCatalogEntry, createSearchDocument, digest, readTopics, rootDirectory } from "./content-utils.mjs";

const checkOnly = process.argv.includes("--check");
const topics = await readTopics();
const catalog = topics
  .map(({ document }, order) => createCatalogEntry(document, order))
  .toSorted((left, right) => left.order - right.order || left.title.localeCompare(right.title, "en"));
const searchDocuments = topics.map(({ document }) => createSearchDocument(document));
const search = new MiniSearch(SEARCH_OPTIONS);
search.addAll(searchDocuments);
const latestVerification = topics
  .flatMap(({ document }) => document.sources.map((source) => source.accessed))
  .toSorted()
  .at(-1);

const bootstrap = {
  topicCount: catalog.length,
  featuredTopics: catalog.slice(0, 6),
};

const files = new Map([
  [path.join(rootDirectory, "src/generated/topic-bootstrap.ts"),
`import type { TopicCatalogEntry } from "@/types/content";\n\nexport const topicBootstrap: { topicCount: number; featuredTopics: TopicCatalogEntry[] } = ${JSON.stringify(bootstrap, null, 2)};\n`],
  [path.join(rootDirectory, "public/catalog/topic-catalog.json"), `${JSON.stringify(catalog)}\n`],
  [path.join(rootDirectory, "public/search/topic-search.minisearch.json"), `${JSON.stringify(search)}\n`],
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

await Promise.all(Array.from(files, async ([filename, expected]) => {
  if (checkOnly) {
    const actual = await readFile(filename, "utf8").catch(() => "");
    if (actual !== expected) {
      console.error(`Generated artifact is stale: ${path.relative(rootDirectory, filename)}`);
      process.exitCode = 1;
    }
    return;
  }

  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, expected, "utf8");
  console.log(`generated ${path.relative(rootDirectory, filename)}`);
}));
