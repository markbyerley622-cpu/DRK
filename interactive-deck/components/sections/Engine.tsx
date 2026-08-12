"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { LatencyRing } from "@/components/visuals/LatencyRing";
import { Signal, SystemObject } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { engine } from "@/content/drk";
import { cn, range } from "@/lib/utils";
import { MOTION, TW } from "@/lib/motion";

/**
 * SCENE 03 — ONE ENGINE / TWO BUSINESSES
 *
 * The failure mode this scene has to avoid is opening on two cards. It does not
 * open on two of anything: it opens on ONE engine, and then the SAME engine is
 * reconfigured twice.
 *
 * Both chains are three inputs and one outcome, and the engine sits between them
 * in each. So when the viewer switches mode the inputs and the outcome change
 * while the core stays exactly where it was. That is the argument, made
 * structurally:
 *
 *   ONE ENGINE. PERFORMANCE REVENUE TODAY. RECURRING SOFTWARE REVENUE AT SCALE.
 *
 * Scroll walks the two modes; on desktop the viewer can also select either and
 * inspect it. A manual selection is released when the scroll moves on.
 */

const MODES = [engine.flows.managed, engine.flows.licensed] as const;

export function Engine() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const core = range(p, 0.02, 0.16);
  const modeSeq = range(p, 0.2, 0.9);
  const scrollMode = scrub ? (modeSeq < 0.5 ? 0 : 1) : 0;
  const conclusion = range(p, 0.9, 1);

  const [pinned, setPinned] = useState<number | null>(null);
  const lastScrollMode = useRef(scrollMode);
  useEffect(() => {
    if (lastScrollMode.current !== scrollMode) {
      lastScrollMode.current = scrollMode;
      setPinned(null);
    }
  }, [scrollMode]);

  const mi = pinned ?? scrollMode;
  const mode = MODES[mi];

  // How far into the current mode the chain has built.
  const local = !scrub
    ? 1
    : pinned !== null
      ? 1
      : Math.max(0, Math.min(1, ((modeSeq - mi * 0.5) / 0.5) * 1.5));

  return (
    <Scene sceneRef={ref} id="engine" index="03" title="One engine, two businesses" height="300vh">
      <SceneStage>
        <SceneShell>
          <SceneHead
            index="03"
            eyebrow="THE MODEL"
            align="center"
            size="h2"
            rule={false}
            lede={engine.support}
          >
            {engine.headline.line1}
            <br />
            <Signal>{engine.headline.line2}</Signal>
          </SceneHead>

          {/* ---------------- mode selectors ---------------- */}
          {/*
            Selecting a mode only makes sense where the scroll can also drive it.
            Off-scrub (phone, reduced motion) BOTH configurations render in full
            below — otherwise a phone reader sees the Licensed Runtime tab and
            never the second business it names.
          */}
          <div
            role="group"
            aria-label={engine.modeHint}
            className={cn(
              "mx-auto mt-[clamp(1.5rem,3.5vh,2.5rem)] max-w-[46rem] grid-cols-1 gap-2 sm:grid-cols-2",
              scrub ? "grid" : "hidden",
            )}
          >
            {MODES.map((m, i) => {
              const on = i === mi;
              return (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPinned(i)}
                  className={cn(
                    "group relative rounded-[9px] border px-4 py-2.5 text-left transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                    on
                      ? "border-[var(--color-hairline-signal)] bg-[var(--color-panel-2)]"
                      : "border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-void)_50%,var(--color-panel))] hover:border-[var(--color-hairline-strong)]",
                  )}
                >
                  <span className="flex items-baseline gap-2.5">
                    <span
                      className={cn(
                        "drk-mono text-[0.68rem]",
                        on ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                      )}
                    >
                      {engine.businesses[i].index}
                    </span>
                    <span
                      className={cn(
                        "text-[clamp(0.88rem,1.2vw,1.05rem)] font-semibold uppercase tracking-[0.09em] transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                        on ? "text-[var(--color-ink)]" : "text-[var(--color-faint)]",
                      )}
                    >
                      {m.label}
                    </span>
                  </span>
                  <span className="drk-label mt-1 block truncate">{m.who}</span>
                  {on && (
                    <motion.span
                      layoutId="engine-mode"
                      aria-hidden
                      className="absolute inset-x-3 -bottom-px h-px bg-[var(--color-signal)]"
                      style={{ boxShadow: "0 0 10px 0 rgba(0,224,96,0.7)" }}
                      transition={MOTION.reconfigure}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ---------------- the system ---------------- */}
          {!scrub && <BothModes />}

          {scrub && (
          <div className="mt-[clamp(1.5rem,4vh,3rem)] grid items-center gap-x-[clamp(1rem,2.5vw,2.5rem)] gap-y-6 lg:grid-cols-[minmax(0,0.95fr)_auto_minmax(0,0.95fr)]">
            {/* ---- inputs: the three steps that feed the core ---- */}
            <AnimatePresence mode="wait">
              <motion.ol
                key={`${mode.key}-in`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={MOTION.reconfigure}
                className="flex w-full flex-col gap-[clamp(0.35rem,1vh,0.7rem)]"
              >
                {mode.chain.slice(0, 3).map((n, i) => {
                  const on = range(local, i * 0.18, i * 0.18 + 0.34);
                  return (
                    <ChainNode
                      key={n.key}
                      step={String(i + 1).padStart(2, "0")}
                      name={n.name}
                      note={n.note}
                      on={on}
                      align="right"
                    />
                  );
                })}
              </motion.ol>
            </AnimatePresence>

            {/* ---- the engine: never re-mounted, never moved ---- */}
            <div
              /* No order override: source order is chain -> engine -> outcome, which is
                 correct in the desktop grid AND correct when it collapses to one
                 column on a phone. Hoisting the engine to first put step 04 above
                 steps 01-03. */
              className="relative flex flex-col items-center"
              style={{ opacity: core, transform: `scale(${0.9 + core * 0.1})` }}
            >
              {/* the two feeds, in and out */}
              {[-1, 1].map((dir) => (
                <span
                  key={dir}
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 hidden h-px bg-[var(--color-signal)] lg:block",
                    dir === -1 ? "right-full origin-right" : "left-full origin-left",
                  )}
                  style={{
                    width: "clamp(1rem, 2.5vw, 2.5rem)",
                    transform: `scaleX(${dir === -1 ? range(local, 0, 0.5) : range(local, 0.55, 0.9)})`,
                    boxShadow: "0 0 8px 0 rgba(0,224,96,0.5)",
                  }}
                />
              ))}

              <div className="relative flex items-center justify-center">
                <LatencyRing
                  progress={local}
                  size={240}
                  intensity={0.5}
                  className="[&>svg]:size-[clamp(150px,17vw,240px)]"
                />
                <SystemObject
                  id="execution-engine"
                  scale="large"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>

              {/* The core carries the claim and nothing else. It used to append a
                  step-04 caption ("INFRASTRUCTURE — Multi-chain data, routing,
                  execution") restating in prose what the ring and the engine
                  object already show. */}
              <div className="mt-3 text-center">
                <p className="drk-label leading-[1.7] text-[var(--color-signal)]">
                  {engine.core.line1}
                  <br />
                  {engine.core.line2}
                </p>
              </div>
            </div>

            {/* ---- outcome ---- */}
            <div className="flex flex-col gap-[clamp(0.35rem,1vh,0.7rem)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode.key}-out`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={MOTION.reconfigure}
                  className="flex flex-col gap-[clamp(0.35rem,1vh,0.7rem)]"
                >
                  <ul className="contents">
                    <ChainNode
                      step="04"
                      name={mode.chain[3].name}
                      note={mode.chain[3].note}
                      on={range(local, 0.6, 0.82)}
                      align="left"
                    />
                  </ul>

                  <div
                    className="drk-note py-1"
                    style={{ opacity: 0.45 + range(local, 0.75, 0.95) * 0.55 }}
                  >
                    <span className="drk-label text-[var(--color-signal)]">REVENUE</span>
                    <p className="mt-1.5 text-[clamp(0.95rem,1.35vw,1.15rem)] font-semibold uppercase leading-tight tracking-[0.06em] text-[var(--color-ink)]">
                      {mode.out}
                    </p>
                    <p className="mt-1.5 text-[0.84rem] leading-snug text-[var(--color-muted)]">
                      {mode.outNote}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
          )}

          {/* ---------------- conclusion ---------------- */}
          <div
            className="mx-auto mt-[clamp(1.25rem,3.5vh,2.25rem)] max-w-[52rem] border-t border-[var(--color-hairline)] pt-[clamp(0.9rem,2vh,1.4rem)] text-center"
            style={{ opacity: scrub ? conclusion : 1 }}
          >
            <p className="text-[clamp(1rem,2vw,1.6rem)] font-medium tracking-[-0.02em] text-[var(--color-ink)]">
              {engine.conclusion.plain} <Signal>{engine.conclusion.signal}</Signal>
            </p>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The off-scrub recomposition: both configurations of the engine, in full,
 * one after the other.
 *
 * Selecting a mode is a desktop affordance driven by the scroll. On a phone —
 * and under reduced motion — there is nothing to drive it, so both chains are
 * rendered. The core still appears once inside each chain, at step 04, so the
 * "one engine, reconfigured" argument survives the layout change.
 */
function BothModes() {
  return (
    <div className="mt-[clamp(1.5rem,4vh,2.5rem)] flex flex-col gap-8">
      {MODES.map((mode, mi) => (
        <section key={mode.key}>
          <div className="flex items-baseline gap-2.5 border-b border-[var(--color-hairline-signal)] pb-2">
            <span className="drk-mono text-[0.68rem] text-[var(--color-signal)]">
              {engine.businesses[mi].index}
            </span>
            <h4 className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-ink)]">
              {mode.label}
            </h4>
            <span className="drk-label ml-auto shrink-0">{mode.who}</span>
          </div>

          <ol className="mt-3 flex flex-col gap-2">
            {mode.chain.map((n, i) => (
              <li key={n.key} className="contents">
                {/* The engine sits between the three inputs and the outcome, as
                    it does on desktop — unnumbered, because it is the constant
                    the chain runs through rather than a step of it. */}
                {i === 3 && (
                  <div
                    aria-hidden
                    className="flex items-center gap-3 rounded-[9px] border border-[var(--color-hairline-signal)] bg-[var(--color-panel-2)] px-3 py-2"
                  >
                    <SystemObject id="execution-engine" scale="chip" />
                    <span className="drk-label leading-[1.6] text-[var(--color-signal)]">
                      {engine.core.line1} {engine.core.line2}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3 rounded-[9px] border border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-void)_50%,var(--color-panel))] px-3 py-2.5">
                  <span className="drk-mono mt-[0.15rem] shrink-0 text-[0.66rem] text-[var(--color-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.78rem] font-semibold uppercase leading-tight tracking-[0.11em] text-[var(--color-ink)]">
                      {n.name}
                    </span>
                    <span className="mt-1 block text-[0.84rem] leading-snug text-[var(--color-muted)]">
                      {n.note}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-3 rounded-[10px] border border-[var(--color-hairline-signal)] bg-[var(--color-panel-2)] p-3.5">
            <span className="drk-label text-[var(--color-signal)]">REVENUE</span>
            <p className="mt-1.5 text-[0.98rem] font-semibold uppercase leading-tight tracking-[0.06em] text-[var(--color-ink)]">
              {mode.out}
            </p>
            <p className="mt-1.5 text-[0.84rem] leading-snug text-[var(--color-muted)]">
              {mode.outNote}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}

function ChainNode({
  step,
  name,
  note,
  on,
  align,
}: {
  step: string;
  name: string;
  note: string;
  on: number;
  align: "left" | "right";
}) {
  const live = on > 0.8;
  return (
    <li
      className={cn(
        "flex w-full list-none items-start gap-3 border-b border-[var(--color-hairline)] py-[clamp(0.5rem,1.15vh,0.8rem)] transition-colors last:border-b-0",
        TW.state,
        align === "right" && "lg:text-right",
      )}
      /* Floor raised: at 0.22 an entry frame read as a failed render rather
         than as a reveal, and a reader arriving at normal scroll speed can sit
         in that state long enough to judge it. */
      style={{ opacity: 0.48 + on * 0.52 }}
    >
      <span
        className={cn(
          "drk-mono mt-[0.15rem] shrink-0 text-[0.66rem]",
          live ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
        )}
      >
        {step}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.78rem] font-semibold uppercase leading-tight tracking-[0.11em] text-[var(--color-ink)]">
          {name}
        </span>
        <span className="mt-1 block text-[0.82rem] leading-snug text-[var(--color-muted)]">
          {note}
        </span>
      </span>
    </li>
  );
}
