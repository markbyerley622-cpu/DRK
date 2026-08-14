# DRK — Liquidity Infrastructure for Tokenised Real-World Assets

### Metaplanet as the anchor deployment

**Status: strategic hypothesis and meeting preparation. Not deck-ready fact.**
Most of what follows about Metaplanet is inferred from public 2026 disclosures. §13 separates what
is verified from what is assumed. Nothing in the assumed column should reach an investor deck or a
Metaplanet meeting as a stated fact.

**Read §16 before writing any external copy from this document.** It sets the language discipline
that keeps the category and the mechanisms apart.

---

## How to use this document

**This is a source of truth, not presentation material.** It is deliberately longer, more cautious
and more internal than anything that should be shown to an investor. Do not turn sixteen sections
into sixteen slides.

**Extract roughly eight ideas for a deck:**

| # | Slide | Source |
|---|---|---|
| 1 | The RWA liquidity problem | §1 |
| 2 | DRK's liquidity infrastructure | §0, §2 |
| 3 | The four engines | §2 |
| 4 | Why permissioned RWAs need a different liquidity architecture | §4 |
| 5 | Metaplanet as the anchor deployment | §3 |
| 6 | JPYC → NOVA → ecosystem expansion | §5 |
| 7 | The capital progression | §8 |
| 8 | End state: RWA liquidity infrastructure | §6, §11 |

**Keep out of anything investor-facing:** the hypothesis register (§13), the regulatory caveats, the
detailed liquidity-path taxonomy, the gating questions, the "what not to say" list (§15), the
language-discipline table (§16), and every appendix TSV. Those exist so the deck can be *built*
safely — they are not the deck.

**Lead with the category, never with the counterparty.** The deck opens on the RWA liquidity problem
and DRK's answer to it. Metaplanet appears at slide 5, as a high-value first deployment. Leading
with Metaplanet makes DRK look like a vendor chasing one account; leading with the category makes
DRK look considerably larger than the opportunity currently being discussed.

### The whole story, compressed

    Tokenisation creates assets.
    Institutions create demand.
    DRK makes the assets liquid between them.

    Fair Value → Liquidity → Risk → Execution → Settlement → Reporting

    JPYC → NOVA → Metaplanet Ventures → broader RWA market

Request-for-quote is absent from that summary and present throughout the product. That is exactly
where it belongs.

---

## 0. The thesis

> **DRK is building liquidity infrastructure for tokenised real-world assets — combining pricing,
> inventory, execution, risk and permissioned onchain liquidity so institutional RWAs can actually
> trade.**

And then, separately:

> **Metaplanet is a particularly strong first use case, because its Bitcoin treasury, JPYC
> relationship, regulated securities platform and tokenised-credit ambitions create the complete
> environment for this infrastructure.**

Metaplanet is the proof point. It is not the company thesis.

Two framings to keep out of the document and out of the room:

| Do not say | Why |
|---|---|
| "DRK wants to become Metaplanet's RFQ provider" | Sells a mechanism as a business, and a small one |
| "DRK becomes the liquidity layer for Metaplanet's digital credit" | Better, but still ties the category to one counterparty |

---

## 1. The problem tokenisation has not solved

> **Tokenisation has made issuance and settlement increasingly practical.
> The harder unsolved problem is secondary liquidity.**

That phrasing is deliberate and should be used verbatim externally. The stronger version — that
tokenisation *solved* issuance and settlement, and that onchain issuance is *routine* — is easy to
challenge in a room containing anyone who has actually issued one. The softer claim carries the same
thesis and is far harder to attack.

Nothing about putting an asset on a chain creates a secondary market for it.

⚠ **Needs verification before external use:** the widely-repeated observation that Japan's tokenised
securities issue at scale and then barely trade. Progmat's cumulative issuance figures are public;
**secondary turnover is not something DRK has verified**, and it is the load-bearing statistic in
this section. Source it before it appears in a deck or a meeting. If it cannot be sourced, make the
point structurally rather than numerically — the three reasons below stand on their own.

The reason is structural rather than a demand or marketing problem:

- Regulated instruments cannot use the liquidity primitives crypto built — permissionless pools
  require permissionless transfer, and these assets do not have it.
- Traditional liquidity providers have no reason to build permissioned onchain infrastructure for
  instrument sizes that are still small.
- So assets are issued well and then sit.

An asset that does not trade prices worse at issue, caps issue size, and constrains every subsequent
issue behind it. **The bottleneck in RWA is increasingly liquidity rather than issuance.**

That gap is the category DRK is building into.

---

## 2. What DRK is building

Four engines. They are the product, and they are asset-agnostic.

    ┌─────────────────────────────────────────────────────┐
    │  FAIR VALUE ENGINE    what should this be worth?    │
    │  LIQUIDITY ENGINE     how should we provide it?     │
    │  RISK ENGINE          what are we carrying?         │
    │  EXECUTION + SETTLE   how does it actually clear?   │
    └─────────────────────────────────────────────────────┘

The second one is the important one, and it is the reason this is not a request-for-quote business.
The liquidity engine's job is to **choose the mechanism** — principal inventory, external liquidity,
agency execution, request-for-quote, just-in-time liquidity, a permissioned venue, or issuer
redemption liquidity — based on the asset, the size, the counterparty and the conditions.

> ## Any single one of those mechanisms is a feature.
> ## **The engine that selects between them is the product.**

That sentence is the conceptual moat. It is why DRK is not another market maker, not a
request-for-quote provider, and not a liquidity pool — and it should be the visually dominant idea
wherever this story is told.

Once those four engines exist, the assets they can price and make liquid include tokenised bonds,
structured credit, Bitcoin-backed notes, regulated stablecoins, and whatever the next issuer brings.
Built once, deployed repeatedly.

---

## 3. Why Metaplanet is the right first deployment

Very few organisations contain a whole RWA environment. Metaplanet contains one: the collateral, the
credit product, the licensed distribution, the settlement rail, and a fund creating more issuers.

Confirm each line against Metaplanet's own IR filings before using it in a meeting.

