import { readTopics } from "./content-utils.mjs";

const topics = await readTopics();
const failures = [];
const slugs = new Set();
const allowedLevels = new Set(["Foundational", "Intermediate", "Advanced"]);
const allowedKinds = new Set(["flow", "layers", "comparison", "cycle", "map"]);
const allowedBlocks = new Set(["paragraph", "steps", "cards", "code", "table", "callout", "checklist", "checkpoint"]);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

for (const { filename, document: topic } of topics) {
  const fail = (message) => failures.push(`${filename}: ${message}`);
  if (topic.version !== 1) fail("version must equal 1");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug)) fail("slug must be lowercase kebab-case");
  if (`${topic.slug}.json` !== filename) fail("filename must match slug");
  if (slugs.has(topic.slug)) fail("slug must be unique");
  slugs.add(topic.slug);
  for (const field of ["title", "eyebrow", "summary", "category", "icon", "accent"]) {
    if (!isNonEmptyString(topic[field])) fail(`${field} must be a non-empty string`);
  }
  if (!allowedLevels.has(topic.level)) fail("level is invalid");
  if (!Number.isInteger(topic.estimatedMinutes) || topic.estimatedMinutes < 1) fail("estimatedMinutes must be a positive integer");
  for (const field of ["aliases", "keywords", "prerequisites", "learningOutcomes", "sections", "glossary", "sources"]) {
    if (!Array.isArray(topic[field]) || topic[field].length === 0) fail(`${field} must be a non-empty array`);
  }
  if (!allowedKinds.has(topic.heroVisual?.kind) || topic.heroVisual?.nodes?.length < 2) fail("heroVisual must be complete");
  const sectionIds = new Set();
  for (const section of topic.sections ?? []) {
    if (!section.id || sectionIds.has(section.id)) fail(`section id must be unique: ${section.id}`);
    sectionIds.add(section.id);
    if (!section.title || !section.summary) fail(`section ${section.id} needs title and summary`);
    if (!Array.isArray(section.blocks) || section.blocks.length === 0) fail(`section ${section.id} needs content blocks`);
    if (section.visual && !allowedKinds.has(section.visual.kind)) fail(`section ${section.id} visual kind is invalid`);
    for (const block of section.blocks ?? []) {
      if (!allowedBlocks.has(block.type)) fail(`section ${section.id} contains unsupported block type: ${block.type ?? "missing"}`);
      if (block.type === "table" && block.rows.some((row) => row.length !== block.columns.length)) fail(`section ${section.id} table row width differs from columns`);
      if (block.type === "checkpoint") {
        if (!isNonEmptyString(block.prompt)) fail(`section ${section.id} checkpoint prompt must be a non-empty string`);
        if (!isNonEmptyString(block.answer)) fail(`section ${section.id} checkpoint answer must be a non-empty string`);
        if (!isNonEmptyString(block.explanation)) fail(`section ${section.id} checkpoint explanation must be a non-empty string`);
      }
    }
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
