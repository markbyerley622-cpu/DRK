"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { LatencyRing } from "@/components/visuals/LatencyRing";
import { Digits, Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { compound, raise } from "@/content/drk";
import { cn, range, smoothPath } from "@/lib/utils";
import { TW } from "@/lib/motion";

/**
 * SCENE 13 — THE RAISE  (act three of three)
 *
 * The raise is not a separate ask screen. Scene 11 ended on a pool labelled
 * CAPITAL; Scene 12 showed that pool compounding. Here the $1M ENTERS that same
 * pool, and each allocation connects to a part of the machine the investor has
 * already met by name — Liquidity Engine, Execution Engine, Routing Layer,
 * Managed Trading, Control Layer.
 *
 * The message is structural, not stated: the raise scales an existing machine.
 *
 * The deck states no valuation, so none is stated or derived, and the five
 * allocations are unweighted in the source, so no split is invented (VER-09).
 */

const N = 5;
const ROW_Y = Array.from({ length: N }, (_, i) => ((i + 0.5) / N) * 100);

export function Raise() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const arrive = range(p, 0.02, 0.2); // the $1M lands in the pool
  const alloc = range(p, 0.2, 0.86); // it distributes
  const thesis = range(p, 0.86, 1);

  return (
    <Scene sceneRef={ref} id="raise" index="13" title="Raising $1M for 10%" height="300vh">
      <SceneStage>
        <SceneShell>
          <SceneHead index="13" eyebrow="THE RAISE" size="h2" rule={false}>
            {raise.headline.pre}
            <Signal>{raise.headline.amount}</Signal>
            {raise.headline.mid}
            <Signal>{raise.headline.equity}.</Signal>
          </SceneHead>

          <p className="drk-lede max-w-[54ch]">
            {raise.support.pre}
            <Signal>{raise.support.a}</Signal>
            {raise.support.mid}
            <Signal>{raise.support.b}</Signal>
            {raise.support.mid2}
            <Signal>{raise.support.c}</Signal>.
          </p>

          <div className="mt-[clamp(1.25rem,3.5vh,2.5rem)] grid items-center gap-x-[clamp(1rem,2.5vw,2.5rem)] gap-y-7 lg:grid-cols-[auto_minmax(0,1fr)]">
            {/* ---------------- the capital pool, receiving ---------------- */}
            <div
              className="relative mx-auto flex flex-col items-center lg:mx-0"
              style={{ opacity: 0.2 + arrive * 0.8 }}
            >
              <div className="relative flex items-center justify-center">
                <LatencyRing
                  progress={alloc}
                  size={220}
                  intensity={0.6}
                  className="[&>svg]:size-[clamp(140px,15vw,215px)]"
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="drk-label">{raise.centre.label}</span>
                  <span className="mt-1 font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.8vw,2.5rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)]">
                    <Digits value={raise.centre.value} />
                  </span>
                </span>
              </div>

              {/* the pool it enters — the same node Scene 11 handed over and
                  Scene 12 compounded */}
              <span
                className="drk-label mt-3 text-center text-[var(--color-signal)]"
                style={{ opacity: arrive }}
              >
                INTO {compound.loop[0].name}
              </span>

              {/* the port the allocations leave from — without it the routes
                  read as floating stubs rather than as capital leaving a pool */}
              <span
                aria-hidden
                className="absolute right-0 top-[calc(50%-0.35rem)] hidden size-[7px] translate-x-1/2 rounded-full lg:block"
                style={{
                  background: alloc > 0.02 ? "var(--color-signal)" : "#1b2429",
                  boxShadow: alloc > 0.02 ? "0 0 12px 1px rgba(0,224,96,0.7)" : "none",
                }}
              />
            </div>

            {/* ---------------- allocations → system targets ---------------- */}
            <div className="relative">
              {isDesktop && <RaiseRoutes alloc={alloc} />}

                {/*
                  Equal-height rows built with flex + a shared min-height, NOT
                  `grid-template-rows: repeat(n, 1fr)`. In an auto-height grid a
                  `1fr` row resolves against the tallest item and is then applied
                  to every row, which inflated this list to over 1000px at
                  1366x768 and clipped the pinned stage. Equal rows still let the
                  routes land on row centres.
                */}
              <ul className="relative flex flex-col">
                {raise.allocations.map((a, i) => {
                  const on = scrub ? range(alloc, i * 0.15, i * 0.15 + 0.36) : 1;
                  const live = on > 0.85;
                  return (
                    <li
                      key={a.index}
                      className={cn(
                        "flex min-h-[clamp(3.2rem,7vh,4.5rem)] items-center gap-3.5 border-b border-[var(--color-hairline)] py-[clamp(0.5rem,1.2vh,0.85rem)] pr-1 transition-colors last:border-b-0",
                        TW.state,
                      )}
                      style={{ opacity: 0.44 + on * 0.56 }}
                    >
                      <span
                        aria-hidden
                        className={cn("h-px w-5 shrink-0 transition-colors", TW.state)}
                        style={{
                          background: live ? "var(--color-signal)" : "var(--color-hairline-strong)",
                        }}
                      />
                      <span className="drk-mono shrink-0 text-[0.72rem] text-[var(--color-signal)]">
                        {a.index}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[clamp(0.88rem,1.25vw,1.08rem)] font-medium leading-tight text-[var(--color-ink)]">
                          {a.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.78rem] leading-snug text-[var(--color-muted)]">
                          {a.effect}
                        </span>
                      </span>

                      {/* what it scales — every target is a component the
                          investor has already been introduced to */}
                      <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
                        <span
                          aria-hidden
                          className="h-px w-4 transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                          style={{
                            background: live
                              ? "var(--color-signal)"
                              : "var(--color-hairline-strong)",
                          }}
                        />
                        <span className="text-right">
                          <span className="drk-label block text-[0.56rem]">SCALES</span>
                          <span
                            className={cn(
                              "mt-0.5 block whitespace-nowrap text-[0.78rem] font-medium transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                              live ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                            )}
                          >
                            {a.scales}
                          </span>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ---------------- thesis ---------------- */}
          <div
            className="mt-[clamp(1.25rem,3.5vh,2.25rem)] flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-[var(--color-hairline)] pt-[clamp(0.9rem,2vh,1.4rem)]"
            style={{ opacity: scrub ? thesis : 1 }}
          >
            <p className="text-[clamp(1.1rem,2.2vw,1.8rem)] font-semibold tracking-[-0.025em] text-[var(--color-signal)]">
              {raise.thesis}
            </p>
            <p className="max-w-[46ch] text-[0.88rem] text-[var(--color-muted)]">
              {raise.footer.pre}
              <Signal>{raise.footer.a}</Signal>
              {raise.footer.mid}
              <Signal>{raise.footer.b}</Signal>
              {raise.footer.post}
            </p>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

/** Capital leaving the pool and arriving at each row centre. */
function RaiseRoutes({ alloc }: { alloc: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-[4.6%] w-[4.8%]"
    >
      {ROW_Y.map((ty, i) => {
        const on = range(alloc, i * 0.15, i * 0.15 + 0.34);
        const d = smoothPath(
          [
            [0, 50],
            [40, 50 + (ty - 50) * 0.14],
            [74, 50 + (ty - 50) * 0.8],
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
