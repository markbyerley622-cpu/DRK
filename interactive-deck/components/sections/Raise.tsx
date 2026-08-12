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
 * CAPITAL; Scene 12 showed that pool compounding. Here $1M ENTERS that same
 * pool and immediately divides — 80% staying in the book as working liquidity,
 * 20% building the machine around it.
 *
 * THE WHOLE SLIDE IN FIVE SECONDS. One number, one split, two destinations:
 *
 *     $1M  →  80% / $800K  operating balance-sheet liquidity
 *          →  20% / $200K  growth + operating capital
 *
 * The proportion is carried by two bars on ONE shared track, so 80-against-20
 * is read at a glance and never has to be worked out from the numerals. Both
 * bars are green: the 20% is not overhead being confessed to, it is the part
 * that raises how much liquidity the engine can run — so it is drawn as a
 * quieter member of the same system, not as a leak out of it.
 *
 * What is deliberately absent: no valuation, no projection, no return, no
 * yield, no guarantee. The claim is only about where the money SITS.
 *
 * Financing terms stay on the slide but sit beneath the split, because the
 * allocation is the story and the terms are the paperwork (VER-09, VER-11).
 */

const N = raise.split.length;
const ROW_Y = Array.from({ length: N }, (_, i) => ((i + 0.5) / N) * 100);

