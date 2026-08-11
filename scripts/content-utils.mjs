import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
const topicDirectory = path.join(rootDirectory, "public/content/topics");

const recommendedTopicOrder = new Map([
  ["how-the-web-works", 0],
  ["html-css-and-javascript", 1],
  ["git-and-github", 2],
  ["nodejs-and-package-management", 3],
  ["typescript", 4],
  ["react", 5],
  ["vite", 6],
  ["apis-and-data-exchange", 7],
  ["the-seven-types-of-databases", 8],
]);

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
    order: recommendedTopicOrder.get(topic.slug) ?? recommendedTopicOrder.size + order,
  };
}

export function createSearchDocument(topic) {
  return {
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
    category: topic.category,
    level: topic.level,
    estimatedMinutes: topic.estimatedMinutes,
    aliases: topic.aliases.join(" "),
    keywords: topic.keywords.join(" "),
    sectionTitles: topic.sections.map((section) => section.title).join(" "),
    glossaryText: topic.glossary.flatMap((entry) => [entry.term, entry.definition]).join(" "),
  };
}

export function digest(raw) {
  return createHash("sha256").update(raw).digest("hex");
}
