# Changelog

Append-only project history. The highest recorded `turncount` is authoritative.

## Turn 1 — 2026-08-05

**turncount: 1**

### Added

- Initialized the Everything About Development application and production toolchain.
- Added five complete, visually structured, primary-source-backed web-development guides.
- Added deterministic topic generation, registry hashing, schema validation, related-route validation, exact-version enforcement, and a 5,000-topic ceiling.
- Added natural-language normalization, domain alias expansion, intent inference, and lazy weighted fuzzy search.
- Added responsive home, topic catalog, topic reader, contextual navigation, search dialog, loading, error, and not-found states.
- Added shadcn-style Button, Card, Badge, Input, and Dialog primitives.
- Added adaptive OKLCH design tokens, intrinsic grids, container queries, logical properties, dynamic viewport units, safe-area support, reduced motion, dark scheme, forced colors, and reflow protections.
- Added GitHub Actions verification and automatic GitHub Pages deployment on updates to `main`.
- Added project specification, implementation plan, content-authoring contract, adaptation strategy, README, topic registry, todo ledger, and code map.

### Corrected during validation

- Consolidated duplicate responsive search controllers into one global controller.
- Replaced an ES-module-incompatible Vite `__dirname` alias.
- Removed horizontally scrolling catalog filters.
- Corrected troubleshooting intent recognition for “failing,” proven by a red/green test run.

## Turn 2 — 2026-08-05

**turncount: 2**

### Verified and hardened

- Recovered the complete reviewed source tree from a retained GitHub Actions artifact and validated its SHA-256 digest before expansion.
- Repaired one proven transport-level bit flip, then confirmed the archive CRC, uncompressed length, and complete 61-file source tree without rewriting application content.
- Updated every package and the package manager to the registry-current stable exact release available during verification; no dependency ranges were introduced.
- Added and committed `pnpm-lock.yaml`, then changed pull-request verification and production deployment to `pnpm install --frozen-lockfile`.
- Removed TypeScript 7's retired `baseUrl` option while preserving the explicit `@/*` path contract.
- Replaced the retired Vite 8 object-form `manualChunks` configuration with native Rolldown chunking.
- Added explicit Node ambient types for the Node test runner and strict TypeScript project build.
- Aligned Oxlint with React's automatic JSX runtime and corrected all genuine denied-warning findings in search, generation, sorting, validation, and static content rendering.
- Confirmed five topic documents, generated catalog/search/registry freshness, exact dependency versions, four natural-language search tests, TypeScript, Oxlint, and the Vite production build in GitHub-hosted CI.

### Release gate

- The review branch is mergeable and the final frozen-lockfile verification is required before consolidation onto `origin/main`.

### Review hardening — Turn 2

- Separated topic content titles from the browser document title and added focused regression tests.
- Replaced incomplete listbox roles in global search with native list and button semantics that match the implemented keyboard behavior.
- Split lean catalog metadata from the lazy deep-search corpus so discovery pages do not duplicate full search text in the main JavaScript bundle.
- Bounded the home page to six featured topics and the catalog to progressive 24-topic windows so the interface remains usable as the registry approaches 5,000 topics.
- Added catalog filtering and display-window tests, bringing the focused Node test suite to eight tests.
- Kept rich synonym and fuzzy expansion in global search while making the lightweight catalog filter precise and predictable.
- Made the skip-link safe-area inset resilient in both left-to-right and right-to-left layouts.
- Restored the final GitHub Actions workflow to read-only repository access with frozen dependency installs and no self-modifying steps.

### Release outcome — Turn 2, sequence 3 — 2026-08-06

- Squash-merged the reviewed application through PR #4 onto `origin/main` at commit `307e4fb147da88ab55e1d520ade15d3b76a76a7e`.
- Re-ran the complete frozen-lockfile verification and production build through GitHub-hosted Actions; all source, content, test, type, lint, and Vite build gates passed.
- Proved the remaining deployment failure occurs after the successful production build, at initial GitHub Pages site configuration: GitHub returned `Not Found` when reading the Pages site and `Resource not accessible by integration` when the workflow attempted first-time enablement.
- Confirmed the connected integration cannot perform the repository-admin action required to create the initial Pages site.
- Upgraded the retained production workflow to `actions/configure-pages@v6`, preserved automatic deployment on every `main` update, and removed all temporary enablement workflows and trigger files from the final release branch.
- The sole remaining release dependency is external repository configuration: enable GitHub Pages with **GitHub Actions** as the publishing source in repository Settings. The next update to `main` will then run the existing automatic deployment workflow.

## Turn 3 — 2026-08-06

**turncount: 3**

