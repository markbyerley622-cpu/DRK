# DRK × Metaplanet — Bitcoin Treasury, Execution & RWA Opportunity

**Status:** Discovery memo. Nothing here is agreed, pitched, or offered.
**Prepared:** 14 August 2026
**Author's stance:** deliberately skeptical. The brief was to find out whether there is a real
problem here, not to manufacture one.

---

## 0. The one-paragraph answer

**Metaplanet almost certainly does not need DRK to buy Bitcoin, and DRK should not walk in
offering to.** They move roughly one large block per quarter through counterparties who already
do this at institutional scale, they are currently a forced seller of the *accumulation* story
rather than a buyer of new execution vendors, and DRK's balance sheet is four orders of magnitude
too small to be a credible principal. But Metaplanet has done three things in 2026 that matter
far more to DRK than its treasury: it launched **Metaplanet Ventures**, a **¥4B fund investing
exclusively in Japanese Bitcoin infrastructure** — lending, payments, custody, stablecoins,
derivatives, compliance — plus an incubator and grants programme; it bought a **Type I licensed
brokerage**; and it launched **Project NOVA**, a programme to issue **Bitcoin-collateralised
digital credit** on **Progmat** (Japan's dominant security-token platform, now migrating to
**Avalanche — EVM**) settled in **JPYC**, the yen stablecoin Ventures made its first investment
in. **Metaplanet is not a trading counterparty for DRK. It is a deal-flow funnel into an entire
national Bitcoin ecosystem that will issue tokens DRK can make markets in — and, because Ventures
invests in these companies, DRK can invest alongside and quote the same assets it owns.** The
opportunity is RWA and portfolio liquidity, earned on both sides, not BTC execution.

---

## 1. Metaplanet today — what the evidence actually says

All figures below are from public sources dated 2026 unless noted. Anything I could not verify to
a primary disclosure is flagged. **Confirm every number against Metaplanet's own IR filings before
it goes in front of them** — being wrong about their own balance sheet in the first meeting is
unrecoverable.

### 1.1 The core business

Metaplanet Inc. (TSE: 3350 / OTCQX: MTPLF) describes itself as *"Japan's first and only publicly
listed Bitcoin Treasury Company."* Its stated primary KPI is **BTC Yield** — defined as the
percentage growth in **Bitcoin per share**, not Bitcoin in absolute terms. That definition is the
single most important fact in this memo, and §1.4 explains why.

Six stated principles, paraphrased from their own materials: acquire and hold BTC as a long-term
reserve; optimise BTC Yield; maintain investor transparency; use disciplined leverage to beat
BTC's own performance; grow holdings opportunistically; educate Japan on Bitcoin.

Legacy operations: a Tokyo hotel and the exclusive Bitcoin Magazine Japan licence. Immaterial.

### 1.2 The treasury

| Metric | Value | Date / source |
|---|---|---|
| BTC held | **43,000 BTC** | Q2 FY2026 close, announced 1–2 July 2026 |
| Q2 FY2026 purchase | **2,823 BTC** | announced 1 July 2026 |
| Reported average cost basis | **¥15.3M / BTC** (≈ $100k) | Q2 2026 reporting |
| Stated target | **210,000 BTC by end-2027** (≈1% of supply) | management guidance |
| Rank | 3rd-largest listed corporate holder | Q2 2026 |

⚠️ **Unreconciled figure.** Reports of the Q2 purchase price disagree: one source gives an average
of **$78,872/BTC** (≈$223M for 2,823 BTC), another headlines **$170M**, another **$225M**, and a
fourth quotes **¥12.7M/coin** (≈$83k at ~153 JPY/USD). These cannot all be right. Get the number
from the disclosure PDF, not the press.

### 1.3 The Bitcoin Income Generation business

This is *not* market making, and DRK should not describe it that way. It is an **options-writing
book**: premiums collected from **collateral-secured Bitcoin options**, run in a **segregated
portfolio** held separately from the long-term treasury.

| Period | Revenue | Note |
|---|---|---|
| Q1 FY2026 | ¥2.969B | |
| Q2 FY2026 | ¥1.747B (≈$11M) | **−41% QoQ** |
| H1 FY2026 | ¥4.717B | |
| FY2026 guidance | ≈¥16B (≈$103M) | left unchanged after the Q2 miss |

Management attributed the 41% fall to **compressed implied volatility** — BTC drifting in a
subdued, largely bearish range produced thinner premiums. They characterised it as routine, not
structural.

**Unknown and important:** which venues, which counterparties, puts vs calls, strikes, tenors,
whether execution is manual or systematic. None of it is public. Do not guess.

### 1.4 The balance-sheet reality — the thing that changes the whole conversation

BTC traded at **~$64,085 on 12 August 2026**, down from ~$93,000 at the start of the year.

Against a reported cost basis of roughly **$100k/BTC**:

```
43,000 BTC × ~$64,000  ≈  $2.75B   market value
43,000 BTC × ~$100,000 ≈  $4.30B   cost
                          ────────
                         ≈ −$1.55B  unrealised
```

*(My arithmetic from published inputs — not a Metaplanet disclosure. Verify.)*

The consequences are visible in their own actions:

- **mNAV fell below 1.0x** — the equity traded at a discount to the Bitcoin behind it.
- Management stated that below 1.0x they would **"strongly consider repurchasing common shares to
  maximize BTC Yield."** Because the KPI is BTC *per share*, buying back discounted stock raises
  it more efficiently than buying spot. **The KPI mechanically turns them from a BTC buyer into a
  share buyer when the discount opens.**
- They ran a **$500M buyback** (window 29 Oct 2025 – 28 Oct 2026, executed on the TSE under a
  discretionary trading agreement), backed by a **$100M Bitcoin-collateralised loan** and a **$500M
  buyback credit line**.
- Accumulation was **paused** through the discount, while the 210,000 BTC target was publicly
  maintained.

**Read this correctly.** It does not mean Metaplanet is finished — they bought 2,823 BTC in Q2 and
are expanding aggressively into financial products. It means the *centre of gravity has moved*
from "buy Bitcoin with equity" to **"build a Bitcoin financial business."** That move is the
entire reason DRK has a conversation worth having, and it is the opposite of an execution pitch.

### 1.5 Capital structure

A dense, fast-moving financing stack — evidence of sophistication and of existing bank/broker
relationships DRK would be joining, not replacing:

- **Zero-coupon bonds**, 20th series, **¥8B (~$50M)**, issued 24 April 2026, matures April 2027,
  taken **in full by EVO FUND** (Evolution Financial Group, Cayman) — the anchor of every prior
  series.
- **Perpetual preferred equity**: a two-tier stack — **MARS** (Metaplanet Adjustable Rate Security,
  Class A senior, monthly adjustable dividend) and **MERCURY** (~$150M, ~4.9% yield).
  ⚠️ At least one report says a **preferred-share listing was postponed**. Verify current status.
- **Equity / stock acquisition rights**: up to **¥21B (~$137M)** via third-party allotment.
- Reportedly drew **83% of a $500M credit line** building to 43,000 BTC.

### 1.6 Project NOVA and the RWA pivot — **the actual opportunity**

Announced **10 July 2026**. A joint study between:

- **Metaplanet Securities** — formerly **Siiibo Securities**, acquired for **¥2.1B (~$13M)**,
  rebranded **13 July 2026**. Holds a **Type I Financial Instruments Business licence** (FSA).
  Siiibo pioneered Japan's online corporate-bond market: 100+ offerings for 40+ issuers.
- **JPYC Inc.** — Japan's first onshore regulated yen stablecoin (launched Oct 2025, Type II funds
  transfer licence, ¥1M/user/day issuance cap). Cumulative issuance ~**¥2.5B** as of May 2026;
  ~18,000 accounts; ~¥35B cumulative transaction volume. Extended a Series B to ~¥6B / $38M.
  Stated ambition: ¥10T in circulation within three years of launch.
- **Progmat, Inc.** — Japan's dominant security-token platform. **~¥439.6B AUM, ~63% of cumulative
  domestic ST issuance.** Consortium includes MUFG, Mizuho, SMBC, BlackRock Japan. Projects the
  Japanese ST market balance to exceed **¥1.5T by end-2026**. **Migrating $2B+ of tokenised
  securities to Avalanche — i.e. EVM-compatible, sub-2s finality, composable with public chains.**

The product: **digital corporate bonds and structured credit using Bitcoin as collateral or credit
enhancement** — Bitcoin backing the *credit quality* of the paper rather than being sold to fund
it. Target yield **4–6% annually**. Reported informally as "Bitbonds."

**Why this is the opportunity, in one line:** Metaplanet is about to become an *issuer* of
EVM-based tokenised securities into a market that is famously good at primary issuance and
famously bad at secondary liquidity — and DRK's entire product is making markets in newly issued
tokens with client-visible reporting.

### 1.7 Metaplanet Ventures and Metaplanet Asset Management — **the deal funnel**

Announced **12 March 2026**. Two wholly owned subsidiaries. This is the part of Metaplanet that
most closely matches what DRK actually sells, and it is almost entirely absent from the coverage
that treats Metaplanet as "the Japanese MicroStrategy."

**Metaplanet Ventures** — **¥4B (~$25M) over two to three years**, deployed into Japanese Bitcoin
infrastructure companies. The named target sectors are, verbatim: **lending, payments, custody,
stablecoins, derivatives, and compliance.** It also runs an **incubator and a grants programme**
for early-stage founders, open-source developers, educators and researchers.

Gerovich's framing: *"Japan has built the best regulatory framework in the world for digital
assets. Now it needs the companies, the builders, and the infrastructure to match."*

**First investment: JPYC Inc.** — **¥400M (~$2.5M)** into the Series B, LOI March 2026, closing
expected April. JPYC is Japan's first licensed yen stablecoin (launched Oct 2025), pegged 1:1 via
bank deposits and JGBs, **running on Avalanche, Ethereum and Polygon — all EVM**, all chains DRK
already supports. It has a Sony Bank partnership for creator payments.

Gerovich on the rationale, and this line is worth reading twice: *"Every Bitcoin transaction has
two sides: Bitcoin and a currency. As this market goes institutional, that currency side goes
digital. JPYC is building that rail in Japan."*

