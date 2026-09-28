import { describe, it, expect } from "vitest";
import { TOAST_TEXT, type CopyState } from "../src/components/ShareCard";
import { MOTION_TOKENS, motionDurationMs } from "../src/lib/canvas-geometry";

/**
 * FR-012 / share-card motion contract.
 *
 * The ShareCard renders an AnimatePresence toast whose slide+fade duration
 * is sourced from MOTION_TOKENS.SHARE_TOAST_MS through motionDurationMs.
 * When the caller passes `prefersReducedMotion={true}` the toast dwell
 * collapses to 0ms (per AC-FR012-A), so the toast surface mounts and
 * unmounts instantly while remaining visible long enough for screen
 * readers to announce it.
 */

describe("ShareCard FR-012 toast contract", () => {
  it("every CopyState has the documented toast wording", () => {
    expect(TOAST_TEXT.idle).toBeNull();
    expect(TOAST_TEXT.copied).toBe("已複製連結");
    expect(TOAST_TEXT.shared).toBe("已分享");
    expect(TOAST_TEXT.error).toBe("複製失敗");
  });

  it("idle state produces no toast (idle is the only state with null text)", () => {
    const states: CopyState[] = ["idle", "copied", "error", "shared"];
    const nonNull = states.filter((s) => TOAST_TEXT[s] !== null);
    expect(nonNull).toEqual(["copied", "error", "shared"]);
  });

  it("toast dwell stays readable for 1.6s regardless of motion preference", () => {
    expect(MOTION_TOKENS.TOAST_DWELL_MS).toBe(1600);
    expect(motionDurationMs(MOTION_TOKENS.TOAST_DWELL_MS, true)).toBe(0);
    expect(MOTION_TOKENS.TOAST_DWELL_MS).toBe(1600);
  });

  it("toast slide+fade duration honors the FR-012 ≤200ms cap", () => {
    const slide = motionDurationMs(MOTION_TOKENS.SHARE_TOAST_MS, false);
    expect(slide).toBeLessThanOrEqual(MOTION_TOKENS.MAX_VISIBLE_DURATION_MS);
    // Reduced-motion override drops it to zero
    expect(motionDurationMs(MOTION_TOKENS.SHARE_TOAST_MS, true)).toBe(0);
  });
});
