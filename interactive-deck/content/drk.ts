/**
 * DRK — CENTRAL CONTENT MANIFEST
 * ============================================================================
 * Single source of truth for every factual claim in the experience.
 *
 * RULES (see docs/DRK_SOURCE_AUDIT.md):
 *  1. Every value here is transcribed verbatim from `Pitch deck.pdf`.
 *  2. Nothing is invented: no clients, partners, integrations, performance,
 *     audited results, financial figures, exchange relationships, product
 *     capabilities, market statistics, customer names, dates or revenue claims.
 *  3. Values that look inconsistent are PRESERVED and flagged in
 *     `contentVerifyTodos` below — never silently corrected.
 *  4. No component may hardcode a business fact. Import it from here.
 */

/* ========================================================================== */
/* TYPES                                                                       */
/* ========================================================================== */

export type SectionId =
  | "intro"
  | "opacity"
  | "engine"
  | "visibility"
  | "proof"
  | "stack"
  | "market"
  | "integration"
  | "lifecycle"
  | "control"
  | "demo"
  | "revenue"
  | "compound"
  | "raise"
  | "close";

export type ObjectId =
  | "latency-ring"
  | "security-lock"
  | "liquidity-vault"
  | "execution-beacon"
  | "market-chart"
  | "depth-sculpture"
  | "routing-path"
  | "security-shield"
  | "liquidity-wave"
  | "network-nodes"
  | "execution-engine"
  | "frog-mascot";

export interface Verify {
  id: string;
  where: string;
  issue: string;
  action: string;
}

/* ========================================================================== */
/* BRAND                                                                       */
/* ========================================================================== */

export const brand = {
  name: "DRK.",
  wordmark: "DRK",
  /**
   * CLIENT-DIRECTED CHANGE. The source deck's lockup reads "DARK MARKET
   * MAKERS". The client has instructed that DRK is not to describe itself as a
   * market maker, and has since removed the positioning line that replaced it,
   * so the lockup now carries no descriptor at all — the wordmark stands on its
   * own and the category line does the positioning. Recorded as VER-12.
   */
  category: "Launch & Institutional Trading",
  signature: "LIQUIDITY BENEATH THE SURFACE.",
  confidential: "DRK / CONFIDENTIAL",
  /**
   * Also changed under VER-12. The source reads "Transparent market making
   * for…"; sitting directly under the new positioning line that was a
   * contradiction on the first screen. Every noun of the source is kept —
   * transparency, token launches, DEXs, perps, onchain assets — and only the
   * self-description as a market maker is removed.
   */
  oneLiner:
    "Transparent liquidity infrastructure for token launches, DEXs, perps, and onchain assets.",
} as const;

/* ========================================================================== */
/* NAVIGATION — 15 narrative scenes                                            */
/* ========================================================================== */

export const sections: { id: SectionId; label: string; index: string; title: string }[] = [
  { id: "intro", label: "INTRO", index: "01", title: "System activation" },
  { id: "opacity", label: "OPACITY", index: "02", title: "Legacy market making is built on opacity" },
  { id: "engine", label: "ENGINE", index: "03", title: "One engine, two businesses" },
  { id: "visibility", label: "VISIBILITY", index: "04", title: "Clients see what black-box MMs hide" },
  { id: "proof", label: "PROOF", index: "05", title: "Two launches, weak market" },
  { id: "stack", label: "STACK", index: "06", title: "We own the stack" },
  { id: "market", label: "MARKET", index: "07", title: "The market for MM infrastructure" },
  { id: "integration", label: "INTEGRATION", index: "08", title: "We integrate in days, not years" },
  { id: "lifecycle", label: "LIFECYCLE", index: "09", title: "The launch lifecycle" },
  { id: "control", label: "CONTROL", index: "10", title: "The DRK control layer" },
  { id: "demo", label: "LIVE SYSTEM", index: "11", title: "The live DRK application" },
  { id: "revenue", label: "REVENUE", index: "12", title: "Multiple revenue streams" },
  { id: "compound", label: "COMPOUND", index: "13", title: "Investment liquidity compounds" },
  { id: "raise", label: "RAISE", index: "14", title: "$1.5M seed round — 80% productive, 20% platform" },
  { id: "close", label: "CLOSE", index: "15", title: "The next market maker" },
];

/**
 * THE OPENING CURTAIN
 *
 * DRK's own two-second title card, played once per session over the deck as it
 * loads. It is a supplied brand asset, not a scene: it carries no claim, holds
 * nothing back that the deck needs, and is skippable and dismissable from the
 * first frame. Reduced-motion visitors never see it.
 */
export const curtain = {
  src: "/intro.mp4",
  label: "DRK",
  skip: "SKIP",
  /**
   * BOOT-STATE LANGUAGE, NOT SYSTEM STATUS.
   *
   * These four lines are the deck introducing itself as a piece of operating
   * infrastructure. They are NOT telemetry: nothing is being initialised,
   * connected or synced while they are on screen, and they are deliberately
   * generic — none of them names a venue, a chain, a counterparty or a figure,
   * so none of them can be read as a claim about a running system. They are
   * paced against the title card's own two seconds and are gone before a
   * viewer could mistake them for data.
   */
  boot: ["INITIALIZING CORE", "CONNECTING MARKETS", "SYNCING LIQUIDITY", "SYSTEM READY"],
} as const;

/* ========================================================================== */
/* SCENE 01 — INTRO                                                            */
/* ========================================================================== */

export const intro = {
  wordmark: brand.name,
  eyebrow: brand.category,
  lede: brand.oneLiner,
  /** Transition headline (source page 2). */
  headline: {
    pre: "We turn ",
    signal: "token launches",
    post: " into visible trading programs",
  },
  support: "One runtime for wallets, liquidity, execution, and reporting.",
  /** The four labelled stages on the source route, in order. */
  runtime: [
    {
      key: "wallets",
      label: "WALLETS",
      object: "wallet" as const,
      note: "Client-owned custody and permissions.",
    },
    {
      key: "liquidity",
      label: "LIQUIDITY",
      object: "liquidity-wave" as const,
      note: "Adaptive capital across launches and markets.",
    },
    {
      key: "execution",
      label: "EXECUTION",
      object: "execution-engine" as const,
      note: "Unified liquidity, risk, and execution.",
    },
    {
      key: "reporting",
      label: "REPORTING",
      object: "network-nodes" as const,
      note: "Real-time data and visibility.",
    },
  ],
  launchLabel: "LAUNCH",
  conclusion: "DRK is an operating layer.",
} as const;

/* ========================================================================== */
/* SCENE 02 — OPACITY                                                          */
/* ========================================================================== */

export const opacity = {
  headline: { pre: "Legacy market making is built on ", signal: "opacity" },
  /** Source page 3, verbatim, in order. */
  problems: [
    {
      key: "loans",
      title: "Token loans.",
      detail: "Inventory leaves the treasury. Terms are set by the market maker.",
    },
    {
      key: "retainers",
      title: "Upfront retainers.",
      detail: "Paid before any performance is measured.",
    },
    {
      key: "pools",
      title: "Pool-by-pool charges.",
      detail: "Every venue is priced separately. Cost scales with fragmentation.",
    },
    {
      key: "adaptation",
      title: "Slow adaptation.",
      detail: "New chains, pools and launchpads take quarters, not days.",
    },
  ],
  /** The four identified inputs entering the vault on the source slide. */
  inputs: ["ETH", "USD", "SOL", "TOKEN"],
  /** The four unknown outputs leaving it. */
  outputs: ["?", "?", "?", "?"],
  /**
   * What those four outputs become under DRK. Not invented: these are the four
   * dimensions the deck itself names on page 5 — "Live visibility across
   * assets, programs, execution, and P/L."
   */
  resolved: ["ASSETS", "PROGRAMS", "EXECUTION", "P/L"],
  inputLabel: "WHAT YOU PUT IN",
  outputLabel: "WHAT YOU GET BACK",
  closedCaption: "Inputs are known. Outputs are not.",
  turn: "DRK inverts it.",
  turnDetail: "Same inputs. Every output visible, attributed and measured.",
} as const;

