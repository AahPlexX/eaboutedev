# Intuitive Learning Content Redesign

**Date:** 2026-08-07

## Goal

Make every guide fast to understand, complete enough to build a durable mental model, and technically deep without forcing the learner to decode jargon before the idea itself is clear.

The site must naturally carry a reader from no assumed topic knowledge through practical understanding and into real-world engineering decisions. It must not visibly divide the material into beginner, competent, or professional tiers.

## Teaching contract

Every topic must follow these rules.

1. **Concrete before abstract.** Start important ideas with a recognizable situation, object, question, or small example before introducing the formal term.
2. **Meaning before vocabulary.** A technical term appears only after, or at the same moment as, a plain-language explanation that makes the term useful.
3. **Cause before rule.** Explain why something happens or exists before asking the learner to remember a rule about it.
4. **One dependency at a time.** A sentence or section may rely only on ideas already established in the guide or explained beside the new material.
5. **No knowledge gaps.** Do not remove difficult concepts to make a topic feel easier. Reorder and explain them.
6. **Short route to the mental model.** The opening of each guide must answer: what is this, why does it exist, where does it sit in a real system, and what will the learner be able to do with it?
7. **Examples carry the explanation.** Important abstractions need a concrete example, visual, code/data example, or scenario close to the explanation.
8. **Code must be interpreted.** Explain what the important lines or pieces do and what the system does with them; do not treat a code listing as self-explanatory.
9. **Technical vocabulary remains.** Terms such as transaction, idempotency, DOM, specificity, HEAD, TLS, and invariant remain where they are part of the real subject, but they are introduced in context rather than used as unexplained prerequisites.
10. **Production depth remains inline.** Real trade-offs, failure modes, debugging, performance, security, maintainability, and operational concerns stay in the main learning path instead of being hidden in an advanced appendix.
11. **Plain language is the default.** Prefer common words, active voice, short sentences, short blocks, explicit relationships, and literal wording. Explain necessary jargon immediately.
12. **Fast comprehension over compressed prose.** A shorter sentence is not automatically clearer. Use enough words and examples to remove ambiguity, but do not repeat the same idea without adding information.
13. **Visuals must teach.** A flow must show order, layers must show dependency or containment, comparisons must expose differences, cycles must show repetition, and maps must show relationships. Visual kinds must not all collapse into the same row of boxes and arrows.
14. **Check understanding without homework.** Use small prediction or comprehension checkpoints after major mental-model transitions. The answer must be available immediately and explain why.
15. **Learner-facing UI only.** Homepage and catalog copy must help a reader choose, understand, or continue learning. Internal architecture facts belong in developer documentation.

## Evidence used for the redesign

- W3C cognitive-accessibility guidance favors easy-to-understand words, short sentences, short blocks, unambiguous content, clear images, whitespace, and explanation of implied content.
- W3C step-by-step guidance calls for complete sequences with no omitted steps and examples or illustrations placed with the activity.
- MDN's current learning path introduces web development gently, begins with practical examples, and explicitly avoids overwhelming new learners with technical terminology upfront.

These sources guide presentation and sequencing. They do not replace primary technical sources used to verify the subject matter inside each guide.

## Site-level redesign

### Homepage

Replace implementation-facing claims such as topic-capacity and viewport-floor metrics with learner-facing orientation.

The homepage must make these things obvious within the first screen:

- what the library teaches,
- that a learner can start without knowing the terminology,
- that guides continue into real implementation and production decisions,
- a recommended first guide,
- an obvious path to browse or search.

The system-map visual remains useful but its wording must be concrete and explain what is moving between the browser, network, server, API, and database.

### Catalog

The catalog must help answer "what should I learn next?" rather than describe generated files or application internals.

Topic cards and catalog orientation should expose:

- the question the guide answers,
- expected reading time,
- topic level as an orientation hint rather than a prerequisite gate,
- plain-language summary.

Filtering and search behavior remain unchanged unless a change is required for clarity.

### Topic opening

Each topic hero must communicate:

- a plain-language one-sentence answer to what the subject is,
- why it matters,
- what the reader will understand or be able to do,
- any helpful prior guide without implying the current guide is unusable without it,
- a visual mental model.