### Release workflow maintenance

- Reconciled every remaining named development or release branch to the authoritative `main` tree so no alternate implementation remains ahead of production.
- Pinned `actions/checkout` to `v6.0.2`, `pnpm/action-setup` to `v6.0.8`, and `actions/setup-node` to `v6.4.0`.
- Pinned `actions/configure-pages` to `v6.0.0`, `actions/upload-pages-artifact` to `v5.0.0`, and `actions/deploy-pages` to `v5.0.0`.
- Preserved read-only repository permissions, exact pnpm installation through the committed lockfile, generated-artifact drift detection, the complete project check, and the main-only deployment gate.
- The repository-admin Pages publishing-source selection remains the only external release dependency; no application or workflow logic can safely substitute for that setting.

### Immutable action pinning — Turn 3, sequence 2

- Resolved every verified semantic action release to the full commit SHA in its official repository.
- Replaced all movable action tags in the production workflow with immutable 40-character commit references.
- Retained the verified semantic release beside each SHA as a YAML comment so security and maintainability remain aligned.
- Preserved the same workflow behavior, job permissions, Node 24 runtime, frozen dependency graph, and Pages deployment contract.

## Turn 4 — 2026-08-06

**turncount: 4**

### GitHub Pages enablement

- Recorded the repository administrator’s confirmation that **Settings → Pages → Build and deployment → Source** is now set to **GitHub Actions**.
- Initiated a fresh `main` update so the existing verified workflow can perform the first deployment under the newly enabled repository setting.
- Preserved application source, generated content, dependencies, and workflow behavior unchanged while advancing only the append-only release records.

## Turn 5 — 2026-08-07

**turncount: 5**

### GitHub Pages deployment correction

- Traced the failed release to commit `126d692d0611ff298d21173d63b12e6aca50caba`, which reintroduced `configure-pages` with `enablement: true` after repository-level Pages had already been enabled.
- Removed `enablement: true`; the official `configure-pages` contract requires a token other than `GITHUB_TOKEN` for self-enablement, so retaining it would keep the deploy path authorization-invalid.
- Removed the push-only deploy condition so both `push` to `main` and `workflow_dispatch` now execute the actual Pages deployment.
- Split pull-request verification into `.github/workflows/actions.yml` so the Pages workflow has one responsibility: verify, build, upload, and deploy production.
- Updated immutable action pins to current verified releases for `actions/checkout@v7.0.1`, `pnpm/action-setup@v6.0.9`, and `actions/setup-node@v7.0.0`; retained current Pages actions at configure v6.0.0, upload v5.0.0, and deploy v5.0.0.
- Re-verified the Vite production base remains `/eaboutedev/`, matching the project Pages URL path.

## Turn 6 — 2026-08-07

**turncount: 6**

### Intuitive learning-content redesign

- Replaced the launch library's expert-first teaching order with one shared content contract: concrete before abstract, meaning before vocabulary, cause before rule, explicit dependency order, interpreted examples, and no removal of difficult concepts merely to simplify the prose.
- Rewrote all five launch guides so each can be entered without prior topic vocabulary and naturally continues into the real terminology, code/data, debugging, failure modes, trade-offs, security/performance concerns, and production decisions.
- Rebuilt **How the Web Works** around one address-bar request moving through URL parsing, DNS, network/transport, TLS, HTTP, browser rendering, and stage-based diagnosis.
- Rebuilt **HTML, CSS, and JavaScript** around one small page before introducing semantics, the CSS cascade, layout systems, container queries, DOM, events, state, effects, progressive enhancement, responsive behavior, and accessibility constraints.
- Rebuilt **Git and GitHub** around observable repository state changes before introducing the commit graph, references, HEAD, branch integration, remotes, pull requests, Actions, and recovery.
- Rebuilt **APIs and Data Exchange** around two programs communicating before introducing API contracts, schemas, RFC 9457 problem details, authentication/authorization, pagination, caching, backoff/jitter, idempotency, GraphQL, webhooks, event streams, and compatibility management.
- Rebuilt **The 7 Types of Databases** around seven recognizable question shapes before introducing access patterns, invariants, transactions, joins, aggregate boundaries, graph traversal, inverted indexes, embeddings, projections, and polyglot persistence.
- Added an accessible native `checkpoint` disclosure block and made at least two comprehension checkpoints mandatory for every guide through both tests and content validation.
- Changed visual rendering so flow, layers, comparison, cycle, and map content no longer collapse into the same sequential boxes-and-arrows presentation.
- Replaced learner-irrelevant homepage/catalog implementation messaging with clear starting guidance, learner promises, natural-language search examples, visible helpful prerequisites, and concrete learning outcomes.
- Strengthened `docs/content-authoring.md` so future topics must follow the same no-gap, plain-language, technically complete learning order.

