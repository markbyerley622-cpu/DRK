"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { Digits, Signal } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { money, programEconomics } from "@/content/drk";
import { cn, range } from "@/lib/utils";
import { TW } from "@/lib/motion";

/**
 * SCENE 14 — PROGRAM ECONOMICS  (act two of five)
 *
 * The scene answers ONE question, and it is the question a good investor asks
 * immediately after seeing five revenue lines:
 *
 *     "Does this only work if you sign a lot more customers?"
 *
 * No. Programs grow 20 -> 32 -> 36, which is 1.8x. Earnings grow $1.5M ->
 * $10.1M, which is 6.7x. The gap between those two numbers IS the argument:
 * the business improves because each mandate gets bigger, not because the
 * customer list does.
 *
 * So the composition is built to make that gap visible rather than stated. Two
 * bars share every year panel — program count and average earnings per program
 * — drawn on their own scales against the SAME track. The count bar barely
 * moves. The earnings bar runs away from it. A reader who never looks at a
 * numeral still leaves with the point.
 *
 * The headline number on each panel is managed-program earnings, and it is
 * labelled as such every single time it appears. It is NOT total revenue —
 * Scene 15 owns that figure, and Y3 differs ($10.1M here, $14.4M there). The
 * two are different cuts of the business on different assumptions, never a
 * subset of one another. See VER-13, and the distinction strip at the foot of
 * this scene, which exists solely to stop that misreading.
 */

const YEARS = programEconomics.years;
const MAX_PROGRAMS = Math.max(...YEARS.map((y) => y.programs));
const MAX_AVG = Math.max(...YEARS.map((y) => y.avgPerProgram));

