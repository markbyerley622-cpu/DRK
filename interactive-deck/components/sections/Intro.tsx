"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell } from "@/components/deck/Scene";
import { SignalStations, StationNode, type Station } from "@/components/world/SignalStations";
import { LatencyRing } from "@/components/visuals/LatencyRing";
import { Signal, SystemObject } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { brand, intro } from "@/content/drk";
import { cn, range } from "@/lib/utils";

/**
 * SCENE 01 — SYSTEM ACTIVATION
 *
 * Opens in controlled darkness with the identity and one measurement. The
 * runtime then comes online subsystem by subsystem, and the DRK objects arrive
 * standing ON the world's liquidity signal — the same line that will carry the
 * whole experience. Nothing is placed beside a decorative graphic; everything
 * is registered against the machine.
 *
 * The investor should leave understanding one thing: DRK is an operating layer.
 */

/** x positions, held below 78% so nothing can reach the fixed nav rail. */
const STATION_X = [11, 27.5, 44, 60.5, 76];

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const boot = range(p, 0.0, 0.1);
  const cover = 1 - range(p, 0.13, 0.22);
  const headline = range(p, 0.2, 0.32);
  const labels = range(p, 0.6, 0.8);
  const support = range(p, 0.74, 0.86);
  const conclusion = range(p, 0.86, 0.98);

  const stations: Station[] = intro.runtime.map((r, i) => ({
    key: r.key,
    x: STATION_X[i + 1] ?? STATION_X[STATION_X.length - 1],
    render: ({ on, connected }) => (
      <StationBody
        label={r.label}
        object={r.object}
        on={on}
        connected={connected}
        labelOn={labels > i * 0.16}
        scale={i === 2 ? "large" : "medium"}
      />
    ),
  }));

  // The launch beacon is station 0 — the event everything else answers to.
  stations.unshift({
    key: "launch",
    x: STATION_X[0],
    render: ({ on, connected }) => (
      <StationBody
        label={intro.launchLabel}
        object="lc-beacon"
        on={on}
        connected={connected}
        labelOn={labels > 0}
        scale="medium"
      />
    ),
  });

  return (
    <Scene sceneRef={ref} id="intro" index="01" title="System activation" height="360vh">
      <SceneStage>
        {/* ======================= COVER ======================= */}
        {/*
          Controlled darkness first. The identity and ONE measurement — nothing
          else on screen — then the runtime reports itself online, subsystem by
          subsystem, before a single object appears.
        */}
        <div
          className={cn(
            "pointer-events-none z-20 flex items-center",
            scrub ? "absolute inset-0" : "relative",
          )}
          style={
            scrub
              ? { opacity: cover, visibility: cover < 0.01 ? "hidden" : "visible" }
              : undefined
          }
        >
          <SceneShell>
            <div className="grid items-end gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-px bg-[var(--color-signal)] transition-none"
                    style={{ width: `${boot * 46}px` }}
                  />
                  <span className="drk-label text-[var(--color-signal)]">
                    {intro.eyebrow}
                  </span>
                </div>

                <p className="font-[family-name:var(--font-display)] mt-[clamp(1.5rem,4vh,3rem)] text-[clamp(4rem,13vw,11.5rem)] font-bold leading-[0.8] tracking-[-0.055em] text-[var(--color-ink)]">
                  DRK<span className="text-[var(--color-signal)]">.</span>
                </p>
                <p className="drk-label mt-[clamp(1rem,2.4vh,1.75rem)] max-w-[22ch] text-[clamp(0.7rem,1.15vw,0.95rem)] leading-[1.5] tracking-[0.3em] text-[var(--color-ink-soft)]">
                  {brand.descriptor}
                </p>

                <span aria-hidden className="drk-rule mt-[clamp(1.5rem,3.5vh,2.5rem)] w-16" />
                <p className="mt-[clamp(1.1rem,2.4vh,1.6rem)] max-w-[36ch] text-[clamp(1rem,1.5vw,1.35rem)] leading-relaxed text-[var(--color-muted)]">
                  {intro.lede}
                </p>
              </div>

              {/* the runtime reporting itself online */}
              <div className="hidden flex-col items-end gap-6 justify-self-end lg:flex">
                <LatencyRing progress={Math.min(1, p * 6)} size={168} intensity={0.85} />
                <ul className="w-[13rem]">
                  {intro.runtime.map((r, i) => {
                    const on = range(p, 0.015 + i * 0.02, 0.055 + i * 0.02);
                    return (
                      <li
                        key={r.key}
                        className="flex items-center justify-between gap-3 border-b border-[var(--color-hairline)] py-[0.42rem] last:border-b-0"
                      >
                        <span
                          className="drk-label transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                          style={{
                            color: on > 0.5 ? "var(--color-ink-soft)" : "var(--color-faint)",
                          }}
                        >
                          {r.label}
                        </span>
                        <span
                          className="drk-label text-[0.58rem]"
                          style={{
                            color: on > 0.9 ? "var(--color-signal)" : "var(--color-faint)",
                          }}
                        >
                          {on > 0.9 ? "ONLINE" : "STANDBY"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </SceneShell>
        </div>

        {/* ==================== THE RUNNING SYSTEM ==================== */}
        {scrub && (
          <>
            <SignalStations stations={stations} progress={p} appear={[0.3, 0.07]} />

            <SceneShell className="relative z-10">
              <div
                className="drk-scrim max-w-[34rem]"
                style={{ opacity: headline, transform: `translateY(${(1 - headline) * 14}px)` }}
              >
                <h3 className="drk-display text-[clamp(2rem,4vw,3.6rem)]">
                  {intro.headline.pre}
                  <Signal>{intro.headline.signal}</Signal>
                  {intro.headline.post}
                  <Signal>.</Signal>
                </h3>

                <span aria-hidden className="drk-rule" />

                <p className="drk-lede" style={{ opacity: support }}>
                  {intro.support}
                </p>

                <p
                  className="drk-label mt-[clamp(1.25rem,2.6vh,2rem)] text-[var(--color-signal)]"
                  style={{ opacity: conclusion }}
                >
                  {intro.conclusion}
                </p>
              </div>
            </SceneShell>
          </>
        )}

        {/* ==================== MOBILE RECOMPOSITION ==================== */}
        {/*
          The cover above renders in flow on mobile, so the brand opening is
          never lost on a phone. The runtime then reads as a vertical stack —
          the same five stations, the same order, composed for the device.
        */}
        {!scrub && (
          <SceneShell className="relative z-10 mt-10">
            <h3 className="drk-display text-[clamp(1.8rem,7vw,2.4rem)]">
              {intro.headline.pre}
              <Signal>{intro.headline.signal}</Signal>
              {intro.headline.post}
              <Signal>.</Signal>
            </h3>
            <span aria-hidden className="drk-rule" />
            <p className="drk-lede">{intro.support}</p>

            <ol className="mt-8 flex flex-col">
              {[
                { key: "launch", label: intro.launchLabel, object: "lc-beacon" as const, note: null },
                ...intro.runtime,
              ].map((r, i, all) => (
                <RuntimeStackItem
                  key={r.key}
                  label={r.label}
                  object={r.object}
                  note={r.note}
                  last={i === all.length - 1}
                />
              ))}
            </ol>

            <p className="drk-label mt-8 text-[var(--color-signal)]">{intro.conclusion}</p>
          </SceneShell>
        )}

        {isDesktop && (
          <span
            className="drk-label pointer-events-none absolute bottom-[clamp(4rem,9vh,6rem)] left-1/2 -translate-x-1/2 text-[var(--color-faint)]"
            style={{ opacity: 1 - range(p, 0, 0.05) }}
          >
            SCROLL
          </span>
        )}
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

function StationBody({
  label,
  object,
  on,
  connected,
  labelOn,
  scale,
}: {
  label: string;
  object: "wallet" | "liquidity-wave" | "execution-engine" | "network-nodes" | "lc-beacon";
  on: number;
  connected: boolean;
  labelOn: boolean;
  scale: "medium" | "large";
}) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="flex flex-col items-center transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
        style={{ opacity: labelOn ? 1 : 0, transform: `translateY(${labelOn ? 0 : 8}px)` }}
      >
        <span
          className={cn(
            "drk-label whitespace-nowrap transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
            connected ? "text-[var(--color-ink-soft)]" : "text-[var(--color-faint)]",
          )}
        >
          {label}
        </span>
        <span
          aria-hidden
          className="mt-1.5 block h-[clamp(10px,2vh,20px)] w-px bg-gradient-to-b from-[var(--color-hairline-strong)] to-[var(--color-signal)]"
        />
      </div>

      {/* Scroll-derived: applied directly so the object tracks scroll exactly
          rather than easing behind it. */}
      <SystemObject
        id={object}
        scale={scale}
        style={{
          opacity: on,
          transform: `translateY(${(1 - on) * 14}px) scale(${0.94 + on * 0.06})`,
        }}
      />
      <StationNode connected={connected} />
    </div>
  );
}

function RuntimeStackItem({
  label,
  object,
  note,
  last = false,
}: {
  label: string;
  object: "wallet" | "liquidity-wave" | "execution-engine" | "network-nodes" | "lc-beacon";
  note: string | null;
  last?: boolean;
}) {
  return (
    <li className="relative flex items-center gap-5 pb-6 last:pb-0">
      {/* the signal, running vertically between stations */}
      {!last && (
        <span
          aria-hidden
          className="absolute bottom-0 left-[2.3rem] top-[3.4rem] w-px bg-[var(--color-signal)] opacity-55"
        />
      )}
      <SystemObject id={object} scale="small" />
      <span className="min-w-0">
        <span className="drk-label block text-[var(--color-ink-soft)]">{label}</span>
        {note && (
          <span className="mt-1 block text-[0.84rem] leading-snug text-[var(--color-muted)]">
            {note}
          </span>
        )}
      </span>
    </li>
  );
}
