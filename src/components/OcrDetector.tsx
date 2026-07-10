"use client";

import { useState } from "react";
import { Loader2, ScanText } from "lucide-react";
import { recognizeFromUrl, type OcrRegion } from "@/lib/ocr";
import type { Meme } from "@/types";

export interface OcrDetectorProps {
  meme: Meme;
  onDetected: (regions: OcrRegion[]) => void;
}

export default function OcrDetector({ meme, onDetected }: OcrDetectorProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setLoading(true);
    setProgress(0);
    try {
      const tick = window.setInterval(() => {
        setProgress((p) => Math.min(p + 4, 90));
      }, 400);
      const result = await recognizeFromUrl(meme.imageUrl, 600, 600);
      window.clearInterval(tick);
      setProgress(100);
      onDetected(result.regions);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-white">
          <ScanText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">自動偵測文字位置</p>
          <p className="text-xs text-muted">
            首次執行會下載 ~10MB 中文/英文 OCR 模型
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="btn-primary text-sm disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            偵測中…
          </>
        ) : (
          "執行 OCR"
        )}
      </button>
      {loading && (
        <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-brand transition-all" style={{ width: `${progress}%` }} />
      )}
      {error && <p className="ml-3 text-xs text-red-400">{error}</p>}
    </div>
  );
}
