# DRK — ART DIRECTION REFINEMENT REPORT

What changed in the art-direction, motion-system and product-UI pass, why, and
what was measured. Findings this answers are in `ART_DIRECTION_AUDIT.md`.

The functional architecture, the narrative and the factual content were not
rebuilt. This pass changed how it looks and how it moves.

---

## 1. THE DECIDING INPUT

`demo.mp4` was supplied with this pass. It is a sixty-second screen recording of
**the real DRK application**, running on mainnet.

Until then the Control Layer had been designed from first principles against a
description of institutional software. There was no longer any reason to guess.

Everything in §3 below is derived from that recording, and it is the single
largest reason the experience now reads as proprietary rather than as
well-designed.

---

## 2. THE GROUND WAS THE WRONG COLOUR

Sampled across the recording, DRK's product black is **neutral, biased a hair
green**: `#000100`, `#040603`, `#020401`, panels `#090b08`. Its greys follow the
same bias — `#5e605d`, `#4f514e`, `#636562`.

The deck was running a **blue**-black (`#05080a`), and every surface, hairline,
panel and grey inherited that bias. Nothing in the pitch deck required it; it
was an assumption made in the first hour of the build and never revisited.

| | Was | Now |
|---|---|---|
| Base | `#05080a` | `#050705` |
| Panel | `#090d11` | `#090b08` |
| Panel 2 | `#0d1217` | `#0d100c` |
| Hairline | `#171d21` | `#191d18` |
| Ink | `#fafafa` | `#f4f6f3` |
| Muted | `#a6adb2` | `#a5aca3` |
| Faint | `#838b91` | `#858c82` |

One token change, and the whole experience stopped looking like a website about
DRK. Contrast ratios were re-verified after the shift — zero WCAG violations.

**The green was not changed.** DRK's signal green differs across all three
supplied sources — `#00e060` in the pitch deck, ~121° on the brand board,
`#cbef95` (a light lime) in the live product. The deck is the factual source of
truth for this artefact, so its green stands, and the discrepancy is recorded
for the client as **VER-11** rather than resolved silently.

---

## 3. THE CONTROL LAYER, REBUILT ON DRK'S OWN LANGUAGE

Not polished — rebuilt. What the real application establishes, and what the
surface now does:

| The real product | The deck now |
|---|---|
| A thin bar above every page: `MAINNET · Instances 1/1 live · Pools 1 · Actions 0 · Executions 1` | An environment pill and live counters — `MAINNET · Programs 4 · Wallets 5 · Executions 2,341 · Threats 0`. Every counter is a figure already in the manifest |
| A narrow rail grouped `OVERVIEW / SETUP / OPERATE`, active item marked by a green left bar | A narrow rail grouped `OVERVIEW / POSITION / OPERATE / EVIDENCE`, same green bar |
| **Information with no container** — `0.001284 / Price`, `$90,100 / TVL (USD)`, `25 bps / Fee`, separated by nothing but alignment | The `Field` primitive. This is now the house pattern and it replaced every metric card in the surface |
| Section headers as title + status pill, controls right-aligned on the same baseline | The `Head` primitive |
| Ledgers with ruled rows and right-aligned numerics | The `Ledger` primitive — wallets, programs, executions and launches are all ledgers now, not tables in boxes |
| Dense, meaningful provenance (`COVERAGE USD 100% actors 100% …`) | Each module's source-capability line, unchanged from before |

Selecting a wallet no longer opens a panel beside the table — **the whole
surface reports on it**: the field above the ledger switches to that wallet's
deployed, available and share-of-book. That is the "interface shifts
proportionally" behaviour the brief asked for, and it is also how the real
product behaves.

Numerals are now designed as numerals: display family, tabular figures,
noticeably brighter than their labels. Money reads as money.

---

## 4. ONE MOTION GRAMMAR

`lib/motion.ts` is new and is now the only source of easing and duration.

Before: eleven instances of `[0.22,0.61,0.36,1]`, five of `[0.16,1,0.3,1]`, one
curve declared and never used, and free-hand durations at 0.22, 0.26, 0.28,
0.30, 0.32, 0.35, 0.42, 0.68, 0.70 and 0.90 seconds with no relationship between
them. It animated correctly and read as several design teams.

**Five behaviours** — the verbs the brief names:

```
FLOW         capital or signal travels a route
ACTIVATE     dormant infrastructure powers on
ROUTE        a system establishes a connection
RECONFIGURE  the same infrastructure changes operating state
RESOLVE      complexity collapses into a clear final state
```

**Six curves** — `enter`, `exit`, `route`, `object`, `ui`, `camera`. Nothing
springs, bounces or overshoots.

**Five durations**, each ~1.6× the last — `tick 160ms`, `ui 260ms`,
`state 420ms`, `section 680ms`, `scene 1100ms`.

Every component was migrated. **Zero** ad-hoc easings or `duration-*` utilities
remain anywhere in `components/`.

---

## 5. IMAGERY: REMOVED, NOT POLISHED

The audit's test for every object was: *does it explain something, does it
participate, would the scene be weaker without it?*

**Removed**

| Scene | What went | Why |
|---|---|---|
| Raise | five allocation icons (droplet, servers, puzzle, people, dashboard) | Generic renders in a list, explaining nothing, outside the object language |
| Stack | four layer chips + the OUTPUT shield + the inspector chip | A picture placed beside a label |
| Integration | the Routing Layer plate + a nodes chip | A stylised arrow swoosh drawn beside a diagram of routing — an illustration of the thing, standing next to the thing |
| Proof | the ghosted `falling-chart` behind the candles | Read as a rendering artefact (removed in the previous pass) |

**Kept — and the policy is now explicit.** An object appears only where it is
physically part of the system:

