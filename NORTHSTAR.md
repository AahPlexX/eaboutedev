# Everything About Development — North Star

**Status:** Governing content-quality standard  
**Applies to:** Every model, agent, human contributor, topic addition, topic rewrite, and curriculum expansion in this repository.  
**Canonical scope:** The educational quality of `public/content/topics/**` and every change that affects how those topics are discovered, understood, narrated, connected, or verified.

This document defines what this project means by **quality**. It is intentionally **not a topic template**. Different subjects have different natural shapes. A networking guide should not be forced into the same outline as a CSS guide, a database guide, or a testing guide. What must remain consistent is the quality of the reasoning, teaching, evidence, integration, and learner experience.

If another repository document appears to conflict with this one about educational quality, **this North Star governs**. `docs/content-authoring.md` governs the current topic file/block contract. Machine validators govern structural validity. Those are implementation constraints; this document governs whether the resulting topic is actually worthy of publication.

Do not edit or weaken this document merely to make a proposed topic easier to generate or validate. Changes to the North Star must represent an intentional change in project standards.

---

## The product promise

Everything About Development is intended to function as a connected, human-readable source of truth for web development.

A publishable topic must be able to serve two people at once:

- A learner encountering the subject for the first time must be able to enter without hidden vocabulary, missing prerequisites, or unexplained jumps.
- An experienced developer must be able to trust that the material continues into the real mechanism, constraints, trade-offs, failure modes, and production consequences instead of stopping at a simplified analogy.

The project is not satisfied by content that is merely correct sentence-by-sentence. A topic can contain no obvious falsehoods and still be low quality if it leaves conceptual gaps, teaches facts out of dependency order, presents code without interpretation, hides important constraints, uses obsolete guidance, or gives a novice a model that must later be unlearned.

The goal is **correct understanding that compounds**: every explanation should make the next explanation easier and more accurate.

---

# The quality standard

The following qualities are invariants. Their expression should adapt to the subject, but their substance must not disappear.

## 1. Epistemic integrity — the topic must deserve trust

A topic must distinguish what is known, what is specified, what is conventional, what is recommended, and what depends on context.

A strong topic:

- Researches the subject as of the actual working date rather than relying on model memory for information that may have changed.
- Prefers the authoritative source closest to the fact: standards bodies, language/framework/project documentation, platform documentation, official specifications, and official package/registry metadata where version facts matter.
- Uses enough independent authoritative evidence to resolve material ambiguity. A source count is not a quality metric; support for the actual claims is.
- Reconciles conflicting documentation by checking version, publication date, scope, and authority instead of choosing whichever source is easiest to quote.
- Separates facts from recommendations and recommendations from preferences.
- Names version-dependent behavior when presenting it as current behavior.
- Does not silently turn an illustrative example into a factual claim about a real platform.
- Keeps source labels and URLs useful to a reader who wants to verify the material outside this site.

By default, do not use Reddit, Medium, Wikipedia, personal blogs, SEO summaries, generated-content farms, or similar tertiary material as evidence. Do not use arXiv or other preprint sources when an authoritative standard, official implementation document, or stable primary source answers the question; use research literature only when the subject genuinely requires research evidence and its status is represented accurately.

**Failure condition:** A reader cannot tell whether an important statement is current, authoritative, conditional, or merely the author's preference.

## 2. Zero-gap continuity — nothing may depend on knowledge that has not been made available

Every sentence, example, visual, and section should be reachable from what came before it.

A strong topic:

- Starts from concepts a true newcomer can recognize.
- Introduces the meaning of a technical idea before or beside the formal name.
- Expands abbreviations before relying on them.
- Never uses a glossary as a repair mechanism for unexplained prose earlier in the guide.
- Makes prerequisites explicit and treats “helpful prior knowledge” differently from knowledge the topic actually requires.
- Either explains a dependency locally or points to an existing prerequisite topic at the point where that dependency becomes meaningful.
- Orders concepts by dependency rather than by alphabetical order, API surface order, documentation navigation, or whatever order happened to be easiest for the author.

