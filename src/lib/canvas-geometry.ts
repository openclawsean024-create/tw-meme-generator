/**
 * Canvas geometry helpers (FR-003 / FR-012).
 *
 * Source-of-truth for the editor's logical coordinate system.  MemeCanvas,
 * EditorClient, TextRegion and the export planner all derive their numbers
 * from `computeCanvasSize` so drag clamps, overflow detection and export
 * scaling stay consistent across aspect ratios (1:1, 9:16, 4:5).
 *
 * Motion tokens live here too: keeping them in one file makes FR-012
 * verifiable — tests assert the constants directly instead of probing
 * rendered DOM, which lets us keep the visual surface minimal and
 * honor `prefers-reduced-motion: reduce` (set on the root MotionConfig).
 */

export type AspectRatio = "1:1" | "9:16" | "4:5";

/** CSS `aspect-ratio` value used by the editor toolbar / MemeCanvas. */
export const ASPECT_FOR_SIZE: Readonly<Record<AspectRatio, string>> = {
  "1:1": "1 / 1",
  "9:16": "9 / 16",
  "4:5": "4 / 5",
};

/**
 * Editor / source canvas default width in CSS pixels.  Matches the SPEC's
 * "logical 600x600" source-of-truth used for export scaling.
 */
export const SOURCE_CANVAS_WIDTH = 600;

/**
 * Compute the editor source-canvas dimensions for the given aspect ratio.
 *
 * Width is anchored at SOURCE_CANVAS_WIDTH; height is derived so the
 * rectangle matches the CSS `aspect-ratio` exactly.  Integer rounding keeps
 * the rendered box from drifting by sub-pixels.
 */
export function computeCanvasSize(
  aspectRatio: AspectRatio,
  maxWidth: number = SOURCE_CANVAS_WIDTH,
): { width: number; height: number } {
  const w = Math.max(1, Math.round(maxWidth));
  switch (aspectRatio) {
    case "1:1":
      return { width: w, height: w };
    case "9:16":
      return { width: w, height: Math.round((w * 16) / 9) };
    case "4:5":
      return { width: w, height: Math.round((w * 5) / 4) };
  }
}

export interface RegionRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * Clamp a region so it stays fully inside the canvas.  Returns the same
 * shape; never throws.  Used by TextRegion's drag/resize handlers — kept
 * pure so the math is testable without a React renderer.
 */
export function clampRegionToCanvas<T extends RegionRect>(region: T, size: CanvasSize): T {
  const w = Math.max(0, Math.min(region.w, size.width));
  const h = Math.max(0, Math.min(region.h, size.height));
  const x = Math.max(0, Math.min(region.x, size.width - w));
  const y = Math.max(0, Math.min(region.y, size.height - h));
  return { ...region, x, y, w, h };
}

/**
 * Inverse of clamp: returns the regions that would overflow the canvas.
 * Independent of the export pipeline — purely the editor-side boundary
 * check used by the "X 個文字框超出邊界" warning.
 */
export function findCanvasOverflowingRegions(
  regions: ReadonlyArray<RegionRect>,
  size: CanvasSize,
): RegionRect[] {
  return regions.filter(
    (r) =>
      r.x < 0 ||
      r.y < 0 ||
      r.x + r.w > size.width ||
      r.y + r.h > size.height,
  );
}

/**
 * FR-012 motion tokens.
 *
 * Every visible transition in the editor surface is wired to one of these
 * values.  `MAX_VISIBLE_DURATION_MS` is the upper bound required by the
 * GOAL milestone ("<=200ms"), and `REDUCED_MOTION_DURATION_MS` is what we
 * swap to when `MotionConfig reducedMotion="user"` picks up the user's
 * reduced-motion preference.  Tests assert both directly.
 */
export const MOTION_TOKENS = {
  /** Upper bound for any visible transition per FR-012. */
  MAX_VISIBLE_DURATION_MS: 200,
  /** Duration used when `prefers-reduced-motion: reduce` is active. */
  REDUCED_MOTION_DURATION_MS: 0,
  /** Aspect change crossfade (MemeCanvas inner box). */
  CANVAS_ASPECT_FADE_MS: 180,
  /** Text-region hover / selected scale affordance. */
  REGION_AFFORDANCE_MS: 120,
  /** Share success / copy toast slide+fade. */
  SHARE_TOAST_MS: 160,
  /** Toast remains available to users and assistive technology for 1.6s. */
  TOAST_DWELL_MS: 1600,
} as const;

/**
 * Reduce the duration to 0ms when the caller signals reduced-motion.
 * Components consume this through framer-motion's `useReducedMotion()`
 * hook; we expose the helper so non-React callers (e.g. the toast timing
 * in ShareCard) can also short-circuit.
 */
export function motionDurationMs(
  durationMs: number,
  prefersReducedMotion: boolean,
): number {
  return prefersReducedMotion ? MOTION_TOKENS.REDUCED_MOTION_DURATION_MS : durationMs;
}
