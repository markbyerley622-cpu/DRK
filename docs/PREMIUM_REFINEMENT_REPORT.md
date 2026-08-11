# DRK — PREMIUM REFINEMENT REPORT

What changed between the first working build and the current one, why, and what
was measured. Findings this answers are in `PREMIUM_REFINEMENT_AUDIT.md`.

---

## 1. THE ONE STRUCTURAL CHANGE

The first build failed the central test — *does this feel like a deck, or like
DRK?* — for a structural reason, not a cosmetic one: **fourteen scenes each owned
their own world.** Each painted its own grid, its own green wash, its own
vignette, and drew its own unrelated green line. Scrolling therefore felt like
`SECTION → ANIMATION → NEXT SECTION → DIFFERENT ANIMATION`.

That is now inverted. There is **one persistent world beneath the entire
document**, and scenes compose on top of it.

```
WorldProvider                     one scroll observer for the whole page
  ├─ frame channel (rAF)          continuous narrative time t ∈ [0, 13]
  └─ state channel (React)        active scene, total progress
        │
DrkWorld                          fixed, z-0, pointer-events: none
  ├─ ONE ground                   two-scale engineered grid, painted once
  ├─ ONE light                    travels with the narrative, never re-lit
  └─ ONE liquidity signal         a single path whose SHAPE morphs with scroll
        │
main (z-1)                        fourteen scenes, no backgrounds of their own
  ├─ SceneStage                   pinned band + instrument strip
  ├─ SignalStations               objects registered ON the world signal
  └─ scene content                HTML/CSS text · SVG systems · object plates
```

### The liquidity signal

`lib/world.ts` holds fourteen keyframes — one per scene — each a nine-point
control polygon in viewport-relative coordinates, plus a per-scene presence
value. The rendered path is the interpolation of the two keyframes bracketing
the current narrative time. So the line that comes online in Scene 01 is
literally the same line that:

| Scene | becomes |
|---|---|
| 01 Intro | a rise out of the floor — the system activating |
| 02 Opacity | a flat approach into the vault, swallowed at centre |
| 03 Engine | drawn into a single point and released |
| 05 Proof | falling with the market, holding, turning up at the end |
| 07 Market | flat for a long time, then away — exponential |
| 09 Lifecycle | quiet, so the launch journey's own route reads unambiguously |
| 11 Revenue | leaving the engine and fanning right |
| 12 Compound | curling back on itself |
| 13 Raise | converging to a point, then expanding outward |
| 14 Close | the opening rise, returned |

**Hold, then transform.** The fractional part of narrative time is eased so the
signal *holds* a scene's shape through the first 58% of its runway and then
morphs across the boundary. Two things depend on that: scenes can register
objects against a stable line, and the transition between scenes becomes the
transformation the brief asks for rather than a fade.

**Objects stand on it.** `components/world/SignalStations.tsx` positions DRK
objects at a viewport-x and reads the signal's height at that x every frame, so
when the line morphs the objects ride with it. Used by Scene 01 and Scene 14 —
the two frames that bookend the experience.

**Cost.** The frame loop writes DOM attributes directly and never triggers a
React render. Per frame: one nine-point interpolation, one path build, a handful
of attribute writes. React re-renders only when the *active scene* changes.

### The instrument strip

Every pinned scene now ends in a hairline readout — scene index, scene title, a
fourteen-tick position gauge, and the machine's current state. It composes the
bottom edge of every frame (the audit found 200–300px of unstructured dead space
under almost every scene), it makes the system feel continuously instrumented,
and it is a second, non-colour cue for position. The nav rail carries the same
state, so the machine is reporting on itself from two places at once.

---

## 2. SCENE BY SCENE

