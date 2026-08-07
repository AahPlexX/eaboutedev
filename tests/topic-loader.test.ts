import assert from "node:assert/strict";
import test from "node:test";
import { loadTopic, resetTopicCache } from "../src/lib/topic-loader.ts";

const minimalTopic = { version: 1, slug: "topic-one", title: "Topic one" };

test("topic loader deduplicates successful requests and keeps 404 semantics", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  resetTopicCache();
  globalThis.fetch = async (input) => {
    calls += 1;
    if (String(input).includes("missing-topic")) return new Response("", { status: 404 });
    return new Response(JSON.stringify(minimalTopic), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const [first, second] = await Promise.all([loadTopic("topic-one"), loadTopic("topic-one")]);
    assert.deepEqual(first, minimalTopic);
    assert.strictEqual(first, second);
    assert.equal(calls, 1);
    assert.equal(await loadTopic("missing-topic"), undefined);
    assert.equal(await loadTopic("missing-topic"), undefined);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    resetTopicCache();
  }
});

test("topic loader retries non-404 failures and rejects invalid slugs without fetching", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  resetTopicCache();
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) return new Response("no", { status: 500 });
    return new Response(JSON.stringify(minimalTopic), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    assert.equal(await loadTopic("Not Valid"), undefined);
    assert.equal(calls, 0);
    await assert.rejects(loadTopic("topic-one"));
    assert.deepEqual(await loadTopic("topic-one"), minimalTopic);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    resetTopicCache();
  }
});
