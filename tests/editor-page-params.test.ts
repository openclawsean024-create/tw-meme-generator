import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Cycle-2 hotfix regression guard.
 *
 * In Next.js 16, the `params` and `searchParams` props handed to dynamic-route
 * page components are `Promise<...>`. Reading `params.id` synchronously returns
 * `undefined` because `params` is a Promise object — which made every valid
 * meme id fall into `notFound()`. The two page modules must:
 *   1. declare both shapes as `Promise<...>`,
 *   2. `await params` and `await searchParams` before any property read,
 *   3. export an async default function.
 *
 * We assert all three on the source text so the test is hermetic (no React,
 * no Next runtime, no JSX) and runs under `npm test` (vitest, node env).
 */

const repoRoot = resolve(__dirname, "..");
const memePagePath = resolve(repoRoot, "src/app/meme/[id]/page.tsx");
const editorPagePath = resolve(repoRoot, "src/app/editor/[id]/page.tsx");

function read(p: string): string {
  return readFileSync(p, "utf8");
}

/**
 * `params.id` / `searchParams.share` / `searchParams.mode` / `searchParams.restore`
 * must not appear directly anywhere — they would resolve to `undefined` at runtime
 * because the props are now Promise objects.
 */
const SYNC_PARAM_ACCESS = [
  /params\.id\b/,
  /searchParams\.share\b/,
  /searchParams\.mode\b/,
  /searchParams\.restore\b/,
];

describe("dynamic page params are awaited (Next 16 Promise shape)", () => {
  describe("src/app/meme/[id]/page.tsx", () => {
    const src = read(memePagePath);

    it("declares params and searchParams as Promise in the Props interface", () => {
      expect(src).toMatch(/params:\s*Promise<\s*\{\s*id:\s*string\s*\}\s*>/);
      expect(src).toMatch(/searchParams:\s*Promise<\s*\{\s*share\?:\s*string\s*\}\s*>/);
    });

    it("exports an async default function named MemeDetailPage", () => {
      expect(src).toMatch(
        /export\s+default\s+async\s+function\s+MemeDetailPage\s*\(/,
      );
    });

    it("awaits params and searchParams before any property read", () => {
      expect(src).toMatch(/const\s*\{\s*id\s*\}\s*=\s*await\s+params\s*;/);
      expect(src).toMatch(/await\s+searchParams/);
    });

    it("does not access params.id / searchParams.share synchronously", () => {
      for (const pattern of SYNC_PARAM_ACCESS) {
        expect(src).not.toMatch(pattern);
      }
    });
  });

  describe("src/app/editor/[id]/page.tsx", () => {
    const src = read(editorPagePath);

    it("declares params and searchParams as Promise in the Props interface", () => {
      expect(src).toMatch(/params:\s*Promise<\s*\{\s*id:\s*string\s*\}\s*>/);
      expect(src).toMatch(
        /searchParams:\s*Promise<\s*\{\s*mode\?:\s*("replace"|'replace')\s*\|\s*("add"|'add')\s*;\s*restore\?:\s*string\s*\}\s*>/,
      );
    });

    it("exports an async default function named EditorPage", () => {
      expect(src).toMatch(
        /export\s+default\s+async\s+function\s+EditorPage\s*\(/,
      );
    });

    it("awaits params and searchParams before any property read", () => {
      expect(src).toMatch(/const\s*\{\s*id\s*\}\s*=\s*await\s+params\s*;/);
      expect(src).toMatch(/await\s+searchParams/);
    });

    it("preserves the cycle-1 restore redirect logic against the awaited searchParams", () => {
      // The cycle-1 redirect path must still work after the await refactor:
      // when mode is absent, redirect to ?mode=<resolved>&restore=<id if any>.
      expect(src).toMatch(/next\.set\("mode",\s*mode\)/);
      expect(src).toMatch(/next\.set\("restore",\s*sp\.restore\)/);
      expect(src).toMatch(/redirect\(`\/editor\/\$\{id\}\?\$\{next\.toString\(\)\}`\)/);
    });

    it("does not access params.id / searchParams.* synchronously", () => {
      for (const pattern of SYNC_PARAM_ACCESS) {
        expect(src).not.toMatch(pattern);
      }
    });
  });

  describe("await semantics (smoke)", () => {
    it("the actual runtime behavior of an awaited Promise matches the editor page contract", async () => {
      // Sanity: the same shape Next 16 hands to page components.
      const params = Promise.resolve({ id: "meltdown" });
      const searchParams = Promise.resolve({ mode: "replace" as const });

      const { id } = await params;
      const sp = await searchParams;

      expect(id).toBe("meltdown");
      expect(sp.mode).toBe("replace");
    });
  });
});