# DRK — BUILD REPORT & ACCEPTANCE  *(version 1)*

> **Superseded in part.** This documents the first working build. The
> experience has since been through a premium refinement pass that rebuilt the
> scene architecture around a single persistent world layer and rebuilt every
> scene on top of it. For the current architecture, measurements and open items,
> read **`PREMIUM_REFINEMENT_AUDIT.md`** and **`PREMIUM_REFINEMENT_REPORT.md`**
> first; this file remains accurate on the source audit, the asset strategy and
> the factual-integrity rules, all of which are unchanged.

Companion to `DRK_SOURCE_AUDIT.md`, `DRK_ASSET_MANIFEST.md` and
`DRK_INTERACTIVE_DECK_SPEC.md`.

---

## 1. WHAT WAS BUILT

`C:\Users\rtayl\Desktop\drk\interactive-deck` — Next.js 15 / React 19 / TypeScript / Tailwind v4 / Motion 12.
Fourteen scenes, one continuous scroll narrative, no slide frame anywhere.

| # | Scene | Model |
|---|-------|-------|
| 01 | Intro | Pinned system activation: darkness → signal → Beacon → Wallets → Wave → Engine → Reporting → routes connect → labels resolve |
| 02 | Opacity | Vault performs opacity: value in → doors close → outputs unknown → inverts to visible |
| 03 | Engine | One engine revealed alone, then branches into Managed Trading / Licensed Runtime |
| 04 | Visibility | Real product surface; four modules sequence, charts draw |
| 05 | Proof | Launch selector, market-condition chart, DRK economics |
| 06 | Stack | Architecture explorer built progressively: environment → routes → core → output |
| 07 | Market | Six-step causal progression, not six identical cards |
| 08 | Integration | Networks detect → route forms → engine links → active, each faster than the last |
| 09 | Lifecycle | Horizontal luminous rail (desktop) / vertical rail (mobile), five objects |
| 10 | **Control layer** | **The centrepiece.** Six modules in one operating surface, scroll-driven + clickable |
| 11 | Revenue | The same Execution Engine fans out to five revenue streams |
| 12 | Compound | The economic loop assembled, bridging into the raise |
| 13 | Raise | $1M → five allocations, each wired to a component already introduced |
| 14 | Close | The Scene-01 route resolves; the loop closes |

Plus an internal **content-verification register** after the close — visually separated, collapsed by
default, carrying all ten `TODO_CONTENT_VERIFY` items so they travel with the artefact.

---

## 2. MEASURED RESULTS

### 2.1 Lighthouse — production build, desktop preset

| Category | Score | Target |
|----------|-------|--------|
| Performance | **100** | ≥ 85 |
| Accessibility | **97** | ≥ 90 |
| Best Practices | **100** | ≥ 90 |

The three accessibility points are a **measurement artefact, not a defect**. Lighthouse audits one static
snapshot at scroll position 0; every scene further down the page is legitimately dimmed because it has not
been reached yet, so the audit measures the *blended* colour of an unrevealed element. All 41 flagged nodes
were of this class (e.g. `#101417` = signal green at 16% opacity). This was verified rather than assumed —
see §2.2.

### 2.2 axe-core — WCAG 2.1 A/AA, fully composed

Run in `prefers-reduced-motion: reduce`, where every scene renders complete and nothing is mid-reveal — the
only honest way to audit a scroll-driven page.

```
1440x900  passes: 31   violations: 0
390x844   passes: 32   violations: 0
No WCAG A/AA violations.
```

Three real defects were found this way and fixed:

1. **Contrast floor.** `--color-faint` measured 4.37:1 on `--color-panel-2`. Raised to `#838b91` (≈4.9:1).
   A separate `--color-fineprint` (`#7d858b`, ≈4.6:1) was introduced for disclaimers, source notes and
   provenance lines, which had been using a decorative-only grey — directly relevant to the brief's rule
   that sources must stay legible.
2. **List semantics.** A reveal wrapper sat between `<ol>` and `<li>`. Fixed via `Reveal as="li"`.
3. **Keyboard access.** The control-layer table's horizontal scroll region was not focusable. Given
   `tabIndex`, `role="region"` and a label.

### 2.3 Interaction QA — 21/21

```
PASS  no blank scene — after slam to bottom / to top
PASS  no blank scene — after 40 fast wheel steps
PASS  no blank scene — after slow full-page scroll
PASS  hash reflects active section
PASS  deep link #control lands on the scene
PASS  no blank scene — after mid-page reload
PASS  no blank scene — after back/forward
PASS  nav reachable by keyboard
PASS  arrow keys move between nav items
PASS  Enter jumps to the section
PASS  focus ring is defined
PASS  no blank scene — after repeated resize
PASS  no horizontal overflow after resize
PASS  control module responds to touch
PASS  touch targets >= 32px tall
PASS  no horizontal overflow (mobile)
PASS  no console or page errors (desktop + mobile)
```