The current outcomes remain useful, but their wording should describe concrete abilities rather than abstract mastery.

## Content block redesign

Keep the existing paragraph, steps, cards, code, table, callout, and checklist blocks.

Add one lightweight `checkpoint` block:

```ts
interface CheckpointBlock {
  type: "checkpoint";
  prompt: string;
  answer: string;
  explanation: string;
}
```

It renders as an accessible native disclosure. The prompt is always visible. The learner can think first, then reveal the answer and short explanation. It must not require JavaScript state.

Do not add quizzes, scoring, accounts, progress tracking, or gamification in this pass.

## Visual redesign

Keep the current `TopicVisual` data shape and the five visual kinds. Change the renderer so each kind has a distinct explanatory composition while remaining responsive and accessible.

- `flow`: sequential nodes connected in reading order.
- `layers`: stacked or nested-looking bands with the dependency direction made clear.
- `comparison`: balanced columns or rows designed for side-by-side differences; no directional arrows between peers.
- `cycle`: closed loop presentation on wide layouts with a clear repeat cue; linear ordered fallback on narrow layouts.
- `map`: relationship cluster/network presentation; no false implication that node 2 always follows node 1.

All layouts must preserve DOM reading order, work at 320 CSS pixels, support zoom and text spacing, and avoid meaning that depends only on color or position.

## Guide rewrite contract

### How the Web Works

Use one familiar action—entering a web address and pressing Enter—as the continuous story. Establish browser, website/server, request, and response before DNS/TLS/HTTP terminology. Then reveal the actual network layers and preserve the existing debugging and rendering depth.

### HTML, CSS, and JavaScript

Begin with one tiny page and one visible outcome. Establish HTML as content/meaning, CSS as appearance/layout, and JavaScript as behavior/change before DOM, cascade, events, state, effects, responsive architecture, container queries, and progressive enhancement. Keep all current professional concerns, but introduce them after the three-language mental model is secure.

### Git and GitHub

Begin with a project that changes several times and the problem of knowing what changed, returning to an earlier state, and sharing work safely. Establish saved snapshots before commit graphs, references, HEAD, staging, branches, remotes, merging/rebasing, pull requests, Actions, and recovery. Commands must always be tied to the state transition they cause.

### APIs and Data Exchange

Begin with two pieces of software needing to ask each other for something. Establish request, input, output, and agreed rules before `contract`, REST, schema, idempotency, pagination, authentication/authorization, retries, webhooks, GraphQL, event streams, and compatibility policy. Preserve production failure and security depth.

### The 7 Types of Databases

Begin with familiar questions a system needs to answer: save an account, find an order, load a session, follow relationships, graph measurements over time, search words, and find similar items. Introduce each database family as a response to a recognizable question shape. Formal concepts such as joins, transactions, aggregate boundaries, invariants, inverted indexes, embeddings, and polyglot persistence follow the concrete need they solve.

## Quality gates

Every rewritten guide must satisfy all of the following:

- No section opens with unexplained specialist vocabulary.
- Every major technical term is defined at first meaningful use in the body, not only in the glossary.
- Every section answers why the material matters or what problem it solves.
- Each guide contains at least two concrete examples or scenarios before its deepest abstraction-heavy material.
- Each guide contains at least two `checkpoint` blocks placed after meaningful conceptual transitions.
- Code/data examples include a plain-language explanation of the important pieces.
- The glossary reinforces terms already introduced; it is not required to understand earlier sections.
- Existing authoritative sources remain or are replaced only by stronger current primary/official sources.
- No new topic is added during this pass.
- Generated search/catalog/registry artifacts are regenerated and committed.
- `pnpm check` must pass with zero test, type, lint, validation, generated-artifact, or build failures before completion is claimed.

## Non-goals

- No user accounts.
- No learning progress database.
- No scoring or gamification.
- No video course system.
- No new dependency unless the existing stack cannot satisfy an approved requirement.
- No expansion beyond the five launch topics in this pass.

## Success condition

A reader should be able to open any of the five current guides without knowing the subject's vocabulary, quickly form a correct mental model, continue without hidden prerequisite gaps, and finish with the same real technical concepts, trade-offs, and production considerations an experienced developer needs.