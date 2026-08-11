# DRK — PREMIUM REFINEMENT AUDIT

Audit of the shipped first version of the DRK interactive deck, conducted against
the running application (`http://localhost:3001`) with Playwright captures at
1920×1080, 1440×900, 1366×768, 1024×768 and 390×844.

Captures: `.review/audit/desktop/<vp>/` and `.review/audit/mobile/390x844/`.
Every finding below was read off an actual rendered screenshot, not inferred from
source.

**Severity**

| | |
|---|---|
| **P0** | Significantly damages premium perception or comprehension |
| **P1** | Obvious weakness a senior reviewer would call out |
| **P2** | Refinement |
| **P3** | Optional detail |

---

## 0. THE HEADLINE FINDING

The first version passes every functional test and fails the central one.

> **Does this feel like someone opened a pitch deck, or like someone opened DRK?**

It still reads as *a deck*. The diagnosis is specific and structural, not
cosmetic:

1. **Every scene owns its own world.** Each of the fourteen sections paints its
   own `drk-grid-bg`, its own radial green wash, its own vignette, and composes
   its own unrelated diagram. Scrolling therefore feels like
   `SECTION → ANIMATION → NEXT SECTION → DIFFERENT ANIMATION`. There is no
   substrate that persists.
2. **The green liquidity signal is re-drawn from scratch in five different
   places** (Intro route, Opacity flow, Revenue fan, Compound loop, Close route)
   and never continues between them. The one device that could carry continuity
   is used as five decorations.
3. **The DRK objects appear and disappear rather than recur.** The Execution
   Engine is present in Intro, Engine, Stack, Integration, Revenue and Raise —
   but at six different scales, six different positions, with no sense that it is
   the same object being revisited.
4. **Vertical composition is consistently ~60% full.** Almost every scene leaves
   200–300px of dead space below the content block at 1440×900. Emptiness reads
   as unfinished, not as restraint, because it is not composed.

Everything under P0 below is downstream of these four.

---

## 1. P0 — SYSTEM / ARCHITECTURE

| ID | Finding | Evidence |
|---|---|---|
| **P0-01** | No persistent world. 14 independent backgrounds, 14 independent green washes. | Every capture |
| **P0-02** | The liquidity signal does not survive a scene boundary. Intro's route terminates at the frame edge; Opacity starts a fresh unrelated flow diagram. | `intro-095`, `opacity-050` |
| **P0-03** | **The entire brand cover is invisible on mobile.** `useSceneNarrative` returns `p = 1` off-desktop, so Intro's cover (`opacity: 1 - range(p, .05, .14)`) evaluates to 0 on first paint. A phone visitor never sees `DRK.` / `DARK MARKET MAKERS` / the one-liner. | `mobile/390x844/intro-000` |
| **P0-04** | Investor-facing internal material. The ten-item content-verification register renders below the closing thesis in the production page. | `page.tsx` → `<VerifyNotes />` |
| **P0-05** | Scene 10, the declared centrepiece, is the weakest product surface in the deck. Left rail is a plain text list on a lighter panel — a settings menu, not an operating system. Six modules, one interaction (switch module). No overview, no row selection, no event stream, no period switching. | `control-040` |
| **P0-06** | Control Layer chart renders as a broken artefact mid-scrub: a 60px green squiggle bottom-left plus a bare vertical rule, in an otherwise empty 400px plot area. | `control-040` |

## 2. P0 — COMPREHENSION

| ID | Finding | Evidence |
|---|---|---|
| **P0-07** | **Opacity never performs opacity.** The vault is a static plate; the doors never close, nothing is consumed, nothing transforms. A green bar appears at the left edge and the output labels swap. The section asserts its argument instead of demonstrating it. | `opacity-050`, `opacity-090` |
| **P0-08** | Opacity's resolved output labels (`ASSETS`, `PROGRAMS`, `EXECUTION`) render at `fontSize: 8.5` inside a 900-unit viewBox — roughly 7px on screen. The payoff of the section is illegible. | `opacity-090` |
| **P0-09** | **Engine opens on two cards** — precisely the failure mode the brief names. Two large rounded grey panels appear either side of the engine, with no way to inspect either model. Managed Trading vs Licensed Runtime is asserted, never explored. | `engine-050` |
| **P0-10** | Visibility is animated metric cards. No wallet selection, no inventory drill, no execution rows, no P/L period switch. It claims "clients see everything" while showing four numbers. | `visibility-050` |
| **P0-11** | Own the Stack is a static rack diagram with a hover tint. Nothing is explorable; inputs and outputs are never shown; the OUTPUT column is empty for most of the scene's runway, leaving a hole in the composition. | `stack-060` |
| **P0-12** | Lifecycle reads as three cards on a ruler, not a journey. The rail is a dead-flat full-width hairline; objects float above it unattached; only ~2.5 stages are ever on screen. | `lifecycle-050` |
| **P0-13** | Revenue → Compound → Raise are three unrelated diagrams. Value does not flow from the streams into a pool, the pool does not become the loop, and the $1M does not enter a machine that is already running. | `revenue-060`, `compound-060`, `raise-060` |