| # | Scene | What it now does |
|---|---|---|
| 01 | **Intro** | Opens in controlled darkness: identity, one measurement, and the runtime reporting its four subsystems ONLINE one at a time. Then five objects arrive **standing on the world signal** — Launch, Wallets, Liquidity, Execution, Reporting. **The brand cover now renders on mobile** (it was invisible: `p = 1` off-desktop collapsed it to zero). |
| 02 | **Opacity** | Performs opacity instead of asserting it. Two machined shutters close over the Liquidity Vault's own face — the object's silhouette still ghosts through, so it reads as the vault closing, not a panel replacing it. The interior goes dark, outputs become unidentifiable, then DRK opens it and the four unknowns resolve into ASSETS / PROGRAMS / EXECUTION / P/L. |
| 03 | **Engine** | Never opens on two cards. It opens on **one engine**, then the same engine is reconfigured twice. Both chains are five steps and the engine occupies step four in each (EXECUTION under managed, INFRASTRUCTURE under licensed), so switching mode changes the inputs and the outcome while the core stays exactly where it is. Selectable and keyboard-operable. |
| 04 | **Visibility** | Runs the **same software** as Scene 10, not a second mock-up — four of its seven modules, identical chrome and behaviour, met earlier and shallower. The four dimensions are named as the four unknowns from Scene 02, each marked RESOLVED only once the surface has actually opened it. |
| 05 | **Proof** | Inspectable. Selecting a launch slides a window along one continuous falling market, the result interpolates, and the case context updates. Given a real value axis and time ticks. The `$70k` label renders verbatim, uncorrected and unannotated (VER-01). The rising Market Chart plate that sat beside the words "weak, risk-off market" is gone. |
| 06 | **Stack** | Explorable. Selecting a layer dims the unrelated ones, illuminates **only** the external entries that layer reaches, draws routes only for those, and shows that layer's inputs, outputs and detail. The 60px green bloom is replaced by a hairline plus restrained inner emission. |
| 07 | **Market** | A charted narrative. The curve **deforms** between the six steps rather than being replaced, and the left rail is also a ledger: each figure stays on screen once passed, so the case visibly accumulates. `90+` is no longer 8.5rem of solid green. |
| 08 | **Integration** | Demonstrates the claim. Each venue runs a six-stage connection sequence along a real drawn route, and **each completes faster than the last** — venue five in about a third of venue one's runway. QUARTERS vs DAYS is stated as a compact comparison. |
| 09 | **Lifecycle** | A travelling journey with terrain. One continuous climbing route; each stage's object, node and label are one assembly at the route's own elevation. Every stage materially changes the system: the lock arms, the beacon fires once, liquidity travels the route, depth develops beneath it, the field deepens. |
| 10 | **Control** | The centrepiece. Seven modules on one surface — Overview, Wallets, Programs, Execution, P/L, Analytics, Launches — and they are **operable**: wallet and program rows select and reveal detail; the execution stream arrives with scroll and each execution traces back to its own route; P/L switches DAY/MTD/YTD with the chart morphing; Analytics switches between four metrics on one visualisation; Launches shows lifecycle progression tied back to Scene 09. |
| 11 | **Revenue** | Five streams leave the same engine on routes that land on row centres, and all five feed **one pool labelled CAPITAL**. |
| 12 | **Compound** | Picks up that pool and runs it round the loop. Thin machined track, no glowing ring, labels outside the radius. |
| 13 | **Raise** | The `$1M` enters that same pool, and each allocation routes to a component the investor has already met by name. The raise scales a machine that is already running. |
| 14 | **Close** | Strips to two objects standing on the resolving signal. No instrument strip, no chrome. The opening rise, returned. |

---

## 3. THE ECONOMIC ACT

Scenes 11–13 were three unrelated diagrams. They are now one argument with a
physical handoff:

```
11  engine ──► five streams ──► ONE POOL  ─┐
                                  CAPITAL   │
12  CAPITAL ──► deployment ──► programs ──► performance ──► revenue ──┐
        ▲                                                             │
        └──────── more launch capacity ◄── more liquidity ◄───────────┘

13  $1M ──► INTO CAPITAL ──► liquidity · execution · routing · operators · control
```

