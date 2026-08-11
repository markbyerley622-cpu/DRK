# DRK — SOURCE AUDIT

**Audit date:** 2026-08-11
**Auditor role:** Senior product engineer / creative technologist
**Status:** Phase 1 complete. Performed **before** any application code was written.

---

## 1. WORKSPACE INVENTORY

Recursive inspection of `C:\Users\rtayl\Desktop\drk` at audit time returned **exactly three files**. No existing
codebase, no `package.json`, no git repository, no fonts, no models, no isolated graphics.

| # | Path | Bytes | Modified | Role |
|---|------|-------|----------|------|
| 1 | `C:\Users\rtayl\Desktop\drk\Pitch deck.pdf` | 2,916,727 | 2026-08-11 13:41 | **Factual source of truth** |
| 2 | `C:\Users\rtayl\Desktop\drk\asset.jpg` | 111,434 | 2026-08-11 13:53 | Secondary 3D icon board (light ground) |
| 3 | `C:\Users\rtayl\Desktop\drk\asset 2.jpg` | 125,267 | 2026-08-11 13:54 | **DRK 3D Brand Asset System board — visual source of truth** |

> **Preservation guarantee:** none of these three files has been modified, renamed, moved or deleted at any
> point in this build. All derived assets are written to new paths. Verified by comparing size/mtime after
> every asset-generation pass.

