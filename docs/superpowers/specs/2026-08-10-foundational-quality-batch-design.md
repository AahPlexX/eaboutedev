# Foundational Quality Topic Batch Design

**Date:** 2026-08-10

## Goal

Expand the curriculum with four dependency-ordered topics—Browser DevTools & Systematic Debugging, Testing Web Applications, Web Accessibility, and Web Security Foundations—while adding a reusable syntax-anatomy teaching block and finishing with no known broken internal links, stale generated artifacts, dead source paths, or failing project checks.

## Governing constraints

- `NORTHSTAR.md` governs educational quality. Topic structures may differ when their subjects differ.
- Current authoritative sources are required for substantive technical claims.
- Topic files remain `public/content/topics/<slug>.json`; generated catalog/search/bootstrap/registry outputs remain generated.
- Every substantial guide keeps at least two checkpoints, primary sources, glossary, related-topic links, and narration compatibility.
- Syntax anatomy is used only where dissecting concrete syntax materially improves understanding. It is not mandatory per topic.
- No new client runtime dependency is required for syntax anatomy.
- Internal governance/development instructions must not appear in learner-facing copy.

## Curriculum sequence

1. **Browser DevTools & Systematic Debugging** — observation before diagnosis: DOM/CSS inspection, Console, Sources/breakpoints, Network, storage/application state, performance evidence, source maps, and stage-based debugging.
2. **Testing Web Applications** — expectations before automation: test boundaries, deterministic inputs/outputs, unit/integration/browser/system tests, assertions, isolation, fixtures, accessibility and cross-browser checks, CI, and diagnosing flaky tests.
3. **Web Accessibility** — semantic and interaction quality: perceivable/operable/understandable/robust framing, semantic HTML, accessible names, keyboard/focus, forms/errors, ARIA as supplement, responsive/reflow/target sizing, motion/contrast, and manual/automated testing boundaries.
4. **Web Security Foundations** — trust before features: origins, same-origin policy, CORS, input/output trust boundaries, XSS, CSRF, cookies/session attributes, CSP, authentication vs authorization, secrets, dependency/browser defenses, and security verification.

## Syntax anatomy block

Add a new `anatomy` content block with:

- `title`: learner-facing name of the construct;
- `language`: syntax family label;
- `caption`: what the complete construct accomplishes;
- `segments`: ordered `{ code, label, explanation }` items.

The full displayed construct is the concatenation of segment code. The renderer shows the assembled syntax plus numbered segment explanations. This keeps mapping deterministic without adding a syntax parser or hard-coded token ranges. Narration reads the title/caption/labels/explanations but does not read punctuation character-by-character.

The block must use semantic `figure`/`figcaption`, keyboard-readable code, non-color-only numbered markers, responsive wrapping/scroll containment, visible focus, and forced-colors support.

## Quality and cleanup gates

- Add type, renderer, validator, narration, and regression coverage for `anatomy`.
- Update `docs/content-authoring.md` so future agents know when and how to use syntax anatomy without treating it as a template requirement.
- Update existing related-topic links only where the new dependency is real.
- Regenerate catalog, homepage bootstrap, serialized search index, and topic registry.
- Validate all related slugs and topic source URLs.
- Audit source reachability/dead exports/dependencies with exact Knip 6.14.2; investigate findings before deletion.
- Run the permanent frozen-lockfile PR gate including full `pnpm check`.
- Inspect the deployed new routes at desktop/mobile widths and verify shared neural narration on at least one new guide.

## Non-goals

- No backend/CMS/database migration.
- No visual syntax parser, AST parser, code editor, syntax-highlighting dependency, or interactive code execution.
- No requirement that every topic contain an anatomy block.
- No broad refactor unrelated to proven cleanup findings.
