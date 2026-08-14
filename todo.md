# Delivery ledger

This file is append-only. Add a new dated turn section; do not rewrite or remove earlier entries.

## Turn 1 — 2026-08-05

### Completed

- [x] Establish exact pnpm-managed React, TypeScript, Vite, Tailwind CSS, shadcn-style, Oxlint, and MiniSearch stack.
- [x] Define scalable topic schema and generated-artifact pipeline.
- [x] Author five complete launch topics, including The 7 Types of Databases.
- [x] Implement natural-language query normalization and fuzzy search.
- [x] Implement adaptive home, catalog, topic, search, not-found, and shell experiences.
- [x] Add WCAG-oriented reflow, target, focus, text-spacing, motion, color-scheme, safe-area, and orientation outcomes.
- [x] Add GitHub Pages verification and deployment workflow for `main`.
- [x] Add deterministic topic registry and append-only project records.

### Pending external verification gate

- [ ] GitHub-hosted pnpm install, typecheck, Oxlint, production build, and Pages deployment must pass against the committed head before release closure.

## Turn 2 — 2026-08-05

**turncount: 2**

### Completed

- [x] Recover and integrity-check the complete reviewed source tree.
- [x] Pin registry-current stable package releases and pnpm with exact versions.
- [x] Generate and commit a deterministic pnpm lockfile.
- [x] Correct TypeScript 7, Vite 8, React automatic JSX runtime, and Oxlint compatibility issues exposed by GitHub-hosted checks.
- [x] Pass content validation, generated-artifact drift checks, exact-version enforcement, four search tests, TypeScript, Oxlint, and the production Vite build in GitHub-hosted CI.
- [x] Change verification and deployment installs to frozen-lockfile mode.

### Release gate

- [ ] Pass the final frozen-lockfile pull-request verification.
- [ ] Consolidate the reviewed branch onto `origin/main`.
- [ ] Confirm the `main` push verification and GitHub Pages deployment.

### Review hardening — Turn 2

- [x] Preserve topic content titles while updating browser document metadata.
- [x] Match global search semantics to its implemented keyboard interaction model.
- [x] Separate lean catalog metadata from the lazy deep-search corpus.
- [x] Bound home discovery to six topics and catalog rendering to progressive 24-topic windows.
- [x] Add four focused tests for catalog scale behavior and document-title separation, bringing the suite to eight tests.
- [x] Preserve rich NLP and fuzzy behavior in global search while keeping catalog filtering precise.
- [x] Cover both physical safe-area edges for direction-agnostic skip-link placement.
- [x] Restore read-only, frozen-lockfile CI and deployment permissions.

### Release outcome — Turn 2, sequence 3 — 2026-08-06

- [x] Pass the final frozen-lockfile pull-request verification.
- [x] Consolidate the reviewed application onto `origin/main` through squash-merged PR #4.
- [x] Verify the production dependency install and Vite build inside the GitHub Pages deployment job.
- [x] Isolate the remaining failure to first-time repository-level Pages site creation rather than application source, content, tests, types, lint, or build output.
- [x] Upgrade the production workflow to `actions/configure-pages@v6` and remove temporary enablement gates and triggers.
- [ ] In repository **Settings → Pages**, set the publishing source to **GitHub Actions**. This requires repository-admin authorization outside the connected workflow token.
- [ ] Confirm the first live Pages deployment after the publishing source is enabled; subsequent `main` updates are already automated.

## Turn 3 — 2026-08-06

**turncount: 3**

### Completed

- [x] Reconcile all remaining named development and release branches to the authoritative `main` tree.
- [x] Pin every external action in the production Pages workflow to its current official stable semantic release.
- [x] Upgrade Pages artifact upload and deployment from v4 to v5.
- [x] Preserve least-privilege permissions, frozen-lockfile installation, full validation, and main-only deployment behavior.
- [x] Resolve every action release tag to its official full-length commit SHA.
- [x] Replace movable action tags with immutable commit references while retaining readable release comments.

### Remaining external gate

- [ ] In repository **Settings → Pages**, choose **GitHub Actions** under **Build and deployment → Source**.
- [ ] Confirm the first successful deployment at the generated GitHub Pages endpoint after that setting is saved.

## Turn 4 — 2026-08-06

