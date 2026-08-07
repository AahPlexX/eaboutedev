import assert from "node:assert/strict";
import test from "node:test";
import { loadCatalog, resetCatalogCache } from "../src/lib/catalog-loader.ts";

const catalogPayload = [{
  slug: "example",
  title: "Example",
  eyebrow: "Example",
  summary: "Example",
  category: "Example",
  level: "Foundational",
  estimatedMinutes: 5,
  icon: "x",
  accent: "oklch(0.6 0.1 200)",
  aliases: [],
  keywords: [],
  order: 0,
}];

test("catalog loader deduplicates successful requests", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  resetCatalogCache();
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify(catalogPayload), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const [first, second] = await Promise.all([loadCatalog(), loadCatalog()]);
    const third = await loadCatalog();
    assert.equal(calls, 1);
    assert.deepEqual(first, catalogPayload);
    assert.strictEqual(first, second);
    assert.strictEqual(first, third);
  } finally {
    globalThis.fetch = originalFetch;
    resetCatalogCache();
  }
});

test("catalog loader clears a failed request so retry can succeed", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  resetCatalogCache();
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) return new Response("no", { status: 503 });
    return new Response(JSON.stringify(catalogPayload), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    await assert.rejects(loadCatalog());
    assert.deepEqual(await loadCatalog(), catalogPayload);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    resetCatalogCache();
  }
});
