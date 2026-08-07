# Catalog Scalability Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sortable, URL-addressable 24-item pagination while removing full-catalog and browser-side search-index construction from the eager application path, preserving the static GitHub Pages architecture.

**Architecture:** Keep one authoritative JSON document per topic. Generate a lean full catalog JSON, a bounded homepage bootstrap module, and a serialized MiniSearch index at build time. Lazy-load the catalog, heavy routes, and search implementation; keep filter/sort/page logic pure, URL-driven, deterministic, and covered by scale-shape tests.

**Tech Stack:** React 19.2.8, React Router DOM 7.18.2, TypeScript 7.0.2, Vite 8.2.0, MiniSearch 7.2.0, Node 26 test APIs/types, pnpm 11.20.0, Oxlint 1.77.0, GitHub Pages.

## Global Constraints

- Authoritative branch is `main`; do not create or retain divergent implementation branches.
- Keep `public/content/topics/<slug>.json` as the authoritative one-file-per-topic model.
- Fixed catalog page size is exactly `24`.
- Sort modes are exactly `recommended`, `az`, `shortest`, `longest`, and `level`.
- URL parameters are `q`, `category`, `sort`, and `page`; omit defaults/empty values.
- Changing query/category/sort resets page to 1.
- Do not add a database, CMS, backend API, server-side search/pagination, infinite scroll, virtualization, Web Worker, service worker, state library, speculative all-topic prefetch, or configurable page size.
- Homepage bootstrap metadata must remain bounded to six featured topics plus total topic count.
- Empty global search must not load MiniSearch or the serialized index.
- Generated artifacts must remain deterministic and `--check` verifiable.
- `changelog.md`, `todo.md`, and `codemap.json` remain append-only and receive Turn 7 implementation records.

---

## File Structure

### Create

- `src/lib/catalog-state.ts` — URL parameter parsing/serialization and default normalization.
- `src/lib/catalog-loader.ts` — shared full-catalog lazy fetch, in-flight/result reuse, retry after failure.
- `src/components/topics/catalog-pagination.tsx` — compact accessible Previous/page/Next pagination surface.
- `src/generated/topic-bootstrap.ts` — generated bounded homepage metadata; replaced on every generation run.
- `public/catalog/topic-catalog.json` — generated lean full catalog asset.
- `public/search/topic-search.minisearch.json` — generated serialized MiniSearch index.
- `scripts/validate-discovery-assets.mjs` — deterministic per-topic/generated-bootstrap size budgets and stale eager-import guards.
- `tests/catalog-state.test.ts` — URL-state behavior.
- `tests/catalog-loader.test.ts` — dedupe/retry loader behavior.
- `tests/discovery-assets.test.ts` — lazy-import and generated-asset contract.

### Modify

- `src/types/content.ts` — add deterministic catalog `order`; remove obsolete browser source-search document interface after migration.
- `src/lib/catalog.ts` — replace progressive-window functions with filter, stable sort, page math, compact page model.
- `tests/catalog.test.ts` — scale fixtures at 100/500/1,000 and sorting/pagination tests.
- `scripts/content-utils.mjs` — assign catalog order and create minimal MiniSearch source documents.
- `scripts/generate-content-artifacts.mjs` — emit catalog JSON, bootstrap module, serialized search index, and registry.
- `src/pages/home-page.tsx` — consume bounded bootstrap metadata only.
- `src/pages/topics-page.tsx` — lazy catalog load, URL-driven filter/sort/page, pagination UI, loading/error/retry states.
- `src/pages/topic-page.tsx` — resolve related cards through shared lazy catalog loader.
- `src/lib/topic-loader.ts` — per-slug successful-load/in-flight deduplication while preserving retry after failure and 404 semantics.
- `src/app.tsx` — route-level lazy imports for catalog/topic implementations.
- `src/hooks/use-search.ts` — dynamically import search implementation only for non-empty debounced query.
- `src/lib/search.ts` — restore serialized MiniSearch index asynchronously instead of browser `addAll()`.
- `src/components/search/global-search.tsx` — preserve instant empty dialog and existing loading/error semantics.
- `package.json` — add discovery-asset validation to the existing check/build chain without adding dependencies.
- `docs/topic-registry.json` — regenerated artifact.
- `changelog.md`, `todo.md`, `codemap.json` — append Turn 7 execution/verification records.

