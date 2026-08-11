# DRK — ART DIRECTION AUDIT

A visual-language audit only. Function, narrative, performance and accessibility
are out of scope except where a visual change touches them.

Evidence: the full deck captured at 1920×1080, 1440×900, 1366×768 and 390×844
(`.review/premium-final/`), plus **`demo.mp4` — a screen recording of the real
DRK application**, which was supplied with this pass and changes the brief.

---

## 0. THE NEW SOURCE OF TRUTH

`demo.mp4` (1912×1000, 60s) is not a reference video. It is **DRK's actual
product**, running on mainnet.

That matters more than anything else in this audit. Until now the Control Layer
was designed from first principles against a description of institutional
software. There is no longer any need to guess: DRK's own interface is on record,
and the deck's product surface should look like the product.

### What the real application establishes

**Shell.** A narrow left rail with grouped sections — `OVERVIEW` (Overview,
Setup, Settings), `SETUP` (Vault, Wallets, Token Studio, Tokens & Pairs, Pools),
`OPERATE` (Operator Studio, Trade, Distributions, Instances, Campaigns, Activity
Programs, Live Operations, Reconciliation, Liquidity, Launch Edge). Above the
content, a single thin telemetry bar: an environment pill, then live counters —
`Instances 1/1 live · Pools 1 · Actions 0 · Executions 1 · Threats 0`.

**Information without boxes.** The defining pattern, seen in *Canonical pool
state* and *Rolling market state*: a grid of value-over-label cells with **no
card, no border, no background** — separated by nothing but alignment and
spacing. `0.001284 / Price`, `$90,100 / TVL (USD)`, `25 bps / Fee`,
`high / Confidence`, `0s ago / Observed`. This is exactly the "constructed rather
than tiled" language the brief asks for, and DRK already uses it.

**Section headers.** Small line icon + title + a status pill on the same
baseline (`● HEALTHY`, `● LIVE EVIDENCE`, `● 1H · OBSERVED`), with controls
right-aligned (a selector, timeframe chips, an action button).

**Dense provenance.** `COVERAGE  USD 100%  actors 100%  funding 100%
price 100%  liquidity 100%  retained 186/5000`, and an `EVIDENCE PROVENANCE`
strip of small chips. Every field means something. There is no decorative
hexadecimal, no fake diagnostics.

**Ground.** Sampled across frames: `#000100`, `#040603`, `#020401`; panels
`#090b08`. **Neutral-to-green-tinted near-black — never blue.** The greys follow
the same bias (`#5e605d`, `#4f514e`, `#636562`: green channel highest).

**Restraint.** Green appears on: the active nav item's left bar, one primary
button, status pills, a data-quality bar, and the live price tag. Nothing else.
Radii are small. Borders are one pixel and barely visible. Nothing glows.

### The one conflict this creates

DRK's green is not consistent across the three supplied sources:

| Source | Measured | Hue |
|---|---|---|
| `Pitch deck.pdf` | `#00e060` | ~145° spring green |
| `asset 2.jpg` object emission | — | ~121° |
| **`demo.mp4` (live product)** | `#cbef95`, `#b6cf95` | **~85° lime** |

The deck is the factual source of truth *for the deck*, so the signal green is
**not changed** in this pass. This is recorded as a finding for the client, not
silently resolved. See `DRK_CONTENT_VERIFICATION.md` → **VER-11**.

The ground, however, is a different matter: nothing in the pitch deck required a
*blue* black, and the product's is neutral. That is corrected.

---

## 1. SEVERITY

**P0** — breaks the single art direction, or reads as tacky/imported
**P1** — visible inconsistency a creative director would call out
**P2** — refinement

---

## 2. P0 — THE ART DIRECTION IS NOT SINGULAR

| ID | Finding |
|---|---|
| **A0-01** | **The ground is blue-black (`#05080a`); DRK's own product ground is neutral/green-tinted black (`#040603`).** Every surface, hairline and grey in the deck inherits the wrong bias. This is the single largest reason the deck reads as "a website about DRK" rather than as DRK. |
| **A0-02** | **No motion grammar.** Easing is invented per component: `[0.22,0.61,0.36,1]` in eleven places, `[0.16,1,0.3,1]` in five, `[0.55,.06,.68,.19]` declared and never used, plus raw `duration-300/400/500/700` utilities scattered across every scene. Durations run 0.22s, 0.26s, 0.28s, 0.3s, 0.32s, 0.35s, 0.42s, 0.7s, 0.9s with no system. |
| **A0-03** | **Objects are inserted, not participating.** The Raise allocation icons (`raise-droplet`, `raise-servers`, `raise-puzzle`, `raise-people`, `raise-dashboard`) are the worst offenders: five small generic renders sitting in a list, decorative, explaining nothing, and stylistically outside the 3D object system. Stack's four `chip` objects and Integration's pipeline objects are the same category — a picture placed beside a label. |
| **A0-04** | **The Control Layer is a good generic dashboard, not DRK's software.** Now that the real application is on record, the gap is specific: no environment/telemetry bar, no grouped rail, module bodies still built from bordered sub-panels rather than the product's box-free metric grids, and section headers without the product's icon+title+status-pill pattern. |
| **A0-05** | **Too many boxes.** 40+ bordered containers across the deck: Revenue's five rows, Raise's five rows, Engine's six chain nodes, Integration's five venue rows, Stack's eight external entries and four core entries, Opacity's input/output chips. Almost none need a box; the product uses rules and alignment instead. |

