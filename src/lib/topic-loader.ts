import type { TopicDocument } from "@/types/content";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const topicPromises = new Map<string, Promise<TopicDocument | undefined>>();

function getBaseUrl(): string {
  return import.meta.env?.BASE_URL ?? "/";
}

async function fetchTopic(slug: string): Promise<TopicDocument | undefined> {
  const response = await fetch(`${getBaseUrl()}content/topics/${slug}.json`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Topic failed to load (${response.status})`);
  return await response.json() as TopicDocument;
}

export function loadTopic(slug: string): Promise<TopicDocument | undefined> {
  if (!SLUG_PATTERN.test(slug)) return Promise.resolve(undefined);

  const existing = topicPromises.get(slug);
  if (existing) return existing;

  const request = fetchTopic(slug).catch((error: unknown) => {
    topicPromises.delete(slug);
    throw error;
  });
  topicPromises.set(slug, request);
  return request;
}

export function resetTopicCache(): void {
  topicPromises.clear();
}