**turncount: 4**

### Completed

- [x] Confirm repository-level GitHub Pages publishing is enabled with **GitHub Actions** as the source.
- [x] Trigger a fresh `main` push without changing application behavior.

### Release verification in progress

- [ ] Confirm the fresh workflow completes source/content verification, production build, artifact upload, and Pages deployment.
- [ ] Confirm the generated Pages endpoint serves the application successfully.

## Turn 5 — 2026-08-07

**turncount: 5**

### Completed

- [x] Identify `configure-pages` self-enablement with `GITHUB_TOKEN` as an authorization-invalid deployment path.
- [x] Remove `enablement: true` from the production Pages workflow.
- [x] Allow both `main` pushes and manual `workflow_dispatch` runs to execute the Pages deployment.
- [x] Create `.github/workflows/actions.yml` for pull-request verification without duplicating production deployment behavior.
- [x] Refresh immutable workflow pins for checkout, pnpm setup, and Node setup to their current verified stable releases.
- [x] Confirm `vite.config.ts` still uses the project Pages base `/eaboutedev/`.

### Remaining release verification

- [ ] Confirm the corrected `main` workflow completes verification, production build, artifact upload, and `actions/deploy-pages` successfully.
- [ ] Confirm `https://aahplexx.github.io/eaboutedev/` serves the deployed application.

## Turn 6 — 2026-08-07

**turncount: 6**

### Completed

- [x] Define and commit the concrete-first, no-gap learning redesign specification and implementation plan.
- [x] Add a native accessible `checkpoint` content block with TypeScript rendering and JSON validation.
- [x] Require at least two comprehension checkpoints in every guide through both content validation and regression tests.
- [x] Give `flow`, `layers`, `comparison`, `cycle`, and `map` visuals distinct relationship semantics and responsive presentation.
- [x] Replace homepage/catalog implementation trivia with learner-facing orientation, natural-language discovery, and an explicit recommended first guide.
- [x] Surface helpful prior knowledge and concrete learning outcomes at the beginning of each topic without making prerequisites a hard gate.
- [x] Rewrite **How the Web Works** from one concrete request into complete network/HTTP/rendering/debugging depth.
- [x] Rewrite **HTML, CSS, and JavaScript** from one visible page into semantics, cascade/layout, DOM/events/state, progressive enhancement, responsiveness, and accessibility depth.
- [x] Rewrite **Git and GitHub** from saved project states into graph/references, integration, remotes, GitHub collaboration, Actions, and recovery depth.
- [x] Rewrite **APIs and Data Exchange** from one software conversation into contracts, schemas/errors, security, reliability, interaction styles, and compatibility depth.
- [x] Rewrite **The 7 Types of Databases** from familiar question shapes into data models, transactions/indexes, specialized retrieval, multi-store synchronization, and production selection depth.
- [x] Strengthen the topic-authoring contract so future guides must preserve the same teaching order and completeness standard.
- [x] Regenerate catalog, search-index, and topic-registry artifacts from the rewritten authoritative topic documents.
- [x] Pass GitHub-hosted `pnpm check`: five-topic validation, exact-version validation, generated-artifact verification, 13/13 tests, TypeScript, Oxlint with denied warnings, and production build.
- [x] Remove the temporary verification/regeneration workflow and diagnostic artifact after successful verification.

### Remaining release verification

- [ ] Independently confirm the latest GitHub Pages deployment completes successfully after these `main` updates.
- [ ] Inspect the deployed learning experience at `https://aahplexx.github.io/eaboutedev/` once the endpoint is serving the latest commit.

## Turn 7 — 2026-08-07

**turncount: 7**

### Completed design work

- [x] Audit real catalog/search/topic loading boundaries before expanding the topic count.
- [x] Approve fixed 24-topic URL-addressable pagination and compact accessible pagination controls.
- [x] Approve Recommended, A–Z, Shortest first, Longest first, and Foundational → Advanced sorting.
- [x] Approve a lazy full-catalog JSON asset plus bounded homepage bootstrap metadata.
- [x] Approve route-level lazy loading for heavy catalog/topic routes.
- [x] Approve on-demand dynamic loading of MiniSearch and build-time serialized search-index construction/restoration.
- [x] Approve successful-request deduplication and retryable failures for catalog/topic loading.
- [x] Approve scale-shape regression fixtures and deterministic generated-asset size budgets.
- [x] Define YAGNI exclusions so no backend, CMS, database, infinite scroll, virtualization, service worker, worker thread, persistent cache, state library, or configurable page-size scope is added without measured need.
- [x] Commit `docs/superpowers/specs/2026-08-07-catalog-scalability-design.md`.