/* ========================================================================== */
/* SCENE 03 — ONE ENGINE / TWO BUSINESSES                                      */
/* ========================================================================== */

export const engine = {
  headline: { line1: "One proprietary engine.", line2: "Two scalable businesses." },
  support: "We run the book like an MM — and scale it like software.",
  core: { line1: "ONE ENGINE.", line2: "TWO BUSINESSES." },
  businesses: [
    {
      index: "01",
      key: "managed",
      name: "MANAGED TRADING",
      revenue: "PERFORMANCE-LINKED REVENUE",
      pillars: [
        {
          label: "STRATEGY",
          copy: "Proprietary traders define and operate every program.",
          object: "execution-beacon" as const,
        },
        {
          label: "LIQUIDITY",
          copy: "DRK deploys adaptive capital across launches and markets.",
          object: "liquidity-wave" as const,
        },
        {
          label: "EXECUTION",
          copy: "Revenue scales with measured client performance.",
          object: "execution-engine" as const,
        },
      ],
    },
    {
      index: "02",
      key: "licensed",
      name: "LICENSED RUNTIME",
      revenue: "RECURRING SOFTWARE REVENUE",
      pillars: [
        {
          label: "CONTROL",
          copy: "Client-owned wallets, permissions, and real-time visibility.",
          object: "security-lock" as const,
        },
        {
          label: "PROGRAMS",
          copy: "Reusable strategy frameworks deploy across venues.",
          object: "network-nodes" as const,
        },
        {
          label: "INFRASTRUCTURE",
          copy: "Secure multi-chain data, routing, and execution rails.",
          object: "routing-path" as const,
        },
      ],
    },
  ],
  conclusion: { plain: "Performance revenue today.", signal: "Recurring revenue at scale." },
  /**
   * The two configurations of the SAME engine, as inspectable chains.
   * Every node is a term the deck already uses on page 4; nothing new is
   * introduced. The chains are what the viewer steps through when they select a
   * mode — one engine, reconfigured, not two products.
   *
   * Three inputs, then the engine, then one outcome. The engine used to also
   * carry a labelled step of its own ("EXECUTION" / "INFRASTRUCTURE — Multi-chain
   * data, routing, execution"), which restated in words what the ring and the
   * engine object already say. It was removed: the diagram is the claim.
   */
  flows: {
    managed: {
      key: "managed",
      label: "MANAGED TRADING",
      chain: [
        { key: "trader", name: "TRADER", note: "Proprietary traders define the program." },
        { key: "strategy", name: "STRATEGY", note: "The program is specified and operated." },
        { key: "liquidity", name: "LIQUIDITY", note: "DRK deploys adaptive capital." },
        { key: "performance", name: "PERFORMANCE", note: "Client outcomes are measured." },
      ],
      out: "PERFORMANCE-LINKED REVENUE",
      outNote: "Revenue scales with measured client performance.",
      who: "DRK OPERATES",
    },
    licensed: {
      key: "licensed",
      label: "LICENSED RUNTIME",
      chain: [
        { key: "client", name: "CLIENT", note: "The client runs their own book." },
        { key: "control", name: "CONTROL", note: "Client-owned wallets and permissions." },
        { key: "programs", name: "PROGRAMS", note: "Reusable strategy frameworks." },
        { key: "visibility", name: "VISIBILITY", note: "Real-time reporting on the whole book." },
      ],
      out: "RECURRING SOFTWARE REVENUE",
      outNote: "Recurring software license — future MM runtime.",
      who: "CLIENT OPERATES",
    },
  },
  modeHint: "SELECT A MODE",
} as const;

/* ========================================================================== */
/* SCENE 04 — VISIBILITY                                                       */
/* ========================================================================== */

/**
 * Interface values from source page 5.
 *
 * These are product-surface values derived from the source deck, not audited
 * client aggregates. The single global disclosure in `legal` covers them; the
 * surfaces themselves stay clean, because a dashboard that annotates itself
 * reads as a mock-up rather than as a product.
 */
export const visibility = {
  headline: { line1: "Clients see", line2: "what black-box", line3: "MMs hide." },
  support: { signal: "Live visibility", rest: " across assets, programs, execution, and P/L." },
  /**
   * The four dimensions source page 5 names, in the deck's own order. They are
   * exactly the four unknowns that Scene 02 resolves (`opacity.resolved`), and
   * exactly four of the Control Layer's own modules — the same surface, met
   * earlier and shallower. That continuity is deliberate: Scene 04 and Scene 10
   * are one product at two depths, not two mock-ups.
   */
  moduleKeys: ["wallets", "programs", "execution", "pl"],
  dimensions: [
    { key: "wallets", label: "ASSETS", note: "Client-owned wallets, permissions and balances." },
    { key: "programs", label: "PROGRAMS", note: "Which strategy is running, where, on what capital." },
    { key: "execution", label: "EXECUTION", note: "Fill quality measured continuously, not monthly." },
    { key: "pl", label: "P/L", note: "Attributed to program, venue and strategy." },
  ],
  hint: "SELECT A DIMENSION",
} as const;

/* ========================================================================== */
/* ILLUSTRATIVE CHART SHAPES                                                   */
/* ========================================================================== */

/**
 * Series SHAPES only — they carry no business meaning and assert nothing.
 *
 * The source deck's charts are flattened raster images with no readable data,
 * so no underlying series could be recovered. These reproduce the *form* of
 * those charts (a bar field, two rising curves, a falling candle field) so the
 * product surfaces look alive. Every headline VALUE shown beside them
 * ($128.6M, 2,341, $3.72M, …) comes from the transcribed deck content above.
 *
 * Kept here rather than inside components so all rendered data is reviewable in
 * one file. Surfaces using these carry the ILLUSTRATIVE label.
 */
export const illustrativeSeries = {
  walletsBars: [38, 22, 54, 30, 71, 46, 88, 34, 62, 41, 79, 55, 96, 48, 68],
  executionLine: [22, 26, 24, 31, 29, 37, 34, 42, 40, 49, 46, 57, 54, 66, 63, 74, 71, 83, 92],
  plLine: [12, 18, 16, 25, 31, 28, 38, 44, 41, 52, 58, 55, 66, 72, 69, 80, 88, 85, 96],
  analyticsLine: [30, 34, 31, 40, 44, 41, 50, 47, 56, 61, 58, 67, 64, 73, 78, 75, 84, 90, 87],
  programsLine: [44, 41, 48, 52, 49, 57, 61, 58, 65, 62, 70, 74, 71, 78, 82, 79, 86, 90, 88],
  /** Scene 05 — a weak, risk-off market: lower highs, lower lows. */
  weakMarket: [
    { o: 82, c: 76, h: 86, l: 74 }, { o: 76, c: 80, h: 83, l: 73 },
    { o: 80, c: 71, h: 82, l: 68 }, { o: 71, c: 74, h: 78, l: 69 },
    { o: 74, c: 66, h: 76, l: 63 }, { o: 66, c: 69, h: 72, l: 62 },
    { o: 69, c: 60, h: 71, l: 57 }, { o: 60, c: 63, h: 67, l: 58 },
    { o: 63, c: 55, h: 65, l: 52 }, { o: 55, c: 58, h: 61, l: 53 },
    { o: 58, c: 49, h: 60, l: 46 }, { o: 49, c: 52, h: 56, l: 47 },
    { o: 52, c: 44, h: 54, l: 41 }, { o: 44, c: 47, h: 50, l: 42 },
    { o: 47, c: 39, h: 49, l: 36 }, { o: 39, c: 42, h: 45, l: 37 },
    { o: 42, c: 34, h: 44, l: 31 }, { o: 34, c: 37, h: 40, l: 32 },
    { o: 37, c: 29, h: 39, l: 26 }, { o: 29, c: 31, h: 34, l: 25 },
  ],
  weakMarketTrend: [
    84, 80, 76, 74, 70, 68, 64, 62, 58, 56, 52, 50, 46, 44, 40, 39, 36, 34, 31, 29,
  ],
  /**
   * Scene 07 — one shape per step of the market progression. SHAPES ONLY: they
   * carry no data and assert nothing. Each chart renders beside the exact
   * figure, description, source and date transcribed from source page 8, and
   * every chart is captioned as an illustrative shape. See VER-02 / VER-03.
   */
  marketShapes: {
    tvl: [18, 22, 20, 27, 31, 29, 36, 42, 39, 48, 54, 51, 60, 66, 63, 72, 79, 76, 86],
    "dex-volume": [24, 21, 29, 26, 35, 32, 41, 38, 48, 45, 56, 52, 64, 60, 72, 68, 80, 77, 90],
    "dex-cex": [42, 44, 41, 46, 44, 49, 47, 53, 51, 57, 55, 61, 59, 66, 64, 71, 69, 76, 82],
    chains: [12, 15, 19, 23, 26, 31, 34, 39, 44, 47, 53, 57, 62, 66, 71, 76, 81, 86, 92],
    perps: [20, 24, 22, 30, 28, 37, 34, 44, 41, 52, 49, 60, 57, 69, 66, 78, 75, 88, 96],
    institutional: [8, 11, 10, 16, 14, 22, 19, 29, 26, 38, 35, 48, 45, 59, 56, 71, 68, 84, 97],
  } as Record<string, number[]>,
} as const;

