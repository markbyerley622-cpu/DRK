"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useScene";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Dir = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: 22 },
  down: { x: 0, y: -22 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Section-reveal primitive. 500-900ms band, no overshoot.
 * Under reduced motion the child renders in its final state immediately —
 * content parity is absolute.
 */
export function Reveal({
  children,
  delay = 0,
  dir = "up",
  duration = 0.7,
  className,
  once = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  dir?: Dir;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "p";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  const reduced = usePrefersReducedMotion();
  const off = OFFSET[dir];
  const MotionTag = motion[Tag] as typeof motion.div;

  if (reduced) {
    return (
      <MotionTag ref={ref} className={className}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      data-motion-hidden=""
      className={className}
      initial={{ opacity: 0, x: off.x, y: off.y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ ...MOTION.activate, duration, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered group. Children reveal in sequence within the 500-900ms band. */
export function Stagger({
  children,
  className,
  step = 0.08,
  delay = 0,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  delay?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={delay + i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Masked line reveal — the deck's headline energy. The clip-path wipe reads as
 * a lighting state change rather than a fade.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();

  return (
    <span ref={ref} className={cn("block overflow-hidden", className)}>
      <motion.span
        data-motion-hidden=""
        className="block"
        initial={reduced ? false : { y: "104%" }}
        animate={inView || reduced ? { y: "0%" } : undefined}
        transition={{ ...MOTION.resolve, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
