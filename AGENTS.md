# Agent guidance

This repository treats educational quality as a governed product requirement, not a writing preference.

Before performing **any** CRUD action in this repository — not only topic work — start at `SSOT.md`. It is the canonical directory mapping every governed concern (content quality, authoring contract, generated artifacts, tests, workflows, ledgers, dependency policy) to the one file that is authoritative for it, plus the mutation rule for that file. This applies to every model and client: Claude, Codex/GPT-family, Gemini, GitHub Copilot, or any other agent runtime.

For topic work specifically, read and obey in order:

1. `NORTHSTAR.md` — canonical quality standard and project intent.
2. `docs/content-authoring.md` — current topic-file, block, visual, and authoring contract.
3. `docs/topic-registry.json` — current curriculum inventory.
4. The existing topic sources directly connected to the subject you are changing.

`NORTHSTAR.md` is intentionally not a topic template. Match its quality invariants, not another guide's silhouette.

## Repository rules

- `main` is the authoritative branch. It must never be behind any other branch. Do not leave competing branch state behind: merge or delete branches once their work lands.
- Use pnpm only.
- Authoritative topic sources live in `public/content/topics/<slug>.json`.
- Do not hand-author generated catalog/search/bootstrap/registry output as though it were source content.
- Research current, authoritative sources before substantive topic work; do not rely on model memory for unstable technical facts.
- Preserve dependency-ordered learning, source quality, related-topic coherence, accessibility, narration compatibility, and production depth.
- Do not weaken validators, tests, source requirements, or governance documents to make a contribution pass.
- Do not add one-off rendering/application architecture for a single topic when the shared content model can express it.
- Keep internal development/governance instructions out of client-facing topic prose.

## Verification

After topic changes, run the repository's existing generation and verification flow described in `README.md` and `docs/content-authoring.md`. Treat failures as evidence to diagnose, not checks to bypass.

If a lower-level repository artifact conflicts with `NORTHSTAR.md` on educational quality, preserve the North Star requirement and surface/correct the conflict rather than silently lowering the standard.