/* ========================================================================== */
/* SCENE 05 — PROOF                                                            */
/* ========================================================================== */

/**
 * The ONLY performance evidence in the source deck (page 6).
 * No client names appear in the source and none are invented here.
 */
export const proof = {
  headline: { plain: "2 launches across", strong: "late July / early August 2026" },
  support: { pre: "Delivered in a ", signal: "weak, risk-off market", post: "." },
  marketCondition: "WEAK, RISK-OFF MARKET",
  launches: [
    {
      id: "L01",
      name: "LAUNCH 01",
      window: "Late July 2026",
      result: "$150k",
      /** Label transcribed verbatim from source. See VER-01. */
      resultLabel: "CLIENT PROFIT",
    },
    {
      id: "L02",
      name: "LAUNCH 02",
      window: "Early August 2026",
      result: "$70k",
      /** Source repeats this label verbatim. NOT corrected. See VER-01. */
      resultLabel: "CLIENT PROFIT",
      labelFlag: "VER-01",
    },
  ],
  drkEconomics: { value: "$40k+", label: "CAPTURED BY DRK" },
  takeaway: "DRK produced outcomes in a falling market.",
  note: "Client identities are not disclosed in the source material.",
} as const;

/* ========================================================================== */
/* SCENE 06 — OWN THE STACK                                                    */
/* ========================================================================== */

export const stack = {
  headline: { line1: "Other firms rent tools.", line2: "We own the stack." },
  support:
    "Our traders operate our software. We adapt quickly to new chains, pools, launchpads, and venues.",
  /**
   * External environment, source page 7, in order.
   * Rendered TYPOGRAPHICALLY — no third-party logos are reproduced.
   * See contentVerifyTodos VER-06.
   */
  externalLabel: "EXTERNAL ENVIRONMENT",
  external: [
    { key: "launchpads", name: "Launchpads", kind: "venue" },
    { key: "pools", name: "Pools", kind: "venue" },
    { key: "execution", name: "Execution", kind: "venue" },
    { key: "perps", name: "Perps", kind: "venue" },
    { key: "robinhood", name: "Robinhood Chain", kind: "chain" },
    { key: "solana", name: "Solana", kind: "chain" },
    { key: "evm", name: "EVM", kind: "chain" },
    { key: "reporting", name: "Reporting", kind: "venue" },
  ],
  coreLabel: "DRK CORE",
  core: [
    {
      key: "liquidity-engine",
      name: "LIQUIDITY ENGINE",
      copy: "Deep liquidity. Always on.",
      object: "execution-engine" as const,
    },
    {
      key: "routing-layer",
      name: "ROUTING LAYER",
      copy: "Smart routing. Best execution.",
      object: "routing-path" as const,
    },
    {
      key: "risk-controls",
      name: "RISK & CONTROLS",
      copy: "Built-in risk. Real-time guardrails.",
      object: "security-shield" as const,
    },
    {
      key: "data-insights",
      name: "DATA & INSIGHTS",
      copy: "Real-time data. Actionable edge.",
      object: "network-nodes" as const,
    },
  ],
  outputLabel: "OUTPUT",
  output: ["TRUST.", "PERFORMANCE.", "RESULTS."],
  /**
   * What each owned layer consumes and produces, so the architecture can be
   * INSPECTED rather than read. `feeds` names the external entries (by key)
   * that connect to this layer, so selecting a layer illuminates only its own
   * routes. Every term is already used on source page 7.
   */
  io: {
    "liquidity-engine": {
      inputs: ["Pools", "Launchpads", "Perps"],
      outputs: ["Deep liquidity", "Continuous quoting"],
      feeds: ["pools", "launchpads", "perps"],
      detail: "Capital is deployed as depth, continuously, across every venue we support.",
    },
    "routing-layer": {
      inputs: ["Solana", "EVM", "Robinhood Chain"],
      outputs: ["Best execution", "Venue reach"],
      feeds: ["solana", "evm", "robinhood", "execution"],
      detail: "Order intent is routed to the venue that can fill it best, chain by chain.",
    },
    "risk-controls": {
      inputs: ["Execution", "Perps"],
      outputs: ["Real-time guardrails", "Position limits"],
      feeds: ["execution", "perps"],
      detail: "Risk is a property of the runtime, not a report written afterwards.",
    },
    "data-insights": {
      inputs: ["Reporting", "Execution"],
      outputs: ["Real-time data", "Actionable edge"],
      feeds: ["reporting", "execution"],
      detail: "Everything the engine does is measured as it happens and attributed.",
    },
  } as Record<
    string,
    { inputs: string[]; outputs: string[]; feeds: string[]; detail: string }
  >,
  hint: "SELECT A LAYER",
} as const;

/* ========================================================================== */
/* SCENE 07 — MARKET                                                           */
/* ========================================================================== */

/**
 * Source page 8. Values, descriptions, sources and dates transcribed exactly.
 * NOT refreshed, NOT re-dated. Vintage question flagged as VER-02 / VER-03.
 * `stage` sequences the six figures into one causal progression rather than
 * six identical cards.
 */
export const market = {
  headline: { pre: "The market for MM infrastructure is growing ", signal: "exponentially" },
  support:
    "Institutional adoption and onchain activity are accelerating across every dimension.",
  callout: {
    plain: "The structural shift to onchain markets ",
    signal: "is driving demand for better market making.",
  },
  progression: [
    {
      step: "01",
      premise: "Capital moves onchain.",
      key: "tvl",
      label: "TOTAL VALUE LOCKED",
      value: "$182B+",
      desc: "TVL across DeFi protocols",
      source: "DefiLlama",
    },
    {
      step: "02",
      premise: "Volume follows the capital.",
      key: "dex-volume",
      label: "DEX VOLUME",
      value: "$2.4T+",
      desc: "DEX spot volume in April 2026",
      source: "The Block",
    },
    {
      step: "03",
      premise: "Onchain overtakes the incumbent venue.",
      key: "dex-cex",
      label: "DEX > CEX",
      value: "1.3x",
      desc: "DEX spot volume surpassed CEX in April",
      source: "The Block",
    },
    {
      step: "04",
      premise: "Markets fragment across chains.",
      key: "chains",
      label: "NEW CHAINS",
      value: "90+",
      desc: "Active L1 & L2 chains in 2026",
      source: "L2BEAT",
    },
    {
      step: "05",
      premise: "Liquidity complexity increases.",
      key: "perps",
      label: "PERPS VOLUME",
      value: "+100%",
      desc: "Perpetuals DEX volume YoY (April 2026)",
      source: "The Block",
    },
    {
      step: "06",
      premise: "Institutional requirements arrive.",
      key: "institutional",
      label: "INSTITUTIONAL FLOW",
      value: "+300%",
      desc: "Increase in onchain institutional activity YoY",
      source: "Galaxy Digital",
    },
  ],
  conclusion: "Infrastructure demand increases.",
  footerStrip: [
    "ONE ENGINE. TWO MODELS. ENDLESS MARKETS.",
    "BUILT FOR PERFORMANCE. DESIGNED FOR SCALE.",
    brand.signature,
  ],
} as const;

