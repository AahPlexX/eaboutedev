import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("syntax anatomy is typed, rendered, validated, narrated, and documented", async () => {
  const [types, renderer, validator, narration, authoring, css] = await Promise.all([
    read("src/types/content.ts"),
    read("src/components/topics/content-block.tsx"),
    read("scripts/validate-content.mjs"),
    read("src/lib/narration.ts"),
    read("docs/content-authoring.md"),
    read("src/learning.css"),
  ]);

  assert.match(types, /interface AnatomyBlock/);
  assert.match(types, /type:\s*"anatomy"/);
  assert.match(types, /segments:\s*Array/);
  assert.match(renderer, /case "anatomy"/);
  assert.match(renderer, /syntax-anatomy/);
  assert.match(renderer, /<figure/);
  assert.match(renderer, /<figcaption/);
  assert.match(validator, /"anatomy"/);
  assert.match(validator, /anatomy segments/i);
  assert.match(narration, /case "anatomy"/);
  assert.match(authoring, /syntax anatomy/i);
  assert.match(css, /\.syntax-anatomy/);
  assert.match(css, /@media \(forced-colors:\s*active\)/);
});