### Verification

- GitHub-hosted `pnpm check` generated the content artifacts, validated all five topics, verified exact dependency versions and generated-artifact freshness, passed all 13 tests, passed TypeScript, passed Oxlint with denied warnings, and completed the production build before the success-only generated-artifact commit `21a3bab06d7bd5af5d9a77ed25dd6831809a3857` was created.
- Regenerated `src/generated/topic-catalog.ts`, `public/search/topic-search-index.json`, and `docs/topic-registry.json`; the registry verification date advanced to `2026-08-07` and all rewritten source hashes were refreshed.
- Removed the temporary regeneration/diagnostic workflow and failure log after verification; the permanent workflow surface remains `.github/workflows/actions.yml` and `.github/workflows/pages.yml`.

## Turn 7 — 2026-08-07

**turncount: 7**

### Catalog scalability design approved

- Audited the current scale boundaries before adding more topics: independent topic JSON loading and the dynamic topic route already scale well, while eager full-catalog metadata and browser-built global search are the two central growth risks.
- Approved true fixed 24-topic pagination with URL-addressable query, category, sort, and page state so refresh, browser history, bookmarks, and shared catalog views remain deterministic.
- Approved five learner-useful sort modes only: Recommended, A–Z, Shortest first, Longest first, and Foundational → Advanced.
- Approved migration of the complete catalog from eager TypeScript application data to a lazy static JSON asset, while keeping homepage bootstrap metadata permanently bounded to six featured topics plus the total count.
- Approved route-level lazy loading for catalog/topic implementations and on-demand dynamic loading of the search implementation.
- Approved build-time MiniSearch indexing and serialized asynchronous browser restoration so visitors no longer rebuild the full search index with `addAll()`.
- Approved in-session request deduplication/reuse for successful catalog/topic loads, with failures remaining retryable.
- Approved scale-shape tests for hundreds of topics and deterministic per-topic generated-asset size budgets instead of treating the existing 5,000-topic numerical ceiling as a performance claim.
- Explicitly excluded database/CMS/backend migration, infinite scroll, virtualization, Web Workers without measured need, service workers, persistent client caches, configurable page size, new state management, and other YAGNI scope growth.
- Committed the approved design specification at `docs/superpowers/specs/2026-08-07-catalog-scalability-design.md`; implementation remains gated on spec review and a written implementation plan.

### Scalability hardening implementation — Turn 7, sequence 2

- Replaced progressive “Show more” discovery with true fixed 24-topic pagination and compact Previous/numbered/Next controls.
- Added URL-addressable `q`, `category`, `sort`, and `page` state with safe invalid-page normalization and page reset after filter/sort changes.
- Added Recommended, A–Z, Shortest first, Longest first, and Foundational → Advanced stable sorting.
- Moved the complete catalog out of eager application JavaScript into `public/catalog/topic-catalog.json`; homepage discovery now consumes a generated bootstrap bounded to six topic cards plus total count.
- Added shared in-session catalog/topic request deduplication with retryable failures and preserved topic 404 behavior.
- Lazy-loaded catalog and topic route implementations and dynamically loaded global search only after a non-empty query.
- Moved MiniSearch `addAll()` index construction to build-time generation and changed the browser to asynchronously restore the serialized `public/search/topic-search.minisearch.json` index.
- Removed the redundant source-like search corpus and obsolete generated TypeScript full catalog.
- Added 100/500/1,000-topic scale-shape tests, URL-state/loader/search-restoration regression tests, and deterministic catalog/search/bootstrap byte budgets.
- Tightened permanent generated-artifact verification so CI detects both modified and newly untracked generated discovery files.

### Verification — Turn 7, sequence 2

- The first GitHub-hosted run passed generation, five-topic content validation, exact-version validation, generated freshness, discovery budgets, all 25 tests, and TypeScript; Oxlint correctly stopped on one `unicorn/no-array-sort` warning.
- Replaced copied mutable `.sort()` with native immutable `.toSorted()` and reran the complete GitHub-hosted `pnpm check`.
- The success-only verifier then returned exit code 0 and committed exact generated artifacts at `e89fd173dd180b92c89626923f379e2306c87107`; all 25 tests, TypeScript, Oxlint with denied warnings, and the Vite production build passed.
- Removed the temporary scalability verifier, resolved failure diagnostic, and verification trigger after success.
- No database, CMS, backend search/pagination, infinite scroll, virtualization, Web Worker, service worker, state library, persistent browser cache, or configurable page size was added.

