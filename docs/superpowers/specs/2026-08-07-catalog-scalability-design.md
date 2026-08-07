# Catalog Scalability Hardening Design

**Date:** 2026-08-07
**Status:** Approved design
**Repository:** `AahPlexX/eaboutedev`
**Authoritative branch:** `main`

## Goal

Harden topic discovery for growth from single-digit topics into the low hundreds without changing the successful one-JSON-file-per-topic content architecture or introducing infrastructure that a static GitHub Pages knowledge library does not yet need.

The completed system must add learner-facing sorting and true pagination while reducing initial JavaScript/data work, moving repeatable search-index construction out of the browser, preserving URL state, and adding measurable regression guards against future bloat.

## Non-goals / YAGNI boundaries

This pass must **not** add:

- a database, CMS, backend API, server-side search, or server-side pagination;
- infinite scrolling;
- list virtualization while only one 24-item page is rendered;
- a Web Worker unless measurements after the prebuilt-index change prove main-thread search restoration is still a problem;
- a service worker or offline application cache;
- a new state-management library;
- speculative downloading of every topic;
- configurable page sizes or a large collection of niche sort modes;
- topic-folder restructuring solely for aesthetics.

The existing `public/content/topics/<slug>.json` model remains authoritative.

## Current scaling strengths to preserve

1. **Independent topic payloads.** `loadTopic(slug)` fetches exactly one JSON document at navigation time. Increasing the topic count does not make one guide carry the content of all other guides.
2. **Single dynamic topic route.** `/topics/:slug` handles every guide without one route declaration per topic.
3. **Static deployment compatibility.** Topic files and generated discovery assets remain plain static files deployable to GitHub Pages.
4. **Deterministic generation and validation.** Source documents remain the single source of truth and derived assets are reproducible in CI.

## Problems this pass solves

### 1. Catalog metadata is compiled into application JavaScript

The generated `src/generated/topic-catalog.ts` is imported by homepage, catalog, topic-related navigation, and other UI. This is harmless at five topics but causes application code/data to grow with every topic even when the user never opens the catalog.

### 2. Catalog interaction is progressive disclosure, not true pagination

The existing `Show more` window limits DOM nodes but does not provide stable pages, shareable page state, browser-history behavior, or deterministic navigation through a large collection.

### 3. No sorting contract exists

As the library grows, learners need predictable ordering beyond the source-file/generated order.

### 4. Search documents are downloaded and indexed in the browser

Global search currently downloads source-like search documents and calls `MiniSearch.addAll()` in the user's browser. It also carries duplicated searchable text. The same deterministic indexing work can happen once at build time instead of once per visitor/session.

### 5. Heavy routes/search implementation can enter the initial dependency graph

Catalog and topic pages and search implementation should be withheld until users navigate to or use those features.

### 6. The current `5000` topic ceiling is not a performance guarantee

A numerical validator ceiling does not prove good browser performance. We need tests and asset-size budgets that fail when discovery architecture regresses.

## Data architecture

### Topic source documents

No structural migration. Continue to author one topic per file:

`public/content/topics/<slug>.json`

These files remain independently fetched by the topic loader.

### Generated catalog asset

Replace the full generated TypeScript catalog as the primary full-catalog source with a static JSON asset:

`public/catalog/topic-catalog.json`

Each entry remains lean and includes only fields required for catalog filtering, sorting, cards, related-topic summaries, and route lookup:

- `slug`
- `title`
- `eyebrow`
- `summary`
- `category`
- `level`
- `estimatedMinutes`
- `icon`
- `accent`
- `aliases`
- `keywords`
- deterministic `order` for the intentional Recommended sequence

The complete catalog is fetched only by code that needs the complete catalog.

### Bounded bootstrap/featured metadata

The homepage needs at most six featured topics and a total count. It must not import the whole catalog merely to render six cards.

Generate a bounded bootstrap module or asset containing:

- `topicCount`
- first/recommended six catalog entries

Its size is bounded regardless of total library size.

### Search index

At generation time:

1. read validated topic sources;
2. construct minimal searchable documents from title, summary, category, aliases, keywords, section titles, and glossary language;
3. create/configure MiniSearch with the existing field weights and identifiers;
4. call `addAll()` in Node/build generation, not in the browser;
5. serialize the built MiniSearch index using its supported JSON serialization;
6. publish the serialized index as a static search asset;
7. publish only the stored fields required to render results.

Do not emit the current redundant source-like `searchText` plus duplicated fields unless a search-quality test proves a specific field is necessary.

The browser loads MiniSearch and restores the serialized index only on first actual search use. Prefer `loadJSONAsync()` to avoid one long synchronous restoration step.

## Catalog loading and caching

Create a small catalog loader with module-level promise/result reuse:

