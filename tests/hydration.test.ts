import { describe, it, expect, beforeEach } from "vitest";
import { DEFAULT_BRAND_KIT, type BrandKit } from "../src/lib/brand-kit";
import {
  readBrandKit,
  writeBrandKit,
  clearBrandKit,
  BRAND_KIT_STORAGE_KEY,
} from "../src/lib/brand-kit-storage";
import {
  getBrandKitPresets,
  resolvePresetByKitId,
} from "../src/components/BrandKitPicker";

class MemoryStorage {
  store = new Map<string, string>();
  getItem(k: string) {
    return this.store.has(k) ? (this.store.get(k) as string) : null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

function resetWindow() {
  (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
    localStorage: new MemoryStorage(),
  };
}

/**
 * Integration-level coverage for the click → reload → selection contract.
 *
 * This exercises the EXACT lookup the component's hydration `useEffect`
 * performs (`PRESETS.find(p => p.id === stored.id)`), not just a storage
 * round-trip.  It catches the regression Codex flagged on the "簡潔黑白"
 * path: a BrandKit whose `id` does not equal its preset's UI id is silently
 * rejected by the hydration lookup and the picker resets to the default.
 */
describe("BrandKitPicker hydration contract", () => {
  beforeEach(() => {
    resetWindow();
    clearBrandKit();
  });

  it("every shipped preset's kit id equals its preset UI id (no drift)", () => {
    for (const preset of getBrandKitPresets()) {
      // This is the root cause of the Codex bug: when kit.id differs from
      // preset UI id, `PRESETS.find(p => p.id === stored.id)` returns
      // undefined after reload.
      expect(preset.kit.id, `kit.id for ${preset.name}`).toBe(preset.id);
    }
  });

  it("ships the documented three presets", () => {
    const ids = getBrandKitPresets().map((p) => p.id).sort();
    expect(ids).toEqual(["default", "mono", "purple-pink"]);
  });

  // Per-preset hydration round-trip: simulate user clicking each preset
  // and reloading.  The active preset id after reload must equal the UI id
  // of the preset the user picked.
  for (const preset of getBrandKitPresets()) {
    it(`picking "${preset.name}" survives reload (UI id stays "${preset.id}")`, () => {
      // 1. simulate the user clicking the preset radio — writes the kit
      writeBrandKit(preset.kit);

      // 2. confirm the stored kit carries the same id we expect to look up
      const stored = readBrandKit();
      expect(stored.id).toBe(preset.kit.id);

      // 3. simulate page reload + hydration `useEffect` lookup
      const hydrated = resolvePresetByKitId(stored);
      expect(hydrated, `hydration must resolve preset for "${preset.name}"`).toBeDefined();
      expect(hydrated!.id).toBe(preset.id);
      expect(hydrated!.name).toBe(preset.name);

      // 4. confirm the same lookup that the component body performs
      // (PRESETS.find(p => p.id === stored.id)) returns the matching
      // preset rather than falling back to PRESETS[0].
      const PRESETS = getBrandKitPresets();
      const matched = PRESETS.find((p) => p.id === stored.id);
      expect(matched, `lookup would fall back to default for "${preset.name}"`).toBeDefined();
      expect(matched!.id).toBe(preset.id);
    });
  }

  it("regression repro: a kit whose id ≠ any preset UI id does NOT hijack hydration", () => {
    // Simulate an older write from before the cycle-4 id reconciliation
    // (kit.id "preset_mono" no longer exists in the preset list).
    const legacy = {
      ...DEFAULT_BRAND_KIT,
      id: "preset_mono",
      name: "簡潔黑白 (legacy id)",
      colors: { ...DEFAULT_BRAND_KIT.colors },
    } as BrandKit;
    writeBrandKit(legacy);

    const stored = readBrandKit();
    // storage layer does NOT silently rewrite the id — it must round-trip
    // exactly what was written so users don't lose data unexpectedly.
    expect(stored.id).toBe("preset_mono");

    // but the picker must not surface a "selected" preset for an unknown id;
    // it should fall back to PRESETS[0] so the UI stays consistent.
    const hydrated = resolvePresetByKitId(stored);
    expect(hydrated).toBeUndefined();
  });

  it("clearBrandKit followed by reload yields the first preset (default)", () => {
    writeBrandKit(getBrandKitPresets().find((p) => p.id === "purple-pink")!.kit);
    clearBrandKit();
    const stored = readBrandKit();
    // empty storage → DEFAULT_BRAND_KIT
    expect(stored.id).toBe(DEFAULT_BRAND_KIT.id);
    const hydrated = resolvePresetByKitId(stored);
    expect(hydrated!.id).toBe("default");
  });

  it("uses the SPEC §5.2 key throughout the hydration flow", () => {
    const purplePink = getBrandKitPresets().find((p) => p.id === "purple-pink")!;
    writeBrandKit(purplePink.kit);
    const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
    expect(win.localStorage.store.has(BRAND_KIT_STORAGE_KEY)).toBe(true);
    expect(BRAND_KIT_STORAGE_KEY).toBe("twm:brand-kit");
    const stored = readBrandKit();
    expect(stored.id).toBe("purple-pink");
    expect(resolvePresetByKitId(stored)!.id).toBe("purple-pink");
  });
});