## 3. P0 — LAYOUT / COLLISION

| ID | Finding | Evidence |
|---|---|---|
| **P0-14** | Lifecycle stage content renders **underneath the fixed nav rail**. "Liquidity / Activate liquidity / Enable depth" is legible behind the rail labels. | `lifecycle-050` |
| **P0-15** | Intro's REPORTING station (x = 90%) collides with the nav rail's reserved column. | `intro-095` |
| **P0-16** | Close: the Execution Beacon plate crosses the headline, cutting through "black box." | `close-095` |

## 4. P1 — MATERIAL, COLOUR, MOTION

| ID | Finding | Evidence |
|---|---|---|
| **P1-01** | **Green is used as fill, not signal, in four places**: Visibility's donut (a 140px solid bright-green ring), Control's wallet bar field, Market's `90+` at 8.5rem in pure `#00e060`, and Compound's glowing loop ring. | `visibility-050`, `market-060`, `compound-060`, `mobile/control-040` |
| **P1-02** | Stack's DRK CORE panel carries a large soft green bloom (`0 0 60px -22px`) that reads as generic neon glow rather than controlled emission. | `stack-060` |
| **P1-03** | Object scale is incoherent across scenes. The Execution Engine renders at ~56px (Engine pillars), ~130px (Intro), ~160px (Revenue), ~280px (Integration). Same object, no consistent physical size. | Multiple |
| **P1-04** | Decorative object plates behind data read as rendering artefacts, not depth: Proof's `falling-chart` at 0.22 opacity behind the candles, Compound's `market-chart` at 0.20 behind the loop. Both look like ghosting. | `proof-050`, `compound-060` |
| **P1-05** | 40–56px object thumbnails (Engine pillars, Stack core rows, Raise allocations) are illegible smudges at that size. | `engine-050`, `stack-060`, `raise-060` |
| **P1-06** | The liquidity signal is a flat 1.7px stroke with a blur copy. It reads as a laser pointer, not a channel carrying liquid. | `intro-070`, `close-095` |

## 5. P1 — TYPOGRAPHY / COMPOSITION

| ID | Finding | Evidence |
|---|---|---|
| **P1-07** | **Support paragraphs sit flush against headlines in seven scenes.** `leading-[1]` on a multi-line display headline eats the following `mt-5`, so the lede reads as a fourth headline line. | `engine-050`, `proof-050`, `market-060`, `compound-060`, `raise-060`, `lifecycle-050`, `integration-070` |
| **P1-08** | Persistent dead space. At 1440×900 the composed block typically spans y≈100–670, leaving ~230px of unstructured emptiness at the bottom of nearly every scene. | Every desktop capture |
| **P1-09** | Revenue stream rows wrap to 2–3 lines ("Upfront / liquidity", "$10k / month / software / license"), producing ragged rows of unequal height, which in turn desynchronises the fan routes that point at them. | `revenue-060` |
| **P1-10** | Engine's business index (`01`, `02`) is placed after the title by `flex-row-reverse` and lands mid-word, misaligned. | `engine-050` |
| **P1-11** | Market's right column is a single number in a void — no chart, no scale, no progression. Step 11's "animated chart transitions / progressive scale" is absent. | `market-060` |
| **P1-12** | Raise's connector stubs float with a visible gap between the `$1M` ring and the allocation rows — reads unfinished. | `raise-060` |
| **P1-13** | Intro's cover composition is a title slide: wordmark bottom-left, ring right, 45% of the frame empty above. | `intro-000` |

## 6. P1 — MOBILE

| ID | Finding | Evidence |
|---|---|---|
| **P1-14** | (See P0-03) Brand cover absent. | `mobile/intro-000` |
| **P1-15** | Control Layer table is visually truncated at the right edge; the horizontal scroll affordance is invisible so it reads as broken layout. | `mobile/control-040` |
| **P1-16** | Mobile is *correct* but not *designed*: it is the desktop information set stacked. No scene is recomposed to exploit a tall narrow frame. | All mobile captures |

## 7. P2 / P3

