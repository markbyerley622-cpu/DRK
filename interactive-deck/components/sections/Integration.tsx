"use client";

import { useId, useMemo, useRef } from "react";
import { Scene, SceneHead, SceneShell, SceneStage } from "@/components/deck/Scene";
import { DataNode, SystemObject } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/Reveal";
import { useSceneNarrative } from "@/hooks/useScene";
import { integration } from "@/content/drk";
import { clamp01, cn, range, smoothPath } from "@/lib/utils";

/**
 * SCENE 08 — INTEGRATION SPEED
 *
 * The claim is "days, not years", and a claim stated is a claim unproven. So the
 * scene performs it: five venues pass through the six-stage connection sequence
 * live, a real route is drawn from the DRK stack to each one, and every venue
 * completes its sequence in a shorter window than the one before it. That
 * acceleration IS the argument — the last venue snaps in while the first was
 * still forming a route.
 *
 * Targets are typographic. The deck names them as chains/venues DRK adapts to,
 * not as partnerships, clients or signed integrations, and neither does this
 * (VER-06). No third-party logos are reproduced.
 */

/** The stage index at which a venue starts reporting — see `integration.sequence`. */
const TELEMETRY = 4;
/** The stage index at which the engine is attached and the node lights. */
const LINKED = 3;

/**
 * Authored integration windows.
 *
 * Each venue's window is shorter than the last (the fifth completes in roughly a
 * third of the first's runway) and the gap before it starts shrinks in step, so
 * the cadence visibly tightens down the list. Derived from the target count
 * rather than hardcoded, and normalised so the final venue lands exactly at the
 * end of the target phase — a pure function of index, so any scroll position
 * renders a valid frame.
 */
function integrationWindows(n: number) {
  const widths = Array.from({ length: n }, (_, i) => 1 - (i / Math.max(n - 1, 1)) * 0.66);
  const starts: number[] = [];
  let cursor = 0;
  widths.forEach((w, i) => {
    starts[i] = cursor;
    cursor += w * 0.55;
  });
  const end = starts[n - 1] + widths[n - 1];
  return widths.map((w, i) => ({ start: starts[i] / end, width: w / end }));
}

