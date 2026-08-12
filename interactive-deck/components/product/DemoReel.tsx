"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Overlay, OverlayClose } from "@/components/ui/Overlay";
import { usePrefersReducedMotion } from "@/hooks/useScene";
import { control } from "@/content/drk";
import { cn } from "@/lib/utils";

/**
 * THE DEMO REEL — Scene 10.
 *
 * The control layer beside it is a reconstruction of the surface; this is the
 * surface itself, recorded. So it is not a link to a video, it IS the video:
 * the reel starts the moment the scene reaches the viewport and walks the six
 * pages of the live application on its own, one caption at a time.
 *
 * Three rules hold it together:
 *
 *   - ONE POINT ON SCREEN AT A TIME. Six clips, but only the current one is
 *     named and described. The slide never becomes a list.
 *   - IT NEVER PLAYS AT SOMEBODY. Muted always, paused the instant it leaves
 *     the viewport or the theatre opens, and never started at all under
 *     `prefers-reduced-motion` — that visitor gets the poster and a control.
 *   - THE CARD IS THE BUTTON. The whole frame opens the theatre, where the six
 *     clips can be scrubbed with controls and read in full.
 *
 * Clips are cut from the client's recording of the real application; see
 * `control.demo` for provenance.
 */

const demo = control.demo;
const clips = demo.clips;

const clipSrc = (key: string) => `/demo/${key}.mp4`;
const clipPoster = (key: string) => `/demo/${key}.jpg`;
const chapter = (i: number) => String(i + 1).padStart(2, "0");

/* -------------------------------------------------------------------------- */

export function DemoReel({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);

  const clip = clips[i];
  const next = useCallback(() => setI((n) => (n + 1) % clips.length), []);

  /* Only ever plays while the scene is actually on screen. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.3,
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
    // A browser refusing autoplay is an expected outcome, not an error: the
    // poster stays up and the card still opens the theatre.
    void v.play().catch(() => {});
  }, [inView, open, reduced, i]);

  return (
    <div ref={wrapRef} className={cn("min-w-0", className)}>
      {/* It matters that this is the product and not another diagram, and one
          line says so once. */}
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="drk-label text-[var(--color-signal)]">{demo.subtitle}</span>
        <span className="drk-label drk-mono text-[var(--color-faint)]">
          {chapter(i)}
          <span className="text-[var(--color-dim)]"> / {chapter(clips.length - 1)}</span>
        </span>
      </div>

      <div className="relative overflow-hidden rounded-[12px] border border-[var(--color-hairline-strong)] bg-[var(--color-void)] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- the recording is silent; every frame is described in the caption beside it */}
        <video
          /* Keyed on the clip: swapping `src` on a live element needs an
             explicit load(), and a remount is the honest version of that. */
          key={clip.key}
          ref={videoRef}
          src={clipSrc(clip.key)}
          poster={clipPoster(clip.key)}
          muted
          playsInline
          preload={i === 0 ? "metadata" : "auto"}
          onEnded={next}
          className="block aspect-video w-full object-cover"
        />

        {/* Legibility ground for the caption. The recording is dark, but not
            uniformly — the P/L page is a field of bright numerals. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--color-void)] via-[color-mix(in_srgb,var(--color-void)_74%,transparent)] to-transparent"
        />

        {/* The whole frame is the trigger. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${demo.cta} — open the ${demo.title} recording`}
          className="absolute inset-0 rounded-[12px] outline-none ring-inset transition-shadow duration-[240ms] hover:ring-1 hover:ring-[var(--color-hairline-signal)] focus-visible:ring-2 focus-visible:ring-[var(--color-signal)]"
        />

        {/* The affordance sits in the corner, out of the caption's way — the
            caption is the thing that has to survive a 300px column. */}
        <span className="pointer-events-none absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-[999px] border border-[var(--color-hairline-strong)] bg-[color-mix(in_srgb,var(--color-void)_72%,var(--color-panel))] py-1 pl-1 pr-2.5">
          <span
            aria-hidden
            className="grid size-4 place-items-center rounded-full bg-[var(--color-signal)]"
          >
            <svg viewBox="0 0 12 12" className="size-2 translate-x-[0.5px]" aria-hidden>
              <path d="M3 1.5l7 4.5-7 4.5z" fill="var(--color-void)" />
            </svg>
          </span>
          <span className="drk-label whitespace-nowrap text-[0.52rem] text-[var(--color-ink-soft)]">
            {demo.cta}
          </span>
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-[clamp(0.7rem,1.1vw,1rem)]">
          {/* Chapter ticks — the deck's own progress vocabulary, made operable. */}
          {/* The hit area is a full touch target; only the tick is thin. The
              negative margin gives the height back to the composition. */}
          <div className="pointer-events-auto -mb-2 flex items-center gap-1.5">
            {clips.map((c, n) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setI(n)}
                aria-label={`${chapter(n)} — ${c.name}`}
                aria-current={n === i ? "true" : undefined}
                className="group flex min-h-[34px] items-center"
              >
                <span
                  className="block h-[2px] transition-all duration-[280ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] group-hover:bg-[var(--color-signal)]"
                  style={{
                    width: n === i ? 26 : 12,
                    background:
                      n === i ? "var(--color-signal)" : "var(--color-hairline-strong)",
                  }}
                />
              </button>
            ))}
          </div>

          <span className="mt-1.5 flex min-w-0 items-baseline gap-2.5">
            <span className="drk-label drk-mono shrink-0 text-[var(--color-signal)]">
              {chapter(i)}
            </span>
            <span className="min-w-0 text-[clamp(0.9rem,1.05vw,1.05rem)] font-medium leading-tight text-[var(--color-ink)]">
              {clip.name}
            </span>
          </span>
        </div>
      </div>

      {/* The point being made, outside the frame so the frame stays clean. */}
      <p className="mt-2.5 min-h-[2.4rem] text-[0.8rem] leading-relaxed text-[var(--color-muted)]">
        {clip.copy}
      </p>

      <DemoTheatre
        open={open}
        onClose={() => setOpen(false)}
        index={i}
        onSelect={setI}
        reduced={reduced}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The full recording, at size. Same six clips, now with controls and the whole
 * walkthrough legible at once — this is where a viewer who wants the detail
 * goes, so here the list IS the point.
 */
