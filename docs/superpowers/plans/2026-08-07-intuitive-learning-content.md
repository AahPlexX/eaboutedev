# Intuitive Learning Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the five launch guides and their presentation so a reader can learn each subject quickly from no assumed vocabulary through complete real-world engineering depth without hidden conceptual gaps.

**Architecture:** Preserve the existing JSON-driven topic system, generated catalog/search/registry pipeline, React rendering stack, and five visual-kind data model. Add one native-disclosure `checkpoint` content block, make the existing visual kinds render with distinct semantics, replace developer-facing discovery copy with learner-facing orientation, then rewrite each topic in concrete-to-complete dependency order.

**Tech Stack:** React 19, TypeScript 7, Vite 8, Tailwind CSS 4, pnpm 11, Oxlint, Node test runner, JSON topic documents.

## Global Constraints

- Work only on authoritative `main`.
- Use pnpm only.
- Do not add dependencies for this redesign.
- Do not add new topics.
- Preserve authoritative/official technical sources unless replacing one with a stronger current primary source.
- Do not remove difficult concepts merely to simplify wording.
- Introduce necessary technical vocabulary only after or beside its plain-language meaning.
- Keep production trade-offs, failure modes, security, performance, debugging, and operational concerns in the main learning path.
- Homepage and catalog copy must be learner-facing, not implementation-facing.
- All visual layouts must preserve DOM reading order, work at 320 CSS pixels, support zoom/text spacing, and not depend only on color or position.
- Each guide must contain at least two meaningful checkpoint blocks.
- Regenerate and commit generated catalog, search, and topic-registry artifacts.
- `pnpm check` must pass before completion is claimed.

---

### Task 1: Add the comprehension checkpoint content primitive

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/components/topics/content-block.tsx`
- Modify: `scripts/validate-content.mjs`
- Test: `tests/content-blocks.test.ts`

**Interfaces:**
- Produces: `CheckpointBlock` with `{ type: "checkpoint"; prompt: string; answer: string; explanation: string }`.
- Produces: renderer support for `checkpoint` using native `<details>` and `<summary>`.
- Validation must reject checkpoint blocks with missing/empty prompt, answer, or explanation.

- [ ] **Step 1: Add a failing source-level regression test**

Create `tests/content-blocks.test.ts` that reads `src/types/content.ts`, `src/components/topics/content-block.tsx`, and `scripts/validate-content.mjs` and asserts all three contain explicit `checkpoint` support, including native `<details>` rendering and validation for `prompt`, `answer`, and `explanation`.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm test tests/content-blocks.test.ts`
Expected: FAIL because `checkpoint` does not yet exist.

- [ ] **Step 3: Add the type and renderer**

In `src/types/content.ts`, add:

```ts
export interface CheckpointBlock {
  type: "checkpoint";
  prompt: string;
  answer: string;
  explanation: string;
}
```

Add `CheckpointBlock` to `ContentBlock`.

In `ContentBlockView`, render:

```tsx
case "checkpoint":
  return (
    <details className="checkpoint">
      <summary>
        <span>Check your understanding</span>
        <strong>{block.prompt}</strong>
      </summary>
      <div className="checkpoint-answer">
        <p><strong>Answer:</strong> {block.answer}</p>
        <p>{block.explanation}</p>
      </div>
    </details>
  );
```

- [ ] **Step 4: Extend JSON validation**

Update the existing block validation branch in `scripts/validate-content.mjs` so `checkpoint` is recognized and its three required strings must be non-empty.

- [ ] **Step 5: Run the focused test**

