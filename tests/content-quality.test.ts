import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const topicDirectory = new URL("../public/content/topics/", import.meta.url);

async function readTopic(filename: string) {
  return JSON.parse(await readFile(new URL(filename, topicDirectory), "utf8")) as {
    title: string;
    sections: Array<{ blocks: Array<{ type: string }> }>;
  };
}

test("every guide includes at least two immediate comprehension checkpoints", async () => {
  const filenames = (await readdir(topicDirectory)).filter((filename) => filename.endsWith(".json"));
  for (const filename of filenames) {
    const topic = await readTopic(filename);
    const checkpointCount = topic.sections.flatMap((section) => section.blocks).filter((block) => block.type === "checkpoint").length;
    assert.ok(checkpointCount >= 2, `${topic.title} has ${checkpointCount} checkpoints`);
  }
});

test("authoring contract requires concrete-first dependency ordering", async () => {
  const contract = (await readFile(new URL("../docs/content-authoring.md", import.meta.url), "utf8")).toLowerCase();
  assert.match(contract, /concrete before abstract/);
  assert.match(contract, /meaning before vocabulary/);
  assert.match(contract, /cause before rule/);
  assert.match(contract, /checkpoint/);
});