/* ========================================================================== */
/* SCENE 08 — INTEGRATION SPEED                                                */
/* ========================================================================== */

/**
 * Source page 9. The deck presents these as chains/venues DRK adapts to.
 * It does NOT describe them as partnerships, clients or signed integrations,
 * so neither does this build. Rendered typographically. See VER-06.
 */
export const integration = {
  headline: { line1: "Traditional MMs move slowly.", line2: "We integrate in days, not years." },
  support: "We adapt rapidly to new chains, venues, and launch systems.",
  targetsLabel: "CHAINS, VENUES & LAUNCH SYSTEMS",
  pipeline: [
    { key: "routing", name: "ROUTING LAYER", copy: "Real-time intelligence across markets" },
    {
      key: "engine",
      name: "DRK EXECUTION ENGINE",
      copy: "Unified liquidity, risk, and execution",
    },
  ],
  /**
   * `kind` separates the two things the source deck names but does not
   * distinguish. Solana, Aptos, Sui and Robinhood EVM are networks; Cantor is an
   * institutional venue, NOT a blockchain, and must never be grouped as one.
   *
   * `mark` is the monogram used when no official artwork has been supplied for
   * that key — currently Cantor alone. Everything else renders its real mark
   * from `components/ui/BrandMark`.
   */
  targets: [
    { key: "solana", name: "Solana", kind: "chain", mark: "SOL" },
    { key: "aptos", name: "Aptos", kind: "chain", mark: "APT" },
    { key: "sui", name: "Sui", kind: "chain", mark: "SUI" },
    { key: "robinhood", name: "Robinhood EVM", kind: "chain", mark: "RH" },
    { key: "cantor", name: "Cantor", kind: "venue", mark: "CTR" },
  ],
  groups: {
    chain: "CHAINS / NETWORKS",
    venue: "VENUE / INSTITUTIONAL",
  },
  states: ["DETECTED", "ROUTE FORMED", "ENGINE LINKED", "ACTIVE"],
  /**
   * The connection sequence a venue passes through. This is the argument
   * performed rather than asserted: the viewer watches an unconnected network
   * become an active execution path. Each step corresponds to a capability the
   * deck already states (routing intelligence, engine linkage, reporting).
   *
   * `note` explains the VOCABULARY once, where the sequence is defined. It is
   * never repeated per chain — the same sentence printed beside five rows was
   * five times the words for none of the information.
   */
  sequence: [
    { key: "unconnected", label: "UNCONNECTED", note: "A new venue exists. Nothing reaches it." },
    { key: "detected", label: "DETECTED", note: "The routing layer sees the venue." },
    { key: "route", label: "ROUTE FORMED", note: "A path is calculated across the chain." },
    { key: "linked", label: "ENGINE LINKED", note: "The execution engine attaches to the path." },
    { key: "telemetry", label: "TELEMETRY", note: "Fills, latency and slippage start reporting." },
    { key: "active", label: "ACTIVE", note: "The venue is a live execution destination." },
  ],
  /** Comparative framing the deck states in words: days, not years. */
  contrast: {
    themLabel: "TRADITIONAL MM",
    themValue: "QUARTERS",
    usLabel: "DRK",
    usValue: "DAYS",
  },
} as const;

/* ========================================================================== */
/* SCENE 09 — LAUNCH LIFECYCLE                                                 */
/* ========================================================================== */

export const lifecycle = {
  headline: { plain: "Launches are where speed, trust, and liquidity collide" },
  support: { pre: "We support the ", signal: "full lifecycle", post: " from first block to market growth." },
  stages: [
    {
      key: "pre-launch",
      name: "Pre-launch",
      object: "security-lock" as const,
      lines: ["Secure the foundation.", "Align incentives."],
    },
    {
      key: "first-block",
      name: "First block",
      object: "execution-beacon" as const,
      lines: ["Execute with precision.", "Deliver with confidence."],
    },
    {
      key: "migration",
      name: "Migration",
      object: "liquidity-wave" as const,
      lines: ["Move seamlessly.", "Maintain integrity."],
    },
    {
      key: "liquidity",
      name: "Liquidity",
      object: "market-chart" as const,
      lines: ["Activate liquidity.", "Enable depth."],
    },
    {
      key: "growth",
      name: "Growth",
      object: "depth-sculpture" as const,
      lines: ["Scale markets.", "Sustain momentum."],
    },
  ],
} as const;

/* ========================================================================== */
/* SCENE 10 — DRK CONTROL LAYER                                                */
/* ========================================================================== */

/**
 * Replaces the source deck's "Platform demo — insert live product views"
 * PLACEHOLDER (page 11).
 *
 * Every module below is built ONLY from capabilities the deck already states:
 *   wallets/permissions/visibility (p4 CONTROL, p5 Wallets)
 *   reusable strategy programs across venues (p4 PROGRAMS)
 *   execution + routing + risk (p4, p7, p9)
 *   P/L attribution (p5)
 *   real-time data & insights (p7 DATA & INSIGHTS)
 *   launch lifecycle (p10)
 * No capability beyond these is implied. All values are illustrative.
 */
