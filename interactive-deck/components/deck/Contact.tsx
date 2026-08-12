"use client";

import Image from "next/image";
import { Overlay, OverlayClose } from "@/components/ui/Overlay";
import { contact } from "@/content/drk";
import { cn } from "@/lib/utils";

/**
 * The contact layer.
 *
 * One affordance, available from every scene, that resolves to the two Telegram
 * handles the client supplied. The handles are the primary action — they are
 * real links, not text to copy — and the QR, if one is ever supplied, is the
 * secondary convenience beside them.
 *
 * Deliberately restrained: a large CTA on a deck whose whole argument is
 * institutional restraint would undo the argument.
 */

/* -------------------------------------------------------------------------- */

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.94 4.6l-3.03 14.29c-.23 1.01-.83 1.26-1.68.78l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73L18.35 6.3c.37-.33-.08-.52-.58-.19L6.14 13.35l-4.66-1.46c-1.01-.32-1.03-1.01.21-1.5l18.22-7.02c.84-.31 1.58.2 1.31 1.23z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The two handles as real links. Shared between the modal and the closing
 * scene so a handle can never be updated in one place and go stale in the
 * other.
 */
export function ContactLinks({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {contact.people.map((p) => (
        <li key={p.key}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex items-center gap-3 rounded-[10px] border border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-void)_50%,var(--color-panel))] transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:border-[var(--color-hairline-signal)] hover:bg-[var(--color-panel-2)] focus-visible:border-[var(--color-hairline-signal)]",
              size === "lg" ? "px-4 py-3.5" : "px-3.5 py-2.5",
            )}
          >
            <TelegramIcon
              className={cn(
                "shrink-0 text-[var(--color-signal)]",
                size === "lg" ? "size-5" : "size-4",
              )}
            />
            <span
              className={cn(
                "drk-mono min-w-0 flex-1 truncate font-medium text-[var(--color-ink)]",
                size === "lg" ? "text-[clamp(0.95rem,1.4vw,1.1rem)]" : "text-[0.9rem]",
              )}
            >
              {p.handle}
            </span>
            <span
              aria-hidden
              className="drk-label shrink-0 text-[var(--color-faint)] transition-colors duration-[220ms] group-hover:text-[var(--color-signal)]"
            >
              TELEGRAM
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */

export function ContactTrigger({
  onOpen,
  className,
}: {
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "drk-label pointer-events-auto inline-flex items-center gap-2 rounded-[999px] border border-[var(--color-hairline-strong)] bg-[color-mix(in_srgb,var(--color-void)_72%,var(--color-panel))] px-3 py-1.5 text-[var(--color-ink-soft)] backdrop-blur-md transition-colors duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:border-[var(--color-hairline-signal)] hover:text-[var(--color-ink)] focus-visible:border-[var(--color-hairline-signal)] focus-visible:text-[var(--color-signal)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-1 rounded-full bg-[var(--color-signal)] shadow-[0_0_7px_0_rgba(0,224,96,0.9)]"
      />
      {contact.trigger}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Overlay open={open} onClose={onClose} label={contact.title} className="max-w-[24rem]">
      <div className="p-[clamp(1.25rem,3vw,1.75rem)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[clamp(1.15rem,2vw,1.4rem)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              {contact.title}
            </h2>
            <p className="mt-1 text-[0.84rem] text-[var(--color-muted)]">{contact.strap}</p>
          </div>
          <OverlayClose onClose={onClose} />
        </div>

        <ContactLinks className="mt-[clamp(1.1rem,2.5vw,1.5rem)]" size="lg" />

        {/* Secondary, and only when a real asset exists. */}
        {contact.qr && (
          <div className="mt-5 flex items-center gap-4 border-t border-[var(--color-hairline)] pt-5">
            <span className="shrink-0 rounded-[8px] bg-white p-2">
              <Image
                src={contact.qr.src}
                alt={contact.qr.alt}
                width={92}
                height={92}
                className="size-[5.75rem]"
              />
            </span>
            <p className="text-[0.78rem] leading-relaxed text-[var(--color-fineprint)]">
              Scan to open Telegram.
            </p>
          </div>
        )}
      </div>
    </Overlay>
  );
}
