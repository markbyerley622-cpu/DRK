"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { Signal, SourceRef } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { compound } from "@/content/drk";
import { cn, range } from "@/lib/utils";

/**
 * SCENE 15 — COMPOUNDING  (act four of five)
 *
 * Picks up the CAPITAL pool that Scene 11 ended on and shows what it does:
 * capital → deployment → programs → performance → revenue → more liquidity →
 * more launch capacity → back to capital.
 *
 * The loop is drawn as a machined track with a thin travelling arc, not a
 * glowing green ring. A heavy luminous circle is the single most effective way
 * to make an economic argument look like a crypto landing page, and the ring is
 * on screen for the whole scene.
 *
 * Describes operating capacity only. Nothing here may imply guaranteed
 * investment return — hence the contrast row states where capital GOES, never
 * what it earns, and the note at the foot is metadata rather than argument.
 */

const R = 30;

export function Compound() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const loopP = range(p, 0.06, 0.68);
  const signals = range(p, 0.6, 0.92);
  const bridge = range(p, 0.9, 1);

  const nodes = compound.loop;
  const n = nodes.length;
  const activeNode = Math.min(n - 1, Math.floor(loopP * n * 0.999));

  // Node positions around the ring, starting at top. Rounded because
  // Math.cos/sin precision is implementation-defined and can desync hydration.
  const pos = nodes.map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.round((50 + Math.cos(a) * R) * 1000) / 1000,
      y: Math.round((50 + Math.sin(a) * R) * 1000) / 1000,
    };
  });

  return (
    <Scene
      sceneRef={ref}
      id="compound"
      index="15"
      title="Investment liquidity compounds"
      height="300vh"
    >
      <SceneStage>
        <SceneShell>
          <div className="grid items-center gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            {/* ---------------- narrative + market signals ---------------- */}
            <div className="drk-scrim">
              <SceneHead index="15" eyebrow="COMPOUNDING" size="h2">
                {compound.headline.pre}
                <Signal>{compound.headline.signal}.</Signal>
              </SceneHead>

              <p className="drk-lede">
                {compound.support.line1}
                <br />
                {compound.support.line2pre}
                <Signal>{compound.support.line2a}</Signal>
                {compound.support.line2mid}
                <Signal>{compound.support.line2b}</Signal>.
              </p>

              {/* The one thing an investor has to leave this scene with: the
                  money is an input to the machine, not a cost of running it. */}
              <div className="mt-[clamp(1.1rem,2.6vh,1.75rem)] rounded-[10px] border border-[var(--color-hairline)] p-[clamp(0.75rem,1.6vh,1rem)]">
                <span className="drk-label text-[0.56rem] tracking-[0.2em] text-[var(--color-faint)]">
                  {compound.contrast.label}
                </span>
                <p className="mt-2 flex items-center gap-2.5 text-[0.84rem] leading-snug text-[var(--color-faint)] line-through decoration-[var(--color-hairline-strong)]">
                  <span aria-hidden className="size-1 shrink-0 rounded-full bg-[var(--color-dim)]" />
                  {compound.contrast.off}
                </p>
                <p className="mt-1.5 flex items-center gap-2.5 text-[0.9rem] font-medium leading-snug text-[var(--color-signal)]">
                  <span
                    aria-hidden
                    className="size-1 shrink-0 rounded-full bg-[var(--color-signal)] shadow-[0_0_7px_0_rgba(0,224,96,0.9)]"
                  />
                  {compound.contrast.on}
                </p>
              </div>

              <ul className="mt-[clamp(1.25rem,3vh,2rem)] flex flex-col">
                {compound.signals.map((s, i) => {
                  const on = scrub ? range(signals, i * 0.22, i * 0.22 + 0.44) : 1;
                  return (
                    /* Grid, not baseline-flex: baseline alignment between an
                       oversized numeral and a three-line block mis-measures the
                       row height and lets the next block overlap it. */
                    <li
                      key={s.key}
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 border-t border-[var(--color-hairline)] py-[clamp(0.5rem,1.3vh,0.85rem)] first:border-t-0 first:pt-0"
                      /* Opacity only. A downward translate on a still-visible
                         dimmed row overlaps what follows, because transforms do
                         not affect layout. */
                      style={{ opacity: 0.3 + on * 0.7 }}
                    >
                      <span className="drk-tnum w-[4.4em] font-[family-name:var(--font-display)] text-[clamp(1.25rem,2vw,1.7rem)] font-semibold leading-tight tracking-[-0.035em] text-[var(--color-ink)]">
                        {s.value}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.9rem] leading-snug text-[var(--color-ink-soft)]">
                          <Signal>{s.claimA}</Signal> {s.claimB}
                        </p>
                        <p className="mt-0.5 text-[0.82rem] text-[var(--color-muted)]">
                          {s.desc}
                        </p>
                        <SourceRef className="mt-1">{s.source}</SourceRef>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-[clamp(0.9rem,2.2vh,1.4rem)] text-[0.85rem] text-[var(--color-muted)]">
                {compound.footer.pre}
                <Signal>{compound.footer.a}</Signal>
                {compound.footer.mid}
                <Signal>{compound.footer.b}</Signal>.
              </p>
            </div>

            {/* ---------------- the loop ---------------- */}
            <div className="relative flex flex-col items-center">
              <div
                /* Sized so the EAST label clears the fixed nav rail: the ring plus a
                   radial label is wider than the ring, and at 34rem the "MARKET
                   PROGRAMS" label reached the rail. */
                className="relative w-[86%] max-w-[min(29rem,54vh)] lg:w-full"
                style={{ aspectRatio: "1 / 1" }}
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                  {/* the machined track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="#161d21"
                    strokeWidth="7"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={R + 1.5}
                    fill="none"
                    stroke="rgba(214,228,232,0.05)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={R - 1.5}
                    fill="none"
                    stroke="#0a0f12"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* the flow. Thin, no filter, no bloom. */}
                  <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="var(--color-signal)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray={2 * Math.PI * R}
                    strokeDashoffset={2 * Math.PI * R * (1 - loopP)}
                    transform="rotate(-90 50 50)"
                    opacity="0.62"
                  />

                  {pos.map((pt, i) => {
                    const lit = i <= activeNode;
                    return (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={i === activeNode ? 1.7 : 1.15}
                        fill={lit ? "var(--color-signal)" : "#1c2429"}
                        stroke="var(--color-base)"
                        strokeWidth="1"
                        style={
                          i === activeNode
                            ? { filter: "drop-shadow(0 0 3px rgba(0,224,96,0.75))" }
                            : undefined
                        }
                      />
                    );
                  })}
                </svg>

                {/* Node labels sit OUTSIDE the ring on the radius, so no label
                    can cross the track. This is a DESKTOP device: at 390px the
                    east and west labels run off both viewport edges, so mobile
                    gets the ordered list below the ring instead. */}
                {isDesktop && pos.map((pt, i) => {
                  const node = nodes[i];
                  const lit = i <= activeNode;
                  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                  const lx = 50 + Math.cos(a) * (R + 8);
                  const ly = 50 + Math.sin(a) * (R + 8);
                  const right = Math.cos(a) > 0.25;
                  const left = Math.cos(a) < -0.25;
                  return (
                    <div
                      key={node.key}
                      className={cn(
                        "absolute w-[6rem] transition-opacity duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                        right ? "text-left" : left ? "text-right" : "text-center",
                      )}
                      style={{
                        left: `${Math.round(lx * 100) / 100}%`,
                        top: `${Math.round(ly * 100) / 100}%`,
                        transform: right
                          ? "translate(0, -50%)"
                          : left
                            ? "translate(-100%, -50%)"
                            : `translate(-50%, ${Math.sin(a) < 0 ? "-100%" : "0"})`,
                        opacity: lit ? 1 : 0.35,
                      }}
                    >
                      <span
                        className={cn(
                          "drk-label block text-[0.58rem] leading-[1.35]",
                          i === activeNode
                            ? "text-[var(--color-signal)]"
                            : lit
                              ? "text-[var(--color-ink-soft)]"
                              : "text-[var(--color-faint)]",
                        )}
                      >
                        {node.name}
                      </span>
                    </div>
                  );
                })}

                {/* the centre: what the active step means, resolving to the
                    bridge into the raise */}
                <div className="absolute inset-0 m-auto flex size-[42%] flex-col items-center justify-center px-1 text-center">
                  {bridge < 0.5 ? (
                    <>
                      <span className="drk-label text-[var(--color-signal)]">
                        {String(activeNode + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                      </span>
                      <p className="mt-2 text-[0.8rem] leading-snug text-[var(--color-muted)]">
                        {nodes[activeNode].note}
                      </p>
                    </>
                  ) : (
                    <p
                      className="text-[clamp(0.85rem,1.3vw,1.05rem)] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-signal)]"
                      style={{ opacity: bridge }}
                    >
                      {compound.bridge}
                    </p>
                  )}
                </div>
              </div>

              {!isDesktop && (
                <ol className="mt-6 w-full">
                  {nodes.map((node, i) => (
                    <li
                      key={node.key}
                      className="flex items-baseline gap-3 border-t border-[var(--color-hairline)] py-2 first:border-t-0 first:pt-0"
                    >
                      <span className="drk-mono shrink-0 text-[0.7rem] text-[var(--color-signal)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="drk-label block text-[var(--color-ink-soft)]">
                          {node.name}
                        </span>
                        <span className="mt-1 block text-[0.82rem] leading-snug text-[var(--color-muted)]">
                          {node.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {/* Metadata, not an argument: small, centred, unemphatic. */}
              <p className="mx-auto mt-4 max-w-[48ch] text-center text-[0.66rem] leading-relaxed tracking-[0.02em] text-[var(--color-fineprint)]">
                {compound.disclaimer}
              </p>
            </div>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
