"use client";

import { useRef } from "react";
import Image from "next/image";
import { Scene, SceneStage, SceneShell, SceneHead } from "@/components/deck/Scene";
import { BrandMark, hasBrandMark } from "@/components/ui/BrandMark";
import { Signal, StatusDot } from "@/components/ui/primitives";
import { useSceneNarrative } from "@/hooks/useScene";
import { opacity } from "@/content/drk";
import { cn, range } from "@/lib/utils";

/**
 * SCENE 02 — OPACITY
 *
 * The section has to PERFORM opacity, not assert it. The Liquidity Vault is
 * the mechanism:
 *
 *   value approaches → the vault takes it in → the doors physically close →
 *   the interior goes dark → what comes out cannot be identified
 *
 * and then the whole apparatus inverts: the doors open, the interior lights,
 * and the four unknowns resolve into the four things DRK makes visible —
 * which are the exact four modules the viewer will operate in Scene 04.
 *
 * The doors are built as two shutters over the vault plate rather than as a
 * second render, because the harvested plate is the client's own production
 * asset and must not be redrawn. Closing real geometry over it keeps the object
 * authentic while letting it act.
 */

const IN_Y = [16, 38, 60, 82]; // % down the diagram box
const GATE_X = 38; // the vault mouth, where the shutters live
/* Output chips are left-anchored, so their x must leave room for the widest
   label ("PROGRAMS"). At 390px a chip starting at 88% runs off the viewport. */
const OUT_X_DESKTOP = 86;
const OUT_X_MOBILE = 72;
/**
 * The input token chip. One size per breakpoint, marked or not.
 *
 * The four inputs sit 22% of the diagram's height apart, so on a phone the
 * chips have to be small enough to leave their tickers somewhere to go: at the
 * desktop size the label of one input lands under the next one.
 */
const TOKEN_CHIP = { desktop: "clamp(2.5rem,4.2vw,3.3rem)", mobile: "1.8rem" };

