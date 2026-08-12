"use client";

import { useEffect, useRef, useState } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { ControlLayer } from "@/components/product/ControlLayer";
import { DemoPlayer } from "@/components/product/DemoPlayer";
import { Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { control } from "@/content/drk";
import { activeIndex, range } from "@/lib/utils";

/**
 * SCENE 10 — THE DRK CONTROL LAYER (centrepiece)
 *
 * Scroll walks the seven modules in sequence; the viewer can also select any
 * module and operate it directly — rows select, periods switch, metrics change,
 * executions can be traced back to their route.
 *
 * A manual selection takes over until the scroll reaches a DIFFERENT module, so
 * the two inputs never fight. The full argument still lands by scrolling alone;
 * interacting only deepens it.
 */
export function Control() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const mods = control.modules;
  const seq = range(p, 0.08, 0.95);
  // Off desktop the scroll does not drive the module: the surface opens on
  // Overview and the viewer taps through it.
  const scrollIdx = scrub ? activeIndex(seq, mods.length, 0.02) : 0;

  // Manual override, released as soon as the scroll reaches a different module.
  const [pinned, setPinned] = useState<number | null>(null);
  const lastScrollIdx = useRef(scrollIdx);
  useEffect(() => {
    if (lastScrollIdx.current !== scrollIdx) {
      lastScrollIdx.current = scrollIdx;
      setPinned(null);
    }
  }, [scrollIdx]);

  const idx = pinned ?? scrollIdx;

  // Per-module chart progress, so charts draw as each module is reached.
  const span = 1 / mods.length;
  const chartProgress =
    !scrub || pinned !== null
      ? 1
      : Math.max(0, Math.min(1, ((seq - scrollIdx * span) / span) * 1.6));

  return (
    <Scene
      sceneRef={ref}
      id="control"
      index="10"
      title="The DRK control layer"
      height={isDesktop ? "460vh" : "300vh"}
    >
      <SceneStage>
        <SceneShell>
          <div className="grid items-center gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-7 xl:grid-cols-[minmax(0,0.46fr)_minmax(0,1.54fr)]">
            {/* ---------------- narrative ---------------- */}
            <div className="drk-scrim">
              <SceneHead index="10" eyebrow="THE PRODUCT" size="h2" lede={control.support}>
                {control.headline.line1}
                <br />
                <Signal>{control.headline.line2}</Signal>
              </SceneHead>

              <p className="mt-[clamp(1.5rem,3.4vh,2.4rem)] hidden text-[0.86rem] leading-relaxed text-[var(--color-ink-soft)] xl:block">
                {control.strap}
              </p>

              {/* The reconstruction is beside this; the recording is behind it. */}
              <DemoPlayer className="mt-[clamp(1.25rem,2.8vh,1.9rem)]" />

              <p className="drk-label mt-[clamp(1rem,2.4vh,1.6rem)] hidden text-[var(--color-signal)] xl:block">
                SELECT A MODULE TO INSPECT
              </p>
            </div>

            {/* ---------------- the operating surface ---------------- */}
            <ControlLayer
              modules={mods}
              activeIndex={idx}
              onSelect={setPinned}
              chartProgress={chartProgress}
              compact={!isDesktop}
              /* No scrub means no rail progression: every module renders. */
              stacked={!scrub}
              bodyHeight="clamp(13rem,38vh,27rem)"
            />
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
