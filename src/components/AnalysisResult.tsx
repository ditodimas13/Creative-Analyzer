"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult as AnalysisResultType } from "@/lib/aiPrompt";
import { exportAnalysisToPdf } from "@/lib/pdfExport";
import {
  HookIcon,
  VisualIcon,
  AudioIcon,
  ActionPlanIcon,
  CaptionIcon,
  ExportPdfIcon,
} from "./Icons";

interface AnalysisResultProps {
  fileName: string;
  result: AnalysisResultType;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-200 transition-colors"
    >
      {copied ? "Tersalin" : label}
    </button>
  );
}

export function AnalysisResult({ fileName, result }: AnalysisResultProps) {
  const handlePdf = useCallback(() => {
    exportAnalysisToPdf(fileName, result, (blob, name) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [fileName, result]);

  return (
    <div className="rounded-2xl border-2 border-violet-200/80 bg-white p-6 shadow-xl shadow-violet-900/5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold text-violet-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white shadow-md">
            <VisualIcon className="h-5 w-5" />
          </span>
          Hasil Analisis
        </h3>
        <button
          type="button"
          onClick={handlePdf}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 hover:from-violet-700 hover:to-fuchsia-700 transition-all"
        >
          <ExportPdfIcon className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      <section className="mb-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-800">
          <HookIcon className="h-4 w-4 text-amber-600" />
          Temuan Strategis
        </h4>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-300/80 text-amber-900">
              <HookIcon className="h-4 w-4" />
            </span>
            <div>
              <span className="block text-xs font-semibold text-amber-700">Hook</span>
              <p className="text-sm text-amber-900/90">{result.strategicFindings.hook}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-300/80 text-sky-900">
              <VisualIcon className="h-4 w-4" />
            </span>
            <div>
              <span className="block text-xs font-semibold text-sky-700">Visual</span>
              <p className="text-sm text-sky-900/90">{result.strategicFindings.visual}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-300/80 text-emerald-900">
              <AudioIcon className="h-4 w-4" />
            </span>
            <div>
              <span className="block text-xs font-semibold text-emerald-700">Audio</span>
              <p className="text-sm text-emerald-900/90">{result.strategicFindings.audio}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200/60 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-violet-700">
          <ActionPlanIcon className="h-4 w-4 text-violet-600" />
          Action Plan
        </h4>
        <ul className="space-y-2">
          {result.actionPlan.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm text-violet-900/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200/60 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-800">
          <CaptionIcon className="h-4 w-4 text-cyan-600" />
          Suggested Captions
        </h4>
        <div className="space-y-3">
          {result.suggestedCaptions.map((caption, i) => (
            <div
              key={i}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-white/90 p-4 shadow-sm border border-cyan-100"
            >
              <p className="min-w-0 flex-1 text-sm text-teal-900/90">{caption}</p>
              <CopyButton text={caption} label="Salin" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



