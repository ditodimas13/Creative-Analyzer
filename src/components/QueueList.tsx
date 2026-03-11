"use client";

import { formatFileSize } from "@/lib/videoUtils";
import { VideoFileIcon } from "./Icons";

export type QueueItemStatus =
  | "pending"
  | "analyzing"
  | "done"
  | "failed"
  | "cancelled";

export interface QueueItem {
  id: string;
  file: File;
  objectUrl: string;
  status: QueueItemStatus;
  result?: import("@/lib/aiPrompt").AnalysisResult;
  error?: string;
}

interface QueueListProps {
  items: QueueItem[];
  currentId: string | null;
  onRemove: (id: string) => void;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onReanalyze: (id: string) => void;
  onSelect: (id: string) => void;
}

const statusLabels: Record<QueueItemStatus, string> = {
  pending: "Menunggu",
  analyzing: "Menganalisis...",
  done: "Selesai",
  failed: "Gagal",
  cancelled: "Dibatalkan",
};

export function QueueList({
  items,
  currentId,
  onRemove,
  onCancel,
  onRetry,
  onReanalyze,
  onSelect,
}: QueueListProps) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isCurrent = item.id === currentId;
        const isAnalyzing = item.status === "analyzing";
        const isFailed = item.status === "failed";
        const isDone = item.status === "done";

        return (
          <li
            key={item.id}
            className={`
              flex flex-wrap items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition-shadow
              ${isCurrent ? "border-slate-400 bg-slate-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}
            `}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <VideoFileIcon className="h-5 w-5" />
            </div>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="min-w-0 flex-1 truncate text-left font-medium text-slate-800 hover:underline"
            >
              {item.file.name}
            </button>
            <span className="text-slate-500 text-xs shrink-0">
              {formatFileSize(item.file.size)}
            </span>
            <span
              className={`
                shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold
                ${isAnalyzing ? "bg-slate-200 text-slate-700" : ""}
                ${isDone ? "bg-slate-300 text-slate-800" : ""}
                ${isFailed ? "bg-slate-200 text-slate-700" : ""}
                ${item.status === "pending" ? "bg-slate-100 text-slate-600" : ""}
                ${item.status === "cancelled" ? "bg-slate-200 text-slate-600" : ""}
              `}
            >
              {statusLabels[item.status]}
            </span>
            <span className="flex shrink-0 gap-1.5">
              {isAnalyzing && (
                <button
                  type="button"
                  onClick={() => onCancel(item.id)}
                  className="rounded-lg bg-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-300"
                >
                  Batalkan
                </button>
              )}
              {isFailed && (
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  Coba lagi
                </button>
              )}
              {isDone && (
                <button
                  type="button"
                  onClick={() => onReanalyze(item.id)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  Analisis ulang
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
              >
                Hapus
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}



