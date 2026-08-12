import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { flattenRichText, isAllowedRichTextHref } from "../src/lib/rich-text.ts";
import type { RichText } from "../src/types/content.ts";

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("rich text flattens plain strings and nested semantic nodes in source order", () => {
  const value: RichText = [
    "The ",
    { type: "dfn", term: "Document Object Model", children: [
      { type: "abbr", title: "Document Object Model", children: "DOM" },
    ] },
    " is represented as ",
    { type: "code", children: "document" },
    ".",
  ];

  assert.equal(flattenRichText("plain text"), "plain text");
  assert.equal(flattenRichText(value), "The DOM is represented as document.");
});

test("rich text link validation permits only explicit safe destinations", () => {
  for (const href of [
    "https://developer.mozilla.org/",
    "/topics/typescript",
    "#/topics/react",
    "./relative",
    "../parent",
  ]) assert.equal(isAllowedRichTextHref(href), true, href);

  for (const href of [
    "",
    "http://example.com",
    "//example.com",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "mailto:test@example.com",
  ]) assert.equal(isAllowedRichTextHref(href), false, href);
});

test("inline renderer uses only the approved semantic element set and no raw HTML escape hatch", async () => {
  const renderer = await readProjectFile("src/components/topics/inline-content.tsx");
  for (const element of ["dfn", "abbr", "code", "strong", "em", "a", "kbd", "samp", "var"]) {
    assert.match(renderer, new RegExp(`<${element}(?:\\s|>)`), `missing ${element}`);
  }
  assert.doesNotMatch(renderer, /dangerouslySetInnerHTML|innerHTML/);
  assert.match(renderer, /isAllowedRichTextHref/);
});

test("validator enforces fixed semantic nodes, safe links, and one canonical definition per topic", async () => {
  const validator = await readProjectFile("scripts/validate-content.mjs");
  for (const type of ["dfn", "abbr", "code", "strong", "em", "a", "kbd", "samp", "var"]) {
    assert.match(validator, new RegExp(`\"${type}\"`), `validator missing ${type}`);
  }
  assert.match(validator, /definitionTerms/);
  assert.match(validator, /duplicate defining instance/i);
  assert.match(validator, /isAllowedRichTextHref/);
});

test("all learner prose consumers render or flatten rich text instead of assuming strings", async () => {
  const [blocks, section, visual, topicPage, narration, contentUtils] = await Promise.all([
    readProjectFile("src/components/topics/content-block.tsx"),
    readProjectFile("src/components/topics/topic-section.tsx"),
    readProjectFile("src/components/topics/topic-visual.tsx"),
    readProjectFile("src/pages/topic-page.tsx"),
    readProjectFile("src/lib/narration.ts"),
    readProjectFile("scripts/content-utils.mjs"),
  ]);

  for (const source of [blocks, section, visual, topicPage]) assert.match(source, /InlineContent/);
  assert.match(narration, /flattenRichText/);
  assert.match(contentUtils, /flattenRichText/);
});

test("authoring contract requires first-definition-only semantics and explains nested abbreviation definitions", async () => {
  const contract = await readProjectFile("docs/content-authoring.md");
  assert.match(contract, /first defin/i);
  assert.match(contract, /only once per topic/i);
  assert.match(contract, /dfn/i);
  assert.match(contract, /abbr/i);
  assert.match(contract, /kbd/i);
  assert.match(contract, /samp/i);
  assert.match(contract, /var/i);
});
