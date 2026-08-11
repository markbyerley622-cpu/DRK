"use client";

import { MOTION } from "@/lib/motion";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { ControlLayer } from "@/components/product/ControlLayer";
import { IllustrativeBadge, Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { control, opacity, visibility } from "@/content/drk";
import { activeIndex, cn, range } from "@/lib/utils";

/**
 * SCENE 04 — VISIBILITY
 *
 * The answer to Scene 02. The four unknowns the vault produced —
 * ASSETS, PROGRAMS, EXECUTION, P/L — are resolved here into four working
 * modules of the DRK surface, in the deck's own order (source page 5).
 *
 * Critically this is the SAME software the viewer will operate in Scene 10, not
 * a second mock-up: identical chrome, identical modules, identical behaviour,
 * met earlier and shallower. Two mock-ups would read as marketing. One product
 * at two depths reads as a product.
 */

const MODULES = control.modules.filter((m) =>
  (visibility.moduleKeys as readonly string[]).includes(m.key),
);

export function Visibility() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const seq = range(p, 0.1, 0.94);
  const scrollIdx = scrub ? activeIndex(seq, MODULES.length, 0.02) : 0;

  const [pinned, setPinned] = useState<number | null>(null);
  const lastScrollIdx = useRef(scrollIdx);
  useEffect(() => {
    if (lastScrollIdx.current !== scrollIdx) {
      lastScrollIdx.current = scrollIdx;
      setPinned(null);
    }
  }, [scrollIdx]);

  const idx = pinned ?? scrollIdx;
  const span = 1 / MODULES.length;
  const chartProgress =
    !scrub || pinned !== null
      ? 1
      : Math.max(0, Math.min(1, ((seq - scrollIdx * span) / span) * 1.6));

  return (
    <Scene
      sceneRef={ref}
      id="visibility"
      index="04"
      title="Clients see what black-box MMs hide"
      height={isDesktop ? "330vh" : "auto"}
    >
      <SceneStage>
        <SceneShell>
          <div className="grid items-center gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-7 xl:grid-cols-[minmax(0,0.66fr)_minmax(0,1.34fr)]">
            {/* ---------------- narrative ---------------- */}
            <div className="drk-scrim">
              <SceneHead index="04" eyebrow="PRODUCT PROOF" size="h2">
                {visibility.headline.line1}
                <br />
                {visibility.headline.line2}
                <br />
                {visibility.headline.line3}
              </SceneHead>

              <p className="drk-lede">
                <Signal>{visibility.support.signal}</Signal>
                {visibility.support.rest}
              </p>

              {/*
                The explicit callback to Scene 02. Each unknown that left the
                vault is named again here, and the one currently open on the
                surface is lit — so the viewer sees the black box being
                answered item by item rather than being told that it was.
              */}
              <ol className="mt-[clamp(1rem,2.6vh,1.75rem)] hidden flex-col xl:flex">
                {visibility.dimensions.map((d, i) => {
                  const on = i === idx;
                  const past = i < idx;
                  return (
                    <li
                      key={d.key}
                      className="border-t border-[var(--color-hairline)] py-2.5 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="shrink-0 transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                          style={{
                            height: 1,
                            width: on ? 22 : 12,
                            background: on
                              ? "var(--color-signal)"
                              : past
                                ? "var(--color-hairline-strong)"
                                : "var(--color-hairline)",
                          }}
                        />
                        <span
                          className={cn(
                            "drk-label transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                            on
                              ? "font-semibold text-[var(--color-signal)]"
                              : "text-[var(--color-faint)]",
                          )}
                        >
                          {d.label}
                        </span>
                        {/* The unknown only becomes RESOLVED once the surface
                            has actually opened it — showing every row as
                            resolved from the start gives the section's payoff
                            away and is simply untrue of the state on screen. */}
                        <span
                          aria-hidden
                          className="drk-label ml-auto text-[0.58rem] text-[var(--color-faint)]"
                        >
                          {opacity.outputs[i]}
                          <span className="mx-1 text-[var(--color-hairline-strong)]">→</span>
                          <span
                            className={
                              on
                                ? "text-[var(--color-signal)]"
                                : past
                                  ? "text-[var(--color-faint)]"
                                  : undefined
                            }
                          >
                            {on || past ? "RESOLVED" : "—"}
                          </span>
                        </span>
                      </div>
                      {on && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={MOTION.reconfigure}
                          className="mt-1.5 pl-[34px] text-[0.84rem] leading-snug text-[var(--color-muted)]"
                        >
                          {d.note}
                        </motion.p>
                      )}
                    </li>
                  );
                })}
              </ol>

              {/* Below xl the scene stacks, so the callback compresses to one
                  row of four — the same information, a tenth of the height. */}
              <ol className="mt-[clamp(0.9rem,2.2vh,1.4rem)] flex flex-wrap gap-x-5 gap-y-2 xl:hidden">
                {visibility.dimensions.map((d, i) => {
                  const on = i === idx;
                  const past = i < idx;
                  return (
                    <li key={d.key} className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-px w-3 shrink-0"
                        style={{
                          background: on
                            ? "var(--color-signal)"
                            : past
                              ? "var(--color-hairline-strong)"
                              : "var(--color-hairline)",
                        }}
                      />
                      <span
                        className={cn(
                          "drk-label",
                          on
                            ? "font-semibold text-[var(--color-signal)]"
                            : "text-[var(--color-faint)]",
                        )}
                      >
                        {d.label}
                      </span>
                      <span aria-hidden className="drk-label text-[0.54rem] text-[var(--color-faint)]">
                        {on || past ? "RESOLVED" : "—"}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <IllustrativeBadge className="mt-[clamp(1rem,2.6vh,1.75rem)]" />
            </div>

            {/* ---------------- the surface ---------------- */}
            <ControlLayer
              modules={MODULES}
              activeIndex={idx}
              onSelect={setPinned}
              chartProgress={chartProgress}
              compact={!isDesktop}
              /* No scrub means no rail progression: every module renders. */
              stacked={!scrub}
              bodyHeight="clamp(12.5rem,34vh,23rem)"
            />
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
