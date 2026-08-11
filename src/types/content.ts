export type TopicLevel = "Foundational" | "Intermediate" | "Advanced";
type VisualKind = "flow" | "layers" | "comparison" | "cycle" | "map";
type BlockTone = "note" | "tip" | "warning" | "definition";

interface SourceReference {
  label: string;
  url: string;
  accessed: string;
}

interface VisualNode {
  label: string;
  detail: string;
}

export interface TopicVisual {
  kind: VisualKind;
  title: string;
  caption: string;
  nodes: VisualNode[];
}

interface ParagraphBlock { type: "paragraph"; text: string; }
interface StepsBlock { type: "steps"; items: Array<{ title: string; explanation: string; result?: string }>; }
interface CardsBlock { type: "cards"; items: Array<{ title: string; summary: string; whenToUse?: string; avoidWhen?: string; example?: string }>; }
interface CodeBlock { type: "code"; language: string; code: string; explanation: string; }
interface AnatomyBlock { type: "anatomy"; title: string; language: string; caption: string; segments: Array<{ code: string; label: string; explanation: string }>; }
interface TableBlock { type: "table"; columns: string[]; rows: string[][]; caption: string; }
interface CalloutBlock { type: "callout"; tone: BlockTone; title: string; body: string; }
interface ChecklistBlock { type: "checklist"; items: string[]; }
interface CheckpointBlock { type: "checkpoint"; prompt: string; answer: string; explanation: string; }

export type ContentBlock = ParagraphBlock | StepsBlock | CardsBlock | CodeBlock | AnatomyBlock | TableBlock | CalloutBlock | ChecklistBlock | CheckpointBlock;

export interface TopicSection {
  id: string;
  title: string;
  summary: string;
  visual?: TopicVisual;
  blocks: ContentBlock[];
}

interface GlossaryEntry { term: string; definition: string; }

export interface TopicDocument {
  version: 1;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  category: string;
  level: TopicLevel;
  estimatedMinutes: number;
  icon: string;
  accent: string;
  aliases: string[];
  keywords: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  heroVisual: TopicVisual;
  sections: TopicSection[];
  glossary: GlossaryEntry[];
  related: string[];
  sources: SourceReference[];
}

export interface TopicCatalogEntry {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  category: string;
  level: TopicLevel;
  estimatedMinutes: number;
  icon: string;
  accent: string;
  aliases: string[];
  keywords: string[];
  order: number;
}

export interface TopicSearchStoredFields {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: TopicLevel;
  estimatedMinutes: number;
}

export interface TopicSearchIndexDocument extends TopicSearchStoredFields {
  aliases: string;
  keywords: string;
  sectionTitles: string;
  glossaryText: string;
}
