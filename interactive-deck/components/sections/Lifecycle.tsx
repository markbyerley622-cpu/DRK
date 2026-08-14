"use client";

import { useRef } from "react";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { OBJECT_SCALE, Signal, SystemObject } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { lifecycle, sections } from "@/content/drk";
import { clamp01, cn, range, seeded, smoothPath } from "@/lib/utils";

/**
 * SCENE 09 — THE LAUNCH LIFECYCLE
 *
 * A travelling journey, not a carousel of stage cards.
 *
 * ONE route runs through all five stages. It has terrain: it starts low at
 * pre-launch and climbs to growth, so "market growth" is a physical fact of the
 * composition rather than a word in a label. Every stage object sits ON that
 * route — its base meets the path at a node — and every label hangs from the
 * same node, so the whole journey is one connected object. The camera
 * translates along the route to centre whichever stage has been reached.
 *
 * Each stage materially changes the system as it is reached: the lock arms, the
 * beacon emits once, the liquidity wave travels the infrastructure between two
 * nodes, market depth develops under the route, and that depth expands at
 * growth. Every one of those states is a pure function of scroll progress, so
 * any scroll position — fast, reversed, restored from a reload — is a valid
 * frame.
 *
 * Off-desktop (and under reduced motion) the scene is recomposed as a genuine
 * vertical route with the same five stages at full reading size.
 */

const META = sections.find((s) => s.id === "lifecycle")!;
const STAGES = lifecycle.stages;
const N = STAGES.length;

/* ========================================================================== */
/* ROUTE GEOMETRY                                                              */
/* ========================================================================== */

/**
 * Each stage owns STAGE_VW of viewport width, so ~2.5–3 stages are on screen
 * and the route always continues past both edges of the frame.
 */
const STAGE_VW = 30;

/**
 * viewBox: x is one hundred units per stage, y is 0..100 across the journey
 * band. The route is authored well beyond the first and last stage so it always
 * reaches both edges of the frame — a journey that starts and stops in mid-air
 * reads as a diagram, not as a route.
 */
const VB_W = N * 100;
const X_START = -220;
const X_END = VB_W + 220;
const X_SPAN = X_END - X_START;

const stageX = (i: number) => (i + 0.5) * 100;
const xFrac = (x: number) => clamp01((x - X_START) / X_SPAN);

/**
 * Stage elevations (y, 0 = top of the band). The route CLIMBS: pre-launch sits
 * low, growth sits highest, so the final stage is physically further off the
 * ground than the first. The range is bounded at both ends — the object stands
 * above each node and the label hangs below it, and both have to stay inside
 * the band at 1366×768 and 1024×768.
 */
const ELEV = [74, 65, 56, 46, 38];

/**
 * Control points. The midpoints between stages sit off the straight line, so
 * the route reads as terrain being crossed rather than as a ruler with beads on
 * it. The tail climbs hardest: growth keeps going after the last stage.
 */
const ROUTE_PTS: Array<[number, number]> = [
  [X_START, 89],
  [-120, 85],
  [-40, 79],
  [stageX(0), ELEV[0]],
  [100, 71],
  [stageX(1), ELEV[1]],
  [200, 60],
  [stageX(2), ELEV[2]],
  [300, 52],
  [stageX(3), ELEV[3]],
  [400, 42],
  [stageX(4), ELEV[4]],
  [560, 29],
  [660, 19],
  [X_END, 13],
];

const ROUTE_D = smoothPath(ROUTE_PTS, 0.5);

/** Linear sample of the route, used to hang the depth field off the path. */
function routeY(x: number): number {
  if (x <= ROUTE_PTS[0][0]) return ROUTE_PTS[0][1];
  for (let i = 0; i < ROUTE_PTS.length - 1; i++) {
    const [ax, ay] = ROUTE_PTS[i];
    const [bx, by] = ROUTE_PTS[i + 1];
    if (x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax);
  }
  return ROUTE_PTS[ROUTE_PTS.length - 1][1];
}

/**
 * The depth field: an order-book profile that develops under the route from
 * just before LIQUIDITY and deepens through GROWTH. Sampled once at module
 * scope with `seeded`, so server and client emit identical geometry.
 */
