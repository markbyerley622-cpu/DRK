import { notFound } from "next/navigation";
import { VerifyNotes } from "@/components/deck/VerifyNotes";

/**
 * INTERNAL — content-verification register.
 *
 * Development tooling, not part of the investor experience. `notFound()` in a
 * production build means the route is unreachable in anything that ships, while
 * the ten TODO_CONTENT_VERIFY records stay in `content/drk.ts` where they
 * cannot be lost. The permanent copy is `docs/DRK_CONTENT_VERIFICATION.md`.
 */
export default function InternalVerificationPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <VerifyNotes />
    </main>
  );
}