| Piece | What it is | Role in the deployment |
|---|---|---|
| **Metaplanet Inc.** | TSE: 3350. 43,000 BTC. Primary KPI is BTC Yield — Bitcoin *per share* | The collateral |
| **Project NOVA** | Bitcoin-backed digital credit: bonds and structured credit using BTC as collateral or credit enhancement | **The flagship tokenised-credit asset** |
| **Metaplanet Securities** | Formerly Siiibo, acquired ¥2.1B, rebranded 13 Jul 2026. **Type I Financial Instruments Business licence** | The regulated principal |
| **Progmat** | Japan's dominant security-token platform. ~¥439.6B AUM, ~63% of cumulative domestic ST issuance. MUFG / Mizuho / SMBC / BlackRock Japan. **Migrating $2B+ to Avalanche — EVM** | The venue and the rails |
| **JPYC** | Japan's first licensed yen stablecoin. Type II funds-transfer licence. **Avalanche, Ethereum, Polygon**. ~¥2.5B cumulative issuance as of May 2026 | **The settlement-liquidity wedge** |
| **Metaplanet Ventures** | ¥4B (~$25M) into Japanese Bitcoin infrastructure — stablecoins, lending, payments, derivatives, custody, compliance. Plus incubator and grants. First cheque: ¥400M into JPYC | **The pipeline of future issuers** |
| **Metaplanet Asset Management** | Miami. Digital credit and Bitcoin capital markets | Outside the Japanese perimeter — the easiest legal door |

The single most useful fact for DRK: **Progmat is going EVM.** Every chain DRK already supports
becomes relevant to Japan's largest security-token platform.

### 3.1 The rest of the group, for context

Not deployment surfaces, but they shape who DRK is dealing with.

| Piece | Detail | Why it matters |
|---|---|---|
| **Bitcoin Income Generation** | An options-writing book — premiums from collateral-secured Bitcoin options, run in a segregated portfolio separate from the treasury. Q1 FY26 ¥2.969B, Q2 ¥1.747B (**−41% QoQ** on compressed implied volatility), H1 ¥4.717B, FY guidance ≈¥16B | Proves Metaplanet already runs a derivatives book. **Never describe it as market making** — it is not, and saying so signals DRK has not read them |
| **EVO FUND** | Evolution Financial Group (Cayman). Anchored every zero-coupon bond series, including the 20th — ¥8B (~$50M), issued 24 Apr 2026, matures Apr 2027 | They already have a captive financing counterparty. DRK is joining a roster, not filling a vacuum |
| **Preferred equity** | Two-tier: **MARS** (Class A senior, monthly adjustable dividend) and **MERCURY** (~$150M, ~4.9% yield). ⚠ At least one report says a preferred listing was **postponed** — verify before referencing | Sophisticated capital structure; institutional counterparties throughout |
| **Capital Group** | Largest shareholder at 10.63% (~$203M), as of 13 Jul 2026 | A $3.3T asset manager validating the equity. Raises the bar on vendor diligence |
| **Bitcoin Magazine Japan / Tokyo hotel** | Exclusive licence; legacy operating business | Immaterial to this opportunity |

### 3.2 Counterparty position and timing

**This is context for DRK's own expectations, not material for a meeting.** It explains why the
conversation is worth having now, and it should change how DRK pitches — not what DRK says.

| Metric | Value |
|---|---|
| BTC held | 43,000 (Q2 FY2026 close) |
| Q2 FY2026 purchase | 2,823 BTC |
| Reported average cost basis | ¥15.3M / BTC (≈$100k) |
| Stated target | 210,000 BTC by end-2027 (≈1% of supply) |
| Rank | 3rd-largest listed corporate holder |
| BTC spot | ~$64,085 on 12 Aug 2026, down from ~$93,000 at the start of the year |

Against that cost basis the treasury is materially underwater, and their own actions show it: mNAV
fell below 1.0x, they ran a **$500M buyback** (window 29 Oct 2025 – 28 Oct 2026) backed by a $100M
Bitcoin-collateralised loan and a $500M credit line, and accumulation was **paused** through the
discount while the 210,000 BTC target was publicly maintained.

Because the KPI is Bitcoin *per share*, buying back discounted stock raises it more efficiently than
buying spot. **The KPI mechanically turns them from a Bitcoin buyer into a share buyer when the
discount opens.**

⚠ The unrealised-loss arithmetic is DRK's own, from published inputs — **not a Metaplanet
disclosure.** Never state it in a meeting. Use it to calibrate expectations only.

**Read this correctly.** It does not mean Metaplanet is in trouble — they bought 2,823 BTC in Q2 and
are expanding aggressively into financial products. It means the centre of gravity has moved from
*"buy Bitcoin with equity"* to *"build a Bitcoin financial business."* **That move is the entire
reason this deployment is available**, and it is the opposite of a treasury-execution pitch.

---

## 4. What makes tokenised RWAs different to make liquid

Three differences, and each one changes the build. This is the technical case for why a crypto
liquidity provider cannot simply point its existing stack at these assets — and why a traditional
credit desk cannot either.

**1. The asset has a calculable fair value.**
You are not discovering a price. You are modelling one and quoting around it. That is a different
discipline from token market making, and it is the fair-value engine's entire job.

**2. Collateral dynamics can feed the credit.**
Where collateral coverage is incorporated into the credit structure, changes in the collateral
asset's price feed into coverage and therefore into the instrument's risk and pricing. For
Bitcoin-backed credit that means a liquidity provider may carry **credit risk and collateral-asset
delta simultaneously.** See §5, Layer 2c — this is the differentiator, and §13 for why the exact
mechanism is still a hypothesis.

**3. Transfer is permissioned, not free.**
Progmat security tokens are FIEA financial instruments. Holders are whitelisted, transfers are
restricted, eligibility is enforced at the contract level. An inventory wallet has to be an approved
holder and settlement has to respect the restriction logic.

That third point is the biggest departure from anything DRK has quoted before, and it is precisely
why the crypto-native playbook does not transfer. It is also why this is defensible once built.

---

## 5. The three layers

---

### LAYER 1 — RWA settlement and stablecoin liquidity

**The wedge, and the foundation.** Regulated stablecoins are the cash leg of every tokenised-asset
trade. If the settlement asset is illiquid, nothing above it can clear efficiently — so this layer
is not a warm-up, it is load-bearing.

At Metaplanet, this means **JPYC**:

    JPYC / USDC
    JPYC / USDT
    JPYC / BTC
    JPYC / ETH
    on Avalanche, Ethereum, Polygon

Why it is the right first move:

- Already live — no dependency on the NOVA timetable
- EVM, on chains DRK already supports
- Permissionless — no FIEA perimeter, no licence question to resolve first
- Fundable on a $1.5M balance sheet
- Metaplanet Ventures is a **shareholder** in JPYC, so the introduction is warm
- Useful to Metaplanet **whether or not** tokenised-credit secondary trading ever happens

It also changes the ask. Not *"give us your new regulated securities market"* but *"we can improve
liquidity around the settlement asset everything else is built on."*

Generalises immediately: the same capability applies to any regulated stablecoin on any RWA rail.

