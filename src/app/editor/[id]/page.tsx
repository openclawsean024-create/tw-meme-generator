import { redirect, notFound } from "next/navigation";
import memesData from "@/data/memes.json";
import type { Meme } from "@/types";
import EditorClient from "./EditorClient";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
  searchParams: { mode?: "replace" | "add" };
}

export default function EditorPage({ params, searchParams }: Params) {
  const meme = (memesData as Meme[]).find((m) => m.id === params.id);
  if (!meme) notFound();

  const mode: "replace" | "add" = searchParams.mode === "add" ? "add" : "replace";
  if (!searchParams.mode) {
    redirect(`/editor/${params.id}?mode=${meme.type === "with_text" ? "replace" : "add"}`);
  }

  return <EditorClient meme={meme} mode={mode} />;
}

export async function generateStaticParams() {
  return (memesData as Meme[]).map((m) => ({ id: m.id }));
}
