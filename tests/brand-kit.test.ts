import { describe, it, expect } from "vitest";
import {
  DEFAULT_BRAND_KIT,
  createBrandKit,
  validateHexColor,
  mergeBrandKit,
  brandKitToCssVars,
} from "../src/lib/brand-kit";

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
