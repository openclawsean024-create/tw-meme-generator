"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ImageIcon } from "lucide-react";
import memesData from "@/data/memes.json";
import type { Meme } from "@/types";
import { readFavorites } from "@/lib/favorites";

interface FavoriteEntry {
  meme: Meme | null;
  memeId: string;
}

export default function FavoritesClient() {
  const [entries, setEntries] = useState<FavoriteEntry[] | null>(null);

  useEffect(() => {
    const ids = readFavorites();
    const map = new Map((memesData as Meme[]).map((m) => [m.id, m]));
    setEntries(ids.map((id) => ({ memeId: id, meme: map.get(id) ?? null })));
  }, []);

  if (entries === null) {
    return (
      <div className="container-page py-10">
        <p className="text-sm text-muted">載入中…</p>
      </div>
    );
  }

  return (
    <div className="container-page space-y-6 py-10 sm:py-14">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-accent-pink" aria-hidden />
        <h1 className="text-2xl font-semibold sm:text-3xl">我的收藏</h1>
        <span className="ml-2 text-xs text-muted">{entries.length} 個</span>
      </div>

      {entries.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center text-muted">
          <ImageIcon className="h-8 w-8" aria-hidden />
          <p>還沒有收藏任何梗圖</p>
          <Link href="/gallery" className="btn-primary text-sm">
            去圖庫逛逛
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {entries.map((entry) => (
            <li key={entry.memeId}>
              {entry.meme ? (
                <Link
                  href={`/editor/${entry.meme.id}?mode=${entry.meme.type === "with_text" ? "replace" : "add"}`}
                  className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-white/30 hover:shadow-glow"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.meme.imageUrl}
                      alt={entry.meme.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="truncate text-sm">{entry.meme.name}</p>
                  </div>
                </Link>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-xs text-muted">
                  找不到對應模板
                  <p className="mt-1 break-all">{entry.memeId}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
