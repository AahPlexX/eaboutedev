import MiniSearch, { type SearchResult } from "minisearch";
import { buildSearchQuery, inferQueryIntent } from "@/lib/query-normalization";
import type { TopicCatalogEntry } from "@/types/content";

export interface TopicSearchResult extends SearchResult {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: string;
  estimatedMinutes: number;
  intent: ReturnType<typeof inferQueryIntent>;
}

let searchPromise: Promise<MiniSearch<TopicCatalogEntry>> | undefined;

async function createSearch(): Promise<MiniSearch<TopicCatalogEntry>> {
  const response = await fetch(`${import.meta.env.BASE_URL}search/topic-search-index.json`);
  if (!response.ok) throw new Error(`Search index failed to load (${response.status})`);

  const documents = await response.json() as TopicCatalogEntry[];
  const search = new MiniSearch<TopicCatalogEntry>({
    fields: ["title", "summary", "category", "aliases", "keywords", "sectionTitles", "searchText"],
    storeFields: ["slug", "title", "summary", "category", "level", "estimatedMinutes"],
    idField: "slug",
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: {
        title: 5,
        aliases: 4,
        keywords: 3,
        sectionTitles: 2,
        category: 1.5,
      },
    },
  });
  search.addAll(documents);
  return search;
}

export function getTopicSearch(): Promise<MiniSearch<TopicCatalogEntry>> {
  searchPromise ??= createSearch();
  return searchPromise;
}

export async function searchTopics(query: string, limit = 8): Promise<TopicSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const search = await getTopicSearch();
  const intent = inferQueryIntent(trimmed);
  return search
    .search(buildSearchQuery(trimmed), {
      combineWith: "OR",
      prefix: true,
      fuzzy: (term) => (term.length >= 6 ? 0.25 : term.length >= 4 ? 0.15 : false),
    })
    .slice(0, limit)
    .map((result) => ({ ...result, intent })) as TopicSearchResult[];
}
