import { WorldProvider } from "@/hooks/useWorld";
import { DrkWorld } from "@/components/world/DrkWorld";
import { DeckNav } from "@/components/deck/DeckNav";
import { Intro } from "@/components/sections/Intro";
import { Opacity } from "@/components/sections/Opacity";
import { Engine } from "@/components/sections/Engine";
import { Visibility } from "@/components/sections/Visibility";
import { Proof } from "@/components/sections/Proof";
import { Stack } from "@/components/sections/Stack";
import { Market } from "@/components/sections/Market";
import { Integration } from "@/components/sections/Integration";
import { Lifecycle } from "@/components/sections/Lifecycle";
import { Control } from "@/components/sections/Control";
import { Revenue } from "@/components/sections/Revenue";
import { Compound } from "@/components/sections/Compound";
import { Raise } from "@/components/sections/Raise";
import { Close } from "@/components/sections/Close";

/**
 * The investor-facing experience.
 *
 * Nothing internal ships here. The content-verification register lives in
 * `docs/DRK_CONTENT_VERIFICATION.md` and, during development only, at
 * `/internal/verification`.
 */
export default function Page() {
  return (
    <WorldProvider>
      {/* One persistent world beneath everything. */}
      <DrkWorld />
      <DeckNav />

      <main id="main">
        <h1 className="sr-only-focusable">
          DRK. The operating system for liquidity — Launch &amp; Institutional Trading
        </h1>

        {/* 01-04 — the operating layer */}
        <Intro />
        <Opacity />
        <Engine />
        <Visibility />

        {/* 05-09 — the business */}
        <Proof />
        <Stack />
        <Market />
        <Integration />
        <Lifecycle />

        {/* 10 — the product */}
        <Control />

        {/* 11-13 — the economics */}
        <Revenue />
        <Compound />
        <Raise />

        {/* 14 — the thesis */}
        <Close />
      </main>
    </WorldProvider>
  );
}
