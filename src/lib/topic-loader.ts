import type { TopicDocument } from "@/types/content";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export async function loadTopic(slug: string): Promise<TopicDocument | undefined> {
  if (!SLUG_PATTERN.test(slug)) return undefined;

  const response = await fetch(`${import.meta.env.BASE_URL}content/topics/${slug}.json`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Topic failed to load (${response.status})`);

  return (await response.json()) as TopicDocument;
}
