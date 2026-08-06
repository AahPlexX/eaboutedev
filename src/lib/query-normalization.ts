const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "best", "can", "do", "does",
  "for", "from", "how", "i", "in", "is", "it", "me", "of", "on", "or",
  "should", "the", "to", "use", "what", "when", "where", "which", "with",
]);

const SYNONYM_GROUPS = [
  ["database", "db", "data store", "datastore", "persistence"],
  ["website", "site", "webpage", "web page"],
  ["api", "endpoint", "web service", "integration"],
  ["git", "version control", "source control"],
  ["frontend", "front end", "client side", "browser"],
  ["backend", "back end", "server side", "server"],
  ["javascript", "js", "ecmascript"],
  ["stylesheet", "css", "styles"],
  ["markup", "html", "document structure"],
  ["request", "http call", "fetch"],
  ["relational", "sql", "table database"],
  ["document", "nosql document", "json database"],
  ["key value", "cache", "dictionary database"],
  ["graph", "relationship database", "network database"],
  ["time series", "metrics database", "event measurements"],
  ["search engine", "full text search", "search database"],
  ["vector", "embedding database", "similarity search"],
] as const;

function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[^\p{Letter}\p{Number}+#.-]+/gu, " ")
    .trim();
}

export function tokenizeNaturalLanguage(query: string): string[] {
  const normalized = fold(query);
  if (!normalized) return [];

  const unigrams = normalized.split(/\s+/u).filter((token) => !STOP_WORDS.has(token));
  const bigrams = unigrams.slice(0, -1).map((token, index) => `${token} ${unigrams[index + 1]}`);
  return [...new Set([...unigrams, ...bigrams])];
}

export function expandQueryTerms(query: string): string[] {
  const tokens = tokenizeNaturalLanguage(query);
  const expanded = new Set(tokens);

  for (const group of SYNONYM_GROUPS) {
    const normalizedGroup = group.map(fold);
    if (normalizedGroup.some((term) => tokens.includes(term) || fold(query).includes(term))) {
      normalizedGroup.forEach((term) => expanded.add(term));
    }
  }

  return [...expanded];
}

export function buildSearchQuery(query: string): string {
  return expandQueryTerms(query).join(" ");
}

export function inferQueryIntent(query: string): "compare" | "choose" | "learn" | "troubleshoot" | "lookup" {
  const normalized = fold(query);
  if (/\b(vs|versus|compare|difference|different)\b/u.test(normalized)) return "compare";
  if (/\b(which|choose|pick|best for|when should)\b/u.test(normalized)) return "choose";
  if (/\b(error|broken|fix|debug|not working|fail|fails|failed|failing|failure)\b/u.test(normalized)) return "troubleshoot";
  if (/\b(what is|how does|explain|learn|understand)\b/u.test(normalized)) return "learn";
  return "lookup";
}
