"use client";

import { useRef } from "react";
import { Scene, SceneHead, SceneShell, SceneStage } from "@/components/deck/Scene";
import { Digits, SourceRef } from "@/components/ui/primitives";
import { LineSeries, Spark, useMorphSeries } from "@/components/visuals/charts";
import { Reveal } from "@/components/motion/Reveal";
import { useSceneNarrative } from "@/hooks/useScene";
import { illustrativeSeries, market } from "@/content/drk";
import { activeIndex, cn, range } from "@/lib/utils";

/**
 * SCENE 07 — MARKET
 *
 * Not six identical statistic cards. One causal progression: capital moves
 * onchain → volume follows → onchain overtakes → markets fragment → complexity
 * rises → institutional requirements arrive → infrastructure demand increases.
 *
 * The case has to be seen ACCUMULATING, not flashing past, so the causal rail
 * doubles as a ledger: once a step is passed its figure stays on screen and the
 * signal rule under the headline figure grows a sixth wider with every step.
 *
 * Every figure, description, source and date is exactly as supplied. Nothing is
 * refreshed or re-dated; the mixed vintages are deliberate and flagged
 * (VER-02 / VER-03). Sources render at readable size — never microscopic grey.
 */

/** The scrub window the six-step progression occupies inside the scene. */
const SEQ_IN = 0.06;
const SEQ_OUT = 0.92;
/** `activeIndex` lead — step 01 holds briefly before the sequence advances. */
const SEQ_LEAD = 0.02;