**Honest limitation:** JPYC cumulative issuance was around ¥2.5B as of May 2026. A real mandate, a
small one today. Its value is that it is startable now and it buys position.

---

### LAYER 2 — Tokenised credit and RWA liquidity

The strategic layer. Five components, and they are a stack, not a menu.

#### 2a — Fair-value engine · *what should this be worth?*

    Reference yield curve
    Credit spread
    Maturity and next coupon
    Collateral value
    Collateral coverage ratio
    Underlying collateral asset price (BTC, for NOVA)
    Available liquidity
    Inventory position
    Trade size relative to issue outstanding
    Market conditions
        → modelled fair value

#### 2b — Liquidity engine · *how should DRK provide it?*

**This is the component that makes DRK infrastructure rather than a desk.** Given a fair value and a
request, it selects the provision path:

    ├─ DRK principal inventory        own the risk, quote firm
    ├─ External liquidity             source from other holders
    ├─ Agency execution               arrange without warehousing
    ├─ Request-for-quote              size-specific firm pricing
    ├─ Just-in-time liquidity         expose inventory only on demand
    ├─ Permissioned venue             eligibility-enforced onchain
    └─ Issuer / redemption liquidity  primary-secondary arbitrage

Selection is driven by size, urgency, counterparty eligibility, inventory position, collateral
volatility, and what DRK's balance sheet can carry that day. **At seed scale the engine simply
routes away from the principal branch** — the architecture does not change when DRK is
capitalised, only the paths it can select.

That property is what makes this fundable now and valuable later.

#### 2c — Risk engine · *what is DRK carrying?*

Continuous, not end-of-day:

    Inventory position
    Duration
    Credit exposure
    Collateral coverage
    Collateral-asset delta (BTC)
    Liquidity imbalance
    Counterparty eligibility
    Settlement risk

**The collateral-dynamics differentiator.** Be precise about this claim:

> ~~"DRK can hedge Bitcoin."~~ — plenty of firms can hedge BTC. Not a differentiator.

> **DRK can incorporate collateral dynamics directly into the liquidity and risk engine for tokenised
> credit.**

The loop, and this is the thing to draw on a whiteboard:

    Collateral asset price (BTC)
        →  collateral coverage ratio
            →  credit / risk adjustment
                →  fair value
                    →  executable quote
                        →  hedge requirement
                            →  inventory adjustment

That is digital-credit market infrastructure. It is not a crypto trading bot and must not be
described like one. A provider that closes that loop can price tighter than a credit desk treating
the collateral leg as someone else's problem.

⚠ **Externally, present this as a structural capability, not as a mechanical description of any
specific instrument.** How coverage actually feeds the credit will be set by the instrument's own
documentation, which DRK has not seen. Safe phrasing:

> **"Where collateral coverage is incorporated into the credit structure, changes in Bitcoin can
> feed into collateral coverage and therefore into the instrument's risk and pricing — and our
> engine is built to carry that through to the quote."**

The loop above is what DRK's engine *can model*. Whether a given instrument works that way is a
question for the issuer, not a claim for DRK.

Live relevance: BTC traded around $64,000 in mid-August 2026 against Metaplanet's reported cost
basis near ¥15.3M per coin. Collateral coverage is not theoretical for this programme.

#### 2d — Execution · *how does it clear?*

**Institutional execution through request-for-quote, bilateral pricing and permissioned
just-in-time liquidity.** Three paths, selected by 2b, settled DVP through the regulated principal.

None of these is the product. They are how the product delivers.

#### 2e — Permissioned onchain liquidity · *the long-term product*

    Offchain proprietary pricing
    +
    Onchain settlement contract enforcing eligibility
    +
    Controlled inventory

> **A permissioned liquidity layer for regulated RWAs, where eligibility, pricing and settlement are
> enforced together.**

Liquidity is exposed only when a valid, eligible transaction is presented — which is what a
regulated instrument requires anyway. **The regulatory constraint and the proprietary-liquidity
design point in the same direction.** That is a genuinely strong thing to be able to say to a
regulated counterparty, and it is the defensible end-state product.

> ### ⚠ Do not propose a public AMM pool for security tokens
>
> A permissionless constant-product pool requires anyone to hold and transfer the asset. Progmat STs
> have whitelisted holders and contract-enforced transfer restrictions. An open pool is likely
> **incompatible with the regulatory design**, not merely inadvisable.
>
> Knowing this is a credibility asset. Walking into a Japanese regulated securities business and
> saying "let's put the bond in a liquidity pool" ends the conversation. Saying **"permissioned
> liquidity — proprietary pricing offchain, eligibility and settlement enforced onchain"** does the
> opposite.
>
> Also avoid "dark pool." It implies concealment is the objective.

---

### LAYER 3 — RWA ecosystem liquidity

Where a deployment becomes a position.

The same four engines, pointed at every subsequent issuer:

- Metaplanet Ventures portfolio companies
- Future Metaplanet tokenised assets beyond the first NOVA issue
- Additional issuers on Progmat
- Additional security-token platforms and RWA rails

Ventures is the near-term mechanism. It is deploying ¥4B across stablecoins, lending, payments and
derivatives — sectors that issue assets. A fund can write the cheque but cannot make the market.

    Standing agreement: DRK is the default liquidity partner for any
    Ventures portfolio company or incubator graduate that issues an asset
    +
    DRK co-invests alongside Ventures on the same terms

One signature, N mandates over the life of the fund, each with an investment leg.

**Why it compounds.** Providing liquidity gives DRK live order-flow data on its own portfolio —
better information than any passive investor has, and it improves both the pricing and the
investment decision.

**Why the counterparty should want it.** A liquidity partner with equity in the outcome does not
walk away when an asset is thin. Incentives align in the direction an issuer actually cares about.

**Raise the conflict first, unprompted.** Holding a position in an asset you also price is standard
in crypto and analogous to sponsor-plus-designated-liquidity in traditional listings — but it must
be documented, not assumed:

- Segregate inventory from the investment position
- Client visibility into the traded book through DRK's reporting layer
- A lock-up on the investment leg so DRK cannot exit through its own pricing

Saying it first reads as seriousness; being asked reads as a red flag.

**Where it applies best:** private, pre-issuance companies — portfolio and incubator names — where
DRK can negotiate both legs in one agreement before anyone else is at the table.

**Where it does not apply:** regulated instruments such as the NOVA issues, where holding and
pricing the same FIEA security is a materially harder conversation, and anything touching the BTC
treasury.

**Capital reality check.** At a $1.5M raise the investment leg means small tickets in early rounds —
not meaningful cheques into a Series B. Be honest about size, or the offer reads as bluff.

---

## 6. Where DRK sits

