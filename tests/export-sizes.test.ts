import { describe, it, expect } from "vitest";
import {
  ALL_EXPORT_SIZES,
  EXPORT_SIZES,
  planExport,
  estimateExportBytes,
  findOverflowingRegions,
  type TextRegionLike,
} from "../src/lib/export-sizes";

describe("export-sizes", () => {
  it("exports the three canonical social sizes", () => {
    expect(ALL_EXPORT_SIZES.map((s) => s.label)).toEqual(["1:1", "9:16", "4:5"]);
    expect(EXPORT_SIZES["1:1"]).toEqual({ label: "1:1", width: 1080, height: 1080 });
    expect(EXPORT_SIZES["9:16"]).toEqual({ label: "9:16", width: 1080, height: 1920 });
    expect(EXPORT_SIZES["4:5"]).toEqual({ label: "4:5", width: 1080, height: 1350 });
  });

  it("planExport scales regions to the target canvas", () => {
    const regions: TextRegionLike[] = [
      { x: 100, y: 100, w: 200, h: 80, text: "hi" },
    ];
    const plan = planExport({
      sourceWidth: 600,
      sourceHeight: 600,
      size: "1:1",
      regions,
    });
    expect(plan.output.width).toBe(1080);
    expect(plan.regions[0]!.outW).toBe(360);
    expect(plan.regions[0]!.outX).toBe(180);
    expect(plan.regions[0]!.text).toBe("hi");
  });

  it("planExport respects the scale factor", () => {
    const plan = planExport({
      sourceWidth: 600,
      sourceHeight: 600,
      size: "1:1",
      regions: [{ x: 0, y: 0, w: 600, h: 100, text: "top" }],
      scale: 2,
    });
    expect(plan.scale).toBe(2);
    expect(plan.regions[0]!.outW).toBe(2160);
    expect(plan.regions[0]!.outH).toBe(360);
  });

  it("planExport for 9:16 stretches y-axis more than x-axis", () => {
    const plan = planExport({
      sourceWidth: 1080,
      sourceHeight: 1080,
      size: "9:16",
      regions: [{ x: 0, y: 0, w: 1080, h: 540, text: "half" }],
    });
    expect(plan.regions[0]!.outW).toBe(1080);
    expect(plan.regions[0]!.outH).toBe(960);
  });

  it("estimateExportBytes returns > 0 and bigger for PNG than JPG", () => {
    const plan = planExport({
      sourceWidth: 1080,
      sourceHeight: 1080,
      size: "1:1",
      regions: [],
    });
    const png = estimateExportBytes(plan, "png");
    const jpg = estimateExportBytes(plan, "jpg");
    expect(png).toBeGreaterThan(0);
    expect(jpg).toBeGreaterThan(0);
    expect(png).toBeGreaterThan(jpg);
  });

  it("findOverflowingRegions returns nothing for centered text on 1:1", () => {
    const overflowing = findOverflowingRegions({
      sourceWidth: 600,
      sourceHeight: 600,
      size: "1:1",
      regions: [{ x: 100, y: 250, w: 400, h: 100, text: "ok" }],
    });
    expect(overflowing).toHaveLength(0);
  });

  it("findOverflowingRegions catches text extending past canvas", () => {
    const overflowing = findOverflowingRegions({
      sourceWidth: 600,
      sourceHeight: 600,
      size: "1:1",
      regions: [{ x: 550, y: 550, w: 200, h: 100, text: "off-canvas" }],
    });
    expect(overflowing.length).toBeGreaterThan(0);
  });
});
