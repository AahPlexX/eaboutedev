import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const repoRoot = new URL("../", import.meta.url);
const read = (path: string) => readFile(new URL(path, repoRoot), "utf8");
const exists = (path: string) =>
  access(new URL(path, repoRoot))
    .then(() => true)
    .catch(() => false);

// Every backtick-quoted path/file token mentioned in the SSOT concern map and
// CRUD table. Kept as an explicit allowlist (rather than parsed out of the
// Markdown table) so a stale row fails loudly instead of silently passing.
const canonicalPathsReferencedBySsot = [
  "NORTHSTAR.md",
  "docs/content-authoring.md",
  "docs/topic-registry.json",
  "public/content/topics",
  "public/catalog/topic-catalog.json",
  "public/search/topic-search.minisearch.json",
  "src/generated/topic-bootstrap.ts",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  ".github/copilot-instructions.md",
  "tests",
  ".github/workflows/actions.yml",
  ".github/workflows/pages.yml",
  "todo.md",
  "changelog.md",
  "codemap.json",
  "docs/superpowers/specs",
  "docs/superpowers/plans",
  "package.json",
  ".npmrc",
  "pnpm-lock.yaml",
  "docs",
];

test("every canonical path listed in SSOT.md's concern map actually exists", async () => {
  const results = await Promise.all(
    canonicalPathsReferencedBySsot.map(async (path) => [path, await exists(path)] as const),
  );
  const missing = results.filter(([, present]) => !present).map(([path]) => path);
  assert.deepEqual(missing, [], `SSOT.md references paths that do not exist: ${missing.join(", ")}`);
});

test("SSOT.md is a directory, not a duplicate policy body", async () => {
  const [ssot, northStar] = await Promise.all([read("SSOT.md"), read("NORTHSTAR.md")]);

  assert.match(ssot, /Single Source of Truth Directory/i);
  assert.match(ssot, /not a template/i);
  assert.match(ssot, /Concern map/i);
  assert.match(ssot, /main.*must never be behind/i);

  // SSOT.md must not restate the North Star's substantive quality headings;
  // it should point to them, not reproduce them.
  const northStarOnlyHeadings = [
    "Epistemic integrity",
    "Zero-gap continuity",
    "Mechanistic understanding",
    "Progressive depth",
  ];
  for (const heading of northStarOnlyHeadings) {
    assert.ok(northStar.includes(heading), `sanity check: NORTHSTAR.md should still contain ${heading}`);
    assert.ok(!ssot.includes(`## ${heading}`), `SSOT.md must not duplicate the NORTHSTAR.md heading: ${heading}`);
  }
});

test("agent entry points route to SSOT.md alongside NORTHSTAR.md", async () => {
  const [agents, claude, gemini, copilot] = await Promise.all([
    read("AGENTS.md"),
    read("CLAUDE.md"),
    read("GEMINI.md"),
    read(".github/copilot-instructions.md"),
  ]);

  assert.match(agents, /SSOT\.md/);
  assert.match(claude, /SSOT\.md/);
  assert.match(gemini, /SSOT\.md/);
  assert.match(gemini, /@\.\/SSOT\.md/);
  assert.match(copilot, /SSOT\.md/);
  assert.match(copilot, /@\.\.\/SSOT\.md/);

  for (const [name, content] of [["CLAUDE.md", claude], ["GEMINI.md", gemini], [".github/copilot-instructions.md", copilot]] as const) {
    assert.ok(content.length < 2_500, `${name} must stay a thin adapter, not a second policy body`);
  }
});

test("README.md routes human contributors to SSOT.md", async () => {
  const readme = await read("README.md");
  assert.match(readme, /SSOT\.md/);
});
