import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("checkpoint is typed, rendered with native disclosure, and validated", async () => {
  const [types, renderer, validator] = await Promise.all([
    readProjectFile("src/types/content.ts"),
    readProjectFile("src/components/topics/content-block.tsx"),
    readProjectFile("scripts/validate-content.mjs"),
  ]);

  assert.match(types, /interface CheckpointBlock/);
  assert.match(types, /type: "checkpoint"/);
  assert.match(types, /prompt: RichText/);
  assert.match(types, /answer: RichText/);
  assert.match(types, /explanation: RichText/);

  assert.match(renderer, /case "checkpoint"/);
  assert.match(renderer, /<details className="checkpoint">/);
  assert.match(renderer, /<summary>/);
  assert.match(renderer, /InlineContent value=\{block\.prompt\}/);
  assert.match(renderer, /InlineContent value=\{block\.answer\}/);
  assert.match(renderer, /InlineContent value=\{block\.explanation\}/);

  assert.match(validator, /"checkpoint"/);
  assert.match(validator, /block\.prompt/);
  assert.match(validator, /block\.answer/);
  assert.match(validator, /block\.explanation/);
});