- first request starts one fetch;
- concurrent callers reuse the same in-flight promise;
- successful parsed catalog is reused for the browser session;
- failed requests clear the cached promise so a later navigation can retry;
- an optional `AbortSignal` may prevent a component from applying stale results, but shared cache state must not be cancelled by one consumer if other consumers still need it.

Use the same principle for topic documents where practical: deduplicate concurrent/resolved requests by slug while retaining failure retry behavior.

Do not implement a persistent IndexedDB/localStorage cache in this pass.

## Route lazy loading

Keep route definitions small and available immediately, but lazy-load route implementations for heavier pages.

At minimum:

- catalog/topics page implementation is lazy;
- individual topic-page implementation is lazy;
- homepage remains eager because it is the entry route and uses bounded featured metadata.

Use React Router's current route lazy-loading support where it fits the existing `createHashRouter` architecture. Do not add a routing dependency.

Loading UI must remain accessible and not cause content overlap or layout clipping.

## Global search lazy loading

The global search trigger/dialog may remain available in the shell, but the MiniSearch implementation and serialized search index must not be loaded merely because the header renders.

Behavior:

1. empty search dialog opens instantly with instructional content;
2. typing a non-empty query triggers dynamic import of the search implementation;
3. the implementation fetches/restores the serialized index once;
4. subsequent queries reuse the loaded index;
5. the existing short debounce prevents doing work on every keypress;
6. stale query results must not overwrite newer query results.

Do not prefetch the complete search index on initial page load.

## Sorting design

The catalog provides one visible sorting control with five options:

1. **Recommended** — deterministic editorial/generated `order`.
2. **A–Z** — locale-stable title ascending.
3. **Shortest first** — `estimatedMinutes` ascending, then Recommended order/title for stable ties.
4. **Longest first** — `estimatedMinutes` descending, then Recommended order/title for stable ties.
5. **Foundational → Advanced** — level rank (`Foundational`, `Intermediate`, `Advanced`), then Recommended order/title.

Sorting must be stable and deterministic.

Do not expose sorting by icon, slug, source count, last-modified date, or other implementation metadata.

## Pagination design

### Page size

Fixed `24` topics per page.

The page size is intentionally not user-configurable in this pass.

### Processing order

Always process catalog results in this order:

1. load catalog;
2. filter by search query/category;
3. sort filtered results;
4. calculate valid page count;
5. normalize/clamp requested page;
6. slice exactly the current page's 24 entries;
7. render only those entries.

### URL state

Catalog state is represented in hash-route search parameters through React Router rather than hidden component-only state.

Canonical parameters:

- `q` — text filter, omitted when empty;
- `category` — omitted when `All`;
- `sort` — omitted for default `recommended`;
- `page` — omitted for page 1.

Example conceptual route:

`#/topics?category=Frontend&sort=az&page=3`

Use stable short sort identifiers such as `recommended`, `az`, `shortest`, `longest`, and `level`.

Changing query/category/sort resets page to 1 because the result set/order changes.

Invalid, zero, negative, non-integer, or overlarge page values normalize to the nearest valid page and should not crash or render an empty false state.

### Pagination UI

Provide:

- Previous;
- numbered page controls around the current page;
- Next;
- current-page semantics (`aria-current="page"` where applicable);
- clear accessible labels;
- disabled/unavailable boundary behavior;
- visible result range such as `Showing 25–48 of 137 topics`.

Do not render hundreds of numbered buttons. Use a compact range with first/last plus nearby pages and an ellipsis when page counts are large.

Page changes should move focus/scroll predictably to the catalog results heading or top of the results region without stealing focus during unrelated filtering input.

## Filtering behavior

Retain the current lightweight catalog filter rather than invoking the heavy global fuzzy search engine for every catalog keystroke.

Filtering remains based on lean metadata fields (title, eyebrow, summary, category, level, aliases, keywords).

The filter, category, sort, and pagination functions must be pure and independently testable.

## Related-topic lookup

Topic pages currently use the imported full catalog to resolve `topic.related` slugs.

After removing the full catalog from the application bundle, related-topic resolution should use the shared lazy catalog loader. Because a topic page normally lists only a few related slugs, this is acceptable; the catalog is a lean metadata asset and is fetched only once per session.

If measurement later shows this catalog fetch is undesirable on topic pages, a future generator may embed bounded related-card metadata per topic, but that is explicitly out of scope now.

## Request/error behavior

### Catalog

- Show an accessible loading state while the catalog asset is fetched.
- Show a clear retry-capable error state if the catalog cannot be loaded.
- Never interpret a network failure as an empty catalog.

### Topic

- Preserve `404 → missing topic` distinction.
- Preserve other response failures as load errors.
- Cache/deduplicate only successful loads; allow retry after failure.

