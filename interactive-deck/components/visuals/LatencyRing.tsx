"use client";

import { cn } from "@/lib/utils";

/**
 * DRK object 01 — LATENCY RING.
 *
 * The only named brand object with no usable still in the deck, and the one that
 * must *do* something: it reads out progress.
 *
 * ART DIRECTION. This was previously a machined chrome torus with a metallic
 * gradient sweep (`#5c666c → #c9d2d6 → #39434a`) and a radial green core. At
 * 200–240px, in four scenes, that read as a decorative dial — a rendered object
 * pasted into a layout. The real DRK application contains nothing like it:
 * its instruments are flat, thin and precise.
 *
 * So this is now a measuring instrument rather than a machined part: one
 * hairline bezel, a graduated tick ring that lights as it fills, one thin arc.
 * No chrome, no glow, no bloom. Geometry and graduation still follow object 01
 * on `asset 2.jpg`; only the material was wrong.
 */
export function LatencyRing({
  progress = 0,
  size = 120,
  segments = 60,
  className,
  label,
  active = true,
  /** Lower for a quieter presence behind a hero object. */
  intensity = 1,
}: {
  intensity?: number;
  progress?: number;
  size?: number;
  segments?: number;
  className?: string;
  label?: string;
  active?: boolean;
}) {
  const c = 100;
  const rBezel = 92;
  const rTick = 82;
  const rArc = 71;
  const circ = 2 * Math.PI * rArc;
  const p = Math.max(0, Math.min(1, progress));

  return (
    /*
     * The wrapper sizes to the SVG, it does not impose a size on it. Callers
     * scale the ring responsively with a `[&>svg]:size-[clamp(...)]` class; when
     * the wrapper kept `size` as a fixed box, the shrunk SVG sat in its top-left
     * corner — so the ring drifted off the object it was meant to surround, and
     * any `inset-0` overlay landed on the arc instead of inside it.
     */
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden focusable="false">
        {/* bezel — one hairline, no material */}
        <circle cx={c} cy={c} r={rBezel} fill="none" stroke="#242b23" strokeWidth="1" />
        <circle cx={c} cy={c} r={rBezel - 5} fill="none" stroke="#161b15" strokeWidth="1" />

        {/* graduation. Minute ticks all round; major ticks every fifth. */}
        <g opacity={(active ? 1 : 0.45) * intensity}>
          {Array.from({ length: segments }).map((_, i) => {
            const a = (i / segments) * Math.PI * 2 - Math.PI / 2;
            const lit = i / segments <= p;
            const major = i % 5 === 0;
            const len = major ? 9 : 5;
            const r1 = rTick - len / 2;
            const r2 = rTick + len / 2;
            // Rounded: Math.cos/sin precision is implementation-defined, so Node
            // and Chromium can differ in the last bits and desync hydration.
            const q = (n: number) => Math.round(n * 1000) / 1000;
            return (
              <line
                key={i}
                x1={q(c + Math.cos(a) * r1)}
                y1={q(c + Math.sin(a) * r1)}
                x2={q(c + Math.cos(a) * r2)}
                y2={q(c + Math.sin(a) * r2)}
                stroke={lit ? "var(--color-signal)" : major ? "#2b332a" : "#1d231c"}
                strokeWidth="1"
                opacity={lit ? (major ? 0.9 : 0.55) : 1}
              />
            );
          })}
        </g>

        {/* the reading */}
        <circle cx={c} cy={c} r={rArc} fill="none" stroke="#161b15" strokeWidth="1.5" />
        <circle
          cx={c}
          cy={c}
          r={rArc}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.5"
          strokeLinecap="butt"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - p)}
          transform={`rotate(-90 ${c} ${c})`}
          opacity={(active ? 0.85 : 0.3) * intensity}
          style={{ transition: "stroke-dashoffset 260ms cubic-bezier(0.2,0.7,0.3,1)" }}
        />
      </svg>

      {label && (
        <span className="drk-label absolute inset-0 flex items-center justify-center text-center text-[var(--color-signal)]">
          {label}
        </span>
      )}
    </div>
  );
}
