import { flattenRichText, isAllowedRichTextHref } from "../src/lib/rich-text.ts";
import { readTopics } from "./content-utils.mjs";

const topics = await readTopics();
const failures = [];
const slugs = new Set();
const allowedLevels = new Set(["Foundational", "Intermediate", "Advanced"]);
const allowedKinds = new Set(["flow", "layers", "comparison", "cycle", "map"]);
const allowedBlocks = new Set(["paragraph", "steps", "cards", "code", "anatomy", "table", "callout", "checklist", "checkpoint"]);
const inlineNodeTypes = new Set(["dfn", "abbr", "code", "strong", "em", "a", "kbd", "samp", "var"]);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const normalizeDefinitionTerm = (value) => value.trim().replace(/\s+/gu, " ").toLocaleLowerCase("en");

function validateRichText(value, context, fail, definitionTerms) {
  if (typeof value === "string") {
    if (value.length === 0) fail(`${context} contains an empty text fragment`);
    return;
  }
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${context} must be a non-empty string or rich-text array`);
    return;
  }

  for (const [index, part] of value.entries()) {
    const partContext = `${context} part ${index + 1}`;
    if (typeof part === "string") {
      if (part.length === 0) fail(`${partContext} is an empty text fragment`);
      continue;
    }
    if (!part || typeof part !== "object" || Array.isArray(part) || !inlineNodeTypes.has(part.type)) {
      fail(`${partContext} has an unsupported semantic node`);
      continue;
    }

    const allowedKeys = new Set(["type", "children"]);
    if (part.type === "dfn") allowedKeys.add("term");
    if (part.type === "abbr") allowedKeys.add("title");
    if (part.type === "a") allowedKeys.add("href");
    for (const key of Object.keys(part)) {
      if (!allowedKeys.has(key)) fail(`${partContext} contains unsupported property: ${key}`);
    }

    if (!("children" in part)) fail(`${partContext} requires children`);
    else validateRichText(part.children, `${partContext} children`, fail, definitionTerms);

    if (part.type === "dfn") {
      if (!isNonEmptyString(part.term)) fail(`${partContext} dfn term must be a non-empty string`);
      else {
        const normalized = normalizeDefinitionTerm(part.term);
        if (definitionTerms.has(normalized)) fail(`${partContext} is a duplicate defining instance for term: ${part.term}`);
        else definitionTerms.add(normalized);
      }
    }
    if (part.type === "abbr" && !isNonEmptyString(part.title)) fail(`${partContext} abbr title must be a non-empty expansion`);
    if (part.type === "a") {
      if (!isNonEmptyString(part.href)) fail(`${partContext} link href must be a non-empty string`);
      else if (!isAllowedRichTextHref(part.href)) fail(`${partContext} link href is not allowed: ${part.href}`);
    }
  }

  if (!flattenRichText(value).trim()) fail(`${context} must contain visible text`);
}

function validateVisual(visual, context, fail, definitionTerms) {
  if (!visual || !allowedKinds.has(visual.kind)) {
    fail(`${context} kind is invalid`);
    return;
  }
  validateRichText(visual.title, `${context} title`, fail, definitionTerms);
  validateRichText(visual.caption, `${context} caption`, fail, definitionTerms);
  if (!Array.isArray(visual.nodes) || visual.nodes.length < 2) {
    fail(`${context} needs at least two nodes`);
    return;
  }
  for (const [index, node] of visual.nodes.entries()) {
    validateRichText(node.label, `${context} node ${index + 1} label`, fail, definitionTerms);
    validateRichText(node.detail, `${context} node ${index + 1} detail`, fail, definitionTerms);
  }
}

for (const { filename, document: topic } of topics) {
  const fail = (message) => failures.push(`${filename}: ${message}`);
  const definitionTerms = new Set();

  if (topic.version !== 1) fail("version must equal 1");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug)) fail("slug must be lowercase kebab-case");
  if (`${topic.slug}.json` !== filename) fail("filename must match slug");
  if (slugs.has(topic.slug)) fail("slug must be unique");
  slugs.add(topic.slug);
  for (const field of ["title", "eyebrow", "category", "icon", "accent"]) {
    if (!isNonEmptyString(topic[field])) fail(`${field} must be a non-empty string`);
  }
  validateRichText(topic.summary, "summary", fail, definitionTerms);

  if (!allowedLevels.has(topic.level)) fail("level is invalid");
  if (!Number.isInteger(topic.estimatedMinutes) || topic.estimatedMinutes < 1) fail("estimatedMinutes must be a positive integer");
  for (const field of ["aliases", "keywords", "prerequisites", "learningOutcomes", "sections", "glossary", "sources"]) {
    if (!Array.isArray(topic[field]) || topic[field].length === 0) fail(`${field} must be a non-empty array`);
  }
  for (const [index, prerequisite] of (topic.prerequisites ?? []).entries()) validateRichText(prerequisite, `prerequisite ${index + 1}`, fail, definitionTerms);
  for (const [index, outcome] of (topic.learningOutcomes ?? []).entries()) validateRichText(outcome, `learning outcome ${index + 1}`, fail, definitionTerms);
  validateVisual(topic.heroVisual, "heroVisual", fail, definitionTerms);

  const sectionIds = new Set();
  let checkpointCount = 0;
  for (const section of topic.sections ?? []) {
    if (!section.id || sectionIds.has(section.id)) fail(`section id must be unique: ${section.id}`);
    sectionIds.add(section.id);
    if (!isNonEmptyString(section.title)) fail(`section ${section.id} needs a title`);
    validateRichText(section.summary, `section ${section.id} summary`, fail, definitionTerms);
    if (!Array.isArray(section.blocks) || section.blocks.length === 0) fail(`section ${section.id} needs content blocks`);
    if (section.visual) validateVisual(section.visual, `section ${section.id} visual`, fail, definitionTerms);

    for (const block of section.blocks ?? []) {
      if (!allowedBlocks.has(block.type)) {
        fail(`section ${section.id} contains unsupported block type: ${block.type ?? "missing"}`);
        continue;
      }
      if (block.type === "paragraph") validateRichText(block.text, `section ${section.id} paragraph`, fail, definitionTerms);
      if (block.type === "steps") {
        for (const [index, item] of (block.items ?? []).entries()) {
          validateRichText(item.title, `section ${section.id} step ${index + 1} title`, fail, definitionTerms);
          validateRichText(item.explanation, `section ${section.id} step ${index + 1} explanation`, fail, definitionTerms);
          if (item.result !== undefined) validateRichText(item.result, `section ${section.id} step ${index + 1} result`, fail, definitionTerms);
        }
      }
      if (block.type === "cards") {
        for (const [index, item] of (block.items ?? []).entries()) {
          validateRichText(item.title, `section ${section.id} card ${index + 1} title`, fail, definitionTerms);
          validateRichText(item.summary, `section ${section.id} card ${index + 1} summary`, fail, definitionTerms);
          for (const field of ["whenToUse", "avoidWhen", "example"]) {
            if (item[field] !== undefined) validateRichText(item[field], `section ${section.id} card ${index + 1} ${field}`, fail, definitionTerms);
          }
        }
      }
      if (block.type === "code") {
        if (!isNonEmptyString(block.language) || !isNonEmptyString(block.code)) fail(`section ${section.id} code block needs language and code`);
        validateRichText(block.explanation, `section ${section.id} code explanation`, fail, definitionTerms);
      }
      if (block.type === "anatomy") {
        if (!isNonEmptyString(block.language)) fail(`section ${section.id} anatomy language must be a non-empty string`);
        validateRichText(block.title, `section ${section.id} anatomy title`, fail, definitionTerms);
        validateRichText(block.caption, `section ${section.id} anatomy caption`, fail, definitionTerms);
        if (!Array.isArray(block.segments) || block.segments.length < 2) fail(`section ${section.id} anatomy segments must contain at least two items`);
        for (const [index, segment] of (block.segments ?? []).entries()) {
          if (!isNonEmptyString(segment.code)) fail(`section ${section.id} anatomy segment ${index + 1} code must be a non-empty string`);
          validateRichText(segment.label, `section ${section.id} anatomy segment ${index + 1} label`, fail, definitionTerms);
          validateRichText(segment.explanation, `section ${section.id} anatomy segment ${index + 1} explanation`, fail, definitionTerms);
        }
      }
      if (block.type === "table") {
        validateRichText(block.caption, `section ${section.id} table caption`, fail, definitionTerms);
        for (const [index, column] of (block.columns ?? []).entries()) validateRichText(column, `section ${section.id} table column ${index + 1}`, fail, definitionTerms);
        if ((block.rows ?? []).some((row) => row.length !== block.columns.length)) fail(`section ${section.id} table row width differs from columns`);
        for (const [rowIndex, row] of (block.rows ?? []).entries()) for (const [cellIndex, cell] of row.entries()) validateRichText(cell, `section ${section.id} table row ${rowIndex + 1} cell ${cellIndex + 1}`, fail, definitionTerms);
      }
      if (block.type === "callout") {
        validateRichText(block.title, `section ${section.id} callout title`, fail, definitionTerms);
        validateRichText(block.body, `section ${section.id} callout body`, fail, definitionTerms);
      }
      if (block.type === "checklist") for (const [index, item] of (block.items ?? []).entries()) validateRichText(item, `section ${section.id} checklist item ${index + 1}`, fail, definitionTerms);
      if (block.type === "checkpoint") {
        checkpointCount += 1;
        validateRichText(block.prompt, `section ${section.id} checkpoint prompt`, fail, definitionTerms);
        validateRichText(block.answer, `section ${section.id} checkpoint answer`, fail, definitionTerms);
        validateRichText(block.explanation, `section ${section.id} checkpoint explanation`, fail, definitionTerms);
      }
    }
  }

  if (checkpointCount < 2) fail("topic must include at least two comprehension checkpoints");
  for (const [index, entry] of (topic.glossary ?? []).entries()) {
    if (!isNonEmptyString(entry.term)) fail(`glossary entry ${index + 1} term must be a non-empty string`);
    validateRichText(entry.definition, `glossary entry ${index + 1} definition`, fail, definitionTerms);
  }
  for (const source of topic.sources ?? []) {
    if (!source.url.startsWith("https://")) fail(`source must use HTTPS: ${source.url}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessed)) fail(`source accessed date is invalid: ${source.accessed}`);
  }
}

for (const { filename, document: topic } of topics) {
  for (const related of topic.related ?? []) {
    if (!slugs.has(related)) failures.push(`${filename}: related topic does not exist: ${related}`);
  }
}

if (topics.length > 5000) failures.push(`topic count ${topics.length} exceeds the supported maximum of 5000`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`validated ${topics.length} topic documents`);
