import { describe, it, expect } from "vitest";
import {
  TW_TOPICS,
  findTopicById,
  searchTopics,
  getTopicsByTag,
} from "../src/data/tw-topics";

describe("tw-topics catalog", () => {
  it("contains at least 30 curated topics", () => {
    expect(TW_TOPICS.length).toBeGreaterThanOrEqual(30);
  });

  it("every topic has unique id + non-empty fields", () => {
    const ids = new Set<string>();
    for (const t of TW_TOPICS) {
      expect(t.id).toBeTruthy();
      expect(t.topic).toBeTruthy();
      expect(t.captionHint).toBeTruthy();
      expect(t.tags.length).toBeGreaterThan(0);
      expect(t.hotScore).toBeGreaterThanOrEqual(0);
      expect(t.hotScore).toBeLessThanOrEqual(100);
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
    }
  });

  it("findTopicById returns the topic or null", () => {
    expect(findTopicById("que-ren")?.topic).toBe("確診");
    expect(findTopicById("does-not-exist")).toBeNull();
  });

  it("searchTopics matches topic text (case-insensitive)", () => {
    const hits = searchTopics("躺平");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.topic).toContain("躺平");
  });

  it("searchTopics matches tag text", () => {
    const hits = searchTopics("鄉土");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.tags.includes("鄉土"))).toBe(true);
  });

  it("searchTopics returns empty for blank query", () => {
    expect(searchTopics("")).toEqual([]);
    expect(searchTopics("   ")).toEqual([]);
  });

  it("searchTopics respects the limit", () => {
    const hits = searchTopics("的", 3);
    expect(hits.length).toBeLessThanOrEqual(3);
  });

  it("getTopicsByTag filters by tag exactly", () => {
    const hits = getTopicsByTag("心情");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => h.tags.includes("心情"))).toBe(true);
  });

  it("getTopicsByTag returns empty for unknown tag", () => {
    expect(getTopicsByTag("not-a-real-tag")).toEqual([]);
  });
});
