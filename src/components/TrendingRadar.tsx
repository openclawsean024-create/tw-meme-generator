"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import clsx from "clsx";
import memesData from "@/data/memes.json";
import type { Meme } from "@/types";
import {
  getTrendingTopics,
  type TrendSource,
} from "@/lib/trending";
import type { TwTopic } from "@/data/tw-topics";

export interface TrendingRadarProps {
  limit?: number;
  className?: string;
}

const SOURCE_LABEL: Record<TrendSource, string> = {
  ptt: "Ptt",
  dcard: "Dcard",
  threads: "Threads",
  today: "今日",
};

/**
 * Mutually distinct Tailwind background classes per source (FR-009-B).
 * All readable on the dark page background.
 */
const SOURCE_BG: Record<TrendSource, string> = {
  ptt: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  dcard: "bg-rose-500/20 text-rose-200 border-rose-500/40",
  threads: "bg-violet-500/20 text-violet-200 border-violet-500/40",
  today: "bg-amber-500/20 text-amber-200 border-amber-500/40",
};

/** Exported for unit testing (FR-009-B). */
export function getSourceBadgeClass(source: TrendSource): string {
  return SOURCE_BG[source];
}

/**
 * Tags-overlap resolver (FR-009-C).  If the trending topic shares any tag
 * with a meme, return that meme.  Otherwise fall back to a deterministic
 * hash of the topic id → memes index.  Returning null means "no meme".
 */
export function resolveMemeForTopic(topic: TwTopic, memes: Meme[]): Meme | null {
  if (memes.length === 0) return null;
  const topicTags = new Set(topic.tags);
  const overlap = memes.find(
    (m) => Array.isArray(m.tags) && m.tags.some((t) => topicTags.has(t)),
  );
  if (overlap) return overlap;
  let hash = 0;
  for (let i = 0; i < topic.id.length; i++) {
    hash = (hash * 31 + topic.id.charCodeAt(i)) | 0;
  }
  return memes[Math.abs(hash) % memes.length] ?? null;
}

export default function TrendingRadar({ limit = 6, className }: TrendingRadarProps) {
  const memes = memesData as Meme[];
  const entries = getTrendingTopics(limit);

  return (
    <section
      aria-label="demo data"
      aria-labelledby="trending-radar-title"
      className={clsx("space-y-3", className)}
    >
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-accent-pink" aria-hidden />
        <h2 id="trending-radar-title" className="text-lg font-semibold">
          熱門時事雷達
        </h2>
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase text-amber-200">
          demo data
        </span>
      </div>
      <p className="text-xs text-muted">
        由 <code>src/data/tw-topics.ts</code> + 來源權重模型模擬;非真實 PTT/Dcard/Threads 抓取
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {entries.map(({ topic, source, score }) => {
          const meme = resolveMemeForTopic(topic, memes);
          const fallback = !meme;
          const target = meme
            ? `/editor/${meme.id}?mode=${meme.type === "with_text" ? "replace" : "add"}`
            : "#";
          return (
            <li key={topic.id}>
              <Link
                href={target}
                aria-disabled={fallback || undefined}
                className={clsx(
                  "card group flex h-full flex-col gap-3 p-4 transition-colors",
                  !fallback && "hover:border-accent-pink/60",
                  fallback && "opacity-80",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{topic.topic}</p>
                  <span
                    className={clsx(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      SOURCE_BG[source],
                    )}
                  >
                    {SOURCE_LABEL[source]}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-muted">{topic.captionHint}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-muted">
                  <span>score {score}</span>
                  {fallback ? (
                    <span
                      aria-label="尚無對應模板"
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted"
                    >
                      尚無對應模板
                    </span>
                  ) : (
                    <span className="text-accent-pink">→ 開始製作</span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
