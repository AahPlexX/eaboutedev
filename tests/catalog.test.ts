import assert from "node:assert/strict";
import test from "node:test";
import {
  CATALOG_WINDOW_SIZE,
  filterCatalogTopics,
  getCatalogWindow,
  getNextVisibleCount,
} from "../src/lib/catalog.ts";
import type { TopicCatalogEntry } from "../src/types/content.ts";

const topics: TopicCatalogEntry[] = Array.from({ length: 60 }, (_, index) => ({
  slug: `topic-${index + 1}`,
  title: index === 0 ? "Graph databases" : `Topic ${index + 1}`,
  eyebrow: "Development guide",
  summary: index === 0 ? "Store and traverse connected relationships." : "A complete guide.",
  category: index % 2 === 0 ? "Data" : "Web foundations",
  level: "Foundational",
  estimatedMinutes: 20,
  icon: "01",
  accent: "oklch(0.6 0.18 250)",
  aliases: index === 0 ? ["graph db"] : [],
  keywords: index === 0 ? ["nodes", "edges"] : [],
}));

test("catalog filtering uses aliases, keywords, and category without the deep search corpus", () => {
  assert.deepEqual(filterCatalogTopics(topics, "graph db", "Data").map((topic) => topic.slug), ["topic-1"]);
  assert.equal(filterCatalogTopics(topics, "nodes", "Web foundations").length, 0);
});

test("catalog windows render a bounded subset and grow by one window", () => {
  assert.equal(getCatalogWindow(topics, CATALOG_WINDOW_SIZE).length, 24);
  assert.equal(getNextVisibleCount(CATALOG_WINDOW_SIZE, topics.length), 48);
  assert.equal(getNextVisibleCount(48, topics.length), 60);
});