**Consequence of the inventory:** because the directory contained only the PDF and brand imagery, the web
project was created at `C:\Users\rtayl\Desktop\drk\interactive-deck` per the brief. Nothing is written to the
Desktop outside `drk\`.

### 1.1 PDF technical profile

| Property | Value |
|----------|-------|
| Pages | **15** |
| Page size | 960 × 540 pt (16:9) |
| PDF version | 1.7 |
| Creator / Producer | Microsoft® PowerPoint® LTSC |
| Author metadata | `N p` |
| Creation + mod date | `D:20260810223849-04'00'` → **2026-08-10 22:38 EDT** |
| Encryption | none |
| Embedded fonts | **none** |
| Extractable text layer | **none — every page returned 0 bytes of text** |

**Critical finding — the deck is fully rasterised.** Each of the 15 pages is a single full-bleed
**1672 × 941 JPEG** (plus one repeated 127 × 96 PNG stamp in the top-right corner, and on pages 4, 8, 12 and 13
one or two additional stacked full-page rasters, i.e. superseded versions left in the file). 22 unique embedded
images in total; **zero of them are isolated 3D objects, and none carry an alpha channel.**

Implications, all of which shaped the build:

1. Every word of content in this audit was transcribed by **visually reading rendered pages**, not by text
   extraction. Pages were rendered with PyMuPDF at 110 dpi (1467 × 825) and inspected individually.
2. **No production 3D assets exist** in the supplied material. The brief's fallback therefore applies:
   *"If they do not exist, recreate the required visual assets/components cleanly while preserving the visual
   language."* See §6 and `DRK_ASSET_MANIFEST.md` for the strategy actually used.
3. Typography cannot be identified from font records. It must be matched by eye. See §5.3.

---

## 2. COMPLETE NARRATIVE TRANSCRIPTION (15 PAGES)

Content below is transcribed **verbatim**. Green highlighting in the source is marked `[green]`.
Nothing has been rewritten, corrected, modernised or extended.

### Page 01 — Cover
- Wordmark: **DRK.** / `DARK MARKET MAKERS`
- Eyebrow `[green]`: **Launch & Institutional Trading**
- Body: *"Transparent market making for token launches, DEXs, perps, and onchain assets."*
- Footer right: `LIQUIDITY BENEATH THE SURFACE.`
- Visual: Liquidity Wave on concentric illuminated rings, volumetric smoke, latency-ring arcs, particle field.

### Page 02 — Positioning
- H1: **"We turn `[green]`token launches`[/green]` into visible trading programs`[green].[/green]`"**
- Sub: *"One runtime for wallets, liquidity, execution, and reporting."*
- Visual: a luminous route running left→right through five staged objects, labelled in order:
  `LAUNCH ▶` (Execution Beacon) → `WALLETS` (wallet) → `LIQUIDITY` (Liquidity Wave) →
  `EXECUTION` (Execution Engine) → `REPORTING` (Network Nodes).

### Page 03 — The problem
- H1: **"Legacy market making is built on `[green]`opacity.`[/green]`"**
- Bullets (each with a short green rule):
  1. Token loans.
  2. Upfront retainers.
  3. Pool-by-pool charges.
  4. Slow adaptation.
- Visual: Liquidity Vault, doors shut. **Four identified inputs enter from the left** (Ethereum mark, `$`,
  Solana mark, a hexagonal token mark). **Four `?` discs exit right** — outputs are unknown.

### Page 04 — One engine / two businesses *(page bears the number `06` — see TODO-04)*
- H1 line 1: **"One proprietary engine."** line 2 `[green]`: **"Two scalable businesses."**
- Sub: *"We run the book like an MM — and scale it like software."*
- Centre object: engine core inside a latency ring, captioned `[green]` `ONE ENGINE.` / `TWO BUSINESSES.`

**01 `[green]`MANAGED TRADING`[/green]` — `PERFORMANCE-LINKED REVENUE`**
| Item | Copy |
|------|------|
| STRATEGY | Proprietary traders define and operate every program. |
| LIQUIDITY | DRK deploys adaptive capital across launches and markets. |
| EXECUTION | Revenue scales with measured client performance. |

**02 `[green]`LICENSED RUNTIME`[/green]` — `RECURRING SOFTWARE REVENUE`**
| Item | Copy |
|------|------|
| CONTROL | Client-owned wallets, permissions, and real-time visibility. |
| PROGRAMS | Reusable strategy frameworks deploy across venues. |
| INFRASTRUCTURE | Secure multi-chain data, routing, and execution rails. |

- Footer conclusion: **"Performance revenue today. `[green]`Recurring revenue at scale.`[/green]`"**
- Footer chrome: `DRK / CONFIDENTIAL` (left) · `LIQUIDITY BENEATH THE SURFACE.` (right)

### Page 05 — Visibility / product proof
- H1: **"Clients see what black-box MMs hide."**
- Sub: *"`[green]`Live visibility`[/green]` across assets, programs, execution, and P/L."*
- Four interface cards:

| Module | Primary | Secondary |
|--------|---------|-----------|
| **Wallets** | `TOTAL VALUE` **$128.6M** | bar series |
| **Inventory** | `TOTAL INVENTORY VALUE` **$94.3M** | donut — Spot 58%, Perps 26%, Options 11%, Other 5% |
| **Execution** | `TODAY'S TRADES` **2,341** | line series; `AVG. SLIPPAGE` 1.2 bps · `FILL RATE` 99.6% · `LATENCY` 18ms |
| **P/L** | `DAILY P/L` **$3.72M** | line series; `MTD P/L` $28.4M · `YTD P/L` $196.7M · `SHARPE RATIO` 2.36 |

- Footer left: `LIQUIDITY BENEATH THE SURFACE.`
- **The deck nowhere states whether these are real client aggregates or illustrative.** See TODO-05.

### Page 06 — Proof
- H1: **"2 launches across late July / early August 2026`[green].[/green]`"**
- Sub: *"Delivered in a `[green]`weak, risk-off market`[/green]`."*
- Metric pair: **$150k** `CLIENT PROFIT` │ **$70k** `CLIENT PROFIT`
- Boxed metric with coin-stack icon: **$40k+** `CAPTURED BY DRK.`
- Visual: descending candlestick field with a grey down-arrow — an explicitly falling market.
- **No client names appear anywhere on this page.** (Correct, and preserved.)

