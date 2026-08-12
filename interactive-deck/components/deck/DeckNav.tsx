"use client";

import { useCallback, useRef, useState } from "react";
import { sections, brand } from "@/content/drk";
import { ContactModal, ContactTrigger } from "@/components/deck/Contact";
import { useWorld } from "@/hooks/useWorld";
import { SYSTEM_STATE } from "@/lib/world";
import { cn } from "@/lib/utils";

/**
 * Persistent presentation navigation.
 *
 * Reads as system telemetry, not a website navbar:
 *  - desktop: fixed right rail carrying the machine's CURRENT STATE above the
 *    fourteen scene entries, plus a continuous progress spine
 *  - tablet/mobile: slim top bar with current scene, state and NN/NN
 *
 * The active state is never signalled by colour alone — it also carries a
 * weight change, a longer tick and `aria-current`.
 */
/** Derived, never typed twice: a hardcoded total lies the moment a scene is
    added, which is exactly what happened when Scene 11 arrived. */
const TOTAL = String(sections.length).padStart(2, "0");

export function DeckNav() {
  const { active, activeIndex, total, jump } = useWorld();
  const navRef = useRef<HTMLElement>(null);
  const sys = SYSTEM_STATE[active];
  const [contactOpen, setContactOpen] = useState(false);

  const onKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const dir =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = Math.min(sections.length - 1, Math.max(0, index + dir));
    navRef.current?.querySelectorAll<HTMLButtonElement>("[data-nav-item]")[next]?.focus();
  }, []);

  return (
    <>
      {/* ---------- total progress: one hairline across the top ---------- */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-[var(--color-hairline)]"
      >
        <div
          className="h-full bg-[var(--color-signal)] shadow-[0_0_12px_0_rgba(0,224,96,0.55)]"
          style={{ width: `${total * 100}%`, transition: "width 90ms linear" }}
        />
      </div>

      {/* ---------- wordmark ---------- */}
      <div className="drk-wordmark pointer-events-none fixed left-[clamp(1.25rem,4.5vw,3rem)] top-[0.7rem] z-45 lg:top-8">
        {/* The wordmark is split across two styled spans, so its rendered text
            has no reliable word boundaries. They are hidden from assistive tech
            and the accessible name is supplied once, in full.
            -my-2 py-2 keeps the visual position while giving a touch target. */}
        <a
          href="#intro"
          className="pointer-events-auto -my-2 inline-flex flex-col justify-center py-2 leading-none"
        >
          <span
            aria-hidden
            className="font-[family-name:var(--font-display)] text-[1.35rem] font-bold tracking-[-0.05em] text-[var(--color-ink)]"
          >
            DRK<span className="text-[var(--color-signal)]">.</span>
          </span>
          <span className="drk-sr-only">{brand.name} — back to top</span>
        </a>
      </div>

      {/* ---------- contact ----------
          Desktop only in this slot: it sits on the rail's own right offset, so
          it reads as the top of the same column rather than as a floating
          button. The rail itself is vertically centred, so nothing collides.
          Narrow viewports get the trigger inside the top bar instead. */}
      <div className="pointer-events-none fixed right-[clamp(1rem,2.5vw,2.25rem)] top-8 z-45 hidden lg:block">
        <ContactTrigger onOpen={() => setContactOpen(true)} />
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* ---------- desktop rail ---------- */}
      <nav
        ref={navRef}
        aria-label="Presentation sections"
        className="fixed right-[clamp(1rem,2.5vw,2.25rem)] top-1/2 z-40 hidden w-[9.5rem] -translate-y-1/2 lg:block"
      >
        {/* The rail always sits ON ground: a soft scrim keeps the world's
            liquidity signal from appearing to cut through the labels. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-y-8 -left-10 -right-10"
          style={{
            background:
              "radial-gradient(78% 58% at 72% 50%, color-mix(in srgb, var(--color-void) 90%, transparent) 0%, color-mix(in srgb, var(--color-void) 55%, transparent) 55%, transparent 80%)",
          }}
        />

        {/* progress spine */}
        <div aria-hidden className="absolute -left-4 top-0 h-full w-px bg-[var(--color-hairline)]">
          <div
            className="w-full bg-[var(--color-signal)]"
            style={{ height: `${total * 100}%`, transition: "height 120ms linear" }}
          />
        </div>

        {/* ---- the machine's current state ---- */}
        <div className="mb-4 border-b border-[var(--color-hairline)] pb-3 text-right">
          <span className="drk-label block text-[0.6rem] tracking-[0.24em] text-[var(--color-faint)]">
            SYSTEM
          </span>
          <span className="drk-label mt-1 flex items-center justify-end gap-1.5 text-[var(--color-signal)]">
            {sys.state}
            <span
              aria-hidden
              className="size-1 rounded-full bg-[var(--color-signal)] shadow-[0_0_7px_0_rgba(0,224,96,0.9)]"
            />
          </span>
          <span className="mt-1 block text-[0.6rem] leading-[1.5] tracking-[0.1em] text-[var(--color-faint)]">
            {sys.detail}
          </span>
        </div>

        <ul className="flex flex-col gap-[0.36rem]">
          {sections.map((s, i) => {
            const isActive = s.id === active;
            const isPast = i < activeIndex;
            return (
              <li key={s.id}>
                <button
                  data-nav-item
                  type="button"
                  onClick={() => jump(s.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex w-full items-center justify-end gap-2.5 py-[3px] text-right"
                >
                  <span
                    /* Past and future share one colour on purpose: anything
                       dimmer fails 4.5:1 on this ground. Position is carried by
                       the tick width and by aria-current instead. */
                    className={cn(
                      "drk-label transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                      isActive
                        ? "font-semibold text-[var(--color-signal)]"
                        : "text-[var(--color-faint)] group-hover:text-[var(--color-muted)]",
                    )}
                  >
                    {s.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "block h-px shrink-0 transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                      isActive
                        ? "w-6 bg-[var(--color-signal)] shadow-[0_0_8px_0_rgba(0,224,96,0.7)]"
                        : isPast
                          ? "w-3 bg-[var(--color-hairline-strong)]"
                          : "w-2 bg-[var(--color-hairline)]",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center justify-end gap-2 border-t border-[var(--color-hairline)] pt-3">
          <span className="drk-label drk-mono text-[var(--color-signal)]">
            {sections[activeIndex]?.index}
          </span>
          <span className="drk-label text-[var(--color-faint)]">/ {TOTAL}</span>
        </div>
      </nav>

      {/* ---------- mobile / tablet bar ---------- */}
      <nav
        aria-label="Presentation progress"
        className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-base)_90%,transparent)] backdrop-blur-md lg:hidden"
      >
        <div className="flex items-center justify-between gap-3 px-[clamp(1.25rem,4.5vw,3rem)] py-3 pl-28">
          <span className="drk-label truncate text-[var(--color-signal)]">
            {sections[activeIndex]?.label}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {/* Dropped below sm: the contact trigger takes this room, and the
                scene state is already carried by the label on the left. */}
            <span className="drk-label hidden text-[var(--color-faint)] md:inline">
              {sys.state}
            </span>
            <span className="drk-label drk-mono text-[var(--color-faint)]">
              {sections[activeIndex]?.index} / {TOTAL}
            </span>
            <ContactTrigger
              onOpen={() => setContactOpen(true)}
              className="px-2.5 py-1 text-[0.58rem]"
            />
          </span>
        </div>
      </nav>
    </>
  );
}
