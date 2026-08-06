# Everything About Development Initial Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a searchable, visual, five-topic web-development SSOT from an empty repository.

**Architecture:** Independent topic JSON documents generate all discovery artifacts. React renders a hash-routed static client, MiniSearch initializes lazily from generated metadata, and GitHub Actions gates and deploys `main`.

**Tech Stack:** React 19, TypeScript 7, Vite 8, Tailwind CSS 4, shadcn-style Radix components, Oxlint, MiniSearch, pnpm 11, GitHub Pages.

## Global Constraints

- Use exact dependency versions and pnpm only.
- Preserve `origin/main` as the final authoritative branch.
- Keep `todo.md`, `changelog.md`, and `codemap.json` append-only by adding a new turn entry.
- Generate topic catalog, search corpus, and registry from topic source documents.
- Reflow at 320 CSS pixels and 400% zoom without page-level horizontal scrolling.
- Deploy only after the complete verification job succeeds.

---

### Task 1: Establish deterministic project and content contracts

**Files:** `package.json`, TypeScript/Vite/Tailwind/Oxlint configuration, `src/types/content.ts`, validation and generation scripts.

**Produces:** Exact toolchain, `TopicDocument`, `TopicCatalogEntry`, deterministic content artifacts, and validation commands.

- [x] Add exact stable dependency versions and pnpm metadata.
- [x] Define strict topic and block interfaces.
- [x] Add exact-version, content-schema, relationship, maximum-volume, and generated-freshness checks.
- [x] Run validators and confirm success.

### Task 2: Implement natural-language fuzzy search with a red/green proof

**Files:** `src/lib/query-normalization.ts`, `src/lib/search.ts`, `src/hooks/use-search.ts`, `tests/query-normalization.test.ts`.

**Produces:** `buildSearchQuery()`, `inferQueryIntent()`, lazy `searchTopics()`.

- [x] Write behavior tests for stop words, aliases, query expansion, comparison intent, and troubleshooting intent.
- [x] Run the focused test and observe the troubleshooting case fail for the word “failing.”
- [x] Expand the failure-word contract minimally.
- [x] Rerun the focused suite and confirm all tests pass.

### Task 3: Author and validate the launch curriculum

**Files:** five documents under `public/content/topics`, generated catalog/search/registry.

**Produces:** Complete system explanations with 33 sections and primary-source references.

- [x] Author five dependency-connected topics.
- [x] Add visuals, steps, examples, comparisons, errors, glossary entries, related routes, and official sources.
- [x] Validate every topic and regenerate deterministic artifacts.

### Task 4: Build the adaptive client experience

**Files:** React shell, pages, shadcn-style UI primitives, topic visuals, search dialog, `src/index.css`.

**Produces:** Home, catalog, full topic route, not-found state, global search, contextual topic outline, and responsive visual content blocks.

- [x] Build semantic routing and landmarks.
- [x] Build one global keyboard/touch/pointer search controller.
- [x] Implement bounded fluid tokens, intrinsic grids, container queries, logical properties, dynamic viewport units, safe areas, preferences, focus, and reflow behavior.
- [x] Remove page-level horizontal scrolling mechanisms.

### Task 5: Document, verify, and deploy

**Files:** README, content/adaptation docs, ledgers, `.github/workflows/pages.yml`.

**Produces:** Human handoff documentation, append-only project history, gated Pages deployment.

- [x] Document architecture, authoring, adaptation, source layout, and commands.
- [x] Configure pull-request verification and automatic deployment on updates to `main`.
- [ ] Run dependency-backed test, type, lint, build, and rendered-client review in GitHub Actions.
- [ ] Integrate the reviewed branch into `main` and verify the resulting workflow state.
