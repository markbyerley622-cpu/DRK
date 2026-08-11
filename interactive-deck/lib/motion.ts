/**
 * DRK MOTION GRAMMAR
 * ============================================================================
 * One physical language for the whole experience. No component invents its own
 * easing or picks its own duration; they choose a BEHAVIOUR, and the behaviour
 * carries the physics.
 *
 * Before this file the deck used eleven instances of one bezier, five of
 * another, and free-hand durations from 0.22s to 0.9s with no relationship
 * between them. The result animated correctly and read as several different
 * design teams.
 *
 * THE FIVE BEHAVIOURS
 *
 *   FLOW         capital or signal travels through a route
 *   ACTIVATE     dormant infrastructure powers on
 *   ROUTE        a system establishes a connection
 *   RECONFIGURE  the same infrastructure changes operating state
 *   RESOLVE      complexity collapses into a clear final state
 *
 * If an animation cannot be described with one of those verbs, it is
 * decoration and does not belong.
 *
 * Nothing here springs, bounces or overshoots. Machined equipment does not
 * wobble, and a market maker's interface should not either.
 */

export type Easing = readonly [number, number, number, number];

/* -------------------------------------------------------------------------- */
/* CURVES                                                                      */
/* -------------------------------------------------------------------------- */

export const EASE = {
  /** Arriving mass: quick commitment, long controlled settle. */
  enter: [0.16, 0.84, 0.24, 1] as Easing,
  /** Leaving: decisive, no lingering. */
  exit: [0.6, 0.04, 0.98, 0.34] as Easing,
  /** A signal travelling a route. Nearly linear — liquidity does not ease. */
  route: [0.42, 0.0, 0.58, 1] as Easing,
  /** Physical objects. Heavy, slow to start, slow to stop. */
  object: [0.36, 0.0, 0.24, 1] as Easing,
  /** Interface response. Fast and precise; the machine answers immediately. */
  ui: [0.2, 0.7, 0.3, 1] as Easing,
  /** Camera. Long, even, cinematic. */
  camera: [0.5, 0.0, 0.2, 1] as Easing,
} as const;

/** CSS strings, for the handful of places that need a transition property. */
export const CSS_EASE = Object.fromEntries(
  Object.entries(EASE).map(([k, v]) => [k, `cubic-bezier(${v.join(",")})`]),
) as Record<keyof typeof EASE, string>;

/* -------------------------------------------------------------------------- */
/* DURATION LADDER                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Five steps, each roughly 1.6× the last. Every duration in the experience is
 * one of these; the brief's timing bands map onto them directly.
 */
export const DUR = {
  /** 160ms — micro: a tick lights, a value commits. */
  tick: 0.16,
  /** 260ms — UI: a selection answers, a panel swaps. */
  ui: 0.26,
  /** 420ms — reconfigure: a system changes operating state. */
  state: 0.42,
  /** 680ms — section: content arrives. */
  section: 0.68,
  /** 1100ms — scene: the camera moves, a route draws. */
  scene: 1.1,
} as const;

/* -------------------------------------------------------------------------- */
/* BEHAVIOURS — what components actually reach for                             */
/* -------------------------------------------------------------------------- */

export const MOTION = {
  /** Capital or signal moving along a path. */
  flow: { duration: DUR.scene, ease: EASE.route },
  /** Infrastructure powering on. */
  activate: { duration: DUR.section, ease: EASE.enter },
  /** A connection being established. */
  route: { duration: DUR.state, ease: EASE.route },
  /** The same system changing operating state. */
  reconfigure: { duration: DUR.state, ease: EASE.enter },
  /** Complexity collapsing to a conclusion. */
  resolve: { duration: DUR.section, ease: EASE.camera },
  /** Interface answering a click. */
  ui: { duration: DUR.ui, ease: EASE.ui },
  /** A value or tick committing. */
  tick: { duration: DUR.tick, ease: EASE.ui },
  /** Physical mass moving. */
  object: { duration: DUR.section, ease: EASE.object },
  /** Something leaving. */
  exit: { duration: DUR.ui, ease: EASE.exit },
} as const;

export type Behaviour = keyof typeof MOTION;

/* -------------------------------------------------------------------------- */
/* TAILWIND HELPERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Utility strings for the CSS-transition path, so a component never writes
 * `duration-300 ease-out` by hand.
 *
 *   className={cn("transition-colors", TW.ui)}
 */
export const TW = {
  tick: "duration-[160ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
  ui: "duration-[260ms] ease-[cubic-bezier(0.2,0.7,0.3,1)]",
  state: "duration-[420ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
  route: "duration-[420ms] ease-[cubic-bezier(0.42,0,0.58,1)]",
  section: "duration-[680ms] ease-[cubic-bezier(0.16,0.84,0.24,1)]",
  object: "duration-[680ms] ease-[cubic-bezier(0.36,0,0.24,1)]",
} as const;
