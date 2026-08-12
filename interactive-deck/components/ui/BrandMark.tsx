"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * CHAIN, ASSET AND VENUE MARKS
 *
 * The official artwork, supplied by DRK and vendored to `public/brand/tokens/`.
 * Nothing here is approximated, redrawn or traced — an approximated logo is a
 * fabricated logo. A name with no supplied mark resolves to `null` and every
 * caller falls back to type, so the deck never invents one.
 *
 * The marks are shown as the chains/networks and assets the deck already names.
 * They are not presented as partnerships, clients or endorsements (VER-06).
 *
 * Aptos publishes its mark as black-on-transparent; the vendored file is that
 * artwork inverted to white, which is the mark's own dark-ground treatment. No
 * other file is altered.
 */

type Asset = {
  src: string;
  /** The artwork is a full-bleed disc or tile: let it fill the chip edge to edge. */
  bleed?: boolean;
};

const ASSETS = {
  solana: { src: "/brand/tokens/solana.png", bleed: true },
  ethereum: { src: "/brand/tokens/ethereum.png", bleed: true },
  usdc: { src: "/brand/tokens/usdc.png", bleed: true },
  sui: { src: "/brand/tokens/sui.png", bleed: true },
  robinhood: { src: "/brand/tokens/robinhood.png", bleed: true },
  /* Glyph only — no field of its own, so it is inset rather than bled. */
  aptos: { src: "/brand/tokens/aptos.png" },
} as const satisfies Record<string, Asset>;

/**
 * Every spelling the deck uses for a mark, normalised. `EVM` resolves to the
 * Ethereum mark because that is the ecosystem the deck names by that word.
 * Anything absent here — Pools, Perps, Launchpads, Cantor, Multi-chain — has no
 * mark and stays typographic.
 */
const ALIASES: Record<string, keyof typeof ASSETS> = {
  sol: "solana",
  solana: "solana",
  eth: "ethereum",
  ethereum: "ethereum",
  evm: "ethereum",
  usd: "usdc",
  usdc: "usdc",
  apt: "aptos",
  aptos: "aptos",
  sui: "sui",
  rh: "robinhood",
  robinhood: "robinhood",
  "robinhood evm": "robinhood",
  "robinhood chain": "robinhood",
};

/** The mark for a name, or `null` when none has been supplied. */
export function brandAsset(name: string): Asset | null {
  const key = ALIASES[name.trim().toLowerCase()];
  return key ? ASSETS[key] : null;
}

/** True when a name has an official mark. Callers use it to reserve space. */
export function hasBrandMark(name: string): boolean {
  return brandAsset(name) !== null;
}

/**
 * The mark in its chip.
 *
 * Decorative by contract: every caller sets the name in type beside it, so the
 * image carries no alternative text and screen readers are not told the same
 * thing twice.
 */
export function BrandMark({
  name,
  size = "1.55rem",
  lit = true,
  shape = "round",
  pulse = false,
  index = 0,
  className,
}: {
  name: string;
  /** Any CSS length. The chip is always square. */
  size?: string;
  lit?: boolean;
  shape?: "round" | "tile";
  /**
   * Breathe, to say the network is live rather than to decorate.
   *
   * Only ever set on a mark that is LIT — an unlit mark is a network the scene
   * has not reached yet, and a dormant thing must not appear to be running. The
   * movement is deliberately shallow (4.5% over 3.6s): a logo that visibly
   * throbs stops being a logo. See `.drk-mark-pulse`, which is disabled
   * wholesale under `prefers-reduced-motion`.
   */
  pulse?: boolean;
  /** Position in its row. Staggers the breath so a group reads as N nodes. */
  index?: number;
  className?: string;
}) {
  const asset = brandAsset(name);
  if (!asset) return null;

  const breathing = pulse && lit;

  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden border transition-[opacity,border-color] duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
        shape === "round" ? "rounded-full" : "rounded-[6px]",
        lit
          ? "border-[var(--color-hairline-signal)]"
          : "border-[var(--color-hairline)]",
        breathing && "drk-mark-pulse",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: "var(--color-panel-2)",
        /* Unlit marks recede rather than disappear: the row must stay readable
           whichever state the scene is in. */
        opacity: lit ? 1 : 0.55,
        ...(breathing
          ? ({ "--pulse-delay": `${(index % 6) * 0.42}s` } as React.CSSProperties)
          : null),
      }}
    >
      <Image
        src={asset.src}
        alt=""
        width={96}
        height={96}
        className={cn(
          asset.bleed ? "h-full w-full object-cover" : "h-[58%] w-[58%] object-contain",
        )}
      />
    </span>
  );
}