### Page 07 — Own the stack
- H1 line 1: **"Other firms rent tools."** lines 2–3 `[green]`: **"We own the stack."**
- Sub: *"Our traders operate our software. We adapt quickly to new chains, pools, launchpads, and venues."*
- **External environment (left rail, 8 entries, top→bottom):** `LAUNCHPADS`, `POOLS`, `EXECUTION`, `PERPS`,
  `ROBINHOOD CHAIN`, `SOLANA`, `EVM`, `REPORTING`
- **DRK core (centre rack, DRK.-branded, 4 modules):**

| Module | Copy |
|--------|------|
| LIQUIDITY ENGINE | Deep liquidity. Always on. |
| ROUTING LAYER | Smart routing. Best execution. |
| RISK & CONTROLS | Built-in risk. Real-time guardrails. |
| DATA & INSIGHTS | Real-time data. Actionable edge. |

- **Output (right):** shield → `[green]` `TRUST.` / `PERFORMANCE.` / `RESULTS.`

### Page 08 — Market
- H1: **"The market for MM infrastructure is growing `[green]`exponentially.`[/green]`"**
- Sub: *"Institutional adoption and onchain activity are accelerating across every dimension."*
- Callout: *"The structural shift to onchain markets `[green]`is driving demand for better market making.`[/green]`"*

| Label | Value | Description | Source (as printed) |
|-------|-------|-------------|---------------------|
| DEX VOLUME | **$2.4T+** | DEX spot volume in April 2025 | The Block |
| DEX > CEX | **1.3x** | DEX spot volume surpassed CEX in April | The Block |
| PERPS VOLUME | **+100%** | Perpetuals DEX volume YoY (April 2025) | The Block |
| NEW CHAINS | **90+** | Active L1 & L2 chains in 2025 | L2BEAT |
| TOTAL VALUE LOCKED | **$182B+** | TVL across DeFi protocols | DefiLlama |
| INSTITUTIONAL FLOW | **+300%** | Increase in onchain institutional activity YoY | Galaxy Digital |

- Footer strip: `ONE ENGINE. TWO MODELS. ENDLESS MARKETS.` · `BUILT FOR PERFORMANCE. DESIGNED FOR SCALE.` ·
  `LIQUIDITY BENEATH THE SURFACE.`

### Page 09 — Integration speed
- H1 line 1: **"Traditional MMs move slowly."** lines 2–3 `[green]`: **"We integrate in days, not years."**
- Sub: *"We adapt rapidly to new chains, venues, and launch systems."*
- Pipeline: inbound routing arrows → **`ROUTING LAYER`** *(Real-time intelligence across markets)* →
  **`DRK EXECUTION ENGINE`** *(Unified liquidity, risk, and execution)* → five targets.
- Targets listed with third-party marks: **Solana**, **Robinhood EVM**, **Aptos**, **Sui**, **Cantor**.
- **The deck does not describe these as partnerships, clients or signed integrations.** See TODO-06.

### Page 10 — Launch lifecycle
- H1: **"Launches are where speed, trust, and liquidity collide`[green].[/green]`"**
- Sub: *"We support the `[green]`full lifecycle`[/green]` from first block to market growth."*
- Horizontal luminous rail, five nodes, each carrying one DRK object:

| Stage | Object | Copy |
|-------|--------|------|
| Pre-launch | Security Lock | Secure the foundation. / Align incentives. |
| First block | Execution Beacon | Execute with precision. / Deliver with confidence. |
| Migration | Liquidity Wave | Move seamlessly. / Maintain integrity. |
| Liquidity | Market Chart | Activate liquidity. / Enable depth. |
| Growth | Depth Sculpture | Scale markets. / Sustain momentum. |

### Page 11 — Platform demo ⚠ PLACEHOLDER
- H1: **"Platform demo`[green].[/green]`"**
- Sub: *"Insert live product views across the DRK control layer."*
- Six empty HUD tiles: `1. Wallets`, `2. Programs`, `3. Execution`, `4. P/L`, `5. Analytics`, `6. Launches`
- **This is an unfinished slide in the source deck. The brief requires it be completely replaced. It is the
  single largest product-design opportunity in the project.** It became Scene 10 — the centrepiece.