Run: `pnpm test tests/content-blocks.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

Commit message: `feat: add learning checkpoints`

---

### Task 2: Make visual kinds explain different relationships

**Files:**
- Modify: `src/components/topics/topic-visual.tsx`
- Modify: `src/index.css`
- Test: `tests/topic-visual.test.ts`

**Interfaces:**
- Consumes: existing `TopicVisual.kind` values `flow | layers | comparison | cycle | map`.
- Produces: distinct DOM class/connector behavior for each visual kind without changing topic JSON schema.

- [ ] **Step 1: Add a failing renderer regression test**

Create `tests/topic-visual.test.ts` to assert:

- flow renders directional connectors,
- layers does not use sequential arrows between peer bands,
- comparison does not use sequential arrows,
- cycle includes an explicit repeat/cycle cue,
- map does not imply universal sequence with arrows.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm test tests/topic-visual.test.ts`
Expected: FAIL because the current renderer gives every visual the same sequential arrow treatment.

- [ ] **Step 3: Refactor `TopicVisualPanel` by kind**

Keep one accessible figure and the same node data. Render connectors only where the visual relationship calls for them:

- flow: next-direction arrows,
- layers: stacked numbered bands without inter-node arrows,
- comparison: peer cards without arrows,
- cycle: ordered nodes plus a visible textual/graphic repeat cue,
- map: node cluster without sequence arrows.

DOM node order must remain the JSON node order for predictable reading.

- [ ] **Step 4: Add responsive semantic layouts in CSS**

Add dedicated `.visual-flow`, `.visual-layers`, `.visual-comparison`, `.visual-cycle`, and `.visual-map` layout rules. Narrow layouts must become a readable single-column sequence without clipping. Avoid absolute-positioned text and fixed heights.

- [ ] **Step 5: Run the focused test**

Run: `pnpm test tests/topic-visual.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

Commit message: `feat: make topic visuals explanatory`

---

### Task 3: Replace implementation-facing discovery copy with learner orientation

**Files:**
- Modify: `src/pages/home-page.tsx`
- Modify: `src/pages/topics-page.tsx`
- Modify: `src/components/topics/topic-card.tsx`
- Modify: `src/pages/topic-page.tsx`
- Modify: `src/index.css`
- Test: `tests/learning-copy.test.ts`

**Interfaces:**
- Consumes: existing `TopicCatalogEntry` and `TopicDocument` fields.
- Produces: learner-facing homepage, catalog, card, and topic-opening copy with no new stored fields.

- [ ] **Step 1: Add a failing copy-contract test**

Create `tests/learning-copy.test.ts` asserting the rendered source no longer contains learner-irrelevant phrases such as `5,000 topic-ready architecture`, `320px minimum layout floor`, or `The catalog count is generated from source content`, and that it includes a clear recommended starting path to `how-the-web-works`.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm test tests/learning-copy.test.ts`
Expected: FAIL on the existing implementation-facing copy.

- [ ] **Step 3: Rewrite homepage orientation**

Use concise learner-facing copy along these lines:

- Eyebrow: `Learn the system, not isolated definitions`
- H1: `Understand web development without needing the jargon first.`
- Lede: explain that each guide starts with a concrete mental model and continues into code, trade-offs, debugging, and production decisions.
- Primary action: `Start with how the web works`
- Secondary action: `Browse all topics`
- Replace implementation stats with three learner promises such as `Start with no topic vocabulary`, `Follow connected explanations`, `Finish with real-world decisions`.

Keep `HeroMap`, but describe what travels through the system rather than merely naming systems.

- [ ] **Step 4: Rewrite catalog orientation**

Replace generated-file implementation language with guidance that the learner can search by the question or concept they are trying to understand and can start anywhere because each guide introduces its required vocabulary in context.

- [ ] **Step 5: Improve topic-card action language**

Keep category, level, time, and summary. Replace generic `Open guide` wording with a clearer learning action such as `Learn this topic`.

- [ ] **Step 6: Improve topic opening orientation**

In `TopicPage`, relabel the outcomes block to an immediate learner-facing statement such as `By the end, you will be able to:` and expose helpful prerequisites as `Helpful before this guide` rather than hidden metadata or hard requirements. Do not add a new route or modal.

- [ ] **Step 7: Run the focused test**

