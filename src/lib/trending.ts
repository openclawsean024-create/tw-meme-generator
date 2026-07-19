/**
 * Trending topics radar (v3.0 §0.1 — Ptt/Dcard/Threads aggregation).
 *
 * In production this would ingest the live Ptt/Dcard/Threads APIs;
 * here we expose a deterministic scoring & filtering layer over
 * the static tw-topics catalog so the front-end can render a
 * "今日時事 / 熱門排行" widget without any network.
 */

import { TW_TOPICS, type TwTopic } from "@/data/tw-topics";

export type TrendSource = "ptt" | "dcard" | "threads" | "today";

export interface TrendEntry {
  topic: TwTopic;
  source: TrendSource;
  /** combined hot score after weighting source (0-100+) */
  score: number;
}

const SOURCE_WEIGHT: Record<TrendSource, number> = {
  ptt: 0.85,
  dcard: 0.9,
  threads: 1.0,
  today: 1.1,
};

/**
 * Stable pseudo-source assignment: deterministic but spreads across sources.
 * Real implementation would replace this with live feed ingestion.
 */
function sourceForTopic(id: string): TrendSource {
  const sources: TrendSource[] = ["ptt", "dcard", "threads", "today"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % sources.length;
  return sources[idx] as TrendSource;
}

export function getTrendingTopics(limit = 10): TrendEntry[] {
  return TW_TOPICS.map((topic) => {
    const source = sourceForTopic(topic.id);
    const weighted = topic.hotScore * SOURCE_WEIGHT[source];
    return { topic, source, score: Math.round(weighted) };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getTrendingBySource(source: TrendSource, limit = 10): TrendEntry[] {
  return TW_TOPICS.map((topic) => ({
    topic,
    source,
    score: Math.round(topic.hotScore * SOURCE_WEIGHT[source]),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function searchTrending(query: string, limit = 10): TrendEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return getTrendingTopics(limit);
  return getTrendingTopics(50)
    .filter(
      (entry) =>
        entry.topic.topic.toLowerCase().includes(q) ||
        entry.topic.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
    .slice(0, limit);
}
