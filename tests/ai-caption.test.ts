import { describe, it, expect } from "vitest";
import {
  generateCaption,
  generateCaptionBundle,
  type CaptionStyle,
} from "../src/lib/ai-caption";

const casual: CaptionStyle = { tone: "casual" };
const tsai: CaptionStyle = { tone: "tsai" };
const drama: CaptionStyle = { tone: "drama" };

describe("generateCaption", () => {
  it("produces a short caption containing the topic", () => {
    const result = generateCaption({ topic: "確診", length: "short", style: casual });
    expect(result.text).toContain("確診");
    expect(result.length).toBe("short");
    expect(result.moderated).toBe(false);
  });

  it("medium and long captions also embed the topic", () => {
    const m = generateCaption({ topic: "躺平", length: "medium", style: tsai });
    const l = generateCaption({ topic: "躺平", length: "long", style: drama });
    expect(m.text).toContain("躺平");
    expect(l.text).toContain("躺平");
    expect(l.text.length).toBeGreaterThan(m.text.length);
  });

  it("three tones produce distinct text for the same topic", () => {
    const topic = "加班";
    const a = generateCaption({ topic, length: "short", style: tsai });
    const b = generateCaption({ topic, length: "short", style: drama });
    const c = generateCaption({ topic, length: "short", style: casual });
    expect(a.text).not.toBe(b.text);
    expect(b.text).not.toBe(c.text);
    expect(a.text).not.toBe(c.text);
  });

  it("includes the optional user seed in parentheses", () => {
    const result = generateCaption({
      topic: "胖了",
      length: "medium",
      style: casual,
      seed: "我最近又胖了三公斤",
    });
    expect(result.text).toContain("我最近又胖了三公斤");
  });

  it("moderates profanity in Chinese", () => {
    const result = generateCaption({ topic: "幹你娘", length: "short", style: casual });
    expect(result.moderated).toBe(true);
    expect(result.text).toContain("遮罩");
  });

  it("moderates profanity in English regardless of case", () => {
    const result = generateCaption({ topic: "FUCK this", length: "long", style: tsai });
    expect(result.moderated).toBe(true);
  });

  it("does NOT moderate benign terms", () => {
    const result = generateCaption({ topic: "天氣不會好", length: "medium", style: tsai });
    expect(result.moderated).toBe(false);
    expect(result.text).toContain("天氣不會好");
  });
});

describe("generateCaptionBundle", () => {
  it("returns one caption per length (short/medium/long)", () => {
    const bundle = generateCaptionBundle("天氣", casual);
    expect(bundle).toHaveLength(3);
    expect(bundle.map((b) => b.length)).toEqual(["short", "medium", "long"]);
  });

  it("forwards seed to each caption", () => {
    const bundle = generateCaptionBundle("天氣", casual, "颱風要來了");
    expect(bundle.every((b) => b.text.includes("颱風要來了"))).toBe(true);
  });
});