export const control = {
  headline: { line1: "The DRK", line2: "control layer." },
  support: "One operating surface for wallets, programs, execution, P/L, analytics and launches.",
  /**
   * THE DEMO REEL.
   *
   * Cut from the client's own screen recording of the live DRK application
   * (`demo final.mp4`). Each clip is one page of the real product, trimmed to
   * the settled state — the runtime's loading screens between pages are cut
   * out, which is the only edit made. Nothing is re-shot, re-staged or
   * composited.
   *
   * Every `copy` line below restates what that page of the product says about
   * itself on screen. No capability is described that the recording does not
   * show.
   */
  demo: {
    cta: "WATCH THE SYSTEM",
    title: "DRK Control Layer",
    subtitle: "The live application, recorded.",
    note: "Recorded in the live DRK application.",
    /** Scene 11's own framing. The product is the argument; this is the caption. */
    scene: {
      headline: { line1: "The system behind", line2: "the market maker." },
      support: "Six surfaces of the live DRK application, recorded in production.",
      /**
       * The environment strip above the player. Every figure is one the deck
       * already states elsewhere (`control.telemetry`) — the strip reports the
       * SYSTEM's state, and nothing in it moves on a timer, because animating a
       * number would be fabricating a change that did not happen.
       */
      status: "LIVE",
    },
    /** Short rail labels. The full name still sets the caption beneath. */
    railLabels: ["TOKEN", "RUNTIME", "POOLS", "PROGRAMS", "OPERATE", "P/L"],
    clips: [
      {
        key: "token-profile",
        name: "Token profile",
        copy: "Market, ownership, liquidity and safety for one managed token — with the evidence behind each figure.",
      },
      {
        key: "instances",
        name: "Runtime instances",
        copy: "Every trading pair and wallet group runs as its own live scope, started and paused independently.",
      },
      {
        key: "pools",
        name: "Pool discovery",
        copy: "Venues and pools are discovered, authorised per instance, and monitored from the moment they connect.",
      },
      {
        key: "programs",
        name: "Activity programs",
        copy: "A strategy is configured, scheduled and checked against the live market before a single order is placed.",
      },
      {
        key: "studio",
        name: "Operator studio",
        copy: "Reactions are previewed and tested — external event to typed action — without touching the chain.",
      },
      {
        key: "pl",
        name: "Positions & P/L",
        copy: "Reconciled fills, fresh marks and attributed P/L on the instance while it runs.",
      },
    ],
  },
  statusLine: "RUNTIME / CONNECTED",
  /**
   * The surface chrome, modelled on the real DRK application (see `demo.clips`),
   * which runs an environment pill and a row of live counters above every page:
   * `MAINNET · Instances 1/1 live · Pools 1 · Actions 0 · Executions 1`.
   *
   * `MAINNET` is DRK's own UI chrome, not a business claim. Every counter below
   * is a figure already present in this manifest.
   */
  environment: "MAINNET",
  telemetry: [
    { label: "Programs", value: "4" },
    { label: "Wallets", value: "5" },
    { label: "Executions", value: "2,341" },
    { label: "Threats", value: "0" },
  ],
  /**
   * Rail grouping, mirroring the product's own `OVERVIEW / SETUP / OPERATE`
   * structure. Purely organisational — no module is added or renamed.
   */
  groups: [
    { label: "OVERVIEW", keys: ["overview"] },
    { label: "POSITION", keys: ["wallets", "programs"] },
    { label: "OPERATE", keys: ["execution", "pl"] },
    { label: "EVIDENCE", keys: ["analytics", "launches"] },
  ],
  modules: [
    {
      index: "1",
      key: "overview",
      name: "Overview",
      strap: "The whole book, one surface: capital, programs, execution and P/L.",
      capability: "Live visibility across assets, programs, execution, and P/L.",
      headline: { label: "TOTAL VALUE", value: "$128.6M" },
      rows: [],
      stats: [
        { label: "ACTIVE PROGRAMS", value: "4" },
        { label: "TODAY'S TRADES", value: "2,341" },
        { label: "DAILY P/L", value: "$3.72M" },
      ],
    },
    {
      index: "2",
      key: "wallets",
      name: "Wallets",
      strap: "Client-owned custody, permissions, real-time balances.",
      capability: "Client-owned wallets, permissions, and real-time visibility.",
      headline: { label: "TOTAL VALUE", value: "$128.6M" },
      rows: [
        { name: "Treasury — Primary", chain: "Solana", value: "$52.4M", state: "ACTIVE", perms: "TRADE / WITHDRAW" },
        { name: "Program — Launch 01", chain: "EVM", value: "$31.8M", state: "ACTIVE", perms: "TRADE" },
        { name: "Program — Launch 02", chain: "Solana", value: "$24.1M", state: "ACTIVE", perms: "TRADE" },
        { name: "Ops — Settlement", chain: "EVM", value: "$14.0M", state: "IDLE", perms: "VIEW" },
        { name: "Reserve — Cold", chain: "EVM", value: "$6.3M", state: "LOCKED", perms: "VIEW" },
      ],
      stats: [
        { label: "WALLETS", value: "5" },
        { label: "PERMISSIONED", value: "3" },
        { label: "CLIENT-OWNED", value: "100%" },
      ],
    },
    {
      index: "3",
      key: "programs",
      name: "Programs",
      strap: "Reusable strategy frameworks deployed across venues.",
      capability: "Reusable strategy frameworks deploy across venues.",
      headline: { label: "ACTIVE PROGRAMS", value: "4" },
      rows: [
        { name: "Launch Support", chain: "Multi-chain", value: "RUNNING", state: "ACTIVE", perms: "PRE-LAUNCH → GROWTH" },
        { name: "Depth Maintenance", chain: "Pools", value: "RUNNING", state: "ACTIVE", perms: "LIQUIDITY" },
        { name: "Migration Cover", chain: "Multi-chain", value: "ARMED", state: "IDLE", perms: "MIGRATION" },
        { name: "Perps Quoting", chain: "Perps", value: "RUNNING", state: "ACTIVE", perms: "EXECUTION" },
      ],
      stats: [
        { label: "FRAMEWORKS", value: "4" },
        { label: "VENUES", value: "MULTI" },
        { label: "REUSABLE", value: "YES" },
      ],
    },
    {
      index: "4",
      key: "execution",
      name: "Execution",
      strap: "Routing, fill quality and latency, measured continuously.",
      capability: "Smart routing. Best execution. Real-time guardrails.",
      headline: { label: "TODAY'S TRADES", value: "2,341" },
      rows: [],
      stats: [
        { label: "AVG. SLIPPAGE", value: "1.2 bps" },
        { label: "FILL RATE", value: "99.6%" },
        { label: "LATENCY", value: "18ms" },
      ],
    },
    {
      index: "5",
      key: "pl",
      name: "P/L",
      strap: "Attributed to program, venue and strategy.",
      capability: "Live visibility across assets, programs, execution, and P/L.",
      headline: { label: "DAILY P/L", value: "$3.72M" },
      rows: [],
      stats: [
        { label: "MTD P/L", value: "$28.4M" },
        { label: "YTD P/L", value: "$196.7M" },
        { label: "SHARPE RATIO", value: "2.36" },
      ],
    },
    {
      index: "6",
      key: "analytics",
      name: "Analytics",
      strap: "Real-time data across instrument type and venue.",
      capability: "Real-time data. Actionable edge.",
      headline: { label: "TOTAL INVENTORY VALUE", value: "$94.3M" },
      rows: [],
      breakdown: [
        { label: "Spot", value: 58 },
        { label: "Perps", value: 26 },
        { label: "Options", value: 11 },
        { label: "Other", value: 5 },
      ],
      stats: [
        { label: "INSTRUMENTS", value: "4" },
        { label: "REFRESH", value: "REAL-TIME" },
        { label: "COVERAGE", value: "MULTI-CHAIN" },
      ],
    },
    {
      index: "7",
      key: "launches",
      name: "Launches",
      strap: "Lifecycle state from first block to market growth.",
      capability: "We support the full lifecycle from first block to market growth.",
      headline: { label: "LAUNCHES DELIVERED", value: "2" },
      rows: [
        { name: "LAUNCH 01", chain: "Late July 2026", value: "$150k", state: "COMPLETE", perms: "CLIENT PROFIT" },
        { name: "LAUNCH 02", chain: "Early August 2026", value: "$70k", state: "COMPLETE", perms: "CLIENT PROFIT" },
      ],
      stats: [
        { label: "CAPTURED BY DRK", value: "$40k+" },
        { label: "MARKET", value: "RISK-OFF" },
        { label: "WINDOW", value: "JUL–AUG 2026" },
      ],
    },
  ],
} as const;

/* ========================================================================== */
/* CONTROL LAYER — DETAIL SURFACES                                             */
/* ========================================================================== */

/**
 * The inspectable detail behind each Control Layer module.
 *
 * PROVENANCE RULE. Nothing here introduces a new business claim. Every field is
 * an interface expression of a capability the deck already states:
 *   wallets / permissions / real-time visibility  (p4 CONTROL, p5 Wallets)
 *   reusable strategy programs across venues      (p4 PROGRAMS)
 *   routing, execution, risk guardrails           (p4, p7, p9)
 *   P/L attributed to program, venue, strategy    (p5)
 *   real-time data and insights                   (p7 DATA & INSIGHTS)
 *   the launch lifecycle, first block to growth   (p10)
 *
 * Venue and chain names are restricted to those the deck itself names. Headline
 * values are the deck's own p5 figures. Every surface carries the ILLUSTRATIVE
 * label and a source-capability line. See VER-05.
 */

export const walletDetail = {
  "Treasury — Primary": {
    allocation: 41,
    deployed: "$38.9M",
    available: "$13.5M",
    program: "Launch Support",
    lifecycle: "GROWTH",
    permissions: ["TRADE", "WITHDRAW", "VIEW"],
    custody: "CLIENT-OWNED",
  },
  "Program — Launch 01": {
    allocation: 25,
    deployed: "$29.4M",
    available: "$2.4M",
    program: "Depth Maintenance",
    lifecycle: "LIQUIDITY",
    permissions: ["TRADE", "VIEW"],
    custody: "CLIENT-OWNED",
  },
  "Program — Launch 02": {
    allocation: 19,
    deployed: "$21.6M",
    available: "$2.5M",
    program: "Launch Support",
    lifecycle: "MIGRATION",
    permissions: ["TRADE", "VIEW"],
    custody: "CLIENT-OWNED",
  },
  "Ops — Settlement": {
    allocation: 11,
    deployed: "$0.0M",
    available: "$14.0M",
    program: "—",
    lifecycle: "IDLE",
    permissions: ["VIEW"],
    custody: "CLIENT-OWNED",
  },
  "Reserve — Cold": {
    allocation: 4,
    deployed: "$0.0M",
    available: "$6.3M",
    program: "—",
    lifecycle: "LOCKED",
    permissions: ["VIEW"],
    custody: "CLIENT-OWNED",
  },
} as const;

