"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eraser, PlusCircle, Trash2, AlertTriangle } from "lucide-react";
import MemeCanvas, { makeBlankRegion, type Region } from "@/components/MemeCanvas";
import OcrDetector from "@/components/OcrDetector";
import ShareCard from "@/components/ShareCard";
import BrandKitPicker from "@/components/BrandKitPicker";
import FavoriteButton from "@/components/FavoriteButton";
import { type Meme } from "@/types";
import type { TextRegionRecord } from "@/lib/storage";
import { getShare } from "@/lib/storage";
import type { OcrRegion } from "@/lib/ocr";
import { findOverflowingRegions } from "@/lib/export-sizes";
import {
  brandKitToCssVars,
  DEFAULT_BRAND_KIT,
  type BrandKit,
} from "@/lib/brand-kit";
import {
  ASPECT_FOR_SIZE,
  computeCanvasSize,
  type AspectRatio,
} from "@/lib/canvas-geometry";

interface EditorClientProps {
  meme: Meme;
  mode: "replace" | "add";
  restoreShareId?: string;
}

const FONT_PRESETS = [24, 28, 32, 40, 48];
const SIZE_OPTIONS: ReadonlyArray<AspectRatio> = ["1:1", "9:16", "4:5"];
type SizeOption = AspectRatio;

