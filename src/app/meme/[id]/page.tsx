import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Heart, Share2 } from "lucide-react";
import memesData from "@/data/memes.json";
import rankData from "@/data/rankings.json";
import type { Meme } from "@/types";
import MemeDetailClient from "./MemeDetailClient";

interface Params {
  params: { id: string };
  searchParams: { share?: string };
}

export const dynamic = "force-dynamic";

export default function MemeDetailPage({ params, searchParams }: Params) {
  const meme = (memesData as Meme[]).find((m) => m.id === params.id);
  if (!meme) notFound();

  const seed = rankData
    .filter((r) => r.memeId === params.id)
    .map((r) => ({
      ...r,
      regions: [],
      memeName: meme.name,
      shareUrl: "",
      createdAt: 0,
    }));

  return (
    <div className="container-page py-6 sm:py-10">
      <Link href="/gallery" className="btn-ghost mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" />
        回圖庫
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{meme.name}</h1>
        <p className="mt-2 text-sm text-muted">
          這個梗圖所有使用者創作的版本都在這裡。點擊任一張可看大圖。
        </p>
      </div>
      <MemeDetailClient meme={meme} seed={seed} highlightShareId={searchParams.share} />
    </div>
  );
}

export async function generateStaticParams() {
  return (memesData as Meme[]).map((m) => ({ id: m.id }));
}
