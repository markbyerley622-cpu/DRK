# DRK — INTERACTIVE DECK SPEC

**Scope:** transform the 15-page DRK investor PDF into a scroll-driven walkthrough of the DRK market-making
operating system. **Keep the content. Rebuild the delivery.**

**Governing rule:** `Pitch deck.pdf` is the factual source of truth; `asset 2.jpg` is the visual source of
truth. Nothing about the company, model, terminology or figures is redesigned. See `DRK_SOURCE_AUDIT.md`.

---

## 1. THE TRANSFORMATION

| | |
|---|---|
| **From** | A premium static PDF *explaining* DRK. |
| **To** | A living, scroll-driven walkthrough of the DRK market-making operating system. |

**Target feel:** institutional · premium · dark · precise · engineered · financial · mechanical · controlled ·
liquid · serious · technical · credible.

**Explicitly not:** cyberpunk · casino · memecoin · gaming · Matrix · generic Web3 · generic SaaS · neon
overload · NFT landing page · template-driven · sci-fi dashboard.

**Acceptance question (§36 of the brief):** *"Does this feel like somebody opened a pitch deck, or does it
feel like somebody opened DRK?"* Every decision below is answerable against that.

---

## 2. WHAT THE BENCHMARK TAUGHT US

`virtualsxpepay-product.vercel.app` was reviewed for **interaction model and presentation quality only**.
Nothing was copied — not branding, layout, components, colour, illustration or animation.

Principles carried across:

1. It **behaves like a product**, not a slide viewer.
2. Scroll drives narrative; the page is one continuous argument.
3. Complex concepts are **progressively disclosed** — pinned scenes reveal in internal steps.
4. Every major claim is immediately followed by **visual proof on the same screen**.
5. Visual systems **persist** — the same primitives recur, so information compounds instead of resetting.
6. Large declarative statements **alternate** with dense product detail.
7. System architecture is made understandable **through motion**, not through a legend.
8. In-page product surfaces make the software feel real.
9. A **compounding-loop** section does the intellectual work of bridging product → commercial ask.
10. A thin, persistent progress rail keeps the viewer oriented without a website navbar.

Deliberately *not* carried across: its blue palette, its layer-status badge system, its card geometry, its
logo lockups, its illustration style, its scroll-jacking.

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | Per brief. Server-rendered HTML keeps text real and indexable. |
| Styling | **Tailwind CSS v4** with a CSS-first `@theme` token block | Tokens live in one place with documented provenance. |
| Component motion | **Motion (`motion/react`) 12** | `useScroll` / `useTransform` / `useInView`, GPU-friendly transforms. |
| Scroll choreography | **CSS `position: sticky` + `useScroll`** | See §3.2. |
| Diagrams / charts | **Hand-built SVG** | Sharp at every DPI, accessible, tiny, animatable via `stroke-dashoffset` / masks. |
| 3D | **None at runtime** | See §3.3. |
| Images | `next/image`, AVIF/WebP | Object plates only. |

### 3.1a The persistent world (added in the premium refinement pass)

The single largest architectural change since this spec was first written. Scenes
no longer own their backgrounds; one fixed layer beneath the whole document owns
the ground, the light and the liquidity signal.

```
WorldProvider  (hooks/useWorld.tsx)
  ├─ frame channel   rAF, continuous narrative time t ∈ [0, sections-1]
  │                  consumers write straight to the DOM — no React render
  └─ state channel   active scene + total progress only
DrkWorld       (components/world/DrkWorld.tsx)   fixed · z-0 · pointer-events:none
  ├─ ground          one two-scale engineered grid
  ├─ light           one radial that TRAVELS with the narrative
  └─ signal          one path, morphed between 14 keyframes in lib/world.ts
SignalStations (components/world/SignalStations.tsx)
                     objects registered against the signal, riding it as it morphs
main           z-1   the fourteen scenes, composing on top
```

Narrative time eases so the signal **holds** a scene's shape for the first 58% of
its runway and transforms across the boundary. That is what makes scene
transitions transformations rather than fades, and what lets a scene stand
objects on a stable line.

Rendering layers are assigned by fitness, not by fashion: **HTML/CSS** for all
text, UI and product surfaces; **SVG** for routes, diagrams, charts and the
signal; **harvested plates** for the physical objects; **Motion** for UI
transitions and presence only. See §3.3 for why nothing is WebGL.