Run: `pnpm test tests/learning-copy.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

Commit message: `feat: orient learning around user questions`

---

### Task 4: Strengthen the topic-authoring quality contract

**Files:**
- Modify: `docs/content-authoring.md`
- Modify: `scripts/validate-content.mjs`
- Test: `tests/content-quality.test.ts`

**Interfaces:**
- Produces: documented and partially machine-enforced quality floor for concrete-first sequence and checkpoints.

- [ ] **Step 1: Add failing quality-contract tests**

Create `tests/content-quality.test.ts` that loads all files in `public/content/topics` and asserts each topic has at least two checkpoint blocks after the rewrite. Also assert the authoring document includes the phrases/ideas `concrete before abstract`, `meaning before vocabulary`, and `cause before rule`.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm test tests/content-quality.test.ts`
Expected: FAIL because current topics do not contain checkpoints and the current authoring contract is weaker.

- [ ] **Step 3: Rewrite the authoring contract**

Preserve the existing orient/decompose/make-visible/apply/protect/verify/continue structure but strengthen it with the approved teaching contract. Explicitly require first-use definitions, concrete examples before abstraction-heavy passages, explanation of why a mechanism exists, interpreted code, and at least two checkpoints per substantial guide.

- [ ] **Step 4: Add checkpoint-count validation**

In `scripts/validate-content.mjs`, require at least two `checkpoint` blocks per topic. Keep this structural rather than attempting unreliable automatic jargon scoring.

- [ ] **Step 5: Leave the test red until topic rewrites are complete**

This task's full test is expected to remain failing until Tasks 5–9 add the required checkpoints. The document-specific assertions should pass after this task.

- [ ] **Step 6: Commit**

Commit message: `docs: strengthen learning content contract`

---

### Task 5: Rewrite How the Web Works around one complete request story

**Files:**
- Modify: `public/content/topics/how-the-web-works.json`

**Interfaces:**
- Produces: revised authoritative topic document using the existing schema plus `checkpoint`.

- [ ] **Step 1: Rewrite the opening mental model**

Start with entering a URL and pressing Enter. Explain browser, destination/server, request, and response in plain language before formal network terminology.

- [ ] **Step 2: Re-sequence sections without dropping technical depth**

Use this dependency order:

1. One click/Enter begins a round trip.
2. Read the web address (URL) in understandable pieces.
3. Find the destination (introduce DNS after the need is clear).
4. Create a safe path (transport and TLS).
5. Ask for a resource and receive an outcome (HTTP).
6. Turn returned files into the page (rendering).
7. Diagnose failures by finding the earliest broken stage.

Keep HTTP/1.1, HTTP/2, HTTP/3/QUIC distinctions at the point where transport is already understood.

- [ ] **Step 3: Add at least two checkpoints**

Examples:

- After DNS: if the browser cannot learn an address for the host, can an HTTP 404 exist? Answer: no; HTTP has not started with that destination.
- After HTTP: if a server returns 404, which earlier stages have already worked far enough to deliver that response?

- [ ] **Step 4: Verify first-use definitions and interpreted examples**

Ensure URL, domain, DNS, IP address, transport, TLS, HTTP, status code, header, DOM/rendering terms are explained in the body before deeper use.

- [ ] **Step 5: Commit**

Commit message: `content: make web request lifecycle intuitive`

---

### Task 6: Rewrite HTML, CSS, and JavaScript around one visible page

**Files:**
- Modify: `public/content/topics/html-css-and-javascript.json`

**Interfaces:**
- Produces: revised topic document using one small page as the continuous example.

- [ ] **Step 1: Establish the three jobs before specialist vocabulary**

Open with one tiny page and the visible outcome:

- HTML says what the content is and how it is structured.
- CSS controls how it looks and lays out.
- JavaScript reacts and changes behavior/state when needed.

- [ ] **Step 2: Re-sequence technical depth**

Use this dependency order:

