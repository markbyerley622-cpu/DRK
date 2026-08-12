"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { curtain } from "@/content/drk";
import { usePrefersReducedMotion } from "@/hooks/useScene";
import { cn } from "@/lib/utils";

/**
 * THE OPENING CURTAIN
 *
 * DRK's own two-second title card, over the deck as it loads.
 *
 * It is rendered in the SERVER HTML rather than mounted by an effect, so the
 * first painted frame is already the card — a curtain that appears a moment
 * after the deck has is not a curtain, it is an interruption. First client
 * render is byte-identical to the server's, so nothing re-hydrates under it.
 *
 * And it never traps anybody:
 *
 *   - it leaves by itself when the clip ends
 *   - a click, a tap or any key dismisses it immediately
 *   - a hard 3.2s ceiling dismisses it even if the file never plays at all
 *     (a blocked autoplay policy, a decode failure, a cold network)
 *   - `prefers-reduced-motion` never sees it
 *
 * The deck behind it stays scrollable and stays readable to assistive tech —
 * the curtain is `aria-hidden`, so a screen reader is already in Scene 01 while
 * the card plays.
 */
export function IntroCurtain() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = useCallback(() => setLeaving(true), []);

  useEffect(() => setMounted(true), []);

  /* Reduced motion: no card at all. */
  useEffect(() => {
    if (reduced) setLeaving(true);
  }, [reduced]);

  /* The ceiling. Whatever happens to the file, the deck is never held hostage. */
  useEffect(() => {
    const t = window.setTimeout(dismiss, 3200);
    return () => window.clearTimeout(t);
  }, [dismiss]);

  /* Any key gets past it — including for a keyboard user, who never has to
     find the control. */
  useEffect(() => {
    if (leaving) return;
    const onKey = () => dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leaving, dismiss]);

  /* Unmount only after the fade, so the last frame is not a jump cut. */
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), 460);
    return () => window.clearTimeout(t);
  }, [leaving]);

  /* Autoplay refusal is an expected outcome, not an error — the ceiling covers
     it and the poster-black ground is the card's own background anyway. */
  useEffect(() => {
    if (!mounted || reduced) return;
    void videoRef.current?.play().catch(() => {});
  }, [mounted, reduced]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      /* The hook QA uses to wait the card out before driving the deck. */
      data-drk-curtain=""
      onClick={dismiss}
      className={cn(
        "fixed inset-0 z-[200] grid place-items-center bg-[var(--color-void)] transition-opacity duration-[460ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- silent brand title card, duplicated as text below */}
      <video
        ref={videoRef}
        src={curtain.src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        /* `contain`, not `cover`: the card is 16:9 and a phone is not, and the
           clip's own ground is this exact black, so it letterboxes invisibly. */
        className="h-full w-full object-contain"
      />

      {/*
        THE BOOT READOUT.

        Sits under the mark, on the card's own centre line, and runs for exactly
        as long as the card does. A progress track fills across the full
        sequence while the state line steps through it, so the card reads as
        infrastructure coming up rather than as a splash screen waiting.

        The track is driven by CSS, not by a timer in React: it must not depend
        on the video's readyState, because on a cold connection the video is the
        slow part and a progress bar that stalls is worse than none.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] flex flex-col items-center gap-3 px-6 sm:bottom-[22%]">
        <span
          aria-hidden
          className="block h-px w-[min(13rem,42vw)] overflow-hidden bg-[var(--color-hairline)]"
        >
          <span
            className="drk-boot-fill block h-full w-full origin-left bg-[var(--color-signal)]"
            style={{
              boxShadow: "0 0 10px 0 rgba(0,224,96,0.7)",
              animationPlayState: leaving ? "paused" : "running",
            }}
          />
        </span>

        {/* One line at a time, in place — a stack of four would be a log. */}
        <span className="relative block h-3 w-full text-center">
          {curtain.boot.map((line, i) => (
            <span
              key={line}
              className="drk-boot-line drk-label absolute inset-x-0 text-[0.5rem] tracking-[0.28em] text-[var(--color-faint)]"
              style={{ animationDelay: `${i * 0.52}s` }}
            >
              {line}
            </span>
          ))}
        </span>
      </div>

      <button
        type="button"
        /* Focusable elements must not live inside an aria-hidden subtree, and
           a keyboard user has the whole keyboard instead. */
        tabIndex={-1}
        onClick={dismiss}
        className="drk-label absolute bottom-[clamp(1.25rem,4vh,2.5rem)] right-[clamp(1.25rem,4vw,2.5rem)] inline-flex min-h-[34px] items-center rounded-[999px] border border-[var(--color-hairline-strong)] px-4 text-[0.56rem] text-[var(--color-faint)] transition-colors duration-[220ms] hover:border-[var(--color-hairline-signal)] hover:text-[var(--color-ink)]"
      >
        {curtain.skip}
      </button>
    </div>
  );
}
