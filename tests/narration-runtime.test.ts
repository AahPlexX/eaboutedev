import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("neural narration worker uses the exact free local-inference contract", async () => {
  const worker = await readProjectFile("src/workers/narration.worker.ts");
  assert.match(worker, /https:\/\/cdn\.jsdelivr\.net\/npm\/kokoro-js@1\.2\.1\/dist\/kokoro\.web\.js/);
  assert.match(worker, /onnx-community\/Kokoro-82M-v1\.0-ONNX/);
  assert.match(worker, /dtype:\s*"q8"/);
  assert.match(worker, /device:\s*"wasm"/);
  assert.match(worker, /const KOKORO_VOICE = "af_heart"/);
  assert.match(worker, /voice:\s*KOKORO_VOICE/);
  assert.match(worker, /toBlob\(\)/);
  assert.match(worker, /progress_callback/);
  assert.doesNotMatch(worker, /speechSynthesis|SpeechSynthesisUtterance/);
});

test("topic narration is user initiated, seekable, retryable, and transcript synced", async () => {
  const [player, topicPage] = await Promise.all([
    readProjectFile("src/components/topics/topic-narration.tsx"),
    readProjectFile("src/pages/topic-page.tsx"),
  ]);

  assert.match(topicPage, /import \{ TopicNarration \}/);
  assert.match(topicPage, /<TopicNarration topic=\{topic\} \/>/);
  assert.match(player, /new Worker\(new URL\("\.\.\/\.\.\/workers\/narration\.worker\.ts", import\.meta\.url\)/);
  assert.match(player, /Play narration/);
  assert.match(player, /Pause/);
  assert.match(player, /Restart/);
  assert.match(player, /type="range"/);
  assert.match(player, /aria-label="Topic narration position"/);
  assert.match(player, /aria-label="Narration transcript"/);
  assert.match(player, /aria-current=\{isCurrent \? "true" : undefined\}/);
  assert.match(player, /aria-live="polite"/);
  assert.match(player, /about 100 MB/i);
  assert.match(player, /topic text stays in your browser/i);
  assert.match(player, /Retry narration/);
  assert.match(player, /URL\.revokeObjectURL/);
  assert.match(player, /prefetch/);
  assert.doesNotMatch(player, /autoplay|autoPlay/);
  assert.doesNotMatch(player, /speechSynthesis|SpeechSynthesisUtterance/);
});

test("narration is presented as an optional, collapsed-by-default disclosure rather than a persistent control bar", async () => {
  const player = await readProjectFile("src/components/topics/topic-narration.tsx");
  assert.match(player, /<details className="topic-narration">/);
  assert.match(player, /<summary className="narration-summary">/);
  assert.match(player, /Listen to this guide/);
  assert.match(player, /Optional/i);
  assert.doesNotMatch(player, /position:\s*sticky/);
});

test("narration controls preserve responsive and forced-color accessibility contracts", async () => {
  const css = await readProjectFile("src/learning.css");
  assert.match(css, /\.topic-narration\s*\{/);
  assert.doesNotMatch(css, /\.topic-narration\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.narration-control[^}]*min-block-size:\s*2\.75rem/s);
  assert.match(css, /\.narration-controls[^}]*grid-template-columns:/s);
  assert.match(css, /\.narration-transcript[^}]*overflow-y:\s*auto/s);
  assert.match(css, /@media \(max-width:\s*40rem\)/);
  assert.match(css, /@media \(forced-colors:\s*active\)/);
});
