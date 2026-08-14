"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { rwa } from "@/content/drk";
import { cn, range } from "@/lib/utils";
import { TW } from "@/lib/motion";

/**
 * SCENE 08 — RWA
 *
 * Scene 07 argued the onchain market is growing. This scene argues the adjacent
 * institutional one has a specific, structural gap — and that DRK's existing
 * engines are the shape of the answer.
 *
 * It is the only forward-looking scene in the deck, so it is built to be the
 * most conservative. Three things are load-bearing and must survive any future
 * edit:
 *
 *   - The claim is that tokenisation made issuance "increasingly practical",
 *     never that it "solved" anything.
 *   - The anchor deployment is labelled MAPPED, NOT MANDATED, and the
 *     disclaimer states no revenue from this market is assumed anywhere in the
 *     deck. Scenes 13-15 carry the projection and none of it is RWA.
 *   - No figure, fee or mandate for this market appears anywhere on screen.
 *
 * Composition: the problem on the left, the four engines as the answer on the
 * right, the deployment path as a rail beneath both, and the anchor as a quiet
 * panel last. The moat line sits between the problem and the engines because it
 * is the hinge of the argument — it is why four engines beat one mechanism.
 */

export function RWA() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);

  const head = range(p, 0.02, 0.14);
  const moat = range(p, 0.12, 0.26);
  const engines = range(p, 0.2, 0.62);
  const path = range(p, 0.56, 0.86);
  const anchor = range(p, 0.84, 1);

  return (
    <Scene
      sceneRef={ref}
      id="rwa"
      index="08"
      title="Tokenised assets issue well and barely trade"
      height="320vh"
    >
      <SceneStage>
        <SceneShell>
          <div className="grid items-start gap-x-[clamp(1.5rem,3.5vw,3.5rem)] gap-y-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* ---------------- the problem ---------------- */}
            <div className="drk-scrim" style={{ opacity: scrub ? 0.25 + head * 0.75 : 1 }}>
              <SceneHead index="08" eyebrow="RWA" size="h2">
                {rwa.headline.line1}
                <br />
                <Signal>{rwa.headline.signal}</Signal>
                <br />
                {rwa.headline.line2}
              </SceneHead>

              <p className="drk-lede">
                {rwa.support.plain}
                <Signal>{rwa.support.signal}</Signal>
              </p>

              {/* The hinge of the argument. Given its own rule and its own
                  breathing room because everything to the right depends on it. */}
              <p
                className="mt-[clamp(1.2rem,3vh,2rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.9rem,2.2vh,1.4rem)] text-[clamp(0.95rem,1.45vw,1.2rem)] leading-snug tracking-[-0.02em] text-[var(--color-ink-soft)]"
                style={{ opacity: scrub ? 0.15 + moat * 0.85 : 1 }}
              >
                {rwa.moat.plain}
                <span className="font-semibold text-[var(--color-signal)]">
                  {rwa.moat.signal}
                </span>
              </p>
            </div>

            {/* ---------------- the four engines ---------------- */}
            <div>
              <span className="drk-label block text-[var(--color-faint)]">
                {rwa.enginesLabel}
              </span>

              <ul className="mt-[clamp(0.7rem,1.8vh,1.1rem)] grid gap-[clamp(0.5rem,1.1vw,0.85rem)] sm:grid-cols-2">
                {rwa.engines.map((e, i) => {
                  const on = scrub ? range(engines, i * 0.18, i * 0.18 + 0.44) : 1;
                  return (
                    <li
                      key={e.key}
                      className={cn(
                        "rounded-[10px] border px-[clamp(0.75rem,1.4vw,1.05rem)] py-[clamp(0.7rem,1.6vh,1rem)]",
                        TW.state,
                      )}
                      style={{
                        opacity: 0.32 + on * 0.68,
                        transform: `translateY(${(1 - on) * 8}px)`,
                        borderColor:
                          on > 0.6 ? "var(--color-hairline-signal)" : "var(--color-hairline)",
                        background: "var(--color-panel)",
                      }}
                    >
                      <div className="flex items-baseline gap-2.5">
                        <span className="drk-mono drk-tnum shrink-0 text-[0.68rem] text-[var(--color-signal)]">
                          {e.index}
                        </span>
                        <span className="text-[clamp(0.9rem,1.2vw,1.05rem)] font-semibold leading-none tracking-[-0.02em] text-[var(--color-ink)]">
                          {e.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.78rem] italic leading-snug text-[var(--color-signal-deep)]">
                        {e.question}
                      </p>
                      <p className="mt-1.5 text-[0.78rem] leading-snug text-[var(--color-muted)]">
                        {e.copy}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ---------------- the deployment path ---------------- */}
          <div
            className="drk-scrim mt-[clamp(1.2rem,2.8vh,2rem)]"
            style={{ opacity: scrub ? 0.15 + path * 0.85 : 1 }}
          >
            <span className="drk-label block text-[var(--color-faint)]">{rwa.layersLabel}</span>

            <ol className="mt-[clamp(0.6rem,1.6vh,1rem)] grid gap-[clamp(0.5rem,1.1vw,0.85rem)] lg:grid-cols-3">
              {rwa.layers.map((l, i) => {
                const on = scrub ? range(path, i * 0.24, i * 0.24 + 0.5) : 1;
                return (
                  <li key={l.key} className="relative">
                    {/* the rail: a rule that lights as the layer comes online,
                        so the three read as a sequence rather than three cards */}
                    <span
                      aria-hidden
                      className={cn("block h-px w-full transition-colors", TW.state)}
                      style={{
                        background:
                          on > 0.7 ? "var(--color-signal)" : "var(--color-hairline-strong)",
                      }}
                    />
                    <div
                      className="pt-[clamp(0.6rem,1.4vh,0.9rem)]"
                      style={{ opacity: 0.34 + on * 0.66 }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex items-baseline gap-2.5 min-w-0">
                          <span className="drk-mono drk-tnum shrink-0 text-[0.68rem] text-[var(--color-signal)]">
                            {l.index}
                          </span>
                          <span className="text-[clamp(0.85rem,1.15vw,1rem)] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
                            {l.name}
                          </span>
                        </span>
                        {/* Capital intensity per layer — the quiet proof that
                            the sequence is fundable before the balance sheet is. */}
                        <span className="drk-label shrink-0 text-[0.5rem] text-[var(--color-faint)]">
                          {l.capital}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.78rem] leading-snug text-[var(--color-muted)]">
                        {l.note}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ---------------- the anchor deployment ---------------- */}
          <div
            className="drk-scrim mt-[clamp(1rem,2.4vh,1.7rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.85rem,2vh,1.3rem)]"
            /* Floor deliberately high. The disclaimer in this block is what
               licenses the scene to name a company DRK has no agreement with,
               so it must never be reduced to a ghost at any scroll position. */
            style={{ opacity: scrub ? 0.45 + anchor * 0.55 : 1 }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span className="drk-label text-[var(--color-warn)]">{rwa.anchor.label}</span>
              <span className="text-[clamp(0.95rem,1.5vw,1.25rem)] font-semibold tracking-[-0.025em] text-[var(--color-signal)]">
                {rwa.conclusion}
              </span>
            </div>

            <p className="mt-2.5 max-w-[86ch] text-[0.82rem] leading-relaxed text-[var(--color-ink-soft)]">
              {rwa.anchor.body}
            </p>

            {/*
              Not fine print by accident. This sentence is the reason the scene
              can name a company DRK has no agreement with, and it must never be
              removed, shortened, or moved somewhere it can be missed.
            */}
            <p className="mt-2 max-w-[86ch] text-[0.74rem] leading-relaxed text-[var(--color-faint)]">
              {rwa.anchor.disclaimer}
            </p>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
