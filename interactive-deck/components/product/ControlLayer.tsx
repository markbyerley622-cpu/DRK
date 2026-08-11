"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Allocation, LineSeries, Spark, useMorphSeries } from "@/components/visuals/charts";
import { Digits } from "@/components/ui/primitives";
import {
  analyticsMetrics,
  control,
  executionEvents,
  launchTimeline,
  lifecycle,
  plWindows,
  programDetail,
  walletDetail,
} from "@/content/drk";
import { cn, clamp01, range } from "@/lib/utils";
import { MOTION, TW } from "@/lib/motion";

/**
 * THE DRK CONTROL LAYER
 * ============================================================================
 * Replaces the source deck's "Platform demo — insert live product views"
 * placeholder (page 11), and is the centrepiece of the experience.
 *
 * ART DIRECTION. This surface is no longer designed from first principles. The
 * supplied `demo.mp4` is a screen recording of the REAL DRK application, and
 * this is built to its language:
 *
 *   - a thin environment + counters bar above everything
 *   - a narrow grouped rail (OVERVIEW / POSITION / OPERATE / EVIDENCE) with a
 *     green left bar on the active item
 *   - page headers as title + strap, with a status pill and controls
 *     right-aligned on the same baseline
 *   - **information without containers** — the product's defining pattern is a
 *     grid of value-over-label cells with no card, no border and no background,
 *     separated by nothing but alignment: `0.001284 / Price` · `25 bps / Fee`
 *   - real ledgers with ruled rows and right-aligned numerics
 *   - dense, meaningful provenance; never decorative telemetry
 *
 * Everything it renders is still built only from capabilities the pitch deck
 * states, every value is illustrative, and every module carries the source
 * capability it derives from.
 */

type Module = (typeof control.modules)[number];

/* ========================================================================== */
/* PRIMITIVES — the product's own structural language                          */
/* ========================================================================== */

/** A field of value-over-label cells. No box. This is the house pattern. */
function Field({
  cells,
  cols = 4,
  size = "md",
  className,
}: {
  cells: ReadonlyArray<{ v: string; l: string; tone?: "ink" | "signal" }>;
  cols?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-[0.95rem]",
    md: "text-[clamp(1.05rem,1.5vw,1.3rem)]",
    lg: "text-[clamp(1.4rem,2.2vw,1.95rem)]",
  };
  return (
    <dl
      className={cn("drk-field", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {cells.map((c) => (
        <div key={c.l} className="min-w-0">
          <dd
            className={cn(
              "drk-field-v truncate",
              sizes[size],
              c.tone === "signal" && "text-[var(--color-signal)]",
            )}
          >
            <Digits value={c.v} />
          </dd>
          <dt className="drk-field-l truncate">{c.l}</dt>
        </div>
      ))}
    </dl>
  );
}

/** A status pill, exactly as the product uses them: dot + word, nothing more. */
function Pill({ label, tone = "signal" }: { label: string; tone?: "signal" | "idle" | "warn" }) {
  const map = {
    signal: "border-[var(--color-hairline-signal)] text-[var(--color-signal)]",
    idle: "border-[var(--color-hairline)] text-[var(--color-faint)]",
    warn: "border-[color-mix(in_srgb,var(--color-warn)_35%,transparent)] text-[var(--color-warn)]",
  }[tone];
  const dot = {
    signal: "bg-[var(--color-signal)]",
    idle: "bg-[var(--color-dim)]",
    warn: "bg-[var(--color-warn)]",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-chip)] border px-2 py-[0.15rem]",
        map,
      )}
    >
      <span aria-hidden className={cn("size-1 shrink-0 rounded-full", dot)} />
      <span className="drk-label whitespace-nowrap text-[0.58rem] tracking-[0.14em] text-current">
        {label}
      </span>
    </span>
  );
}

