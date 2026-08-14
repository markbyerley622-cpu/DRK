"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { Digits, Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { money, moneyPrecise, programEconomics, projection } from "@/content/drk";
import { cn, range } from "@/lib/utils";
import { TW } from "@/lib/motion";

/**
 * SCENE 15 — PROJECTIONS  (act three of five)
 *
 * Scene 13 named the five revenue lines. Scene 14 showed why the earnings per
 * mandate rise. This scene is the only place in the deck that prices any of it,
 * and it answers the third and last financial question: WHAT COULD THAT BECOME?
 *
 * Composition is a deliberate split, because the two halves are read by two
 * different people in two different ways:
 *
 *   LEFT   the trajectory. Three bars, one number each. This is what a partner
 *          takes away from a ten-second glance, and it ends on $21.5M.
 *   RIGHT  the table. Five lines by three years, every cell legible. This is
 *          what an analyst opens the laptop for.
 *
 * NOTHING HERE IS TYPED TWICE. Every figure resolves to `projection` in
 * content/drk.ts, and the column totals, the row totals and the cumulative are
 * all COMPUTED from the line items — so a cell edited in the data cannot leave
 * a stale total on the page. `validateFinancials()` guards the published
 * headline numbers against that computation.
 *
 * The Y3 figure here is $14.4M. Scene 14's Y3 figure is $10.1M. They measure
 * different things and the deck says so in both places rather than hoping
 * nobody notices — see VER-13.
 */

const { lines, totals, yearLabels } = projection;
const YEAR_TOTALS = [totals.y1, totals.y2, totals.y3];
const MAX_TOTAL = Math.max(...YEAR_TOTALS);