| Scene | Object | What it does |
|---|---|---|
| 01 Intro | five stations | Stand ON the world signal; the route connects them |
| 02 Opacity | Liquidity Vault | Shutters physically close over its face |
| 03 Engine | Execution Engine | The core both chains run through, at step 04 |
| 08 Integration | Execution Engine | The routes leave its port |
| 09 Lifecycle | five stage objects | Sit on the travelling route at its own elevation |
| 11 Revenue | Execution Engine | The five streams leave it |
| 14 Close | Beacon + Wave | Stand on the resolving signal |

Six of the fourteen scenes now contain no rendered object at all — Visibility,
Proof, Stack, Market, Control, Compound and Raise are typography, data and
structure. That is the point.

**The Latency Ring was rebuilt.** It had a machined chrome gradient
(`#5c666c → #c9d2d6 → #39434a`) and a radial green core, at 200–240px, in four
scenes — a decorative dial. It is now a measuring instrument: one hairline bezel,
a graduated tick ring that lights as it fills, one thin arc. No chrome, no glow.

---

## 6. FEWER BOXES, HARDER CORNERS

Roughly **40 bordered containers became ruled rows**: Revenue's five streams,
Raise's five allocations, Engine's six chain nodes, Stack's eight external
entries and four core layers, and every table in the Control Layer.

A `.drk-row` and a `.drk-note` (a green rule at the left edge, no box) replaced
them. Where a border survives it is doing structural work — the DRK CORE pane
says *this is the part we own*, and the product surface says *this is software*.

Radii came down to a named scale: `surface 8px`, `panel 6px`, `row 3px`,
`chip 3px`. Previously 14–16px on panels and 10–11px on every row.

`.drk-glass` also lost a `backdrop-filter: blur(6px)` that sat over a solid
ground — a compositor layer that bought no pixels.

---

## 7. THE SIGNAL

The persistent liquidity line was one stroke plus a blur copy. It is now three
layers, as the brief specifies:

```
ENVIRONMENT   26px, blur 22, opacity 0.035   the room knows it is there
BODY           9px, blur 6,  opacity 0.085   volume
CORE         1.2px,          opacity 0.5     the exact reading
```

The travelling pulse dropped from `signal-bright` at 2.4px on a 9-second
traverse to `signal` at 1.8px on a **13-second** traverse. In the real product
nothing pulses at all, so this is close to the quietest thing that still says the
system is live.

---

## 8. COPY — CLIENT-DIRECTED

On instruction, DRK no longer describes itself as a market maker.

| | Was | Now |
|---|---|---|
| Lockup | `DARK MARKET MAKERS` | `THE OPERATING SYSTEM FOR LIQUIDITY` |
| One-liner | "Transparent **market making** for token launches, DEXs, perps, and onchain assets." | "Transparent **liquidity infrastructure** for token launches, DEXs, perps, and onchain assets." |

The title, meta description and page heading follow. These are the only two
places in the manifest that knowingly depart from the source deck.

**Left alone, and flagged:** the deck still uses "market making" as a *category*
noun where it describes the industry rather than naming DRK — "Legacy market
making is built on opacity", "what black-box MMs hide", "the market for MM
infrastructure", and the closing thesis "The next market maker is not a black
box." Those carry the argument. Recorded as **VER-12** for a decision.

---

## 9. WHAT DID NOT CHANGE

Deliberately untouched: the persistent world and its narrative time, the
morphing signal's keyframes, the fourteen-scene structure, every Control Layer
behaviour, the scroll architecture, the reduced-motion contract, the mobile
recompositions, and every factual value and verification flag.

---

## 10. MEASURED

| | |
|---|---|
| Lighthouse Performance | **99** |
| Lighthouse Accessibility | **97** (the 3 points are blended colours of not-yet-revealed elements at scroll 0 — see below) |
| Lighthouse Best Practices | **100** |
| axe-core, WCAG 2.1 A/AA | **0 violations** at 1440×900 and 390×844 |
| Visual QA | **205 screenshots**, five viewports — no clipping, no overflow, no console errors |
| Interaction QA | **32/32** |
| `tsc --noEmit` | clean |
| `next build` | clean |

FCP 0.4s · LCP 0.8s · CLS 0.021 · First Load JS 200 kB.

Screenshots: `.review/art-direction-final/` at 1920×1080, 1440×900, 1366×768,
1024×768 and 390×844.

**One real defect this pass introduced and fixed.** Rebuilding the ledgers put
`aria-pressed` on `role="row"`, which is an invalid ARIA combination — 64 nodes,
severity critical. Selectable rows belong to a `role="grid"` and report with
`aria-selected`. Caught by the audit, fixed, re-verified at zero. The chip
controls also came in at 30px tall and were raised to clear a 32px touch target.

---

## 11. REMAINING WEAKNESSES

Honest list.

1. **The type scale is still nominal.** One-off sizes (`0.82rem`, `0.84rem`,
   `0.86rem`, `0.88rem`, …) survive outside the Control Layer, which now has a
   real ladder via `Field` / `Num` / `Head`. The scenes should adopt the same
   primitives. This is the largest piece of unfinished art direction.
2. **Rhythm is better, not solved.** Opacity, Compound and Close are genuinely
   sparse now; Visibility → Proof → Stack is still three dense scenes in a row.
3. **Ten of fourteen scenes still share one composition** — narrative left,
   system right. Intro, Engine, Lifecycle and Close differ. More variation would
   help pacing.
4. **`--color-emission` and `--color-signal-ink` are declared and unused.**
5. **The instrument strip's 14-tick gauge duplicates the nav rail's spine.** Both
   earn their place individually; together they state position twice.
6. **The green question is open** (VER-11). If the client confirms the product's
   lime is canonical, it is a one-token change and every surface follows.
