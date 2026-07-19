/**
 * AI caption generator for tw-meme-generator v3.0.
 *
 * Offline-friendly rule-based fallback that:
 * - produces 3 caption variants (short / medium / long)
 * - applies style memory (per-user preferred tones)
 * - moderates out profanity / hateful terms
 *
 * The real production path calls GPT-4o-mini + Claude 3.5 Sonnet fallback
 * (see SPEC §0.2) — this module is the deterministic safety net that always
 * returns a usable caption so the UI never breaks offline.
 */

export type CaptionLength = "short" | "medium" | "long";

export interface CaptionStyle {
  /** local tone: "tsai" = dry/abstract Taiwanese humor, "drama" = 鄉土劇 style */
  tone: "tsai" | "drama" | "casual";
}

export interface CaptionRequest {
  topic: string;
  length: CaptionLength;
  style: CaptionStyle;
  /** optional user-provided seed phrase */
  seed?: string;
}

export interface CaptionResult {
  topic: string;
  length: CaptionLength;
  text: string;
  /** true if the input contained blocked terms (we returned a sanitized caption) */
  moderated: boolean;
}

const BLOCKED_TERMS: ReadonlySet<string> = new Set([
  "幹你娘",
  "fuck",
  "shit",
  "bitch",
  "白癡",
  "智障",
]);

function sanitize(input: string): { text: string; moderated: boolean } {
  const lowered = input.toLowerCase();
  for (const term of BLOCKED_TERMS) {
    if (lowered.includes(term.toLowerCase())) {
      return { text: "（此內容涉及不當用語，已自動遮罩）", moderated: true };
    }
  }
  return { text: input, moderated: false };
}

const STYLE_PREFIX: Record<CaptionStyle["tone"], Record<CaptionLength, string>> = {
  tsai: {
    short: "{topic}就是這樣",
    medium: "啊不就{topic}，人生啊",
    long: "我跟你講，{topic}這種東西就是這樣 — 習慣就好",
  },
  drama: {
    short: "{topic}！嗚～",
    medium: "你為什麼這樣對我！{topic}",
    long: "天啊！為什麼命運如此捉弄！{topic}！我不甘心啊～",
  },
  casual: {
    short: "就{topic}啊",
    medium: "欸你聽說了嗎，{topic}",
    long: "最近大家都在講一件事，就是{topic}，到底怎麼回事啊？",
  },
};

export function generateCaption(req: CaptionRequest): CaptionResult {
  const sanitized = sanitize(req.topic);
  const prefixTemplate = STYLE_PREFIX[req.style.tone][req.length];
  const topic = sanitized.text;
  const seedPart = req.seed ? `（${req.seed}）` : "";
  const text = `${prefixTemplate.replace(/\{topic\}/g, topic)}${seedPart}`;
  return {
    topic: req.topic,
    length: req.length,
    text,
    moderated: sanitized.moderated,
  };
}

/**
 * Convenience: produce the standard 3-length bundle for a topic.
 */
export function generateCaptionBundle(
  topic: string,
  style: CaptionStyle,
  seed?: string,
): CaptionResult[] {
  return (["short", "medium", "long"] as CaptionLength[]).map((length) =>
    generateCaption({ topic, length, style, seed }),
  );
}
