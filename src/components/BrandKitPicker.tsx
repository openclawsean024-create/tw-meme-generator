"use client";

import { useEffect, useMemo, useState } from "react";
import { Palette } from "lucide-react";
import clsx from "clsx";
import {
  DEFAULT_BRAND_KIT,
  createBrandKit,
  brandKitToCssVars,
  type BrandKit,
} from "@/lib/brand-kit";
import { readBrandKit, writeBrandKit } from "@/lib/brand-kit-storage";

export interface BrandKitPickerProps {
  /** Called whenever the user picks a kit, with the resolved BrandKit + CSS vars. */
  onChange?: (kit: BrandKit, cssVars: Record<string, string>) => void;
  className?: string;
}

/**
 * Three presets exposed by FR-005-A.  Each preset must keep textOnImage
 * readable on the imagery we ship (≥ 4.5:1 contrast per FR-005-C).
 *
 *   default      — purple/pink brand
 *   紫粉          — purple + hot pink (vibrant)
 *   簡潔黑白      — minimal mono (editorial)
 *
 * FR-005-C: textOnImage + strokeOnImage must form the canonical
 * "#FFFFFF" + "#000000" pair so that for every 8-bit grayscale background
 * (`#000000` … `#FFFFFF`), at least one of the two clears WCAG AA 4.5:1.
 * The luminance cross-over between the two curves sits at L ≈ 0.1791 where
 * both ratios equal ≈4.583 (>4.5), so the pair is safe across the full
 * grayscale range.  Substituting a tinted "near-black" or "near-white"
 * breaks coverage at intermediate backgrounds (verified by exhaustive
 * 256-step contrast sweep in tests/brand-kit.test.ts).
 *
 * ID-RECONCILIATION CONTRACT: every preset's UI id (`PRESETS[i].id`) MUST
 * equal the id of the BrandKit its `factory()` produces (`factory().id`).
 * The hydration `useEffect` below looks the stored kit up by
 * `PRESETS.find(p => p.id === stored.id)`, so a mismatch silently resets
 * the picker to `PRESETS[0]` after reload (the bug Codex found on the
 * "簡潔黑白" path: UI id `mono` vs stored id `preset_mono`).  Tests in
 * `tests/hydration.test.ts` enforce this contract.
 */
const PRESETS: ReadonlyArray<{
  id: string;
  name: string;
  description: string;
  factory: () => BrandKit;
}> = [
  {
    id: "default",
    name: "預設",
    description: "紫粉品牌預設",
    factory: () => DEFAULT_BRAND_KIT,
  },
  {
    id: "purple-pink",
    name: "紫粉",
    description: "高彩度社群風格",
    factory: () =>
      createBrandKit({
        id: "purple-pink",
        name: "紫粉",
        colors: {
          primary: "#A855F7",
          secondary: "#EC4899",
          accent: "#F472B6",
          textOnImage: "#FFFFFF",
          strokeOnImage: "#000000",
        },
      }),
  },
  {
    id: "mono",
    name: "簡潔黑白",
    description: "純文字、高對比",
    factory: () =>
      createBrandKit({
        id: "mono",
        name: "簡潔黑白",
        colors: {
          primary: "#0F172A",
          secondary: "#1E293B",
          accent: "#F8FAFC",
          textOnImage: "#000000",
          strokeOnImage: "#FFFFFF",
        },
      }),
  },
];

/**
 * Resolve which preset UI id corresponds to a stored BrandKit after reload.
 *
 * Mirrors the exact lookup the `useEffect` above performs.  Pulled out so
 * the hydration contract is testable without a React renderer: the lookup
 * must succeed (return a preset) for every shipped preset's kit.
 */
export function resolvePresetByKitId(
  stored: BrandKit,
  presets: ReadonlyArray<{ id: string }> = PRESETS,
): { id: string; name: string } | undefined {
  const found = presets.find((p) => p.id === stored.id);
  if (!found) return undefined;
  const preset = PRESETS.find((p) => p.id === found.id);
  if (!preset) return undefined;
  return { id: preset.id, name: preset.name };
}

export function getBrandKitPresets(): ReadonlyArray<{ id: string; name: string; kit: BrandKit }> {
  return PRESETS.map((p) => ({ id: p.id, name: p.name, kit: p.factory() }));
}

export default function BrandKitPicker({ onChange, className }: BrandKitPickerProps) {
  const [activeId, setActiveId] = useState<string>(PRESETS[0]!.id);

  useEffect(() => {
    const stored = readBrandKit();
    const match = PRESETS.find((p) => p.id === stored.id);
    if (match) setActiveId(match.id);
  }, []);

  const activeKit = useMemo(() => {
    const found = PRESETS.find((p) => p.id === activeId);
    return (found ?? PRESETS[0]!).factory();
  }, [activeId]);

  function pick(id: string) {
    setActiveId(id);
    const found = PRESETS.find((p) => p.id === id);
    if (!found) return;
    const kit = found.factory();
    writeBrandKit(kit);
    onChange?.(kit, brandKitToCssVars(kit));
  }

  return (
    <div className={clsx("card p-4", className)}>
      <div className="mb-3 flex items-center gap-2">
        <Palette className="h-4 w-4 text-accent-pink" aria-hidden />
        <p className="text-sm font-medium">品牌套件</p>
        <span className="ml-auto text-xs text-muted">FR-005</span>
      </div>
      <div
        role="radiogroup"
        aria-label="品牌套件"
        className="grid grid-cols-3 gap-2"
      >
        {PRESETS.map((preset) => {
          const kit = preset.factory();
          const selected = activeId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => pick(preset.id)}
              className={clsx(
                "flex flex-col items-start gap-1 rounded-lg border p-2 text-left transition-colors",
                selected
                  ? "border-accent-pink bg-accent-pink/10"
                  : "border-white/10 hover:border-white/30",
              )}
            >
              <div className="flex h-6 w-full overflow-hidden rounded">
                <span
                  className="h-full flex-1"
                  style={{ background: kit.colors.primary }}
                  aria-hidden
                />
                <span
                  className="h-full flex-1"
                  style={{ background: kit.colors.secondary }}
                  aria-hidden
                />
                <span
                  className="h-full flex-1"
                  style={{ background: kit.colors.textOnImage, borderLeft: `2px solid ${kit.colors.strokeOnImage}` }}
                  aria-hidden
                />
              </div>
              <span className="text-xs font-medium">{preset.name}</span>
              <span className="line-clamp-1 text-[10px] text-muted">{preset.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