function DemoTheatre({
  open,
  onClose,
  index,
  onSelect,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  index: number;
  onSelect: (i: number) => void;
  reduced: boolean;
}) {
  const clip = clips[index];
  const next = useCallback(
    () => onSelect((index + 1) % clips.length),
    [index, onSelect],
  );

  return (
    <Overlay open={open} onClose={onClose} label={demo.title} className="max-w-[78rem]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-hairline)] px-[clamp(1rem,2vw,1.5rem)] py-3">
        <div className="min-w-0">
          <h2 className="truncate text-[0.98rem] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
            {demo.title}
          </h2>
          <p className="drk-label mt-0.5 text-[var(--color-signal)]">{demo.subtitle}</p>
        </div>
        <OverlayClose onClose={onClose} />
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,0.86fr)]">
        <div className="min-w-0 border-b border-[var(--color-hairline)] lg:border-b-0 lg:border-r">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- silent screen recording; described in the panel beside it */}
          <video
            key={clip.key}
            src={clipSrc(clip.key)}
            poster={clipPoster(clip.key)}
            controls
            autoPlay={open && !reduced}
            muted
            playsInline
            preload="auto"
            onEnded={next}
            className="block max-h-[62vh] w-full bg-black"
          />
          <div className="px-[clamp(1rem,2vw,1.5rem)] py-4">
            <span className="flex items-baseline gap-2.5">
              <span className="drk-label drk-mono text-[var(--color-signal)]">
                {chapter(index)}
              </span>
              <span className="text-[1.02rem] font-medium leading-tight text-[var(--color-ink)]">
                {clip.name}
              </span>
            </span>
            <p className="mt-1.5 max-w-[62ch] text-[0.86rem] leading-relaxed text-[var(--color-muted)]">
              {clip.copy}
            </p>
          </div>
        </div>

        <ol className="min-w-0">
          {clips.map((c, n) => {
            const on = n === index;
            return (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => onSelect(n)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-[var(--color-hairline)] px-[clamp(1rem,1.6vw,1.35rem)] py-3 text-left transition-colors duration-[220ms]",
                    on
                      ? "bg-[color-mix(in_srgb,var(--color-signal)_7%,transparent)]"
                      : "hover:bg-[var(--color-panel)]",
                  )}
                >
                  <span
                    aria-hidden
                    className="mt-[0.35rem] block h-px w-4 shrink-0"
                    style={{
                      background: on
                        ? "var(--color-signal)"
                        : "var(--color-hairline-strong)",
                    }}
                  />
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "drk-label drk-mono shrink-0",
                          on ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                        )}
                      >
                        {chapter(n)}
                      </span>
                      <span
                        className={cn(
                          "truncate text-[0.92rem] font-medium leading-tight",
                          on ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]",
                        )}
                      >
                        {c.name}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.78rem] leading-snug text-[var(--color-muted)]">
                      {c.copy}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          <li className="px-[clamp(1rem,1.6vw,1.35rem)] py-3">
            <p className="drk-label text-[var(--color-fineprint)]">{demo.note}</p>
          </li>
        </ol>
      </div>
    </Overlay>
  );
}
