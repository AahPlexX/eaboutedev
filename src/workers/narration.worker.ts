const KOKORO_RUNTIME_URL = "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js";
const KOKORO_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const KOKORO_VOICE = "af_heart";

interface RawAudioLike {
  toBlob(): Blob;
}

interface KokoroInstance {
  generate(text: string, options: { voice: string }): Promise<RawAudioLike>;
}

interface KokoroRuntime {
  KokoroTTS: {
    from_pretrained(
      modelId: string,
      options: {
        dtype: "q8";
        device: "wasm";
        progress_callback: (progress: unknown) => void;
      },
    ): Promise<KokoroInstance>;
  };
}

interface SynthesizeRequest {
  type: "synthesize";
  requestId: string;
  text: string;
}

type WorkerRequest = SynthesizeRequest;

let ttsPromise: Promise<KokoroInstance> | undefined;

function readNumericProperty(value: unknown, key: string) {
  if (!value || typeof value !== "object") return undefined;
  const property = Reflect.get(value, key);
  return typeof property === "number" && Number.isFinite(property) ? property : undefined;
}

function normalizeProgress(value: unknown) {
  const direct = readNumericProperty(value, "progress");
  if (direct !== undefined) return Math.max(0, Math.min(100, Math.round(direct)));

  const loaded = readNumericProperty(value, "loaded");
  const total = readNumericProperty(value, "total");
  if (loaded !== undefined && total !== undefined && total > 0) {
    return Math.max(0, Math.min(100, Math.round((loaded / total) * 100)));
  }
  return undefined;
}

async function loadTts(requestId: string) {
  if (!ttsPromise) {
    ttsPromise = (async () => {
      const runtime = await import(/* @vite-ignore */ KOKORO_RUNTIME_URL) as unknown as KokoroRuntime;
      return runtime.KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
        dtype: "q8",
        device: "wasm",
        progress_callback: (progress) => {
          self.postMessage({ type: "progress", requestId, progress: normalizeProgress(progress) }, { transfer: [] });
        },
      });
    })().catch((error: unknown) => {
      ttsPromise = undefined;
      throw error;
    });
  }
  return ttsPromise;
}

function messageFromError(error: unknown) {
  return error instanceof Error && error.message ? error.message : "The neural voice could not be prepared.";
}

async function synthesize(request: SynthesizeRequest) {
  try {
    const tts = await loadTts(request.requestId);
    self.postMessage({ type: "ready", requestId: request.requestId }, { transfer: [] });
    const audio = await tts.generate(request.text, { voice: KOKORO_VOICE });
    const blob = audio.toBlob();
    self.postMessage({ type: "audio", requestId: request.requestId, blob }, { transfer: [] });
  } catch (error) {
    self.postMessage({ type: "error", requestId: request.requestId, message: messageFromError(error) }, { transfer: [] });
  }
}

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type === "synthesize") void synthesize(event.data);
});
