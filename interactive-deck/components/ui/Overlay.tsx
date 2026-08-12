"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePrefersReducedMotion } from "@/hooks/useScene";
import { cn } from "@/lib/utils";

/**
 * The one modal in the build.
 *
 * Portalled to <body> on purpose: every scene sits inside a sticky, transformed
 * stage, and a `position: fixed` element nested inside a transformed ancestor is
 * positioned against that ancestor rather than the viewport. Rendered in place,
 * the overlay would be clipped to whichever scene happened to be on screen.
 *
 * Carries the full dialog contract — labelled, focus-trapped, focus-restoring,
 * ESC to dismiss, backdrop to dismiss, background scroll and interaction locked
 * while open, and reduced-motion honoured.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, video, [tabindex]:not([tabindex="-1"])';

export function Overlay({
  open,
  onClose,
  label,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // Portals need a DOM target, which does not exist during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ---- background scroll + focus management ---- */
  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    // Compensate for the scrollbar the lock removes, or the whole page shifts
    // sideways as the modal opens.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    // Focus the panel itself rather than the first control: the first control
    // in the contact modal is a Telegram link, and opening a dialog with a link
    // already focused reads as though it has been activated.
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      restoreTo.current?.focus?.();
    };
  }, [open]);

  /* ---- ESC + focus trap ---- */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      // Shift+Tab off the first control (or off the panel) wraps to the last.
      if (e.shiftKey && (activeEl === first || activeEl === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[clamp(1rem,4vw,3rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.22, ease: [0.2, 0.7, 0.3, 1] }}
          onKeyDown={onKeyDown}
        >
          {/* backdrop — click to dismiss */}
          <div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-void)_88%,transparent)] backdrop-blur-[6px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 0.84, 0.24, 1] }}
            className={cn(
              "relative max-h-full w-full overflow-y-auto rounded-[14px] border border-[var(--color-hairline-strong)] bg-[var(--color-base)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] outline-none",
              className,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** The dismiss control. Same affordance in both modals. */
export function OverlayClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="grid size-8 shrink-0 place-items-center rounded-[7px] border border-[var(--color-hairline)] text-[var(--color-faint)] transition-colors duration-[220ms] hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-ink)] focus-visible:border-[var(--color-hairline-signal)] focus-visible:text-[var(--color-signal)]"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M3 3l10 10M13 3L3 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
