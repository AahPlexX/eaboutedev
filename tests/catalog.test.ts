import assert from "node:assert/strict";
import test from "node:test";
import {
  CATALOG_PAGE_SIZE,
  filterCatalogTopics,
  getPaginationItems,
  paginateCatalogTopics,
  sortCatalogTopics,
} from "../src/lib/catalog.ts";
import type { TopicCatalogEntry, TopicLevel } from "../src/types/content.ts";

function makeTopics(count: number): TopicCatalogEntry[] {
  const levels: TopicLevel[] = ["Foundational", "Intermediate", "Advanced"];
  return Array.from({ length: count }, (_, index) => ({
    slug: `topic-${index + 1}`,
    title: index === 0 ? "Graph databases" : `Topic ${String(index + 1).padStart(4, "0")}`,
    eyebrow: "Development guide",
    summary: index === 0 ? "Store and traverse connected relationships." : "A complete guide.",
    category: index % 2 === 0 ? "Data" : "Web foundations",
    level: levels[index % levels.length] ?? "Foundational",
    estimatedMinutes: 10 + (index % 40),
    icon: "01",
    accent: "oklch(0.6 0.18 250)",
    aliases: index === 0 ? ["graph db"] : [],
    keywords: index === 0 ? ["nodes", "edges"] : [],
    order: index,
  }));
}

test("catalog filtering uses aliases, keywords, and category without the deep search corpus", () => {
  const topics = makeTopics(60);
  assert.deepEqual(filterCatalogTopics(topics, "graph db", "Data").map((topic) => topic.slug), ["topic-1"]);
  assert.equal(filterCatalogTopics(topics, "nodes", "Web foundations").length, 0);
});

test("catalog sorting is deterministic for every supported mode", () => {
  const topics = makeTopics(8);
  const first = topics[0];
  const second = topics[1];
  assert.ok(first && second);
  first.title = "Zulu";
  second.title = "Alpha";
  first.estimatedMinutes = 40;
  second.estimatedMinutes = 10;
  first.level = "Advanced";
  second.level = "Foundational";

  assert.deepEqual(sortCatalogTopics(topics, "recommended").slice(0, 2).map(({ order }) => order), [0, 1]);
  assert.equal(sortCatalogTopics(topics, "az")[0]?.title, "Alpha");
  assert.equal(sortCatalogTopics(topics, "shortest")[0]?.estimatedMinutes, 10);
  assert.equal(sortCatalogTopics(topics, "longest")[0]?.estimatedMinutes, Math.max(...topics.map((topic) => topic.estimatedMinutes)));
  assert.equal(sortCatalogTopics(topics, "level")[0]?.level, "Foundational");
});

test("pagination clamps invalid pages and returns at most 24 topics", () => {
  const topics = makeTopics(60);
  assert.equal(CATALOG_PAGE_SIZE, 24);
  assert.equal(paginateCatalogTopics(topics, 2).items.length, 24);
  assert.deepEqual([paginateCatalogTopics(topics, 2).start, paginateCatalogTopics(topics, 2).end], [25, 48]);
  assert.equal(paginateCatalogTopics(topics, 999).page, 3);
  assert.equal(paginateCatalogTopics(topics, -4).page, 1);
});

test("catalog scale shape remains bounded at 100, 500, and 1000 topics", () => {
  for (const count of [100, 500, 1000]) {
    const topics = makeTopics(count);
    const filtered = filterCatalogTopics(topics, "", "All");
    const sorted = sortCatalogTopics(filtered, "recommended");
    const lastPage = paginateCatalogTopics(sorted, Number.MAX_SAFE_INTEGER);
    assert.equal(lastPage.pageCount, Math.ceil(count / CATALOG_PAGE_SIZE));
    assert.ok(lastPage.items.length <= CATALOG_PAGE_SIZE);
    assert.equal(sorted.length, count);
  }
});

test("compact pagination keeps first, last, and nearby pages without hundreds of controls", () => {
  assert.deepEqual(getPaginationItems(5, 10), [1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  assert.deepEqual(getPaginationItems(2, 4), [1, 2, 3, 4]);
});
