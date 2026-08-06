import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { TopicCard } from "@/components/topics/topic-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { topicCatalog } from "@/generated/topic-catalog";
import { buildSearchQuery } from "@/lib/query-normalization";

export function TopicsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(topicCatalog.map((topic) => topic.category))];

  const filtered = useMemo(() => {
    const terms = buildSearchQuery(query).split(" ").filter(Boolean);
    return topicCatalog.filter((topic) => {
      const categoryMatches = category === "All" || topic.category === category;
      if (!categoryMatches) return false;
      if (terms.length === 0) return true;
      const haystack = topic.searchText.toLocaleLowerCase("en");
      return terms.some((term) => haystack.includes(term));
    });
  }, [category, query]);

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
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by title, alias, or concept…" className="ps-11" />
        </label>
        <div className="flex flex-wrap items-center gap-2 pb-1" aria-label="Filter by category">
          <Filter className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-pressed={category === item}
            >
              <Badge variant={category === item ? "default" : "outline"}>{item}</Badge>
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">{filtered.length} {filtered.length === 1 ? "topic" : "topics"} shown</p>
      {filtered.length > 0 ? (
        <div className="topic-grid">{filtered.map((topic) => <TopicCard topic={topic} key={topic.slug} />)}</div>
      ) : (
        <div className="empty-state">
          <h2>No topic matches that filter</h2>
          <p>Clear the category or use a broader term. Global search also supports fuzzy matching and aliases.</p>
        </div>
      )}
    </section>
  );
}
