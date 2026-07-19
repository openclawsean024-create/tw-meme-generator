import { describe, it, expect } from "vitest";
import {
  getTrendingTopics,
  getTrendingBySource,
  searchTrending,
} from "../src/lib/trending";

describe("trending radar", () => {
  it("getTrendingTopics returns sorted-by-score entries", () => {
    const entries = getTrendingTopics(10);
    expect(entries).toHaveLength(10);
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1]!.score).toBeGreaterThanOrEqual(entries[i]!.score);
    }
  });

  it("getTrendingTopics assigns a source to each entry", () => {
    const entries = getTrendingTopics(5);
    for (const e of entries) {
      expect(["ptt", "dcard", "threads", "today"]).toContain(e.source);
      expect(e.score).toBeGreaterThan(0);
    }
  });

  it("getTrendingTopics is deterministic (same input → same order)", () => {
    const a = getTrendingTopics(10);
    const b = getTrendingTopics(10);
    expect(a.map((e) => e.topic.id)).toEqual(b.map((e) => e.topic.id));
  });

  it("getTrendingTopics respects the limit", () => {
    expect(getTrendingTopics(3)).toHaveLength(3);
    expect(getTrendingTopics(50).length).toBeLessThanOrEqual(50);
  });

  it("getTrendingBySource overrides source weighting", () => {
    const todayEntries = getTrendingBySource("today", 5);
    const pttEntries = getTrendingBySource("ptt", 5);
    // top hotScore topics should still be top in any source view
    const todayTopId = todayEntries[0]?.topic.id;
    const pttTopId = pttEntries[0]?.topic.id;
    expect(todayTopId).toBe(pttTopId);
  });

  it("searchTrending with empty query falls back to all trending", () => {
    const all = searchTrending("", 10);
    const trending = getTrendingTopics(10);
    expect(all.map((e) => e.topic.id)).toEqual(trending.map((e) => e.topic.id));
  });

  it("searchTrending filters by topic/tag text", () => {
    const hits = searchTrending("躺平", 10);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.topic.topic.includes("躺平"))).toBe(true);
  });
});
