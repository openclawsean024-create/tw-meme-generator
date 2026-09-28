"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TextRegion from "./TextRegion";
import type { TextRegionProps } from "./TextRegion";
import {
  ASPECT_FOR_SIZE,
  MOTION_TOKENS,
  computeCanvasSize,
  type AspectRatio,
} from "@/lib/canvas-geometry";

export interface Region
  extends Pick<
    TextRegionProps,
    "id" | "text" | "x" | "y" | "w" | "h" | "fontSize" | "color" | "fontWeight"
  > {}

export interface MemeCanvasProps {
  imageUrl: string;
  regions: Region[];
  onRegionsChange: (next: Region[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  showBounds?: boolean;
  /** Export aspect ratio.  Default "1:1". */
  aspectRatio?: AspectRatio;
}

/**
 * Back-compat alias for the CSS `aspect-ratio` string expected by callers
 * already wired to "1 / 1" syntax.  Kept here so external imports keep
 * working after the refactor.
 */
export type CanvasAspectRatio = `${number} / ${number}`;

export default function MemeCanvas({
  imageUrl,
  regions,
  onRegionsChange,
  selectedId,
  onSelect,
  showBounds = true,
  aspectRatio = "1:1",
}: MemeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [displayScale, setDisplayScale] = useState(1);
  const reducedMotion = useReducedMotion() ?? false;

  // FR-003: source-canvas geometry is aspect-aware so drag-stop clamps and
  // export scaling agree with the visible rectangle.
  const cssAspect = ASPECT_FOR_SIZE[aspectRatio];
  const sourceSize = useMemo(
    () => computeCanvasSize(aspectRatio),
    [aspectRatio],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const updateScale = () => {
      const nextScale = canvas.clientWidth / sourceSize.width;
      if (nextScale > 0) setDisplayScale(nextScale);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [sourceSize.width]);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(true);
  }, [imageUrl]);

  const handleRegionUpdate = (id: string, patch: Partial<Region>) => {
    onRegionsChange(
      regions.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full select-none"
      style={{ maxWidth: sourceSize.width }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelect(null);
      }}
    >
      <motion.div
        ref={canvasRef}
        layout
        transition={{
          duration: reducedMotion ? 0 : MOTION_TOKENS.CANVAS_ASPECT_FADE_MS / 1000,
          ease: "easeOut",
        }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        style={{ width: "100%", aspectRatio: cssAspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="meme"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {imgLoaded &&
          showBounds &&
          regions.map((r) => (
            <TextRegion
              key={r.id}
              {...r}
              selected={selectedId === r.id}
              onSelect={() => onSelect(r.id)}
              onChange={(patch) => handleRegionUpdate(r.id, patch)}
              onDelete={() => {
                onRegionsChange(regions.filter((x) => x.id !== r.id));
                onSelect(null);
              }}
              containerSize={sourceSize}
              scale={displayScale}
            />
          ))}
      </motion.div>
    </div>
  );
}

/** Helper: produce a new blank region at the canvas center (1:1 default). */
export function makeBlankRegion(idx: number, existing: Region[]): Region {
  const id = `tb_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`;
  // small staggering so multiple new boxes are visible
  const offset = (existing.length % 5) * 20;
  return {
    id,
    text: "",
    x: 60 + offset,
    y: 60 + offset,
    w: 280,
    h: 64,
    fontSize: 28,
    color: "var(--bk-text)",
    fontWeight: "bold",
  };
}

// Source-canvas dimensions for the default 1:1 aspect ratio.  Kept as an
// export so older callers (ShareCard, planExport default arguments) keep
// compiling; aspect-aware callers should use `computeCanvasSize` directly.
export const CANVAS_DIM = computeCanvasSize("1:1");
