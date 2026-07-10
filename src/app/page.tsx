import Link from "next/link";
import { ArrowRight, Flame, ImageIcon, Wand2 } from "lucide-react";
import memesData from "@/data/memes.json";
import rankData from "@/data/rankings.json";
import { mergeAndRank } from "@/lib/rank";
import RankList from "@/components/RankList";
import type { Meme } from "@/types";

export default function HomePage() {
  const memes = memesData as Meme[];
  const memeMap = new Map(memes.map((m) => [m.id, m]));
  const seed = rankData.map((r) => ({
    ...r,
    regions: [],
    createdAt: 0,
  }));
  const ranked = mergeAndRank(seed, [], 10);

  const featuredMemes = memes.slice(0, 6);

  return (
    <div className="space-y-20 py-10 sm:py-16">
      {/* hero */}
      <section className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              <Flame className="h-3.5 w-3.5 text-accent-pink" />
              台灣 LINE / FB 群組神器
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                梗圖製造器
              </span>
              <br />
              <span className="text-ink">三分鐘產出 馬上分享</span>
            </h1>
            <p className="max-w-md text-base text-muted">
              雙模式編輯器:替換既有文字或新增空白對話框。內建 25+ 台灣經典梗圖,
              自動 OCR 偵測位置、可下載 PNG、社群一鍵分享。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/gallery" className="btn-primary">
                <Wand2 className="h-4 w-4" />
                開始製作
              </Link>
              <Link href="/?section=ranking" className="btn-ghost">
                看熱門排行
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                {memes.length} 個內建梗圖
              </span>
              <span>免登入</span>
              <span>手機優先</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {featuredMemes.map((m, idx) => (
              <div
                key={m.id}
                className={`overflow-hidden rounded-xl border border-white/10 ${
                  idx === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ranking */}
      <section id="ranking" className="container-page">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">熱門排行</h2>
            <p className="text-sm text-muted">
              依分享次數 + 按讚數加權排序,前 10 名精選。
            </p>
          </div>
          <Link href="/?section=ranking" className="btn-ghost">
            查看完整
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <RankList items={ranked} memeMap={memeMap} />
      </section>
    </div>
  );
}