A useful test is: **Could a careful reader stop at any sentence and explain every concept that sentence relies on using only material already available to them?** If not, there is a drop-off.

**Failure condition:** The guide suddenly becomes understandable only to someone who already knew the missing idea.

## 3. Mechanistic understanding — explain what causes what

Definitions alone do not create understanding. The reader should leave with a working mental model of the system.

For material mechanisms, explain as applicable:

- what enters the mechanism;
- what state exists before it acts;
- what the mechanism does;
- what state or output exists afterward;
- what depends on that output;
- what happens when the mechanism cannot complete;
- which layer or actor owns the behavior.

Rules should follow reasons whenever the reason is knowable. “Do this” without “because this is what changes” is operationally weak teaching.

Analogies may help orientation, but they may not replace the real mechanism. If an analogy stops matching reality at an important boundary, state that boundary before the analogy becomes a misconception.

**Failure condition:** A learner can repeat terminology but cannot predict what the system will do next.

## 4. Progressive depth — begin at zero and keep going until the topic is genuinely complete

“Simplified” must mean better sequenced, not hollowed out.

A strong topic moves naturally through layers of understanding:

- recognizable experience or problem;
- useful mental model;
- correct technical vocabulary;
- real mechanics and interfaces;
- applied examples;
- important boundaries and edge cases;
- decisions and trade-offs;
- debugging/failure behavior;
- production consequences that materially belong to the subject.

Do not stop after the beginner-friendly portion and leave an unexplained cliff before real-world work. Conversely, do not absorb neighboring subjects merely to appear comprehensive. Completeness means **complete inside the topic's legitimate boundary**, with explicit links to the next dependency when the boundary is reached.

A topic's length, number of sections, number of code blocks, and number of visuals are consequences of what must be taught. They are not targets.

**Failure condition:** The guide is either an introductory summary masquerading as a reference, or an unfocused encyclopedia that loses the subject's boundary.

## 5. Explanatory density — every element must earn its place

Quality is not word count. Add information when it changes understanding, prediction, choice, diagnosis, or action.

A strong topic:

- Uses plain language without deleting precise technical meaning.
- Prefers direct statements over motivational filler, throat-clearing, repetition, or decorative prose.
- Explains the important parts of examples instead of assuming code/data “speaks for itself.”
- Avoids repeating the same fact under several headings unless the later occurrence adds a new consequence or perspective.
- Uses summaries to consolidate a mental model, not to substitute for teaching it.

**Failure condition:** Removing a substantial portion of the topic would not reduce what the reader can understand or do—or, conversely, the reader must infer essential steps because the author optimized for brevity.

## 6. Example integrity — examples must teach the real behavior

Examples are evidence for a mental model. They must not be ornamental.

When using code, commands, requests, schemas, configuration, data, or UI examples:

- State what problem the example is solving.
- Explain important syntax and values at the point they matter.
- Explain the state change or result caused by the example.
- Explain what the surrounding system does with the result when that is not obvious.
- Keep examples internally consistent and technically valid for the stated environment/version.
- Use realistic names and values without fabricating external facts.
- Do not hide essential behavior behind pseudocode unless pseudocode is explicitly the teaching goal.
- Do not teach insecure, inaccessible, deprecated, or production-invalid patterns as the default merely because they create shorter examples.

Literal source code does not need to be narrated character-by-character; its meaning does need to be available in prose so the read-aloud experience does not create a second-class curriculum.

**Failure condition:** The example can be copied or admired but cannot be explained.

## 7. Decision literacy — teach how to choose, not only what exists

Whenever a subject contains meaningful alternatives, the reader should understand the decision boundary.

A strong topic identifies:

- the workload, requirement, or problem shape;
- the constraints that matter;
- what each option optimizes for;
- what each option gives up;
- when a choice changes as scale or requirements change;
- which choice is a standard requirement versus a contextual recommendation.

