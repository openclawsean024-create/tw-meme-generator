"use client";

import Link from "next/link";
import { Heart, Share2, Trophy } from "lucide-react";
import clsx from "clsx";
import type { Meme } from "@/types";
import type { RankItem } from "@/lib/rank";

export interface RankListProps {
  items: RankItem[];
  memeMap: Map<string, Meme>;
}

export default function RankList({ items, memeMap }: RankListProps) {
  if (items.length === 0) {
    return (
      <div className="card p-10 text-center text-muted">
        尚無排行資料 — 去製作第一張梗圖吧!
      </div>
    );
  }

  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, idx) => {
        const meme = memeMap.get(item.memeId);
        const rankColors =
          idx === 0
            ? "from-yellow-400 to-amber-500"
            : idx === 1
              ? "from-zinc-300 to-zinc-400"
              : idx === 2
                ? "from-orange-400 to-amber-600"
                : "from-white/10 to-white/0";
        return (
          <li key={item.id} className="card overflow-hidden">
            <Link
              href={`/meme/${item.memeId}?share=${item.id}`}
              className="block"
            >
              <div className="relative aspect-square overflow-hidden">
                {meme ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={meme.imageUrl}
                    alt={meme.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/5 text-muted">
                    找不到梗圖
                  </div>
                )}
                <div
                  className={clsx(
                    "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-semibold text-black shadow-md",
                    rankColors,
                  )}
                >
                  {idx < 3 ? <Trophy className="h-3 w-3" /> : null}
                  #{idx + 1}
                </div>
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium">{meme?.name ?? item.memeId}</p>
                <p className="line-clamp-2 text-xs text-muted">{item.previewText}</p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>@{item.creator}</span>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      {item.shareCount.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {item.likeCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
