import type { TopicCatalogEntry } from "@/types/content";

let catalogPromise: Promise<TopicCatalogEntry[]> | undefined;

function getBaseUrl(): string {
  return import.meta.env?.BASE_URL ?? "/";
}

async function fetchCatalog(): Promise<TopicCatalogEntry[]> {
  const response = await fetch(`${getBaseUrl()}catalog/topic-catalog.json`);
  if (!response.ok) throw new Error(`Catalog failed to load (${response.status})`);

  const catalog = await response.json() as TopicCatalogEntry[];
  if (!Array.isArray(catalog)) throw new Error("Catalog response is invalid");
  return catalog;
}

export function loadCatalog(): Promise<TopicCatalogEntry[]> {
  catalogPromise ??= fetchCatalog().catch((error: unknown) => {
    catalogPromise = undefined;
    throw error;
  });
  return catalogPromise;
}

export function resetCatalogCache(): void {
  catalogPromise = undefined;
}
