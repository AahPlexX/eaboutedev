# Free Neural Topic Read-Aloud Design

**Date:** 2026-08-09

## Goal

Add a completely free, high-quality read-aloud experience to every topic without a server, API key, account, billing path, autoplay, or device-provided robotic voice dependency.

## Evidence-backed engine choice

- Do not use `window.speechSynthesis` as the primary or fallback narrator. The Web Speech API exposes voices supplied by the user agent/device, so voice availability and quality are not deterministic across visitors.
- Use Kokoro-82M v1.0 through the browser build of `kokoro-js@1.2.1`. The upstream package is Apache-2.0, documents 100% local browser inference through Transformers.js, and grades `af_heart` A, the strongest listed default voice.
- Use `onnx-community/Kokoro-82M-v1.0-ONNX` with `dtype: "q8"` and `device: "wasm"`. The published 8-bit ONNX artifact is 92.4 MB; WASM is the broad-compatibility execution path. WebGPU remains an optional future optimization, not a requirement.
- Load the exact browser runtime only after an intentional user action from `https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js`. The upstream package declares that file as its jsDelivr/UNPKG browser distribution. No runtime dependency range is introduced into the repo.

## Product behavior

1. Every `TopicDocument` automatically receives the same narration player; no per-topic audio files or manual narration metadata are required.
2. The player appears after the topic hero and before the long-form guide body.
3. Nothing downloads and no sound starts merely because a visitor opens a topic.
4. The player explains that first use downloads roughly 100 MB of neural voice/runtime data and that topic text is synthesized in the visitor's browser rather than sent to a paid TTS service.
5. User controls: Play/Resume, Pause, Restart, topic-position seek, and transcript passage selection.
6. The full narration transcript remains visible and the active passage receives a non-color-only current marker.
7. Narration is progressively synthesized in a Web Worker so model work does not block the React/UI thread. The next passage is prefetched while the current passage plays.
8. Generated WAV blobs are cached only for the current mounted topic session and their object URLs are revoked during cleanup.
9. A failed neural runtime/model load produces an explicit retryable error. There is no silent downgrade to low-quality system speech.

## What gets read

Narration is derived from the authoritative topic JSON, preserving the educational information in reading order:

- topic title and summary;
- learning outcomes and helpful prerequisites;
- hero visual title, caption, and node labels/details;
- every section title and summary;
- section visual title, caption, and node labels/details;
- paragraphs;
- steps including result text;
- cards including use/avoid/example fields when present;
- code-block language and explanatory prose, while leaving literal source code visually available instead of reading punctuation character-by-character;
- tables, using column labels to make each row understandable when heard;
- callouts, checklists, and checkpoint prompt/answer/explanation;
- glossary terms/definitions;
- primary-source labels (URLs themselves are not spoken).

Related-topic navigation is not part of the spoken guide because the current `TopicDocument` stores related slugs rather than learner-facing titles.

Long prose is split into bounded natural-language passages before synthesis so no request approaches Kokoro's model context ceiling. Passage boundaries also provide deterministic transcript sync and seek targets.

## Accessibility and responsive requirements

- User-initiated audio only; never autoplay.
- Native buttons/range input, visible focus, text labels, `aria-live="polite"` status, and `aria-current` on the active transcript passage.
- Player controls retain at least the project's existing 2.75rem interactive target height, exceeding WCAG 2.2 AA's 24×24 CSS-pixel minimum.
- No required drag gesture; every seek position is available through keyboard-operable controls and transcript buttons.
- Transcript highlighting does not auto-scroll, avoiding motion/disorientation and remaining compatible with reduced-motion preferences.
- Intrinsic/grid wrapping preserves 320 CSS-pixel reflow and 400% zoom behavior with no player-level horizontal scrolling.
- Forced-colors styling keeps borders/current indicators perceivable.

## Performance and failure boundaries

- The normal topic route must not include or initialize the neural runtime/model until narration is requested.
- The model runs in a module Web Worker and uses WASM by default for cross-device compatibility.
- Browser cache behavior is delegated to Transformers.js/standard browser caching where available; the UI does not promise permanent offline availability.
- If CDN/model network access, browser memory, WASM, or audio playback fails, surface a concise retryable explanation and leave the readable topic fully usable.
- No backend, account system, cloud TTS API, service worker, persistent generated-audio store, voice-cloning control, or downloadable audio export is added in this scope.

## Verification gates

- Red/green tests prove narration extraction covers every current content-block type and excludes raw source URLs/code punctuation from spoken text.
- Source-contract tests prove the exact Kokoro runtime/model/voice/dtype/device configuration, Worker boundary, absence of `speechSynthesis`, accessible controls, visible transcript, and no autoplay.
- Full `pnpm check` must pass in GitHub-hosted verification before merge.
- After merge, verify the Pages deployment and inspect the live player on a real topic at mobile and desktop viewport widths.
