import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "台灣梗圖製造器 | TW Meme Generator",
  description:
    "快速製作台灣在地梗圖:替換文字、新增對話框、即時分享。免登入、可下載 PNG、手機優先設計。",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-ink`}
      >
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur">
            <div className="container-page flex h-14 items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-ink hover:opacity-90 transition-opacity"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-brand text-white shadow-glow">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <span className="font-semibold tracking-tight">
                  TW Meme Generator
                </span>
              </Link>
              <nav className="flex items-center gap-1 text-sm">
                <Link href="/gallery" className="btn-ghost">圖庫</Link>
                <Link href="/?section=ranking" className="btn-ghost">排行</Link>
                <Link href="/gallery" className="btn-primary text-sm py-1.5 px-3">
                  開始製作
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 pb-16">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center text-xs text-muted">
            <div className="container-page">
              台灣梗圖製造器 MVP — 純前端 (Next.js 14 · Tesseract.js · html-to-image)
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
