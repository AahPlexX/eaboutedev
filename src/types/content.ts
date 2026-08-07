export type TopicLevel = "Foundational" | "Intermediate" | "Advanced";
export type VisualKind = "flow" | "layers" | "comparison" | "cycle" | "map";
export type BlockTone = "note" | "tip" | "warning" | "definition";

export interface SourceReference {
  label: string;
  url: string;
  accessed: string;
}

export interface VisualNode {
  label: string;
  detail: string;
}

export interface TopicVisual {
  kind: VisualKind;
  title: string;
  caption: string;
  nodes: VisualNode[];
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface StepsBlock {
  type: "steps";
  items: Array<{
    title: string;
    explanation: string;
    result?: string;
  }>;
}

export interface CardsBlock {
  type: "cards";
  items: Array<{
    title: string;
    summary: string;
    whenToUse?: string;
    avoidWhen?: string;
    example?: string;
  }>;
}

export interface CodeBlock {
  type: "code";
  language: string;
  code: string;
  explanation: string;
}

export interface TableBlock {
  type: "table";
  columns: string[];
  rows: string[][];
  caption: string;
}

export interface CalloutBlock {
  type: "callout";
  tone: BlockTone;
  title: string;
  body: string;
}

export interface ChecklistBlock {
  type: "checklist";
  items: string[];
}

export interface CheckpointBlock {
  type: "checkpoint";
  prompt: string;
  answer: string;
  explanation: string;
}

export type ContentBlock =
  | ParagraphBlock
  | StepsBlock
  | CardsBlock
  | CodeBlock
  | TableBlock
  | CalloutBlock
  | ChecklistBlock
  | CheckpointBlock;

export interface TopicSection {
  id: string;
  title: string;
  summary: string;
  visual?: TopicVisual;
  blocks: ContentBlock[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

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
}

export interface TopicSearchDocument extends TopicCatalogEntry {
  sectionTitles: string[];
  searchText: string;
}
