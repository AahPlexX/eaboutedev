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
5. **Make visible:** use flows for order, layers for dependency/containment, comparisons for peer differences, cycles for repetition, maps for relationships, and syntax anatomy when the structure of a code or configuration example is itself part of what the learner must understand.
6. **Apply:** include interpreted steps, code/data examples, decision tables, scenarios, or checklists that turn explanation into action where the subject benefits from them.
7. **Check:** add a lightweight checkpoint after at least two important mental-model transitions.
8. **Protect:** explain common mistakes, failure modes, boundaries, and how to identify the earliest failing stage where applicable.
9. **Operate:** continue naturally into real-world performance, security, maintainability, deployment, scaling, and recovery considerations that materially belong to the subject.
10. **Verify:** define a reinforcing glossary and link to standards bodies or official project/platform documentation.
11. **Continue:** add only related slugs that exist in the registry.

## Semantic inline content

Learner-facing prose may remain a plain JSON string. Use structured rich text only when the inline HTML meaning materially helps the reader. A rich-text value is an ordered array of normal text fragments and approved semantic nodes. The renderer does not accept raw HTML.

### The first-definition rule

Use `dfn` only for the passage that actually defines a term. A canonical term may have **only once per topic** as a `dfn` node. Later mentions stay normal text unless another semantic element is independently correct, such as `code` for an API identifier.

Do not mechanically style the first textual appearance. The defining instance is the sentence that establishes the meaning. The validator normalizes the `term` value and rejects a second defining instance for the same term anywhere in the topic.

For an abbreviation or acronym, write its full expansion in the prose at first use. When the abbreviation itself is the term being defined, nest `abbr` inside `dfn`:

```json
[
  "The ",
  {
    "type": "dfn",
    "term": "Document Object Model",
    "children": [
      {
        "type": "abbr",
        "title": "Document Object Model",
        "children": "DOM"
      }
    ]
  },
  " (Document Object Model) is the browser's object representation of the document."
]
```

### Approved semantic nodes

- `dfn`: the single defining instance of a canonical term. Requires `term` and `children`.
- `abbr`: an abbreviation or acronym. Requires the full expansion in `title` and visible `children`.
- `code`: inline computer-recognizable text such as an element, attribute, API name, command, filename, property, or value.
- `strong`: genuine importance, seriousness, or urgency. Do not use it as a generic bold style.
- `em`: genuine stress emphasis. Do not use it as a generic italic style.
- `a`: a real hyperlink. External destinations must use HTTPS. Internal `/`, `#`, `./`, and `../` destinations are allowed.
- `kbd`: user input, including a keyboard key or literal command the person enters.
- `samp`: literal program, terminal, or system output.
- `var`: a variable or placeholder whose value changes.

Every semantic node requires `children`. Do not add `b`, `i`, arbitrary tag names, raw HTML, `className`, inline styles, event handlers, `target`, `rel`, or arbitrary attributes. If the content model does not expose an attribute, topic JSON cannot author it.

Example with several independent semantics:

```json
[
  "Press ",
  { "type": "kbd", "children": "Enter" },
  " after running ",
  { "type": "code", "children": "pnpm check" },
  ". A successful run may print ",
  { "type": "samp", "children": "Found 0 warnings and 0 errors." },
  " The placeholder ",
  { "type": "var", "children": "PORT" },
  " represents the port number."
]
```

Semantic markup must preserve emphasis scarcity. Do not wrap every technical noun in `code`, every important-looking phrase in `strong`, or every sentence in `em`. Use each element only when its HTML meaning is true at that exact location.

Narration and search flatten rich text back to visible plain language. Semantic node syntax is never spoken or indexed.

## Supported content blocks

- `paragraph`
- `steps`
- `cards`
- `code`
- `anatomy`
- `table`
- `callout`
- `checklist`
- `checkpoint`

### Syntax anatomy

Use a syntax anatomy block when the learner benefits from seeing a code, command, header, query, selector, or configuration expression split into meaningful parts. It is a Code Dissection Map: the complete expression stays visible, and each important segment receives a short label and an explanation of what that part controls or means.

Do not add syntax anatomy merely for visual variety. Use it when token boundaries, nesting, argument positions, operators, attributes, options, or protocol fields carry meaning that a plain code listing would make the learner infer.

```json
{
  "type": "anatomy",
  "title": "A fetch request has independent parts",
  "language": "JavaScript",
  "caption": "Each labeled segment changes a different part of the request.",
  "segments": [
    {
      "code": "fetch(",
      "label": "Request API",
      "explanation": "Starts a browser fetch operation."
    },
    {
      "code": "\"/api/profile\"",
      "label": "Target",
      "explanation": "Identifies the resource the browser will request."
    }
  ]
}
```

Keep segment order identical to the visible expression. Explain meaning rather than punctuation. The narration system reads the title, caption, labels, and explanations; it does not read literal source punctuation character by character.

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
