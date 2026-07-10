"use client";

import { Rnd } from "react-rnd";
import { X, GripVertical } from "lucide-react";
import clsx from "clsx";

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
  } = props;

  return (
    <Rnd
      bounds="parent"
      size={{ width: w, height: h }}
      position={{ x, y }}
      onDragStart={onSelect}
      onDragStop={(_, d) => {
        if (d.x < 0 || d.y < 0 || d.x + w > containerSize.width || d.y + h > containerSize.height) {
          const cx = Math.max(0, Math.min(d.x, containerSize.width - w));
          const cy = Math.max(0, Math.min(d.y, containerSize.height - h));
          onChange({ x: cx, y: cy });
          return;
        }
        onChange({ x: d.x, y: d.y });
      }}
      onResizeStart={onSelect}
      onResizeStop={(_, __, ref, ___ , position) => {
        onChange({
          w: ref.offsetWidth,
          h: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      minWidth={60}
      minHeight={36}
      className={clsx(
        "group rounded-md ring-1 transition-shadow",
        selected ? "ring-2 ring-accent-pink shadow-glow" : "ring-white/40 hover:ring-accent-purple",
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-md">
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
          value={text}
          onFocus={onSelect}
          onChange={(e) => onChange({ text: e.target.value })}
          maxLength={60}
          spellCheck={false}
          style={{
            color,
            fontWeight,
            fontSize: `${fontSize}px`,
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
      </div>
    </Rnd>
  );
}
