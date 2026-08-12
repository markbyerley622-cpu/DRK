/**
 * Accessibility audit with axe-core.
 *
 * Runs in `prefers-reduced-motion: reduce`, where every scene renders FULLY
 * COMPOSED and nothing is mid-reveal. This is the honest way to audit a
 * scroll-driven page: a single static snapshot at scroll 0 (which is all
 * Lighthouse can take) reports every not-yet-revealed element as a contrast
 * failure, because it measures the dimmed blend rather than the real colour.
 *
 *   node scripts/a11y.mjs
 */
import { chromium } from "@playwright/test";
import { dismissCurtain } from "./curtain.mjs";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = fs.readFileSync(axePath, "utf8");

const BASE = process.env.DRK_URL ?? "http://localhost:3112";

const VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "390x844", width: 390, height: 844 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
let total = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await page.evaluate(() => document.fonts.ready);

  // walk the page so every in-view reveal has fired
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 16));
    }
    window.scrollTo(0, 0);
  });
  await sleep(600);

  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () =>
    // @ts-expect-error injected
    await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    }),
  );

  console.log(`\n=== ${vp.name} (reduced motion, fully composed) ===`);
  console.log(`passes: ${results.passes.length}   violations: ${results.violations.length}`);

  for (const v of results.violations) {
    total += v.nodes.length;
    console.log(`\n  [${v.impact}] ${v.id} — ${v.help}  (${v.nodes.length} node(s))`);
    for (const n of v.nodes.slice(0, 6)) {
      console.log(`    ${n.target.join(" ")}`);
      const msg = (n.any?.[0]?.message || n.all?.[0]?.message || "").split("\n")[0];
      if (msg) console.log(`      ${msg}`);
    }
  }

  await ctx.close();
}

await browser.close();
console.log(total === 0 ? "\nNo WCAG A/AA violations." : `\n${total} violating node(s).`);
process.exitCode = total === 0 ? 0 : 1;
