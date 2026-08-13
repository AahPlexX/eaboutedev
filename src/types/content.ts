export type TopicLevel = "Foundational" | "Intermediate" | "Advanced";
type VisualKind = "flow" | "layers" | "comparison" | "cycle" | "map";
type BlockTone = "note" | "tip" | "warning" | "definition";

export type RichText = string | InlineContent[];

export type InlineContent = string | InlineSemanticNode;

interface InlineNodeBase {
  children: RichText;
}

interface DfnInlineNode extends InlineNodeBase {
  type: "dfn";
  term: string;
}

interface AbbrInlineNode extends InlineNodeBase {
  type: "abbr";
  title: string;
}

interface LinkInlineNode extends InlineNodeBase {
  type: "a";
  href: string;
}

interface CodeInlineNode extends InlineNodeBase { type: "code"; }
interface StrongInlineNode extends InlineNodeBase { type: "strong"; }
interface EmInlineNode extends InlineNodeBase { type: "em"; }
interface KbdInlineNode extends InlineNodeBase { type: "kbd"; }
interface SampInlineNode extends InlineNodeBase { type: "samp"; }
interface VarInlineNode extends InlineNodeBase { type: "var"; }

export type InlineSemanticNode =
  | DfnInlineNode
  | AbbrInlineNode
  | LinkInlineNode
  | CodeInlineNode
  | StrongInlineNode
  | EmInlineNode
  | KbdInlineNode
  | SampInlineNode
  | VarInlineNode;

interface SourceReference {
  label: string;
  url: string;
  accessed: string;
}

interface VisualNode {
  label: RichText;
  detail: RichText;
}

export interface TopicVisual {
  kind: VisualKind;
  title: RichText;
  caption: RichText;
  nodes: VisualNode[];
}

interface ParagraphBlock { type: "paragraph"; text: RichText; }
interface StepsBlock { type: "steps"; items: Array<{ title: RichText; explanation: RichText; result?: RichText }>; }
interface CardsBlock { type: "cards"; items: Array<{ title: RichText; summary: RichText; whenToUse?: RichText; avoidWhen?: RichText; example?: RichText }>; }
interface CodeBlock { type: "code"; language: string; code: string; explanation: RichText; }
interface AnatomyBlock { type: "anatomy"; title: RichText; language: string; caption: RichText; segments: Array<{ code: string; label: RichText; explanation: RichText }>; }
interface TableBlock { type: "table"; columns: RichText[]; rows: RichText[][]; caption: RichText; }
interface CalloutBlock { type: "callout"; tone: BlockTone; title: RichText; body: RichText; }
interface ChecklistBlock { type: "checklist"; items: RichText[]; }
interface CheckpointBlock { type: "checkpoint"; prompt: RichText; answer: RichText; explanation: RichText; }

export type ContentBlock = ParagraphBlock | StepsBlock | CardsBlock | CodeBlock | AnatomyBlock | TableBlock | CalloutBlock | ChecklistBlock | CheckpointBlock;

export interface TopicSection {
  id: string;
  title: string;
  summary: RichText;
  visual?: TopicVisual;
  blocks: ContentBlock[];
}

interface GlossaryEntry { term: string; definition: RichText; }

export interface TopicDocument {
  version: 1;
  slug: string;
  title: string;
  eyebrow: string;
  summary: RichText;
  category: string;
  level: TopicLevel;
  estimatedMinutes: number;
  icon: string;
  accent: string;
  aliases: string[];
  keywords: string[];
  prerequisites: RichText[];
  learningOutcomes: RichText[];
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
