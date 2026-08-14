import type { SectionId } from "@/content/drk";
import { clamp01, smoothPath, smoothstep } from "@/lib/utils";

/**
 * THE DRK LIQUIDITY SIGNAL
 * ============================================================================
 * One continuous green line runs beneath the entire experience. It is not
 * fourteen decorations — it is a single object whose SHAPE changes as the
 * investor scrolls, so the same signal that activates in Scene 01 is the signal
 * that enters the vault in Scene 02, drives the engine in Scene 03, holds
 * through a falling market in Scene 05, compounds in Scene 12, receives the
 * raise in Scene 13, and resolves in Scene 14.
 *
 * Each scene contributes one keyframe: an array of control points in a 0..100
 * viewport-relative box (rendered with preserveAspectRatio="none", so x tracks
 * viewport width and y tracks viewport height). Every keyframe has the SAME
 * number of points, so morphing is a straight per-point interpolation.
 *
 * Narrative time `t` runs 0 .. 13 across the fourteen scenes. The path at any
 * `t` is the interpolation of keyframe floor(t) and floor(t)+1. Because the
 * value is derived purely from scroll position, any scroll state — fast, slow,
 * reversed, restored from a reload — renders a valid, continuous signal.
 */

export const SIGNAL_POINTS = 9;

type Pt = [number, number];
type Keyframe = {
  id: SectionId;
  pts: Pt[];
  note: string;
  /**
   * How present the signal is in this scene, 0..1. The line is loudest where it
   * IS the composition (Intro, Lifecycle, Close) and quietest behind dense
   * product surfaces (Visibility, Control) where a bright line under a data
   * table would be noise rather than continuity.
   */
  i: number;
};

/* -------------------------------------------------------------------------- */
/* KEYFRAMES — one per scene, in narrative order                               */
/* -------------------------------------------------------------------------- */

