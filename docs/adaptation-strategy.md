# Responsive and adaptive strategy

## Detected project

- **Stack:** semantic HTML, Tailwind CSS 4, shadcn-style source components, OKLCH tokens, React 19, TypeScript 7, Vite 8, static GitHub Pages.
- **Archetype:** browse, navigate, search, scan, then read deeply.
- **Density:** dense reference material with progressive disclosure.
- **Use context:** mixed touch, pointer, and keyboard input; short lookups and long study sessions.
- **Content:** author-controlled, unbounded topic volume, variable length, visual-heavy, English at launch.
- **Constraints:** static client rendering, bounded bundles, WCAG 2.2 AA-oriented outcomes, no legacy-browser promise beyond Tailwind 4's supported floor.

## Adaptation by content pressure

- **Narrow:** one reading sequence; identity, search, title, current task, and primary navigation remain visible. Comparisons and visual nodes stack.
- **Mid:** discovery cards and visual comparisons gain parallel columns when their minimum readable measure fits.
- **Wide:** global navigation, a contextual topic outline, and bounded main reading measure coexist. Extra width supports orientation, not longer prose lines.
- **Ultra-wide:** the reading column remains bounded and centered with a local outline; discovery surfaces may add intrinsic columns.

Reusable cards and visual panels use container queries. The application shell and persistent topic outline use viewport media queries only because they depend on page-level structure. Intrinsic grids, wrapping, `minmax()`, `auto-fit`, and bounded `clamp()` values handle the default behavior before breakpoints.

## Invariant mapping

- Fluid type/space/container bounds: root-relative `clamp()` values.
- Reusable component adaptation: `container-type: inline-size` and `@container`.
- Page structure: content-pressure viewport queries at 48rem, 62rem, and 80rem.
- Viewport height: `min-height: 100dvh`, `80svh`, and dialog height based on `dvh` plus safe-area insets.
- Direction independence: logical `inline`, `block`, `inset-inline`, margin, padding, and border properties.
- Media stability: inline SVG icons and ratio-free diagram primitives reserve their intrinsic boxes; future raster media must provide intrinsic dimensions.
- Targets: primary controls use at least 2.75rem block/inline size.
- Reflow and text spacing: wrapping, fixed table layout, `pre-wrap`, no page-level horizontal overflow, and no fixed-height text containers.
- Preferences/capabilities: `prefers-reduced-motion`, `prefers-color-scheme`, `forced-colors`, safe areas, native zoom, and no user-agent detection.
