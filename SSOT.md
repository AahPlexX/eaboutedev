# Everything About Development — Single Source of Truth Directory

**Status:** Canonical cross-agent governance index.
**Applies to:** Every model, agent, or human — regardless of vendor, client, or interface — performing any Create, Read, Update, or Delete action in this repository.
**What this file is:** A directory, not a template. It maps every governed concern in this project to the one file that is authoritative for it, and states the mutation rule for that file. It does not restate the policy bodies it points to.
**What this file is not:** A second `NORTHSTAR.md`, a required page/topic outline, or a substitute for reading the actual target file before you change it. Directories go stale faster than the files they point to — if this file and the linked file ever disagree about a fact, the linked file is correct and this file needs a fix, not the other way around.

---

## Why this file exists

This project is worked on by many different LLMs and agent runtimes over time — Claude, GPT-family/Codex, Gemini, GitHub Copilot, and others not yet integrated. Each one arrives with no memory of prior turns and, left unguided, tends to:

- duplicate an existing policy document instead of finding it,
- invent a new place to put a new kind of rule instead of using the existing one,
- hand-edit a generated artifact as though it were a source,
- or quietly lower a standard because the original governing file was never located.

This directory exists so that the very first thing any agent does — before writing a line of content or code — is find out **what already governs the thing it's about to touch**, and how that thing is allowed to be mutated. Read this file top-to-bottom once per task. Then open the specific canonical file(s) your task actually touches; do not rely on this summary alone once you are editing.

---

## The concern map

Each row names a governed concern, its canonical location, and the mutation rule. "Canonical" means: if you need to know the current truth about that concern, this is the only file to trust — not a prior chat turn, not another document's paraphrase of it, not model memory.

