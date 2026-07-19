import { describe, it, expect, beforeEach } from "vitest";
import {
  readFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  clearFavorites,
  countFavorites,
} from "../src/lib/favorites";

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

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
    localStorage: new MemoryStorage(),
  };
  clearFavorites();
});

describe("favorites", () => {
  it("starts empty", () => {
    expect(readFavorites()).toEqual([]);
    expect(countFavorites()).toBe(0);
  });

  it("addFavorite appends a new id", () => {
    const ids = addFavorite("meme-1");
    expect(ids).toEqual(["meme-1"]);
    expect(isFavorite("meme-1")).toBe(true);
    expect(countFavorites()).toBe(1);
  });

  it("addFavorite is idempotent for existing ids", () => {
    addFavorite("meme-1");
    addFavorite("meme-1");
    expect(countFavorites()).toBe(1);
  });

  it("removeFavorite drops the id", () => {
    addFavorite("meme-1");
    addFavorite("meme-2");
    removeFavorite("meme-1");
    expect(readFavorites()).toEqual(["meme-2"]);
    expect(isFavorite("meme-1")).toBe(false);
  });

  it("toggleFavorite flips active state both ways", () => {
    const on = toggleFavorite("meme-1");
    expect(on.active).toBe(true);
    expect(isFavorite("meme-1")).toBe(true);
    const off = toggleFavorite("meme-1");
    expect(off.active).toBe(false);
    expect(isFavorite("meme-1")).toBe(false);
  });

  it("clearFavorites empties the list", () => {
    addFavorite("a");
    addFavorite("b");
    clearFavorites();
    expect(countFavorites()).toBe(0);
  });

  it("survives multiple adds in order", () => {
    addFavorite("a");
    addFavorite("b");
    addFavorite("c");
    expect(readFavorites()).toEqual(["a", "b", "c"]);
  });
});
