import { redirect, notFound } from "next/navigation";
import memesData from "@/data/memes.json";
import type { Meme } from "@/types";
import EditorClient from "./EditorClient";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: "replace" | "add"; restore?: string }>;
}

export default async function EditorPage({ params, searchParams }: Params) {
  const { id } = await params;
  const sp = await searchParams;
  const meme = (memesData as Meme[]).find((m) => m.id === id);
  if (!meme) notFound();

  // `?restore=<shareId>` defaults to replace-mode so users reopen a saved
  // version on top of the meme's default text regions.
  const defaultMode: "replace" | "add" =
    meme.type === "with_text" ? "replace" : "add";
  const requestedMode = sp.mode;
  const mode: "replace" | "add" = (() => {
    if (requestedMode === "add") return "add";
    if (requestedMode === "replace") return "replace";
    return sp.restore ? "replace" : defaultMode;
  })();
  if (!requestedMode) {
    const next = new URLSearchParams();
    next.set("mode", mode);
    if (sp.restore) next.set("restore", sp.restore);
    redirect(`/editor/${id}?${next.toString()}`);
  }

  return (
    <EditorClient
      meme={meme}
      mode={mode}
      restoreShareId={sp.restore}
    />
  );
}

export async function generateStaticParams() {
  return (memesData as Meme[]).map((m) => ({ id: m.id }));
}