⚠️ **Do not conflate these numbers.** ¥4B is the *fund*. ¥400M is the *JPYC ticket*. At least one
secondary source merged them into "up to ¥4B into JPYC." That is wrong.

**Metaplanet Asset Management** — **Miami**. A digital credit and Bitcoin capital-markets platform
"connecting Asian and Western capital markets," covering Bitcoin investment products, capital
markets advisory, yield instruments, fixed income, and actively managed credit, commodity and
**volatility** strategies. Strategically important to DRK for one reason: **it sits outside the
Japanese regulatory perimeter entirely**, and is therefore the easiest door in the whole group.

**Why this reframes everything.** Every prior section treats Metaplanet as a potential client.
Ventures makes it a **channel**. A single standing agreement — "DRK is the default liquidity
partner for any Ventures portfolio company that issues a token" — converts one business-development
win into recurring mandates for years, in a fund whose named sectors (stablecoins, derivatives,
lending) are exactly where tradable tokens get issued.

### 1.8 Japanese regulatory perimeter — read this before promising anything

- Security tokens are **FIEA financial instruments**. Offering, buying, selling, exchanging or
  **intermediating** them requires registration as a **Type I Financial Instruments Business
  Operator**.
- The **2026 FIEA amendments** are described as the most consequential shift in over a decade,
  formally pulling tokenised securities and certain digital assets inside the securities
  perimeter, and **tightening rules on how foreign firms solicit Japanese investors**.
- **DRK is not registered and will not be quickly.** Assume any activity that looks like dealing,
  broking or soliciting in Japanese securities is closed to DRK as principal.
- **But Metaplanet Securities holds the Type I licence.** That asymmetry is not an obstacle — it
  is the deal structure. See §2 and §6.

⚠️ Not legal advice. Before any commercial proposal, get a Japanese financial-regulatory opinion on
whether DRK-as-technology-provider to a Type I firm triggers registration, and on the treatment of
non-Japanese liquidity provision into a Progmat-issued instrument.

---

## 2. The uncomfortable part — a candid read on DRK's standing

The brief said be skeptical. Skepticism has to point at us too.

| | Metaplanet | DRK |
|---|---|---|
| Balance sheet | ~$2.75B in BTC | raising **$1.5M** seed |
| Track record | 3rd-largest listed corporate BTC holder | **2 token launches**, July–Aug 2026 |
| Evidenced economics | ¥4.7B H1 options revenue | **$40k+** captured across both launches |
| Regulatory standing | Type I FIEA licence, TSE-listed | none |
| Counterparties | EVO FUND, MUFG-adjacent, institutional | undisclosed |

**Implications DRK must internalise before the meeting:**

1. **Principal liquidity is off the table.** A firm raising $1.5M cannot warehouse a $200M BTC
   block. Offering it damages credibility permanently.
2. **Agency BTC execution is a commodity DRK has no proven edge in.** Metaplanet already executes
   nine-figure BTC blocks. DRK has never publicly executed one. There is no story here.
3. **Vendor diligence will be brutal.** A TSE-listed company with a Type I subsidiary will run
   counterparty diligence DRK would currently fail on size, audit history and insurance.
4. **The credible asset is the software and the market-making craft, not the balance sheet.**
   DRK's Licensed Runtime model — client-owned wallets, client-held permissions, real-time
   visibility, P/L attribution, DRK operating the engine but never the custody — is *exactly* the
   shape a regulated Japanese counterparty can actually buy from an unlicensed foreign vendor.

**This is the strategic conclusion: DRK should approach Metaplanet as a technology and liquidity-
operations partner sitting underneath Metaplanet Securities' licence — not as a counterparty
sitting across from Metaplanet's treasury.**

---

## 3. Ranked opportunities

Ranked on **evidence of need × likely commercial value × DRK's actual ability to deliver.** Not on
size of the addressable number.

| # | Opportunity | Evidence | Fit | Verdict |
|---|---|---|---|---|
| **1** | **Portfolio-wide liquidity partnership with Metaplanet Ventures** — default market maker for every portfolio company and incubator cohort token, with DRK co-investing alongside | **Strong.** ¥4B fund, named sectors, live first investment, incubator running | **Direct**, and it is the only play that compounds | **Lead with this** |
| **2** | **RWA / Project NOVA secondary-market liquidity** — designated market maker for Bitcoin-backed tokenised credit on Progmat | **Strong.** Announced 10 Jul 2026, named partners, EVM rails, licensed distribution | **Direct.** This is DRK's existing product | Highest single-mandate value |
| **3** | **JPYC pair liquidity** — JPYC↔USDC/USDT/BTC depth on Avalanche, Ethereum, Polygon | **Strong.** Live token, three EVM chains, Metaplanet is now a shareholder | Excellent. Smallest technical lift here | **Fastest to execute** |
| **4** | **Treasury & execution reporting / analytics software** — BTC Yield attribution, execution-cost measurement, venue and counterparty attribution | Moderate. BTC Yield is their published KPI; no evidence of a measurement gap | Strong. Licensed Runtime, no licence or balance sheet needed | **Zero-friction wedge** |
| **5** | **Metaplanet Asset Management (Miami)** — pricing and execution under their credit, yield and vol strategies | Moderate. Launched Mar 2026, operational status unclear | Good, and **outside the FIEA perimeter** | Easiest legal path in |
| **6** | **Bitcoin income-generation (options) infrastructure** — execution, vol pricing, hedging, collateral, PnL attribution | Strong *need signal* (−41% QoQ, vol-dependent), **zero** disclosure of how it runs | **Weak.** No evidenced DRK options capability | High value, unproven capability — investigate, don't pitch |
| **7** | Algorithmic BTC execution (agency: TWAP/VWAP/POV/IS) | Weak. Quarterly blocks, incumbent desks | Weak. No BTC-scale track record | Deprioritise |
| **8** | OTC / block execution | Weak | Very weak | Deprioritise |
| **9** | Hedging / derivatives execution around the treasury | Speculative | Weak | Not now |
| **10** | **Principal BTC liquidity** | — | **None.** Balance sheet is 1/1000th of one trade | **Do not offer** |
| **11** | **Proprietary RFQ pool** | No evidence of an RFQ problem | — | **Solution in search of a problem. Do not mention** |

