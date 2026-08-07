import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
export const topicDirectory = path.join(rootDirectory, "public/content/topics");

export async function readTopics() {
  const filenames = (await readdir(topicDirectory))
    .filter((filename) => filename.endsWith(".json"))
    .toSorted((left, right) => left.localeCompare(right, "en"));

  return Promise.all(filenames.map(async (filename) => {
    const raw = await readFile(path.join(topicDirectory, filename), "utf8");
    return { filename, raw, document: JSON.parse(raw) };
  }));
}

export function createCatalogEntry(topic, order = 0) {
  return {
    slug: topic.slug,
    title: topic.title,
    eyebrow: topic.eyebrow,
    summary: topic.summary,
    category: topic.category,
    level: topic.level,
    estimatedMinutes: topic.estimatedMinutes,
    icon: topic.icon,
    accent: topic.accent,
    aliases: topic.aliases,
    keywords: topic.keywords,
    order,
  };
}

export function createSearchDocument(topic, order = 0) {
  const catalogEntry = createCatalogEntry(topic, order);
  const sectionTitles = topic.sections.map((section) => section.title);
  const searchable = [
    topic.title,
    topic.eyebrow,
    topic.summary,
    topic.category,
    topic.level,
    ...topic.aliases,
    ...topic.keywords,
    ...sectionTitles,
    ...topic.glossary.flatMap((entry) => [entry.term, entry.definition]),
  ];

  return {
    ...catalogEntry,
    sectionTitles,
    searchText: searchable.join(" "),
  };
}

export function digest(raw) {
  return createHash("sha256").update(raw).digest("hex");
}