export function Integration() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);
  const uid = useId().replace(/:/g, "");

  const seq = integration.sequence;
  const targets = integration.targets;
  const n = targets.length;
  const windows = useMemo(() => integrationWindows(n), [n]);

  const pipelineP = range(p, 0.04, 0.24);
  const targetsP = range(p, 0.2, 0.98);
  const contrastBar = range(p, 0.08, 0.32);

  const rows = targets.map((t, i) => {
    const { start, width } = windows[i];
    const local = range(targetsP, start, start + width);
    const stage = Math.min(seq.length - 1, Math.floor(local * seq.length));
    return {
      t,
      local,
      stage,
      /* The route draws during DETECTED → ENGINE LINKED, then holds. */
      route: range(local, 0.16, 0.55),
      linked: stage >= LINKED,
      live: stage >= TELEMETRY,
      active: stage === seq.length - 1,
      /* Row centres, in the gutter SVG's own 0..100 vertical space. */
      y: ((i + 0.5) / n) * 100,
    };
  });

  /*
   * The legend follows whichever venue is mid-flight — that is the one the eye
   * is on — and falls back to the furthest stage reached once all are settled.
   */
  const inFlight = rows.filter((r) => r.local > 0 && r.local < 1);
  const focusStage = inFlight.length
    ? inFlight[inFlight.length - 1].stage
    : Math.max(0, ...rows.map((r) => r.stage));
  const onlineCount = rows.filter((r) => r.active).length;

  const contrast = integration.contrast;

  return (
    <Scene
      sceneRef={ref}
      id="integration"
      index="08"
      title="We integrate in days, not years"
      height="260vh"
    >
      <SceneStage>
        {/*
         * The stage hands the shell a definite height on desktop, so the
         * connection diagram can take the frame's free height and the venue
         * header and provenance note can sit on the frame's edges. Without a
         * definite height the grid row is content-sized and nothing can fill.
         */}
        <SceneShell className="lg:h-full">
          <div className="drk-scrim grid gap-x-[clamp(1.75rem,3.5vw,3.75rem)] gap-y-[clamp(1.75rem,4vh,2.75rem)] lg:h-full lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-stretch">
            {/* ================= narrative + the claim ================= */}
            <div className="flex min-h-0 flex-col justify-center">
              <SceneHead index="08" eyebrow="INTEGRATION SPEED" lede={integration.support}>
                {integration.headline.line1}
                <br />
                <span className="text-[var(--color-signal)]">{integration.headline.line2}</span>
              </SceneHead>

              {/*
               * The single clearest statement of the claim, and the only static
               * one — everything else in the scene demonstrates it. Both values
               * are set in type; green marks the DRK side with one short bar, so
               * the comparison is carried by length, not by a field of colour.
               */}
              <div className="mt-[clamp(1.5rem,3.2vh,2.35rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.9rem,2.2vh,1.4rem)]">
                <div className="flex flex-col gap-[clamp(0.7rem,1.7vh,1.15rem)]">
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="drk-label">{contrast.themLabel}</span>
                      <span className="drk-mono text-[clamp(1.05rem,1.85vw,1.5rem)] font-semibold tracking-[-0.02em] text-[var(--color-muted)]">
                        {contrast.themValue}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="mt-2 block h-[3px] w-full rounded-full bg-[#1c2429]"
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="drk-label text-[var(--color-ink-soft)]">
                        {contrast.usLabel}
                      </span>
                      <span className="drk-mono text-[clamp(1.05rem,1.85vw,1.5rem)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                        {contrast.usValue}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="mt-2 block h-[3px] w-full rounded-full bg-[#0f1519]"
                    >
                      <span
                        className="block h-[3px] rounded-full bg-[var(--color-signal)] transition-[width] duration-[680ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                        style={{ width: `${contrastBar * 15}%` }}
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* The vocabulary the diagram speaks, and a live legend: the marked
                  stage is the one the venue currently mid-flight is in. */}
              <ol
                className="mt-[clamp(1.35rem,2.9vh,2.05rem)] flex flex-col"
                aria-label="Connection sequence"
              >
                {seq.map((s, i) => {
                  const now = i === focusStage;
                  const reached = i <= focusStage;
                  return (
                    <li
                      key={s.key}
                      aria-current={now ? "step" : undefined}
                      className="flex items-center gap-2.5 py-[0.2rem]"
                    >
                      <span
                        aria-hidden
                        className="block h-px shrink-0 transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                        style={{
                          width: now ? 20 : 10,
                          background: now
                            ? "var(--color-signal)"
                            : reached
                              ? "var(--color-hairline-strong)"
                              : "var(--color-hairline)",
                        }}
                      />
                      <span
                        className={cn(
                          "drk-label drk-mono shrink-0",
                          now ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "drk-label truncate transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                          now ? "text-[var(--color-ink)]" : "text-[var(--color-faint)]",
                        )}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* ================= the live connection ================= */}
            {scrub ? (
              <div className="flex min-h-0 flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <span className="drk-label block truncate">{integration.targetsLabel}</span>
                    <span className="drk-label drk-mono mt-1 block text-[var(--color-signal)]">
                      {String(onlineCount).padStart(2, "0")}
                      <span className="text-[var(--color-faint)]">
                        {" / "}
                        {String(n).padStart(2, "0")} {seq[seq.length - 1].label}
                      </span>
                    </span>
                  </div>
                </div>

                {/*
                 * Natural height, not `flex-1`. The diagram is sized by the DRK
                 * stack beside it: let it absorb the whole frame and the venue
                 * rows go sparse while the route fan stretches into near-vertical
                 * stems, and capping it instead pushes the object captions out of
                 * the grid and into the provenance note below.
                 */}
                <div
                  className="mt-[clamp(0.9rem,2.2vh,1.6rem)] grid items-stretch"
                  style={{
                    gridTemplateColumns:
                      "clamp(7.5rem,13vw,11.5rem) clamp(3.5rem,11vw,11rem) minmax(0,1fr)",
                    minHeight: "clamp(14rem,42vh,25rem)",
                  }}
                >
                  {/* --- the DRK stack: the same two objects the deck already
                          introduced, on the shared scale ladder --- */}
                  <div className="flex flex-col items-center justify-center gap-[clamp(0.6rem,1.8vh,1.35rem)]">
                    {integration.pipeline.map((stage, i) => {
                      const on = range(pipelineP, i * 0.42, i * 0.42 + 0.58);
                      return (
                        <div
                          key={stage.key}
                          className="flex flex-col items-center text-center"
                          style={{
                            opacity: 0.18 + on * 0.82,
                            transform: `translateY(${(1 - on) * 10}px)`,
                          }}
                        >
                          {/* Only the Execution Engine renders. The Routing
                              Layer's plate was a stylised arrow swoosh drawn
                              beside a diagram of routing — an illustration of
                              the thing standing next to the thing. The routes
                              themselves are the routing layer. */}
                          {i === 1 ? (
                            <SystemObject id="execution-engine" scale="medium" />
                          ) : (
                            <span
                              aria-hidden
                              className="block h-px w-14 bg-[var(--color-signal)]"
                              style={{ opacity: 0.55 }}
                            />
                          )}
                          <span className="drk-label mt-2 text-[var(--color-signal)]">
                            {stage.name}
                          </span>
                          <span className="mt-1 block max-w-[19ch] text-[0.72rem] leading-snug text-[var(--color-muted)]">
                            {stage.copy}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* --- the routes: real paths that form, not progress bars --- */}
                  <div className="relative self-stretch">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full overflow-visible"
                      aria-hidden
                      focusable="false"
                    >
                      <defs>
                        {rows.map((r, i) => (
                          /*
                           * The reveal is a clip rather than stroke-dashoffset:
                           * under preserveAspectRatio="none" a normalised dash
                           * length is not honoured and shears the trace into
                           * disconnected segments.
                           */
                          <clipPath key={r.t.key} id={`rt-${uid}-${i}`}>
                            <rect x="-4" y="-10" width={r.route * 108} height="120" />
                          </clipPath>
                        ))}
                      </defs>

                      {rows.map((r, i) => {
                        /*
                         * Five points, with the mid-point on the exact vertical
                         * average: a Catmull-Rom through only the two elbows
                         * overshoots and the trace hooks above its own target.
                         */
                        const d = smoothPath(
                          [
                            [0, 50],
                            [12, 50],
                            [50, (50 + r.y) / 2],
                            [88, r.y],
                            [100, r.y],
                          ],
                          0.5,
                        );
                        return (
                          <g key={r.t.key}>
                            {/* The channel exists before the liquidity does —
                                the infrastructure is not conjured per venue. */}
                            <path
                              d={d}
                              fill="none"
                              stroke="var(--color-hairline)"
                              strokeWidth="1"
                              strokeLinecap="round"
                              vectorEffect="non-scaling-stroke"
                            />
                            <g clipPath={`url(#rt-${uid}-${i})`}>
                              <path
                                d={d}
                                fill="none"
                                stroke="var(--color-signal)"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                                opacity={r.active ? 0.85 : 0.5}
                              />
                            </g>
                          </g>
                        );
                      })}
                    </svg>

                    {/* the port the routes leave from */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <DataNode active={pipelineP > 0.85} size={9} />
                    </span>
                  </div>

                  {/* --- the venues coming online --- */}
                  <ul className="flex flex-col" aria-label={integration.targetsLabel}>
                    {rows.map((r) => {
                      const stage = seq[r.stage];
                      return (
                        <li
                          key={r.t.key}
                          className="relative flex flex-1 items-center border-b border-[var(--color-hairline)] pl-[clamp(0.7rem,1.4vw,1.15rem)] last:border-b-0"
                        >
                          {/* The node sits exactly on the route's endpoint, so
                              the join is welded rather than a floating stub. */}
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          >
                            <DataNode active={r.linked} size={9} />
                          </span>

                          <div
                            className="min-w-0 flex-1 transition-opacity duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                            style={{
                              opacity: 0.32 + clamp01(r.local * 1.4) * 0.68,
                            }}
                          >
                            <div className="flex items-baseline gap-3">
                              <span
                                /*
                                 * Never truncated. A venue name reduced to "A…"
                                 * is not information, and at 1024 that is what
                                 * truncation produced. The rule beside it takes
                                 * the remaining width instead, so the name is
                                 * always complete and the row still fits inside
                                 * the shell, clear of the fixed nav rail.
                                 */
                                className={cn(
                                  "shrink-0 text-[clamp(0.9rem,1.15vw,1.05rem)] font-medium transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                                  r.active
                                    ? "text-[var(--color-ink)]"
                                    : "text-[var(--color-faint)]",
                                )}
                              >
                                {r.t.name}
                              </span>
                              <span
                                aria-hidden
                                className="h-px min-w-0 flex-1 bg-[var(--color-hairline)]"
                              />
                              {/* Stage NAME is the state cue, not the colour. */}
                              <span
                                className={cn(
                                  "drk-label shrink-0 transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                                  r.active
                                    ? "text-[var(--color-signal)]"
                                    : r.linked
                                      ? "text-[var(--color-ink-soft)]"
                                      : "text-[var(--color-faint)]",
                                )}
                              >
                                {stage.label}
                              </span>
                            </div>

                            {/*
                             * Once a venue reports, it says what it is reporting.
                             * The source carries no per-venue fill or latency
                             * figures, so none are invented: this is the stage's
                             * own note, nothing more.
                             */}
                            <p
                              className="mt-1 min-h-[1.05rem] text-[0.72rem] leading-snug text-[var(--color-fineprint)] transition-opacity duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                              style={{ opacity: r.live ? 1 : 0 }}
                            >
                              {stage.note}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Provenance for the whole panel, so it reads as a footnote to
                    the venue list rather than as caption to the engine above. */}
                <p className="mt-[clamp(1.1rem,2.6vh,2rem)] max-w-[62ch] border-t border-[var(--color-hairline)] pt-[clamp(0.6rem,1.4vh,1rem)] text-[0.74rem] leading-relaxed text-[var(--color-fineprint)]">
                  {integration.targetsDisclaimer}
                </p>
              </div>
            ) : (
              /*
               * Mobile: a genuinely different composition. The fan-out diagram
               * needs horizontal room a phone does not have, so the same system
               * is told vertically — the DRK stack, then the sequence with its
               * notes in full, then every venue in its settled state.
               */
              <div className="flex flex-col gap-6">
                <Reveal>
                  <div className="flex items-center gap-4">
                    <SystemObject id="execution-engine" scale="small" />
                    <ol className="min-w-0 flex-1">
                      {integration.pipeline.map((stage) => (
                        <li key={stage.key} className="drk-row py-1.5">
                          <span className="drk-label block text-[var(--color-signal)]">
                            {stage.name}
                          </span>
                          <span className="mt-0.5 block text-[0.8rem] leading-snug text-[var(--color-muted)]">
                            {stage.copy}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>

                <Reveal>
                  <ol className="flex flex-col" aria-label="Connection sequence">
                    {seq.map((s, i) => (
                      <li
                        key={s.key}
                        className="flex gap-3 border-b border-[var(--color-hairline)] py-2.5 last:border-b-0"
                      >
                        <span className="drk-label drk-mono shrink-0 pt-px text-[var(--color-signal)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="drk-label block text-[var(--color-ink-soft)]">
                            {s.label}
                          </span>
                          <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--color-muted)]">
                            {s.note}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>

                <Reveal>
                  <div className="flex items-center gap-3">
                      <span className="drk-label">{integration.targetsLabel}</span>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2" aria-label={integration.targetsLabel}>
                    {rows.map((r) => (
                      <li key={r.t.key} className="drk-glass flex items-center gap-3 px-3.5 py-2.5">
                        <DataNode active={r.linked} size={9} />
                        <span className="min-w-0 flex-1 text-[0.95rem] font-medium leading-tight text-[var(--color-ink)]">
                          {r.t.name}
                        </span>
                        <span className="drk-label shrink-0 text-[var(--color-signal)]">
                          {seq[r.stage].label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[0.74rem] leading-relaxed text-[var(--color-fineprint)]">
                    {integration.targetsDisclaimer}
                  </p>
                </Reveal>
              </div>
            )}
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