### 3.2 Decision: no GSAP/ScrollTrigger, no Lenis

The brief permits GSAP *"only when required for advanced pinned-scroll choreography"* and Lenis *"only if it
genuinely improves the scroll experience."* Neither clears that bar here, and both actively hurt two hard
requirements.

- **Pinning** is achieved with native `position: sticky` inside a tall parent, with progress read via
  Motion's `useScroll({ target, offset })`. This is *derived* state — the scene renders from a scroll ratio
  rather than from an animation timeline that has to be kept in sync. Consequences that matter:
  **"Fast scrolling must never break animation state"** and **"No section may depend on a previous animation
  finishing correctly"** are satisfied structurally, not by defensive coding. Scrub to any position, reload
  mid-page, hit Back — every scene renders the state its scroll ratio implies.
- **ScrollTrigger pinning** would introduce transform-based pin-spacers, a refresh lifecycle, and known
  interactions with `overflow-x` clipping — all cost, no comprehension gained.
- **Lenis** interpolates scroll position, which adds perceived latency on Windows trackpads, complicates
  `prefers-reduced-motion`, and fights native keyboard paging. Native scrolling is more predictable and more
  accessible.

Both remain drop-in if a future scene genuinely needs them. Documented so the omission reads as a decision.

### 3.3 Decision: no WebGL

The brief: *"Do NOT use WebGL simply to appear technically sophisticated… Do not use a 20MB WebGL scene for
something an SVG can explain better."*

Nothing in this narrative requires a real-time renderer. The object language is **physically-rendered stills**
(already produced by the client, harvested per `DRK_ASSET_MANIFEST.md` §2) and the information layer is
routes, diagrams, charts and a product UI — all of which SVG/DOM renders sharper, lighter, accessibly, and
without a 3D runtime. Adding R3F would trade real comprehension for the appearance of sophistication.

### 3.4 Directory layout

```
interactive-deck/
  app/                layout.tsx · page.tsx · globals.css (design tokens)
  components/
    deck/             DeckNav · ProgressRail · SkipLink · VerifyNotes
    sections/         14 scene components, one per narrative beat
    motion/           Reveal · StaggerGroup · CountUp · DrawPath
    ui/               Headline · SectionLabel · Metric · GlassPanel
                      SourceRef · StatusDot · Tooltip · DataNode · Illustrative
    visuals/          LatencyRing · RuntimeRoute · EngineSplit · StackExplorer
                      IntegrationRoute · LifecycleRail · RevenueFan
                      CompoundLoop · RaiseSystem · charts/*
    product/          ControlLayer · ModuleRail · WalletsView · ProgramsView
                      ExecutionView · PLView · AnalyticsView · LaunchesView
  content/drk.ts      ALL business facts. Nothing factual outside this file.
  hooks/              useSceneProgress · useActiveSection · usePrefersReducedMotion
  lib/                format · cn · scene geometry helpers
  public/brand/       objects/ (20 harvested plates)
  scripts/            harvest-objects.py · visual-qa.mjs
docs/                 audit · asset manifest · this spec
.review/              Playwright output: desktop/ · mobile/
```

**Rule enforced by review:** no component may hardcode a business fact. Everything imports from
`content/drk.ts`.

---

## 4. SCENE ARCHITECTURE — 14 BEATS

Presented as one continuous document. **Never as slides**: no deck frame, no arrows, no carousel, no
page-turn. Heights are chosen so sticky scenes have room to disclose, and static beats do not waste scroll.

