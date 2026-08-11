"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn, clamp01, smoothPath } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useScene";

/**
 * Chart primitives — plain SVG, no library.
 *
 * COLOUR DISCIPLINE. Green is a signal, never a fill. A chart is drawn in
 * graphite; green marks the ONE thing the reader is meant to look at — the
 * series line, the active segment, the current bar. Solid green areas, solid
 * green rings and solid green bar fields are prohibited: at any real size they
 * turn the surface into a generic crypto dashboard.
 *
 * SCRUB SAFETY. Every series draws from a 0..1 `progress`, so any scroll
 * position renders a valid frame. Values are also rendered as text nearby, so
 * nothing depends on reading a shape, and every chart takes an accessible name.
 */

/* -------------------------------------------------------------------------- */
/* MORPHING                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Tween element-wise between series so a chart CHANGES rather than being
 * replaced. Spatial continuity is the point: the reader's eye should follow one
 * shape deforming, not lose its place while a new chart fades in.
 */
export function useMorphSeries(target: readonly number[], ms = 520): number[] {
  const reduced = usePrefersReducedMotion();
  const [values, setValues] = useState<number[]>(() => [...target]);
  const from = useRef<number[]>([...target]);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setValues([...target]);
      return;
    }
    // Length changes cannot be interpolated meaningfully — snap instead.
    if (from.current.length !== target.length) {
      from.current = [...target];
      setValues([...target]);
      return;
    }
    const start = performance.now();
    const a = from.current;
    const b = [...target];

    const step = (now: number) => {
      const t = clamp01((now - start) / ms);
      // easeOutQuint: fast commit, long settle. No overshoot on data.
      const e = 1 - Math.pow(1 - t, 5);
      const next = a.map((v, i) => v + (b[i] - v) * e);
      setValues(next);
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        from.current = b;
      }
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms, reduced]);

  return values;
}

/* -------------------------------------------------------------------------- */
/* LINE / AREA SERIES                                                          */
/* -------------------------------------------------------------------------- */

