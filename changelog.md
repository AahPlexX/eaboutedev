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
