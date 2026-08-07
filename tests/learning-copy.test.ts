import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("discovery pages speak to learners instead of describing implementation internals", async () => {
  const [home, topics, card, topicPage] = await Promise.all([
    readProjectFile("src/pages/home-page.tsx"),
    readProjectFile("src/pages/topics-page.tsx"),
    readProjectFile("src/components/topics/topic-card.tsx"),
    readProjectFile("src/pages/topic-page.tsx"),
  ]);

  const discoveryCopy = `${home}\n${topics}`;
  assert.doesNotMatch(discoveryCopy, /5,000 topic-ready architecture/);
  assert.doesNotMatch(discoveryCopy, /320px minimum layout floor/);
  assert.doesNotMatch(discoveryCopy, /catalog count is generated from source content/i);
  assert.match(home, /how-the-web-works/);
  assert.match(home, /without needing the jargon first/i);
  assert.match(topics, /Sort topics/);
  assert.match(topics, /Recommended/);
  assert.doesNotMatch(topics, /Show .* more/i);
  assert.match(card, /Learn this topic/);
  assert.match(topicPage, /Helpful before this guide/);
  assert.match(topicPage, /By the end, you will be able to/);
});