export function Market() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);

  const steps = market.progression;
  const shapes = illustrativeSeries.marketShapes;
  const seq = range(p, SEQ_IN, SEQ_OUT);
  const idx = scrub ? activeIndex(seq, steps.length, SEQ_LEAD) : steps.length - 1;
  const step = steps[idx];
  const last = steps[steps.length - 1];

  /*
   * The curve DEFORMS between steps rather than being replaced: the reader's eye
   * follows one shape changing instead of losing its place while a new chart
   * fades in. `marketShapes` is a static object, so the reference is stable per
   * key and the morph only re-targets when the step actually changes.
   */
  const curve = useMorphSeries(shapes[step.key] ?? shapes.tvl);

  /* Only the opening shape draws in; after that the line is continuous. */
  const draw = idx === 0 ? range(seq, 0, 0.09) : 1;
  const conclusion = range(p, 0.86, 1);

  /**
   * Seek to a step. State still derives purely from the scroll ratio — the
   * button moves the scroll position, it does not override the narrative — so
   * every landing position is a valid rendered state.
   */
  const seekTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const runway = el.offsetHeight - window.innerHeight;
    if (runway <= 0) return;
    const localSeq = SEQ_LEAD + ((i + 0.5) / steps.length) * (1 - SEQ_LEAD);
    const target = SEQ_IN + localSeq * (SEQ_OUT - SEQ_IN);
    window.scrollTo({
      top: el.offsetTop + target * runway,
      behavior: "smooth",
    });
  };

  /*
   * The payoff resolves the chain, so it follows the evidence in both layouts:
   * under the rail on desktop, under the stacked ledger on mobile.
   */
  const payoff = (
    <div
      className="mt-[clamp(0.95rem,2.8vh,2rem)] border-t border-[var(--color-hairline)] pt-[clamp(0.7rem,2vh,1.35rem)] transition-opacity duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
      style={{ opacity: conclusion }}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px w-6 shrink-0 bg-[var(--color-signal)]" />
        <p className="text-[clamp(1.05rem,1.9vw,1.5rem)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          {market.conclusion}
        </p>
      </div>
      <p className="mt-2 max-w-[42ch] text-[0.9rem] leading-relaxed text-[var(--color-muted)]">
        {market.callout.plain}
        <span className="text-[var(--color-signal)]">{market.callout.signal}</span>
      </p>
    </div>
  );

  return (
    <Scene
      sceneRef={ref}
      id="market"
      index="07"
      title="The market for MM infrastructure"
      height="260vh"
    >
      <SceneStage>
        {/*
         * The stage hands the shell a definite height on desktop. That is what
         * lets the plot below take the frame's free height instead of being a
         * fixed band with a void above it — without it the grid row is
         * content-sized and `flex-1` has nothing to fill.
         */}
        <SceneShell className="lg:h-full">
          <div className="drk-scrim grid gap-x-[clamp(2rem,4vw,4.5rem)] gap-y-[clamp(1.75rem,4vh,2.75rem)] lg:h-full lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
            {/* ================= narrative + causal ledger ================= */}
            <div className="flex min-h-0 flex-col justify-center">
              {/* `h2`: this headline is long and the scene runs a two-column
                  frame, so at 1024×768 the display size wraps it to five lines
                  and pushes the ledger under the instrument strip. */}
              <SceneHead index="07" eyebrow="MARKET" size="h2" lede={market.support}>
                {market.headline.pre}
                <span className="text-[var(--color-signal)]">{market.headline.signal}.</span>
              </SceneHead>

              {/*
               * The causal chain IS the argument, and it is also the ledger:
               * a step that has been passed keeps its figure on the rail, so the
               * investor watches the case build rather than six cards flash by.
               */}
              {scrub ? (
                <>
                  <ol className="mt-[clamp(1.1rem,3vh,2.3rem)] flex flex-col">
                    {steps.map((s, i) => {
                      const done = i < idx;
                      const now = i === idx;
                      const seen = i <= idx;
                      return (
                        <li
                          key={s.key}
                          aria-current={now ? "step" : undefined}
                          className="border-b border-[var(--color-hairline)] last:border-b-0"
                        >
                          <button
                            type="button"
                            onClick={() => seekTo(i)}
                            className="flex w-full items-center gap-3 py-[clamp(0.2rem,0.85vh,0.55rem)] text-left"
                          >
                            <span
                              aria-hidden
                              className="block h-px shrink-0 transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                              style={{
                                width: now ? 22 : 12,
                                background: now
                                  ? "var(--color-signal)"
                                  : done
                                    ? "var(--color-hairline-strong)"
                                    : "var(--color-hairline)",
                              }}
                            />
                            <span
                              className={cn(
                                "min-w-0 flex-1 text-[clamp(0.86rem,1.05vw,0.98rem)] leading-snug transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
                                now
                                  ? "font-medium text-[var(--color-ink)]"
                                  : done
                                    ? "text-[var(--color-faint)]"
                                    : "text-[var(--color-faint)]",
                              )}
                            >
                              {s.premise}
                            </span>
                            <span
                              className={cn(
                                "drk-mono drk-tnum shrink-0 text-[0.82rem] transition-opacity duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                                now ? "text-[var(--color-signal)]" : "text-[var(--color-ink-soft)]",
                              )}
                              style={{ opacity: seen ? 1 : 0 }}
                            >
                              {s.value}
                            </span>
                            {/* Non-colour cue for the current step, for anyone who
                              cannot separate the green rail marker. */}
                            <span className="drk-sr-only">
                              {s.label}. {now ? "Current step." : ""}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  {payoff}
                </>
              ) : null}
            </div>

            {/* ================= the instrument ================= */}
            {scrub ? (
              <div className="relative flex min-h-0 flex-col justify-center">
                {/* progression header: the reader always knows the case is six
                    steps long and exactly where inside it they are */}
                <div className="flex items-center gap-3">
                  <span className="drk-label drk-mono text-[var(--color-signal)]">{step.step}</span>
                  <span aria-hidden className="drk-label text-[var(--color-faint)]">
                    →
                  </span>
                  <span className="drk-label drk-mono">{last.step}</span>
                  <span aria-hidden className="h-px flex-1 bg-[var(--color-hairline)]" />
                  <span className="drk-label text-[var(--color-ink-soft)]">{step.label}</span>
                </div>

                {/*
                 * The figure is set in ink, not green. The only green on this
                 * column is the hairline below it and the step counter — a
                 * signal, not a wall of colour.
                 */}
                <p className="mt-[clamp(0.85rem,2vh,1.45rem)] font-[family-name:var(--font-display)] text-[clamp(2.85rem,7vw,5.5rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-[var(--color-ink)]">
                  <Digits value={step.value} />
                </p>

                {/* Progressive scale: the signal rule gains a sixth of its track
                    with every step, so the surface visibly keeps growing. */}
                <div className="mt-[clamp(0.7rem,1.7vh,1.15rem)] flex items-center gap-3">
                  <span
                    aria-hidden
                    className="block h-px w-full max-w-[20rem] flex-1 bg-[var(--color-hairline)]"
                  >
                    <span
                      className="block h-px bg-[var(--color-signal)] transition-[width] duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                      style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
                    />
                  </span>
                  <span className="drk-label drk-mono shrink-0 text-[var(--color-signal)]">
                    {String(idx + 1).padStart(2, "0")}
                    <span className="text-[var(--color-faint)]">
                      {" / "}
                      {String(steps.length).padStart(2, "0")}
                    </span>
                  </span>
                </div>

                <p className="mt-[clamp(0.8rem,1.8vh,1.25rem)] max-w-[32ch] text-[clamp(1rem,1.55vw,1.35rem)] leading-snug text-[var(--color-ink-soft)]">
                  {step.desc}
                </p>

                {/* The instrument takes the free height of the column, so the
                    plot grows to close the frame instead of leaving a void
                    between the figure and the chart. */}
                <div className="flex min-h-0 flex-1 flex-col pt-[clamp(0.9rem,2.4vh,1.75rem)]">
                  {/*
                   * `height` on LineSeries is a px number, but a pinned stage
                   * has no fixed pixel budget — the plot has to absorb whatever
                   * height the frame leaves it, with a floor so it never
                   * collapses at 768px. Hence the overrides on the rendered svg.
                   */}
                  <LineSeries
                    values={curve}
                    progress={draw}
                    height={150}
                    axis={["EARLIER", "LATER"]}
                    label={`${step.label} — illustrative shape, no data`}
                    className="flex min-h-[clamp(5.5rem,13vh,9rem)] flex-1 flex-col [&>svg]:h-auto! [&>svg]:min-h-0! [&>svg]:flex-1!"
                  />

                  <SourceRef className="mt-[clamp(0.8rem,1.9vh,1.3rem)]">{step.source}</SourceRef>
                </div>
              </div>
            ) : (
              /*
               * Mobile: the progression recomposed as a vertical ledger. Every
               * premise, figure, description and source is present — nothing is
               * dropped for the phone — and each step carries its own shape so
               * the argument still reads as charted rather than listed.
               */
              <div>
                <ol className="flex flex-col gap-3">
                  {steps.map((s, i) => (
                    /* `as="li"` keeps the reveal wrapper a direct child of the
                     list — a <div> between <ol> and <li> breaks list semantics
                     for screen readers. */
                    <Reveal key={s.key} as="li" delay={i * 0.05} className="drk-glass p-4">
                      <div className="flex items-center gap-3">
                        <span className="drk-label drk-mono text-[var(--color-signal)]">
                          {s.step}
                        </span>
                        <span aria-hidden className="h-px flex-1 bg-[var(--color-hairline)]" />
                        <span className="drk-label">{s.label}</span>
                      </div>

                      <p className="mt-2 text-[0.9rem] font-medium leading-snug text-[var(--color-ink)]">
                        {s.premise}
                      </p>

                      <div className="mt-3 flex items-end justify-between gap-4">
                        <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,9vw,2.9rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-[var(--color-ink)] drk-tnum">
                          {s.value}
                        </p>
                        <Spark
                          values={shapes[s.key] ?? shapes.tvl}
                          height={34}
                          label={`${s.label} — illustrative shape, no data`}
                          className="max-w-[42%] flex-1"
                        />
                      </div>
                      <span aria-hidden className="mt-2 block h-px w-10 bg-[var(--color-signal)]" />

                      <p className="mt-2.5 text-[0.9rem] leading-snug text-[var(--color-muted)]">
                        {s.desc}
                      </p>
                      <SourceRef className="mt-2">{s.source}</SourceRef>
                    </Reveal>
                  ))}
                </ol>
                {payoff}
              </div>
            )}
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}
