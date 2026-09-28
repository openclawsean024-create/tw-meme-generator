import { describe, it, expect } from "vitest";
import { resolveMemeForTopic, getSourceBadgeClass } from "../src/components/TrendingRadar";
import memesData from "../src/data/memes.json";
import type { Meme } from "../src/types";
import type { TwTopic } from "../src/data/tw-topics";

describe("trending-radar resolver", () => {
  const memes = memesData as Meme[];

  it("returns a meme whose tags overlap with the topic", () => {
    const topic: TwTopic = {
      id: "x",
      topic: "躺平",
      captionHint: "",
      tags: ["心情"],
      hotScore: 80,
    };
    const result = resolveMemeForTopic(topic, memes);
    expect(result).not.toBeNull();
    // The result must share at least one tag with the topic.
    expect(result!.tags.some((t) => topic.tags.includes(t))).toBe(true);
  });

  it("falls back to a deterministic meme when no tags overlap", () => {
    const topic: TwTopic = {
      id: "absolutely_no_overlap_topic",
      topic: "N/A",
      captionHint: "",
      tags: ["zzz-does-not-exist-1", "zzz-does-not-exist-2"],
      hotScore: 50,
    };
    const first = resolveMemeForTopic(topic, memes);
    const second = resolveMemeForTopic(topic, memes);
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(first!.id).toBe(second!.id);
    expect(first!.tags.every((t) => !topic.tags.includes(t))).toBe(true);
  });

  it("returns null for an empty memes list", () => {
    const topic: TwTopic = {
      id: "t",
      topic: "x",
      captionHint: "",
      tags: ["心情"],
      hotScore: 50,
    };
    expect(resolveMemeForTopic(topic, [])).toBeNull();
  });
});

describe("trending-radar source chip colors", () => {
  it("exposes a distinct Tailwind class per source", () => {
    const bg = getSourceBadgeClass("ptt");
    const dcard = getSourceBadgeClass("dcard");
    const threads = getSourceBadgeClass("threads");
    const today = getSourceBadgeClass("today");
    expect(bg).not.toBe(dcard);
    expect(bg).not.toBe(threads);
    expect(bg).not.toBe(today);
    expect(dcard).not.toBe(threads);
    expect(dcard).not.toBe(today);
    expect(threads).not.toBe(today);
    // Color hue names must be present and distinct.
    expect(bg).toContain("emerald");
    expect(dcard).toContain("rose");
    expect(threads).toContain("violet");
    expect(today).toContain("amber");
  });
});
