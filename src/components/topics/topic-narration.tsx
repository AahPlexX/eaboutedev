import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RefreshCw, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildTopicNarration } from "@/lib/narration";
import type { TopicDocument } from "@/types/content";

type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "complete" | "error";

type WorkerResponse =
  | { type: "progress"; requestId: string; progress?: number }
  | { type: "ready"; requestId: string }
  | { type: "audio"; requestId: string; blob: Blob }
  | { type: "error"; requestId: string; message: string };

interface PendingRequest {
  index: number;
  playWhenReady: boolean;
  seekFraction: number;
}

interface PassageRequestOptions {
  playWhenReady: boolean;
  seekFraction: number;
}

interface LoadPassageOptions {
  play: boolean;
  seekFraction?: number;
}

const PLAY_LABEL = "Play narration";
const PAUSE_LABEL = "Pause";
const RESTART_LABEL = "Restart";

export function TopicNarration({ topic }: { topic: TopicDocument }) {
  const passages = useMemo(() => buildTopicNarration(topic), [topic]);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("Ready when you are.");
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFraction, setCurrentFraction] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const currentIndexRef = useRef(0);
  const desiredPlayingRef = useRef(false);
  const playbackTokenRef = useRef(0);
  const requestCounterRef = useRef(0);
  const audioUrlsRef = useRef(new Map<number, string>());
  const pendingByRequestRef = useRef(new Map<string, PendingRequest>());
  const requestByIndexRef = useRef(new Map<number, string>());
  const workerMessageHandlerRef = useRef<(event: MessageEvent<WorkerResponse>) => void>(() => undefined);
  const workerErrorHandlerRef = useRef<() => void>(() => undefined);

  const setPassageIndex = useCallback((index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
    setCurrentFraction(0);
  }, []);

  const failPlayback = useCallback((message: string) => {
    desiredPlayingRef.current = false;
    setStatus("error");
    setStatusMessage(message);
  }, []);

  const loadCachedPassage = useCallback((index: number, url: string, { play, seekFraction = 0 }: LoadPassageOptions) => {
    const audio = audioRef.current;
    if (!audio) return;

    const token = ++playbackTokenRef.current;
    audio.pause();
    audio.src = url;
    audio.dataset.passageIndex = String(index);
    audio.load();

    const finishLoad = () => {
      if (token !== playbackTokenRef.current) return;
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      if (duration > 0 && seekFraction > 0) audio.currentTime = Math.min(duration * seekFraction, Math.max(0, duration - 0.01));
      if (!play || !desiredPlayingRef.current) {
        setStatus("paused");
        setStatusMessage(`Paused at passage ${index + 1} of ${passages.length}.`);
        return;
      }
      void audio.play().catch(() => failPlayback("Your browser blocked audio playback. Choose Play narration to try again."));
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) finishLoad();
    else audio.addEventListener("loadedmetadata", finishLoad, { once: true });
  }, [failPlayback, passages.length]);

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(new URL("../../workers/narration.worker.ts", import.meta.url), { type: "module" });
    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => workerMessageHandlerRef.current(event));
    worker.addEventListener("error", () => workerErrorHandlerRef.current());
    workerRef.current = worker;
    return worker;
  }, []);

  const requestPassage = useCallback((index: number, options: PassageRequestOptions) => {
    if (index < 0 || index >= passages.length) return;
    const cached = audioUrlsRef.current.get(index);
    if (cached) {
      if (index === currentIndexRef.current) loadCachedPassage(index, cached, { play: options.playWhenReady, seekFraction: options.seekFraction });
      return;
    }

    const existingRequestId = requestByIndexRef.current.get(index);
    if (existingRequestId) {
      const existing = pendingByRequestRef.current.get(existingRequestId);
      if (existing && options.playWhenReady) {
        pendingByRequestRef.current.set(existingRequestId, { ...existing, playWhenReady: true, seekFraction: options.seekFraction });
      }
      return;
    }

    const requestId = `narration-${++requestCounterRef.current}`;
    pendingByRequestRef.current.set(requestId, { index, playWhenReady: options.playWhenReady, seekFraction: options.seekFraction });
    requestByIndexRef.current.set(index, requestId);
    if (options.playWhenReady) {
      setStatus("loading");
      setStatusMessage(audioUrlsRef.current.size === 0 ? "Preparing the neural voice…" : `Preparing passage ${index + 1}…`);
    }
    ensureWorker().postMessage({ type: "synthesize", requestId, text: passages[index]!.text });
  }, [ensureWorker, loadCachedPassage, passages]);

  const prefetch = useCallback((index: number) => {
    const nextIndex = index + 1;
    if (nextIndex >= passages.length || audioUrlsRef.current.has(nextIndex) || requestByIndexRef.current.has(nextIndex)) return;
    requestPassage(nextIndex, { playWhenReady: false, seekFraction: 0 });
  }, [passages.length, requestPassage]);

  const handleWorkerMessage = useCallback((event: MessageEvent<WorkerResponse>) => {
    const message = event.data;
    if (message.type === "progress") {
      if (message.progress !== undefined) setLoadProgress(message.progress);
      setStatusMessage(message.progress === undefined ? "Downloading the neural voice…" : `Downloading the neural voice… ${message.progress}%`);
      return;
    }
    if (message.type === "ready") {
      setLoadProgress(null);
      return;
    }

    const pending = pendingByRequestRef.current.get(message.requestId);
    if (!pending) return;
    pendingByRequestRef.current.delete(message.requestId);
    requestByIndexRef.current.delete(pending.index);

    if (message.type === "error") {
      if (pending.playWhenReady || pending.index === currentIndexRef.current) {
        failPlayback(`High-quality narration is unavailable right now. ${message.message}`);
      }
      return;
    }

    const previousUrl = audioUrlsRef.current.get(pending.index);
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    const url = URL.createObjectURL(message.blob);
    audioUrlsRef.current.set(pending.index, url);

    if (pending.index === currentIndexRef.current) {
      loadCachedPassage(pending.index, url, { play: pending.playWhenReady && desiredPlayingRef.current, seekFraction: pending.seekFraction });
      if (pending.playWhenReady && desiredPlayingRef.current) prefetch(pending.index);
    }
  }, [failPlayback, loadCachedPassage, prefetch]);

  workerMessageHandlerRef.current = handleWorkerMessage;
  workerErrorHandlerRef.current = () => failPlayback("High-quality narration could not start in this browser. You can retry without losing your place.");

  const playCurrentPassage = useCallback(() => {
    desiredPlayingRef.current = true;
    requestPassage(currentIndexRef.current, {
      playWhenReady: true,
      seekFraction: currentFraction,
    });
  }, [currentFraction, requestPassage]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (status === "playing") {
      desiredPlayingRef.current = false;
      audio?.pause();
      setStatus("paused");
      setStatusMessage(`Paused at passage ${currentIndexRef.current + 1} of ${passages.length}.`);
      return;
    }
    if (status === "loading" && desiredPlayingRef.current) {
      desiredPlayingRef.current = false;
      setStatus("paused");
      setStatusMessage(`Paused before passage ${currentIndexRef.current + 1}.`);
      return;
    }
    if (status === "complete") {
      setPassageIndex(0);
      desiredPlayingRef.current = true;
      requestPassage(0, { playWhenReady: true, seekFraction: 0 });
      return;
    }
    playCurrentPassage();
  }, [passages.length, playCurrentPassage, requestPassage, setPassageIndex, status]);

  const restart = useCallback(() => {
    desiredPlayingRef.current = true;
    setPassageIndex(0);
    requestPassage(0, { playWhenReady: true, seekFraction: 0 });
  }, [requestPassage, setPassageIndex]);

  const seekTo = useCallback((index: number, seekFraction: number) => {
    const shouldPlay = desiredPlayingRef.current || status === "playing" || status === "loading";
    desiredPlayingRef.current = shouldPlay;
    audioRef.current?.pause();
    setPassageIndex(index);
    setCurrentFraction(seekFraction);

    if (status === "idle" && !shouldPlay) {
      setStatusMessage(`Ready at passage ${index + 1} of ${passages.length}.`);
      return;
    }

    requestPassage(index, { playWhenReady: shouldPlay, seekFraction });
    if (!shouldPlay) setStatus("paused");
  }, [passages.length, requestPassage, setPassageIndex, status]);

  const handleRangeChange = useCallback((value: string) => {
    if (passages.length === 0) return;
    const numeric = Math.max(0, Math.min(passages.length, Number(value)));
    const index = Math.min(Math.floor(numeric), passages.length - 1);
    const fraction = Math.max(0, Math.min(0.999, numeric - index));
    seekTo(index, fraction);
  }, [passages.length, seekTo]);

  const handleEnded = useCallback(() => {
    if (!desiredPlayingRef.current) return;
    const nextIndex = currentIndexRef.current + 1;
    if (nextIndex >= passages.length) {
      desiredPlayingRef.current = false;
      setCurrentFraction(1);
      setStatus("complete");
      setStatusMessage("Narration complete.");
      return;
    }
    setPassageIndex(nextIndex);
    requestPassage(nextIndex, { playWhenReady: true, seekFraction: 0 });
  }, [passages.length, requestPassage, setPassageIndex]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    setCurrentFraction(Math.max(0, Math.min(1, audio.currentTime / audio.duration)));
  }, []);

  useEffect(() => () => {
    desiredPlayingRef.current = false;
    playbackTokenRef.current += 1;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    workerRef.current?.terminate();
    workerRef.current = null;
    for (const url of audioUrlsRef.current.values()) URL.revokeObjectURL(url);
    audioUrlsRef.current.clear();
  }, []);

  const activePassage = passages[currentIndex];
  const isActivelyRequested = status === "playing" || (status === "loading" && desiredPlayingRef.current);
  const primaryLabel = isActivelyRequested ? PAUSE_LABEL : status === "paused" ? "Resume" : status === "complete" ? "Replay" : PLAY_LABEL;
  const rangeValue = Math.min(passages.length, currentIndex + currentFraction);

  return (
    <section className="topic-narration" aria-labelledby="topic-narration-title">
      <header className="narration-header">
        <span className="narration-icon" aria-hidden="true"><Volume2 /></span>
        <div>
          <p className="eyebrow">Free neural read-aloud</p>
          <h2 id="topic-narration-title">Listen to this topic</h2>
          <p>Natural on-device narration, with a transcript you can follow or jump through.</p>
        </div>
      </header>

      <p className="narration-disclosure">
        First use downloads about 100 MB of neural voice data. After those files arrive, your topic text stays in your browser for narration—there is no paid speech API, account, or billing step.
      </p>

      <div className="narration-controls" aria-label="Narration controls">
        <div className="narration-actions">
          <Button className="narration-control" type="button" onClick={togglePlayback}>
            {isActivelyRequested ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {primaryLabel}
          </Button>
          <Button className="narration-control" type="button" variant="outline" onClick={restart}>
            <RotateCcw aria-hidden="true" /> {RESTART_LABEL}
          </Button>
          {status === "error" && (
            <Button className="narration-control" type="button" variant="secondary" onClick={playCurrentPassage}>
              <RefreshCw aria-hidden="true" /> Retry narration
            </Button>
          )}
        </div>
        <div className="narration-position">
          <label htmlFor={`narration-position-${topic.slug}`}>Topic position</label>
          <input
            id={`narration-position-${topic.slug}`}
            aria-label="Topic narration position"
            type="range"
            min="0"
            max={Math.max(1, passages.length)}
            step="0.01"
            value={rangeValue}
            onChange={(event) => handleRangeChange(event.currentTarget.value)}
          />
          <span>{passages.length === 0 ? "0 of 0" : `${currentIndex + 1} of ${passages.length}`}</span>
        </div>
      </div>

      <div className="narration-status" aria-live="polite" aria-atomic="true">
        <span>{statusMessage}</span>
        {loadProgress !== null && <progress max="100" value={loadProgress} aria-label="Neural voice download progress" />}
      </div>

      <audio
        ref={audioRef}
        className="sr-only"
        aria-hidden="true"
        preload="none"
        onPlay={() => {
          setStatus("playing");
          setStatusMessage(`Playing passage ${currentIndexRef.current + 1} of ${passages.length}.`);
          prefetch(currentIndexRef.current);
        }}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onError={() => failPlayback("The generated audio could not be played. Choose Retry narration to try this passage again.")}
      />

      <div className="narration-now">
        <span>Now reading</span>
        <strong>{activePassage?.label ?? "Topic"}</strong>
        <p>{activePassage?.text ?? "This topic has no narratable text."}</p>
      </div>

      <ol className="narration-transcript" aria-label="Narration transcript">
        {passages.map((passage, index) => {
          const isCurrent = index === currentIndex;
          return (
            <li key={passage.id} className={isCurrent ? "is-current" : undefined}>
              <button
                type="button"
                className="narration-transcript-entry"
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => seekTo(index, 0)}
              >
                <span className="narration-transcript-index" aria-hidden="true">{index + 1}</span>
                <span>
                  <strong>{passage.label}</strong>
                  <span>{passage.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