### Delete after migration is green

- `src/generated/topic-catalog.ts`
- `public/search/topic-search-index.json`

---

### Task 1: Pure sorting, pagination, and URL-state contracts

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/lib/catalog.ts`
- Create: `src/lib/catalog-state.ts`
- Modify: `tests/catalog.test.ts`
- Create: `tests/catalog-state.test.ts`

**Interfaces:**
- Produces: `CatalogSort = "recommended" | "az" | "shortest" | "longest" | "level"`.
- Produces: `CATALOG_PAGE_SIZE = 24`.
- Produces: `sortCatalogTopics(topics, sort): TopicCatalogEntry[]`.
- Produces: `paginateCatalogTopics(topics, requestedPage): CatalogPage` where `CatalogPage` contains `page`, `pageCount`, `start`, `end`, `total`, `items`.
- Produces: `getPaginationItems(page, pageCount): Array<number | "ellipsis">`.
- Produces: `parseCatalogState(searchParams): CatalogState` and `toCatalogSearchParams(state): URLSearchParams`.

- [ ] **Step 1: Extend the lean catalog type with deterministic order**

Add to `TopicCatalogEntry`:

```ts
order: number;
```

Use `order` only for editorial/default ordering and stable tie-breaks.

- [ ] **Step 2: Replace progressive-window tests with failing sort/page tests**

Use fixture generation that assigns `order: index`. Assert:

```ts
assert.equal(CATALOG_PAGE_SIZE, 24);
assert.deepEqual(sortCatalogTopics(topics, "az").slice(0, 2).map(({ title }) => title), expectedTitles);
assert.equal(paginateCatalogTopics(topics, 2).items.length, 24);
assert.equal(paginateCatalogTopics(topics, 999).page, Math.ceil(topics.length / 24));
```

Add separate assertions for shortest/longest and `Foundational < Intermediate < Advanced`, with `order` as the first stable tie-break.

- [ ] **Step 3: Add scale-shape fixture assertions**

For 100, 500, and 1,000 generated entries, assert every ordinary page contains at most 24 items, the final page count is `Math.ceil(total / 24)`, and filtering happens before sorting/pagination.

- [ ] **Step 4: Run catalog tests and confirm red state**

Run:

```bash
pnpm test -- tests/catalog.test.ts tests/catalog-state.test.ts
```

Expected: FAIL because the new helpers/types do not exist yet.

- [ ] **Step 5: Implement pure catalog helpers**

`src/lib/catalog.ts` must expose:

```ts
export const CATALOG_PAGE_SIZE = 24;
export type CatalogSort = "recommended" | "az" | "shortest" | "longest" | "level";

export function filterCatalogTopics(topics: TopicCatalogEntry[], query: string, category: string): TopicCatalogEntry[];
export function sortCatalogTopics(topics: TopicCatalogEntry[], sort: CatalogSort): TopicCatalogEntry[];
export function paginateCatalogTopics(topics: TopicCatalogEntry[], requestedPage: number): CatalogPage;
export function getPaginationItems(page: number, pageCount: number): Array<number | "ellipsis">;
```

Do not mutate the input array; sort a copy.

- [ ] **Step 6: Implement catalog URL state**

`src/lib/catalog-state.ts`:

```ts
export interface CatalogState {
  query: string;
  category: string;
  sort: CatalogSort;
  page: number;
}

