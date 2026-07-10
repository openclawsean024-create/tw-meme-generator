"use client";

import { useEffect, useRef, useState } from "react";
import TextRegion from "./TextRegion";
import type { TextRegionProps } from "./TextRegion";

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
}

const CANVAS_W = 600;
const CANVAS_H = 600;

export default function MemeCanvas({
  imageUrl,
  regions,
  onRegionsChange,
  selectedId,
  onSelect,
  showBounds = true,
}: MemeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

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
      style={{ maxWidth: CANVAS_W }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelect(null);
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        style={{ width: "100%", aspectRatio: "1 / 1" }}
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
              containerSize={{ width: CANVAS_W, height: CANVAS_H }}
            />
          ))}
      </div>
    </div>
  );
}

/** Helper: produce a new blank region at the canvas center */
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
    color: "#ffffff",
    fontWeight: "bold",
  };
}

/** Re-export the canvas dims for use by editor toolbar/download */
export const CANVAS_DIM = { width: CANVAS_W, height: CANVAS_H };
