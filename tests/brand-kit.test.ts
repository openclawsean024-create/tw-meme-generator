import { describe, it, expect } from "vitest";
import {
  DEFAULT_BRAND_KIT,
  createBrandKit,
  validateHexColor,
  mergeBrandKit,
  brandKitToCssVars,
  type BrandKit,
} from "../src/lib/brand-kit";
import { getBrandKitPresets } from "../src/components/BrandKitPicker";

describe("brand kit", () => {
  it("DEFAULT_BRAND_KIT exposes the documented shape", () => {
    expect(DEFAULT_BRAND_KIT.id).toBe("default");
    expect(DEFAULT_BRAND_KIT.fonts.heading).toBeTruthy();
    expect(DEFAULT_BRAND_KIT.colors.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("createBrandKit applies overrides", () => {
    const kit = createBrandKit({
      name: "Lisa 品牌",
      colors: { ...DEFAULT_BRAND_KIT.colors, primary: "#FF00AA" },
    });
    expect(kit.name).toBe("Lisa 品牌");
    expect(kit.colors.primary).toBe("#FF00AA");
    expect(kit.colors.secondary).toBe(DEFAULT_BRAND_KIT.colors.secondary);
  });

  it("createBrandKit generates an id when not provided", () => {
    const kit = createBrandKit({ name: "x" });
    expect(kit.id).toMatch(/^bk_/);
  });

  it("validateHexColor accepts 3-digit and 6-digit hex", () => {
    expect(validateHexColor("#FFF")).toBe(true);
    expect(validateHexColor("#ffffff")).toBe(true);
    expect(validateHexColor("#abc123")).toBe(true);
  });

  it("validateHexColor rejects malformed values", () => {
    expect(validateHexColor("ffffff")).toBe(false);
    expect(validateHexColor("#xyzxyz")).toBe(false);
    expect(validateHexColor("#1234567")).toBe(false);
    expect(validateHexColor("")).toBe(false);
  });

  it("mergeBrandKit deep-merges fonts and colors", () => {
    const merged = mergeBrandKit(DEFAULT_BRAND_KIT, {
      name: "Team",
      colors: { ...DEFAULT_BRAND_KIT.colors, accent: "#00FF00" },
      fonts: { heading: "Noto Sans", body: "Noto Sans" },
    });
    expect(merged.name).toBe("Team");
    expect(merged.colors.accent).toBe("#00FF00");
    expect(merged.colors.primary).toBe(DEFAULT_BRAND_KIT.colors.primary);
    expect(merged.fonts.heading).toBe("Noto Sans");
  });

  it("brandKitToCssVars returns one entry per token", () => {
    const vars = brandKitToCssVars(DEFAULT_BRAND_KIT);
    expect(vars["--bk-heading-font"]).toBe(DEFAULT_BRAND_KIT.fonts.heading);
    expect(vars["--bk-primary"]).toBe(DEFAULT_BRAND_KIT.colors.primary);
    // 2 font tokens + 5 color tokens
    expect(Object.keys(vars).length).toBe(7);
  });
});

/**
 * WCAG 2.1 AA contrast helper (FR-005-C).
 * Reference algorithm: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) throw new Error(`bad hex: ${hex}`);
  const r = parseInt(m[1]!.slice(0, 2), 16) / 255;
  const g = parseInt(m[1]!.slice(2, 4), 16) / 255;
  const b = parseInt(m[1]!.slice(4, 6), 16) / 255;
  const toLinear = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Build a 6-digit hex from an 8-bit grayscale channel (`#000000`–`#FFFFFF`). */
function grayHex(g: number): string {
  const h = g.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

/**
 * Authoritative presets.  The component is the single source of truth — the
 * exhaustive grayscale sweep below runs against whatever the picker ships.
 */
const PRESETS = getBrandKitPresets();

describe("brand kit presets meet WCAG AA text contrast (≥ 4.5:1)", () => {
  it("ships the documented three presets", () => {
    const ids = PRESETS.map((p) => p.id).sort();
    expect(ids).toEqual(["default", "mono", "purple-pink"]);
  });

  it("textOnImage and strokeOnImage form the canonical WCAG-safe pair", () => {
    // The universal grayscale-safe pair is pure white + pure black (one or
    // the other).  Any "near-black" / "near-white" tint breaks coverage at
    // intermediate backgrounds.
    for (const { kit } of PRESETS) {
      const colors = new Set([
        kit.colors.textOnImage.toUpperCase(),
        kit.colors.strokeOnImage.toUpperCase(),
      ]);
      expect(colors.has("#FFFFFF")).toBe(true);
      expect(colors.has("#000000")).toBe(true);
    }
  });

  // Exhaustive 8-bit grayscale coverage for every shipped preset.
  // 3 presets × 256 grayscale values = 768 assertions in one place.
  for (const preset of PRESETS) {
    it(`${preset.name} keeps max(text,stroke) ≥ 4.5:1 against every grayscale #000000–#FFFFFF`, () => {
      const text = preset.kit.colors.textOnImage;
      const stroke = preset.kit.colors.strokeOnImage;
      let worstRatio = Infinity;
      let worstGray = -1;
      for (let g = 0; g < 256; g++) {
        const bg = grayHex(g);
        const textRatio = contrastRatio(text, bg);
        const strokeRatio = contrastRatio(stroke, bg);
        const max = Math.max(textRatio, strokeRatio);
        if (max < worstRatio) {
          worstRatio = max;
          worstGray = g;
        }
        expect(max, `g=${g} (${bg}) text=${text} stroke=${stroke} textRatio=${textRatio.toFixed(3)} strokeRatio=${strokeRatio.toFixed(3)}`).toBeGreaterThanOrEqual(4.5);
      }
      // Sanity check the sweep: record the worst observed ratio for visibility.
      expect(worstRatio).toBeGreaterThanOrEqual(4.5);
      expect(worstGray).toBeGreaterThanOrEqual(0);
      expect(worstGray).toBeLessThan(256);
    });
  }
});