/** The product's section header: title + strap left, state + controls right. */
function Head({
  title,
  strap,
  pill,
  controls,
}: {
  title: string;
  strap: string;
  pill?: { label: string; tone?: "signal" | "idle" | "warn" };
  controls?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2 border-b border-[var(--color-hairline)] pb-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h4 className="text-[clamp(1rem,1.5vw,1.25rem)] font-semibold tracking-[-0.025em] text-[var(--color-ink)]">
            {title}
          </h4>
          {pill && <Pill label={pill.label} tone={pill.tone} />}
        </div>
        <p className="mt-1 max-w-[54ch] text-[0.8rem] leading-snug text-[var(--color-muted)]">
          {strap}
        </p>
      </div>
      {controls && <div className="flex shrink-0 items-center gap-2">{controls}</div>}
    </div>
  );
}

/** A ledger. Ruled rows, right-aligned numerics, no card. */
function Ledger({
  columns,
  rows,
  selected,
  onSelect,
  label,
}: {
  columns: ReadonlyArray<{ k: string; head: string; align?: "r"; w?: string }>;
  rows: ReadonlyArray<{ key: string; cells: React.ReactNode[] }>;
  selected?: string;
  onSelect?: (k: string) => void;
  label: string;
}) {
  const grid = columns.map((c) => c.w ?? "minmax(0,1fr)").join(" ");
  // role="grid", not "table": these rows are selectable, and `aria-selected` is
  // only valid on a row inside a grid. `aria-pressed` on a row is a hard ARIA
  // violation, which is exactly what the audit caught.
  return (
    <div role="grid" aria-label={label} className="min-w-0">
      <div
        role="row"
        className="grid items-center gap-x-3 border-b border-[var(--color-hairline)] pb-1.5"
        style={{ gridTemplateColumns: grid }}
      >
        {columns.map((c) => (
          <span
            key={c.k}
            role="columnheader"
            className={cn(
              "drk-label truncate text-[0.56rem] tracking-[0.16em]",
              c.align === "r" && "text-right",
            )}
          >
            {c.head}
          </span>
        ))}
      </div>
      {rows.map((r) => {
        const on = selected === r.key;
        const inner = r.cells.map((cell, i) => (
          <span
            key={columns[i].k}
            role="gridcell"
            className={cn("min-w-0", columns[i].align === "r" && "text-right")}
          >
            {cell}
          </span>
        ));
        const cls = cn(
          "grid w-full items-center gap-x-3 border-b border-[var(--color-hairline)] py-[0.48rem] text-left transition-colors last:border-b-0",
          TW.ui,
          on ? "bg-[var(--color-panel-2)]" : onSelect && "hover:bg-[var(--color-panel)]",
        );
        return onSelect ? (
          <button
            key={r.key}
            role="row"
            type="button"
            aria-selected={on}
            onClick={() => onSelect(r.key)}
            className={cls}
            style={{ gridTemplateColumns: grid }}
          >
            {inner}
          </button>
        ) : (
          <div key={r.key} role="row" className={cls} style={{ gridTemplateColumns: grid }}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

function Name({ children, on }: { children: React.ReactNode; on?: boolean }) {
  return (
    <span
      className={cn(
        "block truncate text-[0.84rem]",
        on ? "font-medium text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]",
      )}
    >
      {children}
    </span>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <span className="block truncate text-[0.76rem] text-[var(--color-muted)]">{children}</span>;
}

/** A numeric cell. Tabular and brighter than its neighbours — money reads as money. */
function Num({ children, tone }: { children: React.ReactNode; tone?: "signal" }) {
  return (
    <span
      className={cn(
        "drk-tnum block truncate font-[family-name:var(--font-display)] text-[0.86rem] font-medium tracking-[-0.01em]",
        tone === "signal" ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]",
      )}
    >
      {children}
    </span>
  );
}

/** A segmented control, in the product's timeframe-chip style. */
function Chips<T extends { key: string; label: string }>({
  items,
  active,
  onSelect,
  ariaLabel,
}: {
  items: readonly T[];
  active: number;
  onSelect: (i: number) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex gap-1 rounded-[var(--radius-chip)] border border-[var(--color-hairline)] p-[2px]"
    >
      {items.map((it, i) => {
        const on = i === active;
        return (
          <button
            key={it.key}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(i)}
            className={cn(
              "flex min-h-[32px] items-center rounded-[2px] px-2.5 transition-colors",
              TW.ui,
              on ? "bg-[var(--color-signal-shade)]" : "hover:bg-[var(--color-panel-2)]",
            )}
          >
            <span
              className={cn(
                "drk-label text-[0.58rem] tracking-[0.12em]",
                on ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
              )}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ========================================================================== */
/* SHELL                                                                       */
/* ========================================================================== */

export function ControlLayer({
  modules,
  activeIndex,
  onSelect,
  chartProgress,
  compact = false,
  dense,
  stacked = false,
  bodyHeight = "clamp(15rem,34vh,21rem)",
}: {
  modules: readonly Module[];
  activeIndex: number;
  onSelect?: (i: number) => void;
  chartProgress: number;
  /** Phone layout: the rail wraps instead of running vertically. */
  compact?: boolean;
  /** Narrow surface: module bodies stack into one column. */
  dense?: boolean;
  /**
   * Render EVERY module in sequence instead of one at a time. Used wherever the
   * narrative cannot drive the rail — on a phone, and under reduced motion — so
   * a passive reader never sees one module and misses six.
   */
  stacked?: boolean;
  bodyHeight?: string;
}) {
  const isDense = dense ?? compact;
  const active = modules[activeIndex];
  const uid = useId().replace(/:/g, "");
  const railRef = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      if (!onSelect) return;
      const dir =
        e.key === "ArrowDown" || e.key === "ArrowRight"
          ? 1
          : e.key === "ArrowUp" || e.key === "ArrowLeft"
            ? -1
            : 0;
      if (!dir) return;
      e.preventDefault();
      const next = (i + dir + modules.length) % modules.length;
      onSelect(next);
      railRef.current?.querySelectorAll<HTMLButtonElement>("[data-mod]")[next]?.focus();
    },
    [modules.length, onSelect],
  );

  if (stacked) {
    return (
      <div className="drk-surface overflow-hidden">
        <TelemetryBar />
        <ul>
          {modules.map((m) => (
            <li key={m.key} className="border-b border-[var(--color-hairline)] p-4 last:border-b-0">
              <ModuleView module={m} progress={1} dense />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="drk-surface overflow-hidden">
      <TelemetryBar />

      <div className={cn("grid", compact ? "grid-cols-1" : "sm:grid-cols-[auto_minmax(0,1fr)]")}>
        {/* ================= rail ================= */}
        <div
          ref={railRef}
          role="tablist"
          aria-label="Control layer modules"
          aria-orientation={compact ? "horizontal" : "vertical"}
          className={cn(
            "border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-void)_50%,var(--color-panel))]",
            compact
              ? "flex flex-wrap border-b"
              : "flex flex-wrap border-b sm:h-full sm:w-[9.5rem] sm:flex-col sm:flex-nowrap sm:border-b-0 sm:border-r sm:pb-3",
          )}
        >
          {control.groups.map((g) => {
            const items = g.keys
              .map((k) => modules.findIndex((m) => m.key === k))
              .filter((i) => i >= 0);
            if (!items.length) return null;
            return (
              <div key={g.label} className={cn(compact ? "contents" : "w-full")}>
                {/* The product groups its rail; the group labels are the reason
                    it reads as an application rather than as a tab strip. */}
                {!compact && (
                  <span className="drk-label mb-1 mt-3.5 block px-3.5 text-[0.53rem] tracking-[0.2em] text-[var(--color-faint)]">
                    {g.label}
                  </span>
                )}
                {items.map((i) => {
                  const m = modules[i];
                  const on = i === activeIndex;
                  return (
                    <button
                      key={m.key}
                      data-mod
                      role="tab"
                      type="button"
                      id={`${uid}-tab-${m.key}`}
                      aria-selected={on}
                      aria-controls={`${uid}-panel`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => onSelect?.(i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      className={cn(
                        "group relative flex items-center py-[0.46rem] pl-3.5 pr-3 text-left transition-colors",
                        TW.ui,
                        compact ? "min-w-0 flex-1 basis-[6.75rem]" : "w-full",
                        on ? "bg-[var(--color-panel-2)]" : "hover:bg-[var(--color-panel)]",
                      )}
                    >
                      {/* the product marks the active item with a green left bar */}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-y-0 left-0 w-[2px] transition-colors",
                          TW.ui,
                        )}
                        style={{ background: on ? "var(--color-signal)" : "transparent" }}
                      />
                      <span
                        className={cn(
                          "truncate text-[0.81rem] transition-colors",
                          TW.ui,
                          on
                            ? "font-medium text-[var(--color-ink)]"
                            : "text-[var(--color-faint)] group-hover:text-[var(--color-muted)]",
                        )}
                      >
                        {m.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ================= body ================= */}
        <div
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${active.key}`}
          tabIndex={-1}
          className="min-w-0 p-4 sm:p-5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={MOTION.reconfigure}
            >
              <div
                className="drk-fade-b overflow-y-auto"
                tabIndex={0}
                role="region"
                aria-label={`${active.name} detail`}
                style={{
                  height: isDense ? undefined : bodyHeight,
                  minHeight: isDense ? "12rem" : undefined,
                }}
              >
                <ModuleView module={active} progress={chartProgress} dense={isDense} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The environment + counters bar, modelled directly on the real product, which
 * runs `MAINNET · Instances 1/1 live · Pools 1 · Actions 0 · Executions 1`
 * above every page. Every counter here is a figure already in the manifest.
 */
function TelemetryBar() {
  return (
    <div className="flex items-center gap-3 overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-panel-2)] px-3.5 py-[0.55rem]">
      <span className="shrink-0 font-[family-name:var(--font-display)] text-[0.88rem] font-bold tracking-[-0.04em] text-[var(--color-ink)]">
        DRK<span className="text-[var(--color-signal)]">.</span>
      </span>
      <span className="shrink-0 rounded-[var(--radius-chip)] border border-[var(--color-hairline-signal)] px-1.5 py-[0.08rem]">
        <span className="drk-mono text-[0.56rem] tracking-[0.14em] text-[var(--color-signal)]">
          {control.environment}
        </span>
      </span>

      <dl className="flex min-w-0 items-baseline gap-3 overflow-hidden">
        {control.telemetry.map((t) => (
          <div key={t.label} className="flex shrink-0 items-baseline gap-1.5">
            <dt className="text-[0.66rem] text-[var(--color-faint)]">{t.label}</dt>
            <dd className="drk-tnum font-[family-name:var(--font-display)] text-[0.7rem] font-medium text-[var(--color-ink-soft)]">
              {t.value}
            </dd>
          </div>
        ))}
      </dl>

      <span className="ml-auto shrink-0">
        <Pill label="LIVE" />
      </span>
    </div>
  );
}

/* ========================================================================== */
/* MODULES                                                                     */
/* ========================================================================== */

function ModuleView({
  module: m,
  progress,
  dense,
}: {
  module: Module;
  progress: number;
  dense: boolean;
}) {
  const body = (() => {
    switch (m.key) {
      case "overview":
        return <Overview progress={progress} dense={dense} />;
      case "wallets":
        return <Wallets module={m} progress={progress} dense={dense} />;
      case "programs":
        return <Programs module={m} progress={progress} dense={dense} />;
      case "execution":
        return <Execution progress={progress} dense={dense} />;
      case "pl":
        return <PL progress={progress} dense={dense} />;
      case "analytics":
        return <Analytics progress={progress} dense={dense} />;
      case "launches":
        return <Launches progress={progress} dense={dense} />;
      default:
        return null;
    }
  })();

  return (
    <>
      {body}
      <p className="mt-4 border-t border-[var(--color-hairline)] pt-2.5 text-[0.72rem] leading-relaxed text-[var(--color-fineprint)]">
        <span className="text-[var(--color-faint)]">Source capability: </span>
        {m.capability}
      </p>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Overview({ progress, dense }: { progress: number; dense: boolean }) {
  const total = Object.values(programDetail).reduce(
    (s, x) => s + Number(x.deployed.replace(/[^0-9.]/g, "")),
    0,
  );
  const capital = Object.entries(programDetail).map(([label, d]) => ({
    label,
    value: Math.round((Number(d.deployed.replace(/[^0-9.]/g, "")) / total) * 100),
  }));

  return (
    <>
      <Head
        title="Overview"
        strap="The whole book, one surface: capital, programs, execution and P/L."
        pill={{ label: "OBSERVED" }}
      />

      <Field
        className="mt-4"
        size="lg"
        cols={dense ? 2 : 4}
        cells={[
          { v: "$128.6M", l: "Total value", tone: "signal" },
          { v: "4", l: "Active programs" },
          { v: "2,341", l: "Executions today" },
          { v: "$3.72M", l: "Daily P/L" },
        ]}
      />

      <div className={cn("mt-5 grid gap-5", dense ? "grid-cols-1" : "grid-cols-2")}>
        <div className="min-w-0">
          <span className="drk-label">CAPITAL BY PROGRAM</span>
          <Allocation
            className="mt-2.5"
            segments={capital}
            progress={progress}
            label="Illustrative deployed capital by program"
            compact
          />
        </div>
        <div className="min-w-0">
          <span className="drk-label">LAUNCH LIFECYCLE</span>
          <ol className="mt-2.5">
            {lifecycle.stages.map((s, i) => {
              const on = i <= 3;
              return (
                <li key={s.key} className="drk-row flex items-center gap-2.5 py-[0.3rem]">
                  <span
                    aria-hidden
                    className="h-px w-3.5 shrink-0"
                    style={{ background: on ? "var(--color-signal)" : "#232b21" }}
                  />
                  <span
                    className={cn(
                      "flex-1 truncate text-[0.79rem]",
                      on ? "text-[var(--color-ink-soft)]" : "text-[var(--color-faint)]",
                    )}
                  >
                    {s.name}
                  </span>
                  <span
                    className={cn(
                      "drk-label text-[0.56rem]",
                      on ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                    )}
                  >
                    {on ? "PASSED" : "PENDING"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Wallets({
  module: m,
  progress,
  dense,
}: {
  module: Module;
  progress: number;
  dense: boolean;
}) {
  const rows = "rows" in m ? m.rows : [];
  const [sel, setSel] = useState<string>(rows[0]?.name ?? "");
  const row = rows.find((r) => r.name === sel) ?? rows[0];
  if (!row) return null;
  const d = walletDetail[row.name as keyof typeof walletDetail];

  return (
    <>
      <Head
        title="Wallets"
        strap="Client-owned custody, permissions and real-time balances."
        pill={{ label: "CLIENT-OWNED" }}
      />

      {/* The field reports the SELECTED wallet, so choosing a row changes the
          whole surface rather than opening a panel over it. */}
      <Field
        className="mt-4"
        cols={dense ? 2 : 4}
        cells={[
          { v: "$128.6M", l: "Total value", tone: "signal" },
          { v: d.deployed, l: `Deployed — ${row.name.split(" — ")[0].toLowerCase()}` },
          { v: d.available, l: "Available" },
          { v: `${d.allocation}%`, l: "Share of book" },
        ]}
      />

      <div className="mt-5">
        <Ledger
          label="Client-owned wallets"
          selected={sel}
          onSelect={setSel}
          columns={[
            { k: "n", head: "WALLET" },
            { k: "c", head: "NETWORK", w: "minmax(0,0.55fr)" },
            { k: "v", head: "VALUE", align: "r", w: "minmax(0,0.55fr)" },
            { k: "p", head: "PERMISSIONS", align: "r", w: "minmax(0,0.85fr)" },
            { k: "s", head: "STATUS", align: "r", w: "minmax(0,0.62fr)" },
          ]}
          rows={rows.map((r) => ({
            key: r.name,
            cells: [
              <Name key="n" on={r.name === sel}>
                {r.name}
              </Name>,
              <Sub key="c">{r.chain}</Sub>,
              <Num key="v">{r.value}</Num>,
              <span key="p" className="drk-label block truncate text-[0.56rem]">
                {r.perms}
              </span>,
              <span key="s" className="inline-flex justify-end">
                <Pill
                  label={r.state}
                  tone={r.state === "ACTIVE" ? "signal" : r.state === "LOCKED" ? "warn" : "idle"}
                />
              </span>,
            ],
          }))}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="drk-label shrink-0">DEPLOYED INTO</span>
        <span aria-hidden className="h-[3px] flex-1 overflow-hidden bg-[#1b211a]">
          <span
            className={cn("block h-full bg-[var(--color-signal)] transition-[width]", TW.state)}
            style={{ width: `${d.allocation * clamp01(progress)}%` }}
          />
        </span>
        <span className="shrink-0 text-[0.78rem] text-[var(--color-ink-soft)]">{d.program}</span>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Programs({
  module: m,
  progress,
  dense,
}: {
  module: Module;
  progress: number;
  dense: boolean;
}) {
  const rows = "rows" in m ? m.rows : [];
  const [sel, setSel] = useState<string>(rows[0]?.name ?? "");
  const row = rows.find((r) => r.name === sel) ?? rows[0];
  const d = programDetail[(row?.name ?? "") as keyof typeof programDetail];
  const series = useMorphSeries(d?.series ?? []);
  if (!row || !d) return null;

  return (
    <>
      <Head
        title="Programs"
        strap="Reusable strategy frameworks deployed across venues."
        pill={{
          label: d.result === "STANDBY" ? "ARMED" : "RUNNING",
          tone: d.result === "STANDBY" ? "idle" : "signal",
        }}
      />

      <Field
        className="mt-4"
        cols={dense ? 2 : 4}
        cells={[
          { v: "4", l: "Active programs", tone: "signal" },
          { v: d.deployed, l: "Capital deployed" },
          { v: d.venue, l: "Venue" },
          { v: d.activity.replace(" executions today", ""), l: "Executions today" },
        ]}
      />

      <div
        className={cn(
          "mt-5 grid gap-5",
          dense ? "grid-cols-1" : "grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]",
        )}
      >
        <Ledger
          label="Strategy frameworks"
          selected={sel}
          onSelect={setSel}
          columns={[
            { k: "n", head: "PROGRAM" },
            { k: "p", head: "PHASE", align: "r", w: "minmax(0,0.95fr)" },
            { k: "s", head: "STATUS", align: "r", w: "minmax(0,0.62fr)" },
          ]}
          rows={rows.map((r) => ({
            key: r.name,
            cells: [
              <Name key="n" on={r.name === sel}>
                {r.name}
              </Name>,
              <span key="p" className="drk-label block truncate text-[0.56rem]">
                {r.perms}
              </span>,
              <span key="s" className="inline-flex justify-end">
                <Pill label={r.value} tone={r.state === "ACTIVE" ? "signal" : "idle"} />
              </span>,
            ],
          }))}
        />

        <div className="min-w-0">
          <span className="drk-label block truncate">ACTIVITY</span>
          <Spark
            className="mt-2"
            values={series}
            progress={progress}
            height={dense ? 44 : 78}
            label={`Illustrative activity trend for ${row.name}`}
          />
          {/* The field above already reports the execution count; repeating it
              here was the surface stating the same number twice. */}
          <Field
            className="mt-3"
            cols={2}
            size="sm"
            cells={[
              { v: d.phase, l: "Phase" },
              { v: d.result, l: "State" },
            ]}
          />
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

const ROUTE_STOPS = ["ROUTING", "VENUE", "FILL"];

function Execution({ progress, dense }: { progress: number; dense: boolean }) {
  // Events arrive with scroll, so the stream reads as live — but the count is
  // DERIVED from progress, so scrubbing backwards is a valid state.
  const arrived = Math.max(1, Math.round(range(progress, 0.05, 0.85) * executionEvents.length));
  const visible = executionEvents.slice(0, arrived);

  const [pinned, setPinned] = useState<string | null>(null);
  const lastArrived = useRef(arrived);
  useEffect(() => {
    if (lastArrived.current !== arrived) {
      lastArrived.current = arrived;
      setPinned(null);
    }
  }, [arrived]);

  const sel = visible.find((e) => e.id === pinned) ?? visible[visible.length - 1];

  return (
    <>
      <Head
        title="Execution"
        strap="Routing, fill quality and latency, measured continuously."
        pill={{ label: "LIVE" }}
      />

      <Field
        className="mt-4"
        cols={dense ? 2 : 4}
        cells={[
          { v: "2,341", l: "Executions today", tone: "signal" },
          { v: "1.2 bps", l: "Avg. slippage" },
          { v: "99.6%", l: "Fill rate" },
          { v: "18ms", l: "Latency" },
        ]}
      />

      <div
        className={cn(
          "mt-5 grid gap-5",
          dense ? "grid-cols-1" : "grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]",
        )}
      >
        <Ledger
          label="Execution stream"
          selected={sel?.id}
          onSelect={setPinned}
          columns={[
            { k: "t", head: "TIME", w: "minmax(0,0.6fr)" },
            { k: "v", head: "VENUE" },
            { k: "z", head: "SIZE", align: "r", w: "minmax(0,0.58fr)" },
            { k: "s", head: "SLIP", align: "r", w: "minmax(0,0.38fr)" },
            { k: "l", head: "LAT", align: "r", w: "minmax(0,0.38fr)" },
          ]}
          rows={visible.map((e) => ({
            key: e.id,
            cells: [
              <span
                key="t"
                className="drk-mono drk-tnum block truncate text-[0.7rem] text-[var(--color-faint)]"
              >
                {e.t}
              </span>,
              <span key="v" className="flex min-w-0 items-baseline gap-2">
                <Name on={e.id === sel?.id}>{e.venue}</Name>
                <span className="drk-label shrink-0 text-[0.54rem]">{e.side}</span>
              </span>,
              <Num key="z">{e.size}</Num>,
              <span key="s" className="drk-tnum block text-[0.76rem] text-[var(--color-muted)]">
                {e.slip}
              </span>,
              <span key="l" className="drk-tnum block text-[0.76rem] text-[var(--color-muted)]">
                {e.lat}
              </span>,
            ],
          }))}
        />

        <div className="min-w-0">
          <span className="drk-label">ROUTE TAKEN</span>
          {sel && (
            <>
              <ol className="mt-2.5">
                {sel.route.map((hop, i) => (
                  <li key={hop} className="drk-row flex items-center gap-2.5 py-[0.28rem]">
                    <span
                      aria-hidden
                      className="size-1 shrink-0 rounded-full bg-[var(--color-signal)]"
                    />
                    <span className="flex-1 truncate text-[0.77rem] text-[var(--color-ink-soft)]">
                      {hop}
                    </span>
                    <span className="drk-label text-[0.52rem]">{ROUTE_STOPS[i]}</span>
                  </li>
                ))}
              </ol>
              <Field
                className="mt-3"
                cols={2}
                size="sm"
                cells={[
                  { v: sel.fill, l: "Fill" },
                  { v: sel.id, l: "Execution" },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function PL({ progress, dense }: { progress: number; dense: boolean }) {
  const [i, setI] = useState(0);
  const w = plWindows[i];
  const series = useMorphSeries(w.series);
  const axis = useMemo(
    () =>
      w.key === "day"
        ? ["OPEN", "MID", "CLOSE"]
        : w.key === "mtd"
          ? ["W1", "W2", "W3", "W4"]
          : ["Q1", "Q2", "Q3", "Q4"],
    [w.key],
  );

  return (
    <>
      <Head
        title="P/L"
        strap="Attributed to program, venue and strategy."
        pill={{ label: "ATTRIBUTED" }}
        controls={<Chips items={plWindows} active={i} onSelect={setI} ariaLabel="P and L window" />}
      />

      {/* Financial hierarchy: one very large number, its label beneath it,
          nothing competing with it. */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="min-w-0">
          <span className="drk-tnum block font-[family-name:var(--font-display)] text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--color-signal)]">
            <Digits value={w.value} />
          </span>
          <span className="drk-field-l mt-1.5">{w.metricLabel}</span>
        </div>
        <Field
          size="sm"
          cols={3}
          className="min-w-[13rem] flex-1 md:max-w-[24rem]"
          cells={w.attribution.slice(0, 3).map((a) => ({ v: `${a.value}%`, l: a.label }))}
        />
      </div>

      <div className="mt-4">
        <LineSeries
          values={series}
          progress={progress}
          height={dense ? 120 : 148}
          axis={axis}
          label={`Illustrative ${w.label} profit and loss curve`}
        />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Analytics({ progress, dense }: { progress: number; dense: boolean }) {
  const [i, setI] = useState(0);
  const met = analyticsMetrics[i];
  const series = useMorphSeries(met.series);

  return (
    <>
      <Head
        title="Analytics"
        strap="One visualisation, four interpretations. Real-time across instrument type and venue."
        pill={{ label: "REAL-TIME" }}
        controls={
          <Chips items={analyticsMetrics} active={i} onSelect={setI} ariaLabel="Analytics metric" />
        }
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div className="min-w-0">
          <span className="drk-tnum block font-[family-name:var(--font-display)] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--color-signal)]">
            <Digits value={met.value} />
            {met.unit && (
              <span className="ml-1.5 text-[0.4em] font-medium tracking-[0.08em] text-[var(--color-faint)]">
                {met.unit}
              </span>
            )}
          </span>
          <span className="drk-field-l mt-1.5">{met.metricLabel}</span>
        </div>
        <p className="max-w-[34ch] text-[0.77rem] leading-snug text-[var(--color-muted)]">
          {met.note}
        </p>
      </div>

      <div className="mt-4">
        <LineSeries
          values={series}
          progress={progress}
          height={dense ? 120 : 148}
          axis={["OPEN", "MID", "CLOSE"]}
          label={`Illustrative ${met.label.toLowerCase()} trend through the session`}
        />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Launches({ dense }: { progress: number; dense: boolean }) {
  const [sel, setSel] = useState<string>(launchTimeline[0].id);
  const l = launchTimeline.find((x) => x.id === sel) ?? launchTimeline[0];
  const stages = lifecycle.stages;

  return (
    <>
      <Head
        title="Launches"
        strap="Lifecycle state from first block to market growth."
        pill={{ label: "COMPLETE", tone: "idle" }}
      />

      <Field
        className="mt-4"
        cols={dense ? 2 : 4}
        cells={[
          { v: "2", l: "Launches delivered", tone: "signal" },
          { v: l.result, l: l.resultLabel.toLowerCase() },
          { v: "$40k+", l: "Captured by DRK" },
          { v: "RISK-OFF", l: "Market condition" },
        ]}
      />

      <div className="mt-5">
        <Ledger
          label="Delivered launches"
          selected={sel}
          onSelect={setSel}
          columns={[
            { k: "n", head: "LAUNCH" },
            { k: "w", head: "WINDOW", w: "minmax(0,0.95fr)" },
            { k: "r", head: "RESULT", align: "r", w: "minmax(0,0.55fr)" },
            { k: "s", head: "STATUS", align: "r", w: "minmax(0,0.7fr)" },
          ]}
          rows={launchTimeline.map((r) => ({
            key: r.id,
            cells: [
              <span key="n" className="flex min-w-0 flex-col">
                <Name on={r.id === sel}>{r.name}</Name>
                {/* Rendered exactly as transcribed from the source deck.
                    See VER-01 — not corrected, not annotated. */}
                <span className="drk-label truncate text-[0.52rem]">{r.resultLabel}</span>
              </span>,
              <Sub key="w">{r.window}</Sub>,
              <Num key="r" tone="signal">
                {r.result}
              </Num>,
              <span key="s" className="inline-flex justify-end">
                <Pill label={r.state} tone="idle" />
              </span>,
            ],
          }))}
        />
      </div>

      <div className="mt-5">
        <span className="drk-label">LIFECYCLE PROGRESSION — {l.name}</span>
        <ol className="mt-3 flex items-start">
          {stages.map((s, i) => {
            const reached = i <= l.phase;
            return (
              <li key={s.key} className="relative flex min-w-0 flex-1 flex-col items-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute left-[-50%] top-[3px] h-px w-full"
                    style={{ background: reached ? "var(--color-signal)" : "var(--color-hairline)" }}
                  />
                )}
                <span
                  aria-hidden
                  className="relative z-10 size-[6px]"
                  style={{
                    background: reached ? "var(--color-signal)" : "var(--color-base)",
                    border: `1px solid ${reached ? "var(--color-signal)" : "var(--color-hairline-strong)"}`,
                  }}
                />
                <span
                  className={cn(
                    "mt-2 w-full truncate px-1 text-center text-[0.67rem] leading-tight",
                    reached ? "text-[var(--color-ink-soft)]" : "text-[var(--color-faint)]",
                  )}
                >
                  {s.name}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-4 text-[0.73rem] leading-snug text-[var(--color-fineprint)]">
        Client identities are not disclosed in the source material.
      </p>
    </>
  );
}
