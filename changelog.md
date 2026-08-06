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