export const DEFAULT_CATALOG_STATE: CatalogState = {
  query: "",
  category: "All",
  sort: "recommended",
  page: 1,
};
```

`parseCatalogState()` accepts invalid input safely; `toCatalogSearchParams()` omits defaults. Non-integer/zero/negative page parses as 1. Overlarge page is clamped later when filtered total is known.

- [ ] **Step 7: Run focused tests green**

```bash
pnpm test -- tests/catalog.test.ts tests/catalog-state.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/types/content.ts src/lib/catalog.ts src/lib/catalog-state.ts tests/catalog.test.ts tests/catalog-state.test.ts
git commit -m "feat: add catalog sorting and pagination contracts"
```

---

### Task 2: Generate scalable discovery artifacts

**Files:**
- Modify: `scripts/content-utils.mjs`
- Modify: `scripts/generate-content-artifacts.mjs`
- Create/generated: `public/catalog/topic-catalog.json`
- Create/generated: `src/generated/topic-bootstrap.ts`
- Create/generated: `public/search/topic-search.minisearch.json`
- Modify/generated: `docs/topic-registry.json`
- Test: `tests/discovery-assets.test.ts`

**Interfaces:**
- Consumes: `TopicCatalogEntry.order`.
- Produces: catalog JSON array sorted in Recommended order.
- Produces: `topicBootstrap = { topicCount, featuredTopics }` with exactly `min(6, topicCount)` entries.
- Produces: serialized MiniSearch JSON compatible with runtime search configuration.

- [ ] **Step 1: Write failing generation-contract tests**

Read generation source and generated outputs. Assert that generation names include:

```txt
public/catalog/topic-catalog.json
src/generated/topic-bootstrap.ts
public/search/topic-search.minisearch.json
```

Assert bootstrap contains six or fewer catalog entries and no full topic `sections`/`glossary` bodies.

- [ ] **Step 2: Run discovery test red**

```bash
pnpm test -- tests/discovery-assets.test.ts
```

Expected: FAIL because scalable artifacts are not generated yet.

- [ ] **Step 3: Add deterministic catalog order at projection time**

Change `createCatalogEntry(topic, order)` to include `order`, with generation passing the zero-based topic sequence consistently.

- [ ] **Step 4: Minimize source search documents**

Keep only fields searched by MiniSearch plus result store fields; remove the concatenated duplicate `searchText`. Search fields remain title, summary, category, aliases, keywords, section titles, and glossary language via one dedicated field such as `glossaryText` if needed by the MiniSearch schema.

- [ ] **Step 5: Build MiniSearch in Node generation**

Import MiniSearch in `generate-content-artifacts.mjs`, instantiate it with the same runtime field weights/id/store configuration, call `addAll(searchDocuments)`, and serialize with `JSON.stringify(search.toJSON())`.

- [ ] **Step 6: Emit all three new generated assets plus registry**

The bootstrap source should be equivalent to:

```ts
import type { TopicCatalogEntry } from "@/types/content";

export const topicBootstrap: {
  topicCount: number;
  featuredTopics: TopicCatalogEntry[];
} = { ... };
```

- [ ] **Step 7: Run generation and focused tests**

```bash
pnpm run generate
pnpm run check:generated
pnpm test -- tests/discovery-assets.test.ts
```

Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add scripts/content-utils.mjs scripts/generate-content-artifacts.mjs public/catalog/topic-catalog.json src/generated/topic-bootstrap.ts public/search/topic-search.minisearch.json docs/topic-registry.json tests/discovery-assets.test.ts
git commit -m "perf: generate scalable discovery assets"
```

---

### Task 3: Lazy catalog/topic loaders with deduplication and retry

**Files:**
- Create: `src/lib/catalog-loader.ts`
- Modify: `src/lib/topic-loader.ts`
- Create: `tests/catalog-loader.test.ts`
- Create or modify: `tests/topic-loader.test.ts`

**Interfaces:**
- Produces: `loadCatalog(): Promise<TopicCatalogEntry[]>`.
- Produces: existing `loadTopic(slug): Promise<TopicDocument | undefined>` with successful/in-flight per-slug cache semantics unchanged to callers.

- [ ] **Step 1: Write loader red tests**

Stub `globalThis.fetch` and verify:

1. two concurrent `loadCatalog()` calls perform one fetch;
2. two calls after success reuse the parsed result;
3. a failed catalog fetch is not permanently cached and a later call retries;
4. two concurrent `loadTopic("x")` calls perform one fetch;
5. successful topic reads are reused;
6. 404 still resolves `undefined`;
7. non-404 failure rejects and is retryable.

- [ ] **Step 2: Run focused tests red**

```bash
pnpm test -- tests/catalog-loader.test.ts tests/topic-loader.test.ts
```