### Page 12 — Revenue
- H1 line 1: **"One engine."** lines 2–4: **"`[green]`Multiple`[/green]` revenue streams."**
- Sub: *"We provide liquidity up front and `[green]`get paid when programs perform.`[/green]`"*
- Central Execution Engine radiating five green paths to five numbered streams:

| # | Stream | Qualifier |
|---|--------|-----------|
| 01 | Upfront liquidity | — |
| 02 | % of every launch | — |
| 03 | Daily service fee | — |
| 04 | 15–35% of off-ramp\* | \*based on liquidity provided |
| 05 | $10k / month software license | future MM runtime |

### Page 13 — Compounding
- H1: **"Investment liquidity `[green]`compounds.`[/green]`"**
- Sub: *"Capital is actively deployed across markets, 24/7. We `[green]`earn`[/green]` while we `[green]`grow`[/green]`."*

| Claim | Value | Detail | Source (as printed) |
|-------|-------|--------|---------------------|
| DEX trading just surpassed CEX. | **52%** | of total spot volume is now on DEXs. | The Block – May 2024 |
| Perps volume is accelerating. | **+100%** | YoY perps volume growth. | Laevitas – May 2024 |
| New chains are pulling more liquidity. | **+$23B** | TVL added across new L1s/L2s in 12 months. | DefiLlama – May 2024 |

- Bottom bar: *"All liquidity is designed to `[green]`earn`[/green]` while remaining `[green]`sustainable`[/green]`."*

### Page 14 — Raise
- H1: **"We are raising `[green]`$1M`[/green]` for `[green]`10%.`[/green]`"**
- Sub: *"Scale `[green]`liquidity`[/green]`, `[green]`performance`[/green]`, and `[green]`launch capacity`[/green]`."*
- Centre ring: `USE OF FUNDS` **$1M**
- Allocations: `01 Trading liquidity` · `02 Low-latency infra` · `03 Integrations` ·
  `04 Operator capacity` · `05 Reporting + dashboarding`
- **No percentage split is given for the five allocations anywhere in the deck.** See TODO-09.
- Footer: *"Designed to `[green]`scale launches`[/green]` and `[green]`sustain growth`[/green]` across new markets."*

### Page 15 — Close
- H1: **"The next market maker is not a black box."**
- Sub: *"It is a transparent operating system with traders `[green]`behind`[/green]` it."*
- Footer: `LIQUIDITY BENEATH THE SURFACE.`
- Visual: Execution Beacon + Liquidity Wave over the luminous serpentine route — a direct callback to page 01.

---

## 3. CONSOLIDATED FACT REGISTER

Every number, claim and named entity in the deck. **This register is the contract.** The build reproduces
these values and invents nothing beyond them.

### 3.1 Company / positioning
- Name **DRK.**, descriptor **DARK MARKET MAKERS**, category **Launch & Institutional Trading**.
- Signature line: **LIQUIDITY BENEATH THE SURFACE.**
- Confidentiality marking present on page 4: `DRK / CONFIDENTIAL`.
- One-liner: *transparent market making for token launches, DEXs, perps, and onchain assets.*

### 3.2 Business model — two lines, one engine
- **Managed Trading** → performance-linked revenue (today).
- **Licensed Runtime** → recurring software revenue (at scale).
- Both run on the same proprietary engine.

### 3.3 Revenue streams (5)
Upfront liquidity · % of every launch · Daily service fee · 15–35% of off-ramp (based on liquidity provided) ·
$10k/month software license (future MM runtime).

### 3.4 Proof (only performance evidence in the deck)
- 2 launches, late July / early August 2026, in a weak risk-off market.
- $150k client profit · $70k client profit · $40k+ captured by DRK.
- No client names, no venues, no audit reference, no methodology.

