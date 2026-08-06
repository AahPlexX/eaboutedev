import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock3, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/use-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { results, isLoading, error } = useSearch(query);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "/" && !isEditableTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
    else setQuery("");
  }, [open]);

  const openTopic = (slug: string) => {
    setOpen(false);
    navigate(`/topics/${slug}`);
  };

  return (
    <>
      <Button variant="outline" className="search-trigger justify-between" onClick={() => setOpen(true)}>
        <span className="flex min-w-0 items-center gap-2"><Search aria-hidden="true" /><span className="search-trigger-label truncate">Search everything</span></span>
        <kbd className="hidden rounded-md border bg-muted px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground sm:inline">⌘ K</kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="global-search-description">
          <div className="border-b border-border p-4 pe-16">
            <DialogTitle>Search the development guide</DialogTitle>
            <DialogDescription id="global-search-description">
              Ask naturally, use abbreviations, or misspell a term. Search understands common development aliases.
            </DialogDescription>
          </div>
          <div className="relative px-4">
            <Search className="pointer-events-none absolute inset-inline-start-7 inset-block-start-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-14 ps-11 text-base"
              placeholder='Try “which database stores relationships?”'
              aria-label="Search topics"
              aria-controls="search-results"
            />
          </div>
          <div id="search-results" className="min-h-44 overflow-y-auto px-4 pb-4" aria-live="polite">
            {!query && <SearchHint />}
            {isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Searching the guide…</p>}
            {error && <p className="py-8 text-center text-sm text-destructive">{error}</p>}
            {query && !isLoading && !error && results.length === 0 && (
              <div className="py-10 text-center">
                <p className="font-semibold">No close match yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Try a broader phrase such as “database,” “API,” or “Git.”</p>
              </div>
            )}
            {results.length > 0 && (
              <ul className="grid gap-2" aria-label="Search results">
                {results.map((result) => (
                  <li key={result.slug}>
                    <button
                      type="button"
                      onClick={() => openTopic(result.slug)}
                      className="group grid min-h-16 w-full grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-transparent p-3 text-start hover:border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <strong className="truncate">{result.title}</strong>
                          <Badge variant="outline">{result.category}</Badge>
                        </span>
                        <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{result.summary}</span>
                        <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock3 className="size-3" aria-hidden="true" /> {result.estimatedMinutes} min · {result.level}
                        </span>
                      </span>
                      <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SearchHint() {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <Sparkles className="mb-2 size-5 text-primary" aria-hidden="true" />
        <p className="font-semibold">Natural phrasing</p>
        <p className="mt-1 text-sm text-muted-foreground">“How does a browser get a website?” maps to the web request lifecycle.</p>
      </div>
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <Search className="mb-2 size-5 text-primary" aria-hidden="true" />
        <p className="font-semibold">Fuzzy matching</p>
        <p className="mt-1 text-sm text-muted-foreground">Abbreviations such as DB and JS, prefixes, and small spelling errors still work.</p>
      </div>
    </div>
  );
}

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (
    target.isContentEditable || target.matches("input, textarea, select, [role='textbox']")
  );
}
