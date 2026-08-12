"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useOffscreenFlag } from "@/hooks/useScene";
import { cn } from "@/lib/utils";
import { sections, type SectionId } from "@/content/drk";
import { SYSTEM_STATE } from "@/lib/world";

/**
 * Scene primitive.
 *
 * `height` sets the scroll runway. Sticky scenes put their composition in a
 * `<SceneStage>` child that pins for the duration. Nothing here reads as a
 * "slide": there is no frame, no arrows, no page-turn.
 *
 * Scenes never paint a background. The ground, the light and the liquidity
 * signal are owned globally by `<DrkWorld>` — that is what makes the fifteen
 * scenes read as one continuous machine rather than fourteen sections.
 */

interface SceneCtx {
  id: SectionId;
  index: string;
  title: string;
}

const Ctx = createContext<SceneCtx | null>(null);

export function Scene({
  id,
  index,
  title,
  height = "100vh",
  children,
  className,
  sceneRef,
}: {
  id: SectionId;
  index: string;
  title: string;
  height?: string;
  children: ReactNode;
  className?: string;
  /**
   * The scene's own element ref. Sections that derive sticky state from scroll
   * MUST pass this — it is the element `useSceneProgress` measures.
   */
  sceneRef?: React.RefObject<HTMLElement | null>;
}) {
  const localRef = useRef<HTMLElement>(null);
  const ref = sceneRef ?? localRef;
  useOffscreenFlag(ref);

  return (
    <Ctx.Provider value={{ id, index, title }}>
      <section
        ref={ref}
        id={id}
        aria-labelledby={`${id}-title`}
        data-scene={id}
        data-scene-index={index}
        /*
         * The scroll runway is a DESKTOP concept. On mobile the scene is a
         * normal block that grows to fit its content — recomposed vertical
         * storytelling rather than a pinned narrative squeezed onto a phone.
         */
        className={cn("relative w-full min-h-screen lg:min-h-[var(--scene-h)]", className)}
        style={{ "--scene-h": height } as React.CSSProperties}
      >
        {/* Accessible scene title. Visible headlines live inside each scene. */}
        <h2 id={`${id}-title`} className="sr-only-focusable">
          {index}. {title}
        </h2>
        {children}
      </section>
    </Ctx.Provider>
  );
}

/**
 * The pinned stage inside a tall Scene. Uses native `position: sticky` — no
 * pin-spacers, no refresh lifecycle, no transform hacks.
 *
 * Structure is deliberate: the composition takes the free height and the
 * instrument strip anchors the bottom edge. Before this, every scene left
 * 200–300px of unstructured emptiness under its content at 1440×900, which
 * reads as unfinished rather than as restraint.
 */
export function SceneStage({
  children,
  className,
  strip = true,
  tight = false,
}: {
  children: ReactNode;
  className?: string;
  /** Set false for scenes that compose their own bottom edge (e.g. Close). */
  strip?: boolean;
  /**
   * Reclaim the stage's breathing room for scenes whose content IS the frame.
   *
   * The standard padding clears the fixed wordmark AND leaves room for a lede
   * beneath a headline. Scene 11 is a single product surface that has to fill
   * the viewport and has no lede, so it keeps only the wordmark clearance —
   * which is a hard floor, not a preference: below it the scene's eyebrow
   * collides with the fixed lockup.
   */
  tight?: boolean;
}) {
  return (
    <div
      data-stage=""
      className={cn(
        // mobile: a normal block, free to be as tall as its content
        "relative flex w-full flex-col py-[clamp(4.5rem,11vh,6.5rem)]",
        // desktop: the pinned stage
        "lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:py-0",
        className,
      )}
    >
      {/* Top padding clears the fixed wordmark; bottom padding keeps the
          composition off the instrument strip. */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col justify-center",
          tight
            ? "lg:pt-[clamp(4.4rem,7.8vh,5.75rem)] lg:pb-[clamp(1rem,2vh,1.75rem)]"
            : "lg:pt-[clamp(4.75rem,9vh,7rem)] lg:pb-[clamp(2rem,4vh,3.25rem)]",
        )}
      >
        {children}
      </div>
      {strip && <SceneStrip />}
    </div>
  );
}

