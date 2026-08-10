import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const northStarRequiredHeadings = [
  "The product promise",
  "Epistemic integrity",
  "Zero-gap continuity",
  "Mechanistic understanding",
  "Research protocol for topic work",
  "Quality review before publication",
  "Hard prohibitions",
  "Instruction hierarchy for agents",
  "The final standard",
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("North Star remains the single canonical educational quality standard", async () => {
  const [northStar, agents, authoring, readme] = await Promise.all([
    read("NORTHSTAR.md"),
    read("AGENTS.md"),
    read("docs/content-authoring.md"),
    read("README.md"),
  ]);

  for (const heading of northStarRequiredHeadings) {
    assert.match(northStar, new RegExp(escapeRegExp(heading), "i"), `NORTHSTAR.md is missing ${heading}`);
  }

  assert.match(northStar, /not a topic template/i);
  assert.match(northStar, /do not edit or weaken this document merely to make a proposed topic easier to generate or validate/i);
  assert.match(agents, /NORTHSTAR\.md/);
  assert.match(authoring, /NORTHSTAR\.md/);
  assert.match(readme, /NORTHSTAR\.md/);
});

test("vendor adapters import or route to the shared governance instead of copying it", async () => {
  const [claude, gemini, copilot] = await Promise.all([
    read("CLAUDE.md"),
    read("GEMINI.md"),
    read(".github/copilot-instructions.md"),
  ]);

  for (const [name, content] of [["CLAUDE.md", claude], ["GEMINI.md", gemini], ["copilot-instructions.md", copilot]] as const) {
    assert.match(content, /NORTHSTAR\.md/, `${name} must route to NORTHSTAR.md`);
    assert.ok(content.length < 2_500, `${name} must stay a thin adapter, not a second policy body`);
    assert.doesNotMatch(content, /# The quality standard/, `${name} must not duplicate the North Star quality body`);
  }

  assert.match(claude, /@AGENTS\.md/);
  assert.match(claude, /@NORTHSTAR\.md/);
  assert.match(gemini, /@\.\/AGENTS\.md/);
  assert.match(gemini, /@\.\/NORTHSTAR\.md/);
  assert.match(gemini, /@\.\/docs\/content-authoring\.md/);
  assert.match(gemini, /@\.\/docs\/topic-registry\.json/);
  assert.match(copilot, /@\.\.\/AGENTS\.md/);
  assert.match(copilot, /@\.\.\/NORTHSTAR\.md/);
});

test("agent entry point preserves repository integration safeguards", async () => {
  const agents = (await read("AGENTS.md")).replaceAll("`", "");
  const required = [
    "main is the authoritative branch",
    "Use pnpm only",
    "public/content/topics/<slug>.json",
    "Do not hand-author generated",
    "Research current, authoritative sources",
    "Do not weaken validators, tests, source requirements, or governance documents",
    "Keep internal development/governance instructions out of client-facing topic prose",
  ];

  for (const rule of required) {
    assert.match(agents, new RegExp(escapeRegExp(rule), "i"), `AGENTS.md is missing: ${rule}`);
  }
});