export function Raise() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const arrive = range(p, 0.02, 0.18); // the $1M lands in the pool
  const alloc = range(p, 0.18, 0.8); // it divides
  const thesis = range(p, 0.8, 1);

  return (
    <Scene
      sceneRef={ref}
      id="raise"
      index="13"
      title="$1M seed round — 80% productive, 20% platform"
      height="300vh"
    >
      <SceneStage>
        <SceneShell>
          <SceneHead index="13" eyebrow="THE RAISE" size="h2" rule={false}>
            <Signal>{raise.headline.amount}</Signal>
            {raise.headline.rest}
          </SceneHead>

          <p className="drk-lede max-w-[54ch]">
            <Signal>{raise.support.a}</Signal>
            {raise.support.aRest}
            <Signal>{raise.support.b}</Signal>
            {raise.support.bRest}
          </p>

          <div className="mt-[clamp(1.25rem,3.5vh,2.5rem)] grid items-center gap-x-[clamp(1rem,2.5vw,2.5rem)] gap-y-7 lg:grid-cols-[auto_minmax(0,1fr)]">
            {/* ---------------- the capital, arriving ---------------- */}
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

              {/* The terms. Present, legible, and deliberately not the headline:
                  what the money DOES is the argument; how it is papered is the
                  answer to the next question, not this one. */}
              <dl
                className="mt-[clamp(0.9rem,2.2vh,1.4rem)] flex items-start gap-x-6 gap-y-2 border-t border-[var(--color-hairline)] pt-3"
                style={{ opacity: 0.3 + arrive * 0.7 }}
              >
                {raise.terms.map((t) => (
                  <div key={t.label} className="min-w-0">
                    <dt className="drk-label text-[0.5rem] text-[var(--color-faint)]">
                      {t.label}
                    </dt>
                    <dd className="mt-1 whitespace-nowrap text-[0.86rem] font-medium leading-none text-[var(--color-ink-soft)]">
                      {t.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* the port the split leaves from — without it the routes read as
                  floating stubs rather than as capital leaving a pool */}
              <span
                aria-hidden
                className="absolute right-0 top-[calc(50%-0.35rem)] hidden size-[7px] translate-x-1/2 rounded-full lg:block"
                style={{
                  background: alloc > 0.02 ? "var(--color-signal)" : "#1b2429",
                  boxShadow: alloc > 0.02 ? "0 0 12px 1px rgba(0,224,96,0.7)" : "none",
                }}
              />
            </div>

            {/* ---------------- the split ---------------- */}
            <div className="relative">
              {isDesktop && <RaiseRoutes alloc={alloc} />}

              <span className="drk-label block text-[var(--color-faint)]">
                {raise.allocationLabel}
              </span>

              <ul className="relative mt-2 flex flex-col">
                {raise.split.map((block, i) => {
                  const on = scrub ? range(alloc, i * 0.3, i * 0.3 + 0.6) : 1;
                  const lead = i === 0;
                  return (
                    <li
                      key={block.key}
                      className="border-b border-[var(--color-hairline)] py-[clamp(0.7rem,1.8vh,1.15rem)] last:border-b-0"
                      style={{ opacity: 0.34 + on * 0.66 }}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="flex items-baseline gap-3">
                          <span
                            className={cn(
                              "drk-mono drk-tnum shrink-0 text-[clamp(0.8rem,1.15vw,0.98rem)]",
                              lead
                                ? "text-[var(--color-signal)]"
                                : "text-[var(--color-signal-deep)]",
                            )}
                          >
                            {block.share}%
                          </span>
                          <span
                            className={cn(
                              "font-[family-name:var(--font-display)] font-semibold leading-none tracking-[-0.035em] text-[var(--color-ink)]",
                              lead
                                ? "text-[clamp(1.75rem,3.4vw,2.9rem)]"
                                : "text-[clamp(1.4rem,2.6vw,2.2rem)]",
                            )}
                          >
                            <Digits value={block.amount} />
                          </span>
                        </span>

                        <span className="drk-label max-w-[26ch] text-right text-[var(--color-ink-soft)]">
                          {block.name}
                        </span>
                      </div>

                      {/*
                        ONE TRACK, TWO BARS. Both fill the same 100% width, so
                        the 80 and the 20 are literally measured against each
                        other — this is the five-second read, and it is the one
                        element on the slide that cannot be misread.
                      */}
                      <span
                        aria-hidden
                        className="mt-2.5 block h-[5px] w-full overflow-hidden rounded-full bg-[#0f1519]"
                      >
                        <span
                          className={cn("block h-full rounded-full", TW.state)}
                          style={{
                            width: `${block.share * on}%`,
                            background: lead
                              ? "var(--color-signal)"
                              : "var(--color-signal-deep)",
                            boxShadow: lead
                              ? `0 0 ${on * 14}px 0 rgba(0,224,96,${on * 0.4})`
                              : "none",
                          }}
                        />
                      </span>

                      <ul className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-1 xl:grid-cols-4">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-baseline gap-2 text-[0.8rem] leading-snug text-[var(--color-muted)]"
                          >
                            <span
                              aria-hidden
                              className={cn("mt-[0.42rem] h-px w-2.5 shrink-0", TW.state)}
                              style={{
                                background:
                                  on > 0.7
                                    ? lead
                                      ? "var(--color-signal)"
                                      : "var(--color-signal-deep)"
                                    : "var(--color-hairline-strong)",
                              }}
                            />
                            <span className="min-w-0">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ---------------- the closing statement ---------------- */}
          <div
            className="mt-[clamp(1.25rem,3.5vh,2.25rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.9rem,2vh,1.4rem)]"
            style={{ opacity: scrub ? thesis : 1 }}
          >
            <p className="max-w-[62ch] text-[clamp(1.02rem,1.9vw,1.5rem)] font-semibold leading-snug tracking-[-0.025em] text-[var(--color-ink-soft)]">
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

/** Capital leaving the pool and arriving at each half of the split. */
function RaiseRoutes({ alloc }: { alloc: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-[4.6%] w-[4.8%]"
    >
      {ROW_Y.map((ty, i) => {
        const on = range(alloc, i * 0.3, i * 0.3 + 0.34);
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
            /* The route carries the weight of the pool it feeds. */
            stroke={i === 0 ? "var(--color-signal)" : "var(--color-signal-deep)"}
            strokeWidth={i === 0 ? 1.4 : 1}
            vectorEffect="non-scaling-stroke"
            opacity={on * 0.8}
            style={{ clipPath: `inset(0 ${100 - on * 100}% 0 0)` }}
          />
        );
      })}
    </svg>
  );
}