### Implementation gate

- [ ] Review/accept the committed Turn 7 scalability specification.
- [ ] Write the task-by-task implementation plan under `docs/superpowers/plans/`.
- [ ] Implement sorting, pagination, lazy catalog/routes/search, prebuilt search serialization, caching/deduplication, and performance guardrails on `main`.
- [ ] Regenerate discovery artifacts and remove obsolete eager catalog/search artifacts only after all consumers migrate.
- [ ] Pass the complete `pnpm check` gate and record the exact validation evidence.

### Scalability implementation outcome — Turn 7, sequence 2

- [x] Review and approve the Turn 7 scalability specification.
- [x] Commit the task-by-task scalability implementation plan.
- [x] Implement the five approved sort modes and fixed 24-topic true pagination.
- [x] Persist query/category/sort/page catalog state in URL search parameters.
- [x] Move the full catalog to lazy static JSON and bound homepage bootstrap metadata to six entries plus count.
- [x] Add catalog/topic in-session request reuse with retry after failures.
- [x] Lazy-load catalog/topic routes and dynamically import search only for non-empty queries.
- [x] Prebuild MiniSearch during generation and asynchronously restore the serialized index in the browser.
- [x] Remove obsolete `src/generated/topic-catalog.ts` and `public/search/topic-search-index.json`.
- [x] Add 100/500/1,000-topic scale-shape coverage and deterministic generated-discovery size budgets.
- [x] Make permanent generated-artifact CI verification detect untracked generated outputs.
- [x] Pass GitHub-hosted `pnpm check` after correcting the single denied Oxlint warning: 25/25 tests, TypeScript, Oxlint, and production build all green.
- [x] Commit exact generated discovery artifacts and remove temporary verification scaffolding.

### Remaining release verification

- [ ] Independently confirm the latest permanent GitHub Pages deployment completes after the clean `main` updates.
- [ ] Inspect the deployed catalog/search interaction at `https://aahplexx.github.io/eaboutedev/`.

## Turn 9 — 2026-08-09

**turncount: 9**

### Free neural read-aloud implementation

- [x] Research the current browser speech and on-device neural TTS options from authoritative specifications, platform documentation, and upstream model/runtime sources.
- [x] Reject browser `speechSynthesis` as the quality-critical primary path because its available voices are supplied by the visitor's browser/device rather than controlled by this product.
- [x] Select exact `kokoro-js@1.2.1` with Kokoro-82M v1.0 ONNX `q8`, WebAssembly, and the `af_heart` voice for the free client-side baseline.
- [x] Commit the feature specification and task-by-task implementation plan under `docs/superpowers/`.
- [x] Add a pure `TopicDocument` narration projector covering every current content-block type in learner reading order, with bounded synthesis passages.
- [x] Keep literal source code and raw URLs visible instead of reading punctuation/link text aloud while retaining their learner-facing explanations and source labels.
- [x] Add a lazy module Web Worker that loads the exact neural runtime/model only after intentional narration use and synthesizes passages outside the React/UI thread.
- [x] Add shared automatic topic playback with Play/Pause/Resume, Restart, range seek, retry, first-use progress, current passage, and clickable visible transcript.
- [x] Keep narration completely free of API keys, accounts, paid TTS requests, backend infrastructure, billing paths, autoplay, and system-voice fallback.
- [x] Preserve responsive wrapping, 2.75rem control targets, keyboard controls, polite status announcements, current-passage semantics, forced-colors support, and readable-topic fallback on narration failure.
- [x] Prove the focused red/green narration contract locally with 7/7 passing tests.
- [x] Pass GitHub-hosted frozen-lockfile installation and generated-artifact drift verification.
- [x] Correct Oxlint's documented worker-context `postMessage` false positive without weakening the lint configuration by using the standards-defined worker transfer-options overload.
- [x] Pass GitHub-hosted `pnpm check`: five-topic validation, exact-version validation, generated/discovery validation, 32/32 tests, TypeScript, Oxlint with 0 warnings/errors, and the Vite 8 production build.

