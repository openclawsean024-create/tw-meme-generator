"use client";

import { useState } from "react";
import { Copy, Download, Share2, Loader2, Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toPng } from "html-to-image";
import type { ShareRecord, TextRegionRecord } from "@/lib/storage";
import { addShare, bumpShareCount, genId } from "@/lib/storage";
import { EXPORT_SIZES, type ExportSize } from "@/lib/export-sizes";
import { MOTION_TOKENS, motionDurationMs } from "@/lib/canvas-geometry";

/**
 * Build the html-to-image options for a given export size.
 * Exported for unit testing (FR-003-B) without a DOM.
 */
export function buildExportPngOptions(size: ExportSize) {
  const spec = EXPORT_SIZES[size];
  return {
    width: spec.width,
    height: spec.height,
    pixelRatio: 2,
    cacheBust: true,
  };
}

export type CopyState = "idle" | "copied" | "error" | "shared";

export interface ShareCardProps {
  memeId: string;
  memeName: string;
  imageUrl: string;
  previewText: string;
  regions: TextRegionRecord[];
  creator?: string;
  onShared?: (share: ShareRecord) => void;
  /** Optional node ref or selector for the canvas to snapshot. */
  captureRef: React.RefObject<HTMLElement | null>;
  /** Export size; controls output PNG dimensions (FR-003-B). */
  size?: ExportSize;
  /**
   * Override for the reduced-motion preference (defaults to the user's OS
   * setting via `matchMedia`).  Tests pass `true` to assert the 0ms path.
   */
  prefersReducedMotion?: boolean;
}

/**
 * Visible copy-state copy for the toast.  Kept in one place so the test
 * suite can match the exact wording without duplicating strings.
 */
export const TOAST_TEXT: Readonly<Record<CopyState, string | null>> = {
  idle: null,
  copied: "已複製連結",
  error: "複製失敗",
  shared: "已分享",
};

export default function ShareCard({
  memeId,
  memeName,
  imageUrl,
  previewText,
  regions,
  creator,
  captureRef,
  onShared,
  size = "1:1",
  prefersReducedMotion,
}: ShareCardProps) {
  const [busy, setBusy] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const systemPrefersReducedMotion = useReducedMotion() ?? false;

  // Feature-detect reduced motion at render time.  Tests that pass
  // `prefersReducedMotion` override this and assert the 0ms path directly.
  const reducedMotion =
    typeof prefersReducedMotion === "boolean"
      ? prefersReducedMotion
      : systemPrefersReducedMotion;

  function buildShareRecord(url?: string): ShareRecord {
    return {
      id: genId(),
      memeId,
      memeName,
      imageUrl,
      shareCount: 0,
      likeCount: 0,
      creator: creator || "匿名小編",
      previewText: previewText || regions.map((r) => r.text).filter(Boolean).join(" / ") || memeName,
      regions,
      shareUrl: url,
      createdAt: Date.now(),
    };
  }

  function flashCopyState(next: CopyState) {
    setCopyState(next);
    window.setTimeout(() => setCopyState("idle"), MOTION_TOKENS.TOAST_DWELL_MS);
  }

  async function doDownload() {
    const el = captureRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(el, buildExportPngOptions(size));
      const link = document.createElement("a");
      link.download = `meme-${memeId}-${size.replace(":", "x")}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setBusy(false);
    }
  }

  async function doShare() {
    setBusy(true);
    try {
      const record = buildShareRecord();
      addShare(record);
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/meme/${memeId}?share=${record.id}`
          : "";
      const shareUrl = url || record.shareUrl || "";
      const text = `${previewText || memeName}\n用 #台灣梗圖製造器 製作: ${shareUrl}`;
      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        typeof (navigator as Navigator & { canShare?: () => boolean }).canShare === "function" &&
        (navigator as Navigator & { canShare?: () => boolean }).canShare?.()
      ) {
        try {
          await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
            title: memeName,
            text,
            url: shareUrl,
          });
          flashCopyState("shared");
        } catch {
          /* user dismissed — fall back to clipboard */
          await navigator.clipboard.writeText(shareUrl);
          flashCopyState("copied");
        }
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        flashCopyState("copied");
      }
      bumpShareCount(record.id);
      onShared?.(record);
    } finally {
      setBusy(false);
    }
  }

  async function doCopyLink() {
    setBusy(true);
    try {
      const record = buildShareRecord();
      addShare(record);
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/meme/${memeId}?share=${record.id}`
          : "";
      await navigator.clipboard.writeText(url);
      bumpShareCount(record.id);
      flashCopyState("copied");
      onShared?.(record);
    } catch {
      flashCopyState("error");
    } finally {
      setBusy(false);
    }
  }

  const spec = EXPORT_SIZES[size];
  const toastText = TOAST_TEXT[copyState];

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4 text-accent-purple" />
        <p className="text-sm font-medium">分享這張梗圖</p>
        <span className="ml-auto text-[10px] text-muted">{size} · {spec.width}×{spec.height}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={doShare} disabled={busy} className="btn-primary text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          一鍵分享
        </button>
        <button type="button" onClick={doCopyLink} disabled={busy} className="btn-ghost text-sm">
          <Copy className="h-4 w-4" />
          複製連結
        </button>
        <button type="button" onClick={doDownload} disabled={busy} className="btn-ghost text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          下載 PNG ({spec.width}×{spec.height})
        </button>
      </div>

      {/*
        FR-012: share-success / copy toast.  AnimatePresence drives the
        enter/exit motion; `role="status"` + `aria-live="polite"` makes the
        toast announceable for screen readers and exposes the same content
        whether or not motion plays (the text node is always present while
        the toast is mounted).
      */}
      <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center" aria-live="polite">
        <AnimatePresence>
          {toastText && (
            <motion.div
              key={copyState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                duration: motionDurationMs(
                  MOTION_TOKENS.SHARE_TOAST_MS,
                  reducedMotion,
                ) / 1000,
              }}
              role="status"
              className="inline-flex items-center justify-center gap-1 rounded-md bg-background/95 px-3 py-2 text-xs text-accent-purple shadow-lg ring-1 ring-white/15"
            >
              <Check className="h-3 w-3" aria-hidden />
              <span>{toastText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-muted">
        分享會寫入 localStorage 並計入熱門排行;清除瀏覽器資料會重置。
      </p>
    </div>
  );
}