Never call a technology, architecture, database, framework, protocol, tool, or pattern “best” without naming the workload and constraints that make the statement true.

**Failure condition:** The guide produces brand/tool preferences instead of transferable judgment.

## 8. Failure literacy — teach the broken path as part of the real system

A developer who understands only the happy path does not yet understand the system.

Where applicable, a topic should expose:

- common failure modes;
- observable symptoms;
- the earliest stage that could have produced the symptom;
- boundaries between layers/actors so failures are not diagnosed in the wrong place;
- safe recovery or investigation steps;
- states that look similar but have different causes.

Debugging guidance should encourage evidence gathering and stage isolation before random configuration changes, cache deletion, dependency deletion, or broad rewrites.

**Failure condition:** The guide teaches how a system works only while everything is already working.

## 9. Production realism — continue to the consequences that senior developers actually manage

Production depth is subject-dependent, not a mandatory checklist pasted onto every topic.

When materially relevant, cover the consequences involving:

- security and trust boundaries;
- accessibility;
- performance and resource cost;
- concurrency or ordering;
- compatibility and versioning;
- deployment/runtime environment;
- state persistence and recovery;
- scaling behavior;
- observability and diagnosis;
- maintainability and change impact;
- data integrity;
- supply-chain risk.

Only include a production concern when it genuinely belongs to the subject. Do not add superficial “security/performance/accessibility” paragraphs to satisfy a checklist.

**Failure condition:** A reader understands the toy version but is surprised by the first normal production constraint.

## 10. Visual semantics — a visual must explain a relationship that prose alone makes harder to see

Visuals are instructional models, not decoration.

Choose the representation from the relationship:

- **flow** for sequence or state movement;
- **layers** for dependency, containment, or abstraction boundaries;
- **comparison** for peer differences;
- **cycle** for repetition/feedback;
- **map** for relationships without one strict sequence.

A visual should reduce cognitive load by making an important relationship visible. It must use labels/details that remain meaningful without color alone and should have nearby prose that establishes what the reader is meant to notice.

Do not force a visual into every section. Do not use the same visual form repeatedly merely to create visual consistency. Do not make an attractive diagram that teaches a false topology.

**Failure condition:** The page becomes more attractive without the subject becoming easier to understand.

## 11. Human readability — precision must remain accessible

Write for a capable human, not for a documentation parser and not for another language model.

A strong topic:

- Uses common words when they are equally precise.
- Uses the real specialist term when it is the correct term, then makes it understandable.
- Prefers active voice and explicit actors when the actor matters.
- Makes references explicit instead of relying on vague “this,” “it,” “that layer,” or “the above” when more than one referent is plausible.
- Breaks dense reasoning into digestible units without turning every sentence into a heading or list item.
- Avoids artificial enthusiasm, filler, generic “key takeaway” repetition, and prose that sounds generated rather than authored.
- Does not patronize beginners or imply that advanced material is inherently difficult; it simply supplies the missing dependencies.

**Failure condition:** The prose is technically accurate but unnecessarily hard to parse, or friendly-sounding but technically vague.

## 12. Accessibility is part of content correctness

The educational meaning must survive different ways of perceiving and navigating the page.

A strong topic:

- Does not make color, position, shape, or animation the only carrier of meaning.
- Gives visuals enough textual explanation to preserve the lesson outside the visual channel.
- Uses meaningful headings, table labels/captions, control wording, and sequence language.
- Does not rely on hover, pointer precision, or a wide viewport to understand the content.
- Keeps code explanations sufficient for the site's narration path.
- Avoids instructions such as “click the green thing on the right” when a semantic identity can be named.

The application owns the shared accessibility mechanics; topic content must not undermine them.

**Failure condition:** A learner using narration, keyboard navigation, zoom/reflow, forced colors, or non-visual interpretation receives a materially weaker explanation.

## 13. Curriculum coherence — each topic is part of one connected system

Topics must behave like connected nodes, not independent articles generated in isolation.

Before adding a topic:

