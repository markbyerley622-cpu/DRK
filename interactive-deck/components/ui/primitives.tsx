"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MOTION } from "@/lib/motion";
import { cn, clamp01 } from "@/lib/utils";
import { objectSystem, type ObjectId } from "@/content/drk";
import { usePrefersReducedMotion } from "@/hooks/useScene";

/* ========================================================================== */
/* SECTION LABEL — system telemetry, not a heading                             */
/* ========================================================================== */

export function SectionLabel({
  index,
  children,
  className,
  tone = "faint",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  tone?: "faint" | "signal";
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "h-px w-6 shrink-0",
          tone === "signal" ? "bg-[var(--color-signal)]" : "bg-[var(--color-hairline-strong)]",
        )}
      />
      {index && (
        <span className="drk-label drk-mono text-[var(--color-signal)]">{index}</span>
      )}
      <span className={cn("drk-label", tone === "signal" && "text-[var(--color-signal)]")}>
        {children}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* METRIC                                                                      */
/* ========================================================================== */

export function Metric({
  value,
  label,
  size = "md",
  tone = "signal",
  sub,
  className,
}: {
  value: string;
  label: string;
  size?: "sm" | "md" | "lg";
  tone?: "signal" | "ink";
  sub?: string;
  className?: string;
}) {
  const sizes = {
    sm: "text-[var(--step-metric-sm)]",
    md: "text-[clamp(1.75rem,3vw,2.75rem)]",
    lg: "text-[var(--step-metric)]",
  };
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="drk-label">{label}</span>
      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-semibold leading-[0.95] tracking-[-0.03em] drk-tnum",
          sizes[size],
          tone === "signal" ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]",
        )}
      >
        {value}
      </span>
      {sub && <span className="text-sm text-[var(--color-faint)]">{sub}</span>}
    </div>
  );
}

/* ========================================================================== */
/* GLASS PANEL — dark smoked, thin graphite border                             */
/* ========================================================================== */

export function GlassPanel({
  children,
  className,
  active = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={cn(
        "drk-glass transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
        active && "drk-glass-active",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ========================================================================== */
/* SOURCE REFERENCE — must stay legible. Never microscopic grey.               */
/* ========================================================================== */

export function SourceRef({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "drk-mono text-[0.72rem] leading-relaxed tracking-[0.04em] text-[var(--color-muted)]",
        className,
      )}
    >
      <span className="text-[var(--color-fineprint)]">Source: </span>
      {children}
    </p>
  );
}

/* ========================================================================== */
/* STATUS                                                                      */
/* ========================================================================== */

export function StatusDot({
  state = "active",
  label,
  className,
}: {
  state?: "active" | "idle" | "locked" | "complete";
  label?: string;
  className?: string;
}) {
  const map = {
    active: { dot: "bg-[var(--color-signal)]", ring: "shadow-[0_0_10px_0_rgba(0,224,96,0.7)]", text: "text-[var(--color-signal)]" },
    complete: { dot: "bg-[var(--color-signal-mid)]", ring: "", text: "text-[var(--color-signal-mid)]" },
    idle: { dot: "bg-[var(--color-dim)]", ring: "", text: "text-[var(--color-faint)]" },
    locked: { dot: "bg-[var(--color-warn)]", ring: "", text: "text-[var(--color-warn)]" },
  }[state];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", map.dot, map.ring)} />
      {label && <span className={cn("drk-label", map.text)}>{label}</span>}
    </span>
  );
}

/* ========================================================================== */
/* DATA NODE — the recurring route/graph joint                                 */
/* ========================================================================== */

export function DataNode({ active = false, size = 9 }: { active?: boolean; size?: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0 rounded-full transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
      style={{
        width: size,
        height: size,
        background: active ? "var(--color-signal)" : "var(--color-hairline-strong)",
        boxShadow: active ? "0 0 12px 0 rgba(0,224,96,0.75)" : "none",
      }}
    />
  );
}

/* ========================================================================== */
/* OBJECT PLATE — a harvested DRK 3D object                                    */
/* ========================================================================== */

/**
 * Everything `/brand/objects` can render: the twelve catalogued objects plus
 * the loose plates and pose variants that live beside them. The variants
 * (`-angled`, `-open`, `drk-token`) are alternate renders of an object that is
 * already in the system — they are available, but a single scene must never
 * mix a variant with its base pose, or the object stops reading as the same
 * recurring character.
 */
export type PlateId =
  | ObjectId
  | "wallet"
  | "wallet-open"
  | "falling-chart"
  | "lc-beacon"
  | "lc-chart"
  | "raise-ring"
  | "security-lock-angled"
  | "drk-token";

export function ObjectPlate({
  id,
  width,
  className,
  priority = false,
  alt,
  style,
}: {
  id: PlateId;
  width: number;
  className?: string;
  priority?: boolean;
  alt?: string;
  style?: React.CSSProperties;
}) {
  const known = (objectSystem as Record<string, { name: string; src: string | null }>)[id];
  const src = known?.src ?? `/brand/objects/${id}.png`;
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      aria-hidden={alt ? undefined : true}
      width={width}
      height={width}
      priority={priority}
      sizes={`${width}px`}
      className={cn("drk-plate h-auto w-full max-w-full object-contain", className)}
      style={style}
    />
  );
}

/* ========================================================================== */
/* SYSTEM OBJECT — the object continuity contract                              */
/* ========================================================================== */

/**
 * The DRK objects are recurring characters, not per-section art. The single
 * biggest thing that broke that illusion in the first build was scale: the
 * Execution Engine appeared at roughly 56px, 130px, 160px and 280px in four
 * different scenes, so it read as four unrelated images.
 *
 * One ladder, used everywhere. `chip` is the smallest size at which a harvested
 * plate is still legible as an object rather than a smudge — nothing smaller is
 * offered on purpose.
 */