## 3. P1 — MATERIAL AND SURFACE

| ID | Finding |
|---|---|
| **A1-01** | Radii are soft: 14px on `.drk-glass`, 10–11px on every row, 16px on the Stack core. DRK's product uses ~10px on large panels and ~6px on chips. The deck should read machined, not rounded. |
| **A1-02** | The Latency Ring's chrome gradient (`#5c666c → #c9d2d6 → #39434a`) is a strong metallic sweep that appears at 200–240px in three scenes. Next to the product's flat, restrained surfaces it reads as a decorative dial. |
| **A1-03** | `.drk-glass` carries `backdrop-filter: blur(6px)` over a solid ground where there is nothing to blur — cost with no visual result. |
| **A1-04** | The world's travelling pulse is a bright `--color-signal-bright` dash. In the real product nothing pulses. It should be far quieter. |
| **A1-05** | Green appears as a large area in three remaining places: the Allocation bar's active segment, the Compound arc at full ring scale, and Market's headline rule. |

## 4. P1 — TYPOGRAPHY

| ID | Finding |
|---|---|
| **A1-06** | The type scale is nominal, not actual. Components declare one-off sizes — `text-[0.82rem]`, `[0.84rem]`, `[0.86rem]`, `[0.88rem]`, `[0.9rem]`, `[0.92rem]`, `[0.95rem]`, `[0.98rem]` all appear, plus a dozen bespoke `clamp()`s. There is no enforced ladder. |
| **A1-07** | Numbers are not designed. Metric values, table values and telemetry values share a weight and a family with body copy in several places; the product sets values noticeably brighter and tighter than their labels. |
| **A1-08** | `drk-label` is used for six different jobs — section eyebrow, column header, status text, unit, hint, and telemetry — at the same size and colour. |

## 5. P1 — RHYTHM

| ID | Finding |
|---|---|
| **A1-09** | Every scene is roughly equally busy. There is no sparse beat between Visibility (dense product), Proof (dense data) and Stack (dense architecture); Control (very dense) is followed immediately by Revenue (dense diagram). The deck never breathes. |
| **A1-10** | Fourteen scenes all use the same left-narrative / right-system split. Intro, Engine, Lifecycle and Close differ; the other ten are the same composition. |

## 6. P2

| ID | Finding |
|---|---|
| **A2-01** | Compound's loop diagram carries seven radial labels plus a centre readout plus a disclaimer — more diagram than the idea needs. |
| **A2-02** | The instrument strip's fourteen-tick gauge duplicates the nav rail's spine. |
| **A2-03** | Market's step ledger and its chart both carry the figure. |
| **A2-04** | `--color-emission` and `--color-signal-ink` are declared and never used. |

---

## 7. WHAT IS ALREADY RIGHT — DO NOT TOUCH

- The persistent world, the morphing liquidity signal, narrative time, and
  objects registered against the signal.
- Every functional behaviour in the Control Layer.
- All factual content and every verification flag.
- The scroll architecture, the performance work, the accessibility work.
- Intro's opening, Opacity's shutters, Stack's reachability model, Integration's
  connection sequence, and the Close.

---

## 8. THE PLAN

1. **Reground.** Retune the entire neutral ramp to DRK's own product black.
2. **One motion grammar.** `lib/motion.ts`: five behaviours (FLOW, ACTIVATE,
   ROUTE, RECONFIGURE, RESOLVE), six curves, one duration ladder. No component
   invents easing again.
3. **Rebuild the Control shell** against the real application: telemetry bar,
   grouped rail, box-free metric grids, product-style section headers.
4. **Delete inserted imagery.** Raise icons, Stack chips, Integration plates.
5. **Cut boxes by half.** Rows become ruled rows.
6. **Tighten radii and kill decorative chrome.**
7. **One type ladder**, with numerals designed as numerals.
8. **Give the deck rhythm** — make the sparse scenes genuinely sparse.

*Implementation and results: `ART_DIRECTION_REFINEMENT_REPORT.md`.*
