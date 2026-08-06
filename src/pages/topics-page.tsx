import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { TopicCard } from "@/components/topics/topic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { topicCatalog } from "@/generated/topic-catalog";
import {
  CATALOG_WINDOW_SIZE,
  filterCatalogTopics,
  getCatalogWindow,
  getNextVisibleCount,
} from "@/lib/catalog";

export function TopicsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(CATALOG_WINDOW_SIZE);
  const categories = ["All", ...new Set(topicCatalog.map((topic) => topic.category))];

  const filtered = useMemo(
    () => filterCatalogTopics(topicCatalog, query, category),
    [category, query],
  );
  const visibleTopics = getCatalogWindow(filtered, visibleCount);
  const remainingCount = filtered.length - visibleTopics.length;

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setVisibleCount(CATALOG_WINDOW_SIZE);
  };

  const updateCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    setVisibleCount(CATALOG_WINDOW_SIZE);
  };

  return (
    <section className="shell section-block">
      <header className="section-heading max-w-3xl">
        <p className="eyebrow">Topic catalog</p>
        <h1>Browse the development system by the question you need answered.</h1>
        <p>The catalog count is generated from source content. Add a topic file and the library, search index, and registry update together.</p>
      </header>

      <div className="catalog-toolbar">
        <label className="relative block flex-1">
          <span className="sr-only">Filter topics</span>
          <Search className="pointer-events-none absolute inset-inline-start-4 inset-block-start-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Filter by title, alias, or concept…" className="ps-11" />
        </label>
        <div className="flex flex-wrap items-center gap-2 pb-1" aria-label="Filter by category">
          <Filter className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => updateCategory(item)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-pressed={category === item}
            >
              <Badge variant={category === item ? "default" : "outline"}>{item}</Badge>
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        Showing {visibleTopics.length} of {filtered.length} {filtered.length === 1 ? "topic" : "topics"}
      </p>
      {filtered.length > 0 ? (
        <>
          <div className="topic-grid">{visibleTopics.map((topic) => <TopicCard topic={topic} key={topic.slug} />)}</div>
          {remainingCount > 0 && (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleCount((current) => getNextVisibleCount(current, filtered.length))}
              >
                Show {Math.min(CATALOG_WINDOW_SIZE, remainingCount)} more
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h2>No topic matches that filter</h2>
          <p>Clear the category or use a broader term. Global search also supports fuzzy matching and aliases.</p>
        </div>
      )}
    </section>
  );
}
