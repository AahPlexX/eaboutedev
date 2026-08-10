# Foundational Quality Topic Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four dependency-ordered quality-foundation topics, a reusable syntax-anatomy content block, and a complete cleanup/verification gate.

**Architecture:** Extend the existing content union with one data-only `anatomy` block; render it through the shared content renderer and project it into narration through the shared narration projector. Author the four topics as normal authoritative JSON documents, regenerate all discovery assets, then audit links and dead code before the permanent PR/release gates.

**Tech Stack:** React 19, TypeScript 7, Vite 8, Tailwind CSS 4, Node test runner, Oxlint, pnpm 11, static topic JSON, GitHub Actions, temporary exact Knip 6.14.2 audit.

## Global Constraints

- `NORTHSTAR.md` remains the educational-quality authority.
- Do not force identical topic outlines or anatomy blocks where they do not materially help.
- No new client runtime dependency for anatomy rendering.
- Preserve static GitHub Pages architecture and shared narration inheritance.
- Current primary/official sources only for unstable technical claims.
- No internal governance text in client-facing topic prose.
- No known dead related slugs, stale generated assets, dead source files/exports/dependencies, TypeScript errors, Oxlint warnings, or production-build failures at release.

---

### Task 1: Syntax anatomy content primitive

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/components/topics/content-block.tsx`
- Modify: `src/lib/narration.ts`
- Modify: `scripts/validate-content.mjs`
- Modify: `src/learning.css`
- Modify: `docs/content-authoring.md`
- Create/extend: `tests/content-blocks.test.ts`
- Extend: `tests/narration.test.ts`

- [ ] Add failing regression assertions for an `anatomy` block in typing, rendering, validation, and narration.
- [ ] Prove the focused tests fail before implementation.
- [ ] Add `AnatomyBlock` with ordered `segments: { code; label; explanation }[]` to the content union.
- [ ] Render one semantic figure with assembled code and a numbered dissection list; no parser or runtime dependency.
- [ ] Validate non-empty title/language/caption, at least two segments, and non-empty segment code/label/explanation.
- [ ] Narrate meaning rather than literal punctuation.
- [ ] Add responsive/forced-colors/focus styling and authoring guidance.
- [ ] Rerun focused tests and confirm green.

### Task 2: Browser DevTools & Systematic Debugging

**Files:**
- Create: `public/content/topics/browser-devtools-and-systematic-debugging.json`
- Modify related topic JSON only where dependency links are real.

- [ ] Author concrete-first debugging flow from symptom → reproduction → observation → earliest failing layer → minimal hypothesis → verification.
- [ ] Cover Elements/Styles, Console, Sources/breakpoints, Network, Application/storage, Performance, Issues, source maps, and deployed-vs-authored code.
- [ ] Use syntax anatomy only where a request/stack/error construct benefits from dissection.
- [ ] Include at least two checkpoints, failure modes, production/debugging constraints, glossary, and current official Chrome/MDN sources.

### Task 3: Testing Web Applications

**Files:**
- Create: `public/content/topics/testing-web-applications.json`

- [ ] Teach test purpose and observable contracts before framework vocabulary.
- [ ] Cover unit/integration/component/browser/system boundaries, assertions, isolation, fixtures, deterministic data, async waiting, accessibility/cross-browser checks, CI, and flaky-test diagnosis.
- [ ] Add a syntax-anatomy dissection of a representative browser test only when each token maps to a meaningful testing concept.
- [ ] Use current MDN, Node test runner, and Playwright official sources.

### Task 4: Web Accessibility

**Files:**
- Create: `public/content/topics/web-accessibility.json`

- [ ] Teach disability/access barriers through concrete interaction examples before WCAG vocabulary.
- [ ] Cover WCAG 2.2 principles/conformance, semantic HTML, accessible names, keyboard/focus, forms/errors, ARIA supplement rule, reflow/zoom/targets, contrast/motion, assistive-technology and automated/manual testing limits.
- [ ] Add syntax anatomy for one accessible form/control example where semantic parts need explicit mapping.
- [ ] Use current W3C/WAI and MDN sources.

### Task 5: Web Security Foundations

**Files:**
- Create: `public/content/topics/web-security-foundations.json`

- [ ] Teach trust boundaries and browser origins before named attacks.
- [ ] Cover same-origin policy, CORS, XSS, CSRF, cookies/session attributes, CSP, authn/authz, secrets, dependency risk, HTTPS context, and verification/incident-minded diagnosis.
- [ ] Add syntax anatomy for a security-relevant header or cookie only where token-level meaning is useful.
- [ ] Use current MDN, W3C where applicable, and OWASP primary project sources.

### Task 6: Curriculum integration and generated assets

**Files:**
- Modify: `scripts/generate-content-artifacts.mjs` if recommended order is explicit there.
- Modify: existing topic JSON related arrays where justified.
- Regenerate: `public/catalog/topic-catalog.json`, `src/generated/topic-bootstrap.ts`, `public/search/topic-search.minisearch.json`, `docs/topic-registry.json`.

- [ ] Place new guides in dependency order without relying on filename ordering.
- [ ] Validate every related slug exists and links are reciprocal where that materially aids navigation.
- [ ] Regenerate all discovery assets and verify no drift.
- [ ] Confirm search terms discover each new topic using representative novice and expert queries.

### Task 7: Bugs, links, and dead-code audit

**Files:**
- Modify only files implicated by proven findings.

- [ ] Run content/schema/related-link validation.
- [ ] Verify every new primary source URL resolves to the intended current official page.
- [ ] Run exact `pnpm dlx knip@6.14.2`; classify findings from root cause before deleting anything.
- [ ] Remove only proven dead files/exports/dependencies or configure genuine dynamic entries if Knip cannot infer them.
- [ ] Run TypeScript and Oxlint after cleanup.
- [ ] Inspect changed source for unused one-off code paths and obsolete temporary workflows/triggers.

### Task 8: Full verification, release records, and production QA

**Files:**
- Append: `todo.md`
- Append: `changelog.md`
- Append: `codemap.json`

- [ ] Open a PR against `main` and require frozen-lockfile/generated-artifact/full `pnpm check` verification.
- [ ] Fix only evidence-backed failures and rerun until green.
- [ ] Append project records with exact observed evidence.
- [ ] Run the permanent PR gate again on the exact final head.
- [ ] Merge to authoritative `main` and remove branch drift.
- [ ] Wait until Pages serves the expanded catalog/new topic assets.
- [ ] Verify all four new routes at desktop and 390px mobile widths, internal links, syntax-anatomy rendering, and shared narration; start/pause/resume narration on at least one new guide.