### Remaining release verification

- [ ] Pass the final pull-request gate after documentation/project-record updates.
- [ ] Merge PR #8 into authoritative `main`.
- [ ] Confirm the resulting `main` Pages workflow completes verification, build, artifact upload, and deployment.
- [ ] Inspect the deployed player on the live GitHub Pages site at desktop and narrow mobile widths and record any runtime/model-loading limitation truthfully.


### Release outcome — Turn 9, sequence 2

- [x] Squash-merge PR #8 into authoritative `main` at commit `e7199e67f0ad28c24e9eaa2b0f5d49aa30d10244`.
- [x] Preserve the successful permanent pull-request gate after README and append-only record updates.
- [x] Confirm the public GitHub Pages topic exposes the Turn 9 narration player.
- [x] Run exact Playwright 1.62.0 against the deployed How the Web Works topic and start real neural synthesis successfully.
- [x] Confirm Play, Pause, and Resume behavior against generated audio.
- [x] Confirm exactly one current transcript passage while audio is active.
- [x] Confirm no page-level horizontal overflow at 1440×900 or 390×844.
- [x] Confirm the primary narration control measures 47.61 CSS pixels high.
- [x] Confirm jsDelivr and Hugging Face neural runtime/model requests complete with zero relevant failed responses and zero browser console errors.
- [x] Commit auditable live-browser evidence at `docs/turn9-live-qa-result.json`.
- [x] Remove the ephemeral live-QA workflow after evidence was captured.

## Turn 8 — 2026-08-09

**turncount: 8**

### Completed

- [x] Add Node.js and Package Management with runtime, manifest, dependency graph, lockfile, module-system, environment, and supply-chain depth.
- [x] Add TypeScript with inference, unions/narrowing, objects, generics, modules/configuration, runtime-boundary, and production-checking depth.
- [x] Add React with components/props, JSX/purity, state/events, state ownership, render/commit identity, Effects/refs, accessibility, and production-state depth.
- [x] Add Vite with dev-server/HMR, module graph, transforms, plugins/configuration, environment modes, production build/base paths, and deployment diagnosis.
- [x] Update related-topic links and explicit recommended curriculum order.
- [x] Regenerate catalog, homepage bootstrap, serialized search index, and topic registry.
- [x] Pass the complete GitHub-hosted project gate before committing the curriculum expansion.

### Next curriculum expansion

- [ ] Continue with another 2–5 dependency-ordered topics without weakening per-guide completeness.
- [ ] Re-check search coverage, recommended order, related links, generated artifacts, narration inheritance, and internal docs in the same turn.

### Production verification — Turn 8, sequence 2

- [x] Wait for the public Pages deployment to serve the new Node.js topic asset and a nine-topic catalog before browser assertions.
- [x] Verify Node.js and Package Management, TypeScript, React, and Vite routes render on the public GitHub Pages site.
- [x] Verify all four new routes inherit the shared neural narration player.
- [x] Verify all four routes have no page-level horizontal overflow at 1440×900 and 390×844.
- [x] Verify the React guide starts real neural narration and supports Pause and Resume.
- [x] Verify exactly one React transcript passage is current during playback.
- [x] Verify zero browser console errors and zero relevant failed neural runtime/model responses in the successful deployment-aware run.
- [x] Preserve machine-readable evidence in `docs/turn8-live-qa-result.json`.

## Turn 10 — 2026-08-09

**turncount: 10**

### Model-agnostic topic quality governance

