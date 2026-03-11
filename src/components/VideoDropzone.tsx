"use client";

import { useCallback } from "react";
import {
  MAX_FILE_SIZE,
  MAX_VIDEOS,
  formatFileSize,
  isValidVideoFile,
} from "@/lib/videoUtils";
import { UploadVideoIcon } from "./Icons";

interface VideoDropzoneProps {
  onFiles: (files: File[]) => void;
  currentCount: number;
  disabled?: boolean;
}

export function VideoDropzone({
  onFiles,
  currentCount,
  disabled,
}: VideoDropzoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      const items = Array.from(e.dataTransfer.files).filter(
        (f) => (f.type === "video/mp4" || f.type === "video/quicktime") && f.size <= MAX_FILE_SIZE
      );
      const remaining = MAX_VIDEOS - currentCount;
      const toAdd = items.slice(0, Math.max(0, remaining));
      if (toAdd.length) onFiles(toAdd);
    },
    [currentCount, disabled, onFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const valid = files.filter(isValidVideoFile);
      const remaining = MAX_VIDEOS - currentCount;
      const toAdd = valid.slice(0, Math.max(0, remaining));
      if (toAdd.length) onFiles(toAdd);
      e.target.value = "";
    },
    [currentCount, onFiles]
  );

  const canAdd = currentCount < MAX_VIDEOS;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`
        relative rounded-2xl border-2 border-dashed transition-all duration-200
        ${canAdd && !disabled
          ? "border-slate-300 bg-slate-50/90 hover:border-slate-400 hover:shadow-sm"
          : "border-slate-200 bg-white/60"}
        ${disabled ? "pointer-events-none opacity-70" : ""}
      `}
    >
      <input
        type="file"
        accept=".mp4,.mov,video/mp4,video/quicktime"
        multiple
        onChange={handleInput}
        disabled={disabled || !canAdd}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-8 text-center">
        <div className="rounded-2xl bg-slate-200 p-5 text-slate-600 shadow-sm">
          <UploadVideoIcon className="h-14 w-14" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-700">
            Seret video ke sini atau klik untuk memilih
          </p>
          <p className="text-sm text-slate-600">
            Format .mp4 atau .mov · Maks. {formatFileSize(MAX_FILE_SIZE)} per video
          </p>
          <p className="text-xs font-bold text-slate-500">
            {currentCount} / {MAX_VIDEOS} video
          </p>
        </div>
      </div>
    </div>
  );
}



