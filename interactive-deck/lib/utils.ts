export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Clamp to [0,1]. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Map a scene's 0..1 scroll progress onto one step of an N-step sequence and
 * return that step's own 0..1 progress.
 *
 * Every sticky scene derives its state from this rather than from an animation
 * timeline, which is what makes fast scrolling, mid-page reload and
 * back/forward navigation safe: any scroll position renders a valid state.
 */
export function stepProgress(
  progress: number,
  index: number,
  count: number,
  overlap = 0.35,
): number {
  const span = 1 / count;
  const start = index * span;
  const end = start + span * (1 + overlap);
  return clamp01((progress - start) / (end - start));
}

/** Progress across [start,end] of the parent range, clamped. */
export function range(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
}

/** Index of the active item given scene progress, biased so item 0 holds briefly. */
export function activeIndex(progress: number, count: number, lead = 0.06): number {
  const i = Math.floor(clamp01((progress - lead) / (1 - lead)) * count);
  return Math.min(count - 1, Math.max(0, i));
}

export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * Points -> smooth SVG path (Catmull-Rom converted to cubic beziers).
 *
 * Every emitted coordinate is fixed to 3dp. Server and client must produce
 * byte-identical path strings or React will report a hydration mismatch, and
 * raw float formatting is not guaranteed to agree across JS engines.
 */
export function smoothPath(points: Array<[number, number]>, tension = 0.5): string {
  if (points.length < 2) return "";
  const f = (n: number) => n.toFixed(3);
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** Deterministic pseudo-random in [0,1) — keeps SSR and client markup identical. */
export function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
