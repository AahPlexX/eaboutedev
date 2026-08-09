# Topic authoring contract

> **Read `NORTHSTAR.md` first.** The North Star is the canonical definition of educational quality and project intent. This file defines the current topic encoding and practical authoring contract. Structural compliance with this file does not make a topic publishable if it fails the North Star quality standard.

Each topic is one UTF-8 JSON document in `public/content/topics`. The filename and `slug` must match. A topic is publishable only when a reader can enter without knowing the topic vocabulary, form a correct mental model quickly, and continue into the real technical details, trade-offs, failure modes, and production decisions without hidden knowledge gaps.

The sequence and quality rules below describe outcomes that the current content system must support; they are **not a demand that unrelated topics share identical headings, section counts, examples, or visual patterns**. Let the subject determine its natural teaching shape while preserving the North Star invariants.

## Teaching rules

1. **Concrete before abstract.** Begin an important idea with a recognizable situation, object, question, visible result, or small example before asking the reader to hold an abstraction in memory.
2. **Meaning before vocabulary.** Introduce a specialist term only after, or beside, a plain-language explanation that makes the term useful. The glossary reinforces meaning; it must never be the first place a reader can discover what an earlier sentence meant.
3. **Cause before rule.** Explain why a mechanism exists or why an outcome happens before presenting a rule to remember.
4. **One dependency at a time.** A sentence or section may rely only on ideas already introduced in the guide or explained beside the new material.
5. **Do not remove depth to create simplicity.** Reorder difficult ideas and explain them. Keep the real terminology, edge cases, trade-offs, debugging, security, performance, and operating concerns.
6. **Interpret examples.** Code, commands, requests, schemas, and data examples must explain the important pieces and what the system does with them. A listing is not self-explanatory.
7. **Use plain language by default.** Prefer common words, active voice, short sentences, short blocks, literal wording, and explicit relationships. Use jargon when it is the correct term, then define it immediately.
8. **Check understanding without turning the guide into homework.** Each substantial guide must include at least two `checkpoint` blocks after meaningful conceptual transitions. The answer and explanation must be immediately revealable.

## Required sequence

The following is a dependency sequence, not a mandatory heading template. Several stages may share a section when that is clearer, and a complex subject may need multiple sections within one stage.

1. **Orient:** answer what this is, why it exists, where it sits in a real system, what the reader will be able to do, and what prior knowledge is merely helpful rather than mandatory.
2. **Show something concrete:** establish the first mental model with a familiar scenario, small example, visible outcome, or real question.
3. **Decompose:** proceed in dependency order; a later section may rely only on ideas already introduced.
4. **Name the real terms:** introduce formal vocabulary at the point where it gives a useful name to an idea the reader can already understand.
5. **Make visible:** use flows for order, layers for dependency/containment, comparisons for peer differences, cycles for repetition, and maps for relationships when a visual materially improves understanding.
6. **Apply:** include interpreted steps, code/data examples, decision tables, scenarios, or checklists that turn explanation into action where the subject benefits from them.
7. **Check:** add a lightweight checkpoint after at least two important mental-model transitions.
8. **Protect:** explain common mistakes, failure modes, boundaries, and how to identify the earliest failing stage where applicable.
9. **Operate:** continue naturally into real-world performance, security, maintainability, deployment, scaling, and recovery considerations that materially belong to the subject.
10. **Verify:** define a reinforcing glossary and link to standards bodies or official project/platform documentation.
11. **Continue:** add only related slugs that exist in the registry.

## Supported content blocks

- `paragraph`
- `steps`
- `cards`
- `code`
- `table`
- `callout`
- `checklist`
- `checkpoint`

A checkpoint has this shape:

```json
{
  "type": "checkpoint",
  "prompt": "If this earlier stage fails, can the later stage have returned a result?",
  "answer": "No.",
  "explanation": "The later stage depends on the earlier stage completing far enough for communication to continue."
}
```

Supported visual kinds are `flow`, `layers`, `comparison`, `cycle`, and `map`. Select the kind from the relationship being taught rather than visual variety. A topic does not need a visual merely to match another topic.

## Quality floor

These checks supplement rather than replace the fuller quality dimensions in `NORTHSTAR.md`.

- No section may open with unexplained specialist vocabulary.
- Define every major technical term at first meaningful use in the body.
- Explain what problem a mechanism solves before detailing how it works.
- Include enough concrete examples or scenarios to establish the mental model before the guide reaches its most abstraction-heavy material; do not optimize for a fixed example count when the subject needs more.
- Include at least two `checkpoint` blocks per substantial guide.
- Explain what happens before and after every major step.
- Tie commands to the state change they cause.
- Tie API/database choices to an explicit workload or question shape.
- Separate facts, recommendations, and trade-offs.
- Never call a technology “best” without a named workload and constraints.
- Prefer authoritative technical sources; do not weaken source quality for easier prose.
- Use source links that remain useful outside this site.
- Keep the topic's source date/current-behavior claims honest about the actual researched version or working date.
- Run `pnpm check` and commit every regenerated artifact with the topic source.
