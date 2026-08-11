"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { sections, type SectionId } from "@/content/drk";
import { usePrefersReducedMotion } from "@/hooks/useScene";

/**
 * THE WORLD
 * ============================================================================
 * One scroll observer for the whole document, and one source of narrative
 * state. Everything that needs to know "where is the machine right now" reads
 * from here: the persistent signal layer, the nav rail, the system telemetry.
 *
 * Two channels, deliberately separated:
 *
 *  - **Frame channel** (`subscribe`) — fires once per animation frame with the
 *    continuous narrative time. Consumers write straight to the DOM. React
 *    never re-renders on scroll, so the persistent world costs nothing per
 *    frame beyond one path recomputation.
 *
 *  - **State channel** (`useWorld()`) — discrete values only (which scene is
 *    active, total progress). Re-renders are bounded by how often those
 *    actually change.
 *
 * Narrative time `t` is continuous across the whole deck: 0 at the top of Scene
 * 01, 13 at the bottom of Scene 14. It is DERIVED from scroll position on every
 * frame, never accumulated, so fast scrolling, reverse scrolling, a mid-page
 * reload and back/forward all resolve to the correct state.
 */

export interface WorldFrame {
  /** Continuous narrative time, 0 .. sections.length - 1. */
  t: number;
  /** Whole-document scroll progress, 0..1. */
  total: number;
  /** Viewport height at measure time. */
  vh: number;
}

interface WorldApi {
  /** Currently active scene (40%-line rule, matching the nav). */
  active: SectionId;
  activeIndex: number;
  /** Whole-document progress, updated at a low rate for UI. */
  total: number;
  /** Per-frame subscription. Returns an unsubscribe. */
  subscribe: (fn: (f: WorldFrame) => void) => () => void;
  /** Latest frame, readable synchronously. */
  read: () => WorldFrame;
  jump: (id: SectionId) => void;
}

const Ctx = createContext<WorldApi | null>(null);

/**
 * Hold, then transform. The signal keeps a scene's shape through the first 58%
 * of its runway, then morphs into the next scene's shape across the boundary.
 * Without this the line drifts continuously and nothing can be registered
 * against it; with it, the transition between scenes is itself the transform.
 */
const HOLD = 0.58;
function shapeEase(local: number) {
  if (local <= HOLD) return 0;
  const x = (local - HOLD) / (1 - HOLD);
  return x * x * (3 - 2 * x);
}

export function useWorld(): WorldApi {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useWorld must be used inside <WorldProvider>");
  }
  return ctx;
}

/** Optional variant for components that may render outside the provider. */
export function useWorldOptional(): WorldApi | null {
  return useContext(Ctx);
}

/* -------------------------------------------------------------------------- */

