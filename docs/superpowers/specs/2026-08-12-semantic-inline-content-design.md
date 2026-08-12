# Semantic Inline Content Design

**Date:** 2026-08-12

## Goal

Allow authored topic prose to express precise inline HTML semantics without raw HTML, while making the first defining occurrence of a term uniquely meaningful and preventing repeated styling from diluting emphasis.

## Decision

Use a typed structured rich-text model rendered as ordinary React elements. Do not accept raw HTML strings, do not use `dangerouslySetInnerHTML`, and do not add DOMPurify because this repository owns the JSON content schema and can avoid an HTML parsing/sanitization surface entirely.

## Supported inline semantics

- `dfn`: the single defining instance of a canonical term in a topic.
- `abbr`: an abbreviation or acronym; the expansion is explicit in `title`. It may be nested inside `dfn` at the first definition.
- `code`: inline computer-recognizable text such as an element, attribute, API name, command, filename, property, or value.
- `strong`: genuine importance, seriousness, or urgency only.
- `em`: genuine stress emphasis only.
- `a`: a real hyperlink. External links must use HTTPS. Internal links may use `/`, `./`, `../`, `#`, or the application hash route. No arbitrary schemes are accepted.
- `kbd`: user input such as a keyboard key or command the person enters.
- `samp`: literal program or system output.
- `var`: a variable or placeholder.

`b`, `i`, arbitrary element names, arbitrary attributes, `className`, inline styles, event handlers, and raw HTML are not part of the authoring model.

## Data shape

Existing strings remain valid. Rich text is an ordered array containing strings and semantic nodes. Nodes may contain nested rich text so `dfn` can contain `abbr` without introducing raw markup.

A defining node carries a separate canonical `term` field. Validation normalizes that field and rejects a second `dfn` with the same canonical term anywhere in the same topic.

## First-definition rule

A term receives `dfn` only at the passage that actually defines it. The first textual appearance is not automatically a definition. Later mentions remain ordinary text unless another semantic element is independently justified, for example an inline code identifier.

Abbreviations should normally be expanded in plain language at first use. When the abbreviation itself is the term being defined, nest `abbr` inside `dfn`.

## Rendering and safety

The React renderer maps a fixed node union to fixed React elements. It never accepts an arbitrary tag name or HTML string. Link destinations are checked before rendering; invalid destinations are rendered as plain text rather than as links.

External links open normally in the same browsing context unless the content model is expanded later through a separately reviewed requirement. No content node controls `target`, `rel`, CSS classes, styles, or events.

## Plain-text consumers

Narration and search indexing flatten rich text into visible plain text. Semantic wrappers never appear in spoken narration or MiniSearch documents. For abbreviations, visible text is used; the expansion remains represented by surrounding authored prose rather than being injected automatically into narration.

## Backward compatibility

All current plain-string topic JSON remains valid. Authors opt into rich text only where semantics improve meaning. No bulk conversion is required.

## Verification

Tests must prove:

1. plain strings flatten unchanged;
2. nested semantic nodes flatten in source order;
3. supported links are accepted and unsafe schemes are rejected;
4. the renderer contains the fixed semantic element set and no `dangerouslySetInnerHTML`;
5. content validation rejects duplicate canonical `dfn` terms within one topic;
6. content validation rejects malformed nodes and unsafe links;
7. narration and search generation use flattened text;
8. the authoring contract requires first-definition-only use and explains each supported semantic element.