The visual concept: **DRK sits between tokenised assets and institutional capital.**

    METAPLANET
    ─────────────────────────────
    Bitcoin Treasury
        ↓
    Digital Credit / Tokenised RWAs
        ↓
    Metaplanet Securities
        ↓
    Progmat / EVM
        ↓
    JPYC / Settlement

              ↓

    DRK — RWA LIQUIDITY LAYER
    ─────────────────────────────
    Fair Value  →  Liquidity  →  Risk  →  Execution  →  Settlement  →  Reporting

              ↓

    INSTITUTIONAL CAPITAL
    ─────────────────────────────

Metaplanet builds the assets. Institutions want to hold them. **The layer that makes those two
things meet is missing, and that is what DRK builds.**

---

## 7. Worked example — the liquidity engine deciding

An institution wants to exit ¥50M face of a tokenised credit instrument before maturity. There is no
continuous public market.

    1  FAIR VALUE     curve, credit spread, maturity, coupon,
                      collateral coverage, BTC price
                      → 98.30, implied yield 5.4%

    2  RISK           eligibility confirmed, inventory capacity
                      checked, resulting collateral delta computed

    3  LIQUIDITY      size is large relative to issue outstanding;
                      DRK inventory insufficient at current capital
                      → route: AGENCY + external holders
                      (at scale, this branch would select PRINCIPAL)

    4  EXECUTION      firm quote issued, 30-second window

    5  SETTLEMENT     DVP through the regulated principal

    6  POST-TRADE     collateral hedge adjusted, inventory
                      rebalanced, execution reported

Two details worth pointing at in a meeting.

**The quote window is 30 seconds, not five.** A bond quote does not need five-second expiry — but
the **collateral leg moves**, so the window is set by how fast BTC can gap, not by how fast the bond
can. That single detail demonstrates the instrument has been understood properly.

**Step 3 is the product.** Same request, same engine, different answer as DRK's capital grows. The
architecture does not change; the available branches do.

---

## 8. Why the $1.5M raise fits this strategy

The point is not *"DRK cannot afford to warehouse a bond."* Framed that way it is an apology.

The point is:

> **DRK can build the RWA liquidity infrastructure before it needs institutional-scale principal
> capital.**

**At seed scale, DRK builds and operates:**

- The fair-value engine
- The risk engine
- The liquidity engine, routing to non-principal branches
- Integrations with rails, venues and issuers
- Regulated stablecoin liquidity (Layer 1)
- Agency and sourced liquidity
- Permissioned execution support
- Reporting and reconciliation

**Then, as demand is proven and capital is raised:**

- Warehouse inventory
- Quote as principal
- Quote in larger size
- Operate permissioned just-in-time liquidity
- Become the designated liquidity layer across an ecosystem

The infrastructure is the moat and it is buildable now. The balance sheet is an accelerant and it
comes later. That is a credible capital progression rather than a gap to be excused.

### 8.1 The asymmetry, stated honestly

Internal only. Skepticism has to point at DRK too, and walking in without having priced this in is
how a good thesis dies in the first ten minutes.

| | Metaplanet | DRK |
|---|---|---|
| Balance sheet | ~$2.75B in BTC | raising **$1.5M** seed |
| Track record | 3rd-largest listed corporate BTC holder | **2 launches**, Jul–Aug 2026 |
| Evidenced economics | ¥4.7B H1 revenue from the options book | **$40k+** captured across both launches |
| Regulatory standing | Type I FIEA licence, TSE-listed | none |
| Counterparties | EVO FUND, Capital Group, MUFG-adjacent consortium | undisclosed |

What follows from it:

1. **Principal liquidity at institutional size is not available to DRK today.** Offering it damages
   credibility permanently. The liquidity engine (§5, 2b) exists partly so DRK never has to.
2. **Treasury execution is a commodity DRK has no edge in.** Metaplanet already moves nine-figure
   Bitcoin blocks through established counterparties. There is no story there — see §15.
3. **Vendor diligence will be demanding.** A TSE-listed company with a Type I subsidiary and a $3.3T
   asset manager on the register will run counterparty checks DRK may not currently clear on size,
   audit history or insurance. **Ask early what the threshold is** rather than discovering it late.
4. **The credible asset is the infrastructure, not the balance sheet.** DRK's operating stack —
   client-owned wallets, client-held permissions, real-time visibility, attribution, DRK running the
   engine and never the custody — is the shape most likely to be procurable by a regulated
   counterparty from an external vendor. **Whether that structure is permissible here remains
   subject to legal validation (§9, §13).**

The strategic consequence: approach as a technology and liquidity-infrastructure partner operating
beneath the licensed entity — not as a counterparty sitting across from the treasury.

---

## 9. Division of responsibilities

**Metaplanet Securities — Type I FIEA licence**

- Issuance, structuring, redemption
- Distribution to Japanese investors
- Eligibility, KYC/AML, whitelisting
- Disclosure and regulatory relationships
- The collateral and reserve relationship
- **The regulated principal on any transaction DRK's engines price**

**DRK**

- Fair-value modelling
- Liquidity provision and path selection
- Inventory, exposure and collateral risk
- Institutional execution and permissioned liquidity
- Reconciliation and reporting

DRK's existing product already separates wallets, liquidity, execution, risk and reporting into a
proprietary operating stack with client-owned custody. That separation is what makes this division
possible at all.

**The intended structure, stated as an intention rather than a conclusion:**

> The proposed architecture is designed to place regulated issuance, investor eligibility and
> securities activity with the appropriately licensed Japanese entity, while DRK provides technology
> and liquidity infrastructure — **subject to legal and regulatory validation.**

⚠ **Do not state that DRK never needs to be a regulated entity.** That is the conclusion a Japanese
regulatory opinion would reach, not a premise DRK may assert. It is a gating unknown in §13, and
claiming it as settled in a room with a Type I firm is exactly the kind of overreach that ends a
partnership conversation. The same applies to any framing of DRK's lack of a Japanese licence as an
advantage: until counsel confirms the structure, it is an open question, not a feature.

The architectural shape — engines underneath, licence on top — is portable to the next issuer, on
the next platform, in the next jurisdiction, **if it validates.**

---

## 10. Commercial structure

    Infrastructure retainer
    Maintains the engines, integrations, operators and availability

    +

    Execution and routing fees
    Earned without principal capital

    +

    Bid-ask spread
    Earned on principal risk, once capitalised

    +

    Per-asset liquidity mandate fee
    Recurring, repeats on every new issue

    +

    Risk and collateral monitoring fee
    Priced as infrastructure, not as trading

    +

    Ecosystem: liquidity economics plus co-investment
    Two revenue lines from one relationship

    +

    Issuance, redemption and distribution economics
    Retained by the licensed issuer