export function WorldProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>(sections[0].id);
  const [total, setTotal] = useState(0);

  const frame = useRef<WorldFrame>({ t: 0, total: 0, vh: 0 });
  const subs = useRef(new Set<(f: WorldFrame) => void>());
  const geo = useRef<Array<{ id: SectionId; top: number; h: number }>>([]);
  const lastHash = useRef<string>("");
  const seeking = useRef(true);

  const subscribe = useCallback((fn: (f: WorldFrame) => void) => {
    subs.current.add(fn);
    fn(frame.current);
    return () => {
      subs.current.delete(fn);
    };
  }, []);

  const read = useCallback(() => frame.current, []);

  const jump = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Smooth only for short hops. This document is ~40,000px tall; a smooth
    // scroll between distant scenes would animate for many seconds and trap
    // the viewer.
    const distance = Math.abs(el.offsetTop - window.scrollY);
    const smooth =
      distance < window.innerHeight * 2.5 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.offsetTop, behavior: smooth ? "smooth" : "auto" });
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }, []);

  /* ---------------- geometry ---------------- */

  useEffect(() => {
    const measure = () => {
      geo.current = sections
        .map((s) => {
          const el = document.getElementById(s.id);
          return el ? { id: s.id, top: el.offsetTop, h: el.offsetHeight } : null;
        })
        .filter(Boolean) as Array<{ id: SectionId; top: number; h: number }>;
    };
    measure();

    // Scene heights depend on fonts and on the object plates settling.
    void document.fonts?.ready.then(measure);
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 900);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(document.body);
    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ---------------- frame loop ---------------- */

  useEffect(() => {
    let raf = 0;
    let lastActive: SectionId | null = null;
    let lastTotalBucket = -1;

    const tick = () => {
      raf = 0;
      const g = geo.current;
      const vh = window.innerHeight;
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      const totalNow = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;

      // Narrative time: the viewport centre's position within the scene stack.
      //
      // The fractional part is eased so the signal HOLDS its scene shape for
      // most of the runway and then transforms across the boundary. Two things
      // depend on this: scenes can anchor objects to the signal while it is
      // stable, and scene changes read as one system transforming rather than
      // as a shape drifting continuously under the content.
      let t = 0;
      if (g.length) {
        const y = scrollTop + vh * 0.5;
        if (y <= g[0].top) {
          t = 0;
        } else if (y >= g[g.length - 1].top + g[g.length - 1].h) {
          t = g.length - 1;
        } else {
          for (let i = 0; i < g.length; i++) {
            const s = g[i];
            if (y >= s.top && y < s.top + s.h) {
              const local = s.h > 0 ? (y - s.top) / s.h : 0;
              t = i + shapeEase(local);
              break;
            }
            if (y < s.top) {
              t = i; // in a gap: hold at the upcoming scene
              break;
            }
          }
        }
      }

      frame.current = { t, total: totalNow, vh };
      subs.current.forEach((fn) => fn(frame.current));

      // Discrete state: active = last scene whose top is above the 40% line.
      const line = scrollTop + vh * 0.4;
      let current: SectionId = sections[0].id;
      for (const s of g) if (s.top <= line) current = s.id;
      if (current !== lastActive) {
        lastActive = current;
        setActive(current);
        if (!seeking.current && lastHash.current !== current) {
          lastHash.current = current;
          window.history.replaceState(null, "", `#${current}`);
        }
      }

      // Progress bar only needs ~0.25% resolution; this keeps React quiet.
      const bucket = Math.round(totalNow * 400);
      if (bucket !== lastTotalBucket) {
        lastTotalBucket = bucket;
        setTotal(totalNow);
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ---------------- deep links ---------------- */

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const goToHash = (initial: boolean) => {
      const id = window.location.hash.slice(1);
      const target = id && sections.some((s) => s.id === id) ? document.getElementById(id) : null;
      if (!target) {
        seeking.current = false;
        return;
      }
      lastHash.current = id;
      seeking.current = true;

      const seek = () => {
        if (!cancelled) window.scrollTo({ top: target.offsetTop, behavior: "auto" });
      };
      seek();
      // Fonts and object plates land after the browser's own hash jump, and
      // these scenes are tall enough that the initial landing drifts.
      timers.push(window.setTimeout(seek, 120));
      timers.push(
        window.setTimeout(
          () => {
            seek();
            seeking.current = false;
          },
          initial ? 420 : 160,
        ),
      );
      void document.fonts?.ready.then(seek);
    };

    goToHash(true);
    const onHashChange = () => goToHash(false);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === active),
  );

  const api = useMemo<WorldApi>(
    () => ({ active, activeIndex, total, subscribe, read, jump }),
    [active, activeIndex, total, subscribe, read, jump],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

/* -------------------------------------------------------------------------- */

/**
 * Ambient loops and the travelling pulse are suppressed under reduced motion,
 * but the signal itself still renders in its correct scroll-derived shape —
 * content parity, not motion parity.
 */
export function useWorldMotionAllowed() {
  const reduced = usePrefersReducedMotion();
  return !reduced;
}