- [x] Research current cross-agent repository instruction conventions from authoritative OpenAI, Anthropic, Google, and AGENTS.md/AAIF sources.
- [x] Add root `NORTHSTAR.md` as the canonical educational-quality constitution for all topic additions, rewrites, and curriculum expansions.
- [x] Define observable quality dimensions rather than forcing one repeated topic template.
- [x] Govern epistemic integrity, zero-gap continuity, mechanistic understanding, progressive depth, explanatory density, example integrity, decision literacy, failure literacy, production realism, visual semantics, human readability, accessibility, curriculum coherence, integration integrity, and consistency without sameness.
- [x] Add a current-date authoritative-source research protocol, publication self-audit, hard prohibitions, and explicit instruction hierarchy.
- [x] Add a short root `AGENTS.md` as the vendor-neutral agent entry point.
- [x] Add thin `CLAUDE.md` and `GEMINI.md` adapters that route those agent ecosystems to the same North Star instead of duplicating policy.
- [x] Update `docs/content-authoring.md` so it is explicitly subordinate to the North Star on educational quality and does not imply identical topic outlines.
- [x] Update `README.md` so human contributors encounter the same governance hierarchy.
- [x] Preserve topic JSON, generated discovery artifacts, application runtime, dependencies, and client-facing content unchanged.


## Turn 11 — 2026-08-10

**turncount: 11**

### Cross-agent governance hardening

- [x] Re-verify current Codex, Claude Code, Gemini CLI, and GitHub Copilot repository-instruction mechanisms from official sources.
- [x] Preserve `NORTHSTAR.md` as the single canonical educational-quality policy body.
- [x] Change `GEMINI.md` from advisory file references to native `@file` imports of the shared governance and registry context.
- [x] Add the official repository-wide `.github/copilot-instructions.md` discovery adapter without duplicating North Star policy.
- [x] Keep `AGENTS.md` as the vendor-neutral short map into deeper governance rather than turning it into an encyclopedia.
- [x] Add `tests/governance-discovery.test.ts` to enforce canonical North Star presence, thin vendor adapters, required imports, and core repository safeguards.
- [x] Prove the new regression contract RED before adapter fixes.
- [x] Diagnose and correct the test-only Markdown backtick false failure without weakening readable governance text.
- [x] Pass the complete permanent pull-request verification gate after the final governance-discovery implementation.
- [x] Preserve client-facing topic content, topic JSON, generated discovery assets, narration behavior, dependencies, and application runtime unchanged.


## Turn 12 — 2026-08-12

**turncount: 12**

### Lint gate and dependency currency restoration

- [x] Diagnose why `pnpm run check` was red on `main`: two Oxlint `no-useless-escape` errors in `tests/rich-text.test.ts` and three unsuppressed `react/no-array-index-key` warnings under `--deny-warnings`.
- [x] Remove the unnecessary escapes and extend the existing per-file `react/no-array-index-key` override to `topic-visual.tsx` and `topic-page.tsx`, matching the precedent already set for `content-block.tsx`/`topic-section.tsx`.
- [x] Regenerate `docs/topic-registry.json`, whose committed `sha256` for `how-the-web-works` had drifted from current source content.
- [x] Bump `lucide-react`, `vite`, `oxlint`, and `@types/node` to current npm registry `latest`, preserving exact-version pinning.
- [x] Pass the complete `pnpm check` gate locally and merge squash PR #12 into `main`; confirm both `Deploy GitHub Pages` and `Semantic inline TDD` completed successfully against the merge commit.

### Topic UX health audit follow-up

- [x] Discover that the one-time `topic-ux-health-audit.yml` run at commit `539dfc8` (2026-08-11) failed both its Knip dead-code step and its live-browser Playwright step, and that the failure was never previously recorded in this ledger.
- [x] Root-cause the browser failure: `locator('.topic-toc-desktop')` resolved to 2 DOM elements because `TopicToc` unconditionally rendered both its desktop `<nav>` and mobile `<details>` markup while `topic-page.tsx` invoked the component twice, once per breakpoint wrapper.
- [x] Give `TopicToc` an explicit `variant: "desktop" | "mobile"` prop so each call site renders only the landmark it needs, and update both call sites in `topic-page.tsx`.
- [x] Strengthen the existing UX regression test so it asserts exactly one desktop and one mobile `TopicToc` usage instead of only checking for the presence of both class-name strings in the component source.
- [x] Remove the confirmed-dead `resetSearchCache` export from `src/lib/search.ts` and un-export the 9 inline-content-node interfaces in `src/types/content.ts` that nothing outside the file imports by name; re-ran Knip locally and confirmed zero remaining unused-export/unused-type findings.
- [x] Pass the complete `pnpm check` gate locally with the fix in place: 46/46 tests (including the strengthened TOC test), `tsc -b` clean, Oxlint 0 warnings/0 errors, production build succeeds.