- Read `docs/topic-registry.json` and the recommended learning order.
- Identify what already exists before duplicating explanations.
- Decide which existing concepts are true prerequisites, which only need a short local recap, and which belong as related continuation.
- Preserve established terminology for the same concept unless correcting a proven problem.
- Update related-topic links in both directions when that improves navigation and the relationship is real.
- Place the topic in recommended order based on conceptual dependency, not novelty or marketing importance.

Duplication is acceptable when a small restatement is needed to make the current explanation locally understandable. Duplication is not acceptable when it creates two competing sources of truth for the same substantial subject.

**Failure condition:** The new guide is individually good but makes the curriculum less coherent.

## 14. Integration integrity — content is not finished when the JSON file exists

A topic addition or rewrite is complete only when the repository can discover, validate, search, connect, narrate, and deploy it through the existing architecture.

As applicable:

- Respect the current schema and supported content/visual kinds in `docs/content-authoring.md`.
- Preserve the generated-artifact architecture; do not hand-edit generated discovery files as if they were sources.
- Regenerate catalog, homepage bootstrap, search index, and topic registry through the existing scripts.
- Keep aliases/keywords useful to actual learner intent rather than stuffing metadata with synonyms.
- Confirm related slugs exist.
- Confirm narration projection still covers the topic through shared infrastructure; do not create per-topic audio special cases.
- Update append-only project records when the project workflow requires them.
- Run the repository's authoritative verification command(s) and fix failures at their cause.

Do not introduce a backend, CMS, new state system, new rendering path, new content format, or one-off topic component merely because it is convenient for one guide. Architecture changes require an independent product/engineering justification.

**Failure condition:** The topic is correct in isolation but creates stale discovery data, dead navigation, inconsistent search, special-case rendering, or unverified deployment behavior.

## 15. Consistency without sameness — match the standard, not the silhouette

Existing high-quality topics are **calibration references, not molds**.

A new topic should feel like it belongs to the same product because it shares:

- the same epistemic discipline;
- the same zero-gap teaching philosophy;
- the same degree of explanatory care;
- the same production honesty;
- the same learner respect;
- the same source quality;
- the same integration discipline.

It does **not** need the same:

- number of sections;
- heading names;
- block order;
- number of code samples;
- number of visuals;
- length;
- scenario style;
- ratio of prose to tables/cards/steps.

Do not clone an existing topic and replace nouns. Let the subject determine the best teaching shape while the North Star determines the quality floor.

**Failure condition:** Topics look consistent because they were templated, but their explanations are not equally strong.

---

# Research protocol for topic work

Before authoring substantive topic content:

1. **Establish the actual topic boundary.** Define what the guide must make understandable and what belongs to neighboring topics.
2. **Inspect the existing curriculum.** Read the relevant registry entries and related guides so terminology and dependency order stay coherent.
3. **Research current authoritative material.** Use the actual working date. Prefer official standards/specifications/project/platform documentation and official registry metadata when relevant.
4. **Resolve instability.** For facts likely to change—versions, APIs, defaults, browser/runtime behavior, toolchain conventions, deployment requirements—verify the current state rather than relying on memory.
5. **Resolve conflicts.** If authoritative sources appear to disagree, identify whether the difference is version, environment, scope, recommendation level, or an actual unresolved disagreement.
6. **Build the dependency graph before the prose.** Determine what a reader must understand first, second, and next. Do not begin with headings copied from the source documentation.
7. **Author from the mental model outward.** Source documentation is evidence; it is not automatically the best teaching order.
8. **Self-audit before integration.** Use the quality review below.
9. **Run repository validation.** Treat validation failures as evidence, not obstacles to bypass.

---

# Quality review before publication

This is a review lens, not a required page outline. A model should be able to answer these questions with concrete evidence from its proposed topic.

### Truth

- Which claims could have changed since the model's training data, and how were they verified?
- Are the most load-bearing technical claims supported by primary/official sources?
- Did any recommendation get presented as a universal fact?
- Did any source get included without materially supporting the topic?