export default function EditorClient({ meme, mode, restoreShareId }: EditorClientProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creator, setCreator] = useState("匿名小編");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [size, setSize] = useState<SizeOption>("1:1");
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const [restoredBanner, setRestoredBanner] = useState<string | null>(null);

  // initialize regions based on mode (+ optional restore from share record)
  useEffect(() => {
    if (restoreShareId) {
      const share = getShare(restoreShareId);
      if (share && Array.isArray(share.regions) && share.regions.length > 0) {
        const seeded: Region[] = share.regions.map((r) => ({
          id: r.id,
          text: r.text,
          x: r.x,
          y: r.y,
          w: r.w,
          h: r.h,
          fontSize: r.fontSize ?? 32,
          color: r.color ?? "var(--bk-text)",
          fontWeight: r.fontWeight ?? "bold",
        }));
        setRegions(seeded);
        setRestoredBanner("已從收藏還原");
        return;
      }
      // Share not found / cleared — fall through to the mode-based seed.
      setRestoredBanner("找不到對應的收藏,改用預設模式");
    }

    if (mode === "replace") {
      const seeded: Region[] = meme.textRegions.map((r) => ({
        id: r.id,
        text: r.defaultText,
        x: r.x,
        y: r.y,
        w: r.w,
        h: r.h,
        fontSize: 32,
        color: "var(--bk-text)",
        fontWeight: "bold",
      }));
      setRegions(seeded);
    } else {
      setRegions([makeBlankRegion(0, [])]);
    }
    // do not re-seed when meme.mode updates — only on first mount per meme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meme.id]);

  const selected = useMemo(
    () => regions.find((r) => r.id === selectedId) ?? null,
    [regions, selectedId],
  );

  function patchRegion(id: string, patch: Partial<Region>) {
    setRegions((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addBlank() {
    const next = [...regions, makeBlankRegion(regions.length, regions)];
    setRegions(next);
    setSelectedId(next[next.length - 1].id);
  }

  function clearAll() {
    setRegions([]);
    setSelectedId(null);
  }

  function applyOcr(detected: OcrRegion[]) {
    if (!detected.length) {
      setOcrLoading(false);
      return;
    }
    setRegions((prev) => {
      // remove existing default text regions in 'replace' mode so OCR wins
      if (mode === "replace") {
        return detected.map((d) => ({
          id: d.id,
          text: d.text || "",
          x: d.x,
          y: d.y,
          w: d.w,
          h: d.h,
          fontSize: 28,
          color: "var(--bk-text)",
          fontWeight: "bold" as const,
        }));
      }
      return [...prev, ...detected.map((d) => ({
        id: d.id,
        text: d.text || "",
        x: d.x,
        y: d.y,
        w: d.w,
        h: d.h,
        fontSize: 28,
        color: "var(--bk-text)",
        fontWeight: "bold" as const,
      }))];
    });
    setOcrLoading(false);
  }

  function handleBrandKitChange(kit: BrandKit) {
    setBrandKit(kit);
  }

  const previewText =
    regions.map((r) => r.text).filter(Boolean).join(" / ") || meme.name;

  const regionRecords: TextRegionRecord[] = regions.map((r) => ({
    id: r.id,
    text: r.text,
    x: r.x,
    y: r.y,
    w: r.w,
    h: r.h,
    fontSize: r.fontSize,
    color: r.color,
    fontWeight: r.fontWeight,
  }));

  // FR-003: source canvas is aspect-aware.  Editor source dims must match
  // the MemeCanvas container, otherwise the "X 個文字框超出邊界" warning
  // fires for text the user can still legally place on screen.
  const sourceSize = useMemo(() => computeCanvasSize(size), [size]);

  // FR-003-C: detect regions that would overflow the export canvas at the
  // current size. Render a red-border warning badge before allowing export.
  const overflowing = useMemo(
    () =>
      findOverflowingRegions({
        sourceWidth: sourceSize.width,
        sourceHeight: sourceSize.height,
        size,
        regions: regions.map((r) => ({
          x: r.x,
          y: r.y,
          w: r.w,
          h: r.h,
          text: r.text,
        })),
      }),
    [regions, size, sourceSize],
  );

  const bkVars = useMemo(() => brandKitToCssVars(brandKit), [brandKit]);

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/gallery" className="btn-ghost text-sm">
          <ArrowLeft className="h-4 w-4" />
          回圖庫
        </Link>
        <div className="flex items-center gap-2">
          <FavoriteButton memeId={meme.id} variant="solid" />
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            {mode === "replace" ? "模式:替換文字" : "模式:新增對話框"}
          </span>
        </div>
      </div>

      {restoredBanner && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-lg border border-accent-purple/40 bg-accent-purple/10 px-3 py-2 text-xs text-accent-purple"
        >
          {restoredBanner}
        </div>
      )}

      <h1 className="mb-2 text-2xl font-semibold sm:text-3xl">{meme.name}</h1>
      <p className="mb-6 text-sm text-muted">
        點文字框直接編輯;點空白處新增;右上角按鈕一鍵分享。
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div
            ref={captureRef}
            className="rounded-2xl"
            style={bkVars as React.CSSProperties}
          >
            <MemeCanvas
              imageUrl={meme.imageUrl}
              regions={regions}
              onRegionsChange={setRegions}
              selectedId={selectedId}
              onSelect={setSelectedId}
              aspectRatio={size}
            />
          </div>
          {mode === "replace" && (
            <OcrDetector meme={meme} onDetected={applyOcr} />
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <p className="mb-3 text-sm font-medium">匯出尺寸</p>
            <div role="radiogroup" aria-label="匯出尺寸" className="grid grid-cols-3 gap-2">
              {SIZE_OPTIONS.map((s) => {
                const selected = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSize(s)}
                    className={`rounded-md border px-2 py-1.5 text-xs transition-colors ${
                      selected
                        ? "border-accent-pink bg-accent-pink/10 text-accent-pink"
                        : "border-white/10 text-muted hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {overflowing.length > 0 && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-md border border-red-500/50 bg-red-500/10 p-2 text-xs text-red-300"
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  有 {overflowing.length} 個文字框超出 {size} 邊界,先調整位置再匯出
                </span>
              </div>
            )}
          </div>

          <BrandKitPicker onChange={handleBrandKitChange} />

          <div className="card p-4">
            <p className="mb-3 text-sm font-medium">工具列</p>
            <div className="flex flex-wrap gap-2">
              {mode === "add" && (
                <button type="button" onClick={addBlank} className="btn-primary text-sm">
                  <PlusCircle className="h-4 w-4" />
                  新增對話框
                </button>
              )}
              <button type="button" onClick={clearAll} className="btn-ghost text-sm">
                <Eraser className="h-4 w-4" />
                全部清除
              </button>
            </div>
          </div>

          {selected ? (
            <div className="card space-y-3 p-4">
              <div>
                <p className="mb-2 text-sm font-medium">選取的文字框</p>
                <textarea
                  value={selected.text}
                  onChange={(e) => patchRegion(selected.id, { text: e.target.value })}
                  maxLength={60}
                  className="h-20 w-full resize-none rounded-md border border-white/10 bg-black/30 p-2 text-sm outline-none focus:border-accent-pink"
                  placeholder="輸入你想說的話…"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">字級</span>
                {FONT_PRESETS.map((fontSize) => (
                  <button
                    key={fontSize}
                    type="button"
                    onClick={() => patchRegion(selected.id, { fontSize })}
                    className={`rounded-md border px-2 py-1 text-xs ${selected.fontSize === fontSize ? "border-accent-pink bg-accent-pink/10 text-accent-pink" : "border-white/10 text-muted hover:text-ink"}`}
                  >
                    {fontSize}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">粗細</span>
                {(["normal", "bold"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => patchRegion(selected.id, { fontWeight: w })}
                    className={`rounded-md border px-2 py-1 text-xs ${selected.fontWeight === w ? "border-accent-pink bg-accent-pink/10 text-accent-pink" : "border-white/10 text-muted hover:text-ink"}`}
                  >
                    {w === "bold" ? "粗" : "細"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setRegions(regions.filter((r) => r.id !== selected.id));
                  setSelectedId(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                刪除這個文字框
              </button>
            </div>
          ) : (
            <div className="card p-4 text-xs text-muted">
              點任一文字框開始編輯;若要新增,按上面的「新增對話框」(新增模式限定)。
            </div>
          )}

          <div className="card p-4">
            <p className="mb-2 text-sm font-medium">創作者標籤</p>
            <input
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              maxLength={20}
              className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm outline-none focus:border-accent-pink"
            />
          </div>

          <ShareCard
            memeId={meme.id}
            memeName={meme.name}
            imageUrl={meme.imageUrl}
            previewText={previewText}
            regions={regionRecords}
            creator={creator}
            captureRef={captureRef}
            size={size}
          />

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-muted">
            <p>提示:在手機上,用單指拖曳移動、雙指拉動右下角縮放控制點。</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
