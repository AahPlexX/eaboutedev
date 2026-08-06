# Everything About Development

A visual, plain-language, deeply sourced reference for understanding web development as one connected system. The launch release includes complete guides for the web request lifecycle, HTML/CSS/JavaScript, seven practical database families, API contracts, and Git/GitHub workflows.

## Product principles

- **One connected source of truth:** each guide names prerequisites, related topics, a glossary, and primary documentation.
- **Plain language without missing depth:** concepts begin with a visible sequence, then add trade-offs, examples, and operational consequences.
- **Search by human intent:** global search expands common abbreviations and related terms before applying prefix and typo-tolerant matching.
- **Content-driven adaptation:** navigation, disclosure, and columns change when content pressure requires it; prose remains bounded.
- **Generated discovery artifacts:** topic source documents generate the catalog, search corpus, and topic registry together.

## Stack

- React 19 and TypeScript 7
- Vite 8
- Tailwind CSS 4 with the official Vite integration
- shadcn-style source components built from Radix primitives
- Oxlint
- MiniSearch
- pnpm 11 only
- GitHub Pages through GitHub Actions

Every dependency is pinned to an exact stable version in `package.json`.

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

- `src/generated/topic-catalog.ts` for application discovery pages
- `public/search/topic-search-index.json` for lazy search initialization
- `docs/topic-registry.json` for auditable topic tracking and source hashes

The validator requires unique slugs, complete sections, supported visual and content block types, valid source dates, valid related-topic references, and a maximum of 5,000 topics.

See `docs/content-authoring.md` before adding a topic.

## Routing and deployment

The application uses hash routing because GitHub Pages serves static files and does not provide application route rewrites. The Vite base path is `/eaboutedev/`. `.github/workflows/pages.yml` verifies pull requests and deploys every successful update to `main`.

## Accessibility and adaptation

The interface uses semantic landmarks, a skip link, visible focus, keyboard search, native controls, minimum interactive targets, logical properties, intrinsic sizing, container queries, bounded fluid type and spacing, dynamic viewport units, safe-area insets, reduced-motion support, forced-colors support, and dark/light color-scheme support. Page content reflows at 320 CSS pixels and at 400% zoom without page-level horizontal scrolling.