| # | Id | Height | Model | Persistent objects |
|---|----|--------|-------|--------------------|
| 01 | `intro` | 320vh | Sticky, 9-step activation | Beacon → Wallet → Wave → Engine → Nodes |
| 02 | `opacity` | 260vh | Sticky, vault I/O → doors close → invert | Liquidity Vault |
| 03 | `engine` | 240vh | Sticky, one engine → branch to two | Execution Engine, Latency Ring |
| 04 | `visibility` | 300vh | Sticky, 4-module product sequence | (product surfaces) |
| 05 | `proof` | 130vh | Launch selector + condition chart | Market Chart, falling chart |
| 06 | `stack` | 260vh | Sticky architecture explorer | Engine, Routing, Shield, Nodes |
| 07 | `market` | 220vh | Sticky 6-step causal progression | — |
| 08 | `integration` | 220vh | Sticky, network detect → route → active | Routing Path, Beacon, Nodes, Engine |
| 09 | `lifecycle` | 320vh | Sticky horizontal rail (desktop) / vertical (mobile) | Lock, Beacon, Wave, Chart, Depth |
| 10 | `control` | 380vh | **Centrepiece.** Sticky OS, 6 modules, auto + manual | — |
| 11 | `revenue` | 260vh | Sticky engine → 5 revenue paths → zoom out | Execution Engine |
| 12 | `compound` | 260vh | Sticky economic loop assembly | Market Chart, Wave, Depth |
| 13 | `raise` | 260vh | Sticky $1M → 5 allocations → system targets | Engine, Wave, raise props |
| 14 | `close` | 130vh | Loop resolution | Beacon, Wave, Engine, Nodes |

### 4.1 Object continuity contract

The objects are **recurring characters in one system**, encoded in `objectSystem[].recurs` in
`content/drk.ts` so continuity is data, not discipline:

- **Execution Engine** — introduced in 01, powers execution (03, 06, 08), revenue (11), raise deployment (13),
  resolves in 14.
- **Liquidity Wave** — architecture (03), lifecycle (09), capital deployment (12, 13), closing scene (14).
- **Security Lock** — opacity/permissions (03), lifecycle pre-launch (09), wallet controls (10).
- **Market Chart** — proof (05), lifecycle (09), market growth (07), compounding (12).
- **Network Nodes** — reporting (01), integrations (08), infrastructure (06), routing (03).

**Prohibited:** inventing a new visual metaphor where a DRK object already represents the idea; giving any
section unrelated art direction.

### 4.2 Scene detail

**01 INTRO — system activation.** Opens near-black: wordmark, `DARK MARKET MAKERS`, one signal. Then a single
continuous sequence — darkness → signal → Beacon → wallet layer → Liquidity Wave → Engine online → Reporting
node → paths connect → labels resolve `WALLETS / LIQUIDITY / EXECUTION / REPORTING`. Resolves on *"We turn
token launches into visible trading programs."* Investor takeaway: **DRK is an operating layer.**

**02 OPACITY — *"Legacy market making is built on opacity."*** Vault centred. Four identified inputs
(ETH/USD/SOL/TOKEN) flow in; doors close; the four problems land as the system seals; outputs resolve to four
`?`. Then inverts: same inputs, every output visible and attributed. The interaction *physically*
communicates opacity — not four bullets beside a static safe.

**03 ENGINE — *"One proprietary engine. Two scalable businesses."*** One engine first, alone. Then it
branches: `01 MANAGED TRADING` (performance-linked) and `02 LICENSED RUNTIME` (recurring). Pillars reveal per
branch. Conclusion: **PERFORMANCE REVENUE TODAY. RECURRING REVENUE AT SCALE.** Never opens on two cards.

**04 VISIBILITY — *"Clients see what black-box MMs hide."*** Leaves metaphor for real product surface.
Sequence `wallets → inventory → execution → P/L`; charts draw progressively; metrics interpolate; hover
reveals context. Carries the `ILLUSTRATIVE PRODUCT VISUALISATION` label (VER-05).

**05 PROOF.** Compact case-study evidence. `LAUNCH 01` / `LAUNCH 02` selector — **no fabricated client
names**. Market-condition line retains the falling-chart idea. Shows result, DRK economics, timeline. Takeaway:
**DRK produced outcomes in a weak environment.** No exaggeration beyond the supplied evidence. `$70k` label
rendered exactly as supplied and flagged (VER-01).

**06 STACK — *"Other firms rent tools. We own the stack."*** Interactive architecture explorer, built
progressively: external system appears → route activates → DRK core module activates → execution passes
through → output resolves (`TRUST. PERFORMANCE. RESULTS.`). Communicates vertical integration.

**07 MARKET.** Not six identical cards. A six-step causal progression: capital moves onchain → volume follows
→ markets fragment → liquidity complexity rises → institutional requirements arrive → infrastructure demand
increases. Oversized data, motion, **legible sources** (never microscopic grey). Supplied data is neither
updated nor replaced; vintage flagged separately (VER-02/03).

