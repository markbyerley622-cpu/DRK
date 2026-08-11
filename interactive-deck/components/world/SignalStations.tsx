"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useWorld } from "@/hooks/useWorld";
import { signalYAt } from "@/lib/world";
import { cn } from "@/lib/utils";

/**
 * Objects that STAND ON the world's liquidity signal.
 *
 * This is the strongest expression of the persistent-machine idea available:
 * the DRK objects are not drawn beside a decorative line, they are registered
 * against the one global signal, and when that signal morphs at a scene
 * boundary they ride with it.
 *
 * Only usable inside a pinned (`position: sticky; height: 100vh`) stage, where
 * the container box is exactly the viewport and viewport percentages therefore
 * agree with the world layer's coordinate space. On mobile, where nothing pins,
 * scenes render their own stacked recomposition instead.
 */

export interface Station {
  key: string;
  /** Viewport x, in percent. Keep below 78 so nothing reaches the nav rail. */
  x: number;
  render: (state: { on: number; connected: boolean }) => ReactNode;
}

export function SignalStations({
  stations,
  progress,
  appear,
  className,
}: {
  stations: Station[];
  /** Scene progress 0..1, used for per-station arrival. */
  progress: number;
  /** [start, step] arrival windows for the stations, in scene progress. */
  appear: [number, number];
  className?: string;
}) {
  const { subscribe } = useWorld();
  const box = useRef<HTMLDivElement>(null);

  /*
   * Positions are written as custom properties from the frame loop, so the
   * objects track the morphing signal without re-rendering React each frame.
   */
  useEffect(
    () =>
      subscribe(({ t }) => {
        const el = box.current;
        if (!el) return;
        for (let i = 0; i < stations.length; i++) {
          el.style.setProperty(`--sy-${i}`, `${signalYAt(t, stations[i].x).toFixed(2)}%`);
        }
      }),
    [subscribe, stations],
  );

  const [start, step] = appear;

  return (
    <div ref={box} aria-hidden className={cn("absolute inset-0", className)}>
      {stations.map((s, i) => {
        const from = start + i * step;
        const on = Math.max(0, Math.min(1, (progress - from) / 0.1));
        const connected = on > 0.85;
        return (
          <div
            key={s.key}
            className="absolute -translate-x-1/2"
            style={{
              left: `${s.x}%`,
              top: `var(--sy-${i}, 70%)`,
              // The object's base sits ON the line, not floating above it.
              transform: "translate(-50%, -100%)",
            }}
          >
            {s.render({ on, connected })}
          </div>
        );
      })}
    </div>
  );
}

/** The bead where a station meets the signal. */
export function StationNode({ connected }: { connected: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute -bottom-[4px] left-1/2 size-2 -translate-x-1/2 rounded-full transition-all duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
      style={{
        background: connected ? "var(--color-signal)" : "#1b2429",
        boxShadow: connected ? "0 0 14px 1px rgba(0,224,96,0.8)" : "none",
      }}
    />
  );
}
