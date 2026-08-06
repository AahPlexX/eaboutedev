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
