# DRK — ASSET MANIFEST

**Companion to** `DRK_SOURCE_AUDIT.md`. Records what was supplied, what was derived, how it was derived,
and where each asset is used.

---

## 1. SUPPLIED ORIGINALS — READ ONLY

| Path | Bytes | Role |
|------|-------|------|
| `C:\Users\rtayl\Desktop\drk\Pitch deck.pdf` | 2,916,727 | Factual source of truth (15 pp) |
| `C:\Users\rtayl\Desktop\drk\asset 2.jpg` | 125,267 | **DRK 3D Brand Asset System board** — visual source of truth |
| `C:\Users\rtayl\Desktop\drk\asset.jpg` | 111,434 | Secondary 3D icon board (light ground) |

**None of these three files is read-written, renamed, moved or deleted by any part of this project.**
Byte size and mtime are re-asserted after every asset-generation pass; last verified after the final
export — all three unchanged.

---

## 2. THE ASSET PROBLEM, AND THE DECISION

Inspection of the PDF's embedded image table returned **22 unique images**: fifteen full-bleed
**1672 × 941 JPEG** page rasters (plus a handful of superseded duplicates on pages 4, 8, 12, 13) and one
repeated 127 × 96 PNG corner stamp. **Not one isolated 3D object. Not one alpha channel. No glTF, no
layered source, no sprite sheet.**

The brief's rule: use isolated production assets *if they exist*; if they do not,
**"recreate the required visual assets/components cleanly while preserving the visual language"**, and
**do not repeatedly crop the supplied brand-board images.**

Three routes were considered:

| Route | Verdict |
|-------|---------|
| Crop the brand boards | **Rejected** — explicitly prohibited, and both boards sit on a *light* ground, so every cut-out would need its background reconstructed and would still carry the wrong lighting for a black page. |
| Model new 3D objects (R3F/glTF) | **Rejected** — a fabricated lookalike would be *less* faithful than the client's own render, would cost a WebGL runtime the information design does not need, and would drift from the brand board rather than preserve it. |
| **Re-derive the objects from the deck's own renders** | **Adopted** — see below. |

**Adopted strategy.** Every object already appears in the deck **on a genuinely black ground** (measured
modal page pixel `#000000`–`#060A0D`). Each object's largest, cleanest, most isolated instance was located,
and an alpha channel was reconstructed from luminance with a smooth knee. Because the ground is black, a
luminance matte is close to exact for these renders: the emission falloff, the smoked-glass edges and the
chrome speculars all survive with no halo and no hand-painted mask.

This is the honest reading of "recreate cleanly": it preserves the **actual production render** — correct
geometry, correct materials, correct lighting, correct green — instead of substituting an approximation,
and it never touches the brand boards.

**The remaining 80% of the visual work is genuinely built, not harvested.** Every route, architecture
diagram, chart, lifecycle rail, revenue fan, compounding loop, raise system, latency ring and the entire
product control layer is live SVG/DOM driven by `content/drk.ts`. The harvested plates are *characters
placed into* those built systems.

### 2.1 Method

```
render page at 220 dpi (2934 × 1650, 2× the inspection render)
  → crop the object's normalised bounding box
  → alpha = smoothstep(lo, hi, luminance(blur 0.6px))      lo ≈ 0.022–0.035, hi ≈ 0.165–0.21
  → RGB left as rendered (premultiplied-on-black)
  → trim to the alpha bounding box
  → downscale so no edge exceeds 1100 px
  → PNG, optimised
```

RGB is deliberately **not** un-premultiplied: un-premultiplying amplifies JPEG chroma noise inside the glow
halo, and every plate is composited over a near-black ground with `mix-blend-mode: screen` (utility
`.drk-plate`), which reproduces the original compositing exactly.

Verification was visual: all plates were composited onto the real page ground `#06090C` in a contact sheet
and inspected at full size, then re-cropped once to remove headline fragments, lifecycle rail lines and
panel borders picked up by the first pass.

---

## 3. SHIPPED OBJECT PLATES

Location: `interactive-deck/public/brand/objects/` · 20 files · **4.58 MB PNG source**
(served as AVIF/WebP by `next/image`, typically 8–15% of that on the wire).

