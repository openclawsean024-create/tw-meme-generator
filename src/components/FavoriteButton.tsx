"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import clsx from "clsx";
import {
  isFavorite,
  toggleFavorite,
} from "@/lib/favorites";
import { MOTION_TOKENS } from "@/lib/canvas-geometry";

export interface FavoriteButtonProps {
  memeId: string;
  /** "solid" = always visible button (editor / detail); "overlay" = hover-revealed (gallery card). */
  variant?: "solid" | "overlay";
  className?: string;
}

/**
 * Visible copy-state copy for the toast.  Exported so tests can match the
 * exact wording without duplicating strings.
 */
export const FAVORITE_TOAST_TEXT: Readonly<Record<"added" | "removed", string>> = {
  added: "已加入收藏",
  removed: "已取消收藏",
};

export type FavoriteToastKind = "added" | "removed";

export default function FavoriteButton({
  memeId,
  variant = "solid",
  className,
}: FavoriteButtonProps) {
  const [active, setActive] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<FavoriteToastKind | null>(null);
  const timerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    setHydrated(true);
    setActive(isFavorite(memeId));
  }, [memeId]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const { active: next } = toggleFavorite(memeId);
    setActive(next);
    const kind: FavoriteToastKind = next ? "added" : "removed";
    setToast(kind);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setToast(null),
      MOTION_TOKENS.TOAST_DWELL_MS,
    );
  }

  const baseLabel = active ? "取消收藏" : "加入收藏";
  const toastText = toast ? FAVORITE_TOAST_TEXT[toast] : null;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={`${baseLabel} ${memeId}`}
        title={baseLabel}
        className={clsx(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white shadow transition-colors hover:bg-black/80",
          variant === "overlay" && !hydrated && "opacity-0",
          variant === "overlay" && hydrated && "group-hover:opacity-100 opacity-0",
          active && "text-accent-pink",
          className,
        )}
      >
        <Heart
          className={clsx("h-4 w-4", active && "fill-current")}
          aria-hidden
        />
      </button>

      {/*
        FR-012 toast surface.

        The toast wraps a single always-mounted wrapper so the visual
        visibility is owned by CSS (opacity + transform) instead of by
        framer-motion's mount animation.  That guarantees the toast is
        actually painted the moment React commits — AnimatePresence with a
        keyed motion.div can briefly render at opacity:0 in some hydration
        orders, leaving the toast in the AX tree but invisible.  The motion
        span still adds a tasteful slide+fade entrance/exit when motion is
        allowed and short-circuits to instant under prefers-reduced-motion.
      */}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex justify-center px-4"
      >
        <div
          data-testid="favorite-toast"
          data-state={toast ?? "idle"}
          className={clsx(
            "rounded-md bg-background/95 px-3 py-2 text-xs text-accent-purple shadow-lg ring-1 ring-white/15 transition-all",
            toast
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
          style={{
            transitionDuration: reducedMotion
              ? `${MOTION_TOKENS.REDUCED_MOTION_DURATION_MS}ms`
              : `${MOTION_TOKENS.SHARE_TOAST_MS}ms`,
          }}
        >
          {toastText && (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3" aria-hidden />
              <span>{toastText}</span>
            </span>
          )}
          {/* keep the inner motion span as the only framer-motion child, so the
              parent DOM node stays stable for tests + screen readers. */}
          {!toast && <span className="sr-only">{toastText ?? ""}</span>}
        </div>
      </div>
    </>
  );
}