| ID | Finding |
|---|---|
| **P2-01** | Market's footer strip (`04 / 06 · ONE ENGINE. TWO MODELS. ENDLESS MARKETS.`) reads as leftover chrome. |
| **P2-02** | Proof's candle chart has no time axis and no value axis — it is a shape, not an instrument. |
| **P2-03** | Integration's "route forming" is a progress bar, not a route. |
| **P2-04** | Compound's `MORE LAUNCH CAPACITY` label overlaps the loop ring stroke. |
| **P2-05** | `StepProgress` renders as a broken dashed line at small widths. |
| **P3-01** | The Latency Ring's radial core reads as a speaker cone at 200px. |
| **P3-02** | Raise allocation icons (droplet/servers/puzzle/people/dashboard) are the deck's own p14 art and sit outside the 3D object language. |

---

## 8. WHAT IS ALREADY RIGHT — PRESERVE

Not everything needs rebuilding. These are load-bearing and stay:

- **Scroll architecture.** Native `position: sticky` + progress derived from
  `useScroll` ratio. No timeline accumulation. Fast scroll, reverse scroll,
  mid-page reload and back/forward all land on a valid state. Do not replace this
  with GSAP ScrollTrigger pinning.
- **Content centralisation.** Every business fact lives in `content/drk.ts`.
- **Factual discipline.** Ten `TODO_CONTENT_VERIFY` items preserved, `$70k`
  label untouched, market-data vintages not silently refreshed, no invented
  clients, partners, valuations or splits.
- **Reduced motion.** Pinning disabled entirely; full content parity.
- **The Close frame.** The single strongest composition in the build.
- **The harvested object plates.** Real DRK production renders, correctly
  composited.
- **The colour tokens and the near-black ground.**

---

## 9. REMEDIATION PLAN

Ordered by dependency. P0 and P1 are all in scope.

**A. Substrate (fixes P0-01, P0-02, P1-02, P1-08 partially)**
Build one persistent world layer beneath the entire document: a global
engineering grid, a single ambient light whose position tracks the narrative, and
**one continuous liquidity signal** whose path morphs between authored states as
the investor scrolls. Strip the per-scene grid/wash/vignette so no scene owns its
own background any more.

**B. Continuity contract (fixes P1-03)**
A single `SystemObject` primitive with a fixed physical scale ladder, so the
Execution Engine is recognisably the same object at every appearance.

**C. Product depth (fixes P0-05, P0-06, P0-10)**
Rebuild the Control Layer as a genuine seven-module operating surface with
row selection, an execution event stream, P/L period morphing and analytics
metric switching. Rebuild Visibility on the same primitives.

**D. Demonstration over assertion (fixes P0-07 … P0-13)**
Opacity physically consumes and closes; Engine reconfigures between two modes
around one persistent core; Stack becomes explorable; Market becomes a charted
progression; Integration performs a connection sequence; Lifecycle becomes a
travelling journey; Revenue → Compound → Raise become one continuous economic
act.

**E. Composition and type (fixes P1-07 … P1-13, P0-14 … P0-16)**
Global headline/lede rhythm, a scene frame that composes the full viewport
height, hard collision guards against the nav rail.

**F. Production hygiene (fixes P0-04)**
Verification register out of the investor build, into docs and a dev-only route.

**G. Mobile (fixes P0-03, P1-14 … P1-16)**
Cover restored; every scene reviewed at 390×844 as a designed composition.

---

---

## 10. RESOLUTION

Every P0 and every P1 in this audit was implemented. Verified against the
production build:

| Group | Status |
|---|---|
| P0-01 … P0-06 (system / architecture) | Fixed — one persistent world, one signal, brand cover restored on mobile, register removed from the build, Control Layer rebuilt as seven operable modules |
| P0-07 … P0-13 (comprehension) | Fixed — every scene now demonstrates rather than asserts |
| P0-14 … P0-16 (collision) | Fixed — rail clearance computed from the rail's real geometry; no scene content reaches it at any width |
| P1-01 … P1-06 (material / colour) | Fixed — green is a signal everywhere; object scale unified on one ladder |
| P1-07 … P1-13 (typography / composition) | Fixed — one headline→lede rhythm, an instrument strip composing every bottom edge |
| P1-14 … P1-16 (mobile) | Fixed — cover restored, tables given affordances, every scene recomposed |
| P2 / P3 | Addressed except P3-02 (the Raise allocation icons remain the deck's own page-14 art) |

Measured after: Lighthouse Performance **99**, Accessibility **97**, Best
Practices **100**; **zero** WCAG 2.1 A/AA violations under axe in reduced motion;
205 screenshots clean of clipping, overflow and console errors; 32/32 interaction
checks passing.

One finding in this audit was itself wrong on re-measurement: several "clipping"
reports traced to a decorative pseudo-element inflating `scrollHeight`, not to
clipped content. The detector was corrected. See `PREMIUM_REFINEMENT_REPORT.md`
§9.

*Implementation and results: see `PREMIUM_REFINEMENT_REPORT.md`.*
