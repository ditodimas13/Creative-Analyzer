"use client";

import { useCallback, useRef, useState } from "react";
import { VideoDropzone } from "@/components/VideoDropzone";
import {
  QueueList,
  type QueueItem,
  type QueueItemStatus,
} from "@/components/QueueList";
import { AnalysisResult } from "@/components/AnalysisResult";
import { HeroIllustration, QueueListIcon } from "@/components/Icons";
import {
  getVideoMetadata,
  extractFrames,
  MAX_VIDEOS,
} from "@/lib/videoUtils";
import type { AnalysisResult as AnalysisResultType } from "@/lib/aiPrompt";

function generateId() {
  return Math.random().toString(36).slice(2, 12);
}

export default function Home() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelRef = useRef<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const addFiles = useCallback((files: File[]) => {
    const remaining = MAX_VIDEOS - queue.length;
    const toAdd = files.slice(0, Math.max(0, remaining));
    const newItems: QueueItem[] = toAdd.map((file) => ({
      id: generateId(),
      file,
      objectUrl: URL.createObjectURL(file),
      status: "pending",
    }));
    setQueue((q) => [...q, ...newItems]);
    if (selectedId == null && newItems[0]) setSelectedId(newItems[0].id);
  }, [queue.length, selectedId]);

  const removeItem = useCallback((id: string) => {
    setQueue((q) => {
      const out = q.filter((i) => i.id !== id);
      q.forEach((i) => {
        if (i.id === id) URL.revokeObjectURL(i.objectUrl);
      });
      if (selectedId === id) setSelectedId(out[0]?.id ?? null);
      return out;
    });
  }, [selectedId]);

  const runAnalysis = useCallback(
    async (item: QueueItem) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.preload = "metadata";

      const setCancelled = () => {
        setQueue((q) =>
          q.map((i) =>
            i.id === item.id ? { ...i, status: "cancelled" as QueueItemStatus } : i
          )
        );
      };

      return new Promise<void>((resolve, reject) => {
        video.onerror = () => reject(new Error("Gagal memuat video"));
        video.onloadedmetadata = async () => {
          if (cancelRef.current.has(item.id)) {
            setCancelled();
            resolve();
            return;
          }
          setCurrentProgress(20);
          const meta = getVideoMetadata(video);
          video.currentTime = 0;
          await new Promise((r) => {
            video.onseeked = r;
          });
          if (cancelRef.current.has(item.id)) {
            setCancelled();
            resolve();
            return;
          }
          setCurrentProgress(50);
          const frames = await extractFrames(video, 1);
          if (cancelRef.current.has(item.id)) {
            setCancelled();
            resolve();
            return;
          }
          setCurrentProgress(70);
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              duration: meta.duration,
              width: meta.width,
              height: meta.height,
              frames,
            }),
          });
          if (cancelRef.current.has(item.id)) {
            setCancelled();
            resolve();
            return;
          }
          setCurrentProgress(95);
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            reject(new Error((err as { error?: string }).error || res.statusText));
            return;
          }
          const result = (await res.json()) as AnalysisResultType;
          setQueue((q) =>
            q.map((i) =>
              i.id === item.id
                ? { ...i, status: "done" as QueueItemStatus, result }
                : i
            )
          );
          setCurrentProgress(100);
          resolve();
        };
        video.src = item.objectUrl;
      });
    },
    []
  );

  const startAnalysis = useCallback(async () => {
    const pending = queue.filter((i) => i.status === "pending");
    if (pending.length === 0 || isProcessing) return;
    setIsProcessing(true);
    cancelRef.current.clear();

    for (const item of pending) {
      setQueue((q) =>
        q.map((i) =>
          i.id === item.id ? { ...i, status: "analyzing" as QueueItemStatus } : i
        )
      );
      setSelectedId(item.id);
      setCurrentProgress(0);
      try {
        await runAnalysis(item);
      } catch (e) {
        setQueue((q) =>
          q.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "failed" as QueueItemStatus,
                  error: e instanceof Error ? e.message : String(e),
                }
              : i
          )
        );
      }
    }

    setCurrentProgress(0);
    setIsProcessing(false);
  }, [queue, isProcessing, runAnalysis]);

  const cancelAnalysis = useCallback((id: string) => {
    cancelRef.current.add(id);
  }, []);

  const retryItem = useCallback((id: string) => {
    setQueue((q) =>
      q.map((i) =>
        i.id === id ? { ...i, status: "pending" as QueueItemStatus, error: undefined } : i
      )
    );
  }, []);

  const reanalyzeItem = useCallback(
    (id: string) => {
      setQueue((q) =>
        q.map((i) =>
          i.id === id ? { ...i, status: "pending" as QueueItemStatus, result: undefined } : i
        )
      );
      if (!isProcessing) {
        const pending = queue.filter((i) => i.status === "pending");
        if (pending.length > 0) startAnalysis();
      }
    },
    [isProcessing, queue, startAnalysis]
  );

  const selected = queue.find((i) => i.id === selectedId);
  const pendingCount = queue.filter((i) => i.status === "pending").length;
  const doneCount = queue.filter((i) => i.status === "done").length;
  const totalCount = queue.length;
  const hasPending = pendingCount > 0;

  return (
    <div className="min-h-screen bg-gradient-soft bg-pattern">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <header className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient-hero">
              Video Creative Analyzer
            </h1>
            <p className="mt-2 text-slate-600 font-medium">
              Unggah video iklan, dapatkan analisis Hook, Visual, Audio, dan rekomendasi caption.
            </p>
          </div>
          <div className="w-full max-w-[280px] shrink-0 sm:max-w-[320px] drop-shadow-lg">
            <HeroIllustration className="w-full" />
          </div>
        </header>

        <section className="mb-8">
          <VideoDropzone
            onFiles={addFiles}
            currentCount={queue.length}
            disabled={isProcessing}
          />
        </section>

        {queue.length > 0 && (
          <section className="mb-8 rounded-2xl border-2 border-slate-200 bg-white/80 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <QueueListIcon className="h-4 w-4" />
              </span>
              Antrean Video
            </h2>
            <QueueList
              items={queue}
              currentId={selectedId}
              onRemove={removeItem}
              onCancel={cancelAnalysis}
              onRetry={retryItem}
              onReanalyze={reanalyzeItem}
              onSelect={setSelectedId}
            />
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={startAnalysis}
                disabled={!hasPending || isProcessing}
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-50 transition-all"
              >
                {isProcessing ? "Memproses..." : "Mulai Analisis"}
              </button>
              {isProcessing && (
                <div className="min-w-[220px] flex-1 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>Video saat ini</span>
                    <span>{currentProgress}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-progress transition-all duration-300"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>Total antrean</span>
                    <span>{doneCount}/{totalCount} selesai</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-400 transition-all duration-300"
                      style={{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {selected && (
          <section className="space-y-6">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              Pemutar & Hasil
            </h2>
            <div className="mx-auto max-h-[380px] w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-900 shadow-sm">
              <video
                ref={(el) => {
                  videoRef.current = el;
                }}
                key={selected.id}
                src={selected.objectUrl}
                controls
                playsInline
                className="h-full max-h-[380px] w-full object-contain"
                autoPlay={false}
              />
            </div>

            {selected.result && (
              <AnalysisResult
                fileName={selected.file.name}
                result={selected.result}
              />
            )}
            {selected.status === "analyzing" && (
              <p className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                Menganalisis video ini...
              </p>
            )}
            {selected.status === "failed" && selected.error && (
              <p className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                {selected.error}
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
