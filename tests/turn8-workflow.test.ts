import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(new URL("../.github/workflows/turn8-topic-expansion.yml", import.meta.url), "utf8");

test("Turn 8 generator replacement writes real newlines instead of literal backslash-n text", () => {
  assert.doesNotMatch(
    workflow,
    /'const catalog = topics\\\\n\s*\.map\([^\n]+\)\\\\n\s*\.toSorted/,
    "workflow must not inject literal \\n sequences into JavaScript source",
  );

  assert.match(
    workflow,
    /'const catalog = topics\\n\s*\.map\([^\n]+\)\\n\s*\.toSorted/,
    "workflow should use Python newline escapes that materialize as real JavaScript line breaks",
  );
});
