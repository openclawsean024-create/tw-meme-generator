/**
 * Ranking utilities — sort share records by a composite score.
 */

import type { ShareRecord } from "./storage";

export interface RankItem extends ShareRecord {
  score: number;
}

export interface ScoreInput {
  shareCount: number;
  likeCount: number;
}

/**
 * Weighted scoring: shares are worth ~2 points, likes ~1 point.
 * Sharing is the primary engagement we want to reward.
 */
export function scoreOf({ shareCount, likeCount }: ScoreInput): number {
  return shareCount * 2 + likeCount * 1;
}

export function rankByScore(records: ShareRecord[], limit = 20): RankItem[] {
  return records
    .map((r) => ({ ...r, score: scoreOf(r) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function mergeAndRank(
  seed: ShareRecord[],
  user: ShareRecord[],
  limit = 20,
): RankItem[] {
  // merge, dedupe by id, then rank
  const map = new Map<string, ShareRecord>();
  for (const r of [...seed, ...user]) {
    map.set(r.id, r);
  }
  return rankByScore(Array.from(map.values()), limit);
}