---

## 11. The progression, deck-ready

**1 — The RWA problem.** Tokenisation has made issuance and settlement increasingly practical. The
harder unsolved problem is secondary liquidity.

**2 — The DRK solution.** The liquidity layer that makes tokenised assets institutionally usable.

**3 — First wedge.** Regulated stablecoin liquidity — JPYC.

**4 — First institutional RWA.** Metaplanet NOVA, tokenised credit.

**5 — Liquidity intelligence.** Fair value + inventory + collateral + risk.

**6 — Permissioned liquidity.** Just-in-time, request-for-quote, bilateral, and eventually principal.

**7 — Ecosystem.** Metaplanet Ventures and additional RWA issuers.

**8 — End state.** DRK becomes infrastructure for the liquidity of tokenised real-world assets.

---

## 12. Ranking

Scores are the operator's own assessment, re-cut onto the layer architecture.

| Capability | Layer | DRK fit | Capital required | Strategic value |
|---|---|---|---|---|
| Regulated stablecoin liquidity (JPYC) | 1 | 9/10 | Low | High |
| Agency and sourced liquidity on tokenised credit | 2b / 2d | 10/10 | Low | Very high |
| Collateral and risk engine | 2c | 9/10 | Low | Very high |
| Principal liquidity on tokenised credit | 2b / 2d | 8/10 | High | Very high |
| Permissioned onchain liquidity venue | 2e | 10/10 | Medium | Extremely high |
| Ecosystem liquidity partnership | 3 | 10/10 | Low / medium | Extremely high |
| Full-stack RWA liquidity infrastructure | 1–3 | 10/10 | Eventually high | Exceptional |

---

## 13. Hypothesis register — what is NOT confirmed

**Read this before any of the above goes in front of anyone.** These are good hypotheses. They are
not confirmed commercial requirements, and presenting them as fact is how a strong position becomes
an embarrassing meeting.

| Claim | Status |
|---|---|
| The exact NOVA structure | **Assumed** |
| The 4–6% yield figure | **Assumed** — widely reported, not confirmed against filings |
| Whether BTC is collateral vs credit enhancement | **Assumed** — materially different, changes the pricing model |
| Whether secondary trading is planned at all | **Unknown — gating for Layer 2** |
| Whether JPYC is the settlement asset for NOVA | **Assumed** |
| Progmat / Avalanche production status | **Assumed** — migration announced, timing unverified |
| Whether an external unlicensed vendor can operate beneath Metaplanet Securities | **Unknown — gating for Layer 2.** Needs a Japanese regulatory opinion, not a guess |
| Whether collateral exposure can be hedged by a liquidity provider | **Unknown** — the structure may prohibit it |
| Whether Metaplanet wants external liquidity provision at all | **Unknown** |
| Whether Ventures portfolio companies can become DRK mandates | **Unknown** |

### Figures that do not reconcile across sources

Separate from the hypotheses above: these are published numbers that **contradict each other.**
Quoting the wrong one in front of the company that issued it is worse than not quoting at all.

| Flag | The problem | Action |
|---|---|---|
| **JPYC ticket size** | One summary reports "up to ¥4B into JPYC." Two primary-quality sources say **¥400M** into the Series B. ¥4B is the **fund** size, not the ticket | Use ¥400M. Verify against the disclosure |
| **Q2 BTC purchase price** | For the same 2,823 BTC, sources give $78,872/BTC, "$170M", "$225M", and ¥12.7M/coin. These cannot all be right | Pull it from Metaplanet's own PDF, not the press |
| **Preferred share listing** | At least one report says the listing was postponed | Verify current status before referencing MARS or MERCURY |
| **Unrealised loss** | Roughly −$1.5B implied by cost basis vs spot — **DRK's arithmetic, not their disclosure** | Never state as fact. Calibration only |
| **Accumulation status** | mNAV below 1.0x and purchases paused during the discount — but 2,823 BTC bought in Q2 2026 | Ask directly rather than assume |

### Why the strategy survives all of it

This is the most important paragraph in the document, and it is a direct consequence of leading with
the category rather than the counterparty.

**The thesis does not depend on any row above being true.** If NOVA secondary trading is delayed, if
NOVA is structured differently, if JPYC is not the settlement asset, if Metaplanet changes its first
issuance entirely — DRK's proposition is unchanged:

> **Build liquidity infrastructure for regulated and tokenised real-world assets, then deploy it
> into the Metaplanet ecosystem where appropriate.**

A Metaplanet-specific pitch dies with any one of those rows. A category-level position does not. It
simply deploys somewhere else first, and Japan's security-token market is projected to exceed ¥1.5T
by the end of 2026 — Metaplanet is the best first deployment, not the only one.

---

## 14. Copy and send this

> Tokenisation has made issuance and settlement for real-world assets increasingly practical. The
> harder unsolved problem is secondary liquidity — instruments get issued well and then trade
> thinly, which prices the next issue worse and caps how large a programme can get.
>
> DRK builds the liquidity layer for tokenised assets: fair-value pricing, inventory and collateral
> risk, institutional execution, and permissioned onchain liquidity — so regulated RWAs can actually
> be traded by institutions.
>
> Metaplanet stands out to us as one of the strongest environments to deploy that, because you have
> the collateral, the credit product, the licensed distribution, the settlement rail and a fund
> creating further issuers — the whole stack in one place. We have mapped what we think the
> liquidity architecture needs to look like, and we would like to validate which layer you actually
> want owned externally.
>
> We see three:
>
> **1. Settlement liquidity.** Depth in JPYC pairs across Avalanche, Ethereum and Polygon, so the
> yen settlement asset underneath everything else is liquid. Available immediately, and useful
> regardless of the tokenised-credit timetable.
>
> **2. Tokenised-credit liquidity.** Fair-value pricing, inventory management, risk, and
> institutional execution for the Bitcoin-backed instruments — starting as agent rather than
> principal, so no balance sheet sits between us and getting started. The differentiating piece is
> that our engine incorporates collateral dynamics directly: the Bitcoin price moves collateral
> coverage, which moves the credit adjustment, which moves fair value and the hedge requirement.
> Most credit desks treat that as someone else's problem.
>
> **3. Ecosystem liquidity.** A standing liquidity partnership across the portfolio companies and
> issuers you fund, with us co-investing alongside where that makes sense, so we carry the same
> outcome you do.
>
> To work out which of those is real, it would help to know:
>
> - Is secondary trading in scope for the first instruments, or are they designed to be held to
>   maturity?
> - Who is expected to provide that liquidity, and has anyone been appointed?
> - Is a liquidity commitment a condition of listing or distribution?
> - Will the instruments settle on Progmat's Avalanche/EVM infrastructure in production, and is JPYC
>   the settlement leg, a traded pair, or both?
> - Expected issue size, timetable, and target investor — retail through Metaplanet Securities, or
>   institutional?
> - Can Metaplanet Securities' Type I licence accommodate an external technology and
>   liquidity-operations vendor operating beneath it?
> - Who provides JPYC pair depth today, and is thin liquidity a constraint on adoption?
> - Does Ventures co-invest with strategic partners, or write whole cheques?