1. One page, three different jobs.
2. HTML: meaning, elements, attributes, links/buttons/forms, accessibility foundation.
3. CSS: rules, selectors, cascade introduced as conflict resolution, then flow/flex/grid, responsive/container-query concepts.
4. JavaScript: events and change, then DOM, state, effects/browser APIs.
5. The layers cooperate through stable boundaries and progressive enhancement.
6. Responsive/adaptive behavior and accessibility under real constraints.
7. Complete small disclosure example and explain why native `<details>` needs no JavaScript.

- [ ] **Step 3: Replace expert-first examples at the beginning**

Do not lead CSS with container-query syntax or `cqi`. First show a simple selector/declaration and a visible change; introduce responsive/container features later.

- [ ] **Step 4: Add at least two checkpoints**

Include one about choosing HTML/CSS/JS responsibility and one about whether JavaScript is necessary for a native behavior.

- [ ] **Step 5: Commit**

Commit message: `content: teach browser languages from concrete roles`

---

### Task 7: Rewrite Git and GitHub around saved project states

**Files:**
- Modify: `public/content/topics/git-and-github.json`

**Interfaces:**
- Produces: revised topic document tying every command to a visible state transition.

- [ ] **Step 1: Establish the problem before the graph model**

Start with a project changed three times and the practical questions: what changed, what was the last working version, how can two people work safely, and how can changes be reviewed before becoming authoritative?

- [ ] **Step 2: Re-sequence concepts**

Use this dependency order:

1. Git remembers project states.
2. Working files → selected next snapshot (staging/index) → commit.
3. Commits connect to earlier commits; now introduce history graph, parent, branch, HEAD, tag.
4. Branches and integration: merge/rebase/cherry-pick/revert with consequences.
5. Another repository: remote, fetch, push, remote-tracking reference, pull.
6. GitHub collaboration: PRs, review, protection/policy.
7. Actions: events → jobs → evidence → delivery.
8. Recovery by identifying whether work is uncommitted, local-only, or published.

- [ ] **Step 3: Interpret command sequences as state changes**

Every shell block explanation must say what Git knows before and after the command sequence.

- [ ] **Step 4: Add at least two checkpoints**

Include one distinguishing commit vs branch and one distinguishing fetch vs pull/push.

- [ ] **Step 5: Commit**

Commit message: `content: teach git through project state changes`

---

### Task 8: Rewrite APIs and Data Exchange around two programs communicating

**Files:**
- Modify: `public/content/topics/apis-and-data-exchange.json`

**Interfaces:**
- Produces: revised topic document that introduces contract vocabulary only after the communication need is visible.

- [ ] **Step 1: Establish a concrete software conversation**

Use a browser/app asking an invoice service to create or retrieve an invoice. Explain request, input, response, outcome, and agreed rules in ordinary language first; then name the complete agreement an API contract.

- [ ] **Step 2: Re-sequence depth**

Use this dependency order:

1. Two pieces of software need a predictable way to communicate.
2. Operations, inputs, outcomes, and errors form the contract.
3. HTTP resource operations and status meaning.
4. JSON/data shape, schema, validation, and structured errors.
5. Identity and permission: authentication vs authorization, then rate limits/audit.
6. Real network behavior: pagination, caching, timeouts, retries, idempotency.
7. Choose request-response, GraphQL, webhooks, event streams, or local APIs based on interaction shape.
8. Evolve contracts without silent breakage.

- [ ] **Step 3: Define production vocabulary at first use**

Explicitly explain schema, idempotency, cursor, backoff, jitter, webhook, event stream/broker, compatibility, deprecation, and contract test when first introduced.

- [ ] **Step 4: Add at least two checkpoints**

Include one distinguishing authentication vs authorization and one about when a retry could duplicate a write without idempotency protection.

- [ ] **Step 5: Commit**

Commit message: `content: teach APIs through predictable conversations`

---

### Task 9: Rewrite The 7 Types of Databases around question shapes

