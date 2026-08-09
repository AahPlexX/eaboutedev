# Everything About Development

A visual, plain-language, deeply sourced reference for understanding web development as one connected system. The current curriculum includes the web request lifecycle, HTML/CSS/JavaScript, Git/GitHub, Node.js and package management, TypeScript, React, Vite, API contracts, and seven practical database families.

## Product principles

- **One connected source of truth:** each guide names prerequisites, related topics, a glossary, and primary documentation.
- **Plain language without missing depth:** concepts begin with a visible sequence, then add trade-offs, examples, and operational consequences.
- **Search by human intent:** global search expands common abbreviations and related terms before applying prefix and typo-tolerant matching.
- **Content-driven adaptation:** navigation, disclosure, and columns change when content pressure requires it; prose remains bounded.
- **Generated discovery artifacts:** topic source documents generate the catalog, search index, homepage bootstrap, and topic registry together.
- **Free neural read-aloud:** every topic automatically exposes user-initiated natural narration with transcript navigation without a paid speech API or account.

## Stack

- React 19 and TypeScript 7
- Vite 8
- Tailwind CSS 4 with the official Vite integration
- shadcn-style source components built from Radix primitives
- Oxlint
- MiniSearch
- pnpm 11 only
- GitHub Pages through GitHub Actions

Every package dependency is pinned to an exact stable version in `package.json`.

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

`pnpm check` regenerates and validates topic artifacts, confirms exact dependency versions, runs the Node tests, type-checks, runs Oxlint, and creates the production build.

## Content architecture

Authoritative topic files live in `public/content/topics/<slug>.json`. Run `pnpm generate` after changing or adding a topic. This produces:

- `public/catalog/topic-catalog.json` for the lazy complete catalog
- `src/generated/topic-bootstrap.ts` for the bounded homepage topic preview and count
- `public/search/topic-search.minisearch.json` for the prebuilt lazy MiniSearch index
- `docs/topic-registry.json` for auditable topic tracking and source hashes

The validator requires unique slugs, complete sections, supported visual and content block types, valid source dates, valid related-topic references, and a maximum of 5,000 topics. Discovery validation separately enforces generated-asset size and eager-loading boundaries.

See `docs/content-authoring.md` before adding a topic.

## Free neural read-aloud

Every loaded `TopicDocument` is projected into bounded narration passages in the same learning order as the guide. The shared player therefore applies automatically to current and future topics rather than requiring per-topic audio files.

- Runtime: exact `kokoro-js@1.2.1` browser distribution loaded from jsDelivr only after the visitor intentionally requests narration.
- Model: `onnx-community/Kokoro-82M-v1.0-ONNX`, `q8`, executed through WebAssembly with the `af_heart` voice.
- Cost/privacy boundary: no account, API key, backend, paid TTS request, or billing path is used; topic text is synthesized in the browser.
- Performance boundary: the neural runtime/model is not initialized on ordinary topic navigation. First use discloses an approximately 100 MB neural-model download; subsequent caching is browser/platform dependent rather than promised by application logic.
- Playback: Play/Pause/Resume, Restart, topic-position seek, retry, progress feedback, current-passage context, and a clickable visible transcript.
- Spoken content: titles, learning outcomes, prerequisites, visuals, section prose, steps, cards, table semantics, callouts, checklists, checkpoints, glossary, and primary-source labels. Literal source-code punctuation and raw URLs remain visible instead of being spoken character-by-character.
- Failure behavior: if runtime/model/network/audio preparation fails, the readable topic stays fully usable and the player surfaces a retryable error; it does not silently downgrade to `speechSynthesis` system voices.

The neural synthesis boundary lives in `src/workers/narration.worker.ts`; narration projection is pure logic in `src/lib/narration.ts`; playback/transcript state is isolated in `src/components/topics/topic-narration.tsx`.

## Routing and deployment

The application uses hash routing because GitHub Pages serves static files and does not provide application route rewrites. The Vite base path is `/eaboutedev/`. `.github/workflows/actions.yml` verifies pull requests; `.github/workflows/pages.yml` verifies, builds, and deploys every successful update to `main`.

## Accessibility and adaptation

The interface uses semantic landmarks, a skip link, visible focus, keyboard search, native controls, minimum interactive targets, logical properties, intrinsic sizing, container queries, bounded fluid type and spacing, dynamic viewport units, safe-area insets, reduced-motion support, forced-colors support, and dark/light color-scheme support. Page content reflows at 320 CSS pixels and at 400% zoom without page-level horizontal scrolling.

Narration never autoplays. Its controls remain keyboard-operable, the player exposes polite status updates, the active transcript passage uses current-item semantics plus a non-color-only visual marker, and transcript navigation does not force automatic scrolling.
