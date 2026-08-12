"use client";

import { EASE, MOTION, TW } from "@/lib/motion";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Scene, SceneHead, SceneShell, SceneStage } from "@/components/deck/Scene";
import { BrandMark, hasBrandMark } from "@/components/ui/BrandMark";
import { DataNode, Signal } from "@/components/ui/primitives";
import { useSceneNarrative, usePrefersReducedMotion } from "@/hooks/useScene";
import { stack } from "@/content/drk";
import { activeIndex, cn, range } from "@/lib/utils";

/**
 * SCENE 06 — OWN THE STACK
 *
 * An explorable architecture, not a rack diagram. The scroll walks the four
 * owned layers in sequence and the viewer can select any of them directly; the
 * selection is released as soon as the scroll reaches a different layer, so the
 * two never fight. The full argument still works by scrolling alone.
 *
 * Selecting a layer answers the question the static version could not: WHICH
 * parts of the outside world does this piece of DRK actually touch. Only that
 * layer's external entries illuminate and only its routes are drawn; everything
 * else recedes.
 *
 * Networks carry their official mark, supplied by DRK; venues with no supplied
 * mark stay typographic rather than take an approximated one. Nothing here is
 * described as a partnership (VER-06).
 */

/* Shared vertical inset for the diagram's body row. The external list, the
   route canvas and the core rack all use it, which is what lets the routes be
   drawn from pure fractions — item i of n sits at (i + 0.5) / n of the same
   box — with no measurement and no resize observer. */
const BODY_INSET = "clamp(0.45rem,0.85vw,0.85rem)";