- [ ] **Step 3: Implement catalog loader**

Use one module-level promise, resetting it in `.catch()` before rethrowing. Freeze or treat returned generated data as immutable; do not write persistent browser storage.

- [ ] **Step 4: Add per-slug topic promise cache**

Use `Map<string, Promise<TopicDocument | undefined>>`; delete an entry on rejected fetch, but allow 404 `undefined` to remain cacheable for the current session.

- [ ] **Step 5: Run focused tests green**

```bash
pnpm test -- tests/catalog-loader.test.ts tests/topic-loader.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/catalog-loader.ts src/lib/topic-loader.ts tests/catalog-loader.test.ts tests/topic-loader.test.ts
git commit -m "perf: deduplicate lazy content loads"
```

---

### Task 4: URL-addressable sorting and true pagination UI

**Files:**
- Create: `src/components/topics/catalog-pagination.tsx`
- Modify: `src/pages/topics-page.tsx`
- Modify: `src/learning.css` or `src/index.css` only where existing utility classes are insufficient
- Test: `tests/learning-copy.test.ts` plus pure tests from Tasks 1–3

**Interfaces:**
- Consumes: `loadCatalog`, `parseCatalogState`, `toCatalogSearchParams`, `filterCatalogTopics`, `sortCatalogTopics`, `paginateCatalogTopics`, `getPaginationItems`.
- Produces: accessible catalog with sort control and pagination driven entirely by URL state.

- [ ] **Step 1: Add failing source-contract assertions**

Assert TopicsPage no longer imports `@/generated/topic-catalog`, uses `useSearchParams`, exposes a visible Sort label, and does not contain `Show more`.

- [ ] **Step 2: Implement async catalog page state**

On mount call `loadCatalog()`. Render distinct loading/error/ready states; error state includes a Retry button that calls the loader again.

- [ ] **Step 3: Bind filter/category/sort/page to URL parameters**

Use `useSearchParams()`. When query/category/sort changes, write page 1 by omitting `page`. When pagination changes, preserve q/category/sort and set/omit page as appropriate.

- [ ] **Step 4: Add sort select**

Visible label `Sort topics`. Options and values exactly:

```txt
Recommended / recommended
A–Z / az
Shortest first / shortest
Longest first / longest
Foundational → Advanced / level
```

- [ ] **Step 5: Add pagination component**

Render Previous, compact numbered items/ellipses, Next. Current numbered link/button uses `aria-current="page"`. Boundary controls are unavailable without misleading click behavior.

- [ ] **Step 6: Add result range**

For nonempty results show `Showing {start}–{end} of {total} topics` using the paginated result fields.

- [ ] **Step 7: Normalize overlarge URL page**

After filtered/sorted count is known, if requested page differs from clamped `CatalogPage.page`, replace the URL with the normalized page rather than rendering a false empty state.

- [ ] **Step 8: Verify responsive/accessibility behavior from source and tests**

Pagination wraps at narrow widths; sort label remains visible; no horizontal mandatory scrolling is introduced.

- [ ] **Step 9: Run focused tests**

```bash
pnpm test -- tests/catalog.test.ts tests/catalog-state.test.ts tests/catalog-loader.test.ts tests/learning-copy.test.ts
```

- [ ] **Step 10: Commit**

```bash
git add src/components/topics/catalog-pagination.tsx src/pages/topics-page.tsx src/learning.css src/index.css tests/learning-copy.test.ts
git commit -m "feat: add sortable paginated topic catalog"
```

---

### Task 5: Remove full catalog from eager/home/topic imports

**Files:**
- Modify: `src/pages/home-page.tsx`
- Modify: `src/pages/topic-page.tsx`
- Test: `tests/discovery-assets.test.ts`

**Interfaces:**
- Home consumes only `topicBootstrap`.
- Topic page consumes `loadCatalog()` only after the topic itself is ready and related metadata is needed.

- [ ] **Step 1: Add failing eager-import assertions**

Assert HomePage and TopicPage contain no `@/generated/topic-catalog` import; HomePage imports `@/generated/topic-bootstrap`.

