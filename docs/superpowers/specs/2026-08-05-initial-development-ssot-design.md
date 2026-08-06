# Everything About Development — Initial Product Design

## Outcome

Create a production-ready static reference application that helps any web-development learner locate a concept, see the system visually, read a dependency-ordered explanation, understand decisions and failure modes, and verify the material against authoritative documentation.

## Architecture

Topic JSON documents are the only authored content source. A deterministic generator creates a lightweight TypeScript catalog, a search corpus, and a SHA-256 registry. Discovery loads only metadata; full topic documents load on demand. Hash routing preserves deep links on GitHub Pages without server rewrites.

The UI is an editorial field guide: clear typographic hierarchy, diagrammatic sequences, restrained color accents per topic, bounded reading measure, and progressive disclosure. shadcn-style source components own controls and overlays; topic-specific visual primitives own explanatory diagrams.

## Launch content

1. How the Web Works
2. HTML, CSS, and JavaScript
3. The 7 Types of Databases
4. APIs and Data Exchange
5. Git and GitHub

Each topic must include learning outcomes, a visual system overview, dependency-ordered sections, examples, decision support, failure modes, glossary, related topics, and primary sources.

## Search contract

Search normalizes Unicode and case, removes low-value natural-language words, creates useful adjacent-term phrases, expands domain synonym groups, infers broad query intent, and uses weighted prefix/fuzzy matching over titles, aliases, keywords, section names, summaries, and glossary content. The corpus loads only when search is first used.

## Quality gates

A change is eligible for `main` only when content validation, generated-artifact freshness, exact-version validation, behavior tests, TypeScript, Oxlint, and the Vite production build succeed. Deployment occurs only after the verified `main` update.

## Scope boundary

No authentication, user-generated content, remote CMS, analytics, personalization, paid search service, server runtime, or speculative topic-management dashboard is included in the initial release.
