"use client";

import { useState } from "react";
import { Copy, Download, Share2, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import type { ShareRecord, TextRegionRecord } from "@/lib/storage";
import { addShare, bumpShareCount, genId } from "@/lib/storage";

export interface ShareCardProps {
  memeId: string;
  memeName: string;
  imageUrl: string;
  previewText: string;
  regions: TextRegionRecord[];
  creator?: string;
  onShared?: (share: ShareRecord) => void;
  /** Optional node ref or selector for the canvas to snapshot. */
  captureRef: React.RefObject<HTMLElement>;
}

export default function ShareCard({
  memeId,
  memeName,
  imageUrl,
  previewText,
  regions,
  creator,
  captureRef,
  onShared,
}: ShareCardProps) {
  const [busy, setBusy] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

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

  async function doDownload() {
    const el = captureRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(el, {
        width: 1080,
        height: 1080,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `meme-${memeId}-${Date.now()}.png`;
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
        } catch {
          /* user dismissed — fall back to clipboard */
          await navigator.clipboard.writeText(shareUrl);
          setCopyState("copied");
        }
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopyState("copied");
      }
      bumpShareCount(record.id);
      onShared?.(record);
      setTimeout(() => setCopyState("idle"), 1800);
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
      setCopyState("copied");
      onShared?.(record);
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4 text-accent-purple" />
        <p className="text-sm font-medium">分享這張梗圖</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={doShare} disabled={busy} className="btn-primary text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          一鍵分享
        </button>
        <button type="button" onClick={doCopyLink} disabled={busy} className="btn-ghost text-sm">
          <Copy className="h-4 w-4" />
          {copyState === "copied" ? "已複製連結" : copyState === "error" ? "複製失敗" : "複製連結"}
        </button>
        <button type="button" onClick={doDownload} disabled={busy} className="btn-ghost text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          下載 PNG (1080×1080)
        </button>
      </div>
      <p className="text-xs text-muted">
        分享會寫入 localStorage 並計入熱門排行;清除瀏覽器資料會重置。
      </p>
    </div>
  );
}