- [ ] **Step 2: Migrate homepage**

Use:

```ts
const { featuredTopics: featured, topicCount } = topicBootstrap;
```

Keep current six-card maximum and `Browse all {topicCount} topics` copy.

- [ ] **Step 3: Migrate related-topic lookup**

After a topic is ready, load the shared lean catalog and map only `topic.related` slugs. Failure to load related metadata must not replace a successfully loaded guide with a guide-level error; omit related cards or show a local non-blocking related-content state.

- [ ] **Step 4: Run focused tests/typecheck**

```bash
pnpm test -- tests/discovery-assets.test.ts
pnpm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/home-page.tsx src/pages/topic-page.tsx tests/discovery-assets.test.ts
git commit -m "perf: remove full catalog from eager pages"
```

---

### Task 6: Route-level code splitting

**Files:**
- Modify: `src/app.tsx`
- Test: `tests/discovery-assets.test.ts`

**Interfaces:**
- Homepage remains eager.
- Topics and individual Topic implementations are loaded through React Router route `lazy` functions.

- [ ] **Step 1: Add failing app source assertion**

Assert `src/app.tsx` no longer statically imports `TopicsPage` or `TopicPage` and route objects use `lazy` for both paths.

- [ ] **Step 2: Convert routes**

Use React Router lazy route modules such as:

```ts
{
  path: "topics",
  lazy: async () => {
    const { TopicsPage } = await import("@/pages/topics-page");
    return { Component: TopicsPage };
  },
}
```

Apply same pattern to `topics/:slug`.

- [ ] **Step 3: Run test/typecheck/build**

```bash
pnpm test -- tests/discovery-assets.test.ts
pnpm run typecheck
pnpm run build
```

Verify Vite emits separate asynchronous page chunks rather than one eager page implementation chunk.

- [ ] **Step 4: Commit**

```bash
git add src/app.tsx tests/discovery-assets.test.ts
git commit -m "perf: lazy load heavy topic routes"
```

---

### Task 7: Lazy search code and restore prebuilt MiniSearch index

**Files:**
- Modify: `src/lib/search.ts`
- Modify: `src/hooks/use-search.ts`
- Modify if necessary: `src/components/search/global-search.tsx`
- Modify: `src/types/content.ts`
- Modify/add: `tests/search.test.ts`
- Modify: `tests/discovery-assets.test.ts`

**Interfaces:**
- `searchTopics(query, limit = 8)` public behavior remains unchanged.
- `useSearch` dynamically imports `@/lib/search` only after a non-empty debounced query.
- Search runtime loads `public/search/topic-search.minisearch.json` once and restores with `MiniSearch.loadJSONAsync()`.

- [ ] **Step 1: Add failing lazy-search source test**

Assert `use-search.ts` has no static `import { searchTopics } from "@/lib/search"`; assert it contains dynamic `import("@/lib/search")` inside non-empty query execution.

- [ ] **Step 2: Add search-equivalence test**

Run generation, restore the serialized index with the same MiniSearch options, and assert representative existing queries still resolve expected topics, including aliases/fuzzy behavior already covered by the suite.

- [ ] **Step 3: Replace runtime `addAll()`**

`src/lib/search.ts` fetches the serialized JSON text and calls:

```ts
MiniSearch.loadJSONAsync<TopicSearchStoredFields>(serialized, miniSearchOptions)
```

Cache the promise; reset it after failure so later searches can retry.

- [ ] **Step 4: Dynamically import search from hook**

Only after the 120 ms debounce and non-empty query call:

```ts
const { searchTopics } = await import("@/lib/search");
```

Retain stale-result protection via the existing abort/active logic.

- [ ] **Step 5: Preserve instant empty dialog**

Opening GlobalSearch without typing must render SearchHint and must not call search loader/index fetch.

- [ ] **Step 6: Remove obsolete `TopicSearchDocument` source-payload type**

Replace it with only the stored/result shape required at runtime.

- [ ] **Step 7: Run search tests/typecheck/build**

