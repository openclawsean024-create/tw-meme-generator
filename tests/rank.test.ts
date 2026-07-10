import { describe, it, expect } from "vitest";
import { scoreOf, rankByScore, mergeAndRank } from "../src/lib/rank";
import type { ShareRecord } from "../src/lib/storage";

function rec(id: string, shareCount: number, likeCount: number, memeId = "m"): ShareRecord {
  return {
    id,
    memeId,
    memeName: "",
    imageUrl: "",
    shareCount,
    likeCount,
    creator: "x",
    previewText: "",
    regions: [],
    shareUrl: "",
    createdAt: 0,
  };
}

describe("scoreOf", () => {
  it("weights shares 2x likes", () => {
    expect(scoreOf({ shareCount: 0, likeCount: 0 })).toBe(0);
    expect(scoreOf({ shareCount: 1, likeCount: 0 })).toBe(2);
    expect(scoreOf({ shareCount: 0, likeCount: 1 })).toBe(1);
    expect(scoreOf({ shareCount: 3, likeCount: 4 })).toBe(10);
  });
});

describe("rankByScore", () => {
  it("returns records sorted by score descending", () => {
    const result = rankByScore([
      rec("a", 1, 1),
      rec("b", 5, 5),
      rec("c", 2, 10),
    ]);
    expect(result.map((r) => r.id)).toEqual(["b", "c", "a"]);
  });

  it("respects the limit", () => {
    const data = Array.from({ length: 25 }, (_, i) => rec(`id${i}`, 25 - i, 0));
    expect(rankByScore(data, 10)).toHaveLength(10);
  });

  it("attaches score to each item", () => {
    const result = rankByScore([rec("a", 3, 4)]);
    expect(result[0].score).toBe(10);
  });

  it("empty input returns empty array", () => {
    expect(rankByScore([])).toEqual([]);
  });
});

describe("mergeAndRank", () => {
  it("deduplicates by id keeping last seen", () => {
    const seed = [rec("a", 1, 1)];
    const user = [rec("a", 99, 0)];
    const result = mergeAndRank(seed, user);
    expect(result).toHaveLength(1);
    expect(result[0].shareCount).toBe(99);
  });

  it("merges disjoint sets and ranks", () => {
    const seed = [rec("a", 5, 0)];
    const user = [rec("b", 1, 0)];
    const result = mergeAndRank(seed, user, 5);
    expect(result.map((r) => r.id)).toEqual(["a", "b"]);
  });
});
