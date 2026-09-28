"use client";

import { Rnd } from "react-rnd";
import { motion, useReducedMotion } from "framer-motion";
import { X, GripVertical } from "lucide-react";
import clsx from "clsx";
import { MOTION_TOKENS, clampRegionToCanvas } from "@/lib/canvas-geometry";

export interface TextRegionProps {
  id: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold";
  selected?: boolean;
  onChange: (patch: Partial<Omit<TextRegionProps, "onChange" | "selected">>) => void;
  onSelect?: () => void;
  onDelete?: () => void;
  containerSize: { width: number; height: number };
  /** Ratio between rendered CSS pixels and logical 600px source coordinates. */
  scale?: number;
}

export default function TextRegion(props: TextRegionProps) {
  const {
    text,
    x,
    y,
    w,
    h,
    fontSize = 28,
    color = "#ffffff",
    fontWeight = "bold",
    selected = false,
    onChange,
    onSelect,
    onDelete,
    containerSize,
    scale = 1,
  } = props;
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <Rnd
      bounds="parent"
      size={{ width: w * scale, height: h * scale }}
      position={{ x: x * scale, y: y * scale }}
      onDragStart={onSelect}
      onDragStop={(_, d) => {
        // FR-003: clamp to the canvas that MemeCanvas reported, NOT a
        // hardcoded 600×600 — 9:16 and 4:5 must let text reach the bottom.
        const next = clampRegionToCanvas(
          { x: d.x / scale, y: d.y / scale, w, h },
          containerSize,
        );
        onChange({ x: next.x, y: next.y });
      }}
      onResizeStart={onSelect}
      onResizeStop={(_, __, ref, ___ , position) => {
        const next = clampRegionToCanvas(
          {
            x: position.x / scale,
            y: position.y / scale,
            w: ref.offsetWidth / scale,
            h: ref.offsetHeight / scale,
          },
          containerSize,
        );
        onChange({ w: next.w, h: next.h, x: next.x, y: next.y });
      }}
      minWidth={60 * scale}
      minHeight={36 * scale}
      enableResizing={{}}
      className={clsx(
        "group rounded-md ring-1",
        selected ? "ring-2 ring-accent-pink" : "ring-white/40 hover:ring-accent-purple",
      )}
    >
      {/*
        FR-012: selection affordance — soft scale + ring tint transition.
        Wrapping <Rnd>'s output in a motion.div keeps the transform on the
        compositor (no layout shift) and respects MotionConfig
        reducedMotion="user" automatically — when prefers-reduced-motion is
        active the duration collapses to 0.
      */}
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-md shadow-glow"
        animate={{
          scale: selected ? 1.02 : 1,
        }}
        whileHover={{ scale: selected ? 1.02 : 1.01 }}
        transition={{
          duration: reducedMotion ? 0 : MOTION_TOKENS.REGION_AFFORDANCE_MS / 1000,
          ease: "easeOut",
        }}
      >
        {selected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-black p-1 text-white shadow-md ring-1 ring-white/30 hover:bg-accent-pink"
            aria-label="刪除文字框"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {selected && (
          <span className="absolute left-1 top-1 z-10 inline-flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[10px] text-white/70">
            <GripVertical className="h-2.5 w-2.5" />
            拖曳
          </span>
        )}
        <textarea
          aria-label="文字框內容"
          value={text}
          onFocus={onSelect}
          onChange={(e) => onChange({ text: e.target.value })}
          maxLength={60}
          spellCheck={false}
          style={{
            color,
            fontWeight,
            fontSize: `${fontSize * scale}px`,
            WebkitTextStroke: fontWeight === "bold" ? "1px rgba(0,0,0,0.9)" : "0.5px rgba(0,0,0,0.7)",
            textShadow:
              fontWeight === "bold"
                ? "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                : "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
            lineHeight: 1.05,
          }}
          className={clsx(
            "h-full w-full resize-none border-0 bg-transparent p-1 text-center outline-none",
            "placeholder:text-white/40 selection:bg-accent-pink/40",
          )}
          placeholder="輸入文字"
        />
      </motion.div>
    </Rnd>
  );
}
