import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import React from "react";
import { EXPORT_SIZES } from "../src/lib/export-sizes";

// Mock html-to-image so importing ShareCard is safe in node env.
vi.mock("html-to-image", () => ({
  toPng: vi.fn().mockResolvedValue("data:image/png;base64,AAAA"),
}));

import ShareCard, { buildExportPngOptions } from "../src/components/ShareCard";

class MemoryStorage {
  store = new Map<string, string>();
  getItem(k: string) {
    return this.store.has(k) ? (this.store.get(k) as string) : null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

const captureRef: React.RefObject<HTMLElement | null> = { current: null };

const baseProps = {
  memeId: "dora-surprised",
  memeName: "哆啦 A 夢驚訤",
  imageUrl: "https://example.com/dora.jpg",
  previewText: "什麼?!",
  regions: [],
  captureRef,
};

describe("share-card export size", () => {
  beforeEach(() => {
    (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
      localStorage: new MemoryStorage(),
    };
  });

  it("buildExportPngOptions resolves 9:16 to 1080x1920", () => {
    const opts = buildExportPngOptions("9:16");
    expect(opts.width).toBe(EXPORT_SIZES["9:16"].width);
    expect(opts.height).toBe(EXPORT_SIZES["9:16"].height);
    expect(opts.width).toBe(1080);
    expect(opts.height).toBe(1920);
  });

  it("buildExportPngOptions resolves 1:1 to 1080x1080", () => {
    const opts = buildExportPngOptions("1:1");
    expect(opts).toMatchObject({ width: 1080, height: 1080, pixelRatio: 2, cacheBust: true });
  });

  it("buildExportPngOptions resolves 4:5 to 1080x1350", () => {
    const opts = buildExportPngOptions("4:5");
    expect(opts.width).toBe(1080);
    expect(opts.height).toBe(1350);
  });

  it("SSR-rendered ShareCard exposes the active size label", () => {
    const html = renderToString(
      React.createElement(ShareCard, { ...baseProps, size: "9:16" }),
    );
    // size badge in the card header.
    expect(html).toContain("9:16");
    expect(html).toContain("1080");
    expect(html).toContain("1920");
  });

  it("default size is 1:1 when no size prop is provided", () => {
    const html = renderToString(React.createElement(ShareCard, baseProps));
    // React SSR inserts comments between JSX expressions, so the
    // expected dimensions appear as 1080<!-- -->×<!-- -->1080.
    expect(html).toContain("1080");
    expect(html).toContain("×");
    expect(html).toContain("1:1");
  });
});
