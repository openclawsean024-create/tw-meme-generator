"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import clsx from "clsx";
import type { Meme } from "@/types";
import { type ShareRecord, readAllShares, bumpShareCount, bumpLikeCount } from "@/lib/storage";

interface MemeDetailClientProps {
  meme: Meme;
  seed: ShareRecord[];
  highlightShareId?: string;
}

export default function MemeDetailClient({
  meme,
  seed,
  highlightShareId,
}: MemeDetailClientProps) {
  const [userVersions, setUserVersions] = useState<ShareRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const all = readAllShares().filter((s) => s.memeId === meme.id);
    setUserVersions(all);
  }, [meme.id]);

  const all = [...seed, ...userVersions].sort((a, b) => b.shareCount - a.shareCount);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {seed.map((s, i) => (
          <VersionCard key={`seed-${i}`} meme={meme} record={s} highlighted={false} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        共 {all.length} 個版本。seed 資料由後台預載,你的版本會在 localStorage 中保留。
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((s) => (
          <VersionCard
            key={s.id}
            meme={meme}
            record={s}
            highlighted={highlightShareId === s.id}
          />
        ))}
        {all.length === 0 && (
          <div className="col-span-full rounded-xl border border-white/10 bg-white/[0.02] p-10 text-center text-muted">
            還沒有人分享這個梗圖的版本。
            <div className="mt-4">
              <Link href={`/editor/${meme.id}?mode=${meme.type === "with_text" ? "replace" : "add"}`} className="btn-primary text-sm">
                製作第一個版本
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VersionCard({
  meme,
  record,
  highlighted,
}: {
  meme: Meme;
  record: ShareRecord;
  highlighted: boolean;
}) {
  return (
    <article
      className={clsx(
        "card overflow-hidden",
        highlighted && "ring-2 ring-accent-pink shadow-glow",
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={meme.imageUrl} alt={meme.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          {record.regions?.length
            ? record.regions.map((r) => (
                <div
                  key={r.id}
                  className="self-center rounded px-2 text-center text-white"
                  style={{
                    transform: `translate(${r.x / 6}px, ${r.y / 6}px)`,
                    fontSize: `${(r.fontSize ?? 28) / 6}px`,
                    color: r.color || "#ffffff",
                    fontWeight: r.fontWeight || "bold",
                    textShadow:
                      (r.fontWeight || "bold") === "bold"
                        ? "2px 2px 0 #000, -2px -2px 0 #000"
                        : "1px 1px 0 #000",
                    maxWidth: `${r.w / 6}px`,
                    marginTop: `${r.y / 12}px`,
                  }}
                >
                  {r.text}
                </div>
              ))
            : (
              <div className="self-end rounded bg-black/60 px-2 py-1 text-xs text-white">
                {record.previewText}
              </div>
            )}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <p className="text-xs text-muted">@{record.creator}</p>
        <p className="line-clamp-2 text-sm">{record.previewText}</p>
        <div className="flex items-center justify-between text-xs text-muted">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-ink"
            onClick={() => bumpShareCount(record.id)}
          >
            <Share2 className="h-3 w-3" />
            {record.shareCount.toLocaleString()}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-ink"
            onClick={() => bumpLikeCount(record.id)}
          >
            <Heart className="h-3 w-3" />
            {record.likeCount.toLocaleString()}
          </button>
        </div>
      </div>
    </article>
  );
}
