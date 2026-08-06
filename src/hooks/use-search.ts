import { useEffect, useState } from "react";
import { searchTopics, type TopicSearchResult } from "@/lib/search";

export function useSearch(query: string): {
  results: TopicSearchResult[];
  isLoading: boolean;
  error: string | undefined;
} {
  const [results, setResults] = useState<TopicSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    const normalized = query.trim();

    if (!normalized) {
      setResults([]);
      setError(undefined);
      return () => controller.abort();
    }

    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setError(undefined);
      searchTopics(normalized)
        .then((nextResults) => {
          if (!controller.signal.aborted) setResults(nextResults);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError("Search is temporarily unavailable.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 120);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, isLoading, error };
}
