import { describe, it, expect } from "vitest";
import {
  ASPECT_FOR_SIZE,
  MOTION_TOKENS,
  SOURCE_CANVAS_WIDTH,
  clampRegionToCanvas,
  computeCanvasSize,
  findCanvasOverflowingRegions,
  motionDurationMs,
} from "../src/lib/canvas-geometry";

describe("FR-003 canvas geometry", () => {
  it("computeCanvasSize — 1:1 returns 600x600", () => {
    expect(computeCanvasSize("1:1")).toEqual({ width: 600, height: 600 });
  });

  it("computeCanvasSize — 9:16 returns the full vertical strip (this was the bug)", () => {
    const { width, height } = computeCanvasSize("9:16");
    expect(width).toBe(600);
    // round(600 * 16 / 9) = round(1066.66..) = 1067
    expect(height).toBe(Math.round((600 * 16) / 9));
    expect(height).toBeGreaterThan(600);
    expect(ASPECT_FOR_SIZE["9:16"]).toBe("9 / 16");
  });

  it("computeCanvasSize — 4:5 returns a taller rectangle than 1:1", () => {
    const { width, height } = computeCanvasSize("4:5");
    expect(width).toBe(600);
    // round(600 * 5 / 4) = 750
    expect(height).toBe(750);
    expect(height).toBeGreaterThan(600);
    expect(ASPECT_FOR_SIZE["4:5"]).toBe("4 / 5");
  });

  it("computeCanvasSize respects a custom maxWidth", () => {
    const { width, height } = computeCanvasSize("9:16", 360);
    expect(width).toBe(360);
    expect(height).toBe(Math.round((360 * 16) / 9)); // 640
  });

  it("computeCanvasSize clamps a non-positive maxWidth to 1", () => {
    expect(computeCanvasSize("1:1", 0)).toEqual({ width: 1, height: 1 });
    expect(computeCanvasSize("1:1", -10)).toEqual({ width: 1, height: 1 });
  });

  it("SOURCE_CANVAS_WIDTH is 600 (SPEC source-of-truth)", () => {
    expect(SOURCE_CANVAS_WIDTH).toBe(600);
  });
});

describe("FR-003 clamp — text region stays inside the canvas", () => {
  it("returns the region unchanged when fully inside", () => {
    const r = { x: 50, y: 50, w: 200, h: 80 };
    expect(clampRegionToCanvas(r, { width: 600, height: 1067 })).toEqual(r);
  });

  it("clamps a region pushed past the right edge of a 9:16 canvas", () => {
    const next = clampRegionToCanvas(
      { x: 580, y: 100, w: 100, h: 50 },
      { width: 600, height: 1067 },
    );
    expect(next.x).toBe(500);
    expect(next.x + next.w).toBe(600);
  });

  it("clamps a region pushed past the bottom of a 9:16 canvas (the bug Codex flagged)", () => {
    // Pre-fix: this would have clamped to y=550 (height 600 hardcoded), so
    // the user could never reach the bottom 467px.  Post-fix: y must clamp
    // to height - h = 1067 - 80 = 987.
    const next = clampRegionToCanvas(
      { x: 50, y: 1100, w: 200, h: 80 },
      { width: 600, height: 1067 },
    );
    expect(next.y).toBe(987);
    expect(next.y + next.h).toBe(1067);
  });

  it("clamps a region pushed past the bottom of a 4:5 canvas", () => {
    const next = clampRegionToCanvas(
      { x: 50, y: 800, w: 200, h: 80 },
      { width: 600, height: 750 },
    );
    expect(next.y).toBe(670);
    expect(next.y + next.h).toBe(750);
  });

  it("clamps a region with negative x/y", () => {
    const next = clampRegionToCanvas(
      { x: -20, y: -10, w: 100, h: 50 },
      { width: 600, height: 600 },
    );
    expect(next.x).toBe(0);
    expect(next.y).toBe(0);
  });

  it("shrinks a region whose width exceeds the canvas", () => {
    const next = clampRegionToCanvas(
      { x: 0, y: 0, w: 1200, h: 80 },
      { width: 600, height: 600 },
    );
    expect(next.w).toBe(600);
    expect(next.x).toBe(0);
  });
});

describe("FR-003-C overflow detection — editor-side boundary check", () => {
  it("9:16 does NOT flag a region at y=900 h=80 (within 1067)", () => {
    const overflow = findCanvasOverflowingRegions(
      [{ x: 50, y: 900, w: 200, h: 80 }],
      { width: 600, height: 1067 },
    );
    expect(overflow).toHaveLength(0);
  });

  it("9:16 flags a region that extends past y+h=1067", () => {
    const overflow = findCanvasOverflowingRegions(
      [{ x: 50, y: 1000, w: 200, h: 200 }],
      { width: 600, height: 1067 },
    );
    expect(overflow.length).toBe(1);
  });

  it("4:5 flags a region past y=750", () => {
    const overflow = findCanvasOverflowingRegions(
      [{ x: 50, y: 700, w: 200, h: 200 }],
      { width: 600, height: 750 },
    );
    expect(overflow.length).toBe(1);
  });

  it("1:1 still flags x+w > 600", () => {
    const overflow = findCanvasOverflowingRegions(
      [{ x: 550, y: 50, w: 100, h: 80 }],
      { width: 600, height: 600 },
    );
    expect(overflow.length).toBe(1);
  });
});

describe("FR-012 motion tokens", () => {
  it("every visible duration is ≤ 200ms (FR-012 hard cap)", () => {
    const cap = MOTION_TOKENS.MAX_VISIBLE_DURATION_MS;
    expect(MOTION_TOKENS.CANVAS_ASPECT_FADE_MS).toBeLessThanOrEqual(cap);
    expect(MOTION_TOKENS.REGION_AFFORDANCE_MS).toBeLessThanOrEqual(cap);
    expect(MOTION_TOKENS.SHARE_TOAST_MS).toBeLessThanOrEqual(cap);
  });

  it("REDUCED_MOTION_DURATION_MS is exactly 0 (per AC-FR012-A)", () => {
    expect(MOTION_TOKENS.REDUCED_MOTION_DURATION_MS).toBe(0);
  });

  it("motionDurationMs collapses visible durations to 0 when reduced-motion is on", () => {
    expect(motionDurationMs(180, true)).toBe(0);
    expect(motionDurationMs(120, true)).toBe(0);
    expect(motionDurationMs(160, true)).toBe(0);
  });

  it("motionDurationMs preserves the requested duration when reduced-motion is off", () => {
    expect(motionDurationMs(180, false)).toBe(180);
    expect(motionDurationMs(120, false)).toBe(120);
  });
});
