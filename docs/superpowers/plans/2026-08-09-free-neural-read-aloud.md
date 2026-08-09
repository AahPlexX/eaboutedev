# Free Neural Topic Read-Aloud Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every topic an accessible, completely free, natural neural read-aloud player driven from the existing topic document.

**Architecture:** A pure narration projector converts `TopicDocument` content into bounded spoken passages. A React player owns playback/transcript state and lazily instantiates a module Web Worker. The worker lazily imports the exact Kokoro browser bundle, loads Kokoro-82M q8 on WASM once, synthesizes requested passages, and returns WAV blobs; the main thread prefetches the next passage while preserving pause/restart/seek semantics.

**Tech Stack:** React 19, TypeScript 7, Vite 8 module workers, Web Audio via `HTMLAudioElement`, Web Workers, exact `kokoro-js@1.2.1` browser distribution, Kokoro-82M-v1.0 ONNX q8/WASM, Node test runner, Oxlint.

## Global Constraints

- No paid service, API key, account, backend, billing path, autoplay, or `speechSynthesis` fallback.
- Every topic must inherit narration automatically from `TopicDocument`.
- Default voice: `af_heart`; model: `onnx-community/Kokoro-82M-v1.0-ONNX`; dtype: `q8`; device: `wasm`.
- Runtime import is exact-version and occurs only inside the worker after intentional narration activation.
- Preserve the readable topic when audio fails.
- Preserve 320 CSS-pixel reflow, 400% zoom, keyboard operation, visible focus, reduced-motion behavior, forced colors, and WCAG 2.2 AA target sizing.
- `todo.md`, `changelog.md`, and `codemap.json` remain append-only and are updated only after verified implementation.

---

### Task 1: Narration content projection

**Files:**
- Create: `src/lib/narration.ts`
- Create: `tests/narration.test.ts`

**Interfaces:**
- Consumes: `TopicDocument` and all current `ContentBlock` variants from `src/types/content.ts`.
- Produces: `NarrationPassage { id: string; label: string; text: string; sectionId?: string }` and `buildTopicNarration(topic: TopicDocument): NarrationPassage[]`.

- [ ] Write failing tests using a fixture that contains every block type and asserts title/summary/outcomes/prerequisites/visuals/steps/cards/explanations/tables/callouts/checklists/checkpoints/glossary/source labels are present.
- [ ] Assert raw source URLs and literal code strings are not narrated while code explanation remains present.
- [ ] Assert all passages are non-empty, deterministically identified, remain in reading order, and stay below the bounded synthesis length.
- [ ] Run the focused Node test and confirm RED because `src/lib/narration.ts` does not exist.
- [ ] Implement minimal pure projection and passage splitting.
- [ ] Rerun and confirm GREEN.

### Task 2: Neural synthesis worker contract

**Files:**
- Create: `src/workers/narration.worker.ts`
- Create: `tests/narration-runtime.test.ts`

**Interfaces:**
- Consumes worker messages `{ type: "synthesize"; requestId: string; text: string }`.
- Produces progress, ready, audio-blob, and error messages keyed by `requestId`.

- [ ] Write source-contract tests for the exact pinned runtime URL, exact model ID, q8, WASM, `af_heart`, progress forwarding, Blob output, and no `speechSynthesis` use.
- [ ] Run focused tests and confirm RED while worker is absent.
- [ ] Implement a lazily imported/cached Kokoro runtime and singleton model promise inside the Worker.
- [ ] Synthesize one bounded passage at a time with `generate(..., { voice: "af_heart" })`, convert `RawAudio` with `toBlob()`, and post the Blob.
- [ ] Normalize model-load progress defensively and send retryable errors without throwing across the worker boundary.
- [ ] Rerun focused tests and confirm GREEN.

### Task 3: Accessible player and transcript

**Files:**
- Create: `src/components/topics/topic-narration.tsx`
- Modify: `src/pages/topic-page.tsx`
- Modify: `src/learning.css`
- Extend: `tests/narration-runtime.test.ts`

**Interfaces:**
- Consumes: `topic: TopicDocument`, `buildTopicNarration`, Worker messages.
- Produces: user-initiated Play/Pause/Resume, Restart, topic-position seek, clickable visible transcript, current-passage indicator, first-use/privacy disclosure, progress/error status.

- [ ] Add failing source-contract assertions that `TopicPage` renders `<TopicNarration topic={topic} />`, the player provides native buttons/range, status live region, transcript label/current marker, no autoplay, and user-facing first-download/privacy copy.
- [ ] Run focused tests and confirm RED.
- [ ] Implement player state with one lazily created module worker, a hidden playback-only `<audio>` element, per-session object-URL cache, and cleanup/revocation.
- [ ] Start synthesis only after Play/Resume. While a passage plays, request the next one for continuity.
- [ ] Implement pause/resume, restart, transcript seek, normalized topic-position range seek, completion/replay, and retry after worker/model failure.
- [ ] Style intrinsic responsive controls/transcript/current marker with >=2.75rem control targets, no horizontal scrolling, dark/forced-color compatibility, and no automatic transcript scrolling.
- [ ] Rerun focused tests and confirm GREEN.

### Task 4: Repository verification and release records

**Files:**
- Modify: `README.md`
- Append: `todo.md`
- Append: `changelog.md`
- Append entry: `codemap.json`
- Delete temporary bootstrap files: `.github/workflows/turn9-narration-bootstrap.yml`, `docs/turn9-narration-bootstrap-trigger.txt`

**Interfaces:**
- Consumes: verified implementation from Tasks 1–3.
- Produces: current architecture documentation and append-only Turn 9 delivery evidence.

- [ ] Document the free neural narration architecture, first-use model download, local inference boundary, exact runtime/model/voice, and failure behavior in README.
- [ ] Remove the unused dependency-bootstrap workflow/trigger because no lockfile mutation is required by the final architecture.
- [ ] Run focused narration tests.
- [ ] Open/update the feature PR so GitHub-hosted `pnpm check` runs with the project's real frozen dependency graph and production build.
- [ ] Inspect full verification output; fix any type/lint/build failure before claiming success.
- [ ] Append Turn 9 to changelog/todo/codemap only with exact observed verification evidence.
- [ ] Re-run the full PR gate after documentation records are appended.
- [ ] Merge the verified branch into `main` and confirm the Pages release workflow reaches the deployment step.
- [ ] Inspect the live topic player at `https://aahplexx.github.io/eaboutedev/` using desktop and narrow mobile viewports; record any remaining browser/model-download limitation truthfully.
