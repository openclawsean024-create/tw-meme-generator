/**
 * Favorites / saved memes (v3.0 用戶收藏).
 *
 * localStorage-backed like `storage.ts` — users can star memes they
 * love and we surface them in `/favorites`.  IDs are stored as a
 * set to keep the JSON compact even when the user has 100+ favs.
 */

const STORAGE_KEY = "tw-meme:favorites:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readFavorites(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function writeFavorites(ids: string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isFavorite(memeId: string): boolean {
  return readFavorites().includes(memeId);
}

export function addFavorite(memeId: string): string[] {
  const ids = readFavorites();
  if (!ids.includes(memeId)) {
    ids.push(memeId);
    writeFavorites(ids);
  }
  return ids;
}

export function removeFavorite(memeId: string): string[] {
  const ids = readFavorites().filter((id) => id !== memeId);
  writeFavorites(ids);
  return ids;
}

export function toggleFavorite(memeId: string): { ids: string[]; active: boolean } {
  const active = isFavorite(memeId);
  const ids = active ? removeFavorite(memeId) : addFavorite(memeId);
  return { ids, active: !active };
}

export function clearFavorites(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function countFavorites(): number {
  return readFavorites().length;
}