`compound.loop[0]` is the single source for that node's name, so all three
scenes are literally referring to the same thing.

---

## 4. OBJECT CONTINUITY

The audit found the Execution Engine rendering at roughly 56px, 130px, 160px and
280px in four scenes — the same object reading as four unrelated images.

`SystemObject` now enforces one scale ladder: `chip · small · medium · large ·
hero`. `chip` is the smallest size at which a harvested plate is still legible as
an object; nothing smaller is offered. Arbitrary `ObjectPlate` widths are gone
from every scene.

---

## 5. COLOUR AND MATERIAL

Green is a signal, not a fill. Removed or replaced:

- the 140px solid-green donut (Visibility) → a graphite stacked allocation bar with one segment in signal
- the field of solid-green bars (Control wallets) → graphite bars, one highlighted
- `90+` at 8.5rem in pure `#00e060` (Market) → ink, with a green rule carrying the signal
- the heavy luminous compounding ring → a machined track with a thin arc, no filter, no bloom
- the `0 0 60px -22px` bloom on DRK CORE (Stack) → hairline plus inner emission
- `$150k` and `$40k+` both oversized green (Proof) → the client result in ink, DRK's own take in signal

Added: a machined **channel** the signal runs in — present before the liquidity
arrives, which is the DRK argument made material — with a chrome lip catching the
room light, and a travelling emission on a nine-second traverse. That pulse is
the only continuously-moving element in the experience, and it is doing
informational work.

`.drk-surface` replaces `.drk-glass` for the product: squarer corners, a real
edge, a top lip, and a shadow that seats it against the world. Software should
read as an instrument in the room, not a translucent marketing card.

---

## 6. TYPOGRAPHY AND COMPOSITION

- `SceneHead` and `.drk-lede` define the headline→lede relationship **once**. The
  audit found support paragraphs sitting flush against headlines in seven scenes,
  because a display headline at `leading < 1` visually eats the following margin.
- A short-desktop block (`min-width: 1024px and max-height: 850px`) tightens the
  minima of the vertical rhythm. `vh` inside `clamp()` cannot solve this alone
  because the clamp *minimum* still applies on a 768px frame.
- Revenue and Raise rows are equal-height flex rows with a shared min-height, not
  `grid-template-rows: repeat(n, 1fr)`. In an auto-height grid a `1fr` row
  resolves against the tallest item and is then applied to every row — which
  inflated the Revenue list past 1000px at 1366×768.
- Nothing truncates that is a business fact. Revenue stream names, the four core
  layers and venue names all wrap rather than ellipsing.
- `.drk-shell` reserves 13.75rem on the right at `lg+`, computed from the rail's
  actual geometry, so no scene can run underneath the navigation.


**Mobile is a recomposition, not a shrink.** Where nothing can drive a scroll-
driven rail — on a phone, and under `prefers-reduced-motion` — the scenes that
depend on one render everything instead:

| Scene | Desktop | Off-scrub |
|---|---|---|
| 04 Visibility | four modules on a rail | all four rendered in sequence |
| 10 Control | seven modules on a rail | all seven rendered in sequence |
| 03 Engine | two selectable configurations | both configurations in full |
| 09 Lifecycle | a travelling horizontal journey | a drawn vertical route |
| 12 Compound | a loop with radial labels | a loop plus the seven steps as a list |
| 01 Intro | objects standing on the world signal | the same five as a vertical stack |

This is a content-parity guarantee, not a nicety: without it a phone reader saw
one of seven Control Layer modules and never saw the Licensed Runtime business
at all.

---

## 7. ACCESSIBILITY

**Result: zero WCAG 2.1 A/AA violations at 1440×900 and 390×844**, audited with
axe-core in `prefers-reduced-motion` where every scene renders fully composed.

Three genuine defects were found and fixed:

1. **`--color-dim` was carrying text.** At 2.4:1 on the near-black ground it
   cannot legally carry a glyph. Every text use moved to `--color-faint` (4.9:1)
   across thirteen files; the token is now documented as non-text only.
2. **Opacity was being used to recede text.** Stack's unlinked venue names sat at
   1.55:1. They now recede through their *frame* — border, ground, connector node
   — and stay fully legible whichever layer is open, which is also better design.
3. **`<dl>` misuse.** Four grids wrapping `Readout` blocks were definition lists
   containing neither `<dt>` nor `<dd>`. They are plain grids.

Also: the module rail is a proper tablist with roving `tabIndex` and arrow-key
navigation; row and period controls are real buttons with `aria-pressed`; every
chart has an accessible name and its values are rendered as text nearby; state is
never signalled by green alone (weight, rule length, ticks and `aria-current`
carry it too); reduced motion disables pinning entirely with full content parity.

**Note on Lighthouse's Accessibility 97.** All 56 flagged nodes are *blended*
colours of elements that have not been revealed yet at scroll 0 — Lighthouse
measures the dimmed composite, not the element's real colour. The reduced-motion
axe run is the honest measurement.

---

## 8. PERFORMANCE

Lighthouse, desktop preset, against the production build:

| | |
|---|---|
| **Performance** | **99** |
| **Accessibility** | **97** (see §7) |
| **Best Practices** | **100** |
| SEO | 63 — deliberate: `robots: noindex` on a confidential deck |

| | |
|---|---|
| First Contentful Paint | 0.4 s |
| Largest Contentful Paint | 0.8 s |
| Total Blocking Time | 10 ms |
| Cumulative Layout Shift | 0.021 |
| Speed Index | 1.0 s |

First Load JS: **200 kB** for the deck route, 103 kB shared.

What keeps it there: the world's frame loop never re-renders React; scroll-driven
values are written through `style`, not through an animation library; ambient
loops pause when their scene is offscreen and when the tab is hidden; there is no
WebGL, no scroll-hijacking library, and no second animation system competing with
the first.

**Deliberate omissions, unchanged from the first build.** No GSAP/ScrollTrigger
(native `position: sticky` needs no pin-spacers, no refresh lifecycle, and cannot
strand a scene mid-state). No Lenis (it would break the trackpad and keyboard
contract for no gain here). No R3F/WebGL — the objects are the client's own
production renders, and re-modelling them in a live scene would replace real
assets with approximations while costing a canvas, shaders and a second animation
system. WebGL to look technically sophisticated is exactly what the brief forbids.

---

## 9. QA

All against the production build on an isolated `distDir`, so a running dev
server cannot corrupt it.

**Visual** — 205 screenshots at 1920×1080, 1440×900, 1366×768, 1024×768 and
390×844, in `.review/premium-final/`. Automated per-frame assertions: no console
errors, no page errors, **no clipping in any pinned stage**, no horizontal
overflow at any width. Every frame was inspected, not just the passing status.

> The clipping detector was corrected **twice** during this pass, and both
> corrections found real work.
>
> It originally measured `scrollHeight` alone. First problem: the decorative
> `.drk-scrim::before` overhangs its box and inflated that number, reporting
> clipping in scenes where not one pixel of content was clipped. The detector
> now neutralises the scrim before measuring, and the scrim's vertical bleed was
> bounded. Second problem — the more serious one: `scrollHeight` only reports
> overflow at the **bottom**. A `justify-center` band whose content is too tall
> overflows equally *upwards*, which is exactly how a headline ends up riding
> under the fixed wordmark. The detector now scans for upward overflow too, and
> immediately caught Scene 05 at 1366×768 breaking out of its stage in both
> directions.

### Defects found by inspecting the final screenshots

A dedicated visual review of all 205 frames, in persona, after the build was
otherwise "passing". Everything below was found by looking, not by a test:

| Where | Defect | Fix |
|---|---|---|
| Revenue @1024 | Three columns crushed the stream rows to ~90px: one word per line, and the model tag printed **through** the titles | Three columns only from `xl`; below that the engine and pool become a compact header and a footer bar |
| Control, Visibility @1024 | Narrative column + 7-module surface + nav rail do not fit side by side; program names truncated to `L…`, dollar figures cut mid-number | Below `xl` the scene stacks and the surface takes the full shell width |
| Control @1024 | The `ILLUSTRATIVE PRODUCT VISUALISATION` disclosure was clipped mid-word | It wraps; a compliance disclosure may never be truncated |
| Proof @1366 | The candle plot inflated a 140px chart to 515px and pushed the scene out of its stage in both directions | `Candles` is a fixed-height block again — a sweeping edit had made it a flex-growing chart like `LineSeries` |
| Raise, all sizes | The Latency Ring's wrapper kept a fixed box while the SVG scaled down inside it, so the ring drifted off-centre and its arc cut through `USE OF FUNDS` and `$1M` | The wrapper now sizes to the SVG |
| Engine, all sizes | The chain numbered 01, 02, 03, **05** — the engine *is* step 04 but never said so | The core is labelled `04` |
| Compound @390 | Radial node labels ran off both viewport edges (`IQUIDITY`, `MARKET P`) | Radial labels are a desktop device; mobile gets the seven steps as an ordered list under the ring |
| Opacity @390 | Output chips clipped at the right edge | Output column moves in on narrow frames |
| Integration @1024 | Venue names truncated to `A…`, `Ca…` | Names never truncate; the rule beside them takes the slack |
| Lifecycle @1920 | A half-rendered stage bled out from under the nav rail | Edge mask strengthened; band height raised so the frame is composed |
| Close | `close-050` and `close-095` were pixel-identical — the final impression stopped responding to scroll | Resolve ramp runs to the end of the runway; the signature settles late |
| Intro | The runtime readout showed `···` — a placeholder ellipsis on the first frame an investor sees | `STANDBY` |
| Control | `$3.72M` was stated twice and would **contradict itself** once the viewer switched to MTD or YTD | The switchable modules own their readout; the header does not restate it |

### Defects found by the adversarial review

A second pass in persona — institutional investor, product designer, creative
director, performance engineer, sceptical client — over all 205 final frames.
Everything below was a real defect it caught after the build was otherwise
passing every automated check:

| Where | Defect | Fix |
|---|---|---|
| Revenue @1366 | Three columns were gated at `xl` (1280), so 1366 still crushed the rows: names wrapping to three lines with the model tag colliding into them | Three columns only from `2xl` (1536) |
| Control, Visibility @1366 | The module body clipped its last table row **mid-glyph** — the fastest way to make a product surface look unable to contain its own content | The body is a scrollable, focusable, labelled region with a bottom fade. Fixed height is kept so switching modules never reflows |
| Revenue, Engine, Raise | Scene-entry frames rendered at ~0.18–0.22 opacity and read as a failed render rather than as a reveal | Opacity floors raised to 0.44–0.48 |
| **Control, Visibility @390** | The rail never advanced off-scrub, so a phone reader saw module 01 and **six of seven modules were unreachable** — the strongest evidence in the deck, invisible on a phone | A `stacked` surface renders every module in sequence whenever nothing can drive a rail (phone, reduced motion) |
| **Engine @390** | Licensed Runtime never rendered — the second business was invisible on a phone | Both configurations render in full off-scrub |
| Control @390 | The tab rail scrolled horizontally and sheared its last tab at the viewport edge | The rail wraps to two rows |
| Compound @1366 | The world signal's curl crossed a readable body line | Curl moved into the bottom band |
| Close @390 | The beacon rendered two scale steps below the wave, so the closing pair read as unrelated assets | One shared scale, one ground plane |
| Engine @390 | Reading order ran 04 → 01 → 02 → 03 → 05, because the engine was hoisted with `order-first` | No order override; source order is correct in both layouts |
| Everywhere | `Spark` and `Candles` inherited a flex-growing wrapper from a sweeping edit to `LineSeries`, inflating a 44px sparkline to 230px and a 140px candle plot to 515px | Chart growth is opt-in (`fill`), never implicit |