### 3.5 Illustrative interface values (page 5)
$128.6M wallets · $94.3M inventory (Spot 58 / Perps 26 / Options 11 / Other 5) · 2,341 trades ·
1.2 bps slippage · 99.6% fill rate · 18 ms latency · $3.72M daily · $28.4M MTD · $196.7M YTD · 2.36 Sharpe.
**Treated throughout the build as illustrative product visualisation.** See TODO-05.

### 3.6 Market data
Page 8 (2025-dated) and page 13 (May-2024-dated) — reproduced exactly as tabulated in §2, sources retained
and rendered legibly. See TODO-02 / TODO-03.

### 3.7 Raise
**$1M for 10%.** Five uses of funds, unweighted.

### 3.8 Named third-party entities appearing in the deck
Solana · Robinhood Chain / Robinhood EVM · EVM (Ethereum) · Aptos · Sui · Cantor ·
The Block · L2BEAT · DefiLlama · Galaxy Digital · Laevitas.
The first six appear as chains/venues; the last five appear solely as **data sources**.

---

## 4. CONTENT VERIFICATION TODOs

**These are flagged, not fixed.** Every supplied value is preserved verbatim in `content/drk.ts`; each item
below is additionally encoded in that file as a machine-readable `TODO_CONTENT_VERIFY` entry so it cannot be
lost between now and production release.

> **TODO_CONTENT_VERIFY-01 — the `$70k` label (page 6). Explicitly requested by the brief.**
> The proof slide reads `$150k CLIENT PROFIT` │ `$70k CLIENT PROFIT` │ `$40k+ CAPTURED BY DRK`. The second
> metric repeats the label "CLIENT PROFIT" verbatim. This may be correct (two launches, two client profits) or
> the second label may be wrong. **No guess has been made.** Both values and both labels are rendered exactly
> as supplied. **Confirm label/context for the $70k metric before production release.**

> **TODO_CONTENT_VERIFY-02 — mixed market-data vintages.**
> Page 8 cites April 2025 / 2025 figures. Page 13 cites May 2024 figures. The deck itself was authored
> 2026-08-10. Market data is therefore between ~15 and ~27 months old relative to the deck date, and the two
> market sections disagree in vintage by roughly a year. **Nothing has been silently updated or replaced.**
> All dates and sources render legibly on screen. Confirm whether to refresh, re-date, or retain.

> **TODO_CONTENT_VERIFY-03 — duplicate/conflicting market claims across pages 8 and 13.**
> "DEX surpassed CEX" is asserted twice with different metrics and vintages (**1.3x**, The Block, April 2025 —
> vs **52% of total spot volume**, The Block, May 2024). "Perps +100% YoY" is asserted twice with different
> sources and vintages (The Block, April 2025 — vs Laevitas, May 2024). Both pairs are preserved as-is in
> their respective scenes. Confirm which is canonical.

> **TODO_CONTENT_VERIFY-04 — slide numbering.**
> The "One proprietary engine" slide (PDF page 4) carries a printed page number **`06`** in its top-right
> corner. No other slide is numbered. The PDF contains 15 pages. Confirm no slides are missing from the
> supplied export.

> **TODO_CONTENT_VERIFY-05 — status of the page-5 interface metrics.**
> The deck does not state whether $128.6M / $94.3M / $196.7M YTD / 2.36 Sharpe etc. are real client aggregates,
> a composite, or illustrative UI values. Per the brief they are **not** presented as independently verified
> live customer figures: every surface that renders them carries a visible `ILLUSTRATIVE PRODUCT
> VISUALISATION` label. Confirm provenance; if they are real and attestable, the label can be removed.