const DEPTH_N = 90;
const DEPTH = Array.from({ length: DEPTH_N + 1 }, (_, j) => {
  const f = j / DEPTH_N;
  const x = 280 + (700 - 280) * f;
  // Shallow where liquidity is only being activated, deep where it has grown.
  // Tapered at both ends so the field emerges from and returns to the route
  // rather than terminating on a hard vertical edge mid-frame.
  const taper = Math.min(1, f / 0.14) * Math.min(1, (1 - f) / 0.16);
  const h = (4 + seeded(j * 1.9) * 6 + 14 * f) * taper;
  return { x, y: routeY(x) + 0.7, h, f };
});

/* ========================================================================== */
/* SCENE                                                                       */
/* ========================================================================== */

export function Lifecycle() {
  const ref = useRef<HTMLElement>(null);
  const { p, scrub } = useSceneNarrative(ref);

  /*
   * The camera. `pos` is a continuous stage coordinate: it starts BEFORE stage
   * one — so the route arrives from off-frame and the lock arms as we reach it
   * — and ends just past stage five.
   */
  const travel = range(p, 0.06, 0.94);
  const pos = -0.7 + travel * (N - 1 + 0.8);
  const active = Math.max(0, Math.min(N - 1, Math.round(pos)));

  return (
    <Scene sceneRef={ref} id="lifecycle" index={META.index} title={META.title} height="340vh">
      {/*
       * The nav rail owns the right edge at lg+. The header's optical centre AND
       * the travelling frame are both measured against this one reservation, so
       * nothing in the scene can reach under it and the two share an axis.
       */}
      <SceneStage className="[--lc-rail:0rem] lg:[--lc-rail:14.5rem]">
        {scrub ? (
          <>
            {/* padding-right = gutter + rail puts this box's centre at exactly
                (frame width) / 2, which is where the camera centres a stage */}
            <div className="w-full shrink-0 px-[var(--gutter)] lg:pr-[calc(var(--gutter)+var(--lc-rail))]">
              <div className="mx-auto max-w-[54rem]">
                <Head />
              </div>
            </div>
            <Journey pos={pos} active={active} />
          </>
        ) : (
          <SceneShell>
            <div className="mx-auto max-w-[46rem]">
              <Head />
              <VerticalJourney />
            </div>
          </SceneShell>
        )}
      </SceneStage>
    </Scene>
  );
}

function Head() {
  return (
    <SceneHead
      index={META.index}
      eyebrow={META.label}
      align="center"
      size="h2"
      lede={
        <>
          {lifecycle.support.pre}
          <Signal>{lifecycle.support.signal}</Signal>
          {lifecycle.support.post}
        </>
      }
    >
      {lifecycle.headline.plain}
      <Signal>.</Signal>
    </SceneHead>
  );
}

/* ========================================================================== */
/* DESKTOP — the travelling journey                                            */
/* ========================================================================== */

