/**
 * DRK visual QA harness.
 *
 * Captures every major scene plus the important sticky-scroll states at the
 * five required presentation sizes, into .review/desktop and .review/mobile.
 *
 *   node scripts/visual-qa.mjs                    # everything
 *   node scripts/visual-qa.mjs --vp=1440x900      # one viewport
 *   node scripts/visual-qa.mjs --scene=control    # one scene
 *   node scripts/visual-qa.mjs --reduced          # reduced-motion pass
 */
import { chromium } from "@playwright/test";
import { dismissCurtain } from "./curtain.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.DRK_URL ?? "http://localhost:3111";
const ROOT = path.resolve(process.cwd(), "..", ".review");

const args = process.argv.slice(2);
const argVal = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const onlyVp = argVal("vp");
const onlyScene = argVal("scene");
const reduced = args.includes("--reduced");

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080, group: "desktop" },
  { name: "1440x900", width: 1440, height: 900, group: "desktop" },
  { name: "1366x768", width: 1366, height: 768, group: "desktop" },
  { name: "1024x768", width: 1024, height: 768, group: "desktop" },
  { name: "390x844", width: 390, height: 844, group: "mobile", mobile: true },
].filter((v) => !onlyVp || v.name === onlyVp);

/** scene id -> sample points through its own scroll runway (0..1) */
const SCENES = [
  ["intro", [0, 0.3, 0.55, 0.75, 0.95]],
  ["opacity", [0.15, 0.45, 0.62, 0.9]],
  ["engine", [0.1, 0.4, 0.75, 0.97]],
  ["visibility", [0.1, 0.38, 0.62, 0.9]],
  ["proof", [0.2, 0.7]],
  ["stack", [0.12, 0.42, 0.7, 0.95]],
  ["market", [0.12, 0.45, 0.75, 0.97]],
  ["integration", [0.15, 0.45, 0.72, 0.95]],
  ["lifecycle", [0.1, 0.32, 0.55, 0.78, 0.96]],
  ["control", [0.06, 0.24, 0.42, 0.58, 0.76, 0.94]],
  ["demo", [0.15, 0.5, 0.85]],
  ["revenue", [0.12, 0.42, 0.7, 0.95]],
  ["compound", [0.12, 0.45, 0.75, 0.96]],
  ["raise", [0.12, 0.45, 0.72, 0.95]],
  ["close", [0.3, 0.85]],
].filter(([id]) => !onlyScene || id === onlyScene);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const browser = await chromium.launch();
  let shots = 0;
  const problems = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: !!vp.mobile,
      hasTouch: !!vp.mobile,
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const page = await ctx.newPage();

    page.on("pageerror", (e) => problems.push(`[${vp.name}] pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`[${vp.name}] console: ${m.text()}`);
    });

    await page.goto(BASE, { waitUntil: "networkidle" });
    await dismissCurtain(page);
    await page.evaluate(() => document.fonts.ready);
    await sleep(700);

    const dir = path.join(ROOT, vp.group, reduced ? `${vp.name}-reduced` : vp.name);
    fs.mkdirSync(dir, { recursive: true });

    for (const [id, points] of SCENES) {
      const box = await page.evaluate((sceneId) => {
        const el = document.getElementById(sceneId);
        if (!el) return null;
        return { top: el.offsetTop, height: el.offsetHeight };
      }, id);

      if (!box) {
        problems.push(`[${vp.name}] scene #${id} not found in DOM`);
        continue;
      }

      for (const t of points) {
        const runway = Math.max(0, box.height - vp.height);
        const y = Math.round(box.top + runway * t);
        await page.evaluate((py) => window.scrollTo(0, py), y);
        await sleep(reduced ? 220 : 620);

        const file = path.join(dir, `${id}-${String(Math.round(t * 100)).padStart(3, "0")}.png`);
        await page.screenshot({ path: file });
        shots++;

        // A pinned stage is `h-screen; overflow:hidden`. If its content is
        // taller than the box, the scene is CLIPPING — the single biggest
        // layout risk on short viewports.
        const clip = await page.evaluate((sceneId) => {
          const stage = document.querySelector(`#${sceneId} [data-stage]`);
          if (!stage) return null;
          // Only pinned stages can clip; on mobile the stage is a normal block.
          if (getComputedStyle(stage).position !== "sticky") return null;
          const over = stage.scrollHeight - stage.clientHeight;
          return over > 4 ? { over, h: stage.clientHeight } : null;
        }, id);
        if (clip) {
          problems.push(
            `[${vp.name}] CLIPPED #${id} @${t}: content overflows pinned stage by ${clip.over}px (stage ${clip.h}px)`,
          );
        }
      }
    }

    // horizontal-overflow assertion — must be zero at every width
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const offenders = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1)) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)}..${Math.round(r.right)}]`,
            );
          }
        }
      }
      return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders: offenders.slice(0, 8) };
    });
    if (overflow.scrollWidth > overflow.clientWidth + 1) {
      problems.push(
        `[${vp.name}] HORIZONTAL OVERFLOW ${overflow.scrollWidth} > ${overflow.clientWidth}\n    ${overflow.offenders.join("\n    ")}`,
      );
    }

    await ctx.close();
  }

  await browser.close();

  console.log(`\n${shots} screenshots -> ${ROOT}`);
  if (problems.length) {
    console.log(`\n!! ${problems.length} problem(s):`);
    for (const p of [...new Set(problems)]) console.log("  - " + p);
    process.exitCode = 1;
  } else {
    console.log("no console errors, no page errors, no horizontal overflow.");
  }
}

run();