export const programDetail = {
  "Launch Support": {
    deployed: "$60.5M",
    venue: "Multi-chain",
    phase: "PRE-LAUNCH → GROWTH",
    activity: "1,204 executions today",
    result: "TRACKING",
    series: [30, 34, 32, 41, 45, 43, 52, 56, 54, 63, 68, 66, 74, 79, 77, 85, 90, 88, 96],
  },
  "Depth Maintenance": {
    deployed: "$29.4M",
    venue: "Pools",
    phase: "LIQUIDITY",
    activity: "742 executions today",
    result: "TRACKING",
    series: [58, 56, 60, 57, 62, 59, 64, 61, 66, 63, 68, 65, 70, 67, 72, 69, 74, 71, 76],
  },
  "Migration Cover": {
    deployed: "$0.0M",
    venue: "Multi-chain",
    phase: "MIGRATION",
    activity: "Armed — not deployed",
    result: "STANDBY",
    series: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
  },
  "Perps Quoting": {
    deployed: "$4.4M",
    venue: "Perps",
    phase: "EXECUTION",
    activity: "395 executions today",
    result: "TRACKING",
    series: [44, 49, 46, 54, 51, 59, 63, 60, 68, 65, 72, 77, 74, 81, 85, 82, 89, 93, 91],
  },
} as const;

/**
 * The execution event stream. A fixed, reviewable list — not generated at
 * runtime — so every value that appears on screen is auditable in this file.
 * `route` names the hop chain the execution took; `x` is its position along the
 * routing diagram (0..1) so a selected event can illuminate its own path.
 */
export const executionEvents = [
  { id: "E-4412", t: "14:02:19", venue: "Solana", side: "BUY", size: "$412k", fill: "99.8%", slip: "0.9", lat: "16", route: ["ROUTING", "SOLANA", "POOL"], x: 0.18 },
  { id: "E-4413", t: "14:02:24", venue: "Perps", side: "SELL", size: "$188k", fill: "99.4%", slip: "1.4", lat: "21", route: ["ROUTING", "PERPS", "BOOK"], x: 0.42 },
  { id: "E-4414", t: "14:02:31", venue: "EVM", side: "BUY", size: "$906k", fill: "99.7%", slip: "1.1", lat: "18", route: ["ROUTING", "EVM", "POOL"], x: 0.66 },
  { id: "E-4415", t: "14:02:38", venue: "Pools", side: "BUY", size: "$243k", fill: "99.9%", slip: "0.7", lat: "14", route: ["ROUTING", "POOLS", "DEPTH"], x: 0.3 },
  { id: "E-4416", t: "14:02:46", venue: "Solana", side: "SELL", size: "$531k", fill: "99.5%", slip: "1.3", lat: "19", route: ["ROUTING", "SOLANA", "BOOK"], x: 0.18 },
  { id: "E-4417", t: "14:02:52", venue: "Launchpads", side: "BUY", size: "$1.2M", fill: "99.6%", slip: "1.2", lat: "17", route: ["ROUTING", "LAUNCHPAD", "POOL"], x: 0.9 },
] as const;

/** P/L windows. `label` is the control; the same chart morphs between them. */
export const plWindows = [
  {
    key: "day",
    label: "DAY",
    metricLabel: "DAILY P/L",
    value: "$3.72M",
    series: [12, 18, 16, 25, 31, 28, 38, 44, 41, 52, 58, 55, 66, 72, 69, 80, 88, 85, 96],
    attribution: [
      { label: "Launch Support", value: 46 },
      { label: "Depth Maintenance", value: 29 },
      { label: "Perps Quoting", value: 17 },
      { label: "Other", value: 8 },
    ],
  },
  {
    key: "mtd",
    label: "MTD",
    metricLabel: "MTD P/L",
    value: "$28.4M",
    series: [20, 24, 22, 30, 27, 36, 33, 42, 48, 45, 55, 52, 62, 59, 70, 76, 73, 84, 91],
    attribution: [
      { label: "Launch Support", value: 42 },
      { label: "Depth Maintenance", value: 31 },
      { label: "Perps Quoting", value: 19 },
      { label: "Other", value: 8 },
    ],
  },
  {
    key: "ytd",
    label: "YTD",
    metricLabel: "YTD P/L",
    value: "$196.7M",
    series: [8, 14, 21, 19, 29, 37, 34, 46, 43, 56, 64, 61, 72, 68, 79, 86, 83, 92, 99],
    attribution: [
      { label: "Launch Support", value: 39 },
      { label: "Depth Maintenance", value: 33 },
      { label: "Perps Quoting", value: 21 },
      { label: "Other", value: 7 },
    ],
  },
] as const;

/** Analytics metrics. One visualisation; the series and framing change. */
export const analyticsMetrics = [
  {
    key: "liquidity",
    label: "LIQUIDITY",
    metricLabel: "DEPLOYED LIQUIDITY",
    value: "$94.3M",
    unit: "",
    series: [42, 46, 44, 52, 49, 58, 62, 59, 67, 64, 72, 76, 73, 81, 86, 83, 90, 94, 92],
    note: "Capital in market across instrument type and venue.",
  },
  {
    key: "slippage",
    label: "SLIPPAGE",
    metricLabel: "AVG. SLIPPAGE",
    value: "1.2",
    unit: "bps",
    series: [64, 60, 62, 55, 58, 51, 47, 50, 44, 46, 40, 37, 39, 33, 30, 32, 27, 24, 22],
    note: "Lower is better. Measured continuously, not reported monthly.",
  },
  {
    key: "fill",
    label: "FILL",
    metricLabel: "FILL RATE",
    value: "99.6",
    unit: "%",
    series: [72, 75, 74, 79, 77, 82, 85, 83, 87, 86, 90, 92, 91, 94, 95, 94, 97, 98, 99],
    note: "Share of intended size executed at or inside the quote.",
  },
  {
    key: "latency",
    label: "LATENCY",
    metricLabel: "EXECUTION LATENCY",
    value: "18",
    unit: "ms",
    series: [70, 66, 68, 61, 63, 57, 53, 55, 49, 51, 45, 42, 44, 38, 35, 37, 31, 28, 26],
    note: "Lower is better. Order intent to venue acknowledgement.",
  },
] as const;

/**
 * Launch timeline. Values are the deck's own p6 results; the lifecycle phases
 * are the deck's own p10 stages. Nothing is added.
 */
export const launchTimeline = [
  {
    id: "L01",
    name: "LAUNCH 01",
    window: "Late July 2026",
    result: "$150k",
    resultLabel: "CLIENT PROFIT",
    phase: 4,
    state: "COMPLETE",
  },
  {
    id: "L02",
    name: "LAUNCH 02",
    window: "Early August 2026",
    result: "$70k",
    /** Source repeats this label verbatim. NOT corrected. See VER-01. */
    resultLabel: "CLIENT PROFIT",
    labelFlag: "VER-01",
    phase: 4,
    state: "COMPLETE",
  },
] as const;

/* ========================================================================== */
/* SCENE 11 — REVENUE                                                          */
/* ========================================================================== */

export const revenue = {
  headline: { line1: "One engine.", signal: "Multiple", line2: "revenue streams." },
  support: { plain: "We provide liquidity up front and ", signal: "get paid when programs perform." },
  streams: [
    { index: "01", name: "Upfront liquidity", note: null, footnote: false, model: "MANAGED TRADING" },
    { index: "02", name: "% of every launch", note: null, footnote: false, model: "MANAGED TRADING" },
    { index: "03", name: "Daily service fee", note: null, footnote: false, model: "MANAGED TRADING" },
    {
      index: "04",
      name: "15–35% of off-ramp",
      note: "based on liquidity provided",
      /** The source prints an asterisk here; the note is its footnote. VER-08. */
      footnote: true,
      model: "MANAGED TRADING",
    },
    {
      index: "05",
      name: "Recurring software license",
      note: "future MM runtime",
      footnote: false,
      model: "LICENSED RUNTIME",
    },
  ] as ReadonlyArray<{
    index: string;
    name: string;
    note: string | null;
    footnote: boolean;
    model: string;
  }>,
  conclusion: {
    a: "Managed trading today.",
    b: "Software economics later.",
    c: "Multiple monetisation layers on one engine.",
  },
} as const;

