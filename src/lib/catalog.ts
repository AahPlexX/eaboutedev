import { buildSearchQuery } from "./query-normalization.ts";
import type { TopicCatalogEntry } from "../types/content.ts";

export const CATALOG_WINDOW_SIZE = 24;
export const HOME_TOPIC_PREVIEW_SIZE = 6;

export function filterCatalogTopics(
  topics: TopicCatalogEntry[],
  query: string,
  category: string,
): TopicCatalogEntry[] {
  const terms = buildSearchQuery(query).split(" ").filter(Boolean);

  return topics.filter((topic) => {
    if (category !== "All" && topic.category !== category) return false;
    if (terms.length === 0) return true;

    const haystack = [
      topic.title,
      topic.eyebrow,
      topic.summary,
      topic.category,
      topic.level,
      ...topic.aliases,
      ...topic.keywords,
    ].join(" ").toLocaleLowerCase("en");

    return terms.some((term) => haystack.includes(term));
  });
}

export function getCatalogWindow(
  topics: TopicCatalogEntry[],
  visibleCount: number,
): TopicCatalogEntry[] {
  return topics.slice(0, Math.max(0, visibleCount));
}

export function getNextVisibleCount(current: number, total: number): number {
  return Math.min(total, current + CATALOG_WINDOW_SIZE);
}