### 2.4 Visual QA — 392 screenshots inspected

`.review/desktop/{1920x1080,1440x900,1366x768,1024x768}` · `.review/mobile/390x844` ·
plus `-reduced` variants at 1440×900 and 390×844.

Every major scene at 2–6 scroll positions each, including sticky mid-states, open product modules, proof,
raise and the final frame. Automated assertions on every capture: no console error, no page error, no
horizontal overflow, and **no pinned stage whose content overflows it**.

---

## 3. DEFECTS FOUND BY QA AND FIXED

Screenshots were inspected, not assumed. The significant finds:

| Defect | Cause | Fix |
|--------|-------|-----|
| Scene progress never updated | `useSceneProgress` ref was never attached to the scene element | `Scene` accepts `sceneRef` |
| Hydration mismatch | `Math.cos/sin` precision differs between Node and Chromium | Round all trig-derived SVG coordinates; `smoothPath` emits fixed 3dp |
| Route + line charts revealed with tearing | `pathLength` + `strokeDashoffset` is unreliable under `preserveAspectRatio="none"` | Reveal via `clipPath` rect instead |
| Chart head marker rendered as a stretched ellipse | Non-uniform viewBox scaling | Replaced with a vertical leading-edge rule |
| Route objects wildly oversized | `height: %` resolved against an auto-height parent | `container-type: size` + `cqh` units |
| Content ran under the fixed nav rail | No reserved gutter | Global `padding-right` on `.drk-shell` at `lg`, plus edge masking on the lifecycle rail |
| Utility classes could not override `.drk-label` colour | Custom classes outranked Tailwind utilities | Moved custom classes into `@layer components` |
| Reveals lagged behind the scroll | Scroll-derived values driven through `animate` + `transition` | Scroll-derived values applied via `style` |
| Lifecycle read as a slideshow | Each stage occupied a full viewport width | Stages at 32vw so ~3 are visible; it reads as a rail |
| Compound rows overlapped the paragraph below | Downward `translateY` on a still-visible dimmed row | Opacity-only reveal |
| Architecture labels truncated at 1024 | Three columns inside a two-column layout | Side-by-side only from `xl`; truncation removed |
| **8 scenes clipped on mobile** | Pinned `h-screen` stages holding desktop-height content | **Mobile does not pin at all** — see §4 |
| Reduced motion clipped and mismatched | Pinning still active; reduced-motion state differed between server and client | Pinning disabled entirely under reduced motion; the signal is held until after mount |
| Close frame showed a crop rectangle | The p15 Beacon harvest carries ambient smoke that reads as a box at scale | Switched to the isolated p10 Beacon plate; objects reduced and repositioned |
| Deep links took many seconds to land | Global `scroll-behavior: smooth` across a ~40,000px document | Removed globally; nav smooths short hops only, jumps instantly for long ones |
| Missing favicon → console 404 | — | `app/icon.svg` |

---

## 4. MOBILE IS RECOMPOSED, NOT SHRUNK

The clipping check found eight scenes overflowing their pinned stage at 390×844. The fix was structural
rather than cosmetic:

- **Pinning is a desktop concept.** Below `lg`, `Scene` drops its scroll runway (`min-h-screen` only) and
  `SceneStage` becomes an ordinary block. Nothing can clip because nothing is height-constrained.
- **`useSceneNarrative` is the single contract.** Desktop with motion allowed → `p` scrubs 0..1. Mobile or
  reduced motion → `p` is 1 and the scene renders fully composed, with entrance handled by in-view reveals.
- **Sequencer scenes get real mobile layouts.** Visibility becomes four stacked product modules; Market
  becomes six stacked cards carrying every figure *and* every source; Lifecycle becomes a vertical rail;
  the Control layer keeps its tabbed surface, which already suits touch.

Nothing is dropped for the phone. Every figure, source, disclaimer and verification note is present at
390px.

---

## 5. STACK DECISIONS WORTH KNOWING

- **No GSAP/ScrollTrigger.** Scenes derive their composition from a scroll *ratio* via `position: sticky` +
  Motion's `useScroll`. Because state is derived rather than accumulated, "fast scrolling must never break
  animation state" and "no section may depend on a previous animation finishing" are satisfied structurally.
  The interaction QA proves it: 40 rapid wheel slams, mid-page reload and back/forward all leave every scene
  valid.
- **No Lenis.** Interpolated scroll adds latency on Windows trackpads, complicates reduced motion, and fights
  keyboard paging. Native scrolling is more predictable and more accessible.
- **No WebGL.** The object language is physically-rendered stills the client already owns; the information
  layer is routes, diagrams, charts and a product UI, all of which SVG/DOM renders sharper, lighter and
  accessibly. Adding R3F would have bought the appearance of sophistication at the cost of comprehension —
  which is precisely what the brief prohibits.

