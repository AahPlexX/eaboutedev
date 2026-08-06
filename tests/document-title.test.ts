import assert from "node:assert/strict";
import test from "node:test";
import { getTopicDocumentTitle, SITE_TITLE } from "../src/lib/document-title.ts";

test("topic titles extend the browser title without mutating guide content", () => {
  const topicTitle = "The 7 Types of Databases";
  assert.equal(getTopicDocumentTitle(topicTitle), `${topicTitle} · ${SITE_TITLE}`);
  assert.equal(topicTitle, "The 7 Types of Databases");
});

test("the base site title is used when no topic is active", () => {
  assert.equal(getTopicDocumentTitle(), SITE_TITLE);
});
