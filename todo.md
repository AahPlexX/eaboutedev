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