### Search

- Empty query never loads the search engine/index.
- Loading state begins only when search work is actually needed.
- Search-load failure shows the existing recoverable message and allows a later query/session retry.
- Obsolete query work must not replace newer results.

## Performance guardrails

Add deterministic tests/scripts that guard architecture rather than making unverifiable speed claims.

### Synthetic catalog behavior

Use generated in-memory fixtures for at least:

- 100 topics;
- 500 topics;
- 1,000 topics where practical for pure-function tests.

Verify:

- filtering remains correct;
- sorting is stable;
- page calculations are correct;
- only 24 entries are returned per ordinary page;
- invalid/overlarge pages normalize correctly;
- filter/sort changes reset page behavior through URL-state helpers.

These are correctness/scale-shape tests, not fake performance benchmarks.

### Generated asset size budgets

Add a simple build-time/check script for deterministic upper bounds on generated discovery assets. Budgets should be generous enough for legitimate growth but strict enough to catch accidental duplication or embedding complete topic bodies.

At the current small topic count, derive a reasonable per-topic envelope and fixed overhead, then express limits as a function of topic count rather than one hard byte number that becomes obsolete.

At minimum guard:

- full catalog JSON bytes per topic;
- serialized search-index bytes per topic;
- bounded homepage bootstrap asset/module size.

Do not fail CI on compressed-network-byte estimates that the build cannot deterministically reproduce.

### Initial application bundle regression

Add a source/build regression ensuring the full catalog and MiniSearch/search implementation are no longer eager imports of the initial homepage/shell path. If feasible within the current build tooling without adding a dependency, inspect Vite's emitted asset manifest/chunks or source import graph in tests.

Avoid adding a bundle-analysis package solely for this gate.

## Generated artifacts

Generation should produce and `--check` verify at least:

- `public/catalog/topic-catalog.json`;
- bounded homepage/bootstrap metadata;
- serialized MiniSearch index asset;
- `docs/topic-registry.json`.

The previous full generated TypeScript catalog and source-like search-index artifact should be removed only after every consumer has migrated and tests prove no stale reference remains.

## Accessibility and UX requirements

- Sorting control must have a visible label.
- Pagination controls must be keyboard accessible and expose current-page state.
- Loading/error states must remain perceivable to assistive technology.
- URL state must not cause focus to jump unexpectedly while typing.
- Results should preserve existing responsive card layout and 320 CSS-pixel reflow behavior.
- No pagination meaning may depend only on color.
- Reduced-motion behavior remains honored.

## Testing strategy

Add focused regression coverage for:

1. catalog sorting options and tie behavior;
2. pagination math and compact page-number model;
3. filtering → sorting → pagination order;
4. URL search-parameter parsing/serialization and invalid-state normalization;
5. 100/500/1,000-topic pure-function fixtures;
6. catalog loader fetch deduplication and retry after failure where practical;
7. topic-loader deduplication without caching failed requests;
8. search implementation being dynamically imported rather than eager;
9. serialized MiniSearch restoration returning equivalent expected results for representative queries;
10. generated artifact freshness and discovery-size budgets;
11. full existing `pnpm check` regression suite.

## Migration sequence

1. Add pure catalog sorting/pagination/URL-state helpers and tests.
2. Generate static full catalog plus bounded homepage bootstrap metadata.
3. Add shared lazy catalog loader and migrate homepage/catalog/topic-related consumers.
4. Add URL-addressable sorting and pagination UI.
5. Convert heavy routes to route-level lazy loading.
6. Move MiniSearch construction to generation and publish serialized index.
7. Dynamically import search implementation and asynchronously restore the index on demand.
8. Remove obsolete generated full-catalog/search-source artifacts and stale imports.
9. Add discovery asset-size/scaling guards.
10. Regenerate artifacts and run full validation/build.

## Completion criteria

This scalability pass is complete only when all of the following are true:

- catalog supports the five approved sort modes;
- catalog uses fixed 24-item true pagination;
- query/category/sort/page state survives refresh/back/forward through URL parameters;
- only the active catalog page's cards are rendered;
- complete catalog metadata is no longer part of the eager application bundle;
- homepage uses bounded metadata independent of total topic count;
- heavy topic/catalog routes are lazy-loaded;
- MiniSearch implementation/index are not loaded until a non-empty search requires them;
- search index is built during generation and restored from serialized output in the browser;
- redundant source-like search payload is removed;
- successful catalog/topic loads are deduplicated in-session without permanently caching failures;
- scale-shape tests cover at least hundreds of topics;
- deterministic generated-discovery size budgets exist;
- no YAGNI-excluded infrastructure was added;
- `pnpm check` passes with generated artifacts current;
- append-only project records are updated for this turn.
