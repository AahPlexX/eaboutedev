import type { ContentBlock, TopicDocument, TopicVisual } from "../types/content.ts";

export const MAX_NARRATION_PASSAGE_CHARS = 360;

export interface NarrationPassage {
  id: string;
  label: string;
  text: string;
  sectionId?: string;
}

interface PassageDraft {
  label: string;
  text: string;
  sectionId?: string;
}

function normalizeSpeechText(text: string) {
  return text.replace(/\s+/gu, " ").trim();
}

function splitOversizedSentence(sentence: string) {
  const words = sentence.split(" ");
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    if (!word) continue;
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= MAX_NARRATION_PASSAGE_CHARS) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);
    if (word.length <= MAX_NARRATION_PASSAGE_CHARS) {
      current = word;
      continue;
    }

    for (let offset = 0; offset < word.length; offset += MAX_NARRATION_PASSAGE_CHARS) {
      chunks.push(word.slice(offset, offset + MAX_NARRATION_PASSAGE_CHARS));
    }
    current = "";
  }

  if (current) chunks.push(current);
  return chunks;
}

function splitSpeechText(text: string) {
  const normalized = normalizeSpeechText(text);
  if (!normalized) return [];
  if (normalized.length <= MAX_NARRATION_PASSAGE_CHARS) return [normalized];

  const sentences = normalized.match(/[^.!?]+(?:[.!?]+|$)/gu)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [normalized];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences.flatMap(splitOversizedSentence)) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length <= MAX_NARRATION_PASSAGE_CHARS) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = sentence;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function visualDrafts(visual: TopicVisual, label: string, sectionId?: string): PassageDraft[] {
  const drafts: PassageDraft[] = [
    { label, text: visual.title, ...(sectionId ? { sectionId } : {}) },
    { label, text: visual.caption, ...(sectionId ? { sectionId } : {}) },
  ];

  for (const node of visual.nodes) {
    drafts.push({ label, text: `${node.label}. ${node.detail}`, ...(sectionId ? { sectionId } : {}) });
  }
  return drafts;
}

function blockDrafts(block: ContentBlock, sectionId: string): PassageDraft[] {
  switch (block.type) {
    case "paragraph":
      return [{ label: "Paragraph", text: block.text, sectionId }];
    case "steps":
      return block.items.map((item, index) => ({
        label: `Step ${index + 1}`,
        text: [item.title, item.explanation, item.result].filter(Boolean).join(". "),
        sectionId,
      }));
    case "cards":
      return block.items.map((item) => ({
        label: item.title,
        text: [
          item.title,
          item.summary,
          item.whenToUse ? `Use when: ${item.whenToUse}` : undefined,
          item.avoidWhen ? `Avoid when: ${item.avoidWhen}` : undefined,
          item.example ? `Example: ${item.example}` : undefined,
        ].filter(Boolean).join(". "),
        sectionId,
      }));
    case "code":
      return [{
        label: "Code explanation",
        text: `Code example in ${block.language}. The source code remains visible on screen. ${block.explanation}`,
        sectionId,
      }];
    case "table":
      return [
        { label: "Table", text: block.caption, sectionId },
        ...block.rows.map((row, rowIndex) => ({
          label: `Table row ${rowIndex + 1}`,
          text: block.columns.map((column, columnIndex) => `${column}: ${row[columnIndex] ?? ""}.`).join(" "),
          sectionId,
        })),
      ];
    case "callout":
      return [{ label: block.title, text: `${block.title}. ${block.body}`, sectionId }];
    case "checklist":
      return block.items.map((item, index) => ({ label: `Checklist item ${index + 1}`, text: item, sectionId }));
    case "checkpoint":
      return [{ label: "Checkpoint", text: `${block.prompt} Answer: ${block.answer} ${block.explanation}`, sectionId }];
  }
}

export function buildTopicNarration(topic: TopicDocument): NarrationPassage[] {
  const drafts: PassageDraft[] = [
    { label: "Topic title", text: topic.title },
    { label: "Topic summary", text: topic.summary },
    ...topic.learningOutcomes.map((outcome, index) => ({ label: `Learning outcome ${index + 1}`, text: outcome })),
    ...topic.prerequisites.map((prerequisite, index) => ({ label: `Helpful prerequisite ${index + 1}`, text: prerequisite })),
    ...visualDrafts(topic.heroVisual, "Topic visual"),
  ];

  for (const section of topic.sections) {
    drafts.push(
      { label: "Section", text: section.title, sectionId: section.id },
      { label: "Section summary", text: section.summary, sectionId: section.id },
    );
    if (section.visual) drafts.push(...visualDrafts(section.visual, "Section visual", section.id));
    for (const block of section.blocks) drafts.push(...blockDrafts(block, section.id));
  }

  for (const entry of topic.glossary) {
    drafts.push({ label: `Glossary: ${entry.term}`, text: `${entry.term}. ${entry.definition}`, sectionId: "glossary" });
  }

  for (const source of topic.sources) {
    drafts.push({ label: "Primary reference", text: `Primary reference: ${source.label}.`, sectionId: "sources" });
  }

  const passages: NarrationPassage[] = [];
  for (const draft of drafts) {
    for (const text of splitSpeechText(draft.text)) {
      const index = passages.length + 1;
      passages.push({
        id: `${topic.slug}-narration-${index}`,
        label: draft.label,
        text,
        ...(draft.sectionId ? { sectionId: draft.sectionId } : {}),
      });
    }
  }

  return passages;
}
