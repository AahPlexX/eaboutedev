# Semantic Inline Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe structured inline semantics to topic content while enforcing one canonical defining instance per term per topic.

**Architecture:** Existing topic strings remain valid. A `RichText` union adds recursive fixed semantic nodes. A pure utility flattens rich text and validates link destinations; a React renderer maps only the approved node union to built-in semantic elements. Content validation walks every rich-text field, rejects malformed nodes and duplicate `dfn` terms, and narration/search consume flattened plain text.

**Tech Stack:** React 19.2.8, TypeScript 7.0.2, Node 24+, Vite 8.2.0, pnpm 11.20.0, existing JSON topic schema and Node test runner.

## Global Constraints

- Do not introduce raw HTML strings or `dangerouslySetInnerHTML`.
- Do not add DOMPurify; the fixed structured model removes the HTML parsing surface.
- Existing plain-string topics remain valid.
- `dfn` may define a normalized canonical term only once per topic.
- Supported semantic nodes are exactly `dfn`, `abbr`, `code`, `strong`, `em`, `a`, `kbd`, `samp`, and `var`.
- External links must use HTTPS; internal `/`, `./`, `../`, and `#` destinations are allowed.
- No node may author arbitrary tags, styles, classes, events, `target`, or `rel`.
- Narration and search must receive plain text, never markup syntax.
- `origin/main` remains authoritative and the permanent Pages workflow must remain intact.

---

### Task 1: Rich-text model and pure utilities

**Files:**
- Modify: `src/types/content.ts`
- Create: `src/lib/rich-text.ts`
- Create: `tests/rich-text.test.ts`

**Interfaces:**
- Produces `RichText`, `InlineSemanticNode`, `flattenRichText(value: RichText): string`, `isAllowedRichTextHref(href: string): boolean`.

- [ ] Write failing tests for plain strings, nested nodes, source-order flattening, HTTPS/internal links, and rejected `javascript:`, `data:`, protocol-relative, and empty destinations.
- [ ] Run `node --test --experimental-strip-types tests/rich-text.test.ts` and verify RED because the utility does not exist.
- [ ] Add the recursive fixed node union and pure utility functions.
- [ ] Rerun the focused test and verify GREEN.

### Task 2: Fixed semantic React renderer

**Files:**
- Create: `src/components/topics/inline-content.tsx`
- Modify: `tests/rich-text.test.ts`

**Interfaces:**
- Consumes `RichText` and `isAllowedRichTextHref`.
- Produces `<InlineContent value={...} />` with fixed React elements only.

- [ ] Add source-contract assertions for `dfn`, `abbr`, `code`, `strong`, `em`, `a`, `kbd`, `samp`, and `var`, plus absence of `dangerouslySetInnerHTML`.
- [ ] Verify RED.
- [ ] Implement recursive rendering; unsafe `a` destinations fall back to rendering children without a link.
- [ ] Verify GREEN.

### Task 3: Schema validation and first-definition invariant

**Files:**
- Modify: `scripts/validate-content.mjs`
- Modify: `tests/rich-text.test.ts`

**Interfaces:**
- Validation recursively checks rich-text arrays/nodes across supported prose fields.
- Canonical `dfn.term` values are trimmed, whitespace-normalized, and case-folded for duplicate detection.

- [ ] Add source-contract tests that validation recognizes the exact semantic node set, validates node attributes, rejects unsafe links, and maintains a per-topic definition set.
- [ ] Verify RED.
- [ ] Implement recursive validation and duplicate-definition detection.
- [ ] Verify GREEN.

### Task 4: Integrate renderer and plain-text consumers

**Files:**
- Modify: `src/components/topics/content-block.tsx`
- Modify: `src/components/topics/topic-section.tsx`
- Modify: `src/components/topics/topic-visual.tsx`
- Modify: `src/pages/topic-page.tsx`
- Modify: `src/lib/narration.ts`
- Modify: `scripts/content-utils.mjs`
- Modify: `tests/rich-text.test.ts`

**Interfaces:**
- All rich-capable prose renders through `InlineContent`.
- Narration and search call `flattenRichText` before string composition/indexing.

- [ ] Add contract assertions that the renderer is used in topic block/visual/page surfaces and that narration/search import `flattenRichText`.
- [ ] Verify RED.
- [ ] Integrate `InlineContent` in every rich-capable learner prose field.
- [ ] Flatten values before narration/search string operations.
- [ ] Verify GREEN.

### Task 5: Authoring governance and full verification

**Files:**
- Modify: `docs/content-authoring.md`
- Modify: `README.md` only if architecture documentation needs the new content capability.
- Append: `todo.md`, `changelog.md`, `codemap.json` after successful verification.

- [ ] Document the first-definition-only rule and each allowed node with complete JSON examples, including nested `dfn` + `abbr`.
- [ ] Explicitly prohibit generic decorative strong/em and repeated definitions.
- [ ] Run focused rich-text tests.
- [ ] Run `pnpm check` on `main`.
- [ ] Regenerate and commit discovery artifacts if their bytes change.
- [ ] Verify the permanent GitHub Pages workflow is still triggered by pushes to `main` and completes successfully on the final head.
- [ ] Record exact verification evidence in the append-only project records.
