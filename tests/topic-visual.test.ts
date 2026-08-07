import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("visual renderer preserves relationship semantics by visual kind", async () => {
  const [renderer, baseStyles, learningStyles] = await Promise.all([
    readProjectFile("src/components/topics/topic-visual.tsx"),
    readProjectFile("src/index.css"),
    readProjectFile("src/learning.css"),
  ]);
  const styles = `${baseStyles}\n${learningStyles}`;

  assert.match(renderer, /visual\.kind === "flow"/);
  assert.match(renderer, /visual\.kind === "cycle"/);
  assert.match(renderer, /cycle-repeat/);
  assert.match(renderer, /showDirectionalConnector/);
  assert.match(styles, /\.visual-layers/);
  assert.match(styles, /\.visual-comparison/);
  assert.match(styles, /\.visual-cycle/);
  assert.match(styles, /\.visual-map/);
  assert.match(styles, /\.cycle-repeat/);
});