export const SIGNAL_KEYFRAMES: Keyframe[] = [
  {
    id: "intro",
    i: 1.0,
    note: "System activation. The signal rises out of the floor and climbs.",
    pts: [
      [-8, 104], [6, 96], [20, 90], [34, 83], [48, 76], [62, 69], [76, 61], [92, 52], [108, 43],
    ],
  },
  {
    id: "opacity",
    i: 0.34,
    note: "Value approaches the vault, is swallowed at centre, and leaves as an unknown.",
    pts: [
      [-8, 95], [8, 95], [24, 95], [38, 95], [50, 95], [62, 95], [76, 95], [92, 95], [108, 95],
    ],
  },
  {
    id: "engine",
    i: 0.75,
    note: "One engine: the signal is drawn into a single point and released.",
    pts: [
      [-8, 40], [8, 46], [24, 52], [38, 57], [50, 58], [62, 57], [76, 52], [92, 46], [108, 40],
    ],
  },
  {
    id: "visibility",
    i: 0.18,
    note: "Under the product surface: steady, instrumented, measurable.",
    pts: [
      [-8, 86], [8, 85], [24, 86], [38, 85], [50, 86], [62, 85], [76, 86], [92, 85], [108, 86],
    ],
  },
  {
    id: "proof",
    i: 0.42,
    note: "The market falls; the DRK line holds and turns up at the end.",
    pts: [
      [-8, 52], [8, 57], [24, 63], [38, 69], [50, 74], [62, 77], [76, 76], [92, 70], [108, 62],
    ],
  },
  {
    id: "stack",
    i: 0.4,
    note: "Owned stack: the signal steps down through the layers it controls.",
    pts: [
      [-8, 34], [8, 38], [24, 38], [38, 54], [50, 54], [62, 70], [76, 70], [92, 78], [108, 78],
    ],
  },
  {
    id: "market",
    i: 0.6,
    note: "Exponential: flat for a long time, then away.",
    pts: [
      [-8, 90], [8, 89], [24, 87], [38, 84], [50, 79], [62, 71], [76, 58], [92, 36], [108, 8],
    ],
  },
  {
    id: "integration",
    i: 0.6,
    note: "Reaching out: the signal extends toward a network that is not yet connected.",
    pts: [
      [-8, 74], [8, 72], [24, 68], [38, 62], [50, 56], [62, 52], [76, 50], [92, 50], [108, 50],
    ],
  },
  {
    id: "lifecycle",
    /* Quiet here, and only here. Scene 09 draws its own travelling route with
       terrain — the journey the launch takes — and two green lines crossing at
       an angle reads as a mistake rather than as continuity. The world line
       stays present as an undertone so the ground is still shared. */
    i: 0.16,
    note: "The launch journey: one long travelling sweep from first block to growth.",
    pts: [
      [-8, 96], [8, 92], [24, 84], [38, 76], [50, 70], [62, 64], [76, 56], [92, 46], [108, 34],
    ],
  },
  {
    id: "control",
    i: 0.14,
    note: "Inside the software: the signal runs flat and precise beneath the surface.",
    pts: [
      [-8, 97], [8, 97], [24, 97], [38, 97], [50, 97], [62, 97], [76, 97], [92, 97], [108, 97],
    ],
  },
  {
    id: "demo",
    /* Almost silent. This scene hands the frame to real product footage, and a
       travelling world line behind a video reads as interference. */
    i: 0.1,
    note: "The system running: a flat, steady undertone beneath the recording.",
    pts: [
      [-8, 99], [8, 99], [24, 99], [38, 99], [50, 99], [62, 99], [76, 99], [92, 99], [108, 99],
    ],
  },
  {
    id: "revenue",
    i: 0.7,
    note: "Value leaves the engine and fans out to the right.",
    pts: [
      [-8, 58], [10, 58], [26, 57], [40, 54], [52, 50], [64, 44], [78, 36], [92, 28], [108, 20],
    ],
  },
  {
    id: "economics",
    i: 0.66,
    note:
      "A staircase. Three treads rising left to right — the same climb the three " +
      "year panels make, read behind them rather than drawn twice.",
    pts: [
      [-8, 78], [10, 78], [26, 76], [40, 64], [54, 62], [68, 48], [82, 45], [95, 32], [108, 30],
    ],
  },
  {
    id: "projections",
    i: 0.86,
    note:
      "The accelerating curve: flat through Year 1, then steepening hard. This is " +
      "the projection itself, drawn by the world instead of by a chart.",
    pts: [
      [-8, 84], [10, 83], [26, 81], [40, 77], [52, 71], [64, 62], [78, 48], [92, 31], [108, 12],
    ],
  },
  {
    id: "compound",
    i: 0.62,
    note:
      "The line curls back on itself — the loop. Held to the bottom band so it " +
      "cannot compete with the loop diagram the scene draws in its own right.",
    pts: [
      [-10, 93], [6, 88], [20, 87], [31, 91], [36, 98], [30, 104], [17, 106], [3, 103], [-10, 98],
    ],
  },
  {
    id: "raise",
    i: 0.8,
    note: "Capital converges to a single point, then expands the system outward.",
    pts: [
      [-8, 20], [12, 32], [30, 44], [44, 52], [50, 54], [58, 52], [74, 44], [92, 32], [108, 20],
    ],
  },
  {
    id: "close",
    i: 1.0,
    note: "Resolution: the opening rise, returned. The loop is closed.",
    pts: [
      [-8, 100], [6, 94], [20, 89], [34, 83], [48, 77], [62, 71], [76, 64], [92, 56], [108, 48],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* INTERPOLATION                                                               */
/* -------------------------------------------------------------------------- */

/** Path `d` for a narrative time `t` in [0, SIGNAL_KEYFRAMES.length - 1]. */
export function signalPathAt(t: number): string {
  const n = SIGNAL_KEYFRAMES.length;
  const clamped = Math.max(0, Math.min(n - 1, t));
  const i = Math.min(n - 2, Math.floor(clamped));
  const f = smoothstep(clamped - i);
  const a = SIGNAL_KEYFRAMES[i].pts;
  const b = SIGNAL_KEYFRAMES[i + 1].pts;

  const pts: Pt[] = [];
  for (let k = 0; k < SIGNAL_POINTS; k++) {
    pts.push([a[k][0] + (b[k][0] - a[k][0]) * f, a[k][1] + (b[k][1] - a[k][1]) * f]);
  }
  return smoothPath(pts, 0.5);
}

/** Interpolated control points at narrative time `t`. */
export function signalPointsAt(t: number): Pt[] {
  const n = SIGNAL_KEYFRAMES.length;
  const clamped = Math.max(0, Math.min(n - 1, t));
  const i = Math.min(n - 2, Math.floor(clamped));
  const f = smoothstep(clamped - i);
  const a = SIGNAL_KEYFRAMES[i].pts;
  const b = SIGNAL_KEYFRAMES[i + 1].pts;
  return a.map((pt, k) => [
    pt[0] + (b[k][0] - pt[0]) * f,
    pt[1] + (b[k][1] - pt[1]) * f,
  ]) as Pt[];
}

/**
 * Height of the signal at a given viewport x, in viewport percent.
 *
 * This is what lets a scene STAND ITS OBJECTS ON the world signal: as the line
 * morphs, whatever is registered against it rides with it. Linear between
 * control points rather than following the rendered bezier — the difference is
 * well under half a percent of viewport height at these tensions, and the
 * exactness is not worth a curve solve on every frame.
 */
export function signalYAt(t: number, x: number): number {
  const pts = signalPointsAt(t);
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x >= x0 && x <= x1) {
      const f = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * f;
    }
  }
  return pts[pts.length - 1][1];
}

/** Signal presence at narrative time `t`, interpolated between scenes. */
export function signalIntensityAt(t: number): number {
  const n = SIGNAL_KEYFRAMES.length;
  const clamped = Math.max(0, Math.min(n - 1, t));
  const i = Math.min(n - 2, Math.floor(clamped));
  const f = smoothstep(clamped - i);
  return SIGNAL_KEYFRAMES[i].i + (SIGNAL_KEYFRAMES[i + 1].i - SIGNAL_KEYFRAMES[i].i) * f;
}

/* -------------------------------------------------------------------------- */
/* SYSTEM STATE — the machine's own readout                                    */
/* -------------------------------------------------------------------------- */

/**
 * What the machine is doing right now. Shown as persistent telemetry so the
 * viewer is always aware they are inside one running system rather than paging
 * through slides. Each string describes a state of the SAME system.
 */
export const SYSTEM_STATE: Record<SectionId, { state: string; detail: string }> = {
  intro: { state: "ACTIVATING", detail: "RUNTIME COMING ONLINE" },
  opacity: { state: "OBSTRUCTED", detail: "OUTPUTS NOT OBSERVABLE" },
  engine: { state: "ENGINE RUNNING", detail: "ONE CORE / TWO MODES" },
  visibility: { state: "OBSERVABLE", detail: "ASSETS / PROGRAMS / EXEC / P&L" },
  proof: { state: "MEASURED", detail: "2 LAUNCHES / RISK-OFF" },
  stack: { state: "INTEGRATED", detail: "STACK OWNED END TO END" },
  market: { state: "EXPANDING", detail: "ADDRESSABLE SURFACE GROWING" },
  integration: { state: "CONNECTING", detail: "NEW VENUE ONBOARDING" },
  lifecycle: { state: "IN LAUNCH", detail: "FIRST BLOCK → GROWTH" },
  control: { state: "OPERATING", detail: "CONTROL LAYER LIVE" },
  demo: { state: "LIVE", detail: "RECORDED IN PRODUCTION" },
  revenue: { state: "MONETISING", detail: "5 STREAMS / 1 ENGINE" },
  economics: { state: "COMPOUNDING UNIT", detail: "MORE PER MANDATE" },
  projections: { state: "PROJECTING", detail: "3-YEAR TARGET CASE" },
  compound: { state: "COMPOUNDING", detail: "CAPITAL RE-ENTERING" },
  raise: { state: "SCALING", detail: "$1.5M INTO THE MACHINE" },
  close: { state: "RESOLVED", detail: "TRANSPARENT BY DESIGN" },
};

/**
 * Ambient light position per scene, as viewport percentages. The world carries
 * ONE light. It travels; it is never re-lit per section. Keeping it in one place
 * is what stops fifteen independent green washes from appearing.
 */
export const AMBIENT: Record<SectionId, { x: number; y: number; i: number }> = {
  intro: { x: 68, y: 58, i: 0.9 },
  opacity: { x: 50, y: 50, i: 0.35 },
  engine: { x: 50, y: 52, i: 1 },
  visibility: { x: 74, y: 48, i: 0.7 },
  proof: { x: 70, y: 52, i: 0.55 },
  stack: { x: 62, y: 50, i: 0.7 },
  market: { x: 76, y: 44, i: 0.8 },
  integration: { x: 58, y: 52, i: 0.75 },
  lifecycle: { x: 50, y: 56, i: 0.8 },
  control: { x: 66, y: 50, i: 0.65 },
  demo: { x: 50, y: 50, i: 0.3 },
  revenue: { x: 38, y: 52, i: 0.8 },
  economics: { x: 50, y: 50, i: 0.78 },
  projections: { x: 72, y: 46, i: 0.9 },
  compound: { x: 66, y: 50, i: 0.85 },
  raise: { x: 30, y: 52, i: 0.9 },
  close: { x: 72, y: 56, i: 1 },
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t);
}

const AMBIENT_ORDER = SIGNAL_KEYFRAMES.map((k) => AMBIENT[k.id]);

/** The single travelling light, interpolated between scenes. */
export function ambientAt(t: number): { x: number; y: number; i: number } {
  const n = AMBIENT_ORDER.length;
  const clamped = Math.max(0, Math.min(n - 1, t));
  const i = Math.min(n - 2, Math.floor(clamped));
  const f = smoothstep(clamped - i);
  const a = AMBIENT_ORDER[i];
  const b = AMBIENT_ORDER[i + 1];
  return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), i: lerp(a.i, b.i, f) };
}
