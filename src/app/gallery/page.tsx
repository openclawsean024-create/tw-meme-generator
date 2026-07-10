import Link from "next/link";
import { PenLine, PlusCircle } from "lucide-react";
import memesData from "@/data/memes.json";
import type { Meme } from "@/types";

export const metadata = {
  title: "梗圖圖庫 | TW Meme Generator",
};

export default function GalleryPage() {
  const withText = (memesData as Meme[]).filter((m) => m.type === "with_text");
  const withoutText = (memesData as Meme[]).filter((m) => m.type === "without_text");

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">梗圖圖庫</h1>
        <p className="mt-2 text-sm text-muted">
          點選任一梗圖,選擇「替換文字」或「新增對話框」模式開始編輯。
        </p>
      </div>

      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <PenLine className="h-4 w-4 text-accent-purple" />
          <h2 className="text-lg font-medium">已有文字的梗圖</h2>
          <span className="text-xs text-muted">{withText.length} 個</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {withText.map((meme) => (
            <MemeCard key={meme.id} meme={meme} mode="replace" />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-accent-pink" />
          <h2 className="text-lg font-medium">空白模板</h2>
          <span className="text-xs text-muted">{withoutText.length} 個</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {withoutText.map((meme) => (
            <MemeCard key={meme.id} meme={meme} mode="add" />
          ))}
        </div>
      </section>
    </div>
  );
}

function MemeCard({ meme, mode }: { meme: Meme; mode: "replace" | "add" }) {
  return (
    <Link
      href={`/editor/${meme.id}?mode=${mode}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-white/30 hover:shadow-glow"
    >
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meme.imageUrl}
          alt={meme.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase backdrop-blur">
          {mode === "replace" ? "替換" : "新增"}
        </span>
      </div>
      <div className="p-2 text-center">
        <p className="truncate text-sm">{meme.name}</p>
      </div>
    </Link>
  );
}
