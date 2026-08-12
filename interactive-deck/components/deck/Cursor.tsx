"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useScene";

/**
 * THE CURSOR
 *
 * The deck is an instrument, so the pointer is an instrument too: a hard sight
 * that tracks exactly, a ring that trails it under inertia, and a low glow that
 * lags further still — the same three-speed language the scenes already use for
 * value moving through a system.
 *
 * Over anything operable the ring opens, turns signal green and puts four ticks
 * on its axes: the same registration marks the world and the data nodes use. It
 * is a state readout, not decoration — you can see what is clickable before you
 * arrive at it.
 *
 * Strictly opt-in by capability:
 *
 *   - fine pointer + hover only. A phone never sees it, and never pays for it.
 *   - `prefers-reduced-motion` never sees it; the native cursor stays.
 *   - the native cursor is hidden only AFTER this mounts, so a failed script
 *     leaves a pointer on screen rather than nothing.
 *   - it leaves the screen with the mouse, and comes back with it.
 *
 * One rAF loop drives all three layers, and only ever writes `transform` and
 * `opacity`, so nothing here touches layout.
 */

/** Trailing factors — sight, ring, glow. Higher is tighter. */
const LERP = { ring: 0.19, glow: 0.075 };
const INTERACTIVE =
  'a[href], button, [role="button"], input, select, textarea, summary, [data-cursor="target"]';

export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  /* Capability gate. Held until after mount so the server and first client
     render agree, and so `cursor: none` is never applied to a page that has not
     yet produced a replacement. */
  useEffect(() => {
    /* `usePrefersReducedMotion` reports false until after mount, so this must
       actively stand the cursor DOWN when the real preference arrives — an
       early return would leave it running from the first pass. */
    if (reduced) {
      setActive(false);
      return;
    }
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setActive(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduced]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.dataset.cursor = "custom";
    return () => {
      delete document.documentElement.dataset.cursor;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    // Start centred rather than at 0,0: a cursor that flies in from the corner
    // on the first movement is a tell that it is a div.
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let glowX = x;
    let glowY = y;

    let over = 0; // eased 0..1 interactive state
    let overTarget = 0;
    let press = 0;
    let pressTarget = 0;
    let shown = 0;
    let shownTarget = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      shownTarget = 1;
      const el = e.target as Element | null;
      overTarget = el?.closest?.(INTERACTIVE) ? 1 : 0;
    };
    const onDown = () => (pressTarget = 1);
    const onUp = () => (pressTarget = 0);
    const onLeave = () => (shownTarget = 0);
    const onEnter = () => (shownTarget = 1);

    const tick = () => {
      ringX += (x - ringX) * LERP.ring;
      ringY += (y - ringY) * LERP.ring;
      glowX += (x - glowX) * LERP.glow;
      glowY += (y - glowY) * LERP.glow;
      over += (overTarget - over) * 0.18;
      press += (pressTarget - press) * 0.24;
      shown += (shownTarget - shown) * 0.16;

      const ringScale = 1 + over * 0.62 - press * 0.18;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${1 - over * 0.75})`;
      dot.style.opacity = `${shown}`;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.opacity = `${shown * (0.42 + over * 0.58)}`;
      ring.style.borderColor =
        over > 0.04 ? "var(--color-signal)" : "var(--color-hairline-strong)";

      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%) scale(${1 + over * 0.3})`;
      glow.style.opacity = `${shown * (0.5 + over * 0.5)}`;

      // The registration ticks belong to the interactive state alone.
      ring.style.setProperty("--tick", `${Math.max(0, over * 1.4 - 0.4)}`);

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] hidden lg:block">
      {/* the glow — the room light the pointer carries */}
      <span
        ref={glowRef}
        className="absolute left-0 top-0 size-[15rem] rounded-full opacity-0 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(0,224,96,0.11) 0%, rgba(0,224,96,0.045) 38%, transparent 68%)",
        }}
      />

      {/* the ring — trails under inertia, opens over anything operable */}
      <span
        ref={ringRef}
        className="drk-cursor-ring absolute left-0 top-0 size-8 rounded-full border opacity-0 will-change-transform"
        style={{ borderColor: "var(--color-hairline-strong)" }}
      />

      {/* the sight — exact, always */}
      <span
        ref={dotRef}
        className="absolute left-0 top-0 size-[5px] rounded-full opacity-0 will-change-transform"
        style={{
          background: "var(--color-signal)",
          boxShadow: "0 0 10px 0 rgba(0,224,96,0.85)",
        }}
      />
    </div>
  );
}
