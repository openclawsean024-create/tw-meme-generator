import { describe, it, expect, beforeEach } from "vitest";
import { DEFAULT_BRAND_KIT } from "../src/lib/brand-kit";
import {
  readBrandKit,
  writeBrandKit,
  clearBrandKit,
  BRAND_KIT_STORAGE_KEY,
} from "../src/lib/brand-kit-storage";

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

describe("brand-kit-storage", () => {
  beforeEach(() => {
    resetWindow();
    clearBrandKit();
  });

  it("returns DEFAULT_BRAND_KIT when nothing is stored", () => {
    const kit = readBrandKit();
    expect(kit.id).toBe(DEFAULT_BRAND_KIT.id);
    expect(kit.colors.primary).toBe(DEFAULT_BRAND_KIT.colors.primary);
  });

  it("returns DEFAULT_BRAND_KIT when window is unavailable (SSR-safe)", () => {
    const saved = (globalThis as { window?: unknown }).window;
    (globalThis as { window?: unknown }).window = undefined;
    try {
      expect(readBrandKit().id).toBe(DEFAULT_BRAND_KIT.id);
    } finally {
      (globalThis as { window?: unknown }).window = saved;
    }
  });

  it("round-trips a custom BrandKit through localStorage", () => {
    const custom = {
      ...DEFAULT_BRAND_KIT,
      id: "custom_1",
      name: "自訂品牌",
      colors: { ...DEFAULT_BRAND_KIT.colors, primary: "#FF00AA" },
    };
    writeBrandKit(custom);
    const read = readBrandKit();
    expect(read.id).toBe("custom_1");
    expect(read.name).toBe("自訂品牌");
    expect(read.colors.primary).toBe("#FF00AA");
  });

  it("falls back to DEFAULT_BRAND_KIT when stored JSON is malformed", () => {
    const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
    win.localStorage.setItem(BRAND_KIT_STORAGE_KEY, "{not json");
    const kit = readBrandKit();
    expect(kit.id).toBe(DEFAULT_BRAND_KIT.id);
  });

  it("merges partial stored kit onto DEFAULT_BRAND_KIT for missing fields", () => {
    const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
    win.localStorage.setItem(
      BRAND_KIT_STORAGE_KEY,
      JSON.stringify({ id: "partial", colors: { primary: "#123456" } }),
    );
    const kit = readBrandKit();
    expect(kit.id).toBe("partial");
    expect(kit.colors.primary).toBe("#123456");
    expect(kit.colors.secondary).toBe(DEFAULT_BRAND_KIT.colors.secondary);
    expect(kit.fonts.heading).toBe(DEFAULT_BRAND_KIT.fonts.heading);
  });

  it("clearBrandKit removes the entry", () => {
    writeBrandKit({ ...DEFAULT_BRAND_KIT, id: "x" });
    clearBrandKit();
    expect(readBrandKit().id).toBe(DEFAULT_BRAND_KIT.id);
  });

  it("uses the documented localStorage key (`twm:brand-kit` per SPEC §5.2)", () => {
    expect(BRAND_KIT_STORAGE_KEY).toBe("twm:brand-kit");
    const custom = { ...DEFAULT_BRAND_KIT, id: "key-check" };
    writeBrandKit(custom);
    const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
    expect(win.localStorage.store.has("twm:brand-kit")).toBe(true);
    // legacy key (tw-meme:brand-kit:v1) MUST NOT be touched by the new code
    expect(win.localStorage.store.has("tw-meme:brand-kit:v1")).toBe(false);
  });

  it("does not touch unrelated favorites/share keys", () => {
    const win = (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window;
    win.localStorage.setItem("twm:favorites", "[1,2,3]");
    win.localStorage.setItem("tw-meme:favorites:v1", "[1,2,3]");
    win.localStorage.setItem("twm:share:abc", "{}");
    writeBrandKit({ ...DEFAULT_BRAND_KIT, id: "isolation-check" });
    expect(win.localStorage.store.has("twm:favorites")).toBe(true);
    expect(win.localStorage.store.has("tw-meme:favorites:v1")).toBe(true);
    expect(win.localStorage.store.has("twm:share:abc")).toBe(true);
    clearBrandKit();
    // brand-kit key gone, neighbours intact
    expect(win.localStorage.store.has("twm:brand-kit")).toBe(false);
    expect(win.localStorage.store.has("twm:favorites")).toBe(true);
    expect(win.localStorage.store.has("tw-meme:favorites:v1")).toBe(true);
    expect(win.localStorage.store.has("twm:share:abc")).toBe(true);
  });
});