export function LineSeries({
  values,
  progress = 1,
  className,
  label,
  height = 110,
  area = true,
  tone = "signal",
  showHead = true,
  grid = true,
  axis,
  fill = false,
}: {
  values: readonly number[];
  progress?: number;
  className?: string;
  label: string;
  /** Number of px, or any CSS length — pass "100%" to fill a flex parent. */
  height?: number | string;
  area?: boolean;
  tone?: "signal" | "muted";
  showHead?: boolean;
  grid?: boolean;
  /** Optional x-axis ticks rendered under the plot. */
  axis?: readonly string[];
  /**
   * Grow to fill a flex parent instead of holding `height`.
   *
   * Off by default and deliberately opt-in: a chart that grows implicitly gets
   * stretched by any `align-items: stretch` ancestor, which is how a 44px
   * sparkline became a 230px one and a 140px candle plot became 515px.
   */
  fill?: boolean;
}) {
  const id = useId();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts: Array<[number, number]> = values.map((v, i) => [
    (i / (values.length - 1)) * 100,
    94 - ((v - min) / span) * 84,
  ]);
  const d = smoothPath(pts, 0.5);
  const p = clamp01(progress);
  const stroke = tone === "signal" ? "var(--color-signal)" : "var(--color-faint)";
  const cid = id.replace(/:/g, "");

  return (
    <div className={cn("w-full", fill && "flex min-h-0 flex-col", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn("w-full", fill && "min-h-0 flex-1")}
        style={{ height: fill ? undefined : height }}
        role="img"
        aria-label={label}
      >
        <defs>
          {/* A whisper of fill, not a green wash. */}
          <linearGradient id={`ln-${cid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.16" />
            <stop offset="70%" stopColor="var(--color-signal)" stopOpacity="0.015" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
          </linearGradient>
          {/*
            The reveal is a clip, not stroke-dashoffset. Under
            preserveAspectRatio="none" the normalised dash length is not
            reliably honoured, which shears the line into disconnected segments.
          */}
          <clipPath id={`clip-${cid}`}>
            <rect x="-2" y="-30" width={p * 104} height="170" />
          </clipPath>
        </defs>

        {/* Plot-area rules: keep the chart legible AS a chart while it is still
            only partly drawn, instead of reading as empty space. */}
        {grid &&
          [10, 31.5, 53, 74.5, 94].map((gy) => (
            <line
              key={gy}
              x1="0"
              y1={gy}
              x2="100"
              y2={gy}
              stroke="var(--color-hairline)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={gy === 94 ? 1 : 0.55}
            />
          ))}

        <g clipPath={`url(#clip-${cid})`}>
          {area && <path d={`${d} L 100 100 L 0 100 Z`} fill={`url(#ln-${cid})`} />}
          <path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Leading edge. A vertical rule rather than a dot: a circle would be
            stretched into an ellipse by the non-uniform viewBox scaling. */}
        {showHead && p > 0.02 && p < 0.995 && (
          <line
            x1={p * 100}
            y1="0"
            x2={p * 100}
            y2="100"
            stroke="var(--color-signal)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.45"
          />
        )}
      </svg>

      {axis && axis.length > 0 && (
        <div
          aria-hidden
          className="mt-1.5 flex justify-between border-t border-[var(--color-hairline)] pt-1.5"
        >
          {axis.map((a) => (
            <span key={a} className="drk-label text-[0.6rem] tracking-[0.14em]">
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* BAR SERIES                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Graphite bars; only the tallest carries the signal. A field of solid green
 * bars is the single fastest way to make an institutional surface look like a
 * memecoin dashboard.
 */
export function BarSeries({
  values,
  progress = 1,
  className,
  label,
  height = 96,
  highlight,
}: {
  values: readonly number[];
  progress?: number;
  className?: string;
  label: string;
  height?: number;
  /** Index to mark in signal green. Defaults to the maximum. */
  highlight?: number;
}) {
  const max = Math.max(...values, 1);
  const gap = 100 / (values.length * 2.1);
  const w = (100 - gap * (values.length - 1)) / values.length;
  const hot = highlight ?? values.indexOf(max);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label={label}
    >
      <line
        x1="0"
        y1="99"
        x2="100"
        y2="99"
        stroke="var(--color-hairline)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {values.map((v, i) => {
        const local = clamp01((progress - (i / values.length) * 0.5) * 2.2);
        const h = (v / max) * 94 * local;
        const on = i === hot;
        return (
          <rect
            key={i}
            x={i * (w + gap)}
            y={99 - h}
            width={w}
            height={Math.max(h, 0.6)}
            fill={on ? "var(--color-signal)" : "#232b30"}
            opacity={on ? 0.9 : 1}
          />
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* ALLOCATION — replaces the solid-green donut                                 */
/* -------------------------------------------------------------------------- */

/**
 * A stacked allocation bar, in graphite, with only the selected/leading segment
 * in signal. Reads instantly, carries its own labels, needs no legend colour
 * key, and cannot become a green disc.
 */
export function Allocation({
  segments,
  progress = 1,
  active,
  onSelect,
  className,
  label,
  compact = false,
}: {
  segments: ReadonlyArray<{ label: string; value: number }>;
  progress?: number;
  active?: number;
  onSelect?: (i: number) => void;
  className?: string;
  label: string;
  compact?: boolean;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const p = clamp01(progress);
  const hot = active ?? 0;

  return (
    <div className={cn("w-full", className)}>
      <div
        role="img"
        aria-label={label}
        className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-[2px]"
      >
        {segments.map((s, i) => (
          <span
            key={s.label}
            className="h-full transition-[background-color,flex-grow] duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
            style={{
              flexGrow: (s.value / total) * p + 0.0001,
              background:
                i === hot ? "var(--color-signal)" : i < hot ? "#2e383e" : "#1b2226",
              opacity: i === hot ? 0.92 : 1,
            }}
          />
        ))}
      </div>

      <ul className={cn("mt-3 flex flex-col", compact ? "gap-1" : "gap-1.5")}>
        {segments.map((s, i) => {
          const Tag = onSelect ? "button" : "div";
          return (
            <li key={s.label}>
              <Tag
                {...(onSelect
                  ? { type: "button" as const, onClick: () => onSelect(i), "aria-pressed": i === hot }
                  : {})}
                className={cn(
                  "flex w-full items-center gap-2.5 border-b border-[var(--color-hairline)] py-1.5 text-left last:border-b-0",
                  onSelect && "transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:border-[var(--color-hairline-strong)]",
                )}
              >
                <span
                  aria-hidden
                  className="h-px w-4 shrink-0 transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                  style={{ background: i === hot ? "var(--color-signal)" : "#2a3338" }}
                />
                {/* Not truncated: these are program names and venue names, and
                    "L… 46%" is not information. */}
                <span
                  className={cn(
                    "flex-1 text-[0.82rem] leading-tight transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                    i === hot ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]",
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "drk-mono drk-tnum shrink-0 text-[0.82rem] transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                    i === hot ? "text-[var(--color-signal)]" : "text-[var(--color-ink-soft)]",
                  )}
                >
                  {s.value}%
                </span>
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CANDLESTICK — market condition (Scene 05)                                   */
/* -------------------------------------------------------------------------- */

export function Candles({
  bars,
  progress = 1,
  className,
  label,
  height = 200,
  trend,
  axis,
}: {
  bars: ReadonlyArray<{ o: number; c: number; h: number; l: number }>;
  progress?: number;
  className?: string;
  label: string;
  height?: number;
  /** Optional trend line drawn over the candles, values in the same scale. */
  trend?: readonly number[];
  axis?: readonly string[];
}) {
  const all = bars.flatMap((b) => [b.h, b.l]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const y = (v: number) => 94 - ((v - min) / span) * 88;
  const slot = 100 / bars.length;
  const w = slot * 0.5;
  const p = clamp01(progress);

  const trendPts: Array<[number, number]> | null = trend
    ? trend.map((v, i) => [i * slot + slot / 2, y(v)] as [number, number])
    : null;
  const cid = useId().replace(/:/g, "");

  return (
    /* A plain block wrapper with a fixed-height plot. Candles must NOT be a
       flex-growing chart: inside a stretched row it inflated a 140px plot to
       515px and pushed the whole scene out of its pinned stage. */
    <div className={cn("w-full", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={label}
      >
        <defs>
          <clipPath id={`cd-${cid}`}>
            <rect x="-2" y="-30" width={p * 104} height="170" />
          </clipPath>
        </defs>

        {[6, 28, 50, 72, 94].map((gy) => (
          <line
            key={gy}
            x1="0"
            y1={gy}
            x2="100"
            y2={gy}
            stroke="var(--color-hairline)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity={gy === 94 ? 1 : 0.5}
          />
        ))}

        {bars.map((b, i) => {
          const local = clamp01((p - (i / bars.length) * 0.62) * 3);
          if (local <= 0) return null;
          const down = b.c < b.o;
          const cx = i * slot + slot / 2;
          const top = y(Math.max(b.o, b.c));
          const bot = y(Math.min(b.o, b.c));
          /*
           * A falling market must LOOK falling. Down candles are the readable
           * ones here — neutral and clearly drawn — while up candles stay a
           * muted green. Reversing this (dim greys, bright green) makes a
           * risk-off chart read as a rally.
           */
          return (
            <g key={i} opacity={local}>
              <line
                x1={cx}
                y1={y(b.h)}
                x2={cx}
                y2={y(b.l)}
                stroke={down ? "#6e767c" : "var(--color-signal-deep)"}
                strokeWidth="0.9"
                vectorEffect="non-scaling-stroke"
                opacity={down ? 0.9 : 0.5}
              />
              <rect
                x={cx - w / 2}
                y={top}
                width={w}
                height={Math.max(bot - top, 0.8)}
                fill={down ? "#2b3338" : "var(--color-signal-deep)"}
                stroke={down ? "#8b949a" : "var(--color-signal-deep)"}
                strokeWidth="0.7"
                vectorEffect="non-scaling-stroke"
                opacity={down ? 1 : 0.42}
              />
            </g>
          );
        })}

        {trendPts && (
          <g clipPath={`url(#cd-${cid})`}>
            <path
              d={smoothPath(trendPts, 0.5)}
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke"
              opacity="0.8"
            />
          </g>
        )}
      </svg>

      {axis && (
        <div
          aria-hidden
          className="mt-1.5 flex justify-between border-t border-[var(--color-hairline)] pt-1.5"
        >
          {axis.map((a) => (
            <span key={a} className="drk-label text-[0.6rem] tracking-[0.14em]">
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SPARK — compact inline series                                               */
/* -------------------------------------------------------------------------- */

export function Spark({
  values,
  progress = 1,
  className,
  label,
  tone = "signal",
  height = 40,
}: {
  values: readonly number[];
  progress?: number;
  className?: string;
  label: string;
  tone?: "signal" | "muted";
  height?: number;
}) {
  return (
    <LineSeries
      values={values}
      progress={progress}
      label={label}
      height={height}
      area={false}
      showHead={false}
      grid={false}
      tone={tone}
      className={className}
    />
  );
}