---

## 6. FACTUAL INTEGRITY

- Every figure, claim, label and source is transcribed from `Pitch deck.pdf` and lives in `content/drk.ts`.
  No component hardcodes a business fact.
- **Nothing was invented**: no clients, partners, integrations, performance, audited results, financial
  figures, exchange relationships, product capabilities, market statistics, customer names, dates or revenue
  claims.
- **Nothing was silently corrected.** Ten `TODO_CONTENT_VERIFY` items are flagged in `content/drk.ts`,
  `DRK_SOURCE_AUDIT.md` §4, and the in-page register — including the specific `$70k CLIENT PROFIT` label the
  brief called out, and the mixed April-2025 / May-2024 market-data vintages.
- Page-5 interface values carry a visible `ILLUSTRATIVE PRODUCT VISUALISATION` label wherever they appear,
  because the deck never establishes them as verified client figures (VER-05).
- Third-party marks are **not** reproduced. Chains and venues render typographically under labels stating
  compatibility, because the deck's own copy establishes compatibility rather than partnership (VER-06).
- The deck states no valuation, so none is stated or derived, and the five uses of funds are presented
  unweighted because the source gives no split (VER-09).
- The compounding scene carries an explicit guard that it describes operating capacity, **not** investment
  return.

**Supplied originals are unmodified.** `Pitch deck.pdf` (2,916,727 B), `asset.jpg` (111,434 B) and
`asset 2.jpg` (125,267 B) were verified byte-identical after every generation pass.

---

## 7. ACCEPTANCE CHECKLIST (§35)

- [x] The supplied DRK PDF remains the factual source of truth
- [x] The two brand-reference images clearly inform the resulting visual language
- [x] The experience no longer feels like PowerPoint
- [x] Does not look like a generic SaaS website
- [x] Does not look like a generic crypto website
- [x] Does not copy Pepay × Virtuals visually
- [x] Comparable level of interaction and narrative sophistication
- [x] Scroll creates one coherent story
- [x] Major DRK objects persist between scenes (continuity encoded in `objectSystem[].recurs`)
- [x] The product/control layer feels credible
- [x] The opacity problem is immediately understandable
- [x] One engine / two businesses is immediately understandable
- [x] Managed trading versus licensed runtime is clear
- [x] Product visibility is demonstrated visually
- [x] Proof is presented as evidence rather than decoration
- [x] "Own the stack" is shown architecturally
- [x] Market growth has clear logic rather than six random statistics
- [x] Integration speed is demonstrated through motion
- [x] The launch lifecycle feels like one flowing system
- [x] **No platform-demo placeholder remains**
- [x] Revenue mechanics are understandable
- [x] Compounding explains why additional capital matters
- [x] The $1M for 10% raise feels like scaling an existing operating system
- [x] Sources remain legible (`--color-fineprint`, ≥4.5:1, verified by axe)
- [x] No unsupported facts were invented
- [x] Desktop feels cinematic
- [x] Mobile feels intentionally designed
- [x] Reduced motion works (no pinning, full content parity, 0 violations)
- [x] Final screenshots were visually reviewed
- [x] Performance is acceptable (Lighthouse 100)

---

## 8. RUNNING IT

```bash
cd interactive-deck
npm install
npm run dev              # http://localhost:3000

npm run build && npm start

npm run qa               # 280 screenshots across 5 viewports -> ../.review
npm run qa:reduced       # reduced-motion captures
npm run qa:a11y          # axe-core, WCAG 2.1 A/AA, fully composed
npm run qa:interaction   # scroll, keyboard, touch, hash, reload, resize
```

QA scripts read `DRK_URL` (default `http://localhost:3111`); point it at the production server to audit the
real build:

```bash
DRK_URL=http://localhost:3112 npm run qa
```

Object plates can be regenerated from the PDF at any DPI with
`python scripts/harvest-objects.py` — it reads only `Pitch deck.pdf` and writes only to
`public/brand/objects/`.

---

## 9. OPEN ITEMS FOR THE CLIENT

1. **Resolve the ten `TODO_CONTENT_VERIFY` items** — especially `VER-01` (the `$70k` label) and
   `VER-02`/`VER-03` (market-data vintages). These are the only things standing between this build and a
   production release.
2. **Confirm the provenance of the page-5 interface values** (`VER-05`). If attestable, the illustrative
   label can be removed and the control layer stops being hedged.
3. **Confirm chain/venue relationships and trademark permissions** (`VER-06`) before any third-party logo is
   reinstated.
4. **Brand-system note:** the brand board's green (≈121°) and the deck's green (≈145°) are different
   colours. The deck's is used as primary because it is the dominant usage; the board's is retained for
   object emission. Worth reconciling in the brand system.