---

## 4. What we genuinely do not know

Honesty about the holes is what makes the meeting productive.

**Bitcoin execution**
1. Who executes their BTC purchases today — internal desk, OTC counterparty, or exchange?
2. Typical and maximum single order size; execution horizon (minutes, days, weeks?).
3. Whether market impact or slippage is measured at all, and against what benchmark.
4. Whether purchases are funded and executed in **JPY or USD**, and who owns the FX leg.
5. Whether accumulation has genuinely resumed, or Q2's 2,823 BTC was opportunistic.

**Options / income generation**
6. Venues and counterparties. Deribit? CME? Bilateral OTC? Unknown.
7. Puts or calls, strikes, tenors, rolling discipline, systematic or discretionary.
8. Who prices the vol surface, and whether execution quality is measured.
9. What "collateral-secured" means operationally — segregated custody, margin, tri-party?
10. Whether the −41% was purely vol compression or partly execution/sizing.

**Project NOVA / RWA — the highest-value unknowns**
11. Issuance timetable. Is there a first instrument, and when?
12. Expected issue size and investor base — retail via Metaplanet Securities, or institutional?
13. **Is secondary trading contemplated at all, or buy-and-hold to maturity?** *(If there is no
    secondary market, opportunity #1 collapses. Ask this early.)*
14. Which chain, in production — Progmat's Avalanche migration, or something else?
15. Who is expected to make markets in these instruments? Has anyone been appointed?
16. What role JPYC plays — settlement only, or a traded pair?
17. Whether a **liquidity commitment is a listing/regulatory condition** for the instrument.

**Structural**
18. Custody arrangements and whether any external party ever touches assets.
19. Whether Metaplanet Securities' Type I licence can cover a technology/liquidity vendor
    operating beneath it.
20. Preferred commercial shape: fee, retainer, spread, or hybrid.
21. Vendor diligence thresholds — does DRK even clear the bar to be onboarded?

---

## 5. Discovery questions — the 20 to actually ask

Ordered so that the earliest answers kill or confirm the biggest hypotheses. Questions 1–7 are the
ones that change the architecture.

### Tier 0 — Metaplanet Ventures; ask these before anything else

A. **Which companies has Ventures backed since JPYC, and which of them have issued or plan to
   issue a token?**
B. **When a portfolio company launches a token, who handles liquidity today — the company, an
   external market maker, or nobody?**
C. **Would Ventures consider a standing liquidity partner across the portfolio, so every company
   that issues has a market maker lined up before launch rather than after?**
D. **Does Ventures co-invest with strategic partners, or does it write the whole cheque? Could DRK
   invest alongside on the same terms in names where we'd also be making the market?**
E. **Is the incubator running a cohort now, and would liquidity support be useful to those
   founders?**
F. **On JPYC specifically — who provides depth in JPYC pairs today, and is thin liquidity a
   constraint on adoption?**

### Tier 1 — the NOVA architecture questions

1. **Project NOVA — is secondary trading in scope for the first Bitcoin-backed instruments, or are
   they designed to be held to maturity?**
2. **If secondary trading is in scope: who is expected to provide continuous two-way liquidity, and
   has that been appointed?**
3. **Is a liquidity or market-making commitment a condition of listing or distribution for these
   instruments — regulatory, exchange, or investor-driven?**
4. **Will the instruments settle on Progmat's Avalanche/EVM infrastructure in production, and is
   JPYC the settlement leg, a traded pair, or both?**
5. **What is the expected issue size and timetable for the first instrument, and who is the target
   investor — Japanese retail through Metaplanet Securities, or institutional?**
6. **Can Metaplanet Securities' Type I licence accommodate an unlicensed foreign technology and
   liquidity-operations vendor operating beneath it — and has that structure been tested?**
7. **Where does Metaplanet see the binding constraint over the next 12 months: acquiring Bitcoin,
   generating income from it, or distributing Bitcoin-linked products?**

### Tier 2 — the income-generation business

8. The Bitcoin Income Generation business is publicly described as collateral-secured options.
   **Which venues and counterparties does it trade through, and is execution systematic or
   discretionary?**
9. **Q2 revenue fell 41% QoQ on lower volatility. How much of that was pure premium compression
   versus execution quality, sizing, or roll timing?** *(Their answer tells you whether they
   measure execution at all.)*
10. **Do you measure execution quality on the options book — slippage to mid, fill rates, spread
    capture, venue attribution?**
11. **Is the constraint on scaling that business liquidity, pricing, risk infrastructure, or
    mandate?**
12. **Would you value an independent execution-quality and PnL-attribution layer over that book,
    separate from the desk that runs it?**

### Tier 3 — treasury execution (ask, don't pitch)

13. **How are BTC purchases executed today — internally, via OTC counterparties, or across
    exchanges — and who owns the execution decision?**
14. **What is a typical and a maximum single order, and over what horizon is it worked?**
15. **Are purchases funded in JPY or USD, and is FX conversion part of the execution problem or
    handled separately?**
16. **Is market impact currently measurable? Do you track arrival-price or VWAP slippage, or is
    average acquisition price the only benchmark?**
17. **With mNAV having traded below 1.0x and the buyback running to October, how should we think
    about the pace of BTC accumulation over the next four quarters?** *(Direct, respectful, and
    it tells you whether execution work exists at all.)*

### Tier 4 — commercial and structural

18. **BTC Yield is your published KPI. How is it currently attributed and reported internally, and
    is there anything you wish you could measure that you can't today?**
19. **For a partner like DRK, would you prefer transaction-based fees, a fixed infrastructure
    retainer, spread economics, or a hybrid — and what does a vendor need to clear your
    counterparty diligence?**
20. **Does DRK ever need to touch custody in any model you'd consider, or is a strictly
    non-custodial engine a hard requirement?**

**Do not ask:** "What are your goals?" · "How can we help?" · "Do you need liquidity?" ·
anything that presumes market making.

---

## 6. Opportunity hypotheses

### H0 — Ventures portfolio liquidity partnership, DRK invests *and* market-makes ★ recommended lead

| | |
|---|---|
| **Problem** | Metaplanet Ventures is deploying ¥4B into Japanese Bitcoin infrastructure across stablecoins, lending, payments and derivatives — sectors that issue tokens. A VC can write the cheque but cannot make the market. Portfolio companies that launch thin, illiquid tokens damage the fund's own returns. |
| **DRK solution** | A standing agreement: DRK is the default liquidity partner for any Ventures portfolio company or incubator cohort member that issues a token — **and DRK co-invests alongside Ventures on the same terms.** Two revenue lines, one relationship, one diligence process. |
| **Infrastructure** | None new. This is DRK's existing product and existing motion, pointed at a curated pipeline instead of inbound. |
| **Capital** | **Small and staged** — modest co-investment tickets at early-round prices, plus per-mandate MM inventory. Sized to a $1.5M seed, unlike anything involving BTC blocks. |
| **Regulatory** | **Low.** Private co-investment and crypto-native token market making. Most portfolio companies will sit outside FIEA. |
| **Counterparty risk** | Low and diversified across names. |
| **Revenue — operator side** | MM economics per mandate: spread capture, monthly retainer, performance share. |
| **Revenue — investor side** | Equity or token allocation at VC entry price. |
| **Strategic value** | **Highest in this memo, because it compounds.** One BD win becomes N mandates over the fund's life, each with an investment leg attached. |
| **Difficulty** | Moderate — the hard part is commercial and structural, not technical. |
| **Evidence** | **Strong.** ¥4B committed, sectors named, first investment closed, incubator live. |
| **The conflict, stated first** | DRK would hold a position in an asset it also quotes. **Raise this before they do.** Mitigations: segregate inventory from investment position; the Control Layer already gives the client real-time visibility into the traded book; accept a lock-up on the investment leg so DRK cannot exit through its own quotes. The structure is standard in crypto and analogous to sponsor-plus-designated-MM in traditional listings — but it must be documented, not assumed. |
| **Where it does NOT apply** | Project NOVA instruments (holding and quoting the same FIEA-regulated security is a far harder conversation) and anything touching the BTC treasury. |

### H1 — RWA secondary-market liquidity for Project NOVA ★ highest single-mandate value

| | |
|---|---|
| **Problem** | Tokenised bonds in Japan issue well and trade badly. A Bitcoin-collateralised digital bond with a 4–6% coupon distributed to Japanese investors has no natural two-way market. Illiquid paper prices worse at issue, caps issue size, and constrains the whole NOVA programme. |
| **DRK solution** | Designated liquidity provider / market maker for each NOVA instrument, operating DRK's engine beneath Metaplanet Securities' Type I licence. Continuous two-way quoting, inventory and risk managed by DRK's runtime, with the Control Layer giving Metaplanet real-time visibility into the book it is responsible for. |
| **Infrastructure** | Existing DRK stack — liquidity engine, routing, risk controls, Control Layer. New: Avalanche/Progmat integration, JPYC settlement leg, ST transfer-restriction handling (whitelists, lock-ups), Japanese reporting. |
| **Capital** | Modest and *scoped per instrument* — a single bond issue needs far less inventory than a BTC block. Could start agency-only with Metaplanet Securities as principal, **zero DRK balance sheet.** |
| **Regulatory** | **High but tractable** — and the tractability is the whole point. DRK cannot deal in FIEA instruments; Metaplanet Securities can. DRK is the engine, they are the principal. Needs a Japanese legal opinion before proposal. |
| **Counterparty risk** | Low in the agency structure. |
| **Revenue** | Monthly liquidity-provision retainer per instrument + spread share, or a Licensed Runtime fee. Recurring, and scales with the number of NOVA instruments. |
| **Strategic value** | **Very high.** A Japanese Type I firm as a reference client transforms DRK's institutional credibility, and NOVA is a programme, not a trade — every future instrument is a repeat. |
| **Difficulty** | High: new chain, new regulatory context, new asset class. |
| **Evidence** | **Strongest of any hypothesis.** Named partners, named platform, named date, EVM rails, licensed distribution channel. |

### H2 — Treasury & execution measurement layer ★ recommended wedge

| | |
|---|---|
| **Problem** | BTC Yield is the published KPI, and the options book's revenue swings 41% quarter to quarter. Unknown whether execution cost, venue quality or per-strategy attribution is measured independently of the desk that trades it. |
| **DRK solution** | Read-only analytics and reporting over BTC acquisitions and the options book: execution cost vs benchmark, venue and counterparty attribution, realised spread, BTC Yield decomposition, reconciliation. DRK's Licensed Runtime with the trading engine switched off. |
| **Infrastructure** | Data ingestion from their venues/custodians + existing DRK reporting surfaces. Smallest build in this memo. |
| **Capital** | **None.** |
| **Regulatory** | **Low** — software and analytics, no dealing, no solicitation, no custody. |
| **Counterparty risk** | None. |
| **Revenue** | Fixed monthly software fee. |
| **Strategic value** | High as a **wedge**: it gets DRK inside the account, generates the data that proves or disproves every other hypothesis, and creates a paid relationship before any liquidity mandate exists. |
| **Difficulty** | **Low.** |
| **Evidence** | Circumstantial. Needs Q10/Q16/Q18 answered. |

### H3 — Options / income-generation execution infrastructure

| | |
|---|---|
| **Problem** | ¥4.7B H1 revenue, −41% QoQ, entirely vol-dependent. If any part of that decline is execution rather than premium compression, it is worth real money. |
| **DRK solution** | Execution, pricing and hedging layer beneath the options book, with risk limits and attribution. |
| **Infrastructure** | **Substantially new for DRK** — options execution, vol-surface pricing, margin and collateral management. |
| **Capital** | Moderate to high if hedging. |
| **Regulatory** | Depends entirely on venue and structure. Unknown. |
| **Counterparty risk** | Moderate to high. |
| **Revenue** | Execution fee or performance share. |
| **Strategic value** | High if won. |
| **Difficulty** | **Very high.** |
| **Evidence** | Need is plausible; **DRK's capability is unevidenced.** Investigate in discovery. Do not pitch. |

### H4 — JPYC / stablecoin liquidity

| | |
|---|---|
| **Problem** | NOVA settles in JPYC. JPYC is small (~¥2.5B cumulative issuance, ¥1M/user/day cap) and needs depth against BTC and USD stables to be usable at institutional scale. |
| **DRK solution** | Market making JPYC pairs; FX-crypto plumbing between the yen leg and crypto settlement. |
| **Capital** | Low to moderate. |
| **Regulatory** | Moderate — payment/funds-transfer perimeter, distinct from FIEA. |
| **Revenue** | Spread. |
| **Strategic value** | Moderate now; high if JPYC approaches its stated ambitions. |
| **Difficulty** | Moderate. |
| **Evidence** | JPYC is a named NOVA partner. The volume is not there **yet**. |

### H5 — Principal BTC liquidity ✕ rejected

Rejected on arithmetic. One Metaplanet block is ~$200M. DRK is raising $1.5M. There is no version
of this that is credible, and raising it would cost DRK the meeting.

---

## 7. Recommended opening position

**Do not say:** "We want to make markets in BTC/JPY." · "We'll provide liquidity." · "We're
building an RFQ pool." Each presumes a problem that the evidence does not support.

**Do say — roughly this:**

> "We've followed Metaplanet closely, and what caught our attention wasn't the treasury — it was
> Ventures, Project NOVA and the Siiibo acquisition. Between a ¥4B fund pointed at Japanese
> Bitcoin infrastructure, Bitcoin-backed credit going onto Progmat, and JPYC as the settlement
> rail, you're building an ecosystem that is going to issue a lot of tradable instruments.
>
> DRK builds and operates the liquidity engine that sits under newly issued tokens — continuous
> two-way markets, real-time execution visibility, and client-owned wallets so the issuer never
> gives up custody or control. Japan's token and security-token markets issue extremely well and
> trade almost not at all, and that gap is the thing we're actually good at.
>
> We're not here to tell you how to buy Bitcoin — you do that at a scale and with counterparties
> we wouldn't presume to improve on. What we'd like to explore is whether DRK could be the default
> liquidity partner across the Ventures portfolio, and whether it makes sense for us to invest
> alongside you in the companies we'd be making markets for — so we're carrying the same outcome
> you are, not just billing against it."

**Why this framing works:** it demonstrates current knowledge of the parts of their business
almost nobody covers, explicitly declines the pitch they're expecting and are tired of, names a
real structural problem in their market, offers alignment rather than a fee, and ends on a
question rather than an ask.

**Raise the conflict yourself, in the same breath.** "Obviously if we invest in a token we also
quote, you'll want that handled properly — segregated inventory, full visibility into the book
through our reporting layer, and we're comfortable with a lock-up so we can't exit through our own
quotes." Saying it first converts the objection into evidence of seriousness. Waiting for them to
raise it converts it into a red flag.

Then run the Tier 1 questions. If Q1 comes back "no secondary market contemplated" for NOVA, the
Ventures partnership is unaffected — keep going. If *both* stall, fall back to H2, the measurement
layer, and treat the meeting as intelligence gathering.

---

## 8. The decision this memo exists to inform

> **Is there actually a problem DRK can solve here, and if so, what is the smallest commercially
> valuable product DRK could sell first?**

**Is there a problem?** Yes — but not the one the treasury headline suggests. The Bitcoin
acquisition problem is real for Metaplanet and unwinnable for DRK. What is real and winnable is
that **Metaplanet is funding and issuing an entire ecosystem of tradable Bitcoin-linked
instruments — Ventures portfolio tokens, JPYC, NOVA credit — into a market that is excellent at
issuance and terrible at secondary liquidity.** That is DRK's product, and Ventures makes it
recurring rather than a one-off.

**Smallest commercially valuable first product — three candidates, in order:**

1. **JPYC pair liquidity.** The fastest thing DRK could actually be doing. A live token on three
   EVM chains DRK already supports, with Metaplanet now a shareholder — so the introduction is
   warm and the mandate is small enough to start on a seed balance sheet. It proves DRK works
   before anyone has to sign anything larger.

2. **A standing liquidity-partner agreement with Metaplanet Ventures**, with a co-investment right
   attached. No revenue on day one, but it is the highest-value signature in this memo: it makes
   DRK the default market maker across a ¥4B fund's portfolio for years, with an equity leg on
   each name.

3. **A paid liquidity-readiness assessment for the first Project NOVA instrument.** Small, fast,
   low-risk. DRK models what continuous two-way liquidity in a Bitcoin-backed tokenised bond
   actually requires — inventory, spread, venue, settlement, risk — and delivers a specification.
   Metaplanet gets a decision-ready document; DRK gets paid, gets the data, and **earns incumbency
   on the mandate that follows.**

Fallback if all three stall: the fixed-fee Licensed Runtime as a reporting and execution-measurement
layer over the treasury and options book. No licence, no capital, no custody — DRK's existing
product with the trading switched off.

**What DRK must not do:** offer principal liquidity, offer BTC block execution, or describe the
Bitcoin Income Generation business as market making. Any of the three converts a credible
technology conversation into a non-credible balance-sheet one.

**Prerequisite before any proposal:** a Japanese financial-regulatory opinion on whether DRK, as an
unregistered foreign technology and liquidity-operations vendor, can operate beneath a Type I firm
without itself requiring registration under the 2026 FIEA amendments. **The answer to that
question determines whether H1 exists at all.**

---

## Sources

Primary:
- [Metaplanet — Vision, Mission & Strategy](https://metaplanet.jp/en/about)
- [Metaplanet — Bitcoin Strategy Analytics](https://analytics.metaplanet.jp/?lang=en) *(JS-rendered; not machine-readable — pull figures from the IR PDFs)*
- [Metaplanet — Notice of Additional Purchase of Bitcoin, 2 Apr 2026 (PDF)](https://metaplanet.jp/disclosure/en/20260402T160721Z-_4_2_2026__-_Notice_of_Additional_Purchase_of_Bitcoin___2_.pdf)

Treasury, income generation and results:
- [CoinDesk — Metaplanet buys another $170M of bitcoin, expanding treasury to 43,000 BTC (2 Jul 2026)](https://www.coindesk.com/markets/2026/07/02/metaplanet-buys-another-usd170-million-of-bitcoin-expanding-treasury-to-43-000-btc)
- [Crypto Times — Metaplanet's Bitcoin options income slides 41% in Q2 (2 Jul 2026)](https://www.cryptotimes.io/2026/07/02/metaplanet-reports-41-drop-in-q2-bitcoin-options-income/)
- [Crypto Briefing — Metaplanet reports $11M revenue from Bitcoin income generation in Q2 2026](https://cryptobriefing.com/metaplanet-bitcoin-income-q2-2026/)
- [Bitcoin.com — Metaplanet buys 2,823 BTC for $225M, treasury reaches 43,000 BTC](https://news.bitcoin.com/metaplanet-buys-2823-bitcoins-for-225m-as-treasury-reaches-43000-btc-holdings/)
- [CoinDesk — Operating profit jumps ~1,700% as bitcoin income generation pays off (16 Feb 2026)](https://www.coindesk.com/business/2026/02/16/metaplanet-operating-profit-to-rise-81-in-2026-after-soaring-17-fold-last-year-on-options-writing)
- [CoinDesk — Bitcoin income windfall drives full-year revenue forecast upward (26 Jan 2026)](https://www.coindesk.com/business/2026/01/26/bitcoin-income-windfall-drives-metaplanet-to-revise-full-year-revenue-forecast-upward)

mNAV, buyback and financing:
- [Cointelegraph — Metaplanet turns to Bitcoin leverage for $500M buyback](https://cointelegraph.com/news/metaplanet-bitcoin-leverage-500m-buyback-market-undervalues-stock)
- [Bitbo — Metaplanet paused buys as mNAV discount opened](https://bitbo.io/news/metaplanet-mnav-discount-pause/)
- [CoinDesk — Metaplanet raises $50M in zero-interest bonds (24 Apr 2026)](https://www.coindesk.com/markets/2026/04/24/bitcoin-holder-metaplanet-raises-usd50-million-in-zero-interest-bonds-to-buy-more-btc)
- [CoinDesk — Metaplanet raising $137M to pay down debt and buy more bitcoin (29 Jan 2026)](https://www.coindesk.com/markets/2026/01/29/metaplanet-raises-up-to-usd137m-to-expand-bitcoin-holdings-and-reduce-debt)
- [CoinDesk — $150M perpetual preferred equity at 4.9% yield](https://www.coindesk.com/markets/2025/11/20/metaplanet-announce-usd150m-raise-through-perpetual-preferred-equity-with-4-9-yield)
- [TradingKey — Metaplanet postpones listing of preferred shares](https://www.tradingkey.com/analysis/cryptocurrencies/btc/261893571-crypto-bitcoin-btc-strategy-mstr-metaplanet-saylor-strk-strf-strd-tradingkey)
- [CryptoSlate — Metaplanet burned through 83% of a $500M credit line](https://cryptoslate.com/metaplanet-burned-through-83-of-a-500-million-credit-line-to-build-43000-btc-and-now-it-wants-investors-to-fund-the-next-leg/)

Metaplanet Ventures, Asset Management and the JPYC investment:
- [The Block — Metaplanet launches VC and asset management subsidiaries, bets on Japanese stablecoin JPYC](https://www.theblock.co/post/393329/metaplanet-vc-asset-management-subsidiaries)
- [Decrypt — Metaplanet deepens Bitcoin strategy with $25M investment plan, new venture arm](https://decrypt.co/360812/metaplanet-bitcoin-strategy-new-venture-arm-investment-plan)
- [Bitcoin Magazine — Metaplanet expands Bitcoin strategy with two new subsidiaries](https://bitcoinmagazine.com/news/metaplanet-expands-bitcoin-strategy)
- [Crypto Times — Capital Group takes 10.63% stake in Metaplanet (21 Jul 2026)](https://www.cryptotimes.io/2026/07/21/3-3-trillion-capital-group-deepens-bitcoin-exposure-with-major-stake-in-metaplanet/)

Project NOVA, Metaplanet Securities and RWA:
- [CoinDesk — Metaplanet acquires Siiibo Securities in $13.1M deal (12 Jun 2026)](https://www.coindesk.com/markets/2026/06/12/metaplanet-buys-siiibo-securities-to-accelerate-bitcoin-financial-ecosystem-plans)
- [Crypto Briefing — Metaplanet plans bitcoin-backed Bitbonds with 4%–6% yields (Project NOVA)](https://cryptobriefing.com/metaplanet-bitbonds-bitcoin-backed-yields-project-nova/)
- [Crowdfund Insider — Metaplanet advances exploration of Bitcoin-backed digital credit products (Jul 2026)](https://www.crowdfundinsider.com/2026/07/294123-metaplanet-advances-exploration-of-bitcoin-btc-backed-digital-credit-products/)
- [Cryptonomist — Metaplanet Bitcoin Securities: 43,000 BTC to back Japan digital bonds (13 Jul 2026)](https://en.cryptonomist.ch/2026/07/13/metaplanet-bitcoin-securities-launch/)
- [Yahoo Finance — Siiibo Securities to rebrand as Metaplanet Securities on 13 July](https://finance.yahoo.com/markets/crypto/articles/japan-siiibo-securities-rebrand-metaplanet-182855566.html)
- [BeInCrypto — Metaplanet pays $13M for licence to sell Bitcoin yield products in Japan](https://beincrypto.com/metaplanet-siiibo-securities-bitcoin-yield/)

Progmat, JPYC and Japanese market structure:
- [Avalanche — Progmat migrates $2B+ of tokenized securities to Avalanche](https://www.avax.network/about/blog/progmat-migrates-2b-tokenized-securities-to-avalanche)
- [Fintech Observer — Progmat unveils roadmap for on-chain equities and legislative proposals in Japan](https://www.fintechobserver.com/progmat-unveils-roadmap-for-on-chain-equities-and-legislative-proposals-in-japan/)
- [Ledger Insights — JPYC extends Series B to $38M](https://www.ledgerinsights.com/japanese-yen-jpyc-stablecoin-issuer-extends-series-b-to-38m/)
- [So & Sato — Japan's 2026 FIEA Amendment Bill: overview and practical implications](https://innovationlaw.jp/en/japans-2026-fiea-amendment-bill/)
- [Global Legal Insights — Blockchain & Cryptocurrency Laws & Regulations 2026: Japan](https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/japan/)

Market context:
- [Fortune — Current price of Bitcoin for 12 August 2026](https://fortune.com/article/price-of-bitcoin-08-12-2026/)
