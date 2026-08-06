import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSearchQuery,
  expandQueryTerms,
  inferQueryIntent,
  tokenizeNaturalLanguage,
} from "../src/lib/query-normalization.ts";

test("removes low-value words while retaining meaningful development terms", () => {
  assert.deepEqual(tokenizeNaturalLanguage("What is the best database for a website?"), [
    "database",
    "website",
    "database website",
  ]);
});

test("expands common abbreviations and concept aliases", () => {
  const terms = expandQueryTerms("Which db should I use?");
  assert.ok(terms.includes("database"));
  assert.ok(terms.includes("data store"));
  assert.ok(terms.includes("persistence"));
});

test("builds a search string containing normalized and expanded terms", () => {
  const query = buildSearchQuery("JS in the browser");
  assert.match(query, /javascript/u);
  assert.match(query, /client side/u);
});

test("infers comparison and troubleshooting intent", () => {
  assert.equal(inferQueryIntent("SQL vs document database"), "compare");
  assert.equal(inferQueryIntent("Why is my API request failing?"), "troubleshoot");
});
