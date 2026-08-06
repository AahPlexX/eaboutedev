# Topic authoring contract

Each topic is one UTF-8 JSON document in `public/content/topics`. The filename and `slug` must match. A topic is publishable only when it gives a new reader a complete mental model and gives an experienced reader explicit trade-offs, failure modes, and authoritative references.

## Required sequence

1. **Orient:** title, summary, prerequisites, outcomes, and a hero visual explain the whole system.
2. **Decompose:** sections proceed in dependency order; a later section may rely only on ideas already introduced.
3. **Make visible:** use flows, layers, comparisons, cycles, or maps when relationships are easier to see than describe.
4. **Apply:** include steps, examples, decision tables, or checklists that turn explanation into action.
5. **Protect:** name common mistakes, failure modes, and boundaries.
6. **Verify:** define a glossary and link to standards bodies or official project/platform documentation.
7. **Continue:** add only related slugs that exist in the registry.

## Supported content blocks

- `paragraph`
- `steps`
- `cards`
- `code`
- `table`
- `callout`
- `checklist`

Supported visual kinds are `flow`, `layers`, `comparison`, `cycle`, and `map`.

## Quality floor

- Define unfamiliar terms before using them as prerequisites.
- Prefer direct sentences and concrete examples.
- Separate facts, recommendations, and trade-offs.
- Never call a technology “best” without a named workload and constraints.
- Explain what happens before and after every major step.
- Use source links that remain useful outside this site.
- Run `pnpm check` and commit every regenerated artifact with the topic source.