export function Projections() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);

  const head = range(p, 0.02, 0.14);
  const bars = range(p, 0.1, 0.55);
  const table = range(p, 0.3, 0.86);
  const close = range(p, 0.84, 1);

  return (
    <Scene
      sceneRef={ref}
      id="projections"
      index="15"
      title="Three-year revenue projection"
      height="320vh"
    >
      <SceneStage>
        <SceneShell>
          <div
            className="drk-scrim max-w-[62ch]"
            style={{ opacity: scrub ? 0.25 + head * 0.75 : 1 }}
          >
            <SceneHead index="15" eyebrow="PROJECTIONS" size="h2">
              {projection.headline.line1}{" "}
              <Signal>{projection.headline.signal}</Signal>{" "}
              {projection.headline.line2}
            </SceneHead>

            <p className="drk-lede">
              {projection.support.plain}
              <Signal>{projection.support.signal}</Signal>
            </p>
          </div>

          <div className="mt-[clamp(1.4rem,3.2vh,2.5rem)] grid items-start gap-x-[clamp(1.5rem,3.5vw,3.5rem)] gap-y-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* ================= LEFT — the trajectory ================= */}
            <div>
              <span className="drk-label block text-[var(--color-faint)]">
                REVENUE TRAJECTORY
              </span>

              {/*
                Three bars on one shared scale. Shared is essential here — the
                whole claim is that Year 3 dwarfs Year 1, and normalising each
                bar to itself would erase exactly that.
              */}
              <div className="mt-[clamp(0.9rem,2.2vh,1.4rem)] flex flex-col gap-[clamp(0.7rem,1.7vh,1.05rem)]">
                {YEAR_TOTALS.map((v, i) => {
                  const on = scrub ? range(bars, i * 0.24, i * 0.24 + 0.52) : 1;
                  const lead = i === YEAR_TOTALS.length - 1;
                  return (
                    <div key={yearLabels[i]}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="drk-label text-[var(--color-faint)]">
                          {yearLabels[i]}
                        </span>
                        <span
                          className={cn(
                            "font-[family-name:var(--font-display)] font-semibold leading-none tracking-[-0.035em]",
                            lead ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]",
                            "text-[clamp(1.3rem,2.4vw,2rem)]",
                          )}
                        >
                          <Digits value={money(v)} />
                        </span>
                      </div>
                      <div
                        aria-hidden
                        className="mt-2 h-[5px] w-full overflow-hidden rounded-full"
                        style={{ background: "var(--color-hairline)" }}
                      >
                        <span
                          className="block h-full rounded-full transition-[width] duration-[820ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                          style={{
                            width: `${(v / MAX_TOTAL) * on * 100}%`,
                            background: lead
                              ? "var(--color-signal)"
                              : "var(--color-signal-deep)",
                            boxShadow: lead ? "0 0 12px 0 rgba(0,224,96,0.45)" : "none",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* the cumulative — the number that leaves the room with them */}
              <div
                className="mt-[clamp(1.1rem,2.6vh,1.8rem)] rounded-[10px] border px-[clamp(0.9rem,1.8vw,1.4rem)] py-[clamp(0.9rem,2.2vh,1.4rem)]"
                style={{
                  opacity: scrub ? 0.2 + close * 0.8 : 1,
                  borderColor:
                    close > 0.4 ? "var(--color-hairline-signal)" : "var(--color-hairline)",
                  background: "var(--color-panel)",
                }}
              >
                <span className="drk-label block text-[var(--color-faint)]">
                  {projection.cumulativeLabel}
                </span>
                <span className="mt-2 block font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.6vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-[var(--color-signal)]">
                  <Digits value={moneyPrecise(totals.threeYear)} />
                </span>
                {/*
                  Labelled as derived, per the brief: the supplied model states
                  no growth metric, so this multiple is arithmetic on their
                  figures rather than an assumption of theirs.
                */}
                <span className="mt-2.5 block text-[0.76rem] leading-snug text-[var(--color-muted)]">
                  {projection.derived.y1ToY3Multiple.toFixed(1)}× Year 1 revenue by Year 3{" "}
                  <span className="text-[var(--color-faint)]">(derived)</span>
                </span>
              </div>
            </div>

            {/* ================= RIGHT — the table ================= */}
            {/* Scrimmed: a financial table is the one surface in this deck where
                the travelling signal line reads as a strikethrough rather than
                as depth. */}
            {/*
              `min-w-0` is load-bearing. A grid item defaults to
              `min-width: auto`, so the table's own min-width propagated up and
              forced this column — and therefore the whole scene — wider than a
              390px viewport, pushing the trajectory figures off-screen. The
              overflow container alone does not prevent that.
            */}
            <div className="drk-scrim min-w-0" style={{ opacity: scrub ? 0.2 + table * 0.8 : 1 }}>
              <span className="drk-label block text-[var(--color-faint)]">
                3-YEAR REVENUE PROJECTIONS
              </span>

              {/*
                A real table element, not a grid of divs: five revenue lines by
                three years IS tabular data, and a screen reader should be able
                to traverse it as one.

                Desktop only. Five columns of currency cannot be read on a phone
                at any type size that is still legible, and a horizontally
                scrolling financial table in a pitch deck reads as broken rather
                than as scrollable — so below `lg` the same data is recomposed
                as stacked cards.
              */}
              <div className="mt-[clamp(0.7rem,1.8vh,1.1rem)] hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[30rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-hairline-strong)]">
                      <th scope="col" className="drk-label py-2 pr-3 font-normal text-[var(--color-faint)]">
                        REVENUE STREAM
                      </th>
                      {yearLabels.map((y) => (
                        <th
                          key={y}
                          scope="col"
                          className="drk-label py-2 pl-3 text-right font-normal text-[var(--color-faint)]"
                        >
                          {y.replace("YEAR ", "Y")}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="drk-label py-2 pl-3 text-right font-normal text-[var(--color-signal)]"
                      >
                        3-YR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l, i) => {
                      const on = scrub ? range(table, i * 0.11, i * 0.11 + 0.34) : 1;
                      return (
                        <tr
                          key={l.key}
                          className={cn(
                            "border-b border-[var(--color-hairline)] transition-opacity",
                            TW.state,
                          )}
                          style={{ opacity: 0.4 + on * 0.6 }}
                        >
                          <th
                            scope="row"
                            className="py-[clamp(0.5rem,1.3vh,0.8rem)] pr-3 text-[clamp(0.8rem,1.05vw,0.95rem)] font-medium leading-tight text-[var(--color-ink)]"
                          >
                            {l.name}
                          </th>
                          <Cell v={l.y1} />
                          <Cell v={l.y2} />
                          <Cell v={l.y3} />
                          <Cell v={l.total} tone="signal" />
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--color-hairline-signal)]">
                      <th
                        scope="row"
                        className="drk-label py-[clamp(0.7rem,1.7vh,1rem)] pr-3 text-[var(--color-ink-soft)]"
                      >
                        {projection.totalLabel}
                      </th>
                      <TotalCell v={totals.y1} />
                      <TotalCell v={totals.y2} />
                      <TotalCell v={totals.y3} />
                      <TotalCell v={totals.threeYear} lead />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* ---- the same five lines, recomposed for a phone ---- */}
              <ul className="mt-[clamp(0.7rem,1.8vh,1.1rem)] flex flex-col lg:hidden">
                {lines.map((l) => (
                  <li
                    key={l.key}
                    className="border-b border-[var(--color-hairline)] py-3 last:border-b-0"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[0.92rem] font-medium leading-tight text-[var(--color-ink)]">
                        {l.name}
                      </span>
                      <span className="drk-tnum shrink-0 text-[0.92rem] font-semibold leading-none text-[var(--color-signal)]">
                        {money(l.total)}
                      </span>
                    </div>
                    <dl className="mt-2 flex gap-x-5">
                      {([l.y1, l.y2, l.y3] as const).map((v, i) => (
                        <div key={yearLabels[i]} className="flex items-baseline gap-1.5">
                          <dt className="drk-label text-[0.5rem] text-[var(--color-faint)]">
                            {yearLabels[i].replace("YEAR ", "Y")}
                          </dt>
                          <dd
                            className={cn(
                              "drk-tnum text-[0.82rem] leading-none",
                              v === 0
                                ? "text-[var(--color-dim)]"
                                : "text-[var(--color-ink-soft)]",
                            )}
                          >
                            {money(v)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}

                <li className="mt-1 flex items-baseline justify-between gap-3 border-t-2 border-[var(--color-hairline-signal)] pt-3">
                  <span className="drk-label text-[var(--color-ink-soft)]">
                    {projection.totalLabel}
                  </span>
                  <span className="drk-tnum shrink-0 text-[1.05rem] font-semibold leading-none text-[var(--color-signal)]">
                    {moneyPrecise(totals.threeYear)}
                  </span>
                </li>
              </ul>

              {/*
                THE DISTINCTION, REPEATED. It appears on Scene 14 and again here
                because these are the only two scenes carrying a Year 3 number,
                and whichever one the reader lands on first must inoculate them
                against the other.
              */}
              <div
                className="mt-[clamp(0.9rem,2.2vh,1.4rem)] border-t border-[var(--color-hairline)] pt-3"
                style={{ opacity: scrub ? 0.15 + close * 0.85 : 1 }}
              >
                <dl className="flex flex-wrap gap-x-8 gap-y-2">
                  <div>
                    <dt className="drk-label text-[0.5rem] text-[var(--color-faint)]">
                      {programEconomics.distinction.projectionLabel} · Y3
                    </dt>
                    <dd className="drk-tnum mt-1 text-[0.95rem] font-medium leading-none text-[var(--color-signal)]">
                      {money(totals.y3)}
                    </dd>
                  </div>
                  <div>
                    <dt className="drk-label text-[0.5rem] text-[var(--color-faint)]">
                      {programEconomics.distinction.programLabel} · Y3
                    </dt>
                    <dd className="drk-tnum mt-1 text-[0.95rem] font-medium leading-none text-[var(--color-ink-soft)]">
                      {money(programEconomics.years[2].earnings)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-2.5 max-w-[64ch] text-[0.74rem] leading-relaxed text-[var(--color-faint)]">
                  {programEconomics.distinction.note} {projection.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

function Cell({ v, tone = "plain" }: { v: number; tone?: "plain" | "signal" }) {
  return (
    <td
      className={cn(
        "drk-tnum py-[clamp(0.5rem,1.3vh,0.8rem)] pl-3 text-right text-[clamp(0.8rem,1.05vw,0.95rem)] leading-none",
        tone === "signal" ? "text-[var(--color-signal)]" : "text-[var(--color-ink-soft)]",
        /* A zero is a fact about the model, not missing data — dim it so the
           eye skips it, but never hide it. */
        v === 0 && "text-[var(--color-dim)]",
      )}
    >
      {money(v)}
    </td>
  );
}

function TotalCell({ v, lead = false }: { v: number; lead?: boolean }) {
  return (
    <td
      className={cn(
        "drk-tnum py-[clamp(0.7rem,1.7vh,1rem)] pl-3 text-right font-semibold leading-none",
        lead
          ? "text-[clamp(0.95rem,1.35vw,1.2rem)] text-[var(--color-signal)]"
          : "text-[clamp(0.85rem,1.15vw,1.02rem)] text-[var(--color-ink)]",
      )}
    >
      {moneyPrecise(v)}
    </td>
  );
}
