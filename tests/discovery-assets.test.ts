import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import MiniSearch from "minisearch";
import { SEARCH_OPTIONS } from "../src/lib/search-config.ts";
import type { TopicSearchIndexDocument } from "../src/types/content.ts";

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("generation emits bounded catalog bootstrap and prebuilt search assets", async () => {
  const [generator, bootstrap, catalog] = await Promise.all([
    readProjectFile("scripts/generate-content-artifacts.mjs"),
    readProjectFile("src/generated/topic-bootstrap.ts"),
    readProjectFile("public/catalog/topic-catalog.json"),
  ]);

  assert.match(generator, /public\/catalog\/topic-catalog\.json/);
  assert.match(generator, /topic-search\.minisearch\.json/);
  assert.match(generator, /featuredTopics: catalog\.slice\(0, 6\)/);
  assert.doesNotMatch(bootstrap, /sections|glossary/);
  assert.ok(Array.isArray(JSON.parse(catalog)));
});

test("full catalog, topic routes, and search implementation are outside the eager home path", async () => {
  const [home, topicPage, topicsPage, app, searchHook] = await Promise.all([
    readProjectFile("src/pages/home-page.tsx"),
    readProjectFile("src/pages/topic-page.tsx"),
    readProjectFile("src/pages/topics-page.tsx"),
    readProjectFile("src/app.tsx"),
    readProjectFile("src/hooks/use-search.ts"),
  ]);

  assert.doesNotMatch(`${home}\n${topicPage}\n${topicsPage}`, /@\/generated\/topic-catalog/);
  assert.match(home, /@\/generated\/topic-bootstrap/);
  assert.doesNotMatch(app, /import \{ TopicsPage \}|import \{ TopicPage \}/);
  assert.match(app, /lazy:\s*async/);
  assert.doesNotMatch(searchHook, /^import\s+\{[^}]*searchTopics[^}]*\}\s+from\s+["']@\/lib\/search["']/mu);
  assert.match(searchHook, /import\("@\/lib\/search"\)/);
});

test("serialized MiniSearch index restores and finds representative topics", async () => {
  const serialized = await readProjectFile("public/search/topic-search.minisearch.json");
  const search = await MiniSearch.loadJSONAsync<TopicSearchIndexDocument>(serialized, SEARCH_OPTIONS);
  const dnsResults = search.search("dns") as Array<{ slug?: string }>;
  const graphResults = search.search("graph db", { combineWith: "OR", prefix: true, fuzzy: 0.2 }) as Array<{ slug?: string }>;

  assert.ok(dnsResults.some((result) => result.slug === "how-the-web-works"));
  assert.ok(graphResults.some((result) => result.slug === "the-seven-types-of-databases"));
});
