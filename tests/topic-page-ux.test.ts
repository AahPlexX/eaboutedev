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

test("topic navigation renders exactly one desktop and one mobile variant without duplicate landmarks", async () => {
  const toc = await read("src/components/topics/topic-toc.tsx");
  const page = await read("src/pages/topic-page.tsx");

  assert.match(toc, /topic-toc-desktop/);
  assert.match(toc, /topic-toc-mobile/);
  assert.match(toc, /On this page/);
  assert.match(toc, /sections\.map/);
  assert.doesNotMatch(toc, /display:\s*none/);

  // TopicToc must render only the variant it is asked for, never both landmarks at once,
  // so the deployed page never exposes two "On this page" navigation landmarks.
  assert.match(toc, /variant\s*===\s*"desktop"/);

  const desktopUsages = page.match(/<TopicToc[^>]*variant="desktop"/g) ?? [];
  const mobileUsages = page.match(/<TopicToc[^>]*variant="mobile"/g) ?? [];
  assert.equal(desktopUsages.length, 1, "expected exactly one desktop TopicToc usage");
  assert.equal(mobileUsages.length, 1, "expected exactly one mobile TopicToc usage");
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