**08 INTEGRATION.** Motion *is* the argument: network appears → DRK detects → routing path forms → engine
connects → network active. Chains/venues typographic only (VER-06).

**09 LIFECYCLE.** Long scroll. Desktop: persistent horizontal luminous rail, view follows the liquidity route,
each stage revealing one object (Lock → Beacon → Wave → Chart → Depth). Mobile: recomposed as a vertical rail.
Feels like capital moving through a launch.

**10 CONTROL LAYER — the centrepiece.** Replaces the source placeholder entirely. Six modules (Wallets,
Programs, Execution, P/L, Analytics, Launches) inside **one coherent operating interface** — one chrome, one
grid, one type system, persistent state. Scroll explores them sequentially; desktop can click/hover to inspect
manually. Built only from capabilities the deck already states (enumerated in `content/drk.ts`). Must not
resemble Binance, Coinbase, a Bloomberg clone, a generic admin dashboard, a SaaS template or an exchange
terminal — it is designed from the same material logic as the 3D objects: graphite, precision, dark glass,
clean data, signal green, high control, institutional spacing. Viewer leaves believing **DRK has a real
operating layer.**

**11 REVENUE.** Reuses the *same* Execution Engine from 03. Engine activates → paths 01…05 appear in turn →
zoom out to the complete structure. Managed trading today + software economics later = multiple monetisation
layers on one engine.

**12 COMPOUND.** Builds the economic loop: capital → deployment → programs → performance → revenue → more
liquidity → more launch capacity → capital. This is the intellectual bridge into the raise. Carries an
explicit guard: describes operating capacity, **not** guaranteed investment returns.

**13 RAISE.** Starts at `$1M`. Each allocation activates and connects to a component already introduced —
liquidity→Liquidity Engine, infra→Execution Engine, integrations→Routing Layer, operators→Managed Trading,
reporting→Control Layer. Message: **capital scales the machine.** No valuation stated or derived; no
allocation percentages invented (VER-09).

**14 CLOSE.** *"The next market maker is not a black box."* Returns to the opening language with a small
number of objects (Beacon, Wave, Engine, Nodes). The path introduced in 01 resolves here. Uncluttered.
Signature: `LIQUIDITY BENEATH THE SURFACE.`

---

## 5. NAVIGATION

Persistent, subtle, reading as **system telemetry** — not a website navbar.

- **Desktop:** fixed left rail, 14 entries (`INTRO … RAISE`, `CLOSE`), each `NN` + label. Active section
  illuminates in DRK green with a Latency-Ring style progress arc; a thin total-progress line runs the rail's
  full height.
- **Mobile / tablet:** collapses to a slim top bar — current section label, index `NN / 14`, and a hairline
  total-progress fill. No hamburger, no overlay menu.
- **Interaction:** click to jump · full keyboard operation (Tab/Enter, arrows move between sections) ·
  visible focus · hash state (`#lifecycle`) written on section change and honoured on load.
- **Reduced motion:** progress still updates; transitions are instant.
- Colour is never the *only* signal for the active state — it also carries a weight change, an index marker
  and `aria-current="true"`.

---

## 6. MOTION LANGUAGE

Every animation must communicate something. Motion is **informational**, never decorative.

**Vocabulary used:** path drawing · mask reveals · system activation · controlled parallax · object activation
· data interpolation · camera translation · diagram construction · progressive focus · sticky-scroll
transitions · lighting state change.

**Banned:** bounce · elastic · constant idle floating · gratuitous spinning · excessive mouse-following ·
fake terminal typing · random particles · cursor gimmicks · any animation with no informational role.

**Timing bands**

| Band | Duration |
|------|----------|
| Micro interaction | 150–300 ms |
| UI state | 250–500 ms |
| Section reveal | 500–900 ms |
| Large scene transition | 800–1400 ms |

Easing: `cubic-bezier(.22,.61,.36,1)` standard; `cubic-bezier(.16,1,.3,1)` for large reveals. No overshoot
anywhere.

