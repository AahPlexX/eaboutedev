import { tokenizeNaturalLanguage } from "./query-normalization.ts";
import type { TopicCatalogEntry, TopicLevel } from "../types/content.ts";

export const CATALOG_PAGE_SIZE = 24;
export const CATALOG_WINDOW_SIZE = CATALOG_PAGE_SIZE;
export const HOME_TOPIC_PREVIEW_SIZE = 6;

export type CatalogSort = "recommended" | "az" | "shortest" | "longest" | "level";

export interface CatalogPage {
  page: number;
  pageCount: number;
  start: number;
  end: number;
  total: number;
  items: TopicCatalogEntry[];
}

const levelRank: Record<TopicLevel, number> = {
  Foundational: 0,
  Intermediate: 1,
  Advanced: 2,
};

export function filterCatalogTopics(
  topics: TopicCatalogEntry[],
  query: string,
  category: string,
): TopicCatalogEntry[] {
  const terms = tokenizeNaturalLanguage(query);

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

export function sortCatalogTopics(topics: TopicCatalogEntry[], sort: CatalogSort): TopicCatalogEntry[] {
  return [...topics].sort((left, right) => {
    const orderDifference = left.order - right.order;
    const titleDifference = left.title.localeCompare(right.title, "en");

    switch (sort) {
      case "az":
        return titleDifference || orderDifference;
      case "shortest":
        return left.estimatedMinutes - right.estimatedMinutes || orderDifference || titleDifference;
      case "longest":
        return right.estimatedMinutes - left.estimatedMinutes || orderDifference || titleDifference;
      case "level":
        return levelRank[left.level] - levelRank[right.level] || orderDifference || titleDifference;
      default:
        return orderDifference || titleDifference;
    }
  });
}

export function paginateCatalogTopics(topics: TopicCatalogEntry[], requestedPage: number): CatalogPage {
  const total = topics.length;
  const pageCount = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  const normalizedRequest = Number.isInteger(requestedPage) ? requestedPage : 1;
  const page = Math.min(pageCount, Math.max(1, normalizedRequest));
  const offset = (page - 1) * CATALOG_PAGE_SIZE;
  const items = topics.slice(offset, offset + CATALOG_PAGE_SIZE);

  return {
    page,
    pageCount,
    start: total === 0 ? 0 : offset + 1,
    end: total === 0 ? 0 : offset + items.length,
    total,
    items,
  };
}

export function getPaginationItems(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: Math.max(0, pageCount) }, (_, index) => index + 1);

  const visiblePages = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...visiblePages]
    .filter((item) => item >= 1 && item <= pageCount)
    .toSorted((left, right) => left - right);
  const items: Array<number | "ellipsis"> = [];

  for (const current of pages) {
    const previous = items.at(-1);
    if (typeof previous === "number" && current - previous > 1) items.push("ellipsis");
    items.push(current);
  }

  return items;
}

// Transitional helpers retained until the catalog page migrates to true pagination.
export function getCatalogWindow(topics: TopicCatalogEntry[], visibleCount: number): TopicCatalogEntry[] {
  return topics.slice(0, Math.max(0, visibleCount));
}

export function getNextVisibleCount(current: number, total: number): number {
  return Math.min(total, current + CATALOG_WINDOW_SIZE);
}
