"use client";

import { useEffect, useRef } from "react";
import { useWorld, useWorldMotionAllowed } from "@/hooks/useWorld";
import { ambientAt, signalIntensityAt, signalPathAt } from "@/lib/world";

/**
 * THE PERSISTENT DRK WORLD
 * ============================================================================
 * A single fixed layer beneath the entire document. It is the reason the
 * experience reads as one machine rather than fourteen sections:
 *
 *   - ONE engineering ground. The grid does not restart at a section boundary;
 *     it is the same floor the whole way down.
 *   - ONE light. It travels with the narrative instead of fourteen independent
 *     green washes switching on and off.
 *   - ONE liquidity signal. Its shape morphs continuously with scroll — the
 *     line that comes online in Scene 01 is the same line that is swallowed by
 *     the vault, drives the engine, holds through a falling market, curls into
 *     the compounding loop, receives the raise, and resolves at the close.
 *
 * PERFORMANCE
 * The frame loop writes directly to DOM attributes and never triggers a React
 * render. Per frame this costs one 9-point interpolation, one path build, and
 * a handful of attribute writes — no reconciliation, no layout, no paint beyond
 * the stroke itself. Compositing is left to `transform`/`opacity` only.
 */
export function DrkWorld() {
  const { subscribe } = useWorld();
  const motion = useWorldMotionAllowed();

  const core = useRef<SVGPathElement>(null);
  const bed = useRef<SVGPathElement>(null);
  const bloom = useRef<SVGPathElement>(null);
  const env = useRef<SVGPathElement>(null);
  const highlight = useRef<SVGPathElement>(null);
  const channel = useRef<SVGGElement>(null);
  const pulse = useRef<SVGPathElement>(null);
  const signalGroup = useRef<SVGGElement>(null);
  const light = useRef<HTMLDivElement>(null);

  /* ---------------- scroll-derived shape ---------------- */
  useEffect(
    () =>
      subscribe(({ t }) => {
        const d = signalPathAt(t);
        bed.current?.setAttribute("d", d);
        core.current?.setAttribute("d", d);
        bloom.current?.setAttribute("d", d);
        env.current?.setAttribute("d", d);
        highlight.current?.setAttribute("d", d);
        pulse.current?.setAttribute("d", d);

        const i = signalIntensityAt(t);
        signalGroup.current?.setAttribute("opacity", i.toFixed(3));
        // The channel is always present — infrastructure exists before the
        // liquidity arrives — but it fades with the signal so that in a
        // quiet scene it never reads as a stray bar across the frame.
        channel.current?.setAttribute("opacity", (0.14 + i * 0.86).toFixed(3));

        const a = ambientAt(t);
        if (light.current) {
          light.current.style.setProperty("--lx", `${a.x.toFixed(2)}%`);
          light.current.style.setProperty("--ly", `${a.y.toFixed(2)}%`);
          light.current.style.opacity = a.i.toFixed(3);
        }
      }),
    [subscribe],
  );

  /* ---------------- the travelling emission ---------------- */
  /*
   * Green that TRAVELS rather than glows. One short dash runs the length of the
   * signal on a slow, even cadence — the only continuously-moving element in
   * the entire experience, and it is doing informational work: it shows the
   * system is live. Suppressed entirely under reduced motion.
   */
  useEffect(() => {
    const el = pulse.current;
    if (!el || !motion) return;
    let raf = 0;
    let start = 0;
    let visible = true;

    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible && !raf) raf = requestAnimationFrame(step);
    };

    const step = (ts: number) => {
      raf = 0;
      if (!start) start = ts;
      // 13s traverse. Unhurried to the point of being easy to miss —
      // in the real product nothing pulses at all, so this is close to the
      // quietest thing that still says the system is live.
      const cycle = ((ts - start) / 13000) % 1;
      el.setAttribute("stroke-dashoffset", String((1 - cycle) * 1.32 - 0.16));
      if (visible) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [motion]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-drk-world=""
    >
      {/* ---------- the ground: one continuous engineered floor ---------- */}
      <div className="absolute inset-0 bg-[var(--color-base)]" />
      <div className="drk-world-grid absolute inset-0" />

      {/* ---------- the single travelling light ---------- */}
      <div
        ref={light}
        className="absolute inset-0"
        style={
          {
            "--lx": "68%",
            "--ly": "58%",
            background:
              "radial-gradient(46rem 34rem at var(--lx) var(--ly), rgba(0,224,96,0.075) 0%, rgba(0,224,96,0.022) 38%, rgba(0,224,96,0) 68%)",
          } as React.CSSProperties
        }
      />

      {/* ---------- depth: the room falls away at the edges ---------- */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(128% 96% at 50% 46%, transparent 42%, rgba(0,0,0,0.62) 78%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* ---------- the liquidity signal ---------- */}
      {/*
        On a phone the composition is a vertical stack rather than a pinned
        stage, so a full-bleed diagonal crossing the content is noise, not
        continuity. The signal stays present — it is still the same machine —
        but it drops back to an undertone.
      */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-30 lg:opacity-100"
        focusable="false"
      >
        <defs>
          <linearGradient id="drk-signal-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0" />
            <stop offset="9%" stopColor="var(--color-signal)" stopOpacity="1" />
            <stop offset="88%" stopColor="var(--color-signal)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/*
          The machined channel the signal runs in. Present whether or not the
          signal is bright — the infrastructure exists before the liquidity
          arrives, which is the whole DRK argument.
        */}
        <g ref={channel} opacity="1">
        <path
          ref={bed}
          fill="none"
          stroke="#080d10"
          strokeWidth="9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* chrome catching the room light along the upper lip of the channel */}
        <path
          ref={highlight}
          fill="none"
          stroke="rgba(214,228,232,0.055)"
          strokeWidth="7"
          strokeLinecap="round"
          transform="translate(0,-0.28)"
          vectorEffect="non-scaling-stroke"
        />
        </g>

        <g ref={signalGroup} opacity="1">
          {/*
            THREE LAYERS, not one stroke.
              ENVIRONMENT  an almost invisible reflected influence — the room
                           knows the signal is there before it can see it
              BODY         a soft falloff that gives the line volume
              CORE         the thin, exact reading

            A single bright stroke is what made this read as "a green SVG line".
            Liquidity has body.
          */}
          <path
            ref={env}
            fill="none"
            stroke="url(#drk-signal-fade)"
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.035"
            style={{ filter: "blur(22px)" }}
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={bloom}
            fill="none"
            stroke="url(#drk-signal-fade)"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.085"
            style={{ filter: "blur(6px)" }}
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={core}
            fill="none"
            stroke="url(#drk-signal-fade)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
          {motion && (
            <path
              ref={pulse}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1.8"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.03 1.29"
              strokeDashoffset="1"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