### Remaining verification

- [ ] Re-trigger `topic-ux-health-audit.yml` against the corrected `main` (its trigger path is `docs/topic-ux-health-trigger.txt`) and confirm the live-browser step no longer hits the strict-mode duplicate-locator failure.
- [ ] Confirm the corrected Pages deployment renders exactly one visible desktop and one visible mobile "On this page" landmark per breakpoint on the live site.


## Turn 13 — 2026-08-13

**turncount: 13**

### Topic narration presentation fix

- [x] Diagnose direct user feedback that the topic narration (TTS) control was sticky and problematic, and needed to be optional rather than front-and-center on every `topics/**` page.
- [x] Wrap `TopicNarration` in a collapsed-by-default `<details className="topic-narration">` disclosure with a plain-language summary ("Listen to this guide" / "Optional — free, on-device narration"), removing `position: sticky` and the always-expanded floating control-bar treatment from `src/learning.css`.
- [x] Preserve every existing playback/accessibility contract (Play/Pause/Resume, Restart, retry, seek slider, polite status live region, transcript disclosure, current-passage semantics) unchanged inside the new outer disclosure.
- [x] Add a regression test asserting the collapsed-disclosure structure and the absence of `position: sticky`.
- [x] Update the live `topic-ux-health-audit.yml` script to open the new outer disclosure before interacting with controls, and assert the summary is collapsed by default and sized like a normal disclosure row instead of the old always-expanded control-bar height.
- [x] Note the new optional/collapsed presentation in `README.md`.
- [x] Pass the complete `pnpm check` gate locally (47/47 tests, `tsc -b` clean, Oxlint 0/0, production build) and merge squash PR #15 into `main`.
- [x] Re-trigger `topic-ux-health-audit.yml` against the deployed fix and confirm success on the live site: `narrationCollapsedByDefault: true`, `narrationSummaryHeightPx: 48`, `mobileNarrationPosition: "static"`, overall `success: true`.

### Topic UX health audit closure

- [x] Re-trigger `topic-ux-health-audit.yml` against the merged topic-toc duplicate-landmark fix (#13) via PR #14 and confirm the live-browser step no longer hits the strict-mode duplicate-locator failure; full result recorded `success: true` in `docs/topic-ux-health-result.json`.


## Turn 14 — 2026-08-14

**turncount: 14**

### Model-agnostic SSOT governance directory

- [x] Discover before acting: the local working copy was 83 commits behind `origin/main` (through PR #17); reset to true current `main` instead of proceeding from stale state or force-pushing over newer merged work.
- [x] Add root `SSOT.md` as a canonical Single Source of Truth **directory**, not a second policy body: it maps every governed concern (content quality, authoring contract, generated artifacts, topic sources, tests, CI/deploy workflows, ledgers, spec/plan records, dependency policy) to the one file authoritative for it, plus that file's mutation (CRUD) rule.
- [x] Keep `SSOT.md` explicitly subordinate to `AGENTS.md`'s existing instruction hierarchy and to `NORTHSTAR.md` on educational quality; it is a map, not a new precedence layer.
- [x] Wire `SSOT.md` into every existing agent adapter (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`) and into `README.md`, so any current or future LLM/agent — regardless of vendor — is directed to it before performing CRUD in this repository.
- [x] Add `tests/ssot-directory.test.ts`, asserting every canonical path referenced by `SSOT.md` actually exists, that `SSOT.md` does not duplicate `NORTHSTAR.md`'s substantive quality headings, that every adapter references it, and that adapters stay thin.
- [x] Pass the complete `pnpm check` gate locally: 51/51 tests (up from 47), `tsc -b` clean, Oxlint 0 warnings/0 errors, generated-artifact drift check clean, production build succeeds.
- [x] Preserve topic JSON, generated discovery artifacts, application runtime, dependencies, and client-facing content unchanged.

### Remaining release verification

- [ ] Pass the permanent pull-request verification gate (`.github/workflows/actions.yml`) on the PR opened for this turn.
- [ ] Merge into authoritative `main` and delete the source branch so no competing branch state remains.
- [ ] Confirm the resulting `main` `Deploy GitHub Pages` workflow completes verification, build, artifact upload, and deployment.
