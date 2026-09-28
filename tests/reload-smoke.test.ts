import { describe, it, expect } from "vitest";
import {
  readBrandKit,
  writeBrandKit,
  clearBrandKit,
  BRAND_KIT_STORAGE_KEY,
} from "../src/lib/brand-kit-storage";
import {
  DEFAULT_BRAND_KIT,
  createBrandKit,
  type BrandKit,
} from "../src/lib/brand-kit";

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

describe("reload-persistence smoke (browser-side simulation)", () => {
  // Mirror of the presets shipped by `BrandKitPicker.PRESETS`.  The UI id
  // and the kit id MUST match (see tests/hydration.test.ts for the
  // contract).  Keep this array in sync with the component.
  const PRESETS: ReadonlyArray<BrandKit> = [
    DEFAULT_BRAND_KIT,
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
  ];

  it("STORAGE_KEY matches SPEC §5.2 (`twm:brand-kit`)", () => {
    expect(BRAND_KIT_STORAGE_KEY).toBe("twm:brand-kit");
  });

  it("initial read with empty storage returns DEFAULT_BRAND_KIT", () => {
    resetWindow();
    clearBrandKit();
    const kit = readBrandKit();
    expect(kit.id).toBe("default");
    expect(kit.colors.textOnImage).toBe("#FFFFFF");
    expect(kit.colors.strokeOnImage).toBe("#000000");
  });

  for (const preset of PRESETS) {
    it(`reload persists ${preset.id} (textOnImage=${preset.colors.textOnImage}, strokeOnImage=${preset.colors.strokeOnImage})`, () => {
      resetWindow();
      writeBrandKit(preset);

      const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
      expect(win.localStorage.store.has("twm:brand-kit")).toBe(true);
      expect(win.localStorage.store.has("tw-meme:brand-kit:v1")).toBe(false);

      // simulate a page reload by re-reading
      const restored = readBrandKit();
      expect(restored.id).toBe(preset.id);
      expect(restored.colors.textOnImage).toBe(preset.colors.textOnImage);
      expect(restored.colors.strokeOnImage).toBe(preset.colors.strokeOnImage);
    });
  }

  it("does not touch unrelated favorites/share keys on write or clear", () => {
    resetWindow();
    const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
    win.localStorage.setItem("twm:favorites", "[1,2,3]");
    win.localStorage.setItem("twm:share:abc", '{"text":"hi"}');
    win.localStorage.setItem("tw-meme:favorites:v1", "[4,5]");

    writeBrandKit({ ...DEFAULT_BRAND_KIT, id: "isolation" });
    expect(win.localStorage.store.get("twm:favorites")).toBe("[1,2,3]");
    expect(win.localStorage.store.get("twm:share:abc")).toBe('{"text":"hi"}');
    expect(win.localStorage.store.get("tw-meme:favorites:v1")).toBe("[4,5]");

    clearBrandKit();
    expect(win.localStorage.store.has("twm:brand-kit")).toBe(false);
    expect(win.localStorage.store.has("twm:favorites")).toBe(true);
    expect(win.localStorage.store.has("twm:share:abc")).toBe(true);
    expect(win.localStorage.store.has("tw-meme:favorites:v1")).toBe(true);
  });
});
