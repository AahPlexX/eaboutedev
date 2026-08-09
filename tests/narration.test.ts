import assert from "node:assert/strict";
import test from "node:test";
import { buildTopicNarration, MAX_NARRATION_PASSAGE_CHARS } from "../src/lib/narration.ts";
import type { TopicDocument } from "../src/types/content.ts";

const topic: TopicDocument = {
  version: 1,
  slug: "narration-fixture",
  title: "Narration fixture",
  eyebrow: "Test",
  summary: "A complete topic summary.",
  category: "Testing",
  level: "Foundational",
  estimatedMinutes: 12,
  icon: "TestTube",
  accent: "oklch(0.5 0.1 250)",
  aliases: [],
  keywords: [],
  prerequisites: ["Know what a browser is."],
  learningOutcomes: ["Explain the complete fixture."],
  heroVisual: {
    kind: "flow",
    title: "Hero relationship",
    caption: "Hero caption.",
    nodes: [{ label: "Hero node", detail: "Hero node detail." }],
  },
  sections: [{
    id: "all-blocks",
    title: "All block types",
    summary: "This section proves every current block has a spoken projection.",
    visual: {
      kind: "map",
      title: "Section relationship",
      caption: "Section visual caption.",
      nodes: [{ label: "Section node", detail: "Section node detail." }],
    },
    blocks: [
      { type: "paragraph", text: "Paragraph meaning." },
      { type: "steps", items: [{ title: "Step title", explanation: "Step explanation.", result: "Step result." }] },
      { type: "cards", items: [{ title: "Card title", summary: "Card summary.", whenToUse: "Use it here.", avoidWhen: "Avoid it there.", example: "Card example." }] },
      { type: "code", language: "TypeScript", code: "const secretSyntax = true;", explanation: "The code demonstrates a typed constant." },
      { type: "table", columns: ["Concept", "Meaning"], rows: [["Cache", "Reuse stored work"]], caption: "Table caption." },
      { type: "callout", tone: "tip", title: "Callout title", body: "Callout body." },
      { type: "checklist", items: ["Checklist item."] },
      { type: "checkpoint", prompt: "Checkpoint prompt?", answer: "Checkpoint answer.", explanation: "Checkpoint explanation." },
    ],
  }],
  glossary: [{ term: "Fixture", definition: "A controlled example used for testing." }],
  related: ["other-topic"],
  sources: [{ label: "Primary Standard", url: "https://example.com/should-not-be-spoken", accessed: "2026-08-09" }],
};

test("narration projects the complete educational topic in reading order", () => {
  const passages = buildTopicNarration(topic);
  const spoken = passages.map((passage) => passage.text).join(" ");
  const expected = [
    "Narration fixture", "A complete topic summary.", "Explain the complete fixture.", "Know what a browser is.",
    "Hero relationship", "Hero caption.", "Hero node", "Hero node detail.", "All block types",
    "This section proves every current block has a spoken projection.", "Section relationship", "Section visual caption.",
    "Section node", "Section node detail.", "Paragraph meaning.", "Step title", "Step explanation.", "Step result.",
    "Card title", "Card summary.", "Use it here.", "Avoid it there.", "Card example.", "TypeScript",
    "The code demonstrates a typed constant.", "Table caption.", "Concept: Cache. Meaning: Reuse stored work.",
    "Callout title", "Callout body.", "Checklist item.", "Checkpoint prompt?", "Checkpoint answer.",
    "Checkpoint explanation.", "Fixture", "A controlled example used for testing.", "Primary Standard",
  ];

  for (const text of expected) assert.ok(spoken.includes(text), `missing spoken content: ${text}`);
  for (let index = 1; index < expected.length; index += 1) {
    assert.ok(spoken.indexOf(expected[index - 1]!) < spoken.indexOf(expected[index]!), `out of order: ${expected[index - 1]} -> ${expected[index]}`);
  }
});

test("narration leaves literal code and URLs on screen instead of speaking them", () => {
  const spoken = buildTopicNarration(topic).map((passage) => passage.text).join(" ");
  assert.doesNotMatch(spoken, /secretSyntax/);
  assert.doesNotMatch(spoken, /https:\/\//);
  assert.match(spoken, /Code example in TypeScript/);
  assert.match(spoken, /Primary reference: Primary Standard/);
});

test("narration passages are deterministic, bounded, and addressable", () => {
  const first = buildTopicNarration(topic);
  const second = buildTopicNarration(topic);
  assert.deepEqual(first, second);
  assert.ok(first.length > 10);
  assert.equal(new Set(first.map((passage) => passage.id)).size, first.length);
  for (const passage of first) {
    assert.ok(passage.text.trim().length > 0);
    assert.ok(passage.text.length <= MAX_NARRATION_PASSAGE_CHARS, `${passage.id} exceeded passage bound`);
    assert.ok(passage.label.trim().length > 0);
  }
});

test("long prose is split without losing words", () => {
  const longText = Array.from({ length: 70 }, (_, index) => `Sentence ${index + 1} explains one concrete thing clearly.`).join(" ");
  const longTopic: TopicDocument = {
    ...topic,
    slug: "long-topic",
    sections: [{ id: "long", title: "Long section", summary: "Long section summary.", blocks: [{ type: "paragraph", text: longText }] }],
  };
  const passages = buildTopicNarration(longTopic);
  const paragraphPassages = passages.filter((passage) => passage.sectionId === "long" && passage.label === "Paragraph");
  assert.ok(paragraphPassages.length > 1);
  assert.equal(paragraphPassages.map((passage) => passage.text).join(" "), longText);
});