function Journey({ pos, active }: { pos: number; active: number }) {
  /* Per-stage arrival: 1 exactly as the stage reaches the centre of frame. */
  const local = STAGES.map((_, i) => range(pos, i - 0.8, i + 0.05));
  /* Depth of field: how present a stage is relative to the camera. */
  const prox = STAGES.map((_, i) => 1 - clamp01(Math.abs(pos - i) / 1.45));

  /* Route travelled. Growth runs slightly ahead of the camera — the tail of the
     journey lights before you arrive at it, which is the argument. */
  const cameraF = xFrac((pos + 0.5) * 100);
  const lit = clamp01(cameraF + local[4] * (1 - cameraF));

  /* MIGRATION: one wave crosses the infrastructure from node 02 to node 03. */
  const wave = local[2];
  const waveAt = xFrac(stageX(1)) + wave * (xFrac(stageX(2)) - xFrac(stageX(1)));
  const waveOn = Math.min(1, wave * 5) * Math.min(1, (1 - wave) * 5);

  /* LIQUIDITY develops the depth field; GROWTH expands it. */
  const depth = range(pos, 2.5, 3.9);
  const grow = local[4];
  const depthScale = 0.6 + 0.4 * grow;
  const depthAt = (d: (typeof DEPTH)[number]) =>
    d.y + d.h * clamp01((depth - d.f * 0.85) * 4) * depthScale;
  const depthArea =
    "M " +
    DEPTH.map((d) => `${d.x.toFixed(1)} ${d.y.toFixed(2)}`).join(" L ") +
    " L " +
    [...DEPTH]
      .reverse()
      .map((d) => `${d.x.toFixed(1)} ${depthAt(d).toFixed(2)}`)
      .join(" L ") +
    " Z";

  /* PRE-LAUNCH: the lock arms. FIRST BLOCK: a single emission. */
  const arm = range(local[0], 0.15, 0.9);
  const emit = range(local[1], 0.3, 0.95);
  const emitEnv = clamp01(4 * emit * (1 - emit));

  return (
    /*
     * The travelling frame is physically narrower than the viewport at lg+ —
     * the mask is a second line of defence, not the only one. Nothing inside it
     * can be painted under the nav rail, because the frame does not go there.
     *
     * flex-1 so the journey takes the whole body of the frame and leaves no
     * unstructured space under it; the max-height stops the band from growing
     * so tall on a large monitor that the route reads as a thread in a void.
     */
    <div className="relative mt-[clamp(1rem,2.6vh,2.25rem)] min-h-0 w-full max-h-[clamp(19rem,58vh,36rem)] flex-1 lg:w-[calc(100%-var(--lc-rail))]">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 7%, #000 58%, transparent 84%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 7%, #000 58%, transparent 84%)",
        }}
      >
        {/* 50% here is 50% of the FRAME, not of the track — so the active stage
            lands on the frame's centre with no viewport arithmetic. */}
        <div
          className="h-full w-full"
          style={{
            transform: `translateX(calc(50% - ${((pos + 0.5) * STAGE_VW).toFixed(3)}vw))`,
            willChange: "transform",
          }}
        >
          <div className="relative h-full" style={{ width: `${N * STAGE_VW}vw` }}>
            <svg
              aria-hidden
              focusable="false"
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VB_W} 100`}
              preserveAspectRatio="none"
            >
              {/* LIQUIDITY → GROWTH: market depth develops under the route */}
              {depth > 0.001 && (
                <>
                  <path d={depthArea} fill="rgba(214,228,232,0.032)" stroke="none" />
                  {/* every sample gets a rung: dense enough to read as an
                      order book, faint enough that it is texture, not a fence */}
                  {DEPTH.map((d, j) => {
                    const y2 = depthAt(d);
                    if (y2 - d.y < 0.5) return null;
                    return (
                      <line
                        key={j}
                        x1={d.x}
                        x2={d.x}
                        y1={d.y}
                        y2={y2}
                        stroke="var(--color-signal)"
                        strokeOpacity={0.2}
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </>
              )}

              {/* the route bed — the infrastructure exists before the liquidity */}
              <path
                d={ROUTE_D}
                fill="none"
                stroke="var(--color-hairline-strong)"
                strokeWidth={1.25}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* the distance travelled */}
              <path
                d={ROUTE_D}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth={1.6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - lit}
                opacity={0.92}
                vectorEffect="non-scaling-stroke"
              />
              {/* MIGRATION: the wave itself, moving across the route */}
              {waveOn > 0.01 && (
                <path
                  d={ROUTE_D}
                  fill="none"
                  stroke="var(--color-signal-bright)"
                  strokeWidth={3.25}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.03 1"
                  strokeDashoffset={-waveAt}
                  opacity={waveOn * 0.95}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            {/* FIRST BLOCK: the emission column, behind the beacon plate */}
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                left: `${((1 + 0.5) / N) * 100}%`,
                bottom: `${100 - ELEV[1]}%`,
                width: 2,
                height: `${58 * emitEnv}px`,
                transform: "translateX(-50%)",
                background: "linear-gradient(to top, var(--color-signal), rgba(0,224,96,0))",
                opacity: emitEnv * 0.6,
              }}
            />

            {/* ---- the five objects, welded to the route ---- */}
            {STAGES.map((s, i) => (
              <div
                key={s.key}
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  left: `${((i + 0.5) / N) * 100}%`,
                  /* base meets the path; the small offset absorbs the transparent
                     margin baked into the harvested plates */
                  bottom: `calc(${100 - ELEV[i]}% - 0.3rem)`,
                  transform: "translateX(-50%)",
                  opacity: 0.24 + prox[i] * 0.76,
                  /* The ladder gives the object its identity size; the band
                     additionally bounds it so the pinned stage cannot clip at
                     1366×768 or 1024×768. All five therefore read at one weight.
                     The bound lives on THIS element because it is the one whose
                     containing block — the band — has a resolved height. */
                  height: `min(${OBJECT_SCALE.large}, 35%)`,
                }}
              >
                <SystemObject
                  id={s.object}
                  scale="large"
                  style={{
                    height: "100%",
                    transformOrigin: "bottom center",
                    /* GROWTH: the depth sculpture expands off its own base. */
                    transform: i === 4 ? `scale(${1 + grow * 0.08})` : undefined,
                  }}
                />
              </div>
            ))}

            {/* ---- contact nodes: where each object meets the route ---- */}
            {STAGES.map((s, i) => {
              const reached = local[i] > 0.5;
              return (
                <span
                  key={s.key}
                  aria-hidden
                  className="pointer-events-none absolute block size-3"
                  style={{
                    left: `${((i + 0.5) / N) * 100}%`,
                    top: `${ELEV[i]}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full border-2 transition-[border-color,box-shadow] duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                    style={{
                      borderColor: reached
                        ? "var(--color-signal)"
                        : "var(--color-hairline-strong)",
                      background: "var(--color-base)",
                      boxShadow:
                        i === active && reached ? "0 0 16px 1px rgba(0,224,96,0.7)" : "none",
                    }}
                  />

                  {/* PRE-LAUNCH: the security lock arms as the stage is reached */}
                  {i === 0 && (
                    <svg
                      className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2"
                      viewBox="0 0 36 36"
                      focusable="false"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="var(--color-hairline-strong)"
                        strokeWidth="1"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="var(--color-signal)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1 1"
                        strokeDashoffset={1 - arm}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                  )}

                  {/* FIRST BLOCK: one decisive emission, not a loop */}
                  {i === 1 && emitEnv > 0.01 && (
                    <span
                      className="absolute left-1/2 top-1/2 rounded-full border"
                      style={{
                        width: `${16 + emit * 118}px`,
                        height: `${16 + emit * 118}px`,
                        transform: "translate(-50%, -50%)",
                        borderColor: "var(--color-signal)",
                        opacity: emitEnv * 0.85,
                      }}
                    />
                  )}
                </span>
              );
            })}

            {/* ---- the stages themselves: each label hangs from its node ---- */}
            <ol className="absolute inset-0">
              {STAGES.map((s, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={s.key}
                    /* the reached stage is never signalled by colour alone: it
                       also carries weight, a lit drop line, and aria-current */
                    aria-current={isActive ? "step" : undefined}
                    className="absolute px-[clamp(1rem,2.2vw,2.25rem)] text-center"
                    style={{
                      left: `${((i + 0.5) / N) * 100}%`,
                      top: `${ELEV[i]}%`,
                      width: `${STAGE_VW}vw`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {/* the drop from the node — the label is physically attached
                        to the route, at the route's own elevation */}
                    <span
                      aria-hidden
                      className="mx-auto block w-px"
                      style={{
                        height: "clamp(0.9rem,2vh,1.4rem)",
                        background: isActive
                          ? "var(--color-signal)"
                          : "var(--color-hairline-strong)",
                        opacity: 0.3 + prox[i] * 0.7,
                      }}
                    />

                    {/* name and position readout share one line: the counter is
                        part of the stage rather than a separate progress bar */}
                    <p
                      className="mt-2.5 flex items-baseline justify-center gap-2"
                      style={{ opacity: 0.7 + prox[i] * 0.3 }}
                    >
                      <span className="drk-label drk-mono shrink-0">
                        <span
                          className={
                            isActive ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]"
                          }
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[var(--color-faint)]">
                          /{String(N).padStart(2, "0")}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-[clamp(1.05rem,1.5vw,1.4rem)] tracking-[-0.022em] transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                          isActive
                            ? "font-semibold text-[var(--color-signal)]"
                            : "font-medium text-[var(--color-ink-soft)]",
                        )}
                      >
                        {s.name}
                      </span>
                    </p>

                    <p
                      className="mt-1.5 text-[clamp(0.84rem,1.02vw,0.97rem)] leading-snug text-[var(--color-muted)]"
                      style={{ opacity: 0.4 + prox[i] * 0.6 }}
                    >
                      {s.lines[0]}
                      <br />
                      {/* the second line resolves only once the stage completes */}
                      <span style={{ opacity: 0.3 + range(local[i], 0.5, 1) * 0.7 }}>
                        {s.lines[1]}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* MOBILE / REDUCED MOTION — a vertical journey                                */
/* ========================================================================== */

/**
 * One drawn segment per stage. Every segment enters and leaves at x = 24, so
 * the five of them join into a single continuous route down the column, and the
 * bulge alternates so the route snakes rather than ruling a straight line.
 * The first 9% of each segment is vertical — that is where the node sits, so
 * the node is genuinely ON the path rather than floating beside it.
 */
const MOBILE_SEG = STAGES.map((_, i) => {
  const dir = i % 2 === 0 ? 1 : -1;
  return smoothPath(
    [
      [24, 0],
      [24, 9],
      [24 - 15 * dir, 33],
      [24, 57],
      [24 + 15 * dir, 81],
      [24, 100],
    ],
    0.5,
  );
});

function VerticalJourney() {
  return (
    <ol className="mt-[clamp(2.25rem,5vh,3.25rem)] flex flex-col pt-1">
      {STAGES.map((s, i) => (
        <Reveal as="li" key={s.key} delay={i * 0.06} className="relative">
          <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-[clamp(0.65rem,2.6vw,1.1rem)] pb-[clamp(1.9rem,4.5vh,2.75rem)]">
            {/* ---- the route ---- */}
            <div className="relative">
              <svg
                aria-hidden
                focusable="false"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 48 100"
                preserveAspectRatio="none"
                /* the route continues past growth rather than stopping dead in
                   the whitespace under the last stage */
                style={
                  i === N - 1
                    ? {
                        maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, #000 55%, transparent 100%)",
                      }
                    : undefined
                }
              >
                <path
                  d={MOBILE_SEG[i]}
                  fill="none"
                  stroke="var(--color-hairline-strong)"
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={MOBILE_SEG[i]}
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth={1.25}
                  opacity={0.45}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* the node sits inside the segment's vertical head, so it is on
                  the path, and level with the stage name it belongs to */}
              <span
                aria-hidden
                className="absolute left-1/2 top-[0.6rem] block size-[0.7rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-signal)] bg-[var(--color-base)] shadow-[0_0_12px_0_rgba(0,224,96,0.55)]"
              />
            </div>

            {/* ---- the stage ---- */}
            <div className="min-w-0">
              <p className="flex items-baseline gap-2.5">
                <span className="drk-label drk-mono shrink-0 text-[var(--color-signal)]">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-[var(--color-faint)]">/{String(N).padStart(2, "0")}</span>
                </span>
                <span className="text-[clamp(1.05rem,4.4vw,1.3rem)] font-semibold leading-tight tracking-[-0.022em] text-[var(--color-ink)]">
                  {s.name}
                </span>
              </p>

              <div className="mt-2.5 flex items-center gap-[clamp(0.75rem,3vw,1.1rem)]">
                {/* fixed cell: the plates have different aspect ratios, and a
                    shrink-to-fit object would leave the copy on a ragged left */}
                <SystemObject id={s.object} scale="medium" className="w-[5.5rem] shrink-0" />
                <p className="min-w-0 text-[0.95rem] leading-snug text-[var(--color-muted)]">
                  {s.lines[0]}
                  <br />
                  {s.lines[1]}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
