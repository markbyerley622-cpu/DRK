"use client";

import { useCallback } from "react";
import { Overlay, OverlayClose } from "@/components/ui/Overlay";
import { control } from "@/content/drk";
import { cn } from "@/lib/utils";

/**
 * THE DEMO THEATRE
 *
 * The expanded view of the recording, opened from the hero player on Scene 11.
 * Here the list IS the point: a viewer who has clicked through wants the detail,
 * so all six modules are described in full beside a player with real controls.
 */

const demo = control.demo;
const clips = demo.clips;

const clipSrc = (key: string) => `/demo/${key}.mp4`;
const clipPoster = (key: string) => `/demo/${key}.jpg`;
const chapter = (i: number) => String(i + 1).padStart(2, "0");

/* -------------------------------------------------------------------------- */

/**
 * The full recording, at size. Same six clips, now with controls and the whole
 * walkthrough legible at once — this is where a viewer who wants the detail
 * goes, so here the list IS the point.
 */
export function DemoTheatre({
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
