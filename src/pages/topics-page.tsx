import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { CatalogPagination } from "@/components/topics/catalog-pagination";
import { TopicCard } from "@/components/topics/topic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterCatalogTopics, paginateCatalogTopics, sortCatalogTopics, type CatalogSort } from "@/lib/catalog";
import { loadCatalog } from "@/lib/catalog-loader";
import { parseCatalogState, toCatalogSearchParams, type CatalogState } from "@/lib/catalog-state";
import type { TopicCatalogEntry } from "@/types/content";

export function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = parseCatalogState(searchParams);
  const [catalog, setCatalog] = useState<TopicCatalogEntry[]>();
  const [loadError, setLoadError] = useState<string>();
  const [loadAttempt, setLoadAttempt] = useState(0);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    setLoadError(undefined);
    loadCatalog()
      .then((topics) => active && setCatalog(topics))
      .catch(() => active && setLoadError("The topic catalog could not be loaded."));
    return () => { active = false; };
  }, [loadAttempt]);

  const categories = useMemo(
    () => catalog ? ["All", ...new Set(catalog.map((topic) => topic.category))] : ["All"],
    [catalog],
  );
  const filtered = useMemo(
    () => catalog ? filterCatalogTopics(catalog, state.query, state.category) : [],
    [catalog, state.category, state.query],
  );
  const sorted = useMemo(() => sortCatalogTopics(filtered, state.sort), [filtered, state.sort]);
  const pageData = useMemo(() => paginateCatalogTopics(sorted, state.page), [sorted, state.page]);

  useEffect(() => {
    if (!catalog || pageData.page === state.page) return;
    setSearchParams(toCatalogSearchParams({ ...state, page: pageData.page }), { replace: true });
  }, [catalog, pageData.page, setSearchParams, state]);

  const updateState = (
    patch: Partial<CatalogState>,
    options: { resetPage?: boolean; replace?: boolean } = {},
  ) => {
    const nextState: CatalogState = {
      ...state,
      ...patch,
      page: options.resetPage ? 1 : patch.page ?? state.page,
    };
    setSearchParams(toCatalogSearchParams(nextState), { replace: options.replace ?? false });
  };

  const changePage = (page: number) => {
    updateState({ page });
    window.requestAnimationFrame(() => {
      resultsHeadingRef.current?.focus({ preventScroll: true });
      resultsHeadingRef.current?.scrollIntoView({ block: "start" });
    });
  };

  return (
    <section className="shell section-block">
      <header className="section-heading max-w-3xl">
        <p className="eyebrow">Choose what you need to understand</p>
        <h1>Browse by the question, system, or concept you are working on.</h1>
        <p>You do not need to know the official terminology first. Each guide introduces the words it needs in context, then continues into real code, trade-offs, failures, and production decisions.</p>
      </header>

      {!catalog && !loadError && (
        <div className="empty-state" aria-live="polite"><p>Loading the topic catalog…</p></div>
      )}
      {!catalog && loadError && (
        <div className="empty-state" role="alert">
          <h2>Catalog unavailable</h2>
          <p>{loadError}</p>
          <Button type="button" variant="outline" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Retry</Button>
        </div>
      )}

      {catalog && (
        <>
          <div className="catalog-toolbar">
            <label className="relative block flex-1">
              <span className="sr-only">Filter topics</span>
              <Search className="pointer-events-none absolute inset-inline-start-4 inset-block-start-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={state.query}
                onChange={(event) => updateState({ query: event.target.value }, { resetPage: true, replace: true })}
                placeholder="Try “how websites load”, “git”, “API”, or “database”…"
                className="ps-11"
              />
            </label>
            <label className="grid min-w-44 gap-1 text-sm font-medium">
              <span>Sort topics</span>
              <select
                value={state.sort}
                onChange={(event) => updateState({ sort: event.target.value as CatalogSort }, { resetPage: true })}
                className="min-h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="recommended">Recommended</option>
                <option value="az">A–Z</option>
                <option value="shortest">Shortest first</option>
                <option value="longest">Longest first</option>
                <option value="level">Foundational → Advanced</option>
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-2 pb-1" aria-label="Filter by category">
              <Filter className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateState({ category: item }, { resetPage: true })}
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-pressed={state.category === item}
                >
                  <Badge variant={state.category === item ? "default" : "outline"}>{item}</Badge>
                </button>
              ))}
            </div>
          </div>

          <h2 ref={resultsHeadingRef} tabIndex={-1} className="sr-only">Topic results</h2>
          <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
            {pageData.total === 0
              ? "No matching topics"
              : `Showing ${pageData.start}–${pageData.end} of ${pageData.total} ${pageData.total === 1 ? "topic" : "topics"}`}
          </p>
          {pageData.total > 0 ? (
            <>
              <div className="topic-grid">{pageData.items.map((topic) => <TopicCard topic={topic} key={topic.slug} />)}</div>
              <CatalogPagination page={pageData.page} pageCount={pageData.pageCount} onPageChange={changePage} />
            </>
          ) : (
            <div className="empty-state">
              <h2>No topic matches that filter</h2>
              <p>Try the problem in your own words, remove the category filter, or use the global search for broader related-term matching.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
