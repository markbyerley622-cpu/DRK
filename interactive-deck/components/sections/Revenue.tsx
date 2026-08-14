"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { LatencyRing } from "@/components/visuals/LatencyRing";
import { Signal, SystemObject } from "@/components/ui/primitives";
import { useMediaQuery, useSceneNarrative } from "@/hooks/useScene";
import { compound, revenue } from "@/content/drk";
import { cn, range, smoothPath } from "@/lib/utils";
import { TW } from "@/lib/motion";

/**
 * SCENE 13 — REVENUE  (act one of five)
 *
 * Revenue, Economics, Projections, Compounding and the Raise are ONE economic
 * argument, so they are built as one continuous act rather than five diagrams:
 *
 *   13  the same engine produces five revenue LINES, and every line feeds ONE
 *       pool. The pool is labelled CAPITAL.               <- you are here
 *   14  why the earnings per mandate rise as those lines mature.
 *   15  what the five lines total over three years.
 *   16  that same CAPITAL is the entry node of the compounding loop.
 *   17  the $1.5M enters that same pool and expands what it can drive.
 *
 * This scene answers HOW DRK MAKES MONEY and deliberately shows no figures:
 * naming the lines and pricing them in the same breath buries the taxonomy
 * under a table. Scene 15 prices them, off the same data.
 *
 * The Execution Engine here is the object introduced in Scene 01 and
 * reconfigured in Scene 03 — same object, same scale ladder, third appearance.
 */

const N = 5;
/** Row centres as percentages of the stream column, so routes land on rows. */
const ROW_Y = Array.from({ length: N }, (_, i) => ((i + 0.5) / N) * 100);

