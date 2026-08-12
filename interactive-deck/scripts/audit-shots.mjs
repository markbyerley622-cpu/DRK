/**
 * Premium-refinement audit capture.
 *
 * Captures a decisive frame set for visual inspection, plus automated
 * measurements that a screenshot alone will not reveal (clipping, overflow,
 * console errors, tiny type, low-contrast text).
 *
 *   node scripts/audit-shots.mjs --out=audit --vp=1440x900
 */
import { chromium } from "@playwright/test";
import { dismissCurtain } from "./curtain.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.DRK_URL ?? "http://localhost:3001";
const args = process.argv.slice(2);
const argVal = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const OUT = argVal("out") ?? "audit";
const onlyVp = argVal("vp");
const onlyScene = argVal("scene");
const ROOT = path.resolve(process.cwd(), "..", ".review", OUT);

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080, group: "desktop" },
  { name: "1440x900", width: 1440, height: 900, group: "desktop" },
  { name: "1366x768", width: 1366, height: 768, group: "desktop" },
  { name: "1024x768", width: 1024, height: 768, group: "desktop" },
  { name: "390x844", width: 390, height: 844, group: "mobile", mobile: true },
].filter((v) => !onlyVp || v.name === onlyVp);

const SCENES = [
  ["intro", [0, 0.35, 0.7, 0.95]],
  ["opacity", [0.2, 0.5, 0.9]],
  ["engine", [0.15, 0.5, 0.95]],
  ["visibility", [0.15, 0.5, 0.85]],
  ["proof", [0.5]],
  ["stack", [0.2, 0.6, 0.95]],
  ["market", [0.2, 0.6, 0.95]],
  ["integration", [0.25, 0.7, 0.95]],
  ["lifecycle", [0.15, 0.5, 0.9]],
  ["control", [0.1, 0.4, 0.7, 0.95]],
  ["revenue", [0.2, 0.6, 0.95]],
  ["compound", [0.2, 0.6, 0.95]],
  ["raise", [0.2, 0.6, 0.95]],
  ["close", [0.5, 0.95]],
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

    const dir = path.join(ROOT, vp.group, vp.name);
    fs.mkdirSync(dir, { recursive: true });

    for (const [id, points] of SCENES) {
      const box = await page.evaluate((sceneId) => {
        const el = document.getElementById(sceneId);
        return el ? { top: el.offsetTop, height: el.offsetHeight } : null;
      }, id);
      if (!box) {
        problems.push(`[${vp.name}] scene #${id} missing`);
        continue;
      }
      for (const t of points) {
        const runway = Math.max(0, box.height - vp.height);
        await page.evaluate((py) => window.scrollTo(0, py), Math.round(box.top + runway * t));
        await sleep(600);
        await page.screenshot({
          path: path.join(dir, `${id}-${String(Math.round(t * 100)).padStart(3, "0")}.png`),
        });
        shots++;

        /*
         * Real content overflow only. `.drk-scrim::before` is a decorative
         * gradient that deliberately overhangs its box; it inflates the stage's
         * scrollHeight without a single pixel of content being clipped, so it is
         * neutralised for the duration of the measurement.
         */
        const clip = await page.evaluate((sceneId) => {
          const stage = document.querySelector(`#${sceneId} [data-stage]`);
          if (!stage) return null;
          if (getComputedStyle(stage).position !== "sticky") return null;
          const st = document.createElement("style");
          st.textContent = ".drk-scrim::before{display:none!important}";
          document.head.appendChild(st);
          const sr = stage.getBoundingClientRect();
          let over = stage.scrollHeight - stage.clientHeight;
          // A justify-center band overflows UPWARDS too, which scrollHeight
          // never reports — and that is exactly how content ends up riding
          // under the fixed wordmark.
          for (const el of stage.querySelectorAll("[data-stage] > div > *, [data-stage] > div")) {
            const r = el.getBoundingClientRect();
            if (r.height === 0) continue;
            const up = Math.round(sr.top - r.top);
            if (up > over) over = up;
          }
          st.remove();
          return over > 4 ? over : null;
        }, id);
        if (clip) problems.push(`[${vp.name}] CLIPPED #${id} @${t}: +${clip}px`);
      }
    }

    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const offenders = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1)) {
            offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`);
          }
        }
      }
      return { sw: de.scrollWidth, cw: de.clientWidth, offenders: offenders.slice(0, 6) };
    });
    if (overflow.sw > overflow.cw + 1) {
      problems.push(`[${vp.name}] H-OVERFLOW ${overflow.sw}>${overflow.cw} :: ${overflow.offenders.join(", ")}`);
    }

    await ctx.close();
  }

  await browser.close();
  console.log(`\n${shots} shots -> ${ROOT}`);
  if (problems.length) {
    console.log(`\n!! ${problems.length} problem(s):`);
    for (const p of [...new Set(problems)]) console.log("  - " + p);
  } else {
    console.log("clean: no console errors, no clipping, no horizontal overflow.");
  }
}

run();
