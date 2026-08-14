"use client";

import { useState } from "react";
import { contentVerifyTodos, sourceNote, validateFinancials } from "@/content/drk";
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

        {/*
          FINANCIAL ARITHMETIC GUARD.
          Always visible, never behind the toggle — a broken total is the one
          failure in this deck that an investor will catch before we do, so it
          has to be impossible to miss while reviewing.
        */}
        <FinancialCheck />

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

/* -------------------------------------------------------------------------- */

/**
 * Runs the financial model's own arithmetic guards and reports the result.
 *
 * Green is the expected state and says so explicitly rather than rendering
 * nothing — silence is indistinguishable from a check that never ran.
 */
function FinancialCheck() {
  const problems = validateFinancials();
  const ok = problems.length === 0;

  return (
    <div
      className="mt-7 rounded-[9px] border px-4 py-3"
      style={{
        borderColor: ok ? "var(--color-hairline-signal)" : "var(--color-warn)",
        background: "var(--color-panel)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: ok ? "var(--color-signal)" : "var(--color-warn)" }}
        />
        <span
          className="drk-label"
          style={{ color: ok ? "var(--color-signal)" : "var(--color-warn)" }}
        >
          FINANCIAL MODEL — {ok ? "ARITHMETIC CONSISTENT" : `${problems.length} PROBLEM(S)`}
        </span>
      </div>

      {ok ? (
        <p className="mt-2 text-[0.78rem] leading-relaxed text-[var(--color-muted)]">
          Column totals, per-line three-year totals, the $21.5M cumulative, and
          programs × average earnings all reconcile. Scene 12&rsquo;s revenue-line
          names match the projected lines, and the two Year&nbsp;3 figures remain
          distinct ($14.4M total revenue vs $10.1M managed-program earnings).
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1">
          {problems.map((p) => (
            <li key={p.id} className="text-[0.78rem] leading-relaxed text-[var(--color-ink-soft)]">
              <span className="drk-mono text-[var(--color-warn)]">{p.id}</span> — {p.detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
