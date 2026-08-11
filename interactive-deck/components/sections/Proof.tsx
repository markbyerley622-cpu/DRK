"use client";

import { MOTION, EASE } from "@/lib/motion";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Scene, SceneHead, SceneShell, SceneStage } from "@/components/deck/Scene";
import { Candles, useMorphSeries } from "@/components/visuals/charts";
import { Digits, Signal, StatusDot } from "@/components/ui/primitives";
import {
  useHasEntered,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/hooks/useScene";
import { illustrativeSeries, launchTimeline, proof } from "@/content/drk";
import { clamp01, cn } from "@/lib/utils";

/**
 * SCENE 05 — PROOF
 *
 * The only performance evidence in the source deck, presented as an
 * INSPECTABLE case study rather than a headline number: selecting a launch
 * re-measures the window, redraws the market it was delivered into, and moves
 * the result.
 *
 * No client names are fabricated — the source names none. The `$70k` metric's
 * label is rendered exactly as supplied and flagged as VER-01; no guess is made
 * about whether it is correct, and no visible caveat is attached to it.
 */

/**
 * The two delivery windows read the SAME illustrative market. The source dates
 * them consecutively (late July → early August), so launch 01 sits at the head
 * of the series and launch 02 overlaps it further down. Selecting a launch
 * therefore slides a window along one continuous falling market rather than
 * swapping in a second, unrelated shape.
 */
const WINDOW_BARS = 12;
const WINDOW_START = [0, illustrativeSeries.weakMarket.length - WINDOW_BARS];

/**
 * Positional axis ticks. Four evenly-spaced marks across a delivery window —
 * they label the chart's geometry so it reads as an instrument rather than a
 * shape. They are not a measured period and assert nothing; the caption under
 * the plot states that the shape is illustrative.
 */
const WINDOW_AXIS = ["W1", "W2", "W3", "W4"];

/**
 * Chart reveal ramp.
 *
 * Proof is not a scrubbed scene, so the candle field draws once on entry and
 * again whenever `key` changes — selecting a launch reads as the case study
 * being re-measured, not as a label swap. Nothing scroll-derived depends on
 * this, so it cannot strand the scene in an invalid state.
 */
function useRevealRamp(key: string, active: boolean, ms = 900): number {
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setP(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp01((now - start) / ms);
      setP(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    setP(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [key, active, ms, reduced]);

  return p;
}

export function Proof() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const entered = useHasEntered(panelRef, "-20% 0px");

  const [sel, setSel] = useState(0);
  const launch = proof.launches[sel];
  /* Status is a fact about the launch, so it is read from the manifest rather
     than written into JSX. Same two launches, same ids. */
  const record = launchTimeline.find((l) => l.id === launch.id);

  const start = WINDOW_START[sel];
  const bars = useMemo(
    () => illustrativeSeries.weakMarket.slice(start, start + WINDOW_BARS),
    [start],
  );
  /* Memoised: `useMorphSeries` keys its tween off the target's identity, so a
     freshly-sliced array every render would restart the animation forever. */
  const trendTarget = useMemo(
    () => illustrativeSeries.weakMarketTrend.slice(start, start + WINDOW_BARS),
    [start],
  );
  const trend = useMorphSeries(trendTarget);

  const chartProgress = useRevealRamp(launch.id, entered);

  /* 768px-tall frames cannot spend 176px on the plot and still land the result
     block above the instrument strip. */
  const shortFrame = useMediaQuery("(max-height: 820px)");
  const chartHeight = shortFrame ? 140 : 176;

  return (
    <Scene sceneRef={ref} id="proof" index="05" title="Two launches, weak market" height="130vh">
      <SceneStage>
        <SceneShell>
          <div
            className={cn(
              "grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-[clamp(1.75rem,3.5vh,2.75rem)]",
              "lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]",
            )}
          >
            {/* ---------------- the claim ---------------- */}
            <div className="drk-scrim lg:col-start-1 lg:row-start-1">
              {/* h2, not h1: at 1366 and below the authored two-line headline
                  wraps to four ragged lines at display scale. */}
              <SceneHead
                index="05"
                eyebrow="EVIDENCE"
                size="h2"
                lede={
                  <>
                    {proof.support.pre}
                    <Signal>{proof.support.signal}</Signal>
                    {proof.support.post}
                  </>
                }
              >
                {proof.headline.plain}
                <br />
                {proof.headline.strong}
                <Signal>.</Signal>
              </SceneHead>
            </div>

            {/* ---------------- the case study ---------------- */}
            <div
              ref={panelRef}
              className="drk-glass flex flex-col overflow-hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
            >
              {/* launch selector — toggle buttons, both permanently tabbable */}
              <div
                role="group"
                aria-label="Launch case studies"
                className="flex border-b border-[var(--color-hairline)]"
              >
                {proof.launches.map((l, i) => (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={i === sel}
                    onClick={() => setSel(i)}
                    className={cn(
                      "relative flex-1 px-[clamp(0.9rem,1.5vw,1.25rem)] py-[clamp(0.7rem,1.6vh,0.95rem)] text-left transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                      i === sel
                        ? "bg-[var(--color-panel-2)]"
                        : "hover:bg-[color-mix(in_srgb,var(--color-panel-2)_50%,transparent)]",
                      i === 0 && "border-r border-[var(--color-hairline)]",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {/* selection is carried by a mark and by weight, never by
                          colour alone */}
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 shrink-0 rounded-[1px] transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                          i === sel
                            ? "bg-[var(--color-signal)]"
                            : "bg-[var(--color-hairline-strong)]",
                        )}
                      />
                      <span
                        className={cn(
                          "drk-label",
                          i === sel
                            ? "font-bold text-[var(--color-signal)]"
                            : "text-[var(--color-faint)]",
                        )}
                      >
                        {l.name}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.8rem] text-[var(--color-fineprint)]">
                      {l.window}
                    </span>
                    {i === sel && (
                      <motion.span
                        layoutId="proof-tab"
                        aria-hidden
                        className="absolute inset-x-0 bottom-[-1px] h-px bg-[var(--color-signal)]"
                        transition={MOTION.reconfigure}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* instrument header — the object lives in the chrome, to the side
                  of the readout. It is never ghosted behind the data, where it
                  read as a render artefact rather than as depth. */}
              {/* The DRK object is deliberately NOT used here. The only plate
                  that fits the subject is the Market Chart, which renders a
                  RISING curve — beside the words "weak, risk-off market" it
                  contradicts the data it sits next to. The candles carry the
                  meaning on their own. */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-[clamp(0.9rem,1.6vw,1.3rem)] pt-[clamp(0.8rem,1.6vh,1.15rem)]">
                <span className="drk-label">MARKET CONDITION</span>
                <StatusDot state="idle" label={proof.marketCondition} />
              </div>

              {/* the plot, with both axes present */}
              <div className="mt-[clamp(0.6rem,1.4vh,1rem)] flex gap-2.5 px-[clamp(0.9rem,1.6vw,1.3rem)]">
                {/* Ordinal vertical scale. The source establishes direction, not
                    levels, so the axis is labelled ordinally and carries no
                    invented values. */}
                <div
                  aria-hidden
                  className="flex shrink-0 flex-col justify-between pb-4"
                  style={{ height: chartHeight }}
                >
                  <span className="drk-label text-[0.58rem] tracking-[0.12em]">HIGH</span>
                  <span className="drk-label text-[0.58rem] tracking-[0.12em]">LOW</span>
                </div>
                <Candles
                  bars={bars}
                  trend={trend}
                  axis={WINDOW_AXIS}
                  progress={chartProgress}
                  height={chartHeight}
                  className="min-w-0 flex-1"
                  label={`${launch.name}, ${launch.window}. The market fell steadily across the delivery window: lower highs and lower lows.`}
                />
              </div>
              <p className="mt-2 px-[clamp(0.9rem,1.6vw,1.3rem)] pb-[clamp(0.8rem,1.6vh,1.1rem)] text-[0.78rem] leading-relaxed text-[var(--color-fineprint)]">
                Market direction across the delivery window. Shape is illustrative; the
                risk-off condition is stated in the source deck.
              </p>

              {/* result */}
              <div className="mt-auto border-t border-[var(--color-hairline)] p-[clamp(0.9rem,1.8vw,1.35rem)]">
                <div className="flex flex-wrap items-end justify-between gap-x-[clamp(1.25rem,2.5vw,2.5rem)] gap-y-4">
                  <div>
                    <span className="drk-label">{launch.resultLabel}</span>
                    {/* Ink, not signal. Two oversized green figures in one
                        scene ($150k here, $40k+ opposite) flatten the
                        hierarchy; green is reserved for the number the
                        investor actually earns from. */}
                    <p className="drk-tnum mt-1.5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.8vw,3.9rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)]">
                      <Digits value={launch.result} />
                    </p>
                    <span aria-hidden className="mt-3 block h-px w-12 bg-[var(--color-signal)]" />
                  </div>
                  <motion.dl
                    key={launch.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.34, ease: EASE.ui }}
                    className="flex gap-[clamp(1.1rem,2.4vw,2.25rem)]"
                  >
                    <div>
                      <dt className="drk-label">CASE</dt>
                      <dd className="drk-mono mt-1.5 text-[0.9rem] text-[var(--color-ink-soft)]">
                        {launch.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="drk-label">WINDOW</dt>
                      <dd className="mt-1.5 text-[0.9rem] text-[var(--color-ink-soft)]">
                        {launch.window}
                      </dd>
                    </div>
                    {record && (
                      <div>
                        <dt className="drk-label">STATUS</dt>
                        <dd className="mt-1.5">
                          <StatusDot state="complete" label={record.state} />
                        </dd>
                      </div>
                    )}
                  </motion.dl>
                </div>
              </div>
            </div>

            {/* ---------------- what DRK took, and what it means ---------------- */}
            <div className="drk-scrim lg:col-start-1 lg:row-start-2">
              <div className="flex items-center gap-4 border-t border-[var(--color-hairline)] pt-[clamp(1rem,2.2vh,1.6rem)]">
                <span className="drk-tnum font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.2vw,2.85rem)] font-semibold leading-none tracking-[-0.035em] text-[var(--color-signal)]">
                  {proof.drkEconomics.value}
                </span>
                <span className="drk-label max-w-[11ch] leading-[1.5]">
                  {proof.drkEconomics.label}
                </span>
              </div>

              <p className="mt-[clamp(1.25rem,3vh,2.2rem)] max-w-[34ch] text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-snug text-[var(--color-ink-soft)]">
                {proof.takeaway}
              </p>
              <p className="mt-2.5 max-w-[44ch] text-[0.8rem] leading-relaxed text-[var(--color-fineprint)]">
                {proof.note}
              </p>
            </div>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