/* ========================================================================== */
/* SCENE 12 — COMPOUNDING                                                      */
/* ========================================================================== */

export const compound = {
  headline: { pre: "Investment liquidity ", signal: "compounds" },
  support: {
    line1: "Capital is deployed into live market programs — not spent on overheads.",
    line2pre: "It ",
    line2a: "works",
    line2mid: " while it ",
    line2b: "compounds",
  },
  /**
   * The single clearest investor signal on this scene: where the money goes.
   * Deployed capital is an operating input that comes back into the book;
   * an operating expense does not. One row, two states, no commentary.
   */
  contrast: {
    label: "WHERE THE CAPITAL GOES",
    off: "SPENT ON OPERATING EXPENSE",
    on: "DEPLOYED AS WORKING LIQUIDITY",
  },
  /** The economic loop. Built from the deck's own model — no new claims. */
  loop: [
    { key: "capital", name: "CAPITAL", note: "Investment liquidity enters the engine." },
    { key: "deployment", name: "LIQUIDITY DEPLOYMENT", note: "Deployed across launches and markets." },
    { key: "programs", name: "MARKET PROGRAMS", note: "Reusable strategy frameworks run on venues." },
    { key: "performance", name: "PERFORMANCE", note: "Measured client performance." },
    { key: "revenue", name: "REVENUE", note: "Performance-linked and recurring." },
    { key: "more-liquidity", name: "MORE LIQUIDITY", note: "Retained capital re-enters the book." },
    { key: "capacity", name: "MORE LAUNCH CAPACITY", note: "More programs can run concurrently." },
  ],
  /** Source page 13. Dates preserved exactly. See VER-02 / VER-03. */
  signals: [
    {
      key: "dex",
      claimA: "DEX",
      claimB: "trading just surpassed CEX.",
      value: "52%",
      desc: "of total spot volume is now on DEXs.",
      source: "The Block – May 2026",
    },
    {
      key: "perps",
      claimA: "Perps volume",
      claimB: "is accelerating.",
      value: "+100%",
      desc: "YoY perps volume growth.",
      source: "Laevitas – May 2026",
    },
    {
      key: "chains",
      claimA: "New chains",
      claimB: "are pulling more liquidity.",
      value: "+$23B",
      desc: "TVL added across new L1s/L2s in 12 months.",
      source: "DefiLlama – May 2026",
    },
  ],
  footer: {
    pre: "All liquidity is designed to ",
    a: "earn",
    mid: " while remaining ",
    b: "sustainable",
  },
  bridge: "Additional capital expands productive capacity.",
  /**
   * Reduced to the minimum that still does its job. The long version read as a
   * disclaimer page; this is metadata. It states capacity, not return.
   */
  disclaimer: "Operating capacity — not a forecast of investment return.",
} as const;

/* ========================================================================== */
/* SCENE 13 — RAISE                                                            */
/* ========================================================================== */

export const raise = {
  headline: { amount: "$1.5M", rest: " seed round." },
  /** The entire slide, in one line, above everything else. */
  support: { a: "80%", aRest: " remains productive. ", b: "20%", bRest: " scales the platform." },
  centre: { label: "SEED ROUND", value: "$1.5M" },
  /**
   * Financing terms. `10%` is the deck's own (source page 14); the instrument
   * is from the client's seed-round slide, supplied 2026-08-12. The round was
   * raised from $1M to $1.5M on 2026-08-14 at the client's instruction; the
   * equity percentage was NOT changed with it, so the implied cap moved. See
   * VER-09 — no valuation is stated anywhere.
   */
  termsLabel: "TERMS",
  terms: [
    { label: "EQUITY", value: "10%" },
    { label: "INSTRUMENT", value: "Post-money SAFE" },
  ],
  allocationLabel: "ALLOCATION",
  /**
   * THE SPLIT — the substance of the client's supplied slide, and now the
   * argument this scene makes.
   *
   * The category names are the client's own FINANCIAL wording and are
   * reproduced verbatim, not paraphrased: "operating balance-sheet liquidity"
   * and "growth + operating capital" describe an accounting treatment, and
   * rewording them would be inventing one (VER-11).
   *
   * `share` drives the bars, and the two bars run on the same track, so the
   * proportion is READ rather than stated: 80 against 20, at a glance, before
   * a single line item is parsed.
   *
   * Nothing below implies a return, a yield or a guarantee. The claim is only
   * about where the money sits — deployed in the operating business, or spent
   * building around it.
   */
  split: [
    {
      key: "productive",
      share: 80,
      amount: "$1.2M",
      name: "Operating balance-sheet liquidity",
      items: [
        "Launch deployment",
        "Institutional liquidity",
        "Delta-neutral treasury",
        "Reinvested program earnings",
      ],
    },
    {
      key: "platform",
      share: 20,
      amount: "$300K",
      name: "Growth + operating capital",
      items: ["Infrastructure", "Integrations", "Operators", "Reporting + compliance"],
    },
  ],
  /**
   * The closing statement of the supplied slide, verbatim. Kept as the client
   * wrote it rather than softened or embellished — see VER-11.
   */
  footer: {
    pre: "Capital ",
    a: "compounds on the balance sheet",
    mid: " while the engine scales ",
    b: "enterprise value",
    post: ".",
  },
  /** The deck states no valuation. None is derived or displayed. See VER-09. */
  valuationNote: null,
} as const;

/* ========================================================================== */
/* SCENE 14 — CLOSE                                                            */
/* ========================================================================== */

export const close = {
  headline: { line1: "The next market maker", line2: "is not a black box." },
  support: { pre: "It is a transparent operating system with traders ", signal: "behind", post: " it." },
  /**
   * THE POSITIONING LINE — the last thing read, and the only place the deck
   * states what an investor is actually buying.
   *
   * It is the picks-and-shovels argument in the deck's own vocabulary: the
   * desk is the durable business, whichever tokens happen to be launching.
   *
   * Deliberately NOT a comparative return claim. "More lucrative than buying
   * tokens" is a forecast the deck cannot make and does not make; that a desk
   * is a different kind of asset than the tokens it quotes is simply true.
   */
  position: {
    pre: "Instead of betting on individual tokens, you are investing in the ",
    signal: "infrastructure and team",
    post: " that helps token launches succeed.",
  },
  signature: brand.signature,
} as const;

/* ========================================================================== */
/* CONTACT                                                                     */
/* ========================================================================== */

/**
 * The two Telegram handles are the only contact details in the build, supplied
 * directly by the client. They are NEVER derived, completed or guessed — a
 * wrong handle sends an investor to a stranger.
 *
 * `qr` stays null until a real QR asset is supplied. The modal renders the
 * handles as the primary action and only shows a QR panel when one exists, so
 * the absent asset degrades to nothing rather than to a broken image.
 */
export const contact = {
  trigger: "CONTACT",
  title: "TALK TO US",
  strap: "Direct line to the team.",
  closingLabel: "LET'S TALK",
  people: [
    { key: "unicorn", handle: "@unicorrrrnnnnn", url: "https://t.me/unicorrrrnnnnn" },
    { key: "gokusan", handle: "@GokuSan0x", url: "https://t.me/GokuSan0x" },
  ],
  qr: null as { src: string; alt: string } | null,
} as const;

/* ========================================================================== */
/* DRK OBJECT SYSTEM                                                           */
/* ========================================================================== */

/**
 * The 12 objects named on `asset 2.jpg`. `recurs` encodes the continuity
 * contract: these are recurring characters in one system, not per-section art.
 */
export const objectSystem: Record<
  ObjectId,
  { index: string; name: string; src: string | null; means: string; recurs: SectionId[] }