### Continuity

- What is the first idea a true newcomer is expected to recognize?
- For every major term, where does its meaning become available before later material depends on it?
- Is there any sentence whose understanding secretly requires an unstated prerequisite?
- Does each section make the next section easier to understand?

### Mental model

- Can the reader explain not merely what the thing is, but what acts on what and what changes as a result?
- Can the reader predict at least the normal next step/state?
- Where does the analogy stop matching the real system, if an analogy is used?

### Depth

- Where does the guide transition from orientation into real technical mechanics?
- What production behavior would an experienced developer consider materially missing?
- Did the guide stop because the topic boundary was reached, or because generation became inconvenient?
- Did it absorb adjacent topics that should instead be linked?

### Application

- Do examples expose the relevant inputs, behavior, and outcome?
- Are important code/configuration/data lines interpreted?
- Can the learner connect a command or action to the state change it causes?
- Where choices exist, does the guide identify constraints and trade-offs?

### Failure and operation

- What are the normal ways this mechanism fails?
- Can the reader locate the earliest plausible failing stage from symptoms?
- Are security, accessibility, performance, compatibility, deployment, recovery, or scaling consequences included where they genuinely belong?

### Communication

- Does every visual reveal a relationship worth seeing?
- Does the lesson survive without color or visual-only cues?
- Could narration communicate the conceptual meaning even when literal code is not spoken?
- Is the prose precise without being jargon-dependent or artificially verbose?

### Curriculum and repository

- Does this topic duplicate an existing source of truth?
- Are prerequisite and related-topic relationships accurate?
- Is its recommended position based on dependency order?
- Are generated artifacts and repository records current?
- Did the authoritative verification gate pass after the final content state?

If any answer is “unclear,” the topic is not ready merely because the schema validates.

---

# Hard prohibitions

The following are incompatible with this project's standard:

- Guessing or inventing technical facts, versions, API behavior, citations, source dates, benchmark numbers, or platform capabilities.
- Presenting model memory as current verification when the fact can change.
- Using low-authority sources for convenience when authoritative sources are available.
- Copying the navigation order of official documentation and assuming it is automatically the optimal teaching order.
- Starting with jargon and repairing comprehension later.
- Replacing real technical terminology with euphemisms that leave the learner unable to read real documentation afterward.
- Dumping code, commands, tables, or diagrams without explaining what matters and what changes.
- Using visuals decoratively or choosing a diagram type that misrepresents the relationship.
- Calling an option “best” without conditions.
- Omitting important limitations because they complicate an otherwise clean explanation.
- Adding superficial security/performance/accessibility paragraphs that do not belong to the mechanism being taught.
- Cloning another guide's section structure simply to create visual uniformity.
- Inflating length with repeated summaries, generic advice, or AI-style filler.
- Compressing length by skipping dependencies, failure modes, or required mechanics.
- Creating one-off application architecture for a single topic when the shared content system can express it.
- Weakening validators, tests, source requirements, or this North Star to make a contribution pass.
- Declaring completion from file creation alone without repository-level verification.

---

# Instruction hierarchy for agents

For topic work, use this order:

1. Direct system/developer/user instructions in the active task.
2. `NORTHSTAR.md` for educational quality and project intent.
3. `docs/content-authoring.md` for current topic structure, supported blocks, visuals, and content-file rules.
4. `docs/topic-registry.json` and existing topic sources for current curriculum state and terminology.
5. Repository scripts/tests/workflows for executable structural and integration requirements.
6. Existing topics as examples of prior decisions—not as authority to perpetuate a mistake if stronger evidence or this North Star requires correction.

If you discover a real contradiction between these layers, do not silently choose whichever is easiest. Preserve the higher-order requirement, identify the conflict, and correct the lower-order artifact when authorized by the task.

---

# The final standard

A topic is ready when a newcomer can **enter it**, an intermediate developer can **use it**, an experienced developer can **trust it**, and the next topic can **build on it without repairing it first**.

That is the quality bar.
