# DRK — CONTENT VERIFICATION REGISTER

Ten items flagged during the source audit of `Pitch deck.pdf`.

**Every value is preserved exactly as supplied. Nothing has been corrected,
refreshed, re-dated or guessed.** These are open questions for the client, not
defects in the build.

This file is the permanent record. The register is deliberately **not** part of
the investor-facing experience — it was removed from the production page during
the premium refinement pass. During development only, it also renders at
`/internal/verification`, a route that returns 404 in a production build.

Machine-readable source of truth: `contentVerifyTodos` in `content/drk.ts`.
Both must be kept in step.

---

## VER-01 — Scene 05 Proof (source page 6)

**Issue.** The proof slide reads `$150k CLIENT PROFIT` and `$70k CLIENT PROFIT`.
The second metric repeats the label verbatim. This may be correct, or the second
label may be wrong.

**Action.** Confirm label/context for the `$70k` metric before production
release. Both values and labels are rendered exactly as supplied; no guess has
been made. The `$70k` row carries `labelFlag: "VER-01"` in the manifest.

## VER-02 — Scene 07 Market (p8) and Scene 12 Compound (p13)

**Issue.** Mixed market-data vintages: page 8 cites April 2025 / 2025 figures,
page 13 cites May 2024 figures, while the deck itself was authored 2026-08-10.

**Action.** Confirm whether to refresh, re-date or retain. Nothing has been
silently updated. All dates and sources render legibly at readable size in the
experience.

## VER-03 — Scene 07 / Scene 12

**Issue.** Duplicate claims with different metrics, sources and vintages.
"DEX surpassed CEX" appears as `1.3x` (The Block, Apr 2025) and as `52%` of spot
volume (The Block, May 2024). "Perps +100% YoY" appears from The Block (Apr 2025)
and from Laevitas (May 2024).

**Action.** Confirm which figure is canonical for each claim.

## VER-04 — Source page 4 (Scene 03 Engine)

**Issue.** The "One proprietary engine" slide carries a printed page number `06`
while the supplied PDF contains 15 pages and no other slide is numbered.

**Action.** Confirm no slides are missing from the supplied export.

## VER-05 — Scene 04 Visibility, Scene 10 Control Layer (source page 5)

**Issue.** The deck does not state whether `$128.6M` / `$94.3M` / `$196.7M` YTD /
`2.36` Sharpe and related interface values are real client aggregates or
illustrative UI values.

**Action.** Every surface rendering them is labelled
`ILLUSTRATIVE PRODUCT VISUALISATION` and carries a provenance line naming the
source capability it is built from. Confirm provenance; if attestable, the label
can be removed.

## VER-06 — Scene 06 Stack, Scene 08 Integration (source pages 7, 9)

**Issue.** Pages 7 and 9 display Solana, Robinhood, Aptos, Sui, Cantor and
Ethereum/EVM marks. The deck's copy establishes compatibility, not partnership.

**Action.** Rendered typographically — no third-party logo is reproduced — and
labelled as chains/venues, not partners, with an explicit on-screen disclaimer.
Confirm the intended relationship and trademark usage rights before any logo is
reinstated.

## VER-07 — Scene 05 Proof

**Issue.** "late July / early August 2026" sits within days of the deck authoring
date (2026-08-10), implying the second launch had only just concluded.

**Action.** Confirm the window and whether results are final or provisional.

## VER-08 — Scene 11 Revenue (source page 12)

**Issue.** Stream 04 reads `15–35% of off-ramp*` with the footnote "based on
liquidity provided".

**Action.** Confirm the footnote is complete and that no tiering, cap or term is
missing.

## VER-09 — Scene 13 Raise (source page 14)

**Issue.** The round was raised from `$1M` to `$1.5M` on 2026-08-14 at the
client's instruction. The equity figure was left at the source deck's `10%`,
because no instruction was given on it — so the implied post-money moved from
`$10M` to `$15M`. The deck states neither figure. The five uses of funds are
also unweighted in the source; the 80 / 20 split shown is the client's own
supplied slide, with its amounts rescaled to `$1.2M` / `$300K`.

**Action.** No valuation is stated or derived. **Confirm the `10%` equity figure
is still correct at `$1.5M`** — the terms row is the only place it appears.

## VER-10 — Scene 05 Proof

**Issue.** The proof slide names no clients.

**Action.** Anonymity preserved using `LAUNCH 01` / `LAUNCH 02`. Confirm whether
named case studies will be permitted later.

## VER-11 — Brand green differs across the three supplied sources

**Issue.** DRK's signal green is not consistent between the materials supplied:

| Source | Measured | Hue |
|---|---|---|
| `Pitch deck.pdf` | `#00e060` | ~145° spring green |
| `asset 2.jpg` (object emission) | — | ~121° |
| `demo.mp4` (the live product) | `#cbef95`, `#b6cf95` | ~85° lime |

The live application's accent is materially different from the pitch deck's —
a light yellow-green rather than a saturated spring green.

**Action.** The experience uses the **pitch deck's** green, because the deck is
the factual source of truth for this artefact. Nothing has been changed to match
the product. Confirm which green is canonical for DRK; if it is the product's,
the single token `--color-signal` in `app/globals.css` carries the change and
every surface follows.

The **ground** was aligned to the product in the art-direction pass (the deck's
near-black had a blue bias; DRK's product ground is neutral/green-tinted). That
is a neutral-value correction, not a brand-colour decision, and is recorded in
`ART_DIRECTION_AUDIT.md` §0.

## VER-12 — Positioning line changed on client instruction

**Issue.** The source deck's lockup reads `DRK. / DARK MARKET MAKERS`, and that
descriptor was transcribed verbatim into the experience. The client has since
instructed that DRK should not describe itself as a market maker, and that the
positioning line is **"DRK is the operating system for liquidity."**

**Action.** Two fields changed, both on instruction:

| Field | Source deck | Now |
|---|---|---|
| `brand.descriptor` | `DARK MARKET MAKERS` | `THE OPERATING SYSTEM FOR LIQUIDITY` |
| `brand.oneLiner` | "Transparent **market making** for token launches, DEXs, perps, and onchain assets." | "Transparent **liquidity infrastructure** for token launches, DEXs, perps, and onchain assets." |

The one-liner sits directly beneath the lockup on the opening screen, so leaving
it as "transparent market making" would have contradicted the new positioning in
the first thing an investor reads. Every noun of the source is preserved —
transparency, token launches, DEXs, perps, onchain assets — and only the
self-description as a market maker is removed. The document title, meta
description and page heading follow the descriptor.

These are the **only** places in the manifest that knowingly depart from the
source deck, and they do so on instruction rather than by inference.

**Not changed, and worth a decision:** the deck still uses "market making" as a
*category* noun in several places where it is describing the industry rather
than naming DRK —

| Where | Line |
|---|---|
| Scene 02 | "Legacy **market making** is built on opacity." |
| Scene 04 | "Clients see what black-box **MMs** hide." |
| Scene 07 | "The market for **MM infrastructure** is growing exponentially." |
| Scene 14 | "The next **market maker** is not a black box." |
| One-liner | "Transparent **market making** for token launches, DEXs, perps…" |

These are the source deck's own words and they carry the argument: the deck
positions DRK *against* legacy market making. Scene 14 is the closest call — it
does place DRK in the category before redefining it — but it is also the
closing thesis and the strongest line in the deck. **Confirm whether the new
positioning should be pushed through these as well.** Nothing has been changed
on assumption.

---

## Release gate

Do not publish externally until VER-01, VER-02, VER-03, VER-05 and VER-06 are
resolved. The remainder are advisory.