**Files:**
- Modify: `public/content/topics/the-seven-types-of-databases.json`

**Interfaces:**
- Produces: revised topic document where each family is introduced as an answer to a recognizable storage/retrieval problem.

- [ ] **Step 1: Replace the expert-first selection opening**

Open with seven familiar system questions:

1. Which customer owns this order and can both change safely? → relational.
2. Can I load this whole nested content item together? → document.
3. I already know the exact session/cache key; give me its value. → key-value.
4. How is this person/product/device connected to others? → graph.
5. How did this measurement change over time? → time-series.
6. Which records best match these words and filters? → search.
7. Which items are most similar in meaning/features? → vector.

Then explain that database families optimize different question shapes and guarantees.

- [ ] **Step 2: Introduce selection criteria in plain language**

Translate `access patterns`, `guarantees`, and `invariants` before naming them: what must be saved, what questions must be fast, what changes happen together, what must never become inconsistent, and what operating limits matter.

- [ ] **Step 3: Keep every current family and production trade-off**

Preserve relational joins/constraints/transactions, document aggregate boundaries/schema, key-value expiry/correctness, graph traversal, time-series retention/downsampling, search inverted indexes/ranking, vector embeddings/similarity limits, and polyglot persistence/synchronization costs.

- [ ] **Step 4: Add at least two checkpoints**

Include one matching a scenario to a database family and one deciding when a specialized secondary store is justified instead of replacing the authoritative primary store.

- [ ] **Step 5: Commit**

Commit message: `content: teach database families through question shapes`

---

### Task 10: Regenerate artifacts and verify the complete redesign

**Files:**
- Regenerate: `src/generated/topic-catalog.ts`
- Regenerate: `public/search/topic-search-index.json`
- Regenerate: `docs/topic-registry.json`
- Modify: `changelog.md`
- Modify: `todo.md`
- Modify: `codemap.json`

**Interfaces:**
- Consumes: all rewritten topic source files and new content type support.
- Produces: deterministic generated content matching source and Turn 6 append-only project records.

- [ ] **Step 1: Run generation**

Run: `pnpm run generate`
Expected: generated catalog, search corpus, and topic registry update for the rewritten topic hashes/content.

- [ ] **Step 2: Run content validation**

Run: `pnpm run validate:content`
Expected: PASS including checkpoint schema/count requirements and existing relationship/source/date limits.

- [ ] **Step 3: Run focused tests**

Run: `pnpm test`
Expected: all existing and new tests PASS.

- [ ] **Step 4: Run TypeScript and lint**

Run: `pnpm run typecheck && pnpm run lint`
Expected: zero errors/warnings under existing denied-warning policy.

- [ ] **Step 5: Run production build**

Run: `pnpm run build`
Expected: Vite production build exits 0 and emits `dist` using the existing `/eaboutedev/` base.

- [ ] **Step 6: Run the authoritative all-in-one gate**

Run: `pnpm check`
Expected: exit 0 with generation, content validation, exact-version validation, generated-artifact check, tests, typecheck, lint, and build all successful.

- [ ] **Step 7: Append Turn 6 project records**

Append, never rewrite prior history:

- `changelog.md`: content-learning redesign, five rewritten guides, checkpoint block, distinct visual semantics, learner-facing discovery copy, and verification evidence.
- `todo.md`: mark the redesign tasks complete only when `pnpm check` evidence exists; keep any deployment/live verification item factual.
- `codemap.json`: add a Turn 6 entry mapping the content schema, visual renderer, learner-facing pages, five topic files, authoring contract, tests, and generated artifacts.

- [ ] **Step 8: Commit**

Commit message: `docs: record intuitive learning redesign`

- [ ] **Step 9: Verify authoritative branch state**

Confirm `main` is the only retained branch or reconcile any retained branch to the final `main` head. Compare refs and require `ahead_by: 0` and `behind_by: 0` for any retained non-main branch.