| File | Object (board #) | Source page | Shipped px | Used in |
|------|------------------|-------------|-----------|---------|
| `liquidity-vault.png` | **03** Liquidity Vault | p3 | 836 × 900 | Scene 02 Opacity |
| `execution-beacon.png` | **04** Execution Beacon | p15 | 540 × 701 | Scene 01 Intro, Scene 14 Close |
| `execution-engine.png` | **11** Execution Engine | p12 | 656 × 561 | Scenes 01, 03, 06, 08, 11, 13, 14 |
| `network-nodes.png` | **10** Network Nodes | p9 | 379 × 446 | Scenes 01, 03, 06, 08, 10 |
| `routing-path.png` | **07** Routing Path | p9 | 382 × 448 | Scenes 03, 06, 08 |
| `market-chart.png` | **05** Market Chart | p13 | 988 × 661 | Scene 12 Compound |
| `security-shield.png` | **08** Security Shield | p7 | 229 × 271 | Scene 06 Stack |
| `security-lock.png` | **02** Security Lock | p10 | 395 × 464 | Scenes 03, 09, 10 |
| `liquidity-wave.png` | **09** Liquidity Wave | p10 | 448 × 356 | Scenes 01, 03, 09, 12, 13, 14 |
| `depth-sculpture.png` | **06** Depth Sculpture | p10 | 382 × 439 | Scene 09 Lifecycle |
| `lc-beacon.png` | 04 (lifecycle-scale) | p10 | 368 × 463 | Scene 09 Lifecycle |
| `lc-chart.png` | 05 (lifecycle-scale) | p10 | 378 × 411 | Scene 09 Lifecycle |
| `wallet.png` | wallet prop | p2 | 302 × 287 | Scene 01 Intro, Scene 10 Control |
| `falling-chart.png` | falling market chart | p6 | 1041 × 743 | Scene 05 Proof (backdrop) |
| `raise-ring.png` | use-of-funds ring | p14 | 675 × 679 | Scene 13 Raise (reference) |
| `raise-droplet.png` | trading liquidity | p14 | 259 × 258 | Scene 13 Raise |
| `raise-servers.png` | low-latency infra | p14 | 225 × 297 | Scene 13 Raise |
| `raise-puzzle.png` | integrations | p14 | 297 × 231 | Scene 13 Raise |
| `raise-people.png` | operator capacity | p14 | 276 × 234 | Scene 13 Raise |
| `raise-dashboard.png` | reporting + dashboarding | p14 | 302 × 286 | Scene 13 Raise |

**Lifecycle set note.** Scene 09 needs five objects at one matched scale under one lighting setup. Source
page 10 provides exactly that — all five stage objects photographed in a single row. `security-lock`,
`liquidity-wave` and `depth-sculpture` are therefore harvested from page 10 and shared with the other
scenes; `lc-beacon` and `lc-chart` exist as separate files only because the Beacon and Market Chart have
*better* hero instances elsewhere (p15, p13) that are the wrong scale for the rail.

---

## 4. OBJECTS NOT HARVESTED — AND WHY

| Board # | Object | Decision |
|---------|--------|----------|
| **01** | **Latency Ring** | **Built as animated SVG** (`components/visuals/LatencyRing.tsx`). It never appears in the deck as an isolated machined torus, and it is functionally a *telemetry* element — it has to sweep, fill, and read out live scroll/section progress. A still plate could not do its job. Geometry, arc segmentation and green emission follow board object 01. |
| **12** | **Frog Mascot** | **Deliberately unused.** The brand board itself scopes it as *"community / fun element"*; it appears on no deck page. An investor narrative is the wrong surface for it. Documented as available, not shipped. |

**Third-party marks — not reproduced.** Solana, Robinhood, Aptos, Sui, Cantor and Ethereum/EVM appear as
logos on source pages 7 and 9. They are **not** extracted or re-hosted. Per `VER-06`, they are rendered as
neutral typographic entries under labels that state compatibility rather than partnership, because the
deck's own copy establishes only that DRK *"adapt[s] quickly to new chains, pools, launchpads, and venues"*.
Reinstating logos requires both a confirmed relationship and confirmed trademark permission.

---

## 5. BUILT (NOT HARVESTED) VISUAL SYSTEMS

Everything below is live SVG/DOM/CSS generated from `content/drk.ts`. This is where the "recreate cleanly"
instruction does the real work.

| System | Component | Replaces |
|--------|-----------|----------|
| Latency Ring / progress telemetry | `visuals/LatencyRing` | board object 01 |
| Runtime route + node path | `visuals/RuntimeRoute` | p2 road composition |
| Vault I/O flow, closing doors | `sections/Opacity` | p3 static diagram |
| Engine → two-branch split | `visuals/EngineSplit` | p4 two static cards |
| Product control interface | `product/*` | **p11 placeholder** + p5 cards |
| Bar / line / donut / candlestick charts | `visuals/charts/*` | p5, p6, p8, p13 chart images |
| Architecture explorer | `visuals/StackExplorer` | p7 static rack |
| Market progression | `sections/Market` | p8 six identical cards |
| Integration route animation | `visuals/IntegrationRoute` | p9 static arrows |
| Lifecycle rail (H desktop / V mobile) | `visuals/LifecycleRail` | p10 static timeline |
| Revenue fan-out | `visuals/RevenueFan` | p12 static rays |
| Compounding loop | `visuals/CompoundLoop` | p13 (loop never shown in source) |
| Raise allocation system | `visuals/RaiseSystem` | p14 static diagram |

---

## 6. TYPOGRAPHY

The PDF embeds **no fonts** (fully rasterised), so the source family cannot be read from the file and is
**not claimed**. Matched by eye to the deck's tight, heavy neo-grotesk (double-storey `a`, single-storey `g`)
and its wide-tracked uppercase technical labels:

| Role | Family | Delivery |
|------|--------|----------|
| Display / headlines | **Inter Tight** 500–700 | `next/font/google`, `display: swap`, latin subset, self-hosted at build |
| Body / UI | **Inter** 400–600 | same |
| Technical labels, all numerics | **JetBrains Mono** 400–500 | same, `tabular-nums` |

No font file is copied out of the source material.

---

## 7. COLOUR — PROVENANCE OF EVERY TOKEN

Sampled programmatically, not eyeballed. Full method in `DRK_SOURCE_AUDIT.md` §5.3.

| Token | Value | Provenance |
|-------|-------|-----------|
| `--color-void` | `#000000` | modal pixel, deck pp. 1, 11, 14, 15 |
| `--color-base` | `#05080A` | mean of page grounds pp. 4, 5, 8 |
| `--color-panel` | `#090D11` | card interior p4 (`#0A0F12`), p8 (`#020808`) |
| `--color-hairline` | `#171D21` | card border p8 (`#151A16`) |
| `--color-ink` | `#FAFAFA` | headline sample p3 |
| `--color-muted` | `#A6ADB2` | body-grey band across pp. 1, 2, 3, 5, 8, 9, 13 |
| `--color-signal` | `#00E060` | deck signal green, hue 144–146°, sat 1.00, all 15 pp. |
| `--color-signal-bright` | `#00FC6B` | logo dot / glow cores, p1 |
| `--color-signal-mid` | `#00C551` | headline + metric green, p13 |
| `--color-emission` | `#68E66B` | brand-board hero swatch (hue ≈121°) |
| Neutral ramp | `#0D0F0E` … `#DFDFDF` | brand-board `DARK NEUTRALS` swatches |

**Documented discrepancy:** the brand board's green (≈121°) and the deck's green (≈145°) are different
colours. The deck's green is adopted as primary because it is the dominant, load-bearing usage across all
15 pages; the board's green is retained as `--color-emission` for the harvested object plates so they still
read correctly. Flagged as a brand-system note, not a content error.

---

## 8. WHAT IS DELIBERATELY ABSENT

No stock photography · no office imagery · no futuristic-city imagery · no generic crypto iconography ·
no fabricated product screenshots · no invented partner or customer logos · no icon-pack imports ·
no WebGL/Three.js runtime · no scroll-hijacking library · no video · no external CDN asset.

---

## 9. REGENERATION

Object harvesting is scripted and idempotent. The script reads only from `Pitch deck.pdf` and writes only to
`interactive-deck/public/brand/objects/`. Crop boxes are normalised, so re-running at a higher DPI produces
larger plates with no re-authoring. Retained at
`interactive-deck/scripts/harvest-objects.py` together with its crop table.