export function Stack() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);
  const reduced = usePrefersReducedMotion();

  const layers = stack.core;
  const externals = stack.external;

  const seq = range(p, 0.08, 0.92);
  /* Off desktop the scroll does not drive the layer: the architecture opens on
     the Liquidity Engine and the viewer taps through it. */
  const scrollIdx = scrub ? activeIndex(seq, layers.length, 0.02) : 0;

  // manual selection, released as soon as the scroll reaches a different layer
  const [pinned, setPinned] = useState<number | null>(null);
  const lastScrollIdx = useRef(scrollIdx);
  useEffect(() => {
    if (lastScrollIdx.current !== scrollIdx) {
      lastScrollIdx.current = scrollIdx;
      setPinned(null);
    }
  }, [scrollIdx]);

  const idx = pinned ?? scrollIdx;
  const layer = layers[idx];
  const io = stack.io[layer.key];
  const linked = useMemo(() => new Set(io.feeds), [io]);

  const extY = (i: number) => ((i + 0.5) / externals.length) * 100;
  const coreY = (j: number) => ((j + 0.5) / layers.length) * 100;

  return (
    <Scene sceneRef={ref} id="stack" index="06" title="We own the stack" height="270vh">
      <SceneStage>
        <SceneShell>
          <div className="flex flex-col gap-[clamp(1.5rem,4.5vh,3.5rem)]">
            {/* ================= narrative + inspector ================= */}
            <div className="grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-[clamp(1.5rem,3vh,2.25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
              <div className="drk-scrim">
                <SceneHead index="06" eyebrow="ARCHITECTURE" size="h2" lede={stack.support}>
                  {stack.headline.line1}
                  <br />
                  <Signal>{stack.headline.line2}</Signal>
                </SceneHead>
              </div>

              {/* The inspector. It reads out whatever layer is active, which is
                  what turns the diagram into something you can interrogate.
                  Desktop only: on a phone the same readout lives inside the
                  open accordion row, where it sits next to what it describes. */}
              <motion.div
                key={layer.key}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={MOTION.reconfigure}
                className="drk-scrim hidden lg:block"
              >
                <div className="flex items-center gap-[clamp(0.6rem,1.2vw,1rem)]">
                  <div className="min-w-0">
                    <span className="drk-label drk-mono text-[var(--color-signal)]">
                      LAYER {String(idx + 1).padStart(2, "0")} /{" "}
                      {String(layers.length).padStart(2, "0")}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-[clamp(1.05rem,1.75vw,1.45rem)] font-semibold leading-tight tracking-[-0.025em] text-[var(--color-ink)]">
                      {layer.name}
                    </p>
                  </div>
                </div>

                <p className="mt-[clamp(0.75rem,1.6vh,1.1rem)] max-w-[46ch] text-[var(--step-body)] leading-relaxed text-[var(--color-muted)]">
                  {io.detail}
                </p>

                <dl className="mt-[clamp(0.85rem,1.8vh,1.2rem)] grid grid-cols-2 gap-x-[clamp(1rem,2vw,2rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.7rem,1.5vh,1rem)]">
                  <div className="min-w-0">
                    <dt className="drk-label">INPUTS</dt>
                    <dd className="mt-2 flex flex-col gap-1.5">
                      {io.inputs.map((v) => (
                        <span key={v} className="flex items-center gap-2 text-[0.82rem] text-[var(--color-ink-soft)]">
                          <span
                            aria-hidden
                            className="h-px w-3 shrink-0 bg-[var(--color-hairline-strong)]"
                          />
                          {v}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="drk-label">OUTPUTS</dt>
                    <dd className="mt-2 flex flex-col gap-1.5">
                      {io.outputs.map((v) => (
                        <span key={v} className="flex items-center gap-2 text-[0.82rem] text-[var(--color-ink-soft)]">
                          <span
                            aria-hidden
                            className="h-px w-3 shrink-0 bg-[var(--color-signal)]"
                          />
                          {v}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </motion.div>
            </div>

            {/* ================= the map (desktop) ================= */}
            <div
              className={cn(
                "hidden lg:grid",
                "grid-cols-[minmax(0,0.92fr)_clamp(1.25rem,2.6vw,3rem)_minmax(0,1.55fr)_clamp(0.9rem,1.8vw,2rem)_minmax(0,0.6fr)]",
                "grid-rows-[auto_minmax(0,1fr)]",
              )}
            >
              {/* --- column headers --- */}
              <span className="drk-label col-start-1 row-start-1 pb-2">
                {stack.externalLabel}
              </span>
              <div className="col-start-3 row-start-1 flex flex-wrap items-baseline justify-between gap-x-3 pb-2">
                <span className="flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-bold tracking-[-0.04em] text-[var(--color-ink)]">
                    DRK<span className="text-[var(--color-signal)]">.</span>
                  </span>
                  <span className="drk-label">{stack.coreLabel}</span>
                </span>
                <span className="drk-label text-[var(--color-signal)]">{stack.hint}</span>
              </div>
              <span className="drk-label col-start-5 row-start-1 pb-2 text-center">
                {stack.outputLabel}
              </span>

              {/* --- external environment --- */}
              <ul
                className="col-start-1 row-start-2 flex flex-col gap-[3px]"
                style={{ paddingBlock: BODY_INSET }}
              >
                {externals.map((e) => {
                  const on = linked.has(e.key);
                  // Unlinked entries recede through their FRAME — border, ground
                  // and connector node — never by fading the label. Dimming the
                  // text put every venue name below 2:1, and a reader must be
                  // able to read the whole environment whichever layer is open.
                  return (
                    <li key={e.key} className="flex flex-1 items-center gap-1.5">
                      {/* A ruled row, not a pill. Eight bordered chips in a
                          column read as tiles; the environment is a list. */}
                      <span
                        className={cn(
                          "flex flex-1 items-center gap-2 border-b border-[var(--color-hairline)] py-[0.42rem] pr-2 text-[0.78rem] leading-tight transition-colors",
                          TW.state,
                          on
                            ? "font-medium text-[var(--color-ink-soft)]"
                            : "text-[var(--color-faint)]",
                        )}
                      >
                        {/* The slot is reserved whether or not a mark exists, so
                            the names stay on one axis. Networks carry their own
                            mark; the venues DRK names have none, and get the
                            rule instead of an invented one. */}
                        <span
                          aria-hidden
                          className="grid w-[1.15rem] shrink-0 place-items-center"
                        >
                          {hasBrandMark(e.name) ? (
                            <BrandMark name={e.name} size="1.15rem" lit={on} />
                          ) : (
                            <span
                              className="block h-px w-2 transition-colors"
                              style={{
                                background: on
                                  ? "var(--color-signal)"
                                  : "var(--color-hairline-strong)",
                              }}
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">{e.name}</span>
                        {/* Connection state must not be carried by colour and
                            opacity alone. */}
                        {on && (
                          <span className="drk-sr-only"> — connected to {layer.name}</span>
                        )}
                      </span>
                      <DataNode active={on} size={on ? 7 : 5} />
                    </li>
                  );
                })}
              </ul>

              {/* --- routes: environment → the active layer only --- */}
              <div
                className="col-start-2 row-start-2"
                style={{ paddingBlock: BODY_INSET }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  aria-hidden
                  focusable="false"
                >
                  {externals.map((e, i) => {
                    if (!linked.has(e.key)) return null;
                    const y1 = extY(i);
                    const y2 = coreY(idx);
                    return (
                      <motion.path
                        /* keyed on the layer so the routes re-draw when the
                           selection moves, rather than silently re-pointing */
                        key={`${layer.key}-${e.key}`}
                        d={`M 0 ${y1.toFixed(2)} C 44 ${y1.toFixed(2)}, 56 ${y2.toFixed(2)}, 100 ${y2.toFixed(2)}`}
                        fill="none"
                        stroke="var(--color-signal)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        initial={reduced ? false : { opacity: 0 }}
                        animate={{ opacity: 0.55 }}
                        transition={{
                          duration: 0.45,
                          delay: i * 0.05,
                          ease: EASE.ui,
                        }}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* --- DRK core: the four owned layers --- */}
              <div
                className="col-start-3 row-start-2 min-h-[clamp(15rem,37vh,27rem)] rounded-[var(--radius-surface)] border border-[var(--color-hairline-signal)] bg-[var(--color-panel)]"
                style={{
                  padding: BODY_INSET,
                  /* Emission, not a bloom. The old 0 0 60px -22px halo read as
                     generic neon; this stays inside the panel edge. */
                  boxShadow: "inset 0 0 34px -26px rgba(0,224,96,0.75)",
                }}
              >
                <ul className="flex h-full flex-col gap-[clamp(0.25rem,0.6vw,0.5rem)]">
                  {layers.map((c, j) => {
                    const on = j === idx;
                    return (
                      <li key={c.key} className="flex-1">
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setPinned(j)}
                          className={cn(
                            "flex h-full w-full items-center gap-[clamp(0.5rem,1vw,0.85rem)] border-b border-[var(--color-hairline)] px-[clamp(0.5rem,1vw,0.9rem)] py-[clamp(0.2rem,0.45vw,0.45rem)] text-left transition-colors last:border-b-0",
                            TW.state,
                            on ? "bg-[var(--color-panel-2)]" : "hover:bg-[var(--color-panel)]",
                          )}
                        >
                          {/*
                            No opacity fade on the unselected layers: at 0.42
                            their names measured 2.4:1. These four are what DRK
                            owns — all of them stay legible. Selection is marked
                            three ways instead — a rule, a weight change and a
                            ground change — so it never depends on green alone.
                          */}
                          <span
                            aria-hidden
                            className="h-full w-[2px] shrink-0 rounded-full transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                            style={{
                              background: on
                                ? "var(--color-signal)"
                                : "var(--color-hairline-strong)",
                            }}
                          />
                          {/* never truncate: these are the four things DRK owns */}
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-[0.73rem] uppercase leading-tight tracking-[0.1em]",
                                on
                                  ? "font-bold text-[var(--color-ink)]"
                                  : "font-medium text-[var(--color-muted)]",
                              )}
                            >
                              {c.name}
                            </span>
                            <span className="mt-1 block text-[0.73rem] leading-snug text-[var(--color-muted)]">
                              {c.copy}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* --- route: the active layer → output --- */}
              <div
                className="col-start-4 row-start-2"
                style={{ paddingBlock: BODY_INSET }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  aria-hidden
                  focusable="false"
                >
                  <motion.path
                    key={layer.key}
                    d={`M 0 ${coreY(idx).toFixed(2)} C 44 ${coreY(idx).toFixed(2)}, 56 50, 100 50`}
                    fill="none"
                    stroke="var(--color-signal)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.45, ease: EASE.ui }}
                  />
                </svg>
              </div>

              {/* --- output: present for the whole runway, not the last 20% --- */}
              <div className="col-start-5 row-start-2 flex flex-col items-center justify-center gap-3">
                <p className="text-center text-[0.76rem] font-semibold uppercase leading-[1.9] tracking-[0.11em] text-[var(--color-signal)]">
                  {stack.output.map((o) => (
                    <span key={o} className="block">
                      {o}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* ================= the map (mobile) =================
                A tall narrow frame cannot carry a left-to-right routing
                diagram, so it is recomposed: the owned layers are an accordion,
                and the environment below reports which entries the open layer
                reaches. Tap only — nothing here is hover-dependent. */}
            <div className="lg:hidden">
              <ul className="flex flex-col gap-2">
                {layers.map((c, j) => {
                  const on = j === idx;
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-expanded={on}
                        onClick={() => setPinned(j)}
                        className={cn(
                          "flex w-full items-center gap-3 border px-3.5 py-3 text-left transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                          on
                            ? "border-[var(--color-hairline-signal)] bg-[var(--color-panel-2)]"
                            : "border-[var(--color-hairline)]",
                        )}
                      >
                        <span
                          aria-hidden
                          className="h-8 w-[2px] shrink-0 rounded-full"
                          style={{
                            background: on
                              ? "var(--color-signal)"
                              : "var(--color-hairline-strong)",
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[0.76rem] uppercase leading-tight tracking-[0.1em]",
                              on
                                ? "font-bold text-[var(--color-ink)]"
                                : "font-medium text-[var(--color-muted)]",
                            )}
                          >
                            {c.name}
                          </span>
                          <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--color-muted)]">
                            {c.copy}
                          </span>
                        </span>
                      </button>

                      {on && (
                        <div className="rounded-b-[12px] border-x border-b border-[var(--color-hairline-signal)] bg-[var(--color-panel)] px-3.5 pb-4 pt-1">
                          <p className="text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                            {stack.io[c.key].detail}
                          </p>
                          <dl className="mt-3.5 grid grid-cols-2 gap-x-4 border-t border-[var(--color-hairline)] pt-3">
                            <div>
                              <dt className="drk-label">INPUTS</dt>
                              <dd className="mt-1.5 flex flex-col gap-1 text-[0.82rem] text-[var(--color-ink-soft)]">
                                {stack.io[c.key].inputs.map((v) => (
                                  <span key={v}>{v}</span>
                                ))}
                              </dd>
                            </div>
                            <div>
                              <dt className="drk-label">OUTPUTS</dt>
                              <dd className="mt-1.5 flex flex-col gap-1 text-[0.82rem] text-[var(--color-ink-soft)]">
                                {stack.io[c.key].outputs.map((v) => (
                                  <span key={v}>{v}</span>
                                ))}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <span className="drk-label block">{stack.externalLabel}</span>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {externals.map((e) => {
                    const on = linked.has(e.key);
                    return (
                      <li
                        key={e.key}
                        className={cn(
                          "flex items-center gap-2 rounded-[var(--radius-chip)] border px-2.5 py-1.5 text-[0.78rem] transition-colors",
                          TW.state,
                          on
                            ? "border-[var(--color-hairline-signal)] bg-[var(--color-panel-2)] font-medium text-[var(--color-ink-soft)]"
                            : "border-[color-mix(in_srgb,var(--color-hairline)_60%,transparent)] bg-[color-mix(in_srgb,var(--color-void)_55%,var(--color-panel))] text-[var(--color-faint)]",
                        )}
                      >
                        <DataNode active={on} size={on ? 7 : 5} />
                        <BrandMark name={e.name} size="1.05rem" lit={on} />
                        {e.name}
                        {on && (
                          <span className="drk-sr-only"> — connected to {layer.name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-[0.78rem] leading-relaxed text-[var(--color-fineprint)]">
                  Highlighted entries are the ones {layer.name} reaches.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-[var(--color-hairline)] pt-5">
                <div>
                  <span className="drk-label block">{stack.outputLabel}</span>
                  <p className="mt-2 text-[0.86rem] font-semibold uppercase leading-[1.7] tracking-[0.11em] text-[var(--color-signal)]">
                    {stack.output.map((o) => (
                      <span key={o} className="block">
                        {o}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