> = {
  "latency-ring": {
    index: "01",
    name: "Latency Ring",
    src: null, // built as animated SVG — it is a telemetry element, not a still
    means: "Speed and measurement",
    recurs: ["intro", "engine", "raise"],
  },
  "security-lock": {
    index: "02",
    name: "Security Lock",
    src: "/brand/objects/security-lock.png",
    means: "Custody, permissions, control",
    recurs: ["engine", "lifecycle", "control"],
  },
  "liquidity-vault": {
    index: "03",
    name: "Liquidity Vault",
    src: "/brand/objects/liquidity-vault.png",
    means: "The closed, legacy system",
    recurs: ["opacity"],
  },
  "execution-beacon": {
    index: "04",
    name: "Execution Beacon",
    src: "/brand/objects/execution-beacon.png",
    means: "Activation, first block",
    recurs: ["intro", "engine", "integration", "lifecycle", "close"],
  },
  "market-chart": {
    index: "05",
    name: "Market Chart",
    src: "/brand/objects/market-chart.png",
    means: "Performance and proof",
    recurs: ["proof", "lifecycle", "market", "compound"],
  },
  "depth-sculpture": {
    index: "06",
    name: "Depth Sculpture",
    src: "/brand/objects/depth-sculpture.png",
    means: "Order-book depth, scale",
    recurs: ["lifecycle", "compound"],
  },
  "routing-path": {
    index: "07",
    name: "Routing Path",
    src: "/brand/objects/routing-path.png",
    means: "Routing and adaptation",
    recurs: ["engine", "stack", "integration"],
  },
  "security-shield": {
    index: "08",
    name: "Security Shield",
    src: "/brand/objects/security-shield.png",
    means: "Risk, controls, trust",
    recurs: ["stack"],
  },
  "liquidity-wave": {
    index: "09",
    name: "Liquidity Wave",
    src: "/brand/objects/liquidity-wave.png",
    means: "Liquidity itself",
    recurs: ["intro", "engine", "lifecycle", "compound", "raise", "close"],
  },
  "network-nodes": {
    index: "10",
    name: "Network Nodes",
    src: "/brand/objects/network-nodes.png",
    means: "Data, reporting, integrations",
    recurs: ["intro", "engine", "stack", "integration", "control"],
  },
  "execution-engine": {
    index: "11",
    name: "Execution Engine",
    src: "/brand/objects/execution-engine.png",
    means: "The engine both businesses run on",
    recurs: ["intro", "engine", "stack", "integration", "revenue", "raise", "close"],
  },
  "frog-mascot": {
    index: "12",
    name: "Frog Mascot",
    src: null, // brand board only; never used in the deck, not used here
    means: "Community / fun element",
    recurs: [],
  },
};

/* ========================================================================== */
/* CONTENT VERIFICATION TODOs                                                  */
/* ========================================================================== */

/**
 * TODO_CONTENT_VERIFY
 * Flagged, not fixed. Every value stays exactly as supplied.
 * Full narrative in docs/DRK_SOURCE_AUDIT.md §4.
 */
export const contentVerifyTodos: Verify[] = [
  {
    id: "VER-01",
    where: "Scene 05 — Proof (source page 6)",
    issue:
      'The proof slide reads "$150k CLIENT PROFIT" and "$70k CLIENT PROFIT". The second metric repeats the label verbatim. This may be correct, or the second label may be wrong.',
    action:
      "Confirm label/context for the $70k metric before production release. Both values and labels are rendered exactly as supplied; no guess has been made.",
  },
  {
    id: "VER-02",
    where: "Scene 07 — Market (p8) and Scene 12 — Compound (p13)",
    issue:
      "Mixed market-data vintages: page 8 cites April 2025 / 2025 figures, page 13 cites May 2024 figures, while the deck itself was authored 2026-08-10.",
    action:
      "Confirm whether to refresh, re-date or retain. Nothing has been silently updated. All dates and sources render legibly.",
  },
  {
    id: "VER-03",
    where: "Scene 07 / Scene 12",
    issue:
      'Duplicate claims with different metrics, sources and vintages: "DEX surpassed CEX" appears as 1.3x (The Block, Apr 2025) and 52% of spot volume (The Block, May 2024); "Perps +100% YoY" appears from The Block (Apr 2025) and Laevitas (May 2024).',
    action: "Confirm which figure is canonical for each claim.",
  },
  {
    id: "VER-04",
    where: "Source page 4 (Scene 03 — Engine)",
    issue:
      'The "One proprietary engine" slide carries a printed page number "06" while the supplied PDF contains 15 pages and no other slide is numbered.',
    action: "Confirm no slides are missing from the supplied export.",
  },
  {
    id: "VER-05",
    where: "Scene 04 — Visibility, Scene 10 — Control Layer (source page 5)",
    issue:
      "The deck does not state whether $128.6M / $94.3M / $196.7M YTD / 2.36 Sharpe and related interface values are real client aggregates or illustrative UI values.",
    action:
      "Per-surface labelling was removed at client direction — it read as the deck arguing with the viewer. Confirm provenance before the deck is sent externally.",
  },
  {
    id: "VER-06",
    where:
      "Scene 02 — Opacity, Scene 06 — Stack, Scene 08 — Integration, Scene 10 — Control (source pages 3, 7, 9)",
    issue:
      "Pages 7 and 9 display Solana, Robinhood, Aptos, Sui, Cantor and Ethereum/EVM marks. The deck's copy establishes compatibility, not partnership.",
    action:
      "Official artwork was supplied by the client on 2026-08-12 and is now rendered for Solana, Ethereum/EVM, Aptos, Sui, Robinhood and USDC. No mark is approximated: Cantor, having no supplied artwork, stays a monogram. Every mark is still labelled as a chain, venue or asset — never as a partner or client. Confirm trademark usage rights for each mark before the deck is sent externally.",
  },
  {
    id: "VER-07",
    where: "Scene 05 — Proof",
    issue:
      '"late July / early August 2026" sits within days of the deck authoring date (2026-08-10), implying the second launch had only just concluded.',
    action: "Confirm the window and whether results are final or provisional.",
  },
  {
    id: "VER-08",
    where: "Scene 11 — Revenue (source page 12)",
    issue: 'Stream 04 reads "15–35% of off-ramp*" with the footnote "based on liquidity provided".',
    action: "Confirm the footnote is complete and that no tiering, cap or term is missing.",
  },
  {
    id: "VER-09",
    where:
      "Scene 13 — Raise (source page 14, plus the seed-round slide supplied 2026-08-12, raised to $1.5M on 2026-08-14)",
    issue:
      "$1.5M for 10% on a post-money SAFE implies a $15M post-money cap, which neither the deck nor the supplied slide states. The round size was raised from $1M without a corresponding instruction on the equity percentage, so the implied cap moved from $10M to $15M as a side effect.",
    action:
      "No valuation is stated or derived. The 80 / 20 split shown is the client's own, supplied 2026-08-12, and its amounts ($1.2M / $300K) were rescaled with the round. CONFIRM the 10% equity figure is still correct at $1.5M — if it is not, the terms row is the only place to change it.",
  },
  {
    id: "VER-11",
    where: "Scene 13 — Raise (seed-round slide supplied 2026-08-12)",
    issue:
      '"Operating balance-sheet liquidity", "growth + operating capital" and "capital compounds on the balance sheet while the engine scales enterprise value" are accounting and valuation statements.',
    action:
      "Reproduced verbatim from the supplied slide and never paraphrased — rewording them would be inventing an accounting treatment. No return, yield or guarantee is stated or implied anywhere in the scene. Confirm the wording is final and that the balance-sheet characterisation is correct before the deck is sent externally.",
  },
  {
    id: "VER-10",
    where: "Scene 05 — Proof",
    issue: "The proof slide names no clients.",
    action:
      "Anonymity preserved using LAUNCH 01 / LAUNCH 02. Confirm whether named case studies will be permitted later.",
  },
];

export const sourceNote = {
  deck: "Pitch deck.pdf — 15 pages, authored 2026-08-10",
  brandBoards: "asset 2.jpg (3D Brand Asset System), asset.jpg (secondary icon board)",
  statement:
    "All figures, claims and terminology are transcribed from the supplied DRK pitch deck. Nothing has been added, updated or extrapolated.",
};