**Robustness (hard requirements).** Scene state is derived from scroll ratio, never from timeline completion.
Fast scrolling cannot break state. No scene depends on a previous animation completing. Nothing traps the
user. Ambient loops pause when their scene leaves the viewport (`data-offscreen`).

**Reduced motion.** Content parity is absolute: every element that animates in is fully present and legible
with motion suppressed. Sticky scenes degrade to fully-revealed static compositions — never a blank pin.

---

## 7. TYPOGRAPHY

Retain the deck's oversized headline energy. Modern institutional grotesk. **No small SaaS typography.**

| Role | Family / weight | Size |
|------|-----------------|------|
| Scene display | Inter Tight 600 | `clamp(2.6rem, 7.2vw, 6.6rem)` |
| Scene H1 | Inter Tight 600 | `clamp(2.2rem, 5.4vw, 5rem)` |
| Sub-head | Inter Tight 500 | `clamp(1.75rem, 3.6vw, 3.25rem)` |
| Lead | Inter 400 | `clamp(1rem, 1.35vw, 1.3rem)` |
| Body | Inter 400 | `clamp(.94rem, 1.05vw, 1.06rem)` |
| Technical label | JetBrains Mono 500, `.18em` tracking, uppercase | `clamp(.69rem, .72vw, .78rem)` |
| Metric | Inter Tight 600, `tabular-nums` | `clamp(2rem, 4.4vw, 4rem)` |

Headline tracking `-0.028em`, leading `0.98`. Line breaks are **authored**, not left to the browser
(`text-wrap: balance` plus explicit breaks) — no awkward one-word final lines. Reference energy:

```
LEGACY MARKET MAKING        ONE PROPRIETARY ENGINE.       CLIENTS SEE
IS BUILT ON                 TWO SCALABLE BUSINESSES.      WHAT BLACK-BOX
OPACITY.                                                  MMS HIDE.
```

Green is applied to **one word or one clause** per headline — the thesis word — never a whole heading.

---

## 8. UI SYSTEM

Reusable primitives: section labels · metric displays · chart containers · source references · tooltips ·
data nodes · glass panels · route diagrams · status states · progress indicators · product modules.

- **Borders:** thin graphite `#171D21`, 1px. Never bright translucent SaaS cards.
- **Glass:** dark smoked — a 3.5% white top gradient over `#090D11`, 6px backdrop blur.
- **Glow:** localised only (`0 0 18px -4px` / `0 0 44px -8px` at ≤40% alpha). Never a section wash.
- **Chrome:** reserved for the physical 3D objects — not applied to interface panels.
- **Black levels stay rich.** Backgrounds sit between `#000000` and `#0D1217`. Nothing washes to grey.
- **Green budget:** active states, value movement, routes, thesis words, progress, key numbers, system
  activation, nodes, live status. Nothing else. Target ≲8% of pixels in any viewport.

---

## 9. RESPONSIVE BEHAVIOUR

Desktop-first investor experience; mobile **recomposed**, not shrunk.

| Target | Behaviour |
|--------|-----------|
| 1920×1080 / 1440×900 / 1366×768 | Primary presentation. Cinematic horizontal compositions, large sticky scenes, pinned narratives, horizontal architecture, layered depth. |
| 1024×768 | Reduced width, hierarchy preserved; architecture compresses to two columns. |
| Tablet | Left nav rail → top bar; horizontal rails begin to stack. |
| 390×844 | Vertical storytelling, stacked product modules, simpler motion, **vertical** lifecycle rail, touch-friendly targets (≥44px). |

Hard constraints: **no horizontal overflow at any width** (`overflow-x: clip` on the root plus per-scene
audit); no microscopic labels (floor ≈11px); sticky scenes shorten or linearise below `lg`.

---

## 10. INTERACTION

Desktop supports hover detail, module click, scroll-driven state, section jump, data inspection and subtle
cursor feedback. **The full story must work through scrolling alone** — interaction deepens understanding but
is never required to follow the pitch.

Tested: trackpad · mouse wheel · keyboard · touch · fast scroll · slow scroll · refresh mid-page ·
back/forward · section links · reduced motion · desktop resize.

---

## 11. PERFORMANCE

Targets: smooth 60fps desktop; Lighthouse **Performance ≥85**, **Accessibility ≥90**, **Best Practices ≥90**,
without destroying visual quality.