/**
 * The instrument strip: a hairline readout welded to the bottom of every
 * pinned scene. It carries the scene's position in the deck, the machine's
 * current state, and a 15-tick position gauge.
 *
 * It exists for three reasons: it composes the bottom edge of every frame, it
 * makes the system feel continuously instrumented, and it is a second,
 * non-colour cue for where the viewer is.
 */
function SceneStrip() {
  const scene = useContext(Ctx);
  if (!scene) return null;
  const idx = sections.findIndex((s) => s.id === scene.id);
  const sys = SYSTEM_STATE[scene.id];

  return (
    <div className="drk-shell relative z-10 hidden shrink-0 pb-[clamp(1.1rem,2.4vh,1.9rem)] lg:block">
      <div className="flex items-center gap-5 border-t border-[var(--color-hairline)] pt-3">
        <span className="drk-label drk-mono shrink-0 text-[var(--color-signal)]">
          {scene.index}
        </span>
        <span className="drk-label shrink-0 text-[var(--color-faint)]">{scene.title}</span>

        {/* 15-tick position gauge — the deck's own progress, always visible */}
        <span aria-hidden className="flex min-w-0 flex-1 items-center gap-[3px] px-2">
          {sections.map((s, i) => (
            <span
              key={s.id}
              className="h-[2px] flex-1 rounded-full"
              style={{
                background:
                  i === idx
                    ? "var(--color-signal)"
                    : i < idx
                      ? "var(--color-hairline-strong)"
                      : "var(--color-hairline)",
                opacity: i === idx ? 1 : i < idx ? 0.9 : 0.7,
              }}
            />
          ))}
        </span>

        <span className="flex shrink-0 items-center gap-2">
          <span aria-hidden className="size-1 rounded-full bg-[var(--color-signal)]" />
          <span className="drk-label text-[var(--color-faint)]">
            SYSTEM / <span className="text-[var(--color-signal)]">{sys.state}</span>
          </span>
        </span>
      </div>
    </div>
  );
}

/** Standard content shell: max width, responsive gutters. */
export function SceneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("drk-shell w-full", className)}>{children}</div>;
}

/**
 * Scene header: index label + display headline + optional lede, with the
 * rhythm defined once. Used by every scene so headline scale, tracking and the
 * headline→lede gap are identical throughout.
 */
export function SceneHead({
  index,
  eyebrow,
  children,
  lede,
  rule = true,
  align = "left",
  size = "h1",
  className,
}: {
  index: string;
  eyebrow: string;
  children: ReactNode;
  lede?: ReactNode;
  rule?: boolean;
  align?: "left" | "center";
  size?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div
        className={cn("flex items-center gap-3", align === "center" && "justify-center")}
      >
        <span aria-hidden className="h-px w-6 shrink-0 bg-[var(--color-hairline-strong)]" />
        <span className="drk-label drk-mono text-[var(--color-signal)]">{index}</span>
        <span className="drk-label">{eyebrow}</span>
      </div>

      <h3
        className={cn(
          "drk-display mt-[clamp(1.1rem,2.2vh,1.75rem)]",
          size === "h1"
            ? "text-[clamp(2.05rem,4.3vw,3.75rem)]"
            : "text-[clamp(1.8rem,3.5vw,3.05rem)]",
        )}
      >
        {children}
      </h3>

      {rule && (
        <span
          aria-hidden
          className={cn("drk-rule", align === "center" && "mx-auto")}
        />
      )}

      {lede && (
        <p className={cn("drk-lede", align === "center" && "mx-auto max-w-[54ch]")}>{lede}</p>
      )}
    </div>
  );
}
