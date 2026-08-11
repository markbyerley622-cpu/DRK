"use client";

import { useState } from "react";
import { contentVerifyTodos, sourceNote } from "@/content/drk";
import { SectionLabel } from "@/components/ui/primitives";

/**
 * Internal content-verification register.
 *
 * Deliberately OUTSIDE the investor narrative — after the closing thesis, in a
 * quiet, collapsed panel. It exists so the ten TODO_CONTENT_VERIFY items travel
 * with the artefact instead of living only in a docs folder that a reviewer may
 * never open. Nothing here is part of the pitch.
 */
export function VerifyNotes() {
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="verify-title"
      className="relative border-t border-[var(--color-hairline)] bg-[var(--color-void)]"
    >
      <div className="drk-shell py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionLabel>INTERNAL — NOT PART OF THE PITCH</SectionLabel>
            <h2
              id="verify-title"
              className="mt-3 text-[clamp(1.05rem,1.6vw,1.3rem)] font-semibold tracking-[-0.02em] text-[var(--color-ink-soft)]"
            >
              Content verification register
            </h2>
            <p className="mt-2 max-w-[62ch] text-[0.85rem] leading-relaxed text-[var(--color-muted)]">
              {sourceNote.statement} Items below were flagged during the source audit and{" "}
              <strong className="font-medium text-[var(--color-ink-soft)]">
                preserved exactly as supplied, not corrected
              </strong>
              . Confirm each before production release.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="verify-list"
            className="shrink-0 rounded-[9px] border border-[var(--color-hairline-strong)] bg-[var(--color-panel)] px-4 py-2 transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:border-[var(--color-hairline-signal)]"
          >
            <span className="drk-label text-[var(--color-signal)]">
              {open ? "HIDE" : "SHOW"} {contentVerifyTodos.length} ITEMS
            </span>
          </button>
        </div>

        {open && (
          <ol id="verify-list" className="mt-7 flex flex-col gap-5">
            {contentVerifyTodos.map((t) => (
              <li
                key={t.id}
                className="grid gap-x-6 gap-y-2 border-t border-[var(--color-hairline)] pt-4 md:grid-cols-[7rem_minmax(0,1fr)]"
              >
                <div>
                  <span className="drk-label drk-mono text-[var(--color-warn)]">{t.id}</span>
                  <span className="mt-1 block text-[0.78rem] leading-snug text-[var(--color-fineprint)]">
                    {t.where}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.88rem] leading-relaxed text-[var(--color-ink-soft)]">
                    {t.issue}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-[var(--color-muted)]">
                    <span className="text-[var(--color-signal)]">Action: </span>
                    {t.action}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-8 border-t border-[var(--color-hairline)] pt-5 text-[0.76rem] leading-relaxed text-[var(--color-fineprint)]">
          Source of truth: {sourceNote.deck} · Visual reference: {sourceNote.brandBoards}
        </p>
      </div>
    </section>
  );
}