export function Opacity() {
  const ref = useRef<HTMLElement>(null);
  const { p, isDesktop, scrub } = useSceneNarrative(ref);

  const enter = range(p, 0.08, 0.3); // value flows in
  const shut = range(p, 0.3, 0.44); // doors close
  const dark = range(p, 0.4, 0.54); // interior goes dark
  const unknown = range(p, 0.48, 0.66); // outputs cannot be identified
  const problems = range(p, 0.3, 0.66);
  const open = range(p, 0.76, 0.9); // DRK opens it
  const resolved = range(p, 0.84, 0.98); // outputs resolve

  const step = open > 0.25 ? 3 : unknown > 0.3 ? 2 : shut > 0.3 ? 1 : 0;
  const stepLabels = ["VALUE IN", "DOORS CLOSE", "OUTPUTS UNKNOWN", "DRK INVERTS IT"];

  return (
    <Scene
      sceneRef={ref}
      id="opacity"
      index="02"
      title="Legacy market making is built on opacity"
      height="300vh"
    >
      <SceneStage>
        <SceneShell>
          <div className="grid items-center gap-x-[clamp(1.5rem,3.5vw,3.5rem)] gap-y-9 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            {/* ---------------- narrative ---------------- */}
            <div className="drk-scrim">
              {/* h2, not h1: at 768px the h1 scale puts this three-line headline
                  38px over the pinned stage before a word of the list is drawn. */}
              <SceneHead index="02" eyebrow="THE PROBLEM" size="h2" rule={false}>
                {opacity.headline.pre}
                <br className="hidden sm:block" />
                <Signal>{opacity.headline.signal}.</Signal>
              </SceneHead>

              <ul className="mt-[clamp(1rem,3.5vh,2.5rem)] flex flex-col">
                {opacity.problems.map((item, i) => {
                  const on = scrub ? range(problems, i * 0.2, i * 0.2 + 0.34) : 1;
                  return (
                    <li
                      key={item.key}
                      className="border-t border-[var(--color-hairline)] py-[clamp(0.42rem,1.4vh,0.95rem)] first:border-t-0 first:pt-0"
                      /* Scroll-derived: set directly, never via `animate` — a
                         transition here would lag behind the scroll. */
                      style={{ opacity: 0.28 + on * 0.72 }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          aria-hidden
                          className="mt-2 h-px w-5 shrink-0 self-start transition-colors duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                          style={{
                            background:
                              on > 0.5 ? "var(--color-signal)" : "var(--color-hairline-strong)",
                          }}
                        />
                        <div>
                          <p className="text-[clamp(1rem,1.45vw,1.24rem)] font-medium text-[var(--color-ink-soft)]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div
                className="mt-[clamp(0.85rem,3vh,2rem)] border-t border-[var(--color-hairline-signal)] pt-[clamp(0.75rem,2.2vh,1.5rem)]"
                style={{ opacity: scrub ? open : 1 }}
              >
                <p className="text-[clamp(1.2rem,2vw,1.7rem)] font-semibold tracking-[-0.02em] text-[var(--color-signal)]">
                  {opacity.turn}
                </p>
                <p className="mt-2 max-w-[38ch] text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                  {opacity.turnDetail}
                </p>
              </div>
            </div>

            {/* ---------------- the vault ---------------- */}
            <div className="relative">
              <div className="mb-3 flex items-end justify-between gap-4">
                <span className="drk-label">{opacity.inputLabel}</span>
                <span
                  className={cn(
                    "drk-label text-right transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                    open > 0.3 ? "text-[var(--color-signal)]" : "text-[var(--color-faint)]",
                  )}
                >
                  {opacity.outputLabel}
                </span>
              </div>

              <div className="relative w-full" style={{ aspectRatio: "980 / 560" }}>
                <VaultDiagram
                  enter={enter}
                  shut={shut}
                  dark={dark}
                  unknown={unknown}
                  open={open}
                  resolved={resolved}
                  isDesktop={isDesktop}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[var(--color-hairline)] pt-3">
                <p
                  className="text-[0.9rem] transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                  style={{
                    color:
                      unknown > 0.5 && open < 0.4
                        ? "var(--color-ink-soft)"
                        : "var(--color-faint)",
                  }}
                >
                  {opacity.closedCaption}
                </p>

                {/* Non-colour state cue as well as colour: the label names the
                    stage the machine is in. */}
                <div className="flex items-center gap-3">
                  <span aria-hidden className="flex items-center gap-1.5">
                    {stepLabels.map((l, i) => (
                      <span
                        key={l}
                        className="block h-px transition-all duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]"
                        style={{
                          width: i === step ? 26 : 12,
                          background:
                            i <= step ? "var(--color-signal)" : "var(--color-hairline-strong)",
                        }}
                      />
                    ))}
                  </span>
                  <span className="drk-label text-[var(--color-signal)]">
                    {stepLabels[step]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SceneShell>
      </SceneStage>
    </Scene>
  );
}

/* -------------------------------------------------------------------------- */

function VaultDiagram({
  enter,
  shut,
  dark,
  unknown,
  open,
  resolved,
  isDesktop,
}: {
  enter: number;
  shut: number;
  dark: number;
  unknown: number;
  open: number;
  resolved: number;
  isDesktop: boolean;
}) {
  // Doors close, then DRK opens them again. One value drives both, so the
  // apparatus can never be caught in an impossible half-state.
  const closed = Math.max(0, shut - open);
  const OUT_X = isDesktop ? OUT_X_DESKTOP : OUT_X_MOBILE;

  return (
    <>
      {/* ---- the vault object ---- */}
      <div
        className="absolute"
        style={{
          left: "36%",
          width: "30%",
          top: "4%",
          filter: `saturate(${1 - closed * 0.6}) brightness(${1 - closed * 0.3})`,
        }}
      >
        <Image
          src="/brand/objects/liquidity-vault.png"
          alt="The DRK Liquidity Vault, representing a closed legacy market-making system"
          width={620}
          height={668}
          sizes="(min-width: 1024px) 30vw, 60vw"
          className="drk-plate h-auto w-full"
        />
      </div>

      {/* ---- the shutters ---- */}
      {/*
        Two machined doors sliding across the vault's mouth — sized to the
        object's own face, not a slab over the whole diagram, so the vault stays
        legible as the vault while it closes. Closing them is what makes the
        section's argument physical: information stops here.
      */}
      <div
        aria-hidden
        className="absolute overflow-hidden rounded-[6px]"
        style={{ left: "38.5%", width: "25%", top: "15%", height: "52%" }}
      >
        {[0, 1].map((side) => (
          <span
            key={side}
            className="absolute top-0 h-full w-1/2"
            style={{
              [side === 0 ? "left" : "right"]: 0,
              transform: `translateX(${(1 - closed) * (side === 0 ? -104 : 104)}%)`,
              /* Not fully opaque: the vault's own silhouette must still ghost
                 through, so the doors read as closing over the object rather
                 than as a panel replacing it. */
              background: `linear-gradient(${side === 0 ? 90 : 270}deg,
                rgba(9,13,16,0.93) 0%,
                rgba(19,25,30,0.9) 58%,
                rgba(30,39,45,0.88) 100%)`,
              boxShadow: "0 0 44px 10px rgba(0,0,0,0.7)",
            }}
          >
            {/* machined banding — the doors have to read as engineered metal */}
            <span
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 13px)",
              }}
            />
            {/* the lip catching the room light */}
            <span
              className="absolute top-0 h-full w-px"
              style={{
                [side === 0 ? "right" : "left"]: 0,
                background:
                  "linear-gradient(180deg, rgba(214,228,232,0) 0%, rgba(214,228,232,0.3) 46%, rgba(214,228,232,0) 100%)",
              }}
            />
          </span>
        ))}

        {/* the seam, lit only while the doors are shut */}
        <span
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{
            background: "var(--color-signal)",
            opacity: closed * 0.55,
            boxShadow: `0 0 ${closed * 12}px 0 rgba(0,224,96,${closed * 0.45})`,
          }}
        />
      </div>

      {/* ---- flow ---- */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Value enters the vault from four known inputs. While the vault is closed the outputs cannot be identified. DRK opens it and every output resolves."
      >
        {/* inputs */}
        {opacity.inputs.map((tick, i) => {
          const y = IN_Y[i];
          const on = range(enter, i * 0.14, i * 0.14 + 0.42);
          const d = `M 9 ${y} C 20 ${y}, 22 50, ${GATE_X - 1} 50`;
          return (
            <path
              key={tick}
              d={d}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - on}
              opacity={(1 - Math.max(0, shut - open) * 0.75) * (0.3 + on * 0.7)}
            />
          );
        })}

        {/* outputs */}
        {opacity.outputs.map((_, i) => {
          const y = IN_Y[i];
          const isOn = resolved > (i + 0.15) / 4;
          const on = range(unknown, i * 0.14, i * 0.14 + 0.42);
          const d = `M 64 50 C 76 50, 76 ${y}, ${OUT_X - 3} ${y}`;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={isOn ? "var(--color-signal)" : "var(--color-dim)"}
              strokeWidth={isOn ? 1.4 : 1}
              strokeDasharray={isOn ? "none" : "2 5"}
              vectorEffect="non-scaling-stroke"
              opacity={isOn ? 0.9 : 0.18 + on * 0.34}
            />
          );
        })}
      </svg>

      {/* ---- input tokens ---- */}
      {/*
        The four inputs are real assets, so they arrive as themselves: the
        official mark where DRK has supplied one, and the ticker set beneath it
        either way. The client's own token has no mark to supply — it is
        whichever token is launching — so it keeps a neutral glyph rather than
        borrowing somebody else's.
      */}
      {opacity.inputs.map((tick, i) => {
        const on = range(enter, i * 0.14, i * 0.14 + 0.42);
        const lit = on > 0.4;
        const chip = isDesktop ? TOKEN_CHIP.desktop : TOKEN_CHIP.mobile;
        return (
          <span
            key={tick}
            /* Positioned on the chip's centre, not the group's: the flow paths
               are welded to this point and a caption below must not shift it. */
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: "9%", top: `${IN_Y[i]}%` }}
          >
            {hasBrandMark(tick) ? (
              <BrandMark name={tick} size={chip} lit={lit} />
            ) : (
              <span
                className="grid place-items-center rounded-full border transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
                style={{
                  width: chip,
                  height: chip,
                  background: "var(--color-panel-2)",
                  borderColor: lit
                    ? "var(--color-hairline-signal)"
                    : "var(--color-hairline)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-[46%]"
                  aria-hidden
                  fill="none"
                  style={{
                    color: lit ? "var(--color-signal)" : "var(--color-dim)",
                  }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeDasharray="3.2 2.6"
                  />
                  <path d="M12 7.4l3.4 4.6-3.4 4.6-3.4-4.6z" fill="currentColor" />
                </svg>
              </span>
            )}

            <span
              className={cn(
                "drk-label absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-[0.5rem] leading-none transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
                isDesktop ? "mt-1.5" : "mt-[3px]",
              )}
              style={{ color: lit ? "var(--color-ink-soft)" : "var(--color-faint)" }}
            >
              {tick}
            </span>
          </span>
        );
      })}

      {/* ---- outputs ---- */}
      {opacity.outputs.map((_, i) => {
        const isOn = resolved > (i + 0.15) / 4;
        const on = range(unknown, i * 0.14, i * 0.14 + 0.42);
        return (
          <span
            key={i}
            className="absolute flex -translate-y-1/2 flex-col items-start gap-1"
            style={{ left: `${OUT_X}%`, top: `${IN_Y[i]}%` }}
          >
            <span
              className="flex items-center justify-center rounded-[7px] border px-2 transition-colors duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]"
              style={{
                minWidth: "clamp(2.6rem,4.4vw,3.5rem)",
                height: "clamp(1.9rem,3vw,2.35rem)",
                background: "var(--color-panel)",
                borderColor: isOn
                  ? "var(--color-hairline-signal)"
                  : "var(--color-hairline)",
              }}
            >
              {isOn ? (
                <span className="drk-label whitespace-nowrap text-[0.58rem] text-[var(--color-signal)]">
                  {opacity.resolved[i]}
                </span>
              ) : (
                <span
                  className="font-[family-name:var(--font-display)] text-[clamp(0.95rem,1.5vw,1.2rem)] font-semibold leading-none"
                  style={{ color: "var(--color-faint)", opacity: 0.25 + on * 0.75 }}
                >
                  ?
                </span>
              )}
            </span>
          </span>
        );
      })}

      {/* ---- the interior state ---- */}
      {isDesktop && (
        <span
          className="absolute flex -translate-x-1/2 items-center gap-2"
          style={{ left: "51%", top: "96%" }}
        >
          <StatusDot
            state={open > 0.4 ? "active" : "locked"}
            label={open > 0.4 ? "OBSERVABLE" : dark > 0.4 ? "INTERIOR DARK" : "OPEN"}
          />
        </span>
      )}
    </>
  );
}
