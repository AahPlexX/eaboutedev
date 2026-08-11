# Topic page UX redesign — 2026-08-11

This document records the shared presentation contract for every `#/topics/*` route. It changes layout and interaction hierarchy only; educational content remains authoritative in topic JSON files and must not be removed to simplify the interface.

## Information hierarchy

1. **Orientation:** title, summary, level/time/category, learning outcomes, prerequisites, and the topic visual establish what the learner is about to learn.
2. **Learning workspace:** compact narration controls, in-page navigation, and the complete ordered teaching sections.
3. **Technical escape lane:** code examples, tables, topic visuals, and syntax-anatomy diagrams may use more width than prose when that improves comprehension.
4. **Reference and continuation:** glossary, primary references, and related topics form a distinct closing zone after instruction.

## Narration hierarchy

Narration is a learner utility, not a second document competing with the lesson. Its default presentation must be compact and user initiated. Play/Pause, Restart, seek, progress, and status stay immediately available. The complete transcript, active-passage detail, first-download/privacy explanation, and transcript passage navigation remain available through an accessible disclosure. The transcript is never deleted or replaced by system speech.

## Responsive and accessibility requirements

- Maintain semantic article/section/nav structure and one clear H1.
- Preserve descriptive section headings and in-page anchor navigation.
- Desktop uses a sticky section rail; narrow layouts use a compact native disclosure for the same links.
- Prose uses a controlled reading measure; technical blocks may use a wider lane.
- No horizontal page overflow at 320 CSS pixels or 400% zoom.
- Primary controls remain at least 2.75rem high, exceed WCAG 2.2 AA's 24 CSS-pixel target minimum, and retain visible focus.
- Narration does not autoplay.
- Collapsing secondary narration detail must not hide or remove the primary lesson content.

## Verification

The permanent project gate must pass after the redesign. Browser QA must check representative topic routes at desktop and narrow mobile widths, narration Play/Pause/Resume, mobile and desktop section navigation, absence of page-level horizontal overflow, and preservation of glossary/sources/related-topic content.
