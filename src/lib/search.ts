import MiniSearch, { type SearchResult } from "minisearch";
import { buildSearchQuery, inferQueryIntent } from "@/lib/query-normalization";
import { SEARCH_OPTIONS } from "@/lib/search-config";
import type { TopicSearchIndexDocument, TopicSearchStoredFields } from "@/types/content";

export interface TopicSearchResult extends SearchResult, TopicSearchStoredFields {
  intent: ReturnType<typeof inferQueryIntent>;
}

let searchPromise: Promise<MiniSearch<TopicSearchIndexDocument>> | undefined;

function getBaseUrl(): string {
  return import.meta.env?.BASE_URL ?? "/";
}

async function createSearch(): Promise<MiniSearch<TopicSearchIndexDocument>> {
  const response = await fetch(`${getBaseUrl()}search/topic-search.minisearch.json`);
  if (!response.ok) throw new Error(`Search index failed to load (${response.status})`);
  return MiniSearch.loadJSONAsync<TopicSearchIndexDocument>(await response.text(), SEARCH_OPTIONS);
}

function getTopicSearch(): Promise<MiniSearch<TopicSearchIndexDocument>> {
  searchPromise ??= createSearch().catch((error: unknown) => {
    searchPromise = undefined;
    throw error;
  });
  return searchPromise;
}

export async function searchTopics(query: string, limit = 8): Promise<TopicSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const search = await getTopicSearch();
  const intent = inferQueryIntent(trimmed);
  const results = search
    .search(buildSearchQuery(trimmed), {
      combineWith: "OR",
      prefix: true,
      fuzzy: (term) => (term.length >= 6 ? 0.25 : term.length >= 4 ? 0.15 : false),
    })
    .slice(0, limit) as TopicSearchResult[];

  for (const result of results) result.intent = intent;
  return results;
}