```bash
pnpm test -- tests/search.test.ts tests/discovery-assets.test.ts
pnpm run typecheck
pnpm run build
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/search.ts src/hooks/use-search.ts src/components/search/global-search.tsx src/types/content.ts tests/search.test.ts tests/discovery-assets.test.ts
git commit -m "perf: restore search index on demand"
```

---

### Task 8: Performance guardrails and remove obsolete artifacts

**Files:**
- Create: `scripts/validate-discovery-assets.mjs`
- Modify: `package.json`
- Modify: `tests/discovery-assets.test.ts`
- Delete: `src/generated/topic-catalog.ts`
- Delete: `public/search/topic-search-index.json`
- Modify: `scripts/generate-content-artifacts.mjs` so obsolete outputs are not expected

**Interfaces:**
- Produces script exit code 0 when generated discovery data stays within deterministic budgets and eager-import rules.

- [ ] **Step 1: Define deterministic budgets**

Use uncompressed UTF-8 bytes and topic count from registry/catalog. Suggested initial formulas:

```js
catalogLimit = 4_096 + topicCount * 1_500;
searchLimit = 16_384 + topicCount * 8_000;
bootstrapLimit = 32_768;
```

These are intentionally generous and catch accidental complete-body/duplicate embedding rather than micro-optimize legitimate prose metadata.

- [ ] **Step 2: Validate eager source boundaries**

The script fails if HomePage/App eagerly reference full catalog/search implementation or if `src/generated/topic-catalog.ts` / old source-like search artifact still exists after migration.

- [ ] **Step 3: Add package script**

Add:

```json
"validate:discovery": "node scripts/validate-discovery-assets.mjs"
```

Include it in `check` and/or build verification after generation, before Vite build.

- [ ] **Step 4: Delete obsolete artifacts only after all consumers are migrated**

Remove `src/generated/topic-catalog.ts` and `public/search/topic-search-index.json`.

- [ ] **Step 5: Run stale-reference search**

```bash
grep -R "generated/topic-catalog\|topic-search-index.json" src scripts tests package.json || true
```

Expected: no live application reference.

- [ ] **Step 6: Run guard and generated checks**

```bash
pnpm run generate
pnpm run validate:discovery
pnpm run check:generated
pnpm test -- tests/discovery-assets.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add -A scripts package.json src/generated public/catalog public/search tests/discovery-assets.test.ts
git commit -m "test: enforce discovery performance budgets"
```

---

### Task 9: Full validation and append-only Turn 7 records

**Files:**
- Modify: `changelog.md`
- Modify: `todo.md`
- Modify: `codemap.json`
- Generated verification files as needed

**Interfaces:**
- Produces a fully verified `main` head and explicit record of what was and was not added.

- [ ] **Step 1: Run complete project gate**

```bash
pnpm check
```

Expected: generation, content validation, exact-version validation, discovery-budget validation, generated freshness, all Node tests, TypeScript, Oxlint with denied warnings, and Vite production build all PASS.

- [ ] **Step 2: Inspect production output**

Confirm homepage/main chunk does not embed all catalog metadata and that catalog/topic route chunks plus search implementation are asynchronous. Record actual emitted asset names/sizes in the changelog only if directly observed from the build output.

- [ ] **Step 3: Append Turn 7 changelog**

Record sorting, pagination, URL state, lazy catalog/topic routes, prebuilt/lazy search index, loader dedupe, size budgets, obsolete artifact removal, and exact verification results. Do not rewrite earlier turns.

- [ ] **Step 4: Append Turn 7 todo**

Mark implementation items complete only if `pnpm check` passed. Keep independent live GitHub Pages deployment/visual verification as a separate release gate if not observed.

- [ ] **Step 5: Append Turn 7 codemap entry**

Map every newly created/changed scalability boundary and generated asset. Preserve valid JSON and all prior entries.

- [ ] **Step 6: Commit records**

```bash
git add changelog.md todo.md codemap.json
git commit -m "docs: record catalog scalability hardening"
```

- [ ] **Step 7: Verify authoritative branch**

Confirm only `main` remains authoritative and latest head includes all preceding commits.

- [ ] **Step 8: Verify Pages workflow/status if the connector exposes the main-push run**

Do not claim the public deployment is updated unless the deployment workflow and endpoint are independently verified.