### Further questions — internal bank, not for the first message

Hold these for a second conversation or a technical session. Sending them all at once turns a
partnership discussion into an interrogation.

**On the options / income-generation book** *(this is a derivatives book, not market making — do
not call it market making)*

- Which venues and counterparties does it trade through, and is execution systematic or
  discretionary?
- Q2 revenue fell 41% QoQ on lower volatility. How much of that was premium compression versus
  execution quality, sizing, or roll timing? *(Their answer reveals whether they measure execution
  at all.)*
- Do you measure execution quality on that book — slippage to mid, fill rates, spread capture,
  venue attribution?
- Is the constraint on scaling it liquidity, pricing, risk infrastructure, or mandate?
- Would you value an independent execution-quality and attribution layer over it, separate from the
  desk that runs it?

**On treasury execution** *(ask to understand, never to pitch — see §15)*

- How are BTC purchases executed today, and who owns the execution decision?
- Typical and maximum single order, and over what horizon?
- Are purchases funded in JPY or USD, and is FX part of the execution problem?
- Is market impact measurable today, or is average acquisition price the only benchmark?
- With mNAV having traded below 1.0x, how should we think about the pace of accumulation over the
  next four quarters?

**On procurement**

- What does an external vendor need to clear your counterparty diligence?
- Does DRK ever need to touch custody in any model you would consider, or is a strictly
  non-custodial engine a hard requirement?
- Preferred commercial shape — infrastructure retainer, execution fees, spread economics, or hybrid?

---

## 15. What DRK should not say

**"We want to make markets in BTC."** Metaplanet moves roughly one block per quarter through
counterparties at a scale DRK cannot approach. Raising it signals DRK has misread the business.

**"We'll provide the liquidity."** Not at institutional bond size, not yet. Say what DRK can fund
and let the capital progression in §8 do the work.

**"Let's put the bond in a liquidity pool."** Likely incompatible with FIEA transfer restrictions.
This one specifically costs credibility with a regulated counterparty.

**"Dark pool."** Use *permissioned liquidity*.

**"Your Bitcoin income business is market making."** It is a collateral-secured options-writing book
run in a segregated portfolio. Calling it market making tells them DRK has not read their filings.

**"You never need to be the regulated entity"** — or any variant asserting the licence structure is
settled. See §9.

**Any mechanism as the headline.** See §16.

**Anything from §13 stated as fact.** Frame as hypothesis to be validated — more honest and more
senior.

---

## 16. Language discipline

The category and the mechanisms must never swap places. This is not pedantry: a mechanism sold as a
category reads as a small business, and it is the difference between infrastructure and a desk.

| CATEGORY — headline positioning | MECHANISM — architecture detail only |
|---|---|
| RWA liquidity | Request-for-quote |
| Tokenised-asset liquidity | Just-in-time liquidity |
| Digital-credit liquidity | Principal market making |
| Institutional RWA infrastructure | Agency execution |
| Liquidity infrastructure | Inventory management |
| | Hedging |
| | Permissioned settlement |

Rules:

- Request-for-quote may appear anywhere in the technical architecture. **It may never be the
  headline.**
- Market making may appear as a future capability. It is not what DRK is.
- The top-level story reads, consistently:

      DRK        =  RWA liquidity infrastructure
      Metaplanet =  anchor ecosystem / highest-value first deployment
      NOVA       =  flagship tokenised-credit use case
      JPYC       =  settlement-liquidity wedge
      RFQ        =  one execution mechanism

---

## 17. Sources

Everything about Metaplanet in this document traces to these. **Primary filings beat all of them**
— where a figure matters commercially, pull it from Metaplanet's own IR PDFs before quoting it.