> **TODO_CONTENT_VERIFY-06 — third-party marks and partnership implication.**
> Pages 7 and 9 display Solana, Robinhood, Aptos, Sui, Cantor and Ethereum/EVM marks. The deck's own copy says
> only that DRK *"adapt[s] quickly to new chains, pools, launchpads, and venues"* — i.e. **compatibility**, not
> partnership. To avoid implying relationships that the source does not establish, the build (a) renders these
> as **neutral typographic entries, not reproduced third-party logos**, and (b) labels the group explicitly as
> integration targets / compatibility. Confirm the intended relationship and confirm trademark usage rights
> before any logo is reinstated.

> **TODO_CONTENT_VERIFY-07 — proof-window dates.**
> "late July / early August 2026" sits within days of the deck's authoring date (2026-08-10), implying the
> second launch had only just concluded. Confirm the window and whether results are final or provisional.

> **TODO_CONTENT_VERIFY-08 — off-ramp footnote.**
> Stream 04 reads `15–35% of off-ramp*` with the footnote `based on liquidity provided`. Confirm the footnote
> is complete and that no further qualification (tiering, caps, term) is missing.

> **TODO_CONTENT_VERIFY-09 — raise arithmetic and allocation weights.**
> $1M for 10% implies a $10M post-money valuation. **The deck never states a valuation, so the build never
> states or derives one.** The five uses of funds are also unweighted in the source; the build therefore
> presents them as **unweighted allocations** and does not invent percentages. Confirm whether a valuation and
> a split should be shown.

> **TODO_CONTENT_VERIFY-10 — client anonymity.**
> The proof slide names no clients. The build preserves this, using `LAUNCH 01` / `LAUNCH 02`. Confirm whether
> named case studies will be permitted later.

---

## 5. BRAND / VISUAL AUDIT

### 5.1 `asset 2.jpg` — DRK 3D BRAND ASSET SYSTEM (1280 × 720) — primary visual source of truth

Titled **"3D BRAND ASSET SYSTEM — LAUNCH-NATIVE `[green]`LIQUIDITY`[/green]` INFRASTRUCTURE"**, signed
`LIQUIDITY BENEATH / THE SURFACE.` It defines a numbered vocabulary of **12 objects**:

| # | Object | Reading |
|---|--------|---------|
| 01 | **Latency Ring** | machined chrome torus, inner green arc segments — speed / measurement |
| 02 | **Security Lock** | smoked-glass padlock, green edge emission — custody, permissions |
| 03 | **Liquidity Vault** | black safe, `DRK.` badge, chrome dial — the closed/legacy system |
| 04 | **Execution Beacon** | matte cone on a plinth, vertical green filament, emitted rings — activation |
| 05 | **Market Chart** | glass candlesticks + rising arrow — performance, proof |
| 06 | **Depth Sculpture** | stacked concentric glass discs — order-book depth, scale |
| 07 | **Routing Path** | three ribboned chrome arrows with green node beads — routing |
| 08 | **Security Shield** | graphite shield, green check — risk & controls, trust |
| 09 | **Liquidity Wave** | breaking glass wave, green refraction, droplets — liquidity |
| 10 | **Network Nodes** | chrome ball-and-strut lattice, green core — data, reporting, integrations |
| 11 | **Execution Engine** | black turbine, chrome impeller, green core, machined base — the engine |
| 12 | **Frog Mascot** | glossy green frog — *community / fun element* (explicitly scoped as such) |

**Material language (printed on the board):** `SMOKED GLASS` · `MATTE GRAPHITE` · `BRUSHED CHROME` ·
`CONTROLLED GLOW` · `PRECISION CRAFTSMANSHIP`.

