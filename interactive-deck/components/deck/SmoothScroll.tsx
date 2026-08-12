"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/useScene";

/**
 * INERTIAL SCROLL
 *
 * Every scene in this deck derives its composition from a scroll ratio, so the
 * scroll wheel is effectively the transport control on a film. A raw wheel event
 * moves that transport in hard 100px steps, and the scrubbed scenes step with
 * it — the machine reads as a slideshow advancing rather than as a system in
 * motion. This puts a spring between the wheel and the page so the same scroll
 * arrives as a glide.
 *
 * NOT a scroll-hijacking library, and deliberately not one:
 *
 *   - it never transforms the page. It moves the REAL scroll position, so
 *     `useScroll`, the hash logic, deep links, find-in-page, the scrollbar and
 *     the browser's own restoration all keep working untouched.
 *   - it only ever intercepts `wheel`. Touch, keyboard, scrollbar dragging and
 *     programmatic scrolls stay completely native, and re-sync this on arrival.
 *   - anything with its own scrollable box — the demo theatre, a ledger — keeps
 *     its native scroll; the wheel is left alone inside it.
 *   - it is off under `prefers-reduced-motion`, off without a fine pointer, and
 *     off while a modal owns the page.
 *
 * The whole thing is one rAF loop and one lerp. If it ever misbehaves, deleting
 * this component restores stock scrolling exactly.
 */

/** Higher is tighter. 0.115 glides without feeling detached from the wheel. */
const EASE = 0.115;
/** Below this, snap: sub-pixel chasing burns frames for nothing. */
const EPSILON = 0.35;
/** `deltaMode: 1` reports lines, not pixels. */
const LINE_HEIGHT = 16;

export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let target = window.scrollY;
    let current = target;
    let raf = 0;
    let running = false;
    let lastFrame = 0;
    /** What we last asked the browser for, so we can tell our own scrolls from
        everybody else's. -1 means "we have not written yet". */
    let written = -1;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    /** The nearest ancestor that scrolls itself, if any. */
    const ownsScroll = (node: EventTarget | null) => {
      let el = node as HTMLElement | null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = getComputedStyle(el);
        if (
          /(auto|scroll)/.test(style.overflowY) &&
          el.scrollHeight > el.clientHeight + 1
        ) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const stop = () => {
      running = false;
      written = -1;
    };

    const tick = (now: number) => {
      /* SOMEBODY ELSE MOVED THE PAGE. A keyboard scroll, a hash jump, a
         `scrollIntoView`, the scrollbar — mid-glide, any of them must win
         outright, or the glide drags the page back out from under them. */
      if (written >= 0 && Math.abs(window.scrollY - written) > 2) {
        target = window.scrollY;
        current = target;
        stop();
        return;
      }

      const dt = lastFrame ? Math.min(64, now - lastFrame) : 16.667;
      lastFrame = now;

      const delta = target - current;
      if (Math.abs(delta) < EPSILON) {
        current = target;
        window.scrollTo(0, current);
        stop();
        return;
      }

      /* Frame-rate independent: the same wheel gesture has to feel identical on
         a 60Hz laptop and a 144Hz monitor. A flat per-frame lerp does not. */
      current += delta * (1 - Math.pow(1 - EASE, dt / 16.667));
      window.scrollTo(0, current);
      // Read back rather than assume: the browser clamps and rounds.
      written = window.scrollY;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastFrame = 0;
      written = -1;
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      // Pinch-zoom, and any surface that scrolls itself, are not ours.
      if (e.ctrlKey || e.defaultPrevented) return;
      // A modal owns the page while it is open.
      if (document.body.style.overflow === "hidden") return;
      if (ownsScroll(e.target)) return;

      e.preventDefault();
      const step = e.deltaMode === 1 ? e.deltaY * LINE_HEIGHT : e.deltaY;
      target = Math.min(maxScroll(), Math.max(0, target + step));
      start();
    };

    /* Anything that scrolls the page without us — keyboard, scrollbar, a hash
       jump, `scrollIntoView` — becomes the new truth the moment we are idle. */
    const onScroll = () => {
      if (running) return;
      target = window.scrollY;
      current = target;
    };

    const onResize = () => {
      target = Math.min(maxScroll(), target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return null;
}