**Primary**
- [Metaplanet — Vision, Mission & Strategy](https://metaplanet.jp/en/about)
- [Metaplanet — Bitcoin Strategy Analytics](https://analytics.metaplanet.jp/?lang=en) *(JS-rendered; not machine-readable — use the IR PDFs)*
- [Notice of Additional Purchase of Bitcoin, 2 Apr 2026 (PDF)](https://metaplanet.jp/disclosure/en/20260402T160721Z-_4_2_2026__-_Notice_of_Additional_Purchase_of_Bitcoin___2_.pdf)

**Project NOVA, Metaplanet Securities and the RWA pivot**
- [Crypto Briefing — Bitcoin-backed Bitbonds with 4–6% yields (Project NOVA)](https://cryptobriefing.com/metaplanet-bitbonds-bitcoin-backed-yields-project-nova/)
- [Crowdfund Insider — Advancing exploration of BTC-backed digital credit (Jul 2026)](https://www.crowdfundinsider.com/2026/07/294123-metaplanet-advances-exploration-of-bitcoin-btc-backed-digital-credit-products/)
- [Cryptonomist — 43,000 BTC to back Japan digital bonds (13 Jul 2026)](https://en.cryptonomist.ch/2026/07/13/metaplanet-bitcoin-securities-launch/)
- [CoinDesk — Metaplanet acquires Siiibo Securities, $13.1M (12 Jun 2026)](https://www.coindesk.com/markets/2026/06/12/metaplanet-buys-siiibo-securities-to-accelerate-bitcoin-financial-ecosystem-plans)
- [Yahoo Finance — Siiibo rebrands as Metaplanet Securities, 13 Jul 2026](https://finance.yahoo.com/markets/crypto/articles/japan-siiibo-securities-rebrand-metaplanet-182855566.html)
- [BeInCrypto — $13M for the licence to sell Bitcoin yield products in Japan](https://beincrypto.com/metaplanet-siiibo-securities-bitcoin-yield/)

**Ventures, Asset Management and the JPYC investment**
- [The Block — VC and asset management subsidiaries; bet on JPYC](https://www.theblock.co/post/393329/metaplanet-vc-asset-management-subsidiaries)
- [Decrypt — $25M investment plan, new venture arm](https://decrypt.co/360812/metaplanet-bitcoin-strategy-new-venture-arm-investment-plan)
- [Bitcoin Magazine — Two new subsidiaries](https://bitcoinmagazine.com/news/metaplanet-expands-bitcoin-strategy)
- [Crypto Times — Capital Group takes 10.63% stake (21 Jul 2026)](https://www.cryptotimes.io/2026/07/21/3-3-trillion-capital-group-deepens-bitcoin-exposure-with-major-stake-in-metaplanet/)

**Treasury, options book and financing**
- [CoinDesk — Another $170M of bitcoin, treasury to 43,000 BTC (2 Jul 2026)](https://www.coindesk.com/markets/2026/07/02/metaplanet-buys-another-usd170-million-of-bitcoin-expanding-treasury-to-43-000-btc)
- [Crypto Times — Bitcoin options income slides 41% in Q2 (2 Jul 2026)](https://www.cryptotimes.io/2026/07/02/metaplanet-reports-41-drop-in-q2-bitcoin-options-income/)
- [Crypto Briefing — $11M revenue from Bitcoin income generation, Q2 2026](https://cryptobriefing.com/metaplanet-bitcoin-income-q2-2026/)
- [Bitcoin.com — 2,823 BTC for $225M, treasury reaches 43,000](https://news.bitcoin.com/metaplanet-buys-2823-bitcoins-for-225m-as-treasury-reaches-43000-btc-holdings/)
- [CoinDesk — Operating profit up ~1,700% on options writing (16 Feb 2026)](https://www.coindesk.com/business/2026/02/16/metaplanet-operating-profit-to-rise-81-in-2026-after-soaring-17-fold-last-year-on-options-writing)
- [Cointelegraph — Bitcoin leverage for a $500M buyback](https://cointelegraph.com/news/metaplanet-bitcoin-leverage-500m-buyback-market-undervalues-stock)
- [Bitbo — Paused buys as the mNAV discount opened](https://bitbo.io/news/metaplanet-mnav-discount-pause/)
- [CoinDesk — $50M zero-interest bonds (24 Apr 2026)](https://www.coindesk.com/markets/2026/04/24/bitcoin-holder-metaplanet-raises-usd50-million-in-zero-interest-bonds-to-buy-more-btc)
- [CoinDesk — $150M perpetual preferred at 4.9%](https://www.coindesk.com/markets/2025/11/20/metaplanet-announce-usd150m-raise-through-perpetual-preferred-equity-with-4-9-yield)
- [TradingKey — Preferred share listing postponed](https://www.tradingkey.com/analysis/cryptocurrencies/btc/261893571-crypto-bitcoin-btc-strategy-mstr-metaplanet-saylor-strk-strf-strd-tradingkey)
- [CryptoSlate — 83% of a $500M credit line drawn](https://cryptoslate.com/metaplanet-burned-through-83-of-a-500-million-credit-line-to-build-43000-btc-and-now-it-wants-investors-to-fund-the-next-leg/)

**Rails, settlement and Japanese market structure**
- [Avalanche — Progmat migrates $2B+ of tokenized securities](https://www.avax.network/about/blog/progmat-migrates-2b-tokenized-securities-to-avalanche)
- [Fintech Observer — Progmat roadmap for on-chain equities](https://www.fintechobserver.com/progmat-unveils-roadmap-for-on-chain-equities-and-legislative-proposals-in-japan/)
- [Ledger Insights — JPYC extends Series B to $38M](https://www.ledgerinsights.com/japanese-yen-jpyc-stablecoin-issuer-extends-series-b-to-38m/)
- [So & Sato — Japan's 2026 FIEA Amendment Bill](https://innovationlaw.jp/en/japans-2026-fiea-amendment-bill/)
- [Global Legal Insights — Blockchain & Cryptocurrency Laws 2026: Japan](https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/japan/)
- [Fortune — Bitcoin price, 12 August 2026](https://fortune.com/article/price-of-bitcoin-08-12-2026/)

---

## Appendix — paste these blocks into Google Sheets

Tab-separated. Select a block from its header row to the end and paste; Sheets splits it into
columns automatically.

Layer	Capability	Asset class	What DRK provides	Capital needed	Regulatory friction	Startable now	DRK fit	Strategic value
1	Settlement and stablecoin liquidity	Regulated stablecoins (JPYC)	Two-way depth across Avalanche, Ethereum, Polygon	Low	Moderate — payments perimeter, not FIEA	YES	9/10	High
2a	Fair-value engine	Tokenised credit	Curve, spread, maturity, collateral-coverage pricing model	None	Low — software	Yes	10/10	Very high
2b	Liquidity engine	All RWA	Selects principal, external, agency, RFQ, JIT, venue or redemption path	None to build	Varies by path	Yes	10/10	Extremely high
2c	Risk engine	Tokenised credit	Inventory, duration, credit, collateral coverage, collateral delta, eligibility	Low if monitoring only	Low — risk infrastructure	Yes	9/10	Very high
2d	Institutional execution — agency	Tokenised credit	Sources and arranges without warehousing	None	High but tractable as agent	On first issue	10/10	Very high
2d	Institutional execution — principal	Tokenised credit	Firm two-way from own inventory	High — one ticket exceeds current balance sheet	High — FIEA securities	No	8/10	Very high
2e	Permissioned onchain liquidity	Tokenised credit	Offchain pricing plus onchain contract enforcing eligibility	Medium	High	No	10/10	Extremely high
3	Ecosystem liquidity	Portfolio and future issuers	Default liquidity partner across issuers, with co-investment	Low / medium, staged	Low — mostly non-FIEA	YES	10/10	Extremely high
X	Public AMM on security tokens	Tokenised credit	n/a	n/a	BLOCKED — incompatible with FIEA transfer restrictions	No	n/a	DO NOT PROPOSE

Fair-value input	Applies to	Why it matters
Reference yield curve	Tokenised credit	Base discount rate for the cash flows
Credit spread	Tokenised credit	Issuer-specific risk premium
Maturity and next coupon	Tokenised credit	Accrual and pull-to-par
Collateral value	Tokenised credit	The enhancement being relied on
Collateral coverage ratio	Tokenised credit	Converts collateral moves into credit adjustment
Collateral asset price (BTC)	Bitcoin-backed credit	Moves coverage, therefore moves the spread
Available liquidity	All	Whether the other side is sourceable
Inventory position	All	Skews the two-way price
Trade size vs issue outstanding	Tokenised credit	Market impact in a thin issue
Counterparty eligibility	Tokenised credit	Whether the trade can legally settle at all
Market conditions and volatility	All	Sets the risk premium in the quote

Liquidity path	When the engine selects it	Capital required	Available to DRK today
Principal inventory	Size within book, urgency high, spread justifies risk	High	No
External liquidity	Other holders exist and can be reached in time	None	Yes
Agency execution	Size exceeds book, counterparty wants arrangement not immediacy	None	Yes
Request-for-quote	Counterparty wants a firm size-specific price	Depends on fill path	Yes
Just-in-time liquidity	Programmatic access needed without standing exposure	Medium	Not yet
Permissioned venue	Multiple eligible counterparties, recurring flow	Medium	Not yet
Issuer / redemption liquidity	Primary-secondary dislocation	Low	Depends on issuer terms

Claim	Status	Consequence if wrong	Does the DRK thesis survive?
Exact NOVA structure	ASSUMED	Pricing model needs rebuilding	YES
4-6% yield figure	ASSUMED	Fair-value anchor moves	YES
BTC is collateral vs credit enhancement	ASSUMED	Materially different pricing model	YES
Secondary trading is planned	UNKNOWN — GATING	Layer 2 delayed at Metaplanet	YES — deploy Layer 2 elsewhere
JPYC is the NOVA settlement asset	ASSUMED	Settlement leg changes	YES — Layer 1 stands regardless
Progmat Avalanche in production	ASSUMED	Integration timeline moves	YES
External vendor can operate under Type I licence	UNKNOWN — GATING	Layer 2 closed at Metaplanet	YES — deploy Layer 2 elsewhere
Collateral exposure can be hedged by an LP	UNKNOWN	Layer 2c becomes monitoring only	YES
Metaplanet wants external liquidity provision	UNKNOWN	Approach shifts to technology licensing	YES
Ventures portfolio can become DRK mandates	UNKNOWN	Layer 3 negotiated per company	YES

Deck step	Message	Depends on
1. The RWA problem	Tokenisation made issuance and settlement practical; liquidity is the harder unsolved problem	Nothing — category-level truth
2. The DRK solution	The liquidity layer that makes tokenised assets institutionally usable	Nothing
3. First wedge	Regulated stablecoin liquidity — JPYC	Startable now
4. First institutional RWA	Metaplanet NOVA tokenised credit	NOVA issuing + licence question
5. Liquidity intelligence	Fair value plus inventory plus collateral plus risk	Build only
6. Permissioned liquidity	JIT, RFQ, bilateral, eventually principal	Volume and a larger raise
7. Ecosystem	Metaplanet Ventures and additional RWA issuers	Ventures appetite
8. End state	DRK is infrastructure for the liquidity of tokenised real-world assets	All of the above

Entity	Type	Relationship to Metaplanet	Date	Size	Role in the DRK deployment	Priority
Metaplanet Inc.	TSE-listed operating company	The parent	-	43,000 BTC	Source of the collateral behind the credit	Context
Project NOVA	BTC-backed digital credit programme	Flagship initiative	Announced 2026-07-10	Target 4-6% p.a.	FLAGSHIP TOKENISED-CREDIT USE CASE — Layer 2	1
Metaplanet Securities	Regulated broker (ex-Siiibo)	Wholly owned, rebranded 2026-07-13	Acquired 2026-06-12	JPY 2.1B	The regulated principal. Not a target — the vehicle	1
Progmat	Security-token platform	Project NOVA joint-study partner	2026-07-10	~JPY 439.6B AUM, ~63% of Japan ST issuance	The venue and rails. Migrating $2B+ to Avalanche (EVM)	1
JPYC Inc.	Yen stablecoin issuer	Metaplanet Ventures' first investment	LOI Mar 2026, close Apr	JPY 400M into Series B	SETTLEMENT-LIQUIDITY WEDGE — Layer 1, startable now	1
Metaplanet Ventures	VC arm	Wholly owned subsidiary	2026-03-12	JPY 4B over 2-3 yrs	PIPELINE OF FUTURE ISSUERS — Layer 3	1
Metaplanet Asset Management	Digital credit / BTC capital markets	Wholly owned subsidiary	2026-03-12	Not disclosed	Outside the Japanese perimeter — easiest legal door	2
Bitcoin Income Generation	Options-writing book	In-house business line	FY2026 ongoing	H1 FY26 JPY 4.717B, Q2 -41% QoQ	NOT market making. Possible risk/attribution surface	3
BTC treasury	Spot Bitcoin	Core balance sheet	2026-07-01	43,000 BTC	DO NOT PITCH — see section 15	Never
EVO FUND	Financier	Anchors every zero-coupon bond series	20th series 2026-04-24	JPY 8B (~$50M)	Context — captive financing already exists	Context
MARS / MERCURY preferred	Perpetual preferred equity	Metaplanet-issued	MERCURY 2025-11-20	~$150M @ ~4.9%	No DRK angle. Listing reportedly postponed - verify	None
Capital Group	Shareholder	Largest holder, 10.63%	2026-07-13	~$203M	Raises the vendor-diligence bar	Context
Bitcoin Magazine Japan	Media licence	Exclusive licence holder	Pre-2026	-	No DRK angle	None
Tokyo hotel	Legacy operating business	Owned	Pre-2024	-	Ignore	None

Reconciliation flag	The problem	Action
JPYC ticket size	One summary says "up to JPY 4B into JPYC"; two better sources say JPY 400M into the Series B. JPY 4B is the FUND size	Use JPY 400M. Verify against the disclosure
Q2 BTC purchase price	Same 2,823 BTC reported as $78,872/BTC, "$170M", "$225M" and JPY 12.7M/coin	Pull from Metaplanet's own PDF, not the press
Preferred share listing	At least one report says the listing was postponed	Verify before referencing MARS or MERCURY
Unrealised loss	Roughly -$1.5B implied by cost basis vs spot. DRK's arithmetic, NOT their disclosure	Never state as fact. Calibration only
Accumulation status	mNAV below 1.0x and purchases paused during the discount, but 2,823 BTC bought in Q2 2026	Ask directly rather than assume
Progmat secondary turnover	Cumulative issuance is public; turnover is not verified, and it is load-bearing in section 1	Source it or make the point structurally

DRK vs Metaplanet	Metaplanet	DRK	Consequence
Balance sheet	~$2.75B in BTC	Raising $1.5M seed	Institutional-size principal liquidity is not available today
Track record	3rd-largest listed corporate BTC holder	2 launches, Jul-Aug 2026	Lead with infrastructure, not with size
Evidenced economics	JPY 4.7B H1 from the options book	$40k+ across both launches	Do not compete on scale
Regulatory standing	Type I FIEA licence, TSE-listed	None	Operate beneath the licence, subject to legal validation
Counterparties	EVO FUND, Capital Group, MUFG-adjacent	Undisclosed	Expect demanding vendor diligence - ask the threshold early
