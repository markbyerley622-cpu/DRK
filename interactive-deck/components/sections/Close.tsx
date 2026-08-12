"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell } from "@/components/deck/Scene";
import { SignalStations, StationNode, type Station } from "@/components/world/SignalStations";
import { Signal, SystemObject } from "@/components/ui/primitives";
import { Reveal, MaskLine } from "@/components/motion/Reveal";
import { useSceneNarrative } from "@/hooks/useScene";
import { ContactLinks } from "@/components/deck/Contact";
import { brand, close, contact } from "@/content/drk";
import { range } from "@/lib/utils";

/**
 * SCENE 14 — CLOSE
 *
 * Returns to the opening. The world's liquidity signal resolves back into the
 * rising line it came online on in Scene 01, and only two objects remain — the
 * Execution Beacon and the Liquidity Wave, the two the experience opened with —
 * standing on that same line.
 *
 * Everything else is stripped: no panels, no data, no chrome, no instrument
 * strip. The last frame of a product film, not a website footer.
 */
export function Close() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

    // Runs to the very end of the runway: an earlier ramp left the closing
  // frames identical, so the final impression stopped responding to scroll.
  const resolve = scrub ? range(p, 0.08, 0.86) : 1;
  const settle = scrub ? range(p, 0.6, 1) : 1;

  /*
   * Both plates are the p10 lifecycle-row harvests: isolated on black with no
   * ambient smoke or ground, so nothing reads as a crop rectangle at scale.
   * Held to the right half and low, clear of the headline and of the nav rail.
   */
  const stations: Station[] = [
    {
      key: "beacon",
      x: 58,
      render: ({ connected }) => (
        <div className="relative flex flex-col items-center">
          <SystemObject id="lc-beacon" scale="large" style={{ opacity: 0.35 + resolve * 0.65 }} />
          <StationNode connected={connected} />
        </div>
      ),
    },
    {
      key: "wave",
      x: 76,
      render: ({ connected }) => (
        <div className="relative flex flex-col items-center">
          <SystemObject
            id="liquidity-wave"
            scale="hero"
            style={{ opacity: 0.35 + resolve * 0.65 }}
          />
          <StationNode connected={connected} />
        </div>
      ),
    },
  ];

  return (
    <Scene sceneRef={ref} id="close" index="14" title="The next market maker" height="200vh">
      {/* No instrument strip: the closing frame carries nothing but the thesis. */}
      <SceneStage strip={false}>
        {scrub && <SignalStations stations={stations} progress={p} appear={[0.06, 0.1]} />}

        <SceneShell className="relative z-10">
          <div className="drk-scrim max-w-[44rem]">
            <h3 className="drk-display text-[clamp(2.2rem,5.2vw,4.8rem)] leading-[0.98]">
              <MaskLine>{close.headline.line1}</MaskLine>
              <MaskLine delay={0.1}>{close.headline.line2}</MaskLine>
            </h3>

            {/* One Reveal, explicit spacing: margins between separate reveal
                wrappers collapse unpredictably. */}
            <Reveal delay={0.24}>
              <div className="pt-[clamp(1.5rem,4vh,2.75rem)]">
                <span aria-hidden className="block h-px w-14 bg-[var(--color-signal)]" />
                <p className="max-w-[30ch] pt-[clamp(1.25rem,3vh,2rem)] text-[clamp(1.1rem,2.1vw,1.8rem)] font-medium leading-snug tracking-[-0.02em] text-[var(--color-ink-soft)]">
                  {close.support.pre}
                  <Signal>{close.support.signal}</Signal>
                  {close.support.post}
                </p>

                {/* What the investor is actually buying. Last line of the deck
                    before the ask, and the only place this is said. */}
                <p
                  className="max-w-[34ch] pt-[clamp(1rem,2.4vh,1.5rem)] text-[0.95rem] leading-relaxed text-[var(--color-muted)]"
                  style={{ opacity: 0.25 + settle * 0.75 }}
                >
                  {close.position.pre}
                  <Signal>{close.position.signal}</Signal>
                  {close.position.post}
                </p>
                {/* The next step, at the one moment the viewer is looking for
                    one. Sits above the signature so the signature stays the
                    last thing on screen. */}
                <div
                  className="pt-[clamp(1.75rem,4.5vh,2.75rem)]"
                  style={{ opacity: 0.25 + settle * 0.75 }}
                >
                  <span className="drk-label text-[var(--color-faint)]">
                    {contact.closingLabel}
                  </span>
                  <ContactLinks className="mt-3 max-w-[19rem]" />
                </div>

                <p
                  className="drk-label pt-[clamp(1.75rem,4.5vh,2.75rem)] tracking-[0.34em] text-[var(--color-signal)]"
                  style={{ opacity: 0.25 + settle * 0.75 }}
                >
                  {close.signature}
                </p>
              </div>
            </Reveal>
          </div>

          {/* mobile: the two objects still close the loop, stacked under the
              thesis rather than dropped */}
          {/* One ground plane, one shared scale. At two steps apart the beacon
              read as an unrelated thumbnail beside the wave rather than as its
              partner in the closing frame. */}
          {!scrub && (
            <div className="relative mt-10 flex items-end justify-center gap-6">
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[0.35rem] h-px bg-gradient-to-r from-transparent via-[var(--color-signal)] to-transparent opacity-50"
              />
              <SystemObject id="lc-beacon" scale="large" />
              <SystemObject id="liquidity-wave" scale="large" />
            </div>
          )}
        </SceneShell>

        {isDesktop && (
          <span className="drk-label absolute bottom-6 right-[var(--gutter)] text-[var(--color-faint)]">
            {brand.confidential}
          </span>
        )}
      </SceneStage>
    </Scene>
  );
}