**Interaction** — 32/32 checks pass: slam-to-bottom, slam-to-top, 40 fast wheel
steps, slow full-page scroll, hash state, deep link, mid-page reload,
back/forward, keyboard nav, focus ring, repeated resize while pinned, touch, and
every new interaction (engine mode, stack layer, proof launch, visibility rail,
control module + wallet row + P/L window, manual-selection release, keyboard rail)
plus explicit assertions that **no internal verification material appears in the
deck**, that **all seven Control Layer modules render on a phone**, and that
**both businesses render on a phone**.

**Types / build** — `tsc --noEmit` clean; `next build` clean.

---

## 10. PRODUCTION HYGIENE

The ten-item content-verification register no longer ships. It lives in:

- `docs/DRK_CONTENT_VERIFICATION.md` — the permanent record
- `content/drk.ts` → `contentVerifyTodos` — machine-readable, unchanged
- `/internal/verification` — **development only**; `notFound()` in production

Verified: the production page returns no `TODO_CONTENT_VERIFY`, no `VER-0n`, no
register heading, and the internal route returns 404.

---

## 11. FACTUAL INTEGRITY

Nothing in this pass changed the investment case.

- No client, partner, integration, valuation, split, performance figure, market
  statistic or date was invented, refreshed or re-dated.
- `$70k CLIENT PROFIT` renders exactly as the source prints it, in both Proof and
  the Control Layer's Launches module. **VER-01 remains open.**
- Mixed market-data vintages (Apr 2025 vs May 2024) are preserved and their
  sources render at readable size. **VER-02 / VER-03 remain open.**
- Every interface value is labelled `ILLUSTRATIVE PRODUCT VISUALISATION` and each
  Control Layer module carries the source capability line it is derived from.
- Chart *shapes* added in this pass (Market's six curves, the Control Layer's
  series) carry no data and assert nothing; each is captioned as illustrative, in
  the language the content file already established.
- Chains and venues stay typographic. No third-party logo is reproduced and
  nothing is described as a partnership. **VER-06 remains open.**
- New Control Layer detail — wallet allocations, program states, the execution
  stream, P/L attribution, analytics metrics — expresses only capabilities the
  deck already states (p4, p5, p7, p9, p10). Venue names are restricted to those
  the deck itself names.

---

## 12. REMAINING WORK

**Factual — for the client.** The ten items in
`docs/DRK_CONTENT_VERIFICATION.md`. VER-01, VER-02, VER-03, VER-05 and VER-06
gate external release.

**Technical debt, non-critical.**

1. The `large` step of the object ladder is only fully realised at ≥1440. Scene
   09 caps its objects at 35% of the journey band to guarantee no clipping at
   1024×768, so they render below nominal there. Deliberate, but it means the
   ladder is not literally uniform at every width.
2. `signalYAt` interpolates linearly between control points rather than solving
   the rendered bezier. The error is well under half a percent of viewport
   height at these tensions and no scene registers objects during a scene whose
   keyframe doubles back, but a scene that did would need the exact solve.
3. Scene 08 has no interactive controls — it is a demonstration, and a toggle
   would fight the scroll-derived state contract. Keyboard-operable controls sit
   in Scene 07 instead.
4. `.drk-scrim` bleeds horizontally by 6rem. Inside a pinned stage that is
   clipped as intended, but a future non-pinned use would need checking.
5. `next.config.ts` gained `distDir: process.env.DRK_DIST_DIR || ".next"` so QA
   can build while the dev server runs. Harmless, but it is a QA affordance in
   production config.