## Turn 9 — 2026-08-09

**turncount: 9**

### Completely free neural topic narration

- Researched the current browser speech and on-device neural TTS landscape against the Web Speech specification, current browser-platform documentation, Kokoro/Kokoro.js upstream sources, Hugging Face model artifacts, and current Oxlint documentation before selecting the implementation.
- Rejected `window.speechSynthesis` as the quality-critical narrator because the standard leaves the available voice list to the user agent/device; the product therefore cannot guarantee a consistently natural voice through that API.
- Selected exact `kokoro-js@1.2.1`, `onnx-community/Kokoro-82M-v1.0-ONNX`, `q8`, WebAssembly, and `af_heart` as the no-account/no-billing client-side baseline.
- Added `docs/superpowers/specs/2026-08-09-free-neural-read-aloud-design.md` and `docs/superpowers/plans/2026-08-09-free-neural-read-aloud.md` before production implementation.
- Added `src/lib/narration.ts` so every `TopicDocument` automatically projects into bounded spoken passages in the same educational order, including topic/section context, visuals, paragraphs, steps, cards, table semantics, callouts, checklists, checkpoints, glossary, and primary-source labels.
- Kept literal source code and raw URLs visual rather than reading punctuation or links character-by-character, while retaining code explanations and human-readable source labels in narration.
- Added `src/workers/narration.worker.ts` as the isolated neural synthesis boundary. The exact browser runtime is dynamically imported only after intentional narration activation; the q8 model executes through WASM and generated audio returns as Blob data.
- Added `src/components/topics/topic-narration.tsx` and one shared `TopicPage` integration so all current and future topic documents inherit Play/Pause/Resume, Restart, topic-position seek, retry, model-download progress, current-passage context, and a clickable visible transcript.
- Added session-scoped generated-audio reuse plus object-URL cleanup and next-passage prefetch so navigation remains deterministic without adding a persistent cache, backend, service worker, or stored generated-audio library.
- Kept the normal topic path free of neural initialization/model downloads until user action and added clear first-use disclosure for the approximately 100 MB neural-model transfer.
- Preserved no-autoplay behavior, 2.75rem controls, keyboard-operable native controls, polite status output, current transcript semantics, forced-colors visibility, mobile wrapping, and readable-topic availability after narration failures.
- Added `tests/narration.test.ts` and `tests/narration-runtime.test.ts`; the local red/green focused suite reached 7/7 passing narration tests.
- The first PR #8 verification passed frozen dependency installation, generated-artifact integrity, content/discovery validation, 32/32 tests, and TypeScript, then correctly failed on five `unicorn/require-post-message-target-origin` warnings. Current Oxlint documentation identifies this rule as capable of false positives for worker contexts.
- Corrected worker messaging without disabling or weakening linting by using the standards-defined Worker/DedicatedWorkerGlobalScope options overload `{ transfer: [] }` on each `postMessage` call.
- The rerun passed the complete GitHub-hosted `pnpm check`: five-topic validation, exact-version validation, generated/discovery validation, 32/32 tests, TypeScript 7, Oxlint with 0 warnings and 0 errors, and Vite 8 production build. Vite emitted the app-side narration worker as a separate 1.29 kB chunk; the external neural runtime/model remain user-initiated.
- Updated README architecture documentation to match the current lazy catalog/bootstrap/serialized-search assets and document the narration runtime, privacy/cost boundary, playback behavior, accessibility contract, and failure behavior.

### Release state

- PR #8 remains the release gate until the append-only records and README changes pass the same permanent pull-request verification. After that, merge to authoritative `main`, verify the Pages deployment, and inspect the live player rather than treating CI alone as runtime proof.


### Release and live-browser verification — Turn 9, sequence 2

- Squash-merged PR #8 into authoritative `main` at `e7199e67f0ad28c24e9eaa2b0f5d49aa30d10244` only after the permanent post-record pull-request gate passed.
- The deployed Pages topic exposed the new narration player and successfully started real Kokoro neural synthesis in headless Chromium through the same public jsDelivr and Hugging Face network path used by visitors.
- Live controls passed Play, Pause, and Resume; the synchronized transcript exposed exactly one current passage; the primary control measured 47.61 CSS pixels high.
- Desktop 1440×900 and mobile 390×844 both remained free of page-level horizontal overflow.
- Relevant neural runtime/model traffic completed without failed HTTP responses, and the browser emitted zero console errors during the test.
- Preserved the exact machine-readable result in `docs/turn9-live-qa-result.json` at commit `4b46c1ef3e3265c52b0aa97d3db615179ef513ed`, then removed the ephemeral QA workflow from `main`.
