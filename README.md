# DRK — Interactive Investor Experience

**Transparent liquidity infrastructure for token launches, DEXs, perps, and onchain assets.**

An interactive, scroll-led investor experience built from the DRK pitch deck.
Seventeen narrative scenes, one continuous machine — not a slide deck on the web.

```
interactive-deck/     the Next.js application
docs/                 source audit, asset manifest, spec, and every refinement report
```

---

## Run it

```bash
cd interactive-deck
npm install
npm run dev            # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

`DRK_DIST_DIR` lets QA build to a separate directory while a dev server is
running (`DRK_DIST_DIR=.next-prod npm run build`).

## QA

```bash
node scripts/audit-shots.mjs --out=review   # 205 screenshots, 5 viewports
node scripts/a11y.mjs                       # axe-core, reduced motion
node scripts/interaction-qa.mjs             # 32 behavioural checks
npx tsc --noEmit
```

Current: Lighthouse **99 / 97 / 100** (performance / accessibility / best
practices), **zero** WCAG 2.1 A/AA violations, 32/32 interaction checks.

---

## Architecture

One persistent world beneath the whole document, not fourteen sections with
fourteen backgrounds:

```
WorldProvider              one scroll observer; continuous narrative time t ∈ [0,13]
  ├─ frame channel (rAF)   consumers write to the DOM — React never renders on scroll
  └─ state channel         active scene + progress only
DrkWorld                   fixed, z-0 — one ground, one travelling light,
                           one liquidity signal whose SHAPE morphs with scroll
main (z-1)                 the seventeen scenes, composing on top
```

The liquidity signal holds a scene's shape for the first 58% of its runway and
transforms across the boundary, so scene changes *are* the transformation.
Scenes register objects against it and they ride it as it moves.

No GSAP, no Lenis, no WebGL — see `docs/DRK_INTERACTIVE_DECK_SPEC.md` §3.2–3.3
for why each was rejected rather than omitted.

---

## Content rules

Every business fact lives in `interactive-deck/content/drk.ts`. No component
hardcodes a figure, name, date or claim.

Nothing was invented: no clients, partners, integrations, performance figures,
valuations, allocation splits or market statistics. Values that look
inconsistent in the source are **preserved and flagged**, never silently
corrected — see `docs/DRK_CONTENT_VERIFICATION.md`.

**Twelve items remain open for the client.** VER-01, VER-02, VER-03, VER-05,
VER-06 and VER-12 gate external release.

---

## Documentation

| File | What it is |
|---|---|
| `DRK_SOURCE_AUDIT.md` | Full audit of the supplied PDF and brand boards, with a verbatim transcription of all 15 pages |
| `DRK_ASSET_MANIFEST.md` | How the 3D object plates were derived, and what was deliberately not used |
| `DRK_INTERACTIVE_DECK_SPEC.md` | Technical and narrative specification |
| `DRK_BUILD_REPORT.md` | The first working build (superseded in part) |
| `PREMIUM_REFINEMENT_AUDIT.md` → `PREMIUM_REFINEMENT_REPORT.md` | The persistent-world rebuild |
| `ART_DIRECTION_AUDIT.md` → `ART_DIRECTION_REFINEMENT_REPORT.md` | The art-direction pass |
| `DRK_CONTENT_VERIFICATION.md` | Every open factual question |

---

## Not in this repository

The client's confidential source material is excluded by default — the pitch
deck PDF (marked confidential) and the product screen recording (which contains
live mainnet values). See `.gitignore`. Everything the build needs is committed.