export function ProgramEconomics() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);

  const head = range(p, 0.02, 0.14);
  const panels = range(p, 0.12, 0.82);
  const close = range(p, 0.82, 1);

  return (
    <Scene
      sceneRef={ref}
      id="economics"
      index="14"
      title="Larger mandates change the earnings curve"
      height="300vh"
    >
      <SceneStage>
        <SceneShell>
          <div className="drk-scrim" style={{ opacity: scrub ? 0.25 + head * 0.75 : 1 }}>
            <SceneHead index="14" eyebrow="PROGRAM ECONOMICS" size="h2">
              {programEconomics.headline.line1}
              <br />
              <Signal>{programEconomics.headline.signal}</Signal>
            </SceneHead>

            <p className="drk-lede max-w-[58ch]">
              {programEconomics.support.plain}
              <Signal>{programEconomics.support.signal}</Signal>
            </p>
          </div>

          {/* ---------------- three year panels ---------------- */}
          <div className="mt-[clamp(1.5rem,3.6vh,2.75rem)] grid gap-[clamp(0.75rem,1.6vw,1.25rem)] lg:grid-cols-3">
            {YEARS.map((y, i) => {
              const on = scrub ? range(panels, i * 0.26, i * 0.26 + 0.52) : 1;
              return <YearPanel key={y.key} year={y} on={on} lead={i === YEARS.length - 1} />;
            })}
          </div>

          {/* ---------------- the conclusion ---------------- */}
          {/* `drk-scrim`: the world signal runs straight through this block at
              1440x900 and struck a line through the distinction copy — the one
              paragraph on the scene that must stay legible. */}
          <div
            className="drk-scrim mt-[clamp(1.1rem,2.6vh,1.9rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.85rem,2vh,1.35rem)]"
            style={{ opacity: scrub ? 0.15 + close * 0.85 : 1 }}
          >
            <p className="text-[clamp(1rem,1.7vw,1.4rem)] font-semibold tracking-[-0.025em] text-[var(--color-signal)]">
              {programEconomics.conclusion}
            </p>

            {/*
              THE ANTI-CONFUSION STRIP.
              Two numbers this deck shows for Year 3 differ, and an investor who
              spots that without an explanation stops trusting every other
              figure. So the distinction is made here, on the page, before they
              reach Scene 15 — not buried in a footnote afterwards.
            */}
            <p className="mt-3 max-w-[76ch] text-[0.78rem] leading-relaxed text-[var(--color-muted)]">
              <span className="drk-label text-[var(--color-ink-soft)]">
                {programEconomics.distinction.programLabel}
              </span>{" "}
              — {programEconomics.distinction.note}
            </p>

            <p className="mt-2 max-w-[76ch] text-[0.72rem] leading-relaxed text-[var(--color-faint)]">
              {programEconomics.disclaimer}
            </p>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

function YearPanel({
  year,
  on,
  lead,
}: {
  year: (typeof YEARS)[number];
  on: number;
  lead: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[10px] border px-[clamp(0.9rem,1.6vw,1.35rem)] py-[clamp(0.9rem,2vh,1.35rem)]",
        TW.state,
      )}
      style={{
        opacity: 0.32 + on * 0.68,
        transform: `translateY(${(1 - on) * 10}px)`,
        borderColor: on > 0.6 ? "var(--color-hairline-signal)" : "var(--color-hairline)",
        background: "var(--color-panel)",
      }}
    >
      {/* year tag + stage name */}
      <div className="flex items-baseline gap-2.5">
        <span className="drk-mono drk-tnum shrink-0 text-[0.78rem] text-[var(--color-signal)]">
          {year.tag}
        </span>
        <span aria-hidden className="h-px w-3 shrink-0 bg-[var(--color-hairline-strong)]" />
        <span className="drk-label min-w-0 text-[var(--color-faint)]">{year.name}</span>
      </div>

      {/* the headline: managed-program earnings, always labelled as such */}
      <div className="mt-[clamp(0.7rem,1.8vh,1.1rem)]">
        <span
          className={cn(
            "block font-[family-name:var(--font-display)] font-semibold leading-none tracking-[-0.04em]",
            lead ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]",
            "text-[clamp(2rem,3.6vw,3.1rem)]",
          )}
        >
          <Digits value={money(year.earnings)} />
        </span>
        <span className="drk-label mt-2 block text-[var(--color-faint)]">
          {programEconomics.earningsLabel}
        </span>
      </div>

      {/* the two bars that carry the whole argument */}
      <div className="mt-[clamp(0.9rem,2.2vh,1.35rem)] flex flex-col gap-3">
        <Bar
          label="PROGRAMS"
          value={String(year.programs)}
          fill={year.programs / MAX_PROGRAMS}
          on={on}
          tone="quiet"
        />
        <Bar
          label="AVG. EARNINGS / PROGRAM"
          value={money(year.avgPerProgram)}
          fill={year.avgPerProgram / MAX_AVG}
          on={on}
          tone="signal"
        />
      </div>

      <p className="mt-[clamp(0.8rem,1.8vh,1.15rem)] border-t border-[var(--color-hairline)] pt-3 text-[0.8rem] leading-snug text-[var(--color-ink-soft)]">
        {year.driver}
      </p>
      <p className="mt-1.5 text-[0.76rem] leading-snug text-[var(--color-faint)]">
        {year.objective}
      </p>
    </div>
  );
}

/**
 * One measured bar. The two bars in a panel run on DIFFERENT scales — each is
 * normalised against its own Year 3 maximum — because they measure different
 * quantities. That is the point: on a shared scale the program count would be
 * invisible, and the comparison being drawn is between the two SHAPES, not
 * between a count and a dollar figure.
 */
function Bar({
  label,
  value,
  fill,
  on,
  tone,
}: {
  label: string;
  value: string;
  fill: number;
  on: number;
  tone: "quiet" | "signal";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="drk-label text-[0.5rem] text-[var(--color-faint)]">{label}</span>
        <span
          className={cn(
            "drk-tnum shrink-0 text-[0.95rem] font-medium leading-none",
            tone === "signal" ? "text-[var(--color-signal)]" : "text-[var(--color-ink-soft)]",
          )}
        >
          <Digits value={value} />
        </span>
      </div>
      <div
        aria-hidden
        className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full"
        style={{ background: "var(--color-hairline)" }}
      >
        <span
          className="block h-full rounded-full transition-[width] duration-[760ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
          style={{
            width: `${fill * on * 100}%`,
            background:
              tone === "signal" ? "var(--color-signal)" : "var(--color-hairline-strong)",
            boxShadow: tone === "signal" ? "0 0 10px 0 rgba(0,224,96,0.4)" : "none",
          }}
        />
      </div>
    </div>
  );
}
