import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("topic page separates orientation, learning workspace, and reference zones", async () => {
  const source = await read("src/pages/topic-page.tsx");

  assert.match(source, /topic-orientation/);
  assert.match(source, /topic-workspace/);
  assert.match(source, /topic-reference-zone/);
  assert.match(source, /topic-learning-map/);
  assert.match(source, /TopicNarration/);
  assert.match(source, /topic\.sections\.map/);
  assert.match(source, /<Glossary topic=\{topic\}/);
  assert.match(source, /<Sources topic=\{topic\}/);
});

test("topic navigation has desktop and mobile variants without hiding lesson content", async () => {
  const toc = await read("src/components/topics/topic-toc.tsx");

  assert.match(toc, /topic-toc-desktop/);
  assert.match(toc, /topic-toc-mobile/);
  assert.match(toc, /On this page/);
  assert.match(toc, /sections\.map/);
  assert.doesNotMatch(toc, /display:\s*none/);
});

test("topic learning layout constrains reading measure and lets technical blocks escape wider", async () => {
  const [globalCss, learningCss] = await Promise.all([
    read("src/index.css"),
    read("src/learning.css"),
  ]);
  const css = `${globalCss}\n${learningCss}`;

  assert.match(css, /\.topic-reading-column/);
  assert.match(css, /max-inline-size:\s*(?:7[0-9]|8[0-2])ch/);
  assert.match(css, /\.content-stack\s*>\s*\.code-example/);
  assert.match(css, /\.content-stack\s*>\s*\.table-scroll/);
  assert.match(css, /\.content-stack\s*>\s*\.syntax-anatomy/);
  assert.match(css, /\.topic-reference-zone/);
});

test("topic route remains accessible and reflows at narrow widths", async () => {
  const [page, css] = await Promise.all([
    read("src/pages/topic-page.tsx"),
    read("src/learning.css"),
  ]);

  assert.match(page, /id="topic-content"/);
  assert.match(page, /aria-label="Topic overview"/);
  assert.match(css, /@media \(max-width:\s*64rem\)/);
  assert.match(css, /@media \(max-width:\s*40rem\)/);
  assert.match(css, /min-block-size:\s*2\.75rem/);
}
);
