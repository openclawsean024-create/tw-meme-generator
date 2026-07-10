import { describe, it, expect, beforeEach } from "vitest";
import {
  readAllShares,
  addShare,
  getShare,
  deleteShare,
  bumpShareCount,
  bumpLikeCount,
  clearAllShares,
  genId,
  type ShareRecord,
} from "../src/lib/storage";

// provide an in-memory localStorage shim
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
  clearAllShares();
});

function record(over: Partial<ShareRecord> = {}): ShareRecord {
  return {
    id: over.id ?? genId("r"),
    memeId: "dora-surprised",
    memeName: "哆啦 A 夢驚訤",
    imageUrl: "https://example.com/x.jpg",
    shareCount: 0,
    likeCount: 0,
    creator: "tester",
    previewText: "pre",
    regions: [],
    shareUrl: "",
    createdAt: 1,
    ...over,
  };
}

describe("storage", () => {
  it("starts empty", () => {
    expect(readAllShares()).toEqual([]);
  });

  it("adds and reads a record", () => {
    addShare(record({ id: "a" }));
    expect(readAllShares()).toHaveLength(1);
    expect(getShare("a")?.id).toBe("a");
  });

  it("reads & writes round-trip preserves data", () => {
    addShare(record({ id: "a", shareCount: 3, likeCount: 2 }));
    const r = getShare("a")!;
    expect(r.shareCount).toBe(3);
    expect(r.likeCount).toBe(2);
  });

  it("deletes by id", () => {
    addShare(record({ id: "a" }));
    addShare(record({ id: "b" }));
    deleteShare("a");
    expect(readAllShares().map((r) => r.id)).toEqual(["b"]);
  });

  it("bumps share count", () => {
    addShare(record({ id: "a", shareCount: 0 }));
    bumpShareCount("a");
    expect(getShare("a")?.shareCount).toBe(1);
    bumpShareCount("a");
    bumpShareCount("a");
    expect(getShare("a")?.shareCount).toBe(3);
  });

  it("bumps like count", () => {
    addShare(record({ id: "a", likeCount: 1 }));
    bumpLikeCount("a");
    expect(getShare("a")?.likeCount).toBe(2);
  });

  it("returns null for missing id", () => {
    addShare(record({ id: "a" }));
    expect(getShare("zzz")).toBeNull();
  });

  it("does nothing when bumping non-existent ids", () => {
    addShare(record({ id: "a", shareCount: 1 }));
    bumpShareCount("zzz");
    expect(getShare("a")?.shareCount).toBe(1);
  });

  it("clearAllShares empties storage", () => {
    addShare(record({ id: "a" }));
    addShare(record({ id: "b" }));
    clearAllShares();
    expect(readAllShares()).toEqual([]);
  });

  it("genId produces unique ids with prefix", () => {
    const a = genId("x");
    const b = genId("x");
    expect(a).not.toEqual(b);
    expect(a.startsWith("x_")).toBe(true);
  });
});
