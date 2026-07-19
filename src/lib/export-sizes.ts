/**
 * Multi-size export (SPEC §3.1 F-006) — render a meme to the three
 * canonical Threads/IG aspect ratios used by the platform.
 *
 *  - 1:1   → Threads 1080×1080
 *  - 9:16  → IG Reels / 限動 1080×1920
 *  - 4:5   → IG feed portrait 1080×1350
 *
 * The exported canvas is sized to the given output width (default 1080),
 * preserving the original aspect ratio.  Text regions are proportionally
 * scaled relative to the source canvas, so the editor's coordinates
 * remain the source of truth.
 */

export type ExportSize = "1:1" | "9:16" | "4:5";

export interface SizeSpec {
  label: ExportSize;
  width: number;
  height: number;
}

export const EXPORT_SIZES: Readonly<Record<ExportSize, SizeSpec>> = {
  "1:1": { label: "1:1", width: 1080, height: 1080 },
  "9:16": { label: "9:16", width: 1080, height: 1920 },
  "4:5": { label: "4:5", width: 1080, height: 1350 },
};

export const ALL_EXPORT_SIZES: ReadonlyArray<SizeSpec> = [
  EXPORT_SIZES["1:1"],
  EXPORT_SIZES["9:16"],
  EXPORT_SIZES["4:5"],
];

export interface TextRegionLike {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
}

export interface ExportInput {
  /** source canvas (the editor view) width/height in CSS pixels */
  sourceWidth: number;
  sourceHeight: number;
  /** the target size we are rendering to */
  size: ExportSize;
  regions: TextRegionLike[];
  /** optional scale factor on the export output (default 1) */
  scale?: number;
}

export interface ScaledRegion extends TextRegionLike {
  /** x/y/w/h scaled to the *output* canvas */
  outX: number;
  outY: number;
  outW: number;
  outH: number;
}

export interface ExportPlan {
  output: SizeSpec;
  scale: number;
  regions: ScaledRegion[];
}

export function getSizeSpec(size: ExportSize): SizeSpec {
  return EXPORT_SIZES[size];
}

export function planExport(input: ExportInput): ExportPlan {
  const spec = getSizeSpec(input.size);
  const scaleX = spec.width / input.sourceWidth;
  const scaleY = spec.height / input.sourceHeight;
  const scale = input.scale ?? 1;
  const regions: ScaledRegion[] = input.regions.map((r) => ({
    ...r,
    outX: Math.round(r.x * scaleX * scale),
    outY: Math.round(r.y * scaleY * scale),
    outW: Math.round(r.w * scaleX * scale),
    outH: Math.round(r.h * scaleY * scale),
  }));
  return { output: spec, scale, regions };
}

export function estimateExportBytes(plan: ExportPlan, format: "png" | "jpg" = "png"): number {
  const pixels = plan.output.width * plan.output.height * plan.scale * plan.scale;
  // rough heuristic: PNG ≈ 0.7 byte/pixel, JPG ≈ 0.18 byte/pixel
  const perPixel = format === "png" ? 0.7 : 0.18;
  return Math.round(pixels * perPixel);
}

/**
 * For a given source size, validate whether the region would overflow the
 * target canvas after scaling. Returns the overflowing regions.
 */
export function findOverflowingRegions(input: ExportInput): TextRegionLike[] {
  const plan = planExport(input);
  const maxX = plan.output.width;
  const maxY = plan.output.height;
  return plan.regions.filter(
    (r) => r.outX < 0 || r.outY < 0 || r.outX + r.outW > maxX || r.outY + r.outH > maxY,
  );
}
