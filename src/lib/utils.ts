/**
 * Generate a share URL suitable for the meme detail page.
 */
export function buildShareUrl(memeId: string, shareId: string): string {
  if (typeof window === "undefined") {
    return `/meme/${memeId}?share=${shareId}`;
  }
  const origin = window.location.origin;
  return `${origin}/meme/${memeId}?share=${shareId}`;
}

/**
 * Convenience helpers for facebook / twitter / line share intents.
 * Caller is responsible for opening the URL in a new tab.
 */
export function facebookShareUrl(shareUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
}

export function twitterShareUrl(shareUrl: string, text: string): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
}

export function lineShareUrl(shareUrl: string, text: string): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
}