Techniques: animate only `transform` / `opacity`; dynamic import + lazy-mount for the control layer and lower
scenes; `next/image` with AVIF/WebP and explicit sizes; SVG instead of raster wherever it explains better;
`content-visibility` on offscreen scenes; ambient loops paused offscreen; no unbounded particle systems;
no large blur stacks; no uncompressed video or textures; zero external CDN requests.

Avoided by construction: layout thrashing (no scroll-driven layout reads), huge canvas scenes, rendering
everything immediately.

---

## 12. ACCESSIBILITY

- Semantic structure: one `<h1>`, `<section>` per scene with `aria-labelledby`, ordered headings.
- **Most text is real HTML.** The presentation is not rasterised.
- Full keyboard operation; visible focus everywhere; skip link to main content.
- Charts carry accessible names/descriptions; data tables where a table is the honest representation.
- **No information conveyed by green alone** — state always carries a second cue (label, weight, icon,
  `aria-current`).
- `prefers-reduced-motion` fully respected with content parity.
- Contrast: body grey `#A6ADB2` on `#05080A` ≈ 9.4:1; signal green `#00E060` ≈ 11.6:1.

---

## 13. CONTENT RULES

Keep DRK direct. **Banned filler:** "revolutionising finance", "next-generation ecosystem", "transforming
Web3", "future of finance", "unlocking unprecedented potential", "seamless innovation", "cutting-edge
solution".

**DRK vocabulary:** liquidity · execution · routing · programs · wallets · control · visibility · launches ·
performance · runtime · infrastructure · reporting · traders · market making.

**Fabrication ban.** No invented clients, partnerships, integrations, performance, audited results, financial
figures, exchange relationships, product capabilities, market statistics, customer names, dates or revenue
claims. Anything questionable is preserved verbatim and flagged as `TODO_CONTENT_VERIFY` — ten items, listed
in `content/drk.ts` and `DRK_SOURCE_AUDIT.md` §4.

**Connective copy.** A small amount of new *linking* text exists (step premises in Market, loop node notes in
Compound, module straplines in Control). It is restricted to restating or sequencing what the deck already
says and introduces no new fact. Every such string lives in `content/drk.ts` where it can be reviewed.

---

## 14. DO-NOT LIST (§31, tracked)

No slide-for-slide rebuild · no carousel · no slide arrows · no generic crypto effects · no Three.js overuse ·
no glassmorphism overuse · no fabricated screenshots, partners, metrics, integrations or customer names ·
no stock photography · no office imagery · no futuristic-city imagery · no visual noise disguising weak
hierarchy · not every concept in a card · nothing animating simultaneously · green not everywhere ·
no unrelated art direction per section · **no platform-demo placeholder left anywhere.**

---

## 15. QA PROTOCOL

**Visual QA (Playwright).** Screenshots at 1920×1080, 1440×900, 1366×768, 1024×768, 390×844 into
`.review/desktop/` and `.review/mobile/`: every major section, important sticky-scroll states, open product
modules, proof, raise, final frame. **Screenshots are inspected, not assumed.** Hunted: clipping · awkward
wraps · tiny text · dead space · misalignment · washed-out black · overdone glow · low contrast · broken
sticky state · visual discontinuity · weak composition · poor mobile hierarchy.

**Interaction QA.** Trackpad · wheel · keyboard · touch · fast scroll · slow scroll · refresh mid-page ·
back/forward · section links · reduced motion · resize.

**Content QA.** Diff every rendered figure against §2/§3 of the audit; assert no component hardcodes a
business fact; assert all ten verify-TODOs are present.

---

## 16. BUILD PHASES

1. **Audit** — this document plus the audit and asset manifest. *Complete before any application code.*
2. **Foundation** — project, tokens, typography, background, navigation, section primitive, motion utilities,
   content manifest, responsive system, reduced motion.
3. **Quality standard** — scenes 01–04. These set the bar; inspect before continuing.
4. **Business story** — scenes 05–09.
5. **Product** — scene 10, treated as a major product-design task.
6. **Economics** — scenes 11–13.
7. **Close** — scene 14.
8. **Polish** — motion, typography, pacing, object continuity, interface credibility, responsiveness,
   accessibility, performance, scroll behaviour, content accuracy, visual hierarchy.
