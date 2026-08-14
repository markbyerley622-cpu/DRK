"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Scene, SceneStage, SceneShell } from "@/components/deck/Scene";
import { DemoTheatre } from "@/components/product/DemoTheatre";
import { Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { control } from "@/content/drk";
import { cn } from "@/lib/utils";

/**
 * SCENE 12 — THE LIVE SYSTEM
 *
 * Scene 10 hands the viewer a surface they can operate. This one shows them
 * that the surface is real, at the only scale that makes the point: the
 * recording is the scene. Roughly four fifths of the frame is product, the
 * chrome around it is a rail and a caption, and nothing else is on screen.
 *
 * It is the proof bridge — thesis on one side, business model on the other —
 * so it is deliberately NOT a card in another slide's margin, which is what it
 * was when it lived inside Scene 10.
 *
 * ONE SYSTEM, SIX SURFACES. The six clips share a single machined shell with a
 * persistent environment strip, so switching modules reads as changing page
 * inside an application, not as advancing a carousel. The player never stops:
 * a clip ends, the next begins, the rail moves with it.
 *
 * WHAT IT COSTS. Only the active clip is fetched. Desktop warms the next one so
 * the hand-off is seamless; mobile never does, because a deck opened from a
 * Telegram link on cellular should not speculatively pull video. Everything
 * pauses off screen, and under `prefers-reduced-motion` nothing autoplays at
 * all — the poster stands in and the rail still works.
 */

const demo = control.demo;
const clips = demo.clips;
const labels = demo.railLabels;

const clipSrc = (key: string) => `/demo/${key}.mp4`;
const clipPoster = (key: string) => `/demo/${key}.jpg`;
const chapter = (i: number) => String(i + 1).padStart(2, "0");

export function Demo() {
  const ref = useRef<HTMLElement>(null);
  const { isDesktop, reduced } = useSceneNarrative(ref);

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  const clip = clips[i];
  const next = useCallback(() => setI((n) => (n + 1) % clips.length), []);

  const select = useCallback((n: number) => {
    setReady(false);
    setI(n);
  }, []);

  /* Nothing plays, and nothing is fetched, until the scene is actually here. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced || !inView || open) {
      v.pause();
      return;
    }
    void v.play().catch(() => {});
  }, [inView, open, reduced, i]);

  /* Warm the NEXT clip, desktop only, and only once the current one is up. */
  useEffect(() => {
    if (!isDesktop || !inView || reduced || !ready) return;
    const el = document.createElement("link");
    el.rel = "prefetch";
    el.as = "video";
    el.href = clipSrc(clips[(i + 1) % clips.length].key);
    document.head.appendChild(el);
    return () => el.remove();
  }, [i, isDesktop, inView, reduced, ready]);

  return (
    <Scene
      sceneRef={ref}
      id="demo"
      index="12"
      title="The live DRK application"
      height={isDesktop ? "260vh" : "auto"}
    >
      <SceneStage tight>
        <SceneShell className="lg:h-full">
          <div className="flex min-h-0 flex-col lg:h-full lg:justify-center">
            {/* ---------------- the caption, kept to one line of chrome ------- */}
            <div className="flex shrink-0 flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div className="min-w-0">
                <span className="drk-label text-[var(--color-signal)]">
                  {String(11).padStart(2, "0")} — THE PRODUCT
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.7vw,2.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--color-ink)]">
                  {demo.scene.headline.line1}
                  <br className="hidden sm:block" />{" "}
                  <Signal>{demo.scene.headline.line2}</Signal>
                </h2>
              </div>

              {/* The caption lives HERE, not under the panel: below the frame
                  it cost 76px of product height, and up here it reads as the
                  module readout it actually is. It changes with the reel. */}
              <p
                key={clip.key}
                className="drk-caption-in hidden max-w-[42ch] text-[0.84rem] leading-relaxed text-[var(--color-muted)] sm:block lg:text-right"
              >
                <span className="font-medium text-[var(--color-ink-soft)]">{clip.name}.</span>{" "}
                {clip.copy}
              </p>
            </div>

            {/* ---------------- the system ---------------- */}
            {/*
              FULL-BLEED ON A PHONE. A 16:9 recording inside the shell gutter is
              196px tall on a 390px screen — a thumbnail. Breaking it out to both
              edges is the only honest way to buy back size, and it also stops
              the panel reading as a card sitting on a page: at the edges it
              reads as the surface itself. The gutter returns at `sm`.
            */}
            <div
              ref={stageRef}
              /*
                On desktop the panel CLAIMS the leftover height rather than
                dictating it: `flex-1 min-h-0` here, and the player fills what
                is left once the strip, the rail and the caption have taken
                theirs. Sizing the video first — at a fixed 16:9 — pushed the
                module rail off the bottom of the pinned stage at 900px.
              */
              className="mx-[calc(var(--gutter)*-1)] mt-[clamp(0.75rem,1.6vh,1.15rem)] flex flex-col overflow-hidden border-y border-[var(--color-hairline-strong)] bg-[var(--color-panel)] shadow-[0_30px_90px_-40px_rgba(0,0,0,1)] sm:mx-0 sm:rounded-[14px] sm:border lg:min-h-0 lg:flex-1"
            >
              {/* the environment strip — the product's own chrome */}
              <div className="flex shrink-0 items-center gap-3 border-b border-[var(--color-hairline)] px-[clamp(0.7rem,1.2vw,1.1rem)] py-2">
                <span className="font-[family-name:var(--font-display)] text-[0.8rem] font-bold tracking-[-0.04em] text-[var(--color-ink)]">
                  DRK<span className="text-[var(--color-signal)]">.</span>
                </span>
                <span className="drk-label drk-mono rounded-[4px] border border-[var(--color-hairline-signal)] px-1.5 py-[0.15rem] text-[0.5rem] text-[var(--color-signal)]">
                  {control.environment}
                </span>

                <span className="drk-label ml-auto hidden text-[0.5rem] text-[var(--color-fineprint)] lg:block">
                  {demo.note}
                </span>

                <span className="flex items-center gap-2 lg:ml-4">
                  <LiveDot on={inView && !reduced} />
                  <span className="drk-label text-[0.5rem] text-[var(--color-signal)]">
                    {demo.scene.status}
                  </span>
                </span>
              </div>

              {/* THE PRODUCT — the hero, and the reason the scene exists */}
              <div className="relative bg-black lg:min-h-0 lg:flex-1">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption -- silent screen recording, captioned in type below */}
                <video
                  key={clip.key}
                  ref={videoRef}
                  src={clipSrc(clip.key)}
                  poster={clipPoster(clip.key)}
                  muted
                  playsInline
                  /* Fetch the clip that is on screen. Nothing else. */
                  preload={inView ? "auto" : "none"}
                  onCanPlay={() => setReady(true)}
                  onEnded={next}
                  /*
                    TALLER ON A PHONE, ON PURPOSE. 16:9 across 390px is 219px —
                    a quarter of the screen, for the one thing this scene
                    exists to show. 4:3 with a centre-biased crop takes it to a
                    third, and what the crop discards is the application's outer
                    chrome: half the left rail and the right-hand padding. The
                    content column, which is the part worth seeing, gets bigger
                    rather than smaller.

                    Desktop CONTAINS instead: the panel is wider than 16:9, and
                    cover was quietly slicing the application's own counter bar
                    off the top of its own screenshot. The pillarbox it leaves
                    is black on black, so it costs nothing to show the whole
                    recording.
                  */
                  className="block aspect-[4/3] w-full object-cover object-[58%_center] sm:aspect-video sm:object-center lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:object-contain"
                />

                {/* the loading signal, while the clip resolves over the poster */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-px overflow-hidden transition-opacity duration-500",
                    ready ? "opacity-0" : "opacity-100",
                  )}
                >
                  <span className="drk-scan block h-full w-1/3 bg-[var(--color-signal)]" />
                </span>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label={`${demo.cta} — open the ${demo.title} recording full size`}
                  className="absolute inset-0 outline-none ring-inset transition-shadow duration-[240ms] hover:ring-1 hover:ring-[var(--color-hairline-signal)] focus-visible:ring-2 focus-visible:ring-[var(--color-signal)]"
                />
              </div>

              {/* ---------------- the module rail ---------------- */}
              {/*
                Horizontally scrollable by contract, not as a fallback: six
                modules never fit a phone, and a wrapped two-row grid of tabs
                reads as a form. It snaps, so it lands on whole modules.
              */}
              <div className="drk-rail flex shrink-0 snap-x snap-mandatory overflow-x-auto border-t border-[var(--color-hairline)]">
                {clips.map((c, n) => {
                  const on = n === i;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => select(n)}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "group relative flex min-h-[46px] shrink-0 snap-start items-center gap-2 px-[clamp(0.7rem,1.5vw,1.35rem)] py-2.5 text-left transition-colors duration-[240ms] sm:flex-1 sm:justify-center",
                        on ? "bg-[var(--color-panel-2)]" : "hover:bg-[var(--color-panel-2)]",
                      )}
                    >
                      {/* the active bar, on the module's own edge */}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-[2px] transition-all duration-[320ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                        style={{
                          background: on ? "var(--color-signal)" : "transparent",
                          boxShadow: on ? "0 0 12px 0 rgba(0,224,96,0.55)" : "none",
                        }}
                      />
                      <span
                        className={cn(
                          "drk-label drk-mono text-[0.52rem]",
                          /* --color-dim fails 4.5:1 at this size; --color-faint is the
                             deck's established quiet tone and passes. */
                          on ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                        )}
                      >
                        {chapter(n)}
                      </span>
                      <span
                        className={cn(
                          "drk-label whitespace-nowrap text-[0.56rem] transition-colors duration-[240ms]",
                          on
                            ? "text-[var(--color-ink)]"
                            : "text-[var(--color-faint)] group-hover:text-[var(--color-ink-soft)]",
                        )}
                      >
                        {labels[n]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------------- what you are looking at ---------------- */}
            <p
              key={clip.key}
              className="drk-caption-in mt-4 shrink-0 text-[0.86rem] leading-relaxed text-[var(--color-muted)] sm:hidden"
            >
              <span className="font-medium text-[var(--color-ink-soft)]">{clip.name}.</span>{" "}
              {clip.copy}
            </p>
          </div>
        </SceneShell>
      </SceneStage>

      <DemoTheatre
        open={open}
        onClose={() => setOpen(false)}
        index={i}
        onSelect={select}
        reduced={reduced}
      />
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

/** The one moving thing in the chrome. Breathes; never blinks. */
function LiveDot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("size-1.5 rounded-full", on && "drk-breathe")}
      style={{
        background: on ? "var(--color-signal)" : "var(--color-dim)",
        boxShadow: on ? "0 0 8px 0 rgba(0,224,96,0.8)" : "none",
      }}
    />
  );
}
