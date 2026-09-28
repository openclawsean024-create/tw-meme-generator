/**
 * Brand Kit persistence (FR-005).
 *
 * Stores the currently active BrandKit in localStorage so the editor can
 * restore the user's brand selection across reloads.  Mirrors the same
 * SSR-safe + try/catch patterns as favorites.ts and storage.ts so a
 * malformed or missing entry never breaks the editor.
 *
 * Storage key is the literal `twm:brand-kit` reserved in `PRD/SPEC.md §5.2`.
 * This module does NOT migrate or delete unrelated keys such as
 * `tw-meme:favorites:v1` or any share records.
 */

import { DEFAULT_BRAND_KIT, type BrandKit } from "./brand-kit";

/**
 * localStorage key for the active BrandKit.  Exported so tests can assert
 * the exact documented namespace without duplicating the literal string.
 */
export const BRAND_KIT_STORAGE_KEY = "twm:brand-kit";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readBrandKit(): BrandKit {
  if (!isBrowser()) return DEFAULT_BRAND_KIT;
  try {
    const raw = window.localStorage.getItem(BRAND_KIT_STORAGE_KEY);
    if (!raw) return DEFAULT_BRAND_KIT;
    const parsed = JSON.parse(raw) as Partial<BrandKit> | null;
    if (!parsed || typeof parsed !== "object") return DEFAULT_BRAND_KIT;
    return mergeWithDefault(parsed);
  } catch {
    return DEFAULT_BRAND_KIT;
  }
}

export function writeBrandKit(kit: BrandKit): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(BRAND_KIT_STORAGE_KEY, JSON.stringify(kit));
  } catch {
    /* localStorage may be full or disabled — silently ignore */
  }
}

export function clearBrandKit(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(BRAND_KIT_STORAGE_KEY);
}

/**
 * Merge a partial / persisted BrandKit onto DEFAULT_BRAND_KIT so we always
 * return a fully-populated object the UI can rely on.  Missing nested
 * sub-objects (fonts, colors) are also filled in.
 */
function mergeWithDefault(partial: Partial<BrandKit>): BrandKit {
  return {
    ...DEFAULT_BRAND_KIT,
    ...partial,
    fonts: { ...DEFAULT_BRAND_KIT.fonts, ...(partial.fonts ?? {}) },
    colors: { ...DEFAULT_BRAND_KIT.colors, ...(partial.colors ?? {}) },
  };
}
