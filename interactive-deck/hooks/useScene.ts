"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useScroll, useReducedMotion, type MotionValue } from "motion/react";
import { sections, type SectionId } from "@/content/drk";

/**
 * Scene progress: 0 when the scene's top hits the viewport top, 1 when its
 * bottom does. Used by every sticky scene.
 *
 * State is DERIVED from this ratio, never accumulated from a timeline — so
 * scrubbing, fast scrolling, reloading mid-page and back/forward all land on a
 * valid rendered state. See docs/DRK_INTERACTIVE_DECK_SPEC.md §3.2.
 */
export function useSceneProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return scrollYProgress;
}

/** Plain-number mirror of a MotionValue, for logic that must branch in React. */
export function useMotionNumber(mv: MotionValue<number>, precision = 3) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const round = (n: number) => Number(n.toFixed(precision));
    setV(round(mv.get()));
    return mv.on("change", (n) => setV(round(n)));
  }, [mv, precision]);
  return v;
}

/** True once the element has entered the viewport; stays true. */
export function useHasEntered(ref: React.RefObject<Element | null>, rootMargin = "-12% 0px") {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || entered) return;
    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEntered(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, entered, rootMargin]);
  return entered;
}

/**
 * Tracks which of the 14 scenes is active, plus overall page progress.
 * Writes the hash on change (replaceState — never pollutes history) and honours
 * an incoming hash on load.
 */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId>("intro");
  const [total, setTotal] = useState(0);
  const lastHash = useRef<string>("");

  /**
   * Honour an incoming hash on load.
   *
   * The browser's own hash jump fires before fonts and object plates have
   * settled, and these scenes are tall — so the initial landing drifts. Re-seek
   * once after layout is stable, and suppress hash rewriting until then so the
   * target is not overwritten on the way.
   */
  const seeking = useRef(true);
  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const goToHash = (initial: boolean) => {
      const id = window.location.hash.slice(1);
      const target =
        id && sections.some((s) => s.id === id) ? document.getElementById(id) : null;
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
      // Re-seek once layout settles: fonts and object plates land after the
      // browser's own hash jump, and these scenes are tall enough that the
      // initial landing drifts.
      timers.push(window.setTimeout(seek, 120));
      timers.push(
        window.setTimeout(() => {
          seek();
          seeking.current = false;
        }, initial ? 420 : 160),
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

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      raf = 0;
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setTotal(max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0);

      // Active = the last scene whose top is above the viewport's 40% line.
      const line = scrollTop + window.innerHeight * 0.4;
      let current: SectionId = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= line) current = s.id;
      }
      setActive(current);

      if (!seeking.current && lastHash.current !== current) {
        lastHash.current = current;
        window.history.replaceState(null, "", `#${current}`);
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, total };
}

/**
 * Motion's reducedMotion signal, normalised to a boolean.
 *
 * Held at `false` until after mount so the first client render is byte-identical
 * to the server render. Without this, a reduced-motion visitor hydrates a tree
 * whose scene state differs from the server's and React reports a mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? (reduced ?? false) : false;
}

/** Pause ambient loops while a scene is offscreen. */
export function useOffscreenFlag(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => el.setAttribute("data-offscreen", e.isIntersecting ? "false" : "true"),
      { rootMargin: "10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/**
 * Media query as boolean, SSR-safe.
 *
 * `initial` is used for the server render AND the first client render, so
 * hydration always matches. It defaults to the desktop assumption because this
 * is a desktop-first investor experience: starting desktop-true means the
 * primary target never sees a layout flash on load.
 */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)", true);
}

/**
 * Scene narrative state — the single contract every scrubbed scene uses.
 *
 *  - desktop, motion allowed  -> `p` scrubs 0..1 with scroll (pinned narrative)
 *  - mobile OR reduced motion -> `p` is 1: the scene renders fully composed,
 *    and entrance is handled by `Reveal` (in-view), not by scrub.
 *
 * This is what keeps mobile a genuine recomposition instead of a pinned
 * desktop scene squeezed onto a phone, and it guarantees content parity under
 * `prefers-reduced-motion`.
 */
export function useSceneNarrative(ref: React.RefObject<HTMLElement | null>) {
  const mv = useSceneProgress(ref);
  const raw = useMotionNumber(mv);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const scrub = isDesktop && !reduced;
  return { p: scrub ? raw : 1, raw, scrub, isDesktop, reduced };
}

/** Stable list of scene ids for nav/keyboard order. */
export function useSectionIds() {
  return useMemo(() => sections.map((s) => s.id), []);
}