**Colour system (sampled directly from the board's swatches):**

| Role | Hex |
|------|-----|
| Signature green 1 (hero) | `#68E66B` |
| Signature green 2 | `#2EAD52` |
| Signature green 3 | `#237C50` |
| Signature green 4 | `#17372C` |
| Signature green 5 | `#0C3024` |
| Hero-green callout swatch | `#68E269` |
| Dark neutrals | `#0D0F0E` · `#1D2122` · `#393939` · `#4E4E4E` · `#7B7B7B` · `#DFDFDF` |

### 5.2 `asset.jpg` — secondary 3D icon board (1280 × 960)

Twelve icons on a **light warm-grey ground**, same materials and same restrained green: shell-and-pearl,
list/ledger card, iridescent spiral, candlestick panel, molecule, shield-safe, d20 die, turbine fan, filament
bulb, frog, speaker, snow-globe chart. It **corroborates** the material system (graphite + chrome + smoked
glass + a single green signal) and shows it survives on a light ground. It introduces no new named objects.
Because the DRK experience is dark-ground, this board informs *material* decisions only; nothing is lifted
from it.

### 5.3 Deck colour + type, sampled from the rendered pages

**Green.** The deck's signal green is measurably **not** the brand board's green — a real, documented
inconsistency:

| Source | Representative hex | Hue |
|--------|-------------------|-----|
| Brand board hero | `#68E66B` | ≈ **121°** (leaf / mint) |
| Deck logo dot & glow cores | `#00FC6B` | ≈ **145°** (spring / emerald) |
| Deck headline & metric green | `#00C551` – `#00EF62` | ≈ **144–146°** |

Across all 15 pages the deck's saturated green is consistently hue **144–146°, saturation 1.00**. Resolution
adopted: **the deck's ~145° green is the primary system green** (it is the dominant, load-bearing usage), and
the board's ~121° green is retained as the *object-emission* tint so the 3D objects still read correctly.
Logged as a brand-system note in §7.

**Ground.** Near-pure black. Modal page pixels: `#000000` on pages 1/11/14/15, `#060A0D` p4, `#05090C` p5,
`#010707` p8. Card interiors sample `#0A0F12` and `#020808`; card borders sit around `#151A16`.
**Black levels are genuinely black — there are no washed grey backgrounds anywhere in the deck.**

**Type.** Headline white samples `#FAFAFA`; secondary body grey sits in the `#87` – `#B7` neutral band
(≈ `#A1A1A1`–`#B2B2B2`). No fonts are embedded, so the family cannot be read from the file. By eye the
headline face is a **tight, heavy neo-grotesk with a double-storey `a` and single-storey `g`**, and the
technical labels are the same family set in **uppercase with wide tracking**. The build matches this energy
rather than claiming an identification — see `DRK_INTERACTIVE_DECK_SPEC.md` §Typography.

### 5.4 Object → scene usage in the source deck

This is the evidence that the objects are already recurring characters, and it dictates the continuity rules:

| Object | Appears on pages |
|--------|------------------|
| Liquidity Wave | 01, 02, 04, 07, 10, 15 |
| Execution Beacon | 02, 04, 09, 10, 15 |
| Execution Engine | 02, 04, 07, 09, 12 |
| Network Nodes | 02, 04, 07, 09 |
| Market Chart | 06, 07, 10, 13 |
| Security Lock | 04, 10 |
| Security Shield | 04, 07 |
| Routing Path | 04, 07, 09 |
| Liquidity Vault | 03 |
| Depth Sculpture | 10 |
| Latency Ring | 01, 04, 14 (as the use-of-funds ring) |
| Frog Mascot | *(brand board only — never used in the deck)* |

---

## 6. ASSET REALITY AND THE CHOSEN STRATEGY

**Established fact:** the supplied material contains **no isolated 3D assets** — only 15 flattened page JPEGs
and two contact-sheet boards. There is no glTF, no PNG with alpha, no layered source.

The brief's instruction is explicit: *do not repeatedly crop the supplied brand-board images*; use isolated
production assets if they exist; otherwise **recreate cleanly while preserving the visual language**.

Strategy adopted, in priority order:

1. **SVG / CSS / DOM is the primary information layer.** Every route, architecture diagram, chart, lifecycle
   rail, revenue fan, compounding loop, raise system and the entire product control layer is **built**, as
   live vector and DOM — not pictured. This is where the "recreate cleanly" instruction lands hardest and it
   is the bulk of the work.
2. **The 12 named objects are re-derived from the deck's own full-page renders**, where each object already
   sits on a genuinely black ground, using a luminance-derived alpha matte. This preserves the exact
   production render — correct geometry, correct chrome, correct emission — instead of substituting a
   fabricated lookalike, and it deliberately avoids re-cropping the light-ground brand boards. Full
   provenance, per object, in `DRK_ASSET_MANIFEST.md`.
3. **No third-party logo is reproduced.** Per TODO-06, chains and venues are typographic.
4. **No stock photography, no generic crypto/city imagery, no invented product screenshots.** The control
   layer is a real, built interface driven by the content manifest, labelled illustrative.
5. **WebGL is not used.** Nothing in this deck requires a real-time 3D renderer to be understood; the object
   language is physically-rendered stills plus vector systems, and an SVG/DOM information layer is faster,
   sharper, accessible and legible at every breakpoint. Using Three.js here would satisfy §31's prohibition on
   "overuse Three.js" in the worst way — cost without comprehension.

---

## 7. FINDINGS SUMMARY

**Strengths of the source that must survive the rebuild**
- A genuinely distinctive, disciplined art direction: black ground, machined objects, one green signal.
- A coherent object vocabulary already formalised and numbered by the client.
- Strong, plain, non-filler copy. Short declarative headlines. No "revolutionising finance" language anywhere.
- A clear, honest commercial story: two businesses, one engine, five revenue streams, a modest raise.
- Proof presented without exaggeration, and explicitly framed as delivered into a *weak* market.

**Weaknesses of the source that the rebuild addresses**
- It is a **static rasterised PowerPoint** — no text layer, so it is unsearchable, unselectable, inaccessible
  to screen readers, and cannot reflow to any screen.
- **Page 11 is an unfinished placeholder** — the product itself, the most important asset in the story, is
  literally not shown.
- Architecture (p7), integration (p9), lifecycle (p10), revenue (p12) and the raise (p14) are all
  **simultaneous static diagrams**: everything is revealed at once, so nothing is explained.
- Market growth (p8) is **six identical stat cards** with no logic connecting them.
- Compounding (p13) asserts that liquidity compounds but **never shows the loop**.
- Object continuity is present but accidental — the same objects recur without the deck ever making the
  connection legible.

**Issues logged, not silently corrected:** ten `TODO_CONTENT_VERIFY` items (§4), including the specific
`$70k` label the brief called out and the mixed market-data vintages.

**Brand-system note (non-blocking):** the brand board's green (≈121°) and the deck's green (≈145°) do not
match. The deck's green is adopted as primary because it is the dominant load-bearing usage; the board's
green is retained for object emission. Worth reconciling in the brand system at some point — flagged for
awareness, not treated as a content error.

---

## 8. METHOD

- Recursive directory enumeration (PowerShell) — 3 files, no code, no git.
- PDF structure read with PyMuPDF 1.27.2: page count, page geometry, metadata, per-page image inventory,
  embedded-image extraction (22 unique), font table (empty), text extraction (empty on all 15 pages).
- All 15 pages rendered to PNG at 110 dpi and **inspected individually at full size**. All copy in §2 was
  transcribed by reading those renders.
- Both brand boards inspected at full resolution.
- Colour sampled programmatically (Pillow): swatch-crop dominant colour on the brand board; per-page HSV-gated
  dominant-green extraction and neutral-band extraction across all 15 deck pages.
- Experiential benchmark `virtualsxpepay-product.vercel.app` reviewed for **interaction model and presentation
  quality only** — section sequencing, pinned scenes with internal step progress, in-page product mockups,
  progressive disclosure, layered narrative, compounding-loop section, thin top progress rail. Nothing was
  copied: not branding, layout, components, colour, illustration or animation. Findings inform
  `DRK_INTERACTIVE_DECK_SPEC.md` §Interaction model.
- Originals verified unmodified after every generation pass.