| Concern | Canonical location(s) | Mutation rule |
|---|---|---|
| Educational content quality standard | `NORTHSTAR.md` | Read before any topic add/rewrite/expansion. Edit only for an intentional, explicit standard change — never to make a contribution easier to pass. |
| Current topic file / content-block / visual authoring contract | `docs/content-authoring.md` | Subordinate to `NORTHSTAR.md` on quality; edit when the structural contract itself changes (new block/visual kind, schema change), keeping it a dependency sequence, not a forced template. |
| Current curriculum inventory, dependency order, source hashes | `docs/topic-registry.json` | **Generated.** Never hand-author. Produced by `pnpm run generate` from `public/content/topics/*.json`. |
| Authoritative topic sources | `public/content/topics/<slug>.json` | Source of truth for lesson content. Create/update by writing the JSON directly, then regenerating and validating. Filename and internal `slug` must match. |
| Generated discovery artifacts | `public/catalog/topic-catalog.json`, `public/search/topic-search.minisearch.json`, `src/generated/topic-bootstrap.ts`, `docs/topic-registry.json` | Never hand-author or hand-edit. Always produced by `pnpm run generate` from topic sources; CI fails a PR if these drift from what generation produces. |
| Cross-agent entry points / adapters | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md` | Must stay thin. Each routes its ecosystem to this file, `NORTHSTAR.md`, and `docs/content-authoring.md` — never restates their policy body. If you are a new agent integration not listed here, add a thin adapter following the same pattern instead of inventing a parallel rulebook. |
| Repository process rules (branching, package manager, verification obligations) | `AGENTS.md` | Short and durable. Add a rule here only when it is a repository-wide constraint that every agent must obey regardless of task. |
| Executable behavioral contracts | `tests/*.test.ts` | Authoritative for what the code must actually do. If a doc and a test disagree, that is a real defect in one of them — diagnose which one is wrong; do not silently trust whichever is more convenient, and do not weaken a test to make a change pass. |
| CI / deployment behavior | `.github/workflows/actions.yml` (pull-request verification), `.github/workflows/pages.yml` (main-only build + deploy) | Treat these as the actual release gate. `main` deploys automatically; there is no separate manual release process to fall back on. |
| Delivery history | `todo.md`, `changelog.md`, `codemap.json` | **Append-only.** Add a new dated/turn-numbered entry. Never rewrite or delete an earlier entry, even to correct it — add a correcting entry instead. |
| Larger feature design records | `docs/superpowers/specs/*.md`, `docs/superpowers/plans/*.md` | Write a spec before a substantive multi-file feature; write the task-by-task plan before implementing it. Past specs/plans are historical record, not living documents — do not retroactively edit a merged one. |
| Dependency, version, and package-manager policy | `package.json`, `.npmrc`, `pnpm-lock.yaml` | pnpm only. Every dependency pinned to an exact version (`save-exact=true`). Installs in CI/deploy use `--frozen-lockfile`. Regenerate the lockfile deliberately, never by hand-editing it. |
| One-time diagnostic/trigger artifacts under `docs/turn12-*`, `docs/turn*-live-qa-result.json`, etc. | `docs/` (ad hoc, per-turn) | These are point-in-time evidence, not living policy. Do not treat their presence as an ongoing requirement; do not delete them as historical record unless a turn explicitly retires them. |

---

## CRUD rules by artifact class

| Artifact class | Create | Read | Update | Delete |
|---|---|---|---|---|
| Governance docs (`NORTHSTAR.md`, `SSOT.md`, `AGENTS.md`, adapters) | Only for a genuinely new governed concern or a new agent ecosystem; follow the existing thin-adapter or directory pattern. | Always, before touching anything the doc governs. | Only to reflect an intentional standard/process change, never to ease a specific contribution through. | Practically never; if a concern is truly retired, say so explicitly rather than silently removing its row. |
| Topic sources (`public/content/topics/*.json`) | Follow `NORTHSTAR.md` + `docs/content-authoring.md`; check `docs/topic-registry.json` for existing coverage first. | Before writing anything that depends on, links to, or overlaps an existing topic. | Rewrite in place; regenerate and re-validate afterward. | Only with an explicit decision to retire a topic; fix inbound `related` links and regenerate. |
| Generated artifacts | Only via `pnpm run generate` — never by hand. | Fine to read for verification. | Only via regeneration from source. | Only as a byproduct of regeneration; never delete ahead of removing what produces them. |
| Tests | Add when behavior needs a permanent regression contract. | Read before assuming what current behavior is. | Update only when intended behavior actually changed. | Remove only when the behavior it protects is deliberately retired — not to unblock a failing change. |
| Ledgers (`todo.md`, `changelog.md`, `codemap.json`) | Append a new turn/entry every time you complete meaningful work. | Read recent entries to understand current state before starting. | Never rewrite existing entries. | Never. |
| Workflows (`.github/workflows/*.yml`) | Add only when a genuinely new automation need exists. | Read to understand the actual verification/deploy gate before assuming it. | Keep pins current; never remove a verification step to make CI pass. | Remove only temporary/diagnostic workflows after their evidence is captured, per ledger record. |

---

## Precedence

This file is a map, not a policy layer. It does not change or add to the instruction hierarchy already defined in `AGENTS.md`. When this file and `AGENTS.md`'s hierarchy could be read as conflicting, `AGENTS.md`'s hierarchy governs, and this file should be corrected to match it.

In short: **direct task instructions → `NORTHSTAR.md` (educational quality) → `docs/content-authoring.md` (authoring contract) → `docs/topic-registry.json` and existing sources → repository scripts/tests/workflows (executable ground truth) → prior topics as precedent, correctable when wrong.** This file exists so you can find each of those quickly, from any starting point, regardless of which agent or vendor you are.

---

## Branch and release discipline

- `main` is the only authoritative branch. It must never be behind any other branch that contains work intended to ship.
- Every change lands on `main` through a branch → pull request → merge sequence, verified by `.github/workflows/actions.yml` before merge and deployed by `.github/workflows/pages.yml` on merge.
- Do not leave a merged or abandoned branch behind once its PR is closed; delete it.
- Treat `pnpm run check` (generation, content/version/discovery validation, tests, typecheck, lint, production build) as the ground truth for whether a change is actually ready — a green run is required before merge, and a failure is evidence to diagnose, never an obstacle to route around.

---

## Keeping this directory honest

If you add a new governed concern anywhere in this repository — a new policy document, a new generated-artifact category, a new agent adapter, a new class of ledger — add its row to the concern map **in the same change**, not as a follow-up. `tests/ssot-directory.test.ts` checks that every canonical path listed above actually exists in the repository, so a stale row fails loudly instead of misleading the next agent.
