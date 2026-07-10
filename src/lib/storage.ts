/**
 * localStorage-based share record storage for the meme generator.
 *
 * Records are keyed by `id` (string). Each record represents one share
 * of a meme with user-applied text regions.
 */

export interface TextRegionRecord {
  id: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold";
}

export interface ShareRecord {
  id: string;
  memeId: string;
  memeName?: string;
  imageUrl?: string;
  shareUrl?: string;
  shareCount: number;
  likeCount: number;
  creator: string;
  previewText: string;
  regions: TextRegionRecord[];
  createdAt: number;
}

const STORAGE_KEY = "tw-meme:shares:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readAllShares(): ShareRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShareRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeAllShares(records: ShareRecord[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addShare(record: ShareRecord): ShareRecord[] {
  const all = readAllShares();
  all.push(record);
  writeAllShares(all);
  return all;
}

export function getShare(id: string): ShareRecord | null {
  return readAllShares().find((r) => r.id === id) ?? null;
}

export function deleteShare(id: string): ShareRecord[] {
  const all = readAllShares().filter((r) => r.id !== id);
  writeAllShares(all);
  return all;
}

export function bumpShareCount(id: string): ShareRecord[] {
  const all = readAllShares().map((r) =>
    r.id === id ? { ...r, shareCount: r.shareCount + 1 } : r,
  );
  writeAllShares(all);
  return all;
}

export function bumpLikeCount(id: string): ShareRecord[] {
  const all = readAllShares().map((r) =>
    r.id === id ? { ...r, likeCount: r.likeCount + 1 } : r,
  );
  writeAllShares(all);
  return all;
}

export function genId(prefix = "s"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function clearAllShares(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