export function Revenue() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);
  const isWide = useMediaQuery("(min-width: 1536px)", true);

  const core = range(p, 0.02, 0.16);
  const fan = range(p, 0.16, 0.78);
  const pool = range(p, 0.7, 0.92);
  const bridge = range(p, 0.88, 1);

  return (
    <Scene sceneRef={ref} id="revenue" index="13" title="Multiple revenue streams" height="300vh">
      <SceneStage>
        <SceneShell>
          <div className="grid items-center gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
            {/* ---------------- narrative ---------------- */}
            <div className="drk-scrim">
              <SceneHead index="13" eyebrow="REVENUE" size="h2">
                {revenue.headline.line1}
                <br />
                <Signal>{revenue.headline.signal}</Signal>
                <br />
                {revenue.headline.line2}
              </SceneHead>

              <p className="drk-lede">
                {revenue.support.plain}
                <Signal>{revenue.support.signal}</Signal>
              </p>

              <div
                className="mt-[clamp(1.5rem,3.5vh,2.5rem)] border-t border-[var(--color-hairline)] pt-[clamp(1rem,2.4vh,1.5rem)]"
                style={{ opacity: scrub ? pool : 1 }}
              >
                <p className="text-[0.92rem] leading-relaxed text-[var(--color-ink-soft)]">
                  {revenue.conclusion.a}
                  <br />
                  {revenue.conclusion.b}
                </p>
                <p className="mt-3 text-[clamp(1rem,1.6vw,1.3rem)] font-semibold tracking-[-0.02em] text-[var(--color-signal)]">
                  {revenue.conclusion.c}
                </p>
              </div>
            </div>

            {/* ---------------- engine → streams → pool ---------------- */}
            {/*
              Three columns only from `xl`. At 1024 the engine and the pool left
              the stream rows about 90px of content width, which broke every
              name onto one word per line and printed the model tag straight
              through the titles. Below xl the engine and the pool sit above the
              rows as one compact header instead, and the argument is unchanged:
              one engine, five streams, one pool.
            */}
            <div className="grid items-center gap-x-[clamp(0.5rem,1.4vw,1.25rem)] gap-y-4 2xl:grid-cols-[auto_minmax(0,1fr)_auto]">
              {/* the same engine, third appearance */}
              <div
                className="flex flex-row items-center justify-center gap-4 2xl:flex-col 2xl:gap-0"
                style={{ opacity: core, transform: `scale(${0.9 + core * 0.1})` }}
              >
                <div className="relative flex items-center justify-center">
                  <LatencyRing
                    progress={fan}
                    size={230}
                    intensity={0.45}
                    className="[&>svg]:size-[clamp(130px,15vw,225px)]"
                  />
                  <SystemObject
                    id="execution-engine"
                    scale="large"
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <span className="drk-label text-center text-[var(--color-signal)] 2xl:mt-2">
                  ONE ENGINE
                </span>
              </div>

              {/* the five streams — one row each, never wrapping */}
              <div className="relative">
                {/* The fan only makes sense beside the engine — below xl the engine
                    sits above the rows, so the routes would point at nothing. */}
                {isWide && <FanRoutes fan={fan} />}

                  {/*
                    Equal-height rows built with flex + a shared min-height, NOT
                    `grid-template-rows: repeat(n, 1fr)`. In an auto-height grid a
                    `1fr` row resolves against the tallest item and is then applied
                    to every row, which inflated this list to over 1000px at
                    1366x768 and clipped the pinned stage. Equal rows still let the
                    routes land on row centres.
                  */}
                <ul className="relative flex flex-col">
                  {revenue.streams.map((s, i) => {
                    const on = scrub ? range(fan, i * 0.15, i * 0.15 + 0.36) : 1;
                    const live = on > 0.85;
                    return (
                      <li
                        key={s.index}
                        className={cn(
                          "flex min-h-[clamp(3.2rem,7vh,4.5rem)] items-center gap-3.5 border-b border-[var(--color-hairline)] py-[clamp(0.5rem,1.2vh,0.85rem)] pr-1 transition-colors last:border-b-0",
                          TW.state,
                        )}
                        style={{ opacity: 0.44 + on * 0.56 }}
                      >
                        {/* the row's own connector: a rule that lights when the
                            stream comes online, in place of a border */}
                        <span
                          aria-hidden
                          className={cn("h-px w-5 shrink-0 transition-colors", TW.state)}
                          style={{
                            background: live ? "var(--color-signal)" : "var(--color-hairline-strong)",
                          }}
                        />
                        <span className="drk-mono shrink-0 text-[0.72rem] text-[var(--color-signal)]">
                          {s.index}
                        </span>
                        <span className="min-w-0 flex-1">
                          {/* Never truncated: a revenue stream's name is a
                              business fact, not a label. */}
                          <span className="block text-[clamp(0.88rem,1.25vw,1.08rem)] font-medium leading-tight text-[var(--color-ink)]">
                            {s.name}
                            {s.footnote && (
                              <span aria-hidden className="text-[var(--color-signal)]">
                                *
                              </span>
                            )}
                          </span>
                          {s.note && (
                            <span className="mt-0.5 block text-[0.76rem] leading-snug text-[var(--color-faint)]">
                              {s.footnote ? "*" : ""}
                              {s.note}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "drk-label hidden shrink-0 text-[0.58rem] lg:block",
                          )}
                        >
                          {s.model}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* the pool every stream feeds — the handoff into Scene 16 */}
              <div
                className="flex flex-col items-center 2xl:mt-0"
                style={{ opacity: scrub ? 0.15 + pool * 0.85 : 1 }}
              >
                <div
                  className="flex w-full flex-row items-center justify-center gap-3 rounded-[10px] border px-[clamp(0.7rem,1.4vw,1.1rem)] py-[clamp(0.7rem,1.6vh,1.1rem)] text-center transition-colors duration-[680ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] xl:w-auto 2xl:flex-col 2xl:gap-0"
                  style={{
                    minWidth: "clamp(6.5rem,9vw,8.5rem)",
                    borderColor:
                      pool > 0.5 ? "var(--color-hairline-signal)" : "var(--color-hairline)",
                    background: "var(--color-panel)",
                  }}
                >
                  <span className="drk-label">COLLECTS AS</span>
                  <span className="font-[family-name:var(--font-display)] text-[clamp(1.1rem,1.8vw,1.5rem)] 2xl:mt-1.5 font-semibold leading-none tracking-[-0.03em] text-[var(--color-signal)]">
                    {compound.loop[0].name}
                  </span>
                  <span
                    aria-hidden
                    className="hidden h-px w-8 bg-[var(--color-signal)] 2xl:mt-3 2xl:block"
                    style={{ opacity: bridge }}
                  />
                  <span
                    className="block text-[0.72rem] leading-snug text-[var(--color-muted)] 2xl:mt-3"
                    style={{ opacity: bridge }}
                  >
                    {compound.loop[0].note}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The routes from the engine port to each stream row. Rows are laid out on an
 * equal-height grid precisely so these can land on row centres — in the first
 * build the rows wrapped to different heights and the routes pointed at gaps.
 */
function FanRoutes({ fan }: { fan: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-[7%] w-[9%]"
    >
      {ROW_Y.map((ty, i) => {
        const on = range(fan, i * 0.15, i * 0.15 + 0.34);
        const d = smoothPath(
          [
            [0, 50],
            [42, 50 + (ty - 50) * 0.12],
            [74, 50 + (ty - 50) * 0.78],
            [100, ty],
          ],
          0.5,
        );
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
            opacity={on * 0.75}
            style={{ clipPath: `inset(0 ${100 - on * 100}% 0 0)` }}
          />
        );
      })}
    </svg>
  );
}