export const OBJECT_SCALE = {
  chip: "clamp(2.75rem, 3.4vw, 3.5rem)",
  small: "clamp(3.75rem, 5.2vw, 5.25rem)",
  medium: "clamp(5.5rem, 8vw, 8.5rem)",
  large: "clamp(8rem, 12vw, 13rem)",
  hero: "clamp(11rem, 17vw, 19rem)",
} as const;

export type ObjectScale = keyof typeof OBJECT_SCALE;

/** Intrinsic request widths, so next/image never over- or under-fetches. */
const REQUEST_W: Record<ObjectScale, number> = {
  chip: 140,
  small: 220,
  medium: 340,
  large: 520,
  hero: 760,
};

export function SystemObject({
  id,
  scale = "medium",
  className,
  style,
  alt,
  priority = false,
}: {
  id: PlateId;
  scale?: ObjectScale;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center", className)}
      style={{ height: OBJECT_SCALE[scale], ...style }}
    >
      <ObjectPlate
        id={id}
        width={REQUEST_W[scale]}
        alt={alt}
        priority={priority}
        className="h-full w-auto max-w-none"
      />
    </span>
  );
}

/* ========================================================================== */
/* DIGITS — numeric readouts interpolate rather than swap                      */
/* ========================================================================== */

/**
 * Tween the numeric part of a formatted value ("$128.6M", "1.2 bps", "99.6%")
 * while preserving its prefix, suffix and decimal precision, so a value that
 * changes reads as an instrument moving rather than a label being replaced.
 *
 * Tabular figures are mandatory here — without them the readout jitters
 * horizontally on every frame.
 */
export function Digits({ value, className }: { value: string; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const match = /^([^0-9-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/.exec(value);
  const [shown, setShown] = useState(value);
  const fromRef = useRef<number | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!match || reduced) {
      setShown(value);
      return;
    }
    const [, prefix, numRaw, suffix] = match;
    const grouped = numRaw.includes(",");
    const decimals = numRaw.includes(".") ? numRaw.split(".")[1].length : 0;
    const to = Number(numRaw.replace(/,/g, ""));
    const from = fromRef.current;

    if (from === null || !Number.isFinite(from)) {
      fromRef.current = to;
      setShown(value);
      return;
    }

    const start = performance.now();
    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals);
      const body = grouped
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      return `${prefix}${body}${suffix}`;
    };

    const step = (now: number) => {
      const t = clamp01((now - start) / 480);
      const e = 1 - Math.pow(1 - t, 4);
      setShown(fmt(from + (to - from) * e));
      if (t < 1) raf.current = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return (
    <span className={cn("drk-tnum", className)}>
      {shown}
      {/* The animated text is decorative motion over a value that is already
          committed; assistive tech should read the settled value only. */}
      <span className="drk-sr-only">{value}</span>
    </span>
  );
}

/* ========================================================================== */
/* READOUT — a labelled instrument value                                       */
/* ========================================================================== */

export function Readout({
  label,
  value,
  tone = "signal",
  className,
  animate = true,
  wrap = false,
}: {
  label: string;
  value: string;
  tone?: "signal" | "ink" | "muted";
  className?: string;
  animate?: boolean;
  /** Non-numeric values (venue names, states) may wrap rather than truncate. */
  wrap?: boolean;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <span className={cn("drk-label block", wrap ? "leading-tight" : "truncate")}>{label}</span>
      <span
        className={cn(
          "drk-mono drk-tnum mt-1 block text-[clamp(0.9rem,1.3vw,1.12rem)] font-medium",
          wrap ? "leading-tight" : "truncate",
          tone === "signal"
            ? "text-[var(--color-signal)]"
            : tone === "ink"
              ? "text-[var(--color-ink)]"
              : "text-[var(--color-muted)]",
        )}
      >
        {animate ? <Digits value={value} /> : value}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* HEADLINE — oversized, authored line breaks, one signal clause               */
/* ========================================================================== */

export function Headline({
  children,
  size = "h1",
  className,
  id,
}: {
  children: ReactNode;
  size?: "display" | "h1" | "h2";
  className?: string;
  id?: string;
}) {
  const sizes = {
    display: "text-[var(--step-display)]",
    h1: "text-[var(--step-h1)]",
    h2: "text-[var(--step-h2)]",
  };
  return (
    <h2 id={id} className={cn(sizes[size], "text-[var(--color-ink)]", className)}>
      {children}
    </h2>
  );
}

export function Signal({ children }: { children: ReactNode }) {
  return <span className="text-[var(--color-signal)]">{children}</span>;
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "max-w-[46ch] text-[var(--step-lead)] leading-relaxed text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ========================================================================== */
/* HAIRLINE + PROGRESS                                                         */
/* ========================================================================== */

export function Hairline({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-[var(--color-hairline)]", className)} />;
}

export function StepProgress({
  count,
  active,
  className,
  labels,
}: {
  count: number;
  active: number;
  className?: string;
  labels?: string[];
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="flex items-center gap-2">
          <motion.span
            aria-hidden
            className="block h-px"
            animate={{
              width: i === active ? 34 : 16,
              backgroundColor: i <= active ? "var(--color-signal)" : "var(--color-hairline-strong)",
              opacity: i <= active ? 1 : 0.7,
            }}
            transition={MOTION.reconfigure}
          />
        </span>
      ))}
      {labels?.[active] && (
        <span className="drk-label ml-2 text-[var(--color-signal)]">{labels[active]}</span>
      )}
    </div>
  );
}
