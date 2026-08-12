"use client";

import { useState } from "react";
import { Overlay, OverlayClose } from "@/components/ui/Overlay";
import { control } from "@/content/drk";
import { cn } from "@/lib/utils";

/**
 * The product proof moment on Scene 10.
 *
 * The control layer beside it is a reconstruction of the surface; this is the
 * surface itself, recorded. So the trigger is deliberately quiet — the claim is
 * already made by the interface, and this is the receipt.
 *
 * Starts muted with native controls. Autoplay with sound in an investor deck is
 * the single most hostile thing a page can do, and browsers block it anyway.
 */
export function DemoPlayer({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const demo = control.demo;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-[999px] border border-[var(--color-hairline-strong)] bg-[color-mix(in_srgb,var(--color-void)_60%,var(--color-panel))] py-1.5 pl-1.5 pr-3.5 transition-colors duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:border-[var(--color-hairline-signal)] focus-visible:border-[var(--color-hairline-signal)]",
          className,
        )}
      >
        <span
          aria-hidden
          className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-signal)]"
        >
          <svg viewBox="0 0 12 12" className="size-2.5 translate-x-[0.5px]" aria-hidden>
            <path d="M3 1.5l7 4.5-7 4.5z" fill="var(--color-void)" />
          </svg>
        </span>
        <span className="drk-label text-[var(--color-ink-soft)] transition-colors duration-[240ms] group-hover:text-[var(--color-ink)]">
          {demo.cta}
        </span>
      </button>

      <Overlay open={open} onClose={() => setOpen(false)} label={demo.title} className="max-w-[72rem]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-hairline)] px-[clamp(1rem,2vw,1.5rem)] py-3">
          <div className="min-w-0">
            <h2 className="truncate text-[0.98rem] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              {demo.title}
            </h2>
            <p className="drk-label mt-0.5 text-[var(--color-signal)]">{demo.subtitle}</p>
          </div>
          <OverlayClose onClose={() => setOpen(false)} />
        </div>

        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={demo.src}
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
          className="block max-h-[78vh] w-full bg-black"
        />
      </Overlay>
    </>
  );
}
