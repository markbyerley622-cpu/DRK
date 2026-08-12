/** Interaction QA for the two overlays: contact + the demo theatre. */
import { chromium } from "@playwright/test";
import { dismissCurtain } from "./curtain.mjs";

const BASE = "http://localhost:3111";
const fails = [];
const ok = [];
const check = (name, cond, extra = "") =>
  (cond ? ok : fails).push(`${name}${extra ? ` — ${extra}` : ""}`);

const browser = await chromium.launch();

for (const vp of [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "390x844", width: 390, height: 844, isMobile: true, hasTouch: true },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  // The deck hydrates a persistent world canvas; give it a beat to settle so
  // the trigger is stable before Playwright's actionability check runs.
  await page.waitForTimeout(700);

  /* ---------------- CONTACT ---------------- */
  // Both breakpoints render a trigger; only one is displayed at a time.
  const trigger = page.locator("button").filter({ hasText: "CONTACT" }).locator("visible=true");
  await trigger.waitFor({ state: "visible", timeout: 10000 });
  check(`[${vp.name}] contact trigger visible`, await trigger.isVisible());

  const scrollBefore = await page.evaluate(() => window.scrollY);
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "TALK TO US" });
  await dialog.waitFor({ state: "visible", timeout: 4000 });
  check(`[${vp.name}] contact dialog opens`, await dialog.isVisible());

  // background scroll locked
  check(
    `[${vp.name}] background scroll locked`,
    (await page.evaluate(() => getComputedStyle(document.body).overflow)) === "hidden",
  );

  // both handles present, correct hrefs, open in new tab
  for (const [handle, url] of [
    ["@unicorrrrnnnnn", "https://t.me/unicorrrrnnnnn"],
    ["@GokuSan0x", "https://t.me/GokuSan0x"],
  ]) {
    const link = dialog.locator(`a[href="${url}"]`);
    check(`[${vp.name}] link ${handle}`, (await link.count()) === 1);
    if (await link.count()) {
      check(
        `[${vp.name}] ${handle} target/rel`,
        (await link.getAttribute("target")) === "_blank" &&
          (await link.getAttribute("rel")).includes("noopener"),
      );
    }
  }

  // ESC closes
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 4000 });
  check(`[${vp.name}] ESC closes contact`, !(await dialog.isVisible()));
  check(
    `[${vp.name}] scroll restored`,
    (await page.evaluate(() => getComputedStyle(document.body).overflow)) !== "hidden",
  );
  check(
    `[${vp.name}] deck position preserved`,
    Math.abs((await page.evaluate(() => window.scrollY)) - scrollBefore) < 4,
  );

  // outside click closes
  await trigger.click();
  await dialog.waitFor({ state: "visible", timeout: 4000 });
  await page.mouse.click(6, vp.height - 6);
  await dialog.waitFor({ state: "hidden", timeout: 4000 });
  check(`[${vp.name}] backdrop click closes contact`, !(await dialog.isVisible()));

  // focus restored to the trigger
  check(
    `[${vp.name}] focus restored to trigger`,
    await page.evaluate(() => document.activeElement?.textContent?.includes("CONTACT") ?? false),
  );

  /* ---------------- DEMO SCENE + THEATRE ---------------- */
  await page.evaluate(() => document.getElementById("demo")?.scrollIntoView());
  await page.waitForTimeout(900);

  // The reel plays itself, muted, in place.
  const reel = page.locator('button[aria-label*="open the DRK Control Layer"]').first();
  check(`[${vp.name}] demo scene player visible`, await reel.isVisible());
  const inline = page.locator("#demo video").first();
  check(`[${vp.name}] player muted`, await inline.evaluate((v) => v.muted));

  // Every clip must actually resolve, poster included.
  const missing = await page.evaluate(async () => {
    const keys = ["token-profile", "instances", "pools", "programs", "studio", "pl"];
    const bad = [];
    for (const k of keys) {
      for (const url of [`/demo/${k}.mp4`, `/demo/${k}.jpg`]) {
        const r = await fetch(url, { method: "HEAD" });
        if (r.status !== 200) bad.push(`${url} ${r.status}`);
      }
    }
    const intro = await fetch("/intro.mp4", { method: "HEAD" });
    if (intro.status !== 200) bad.push(`/intro.mp4 ${intro.status}`);
    return bad;
  });
  check(`[${vp.name}] every demo asset serves`, missing.length === 0, missing.join(" | "));

  if (await reel.isVisible()) {
    await reel.click();
    const vid = page.getByRole("dialog", { name: "DRK Control Layer" });
    await vid.waitFor({ state: "visible", timeout: 5000 });
    check(`[${vp.name}] demo theatre opens`, await vid.isVisible());

    const video = vid.locator("video");
    check(`[${vp.name}] video muted`, await video.evaluate((v) => v.muted));
    check(`[${vp.name}] video has controls`, await video.evaluate((v) => v.controls));
    check(
      `[${vp.name}] theatre lists all six clips`,
      (await vid.locator("ol > li > button").count()) === 6,
    );

    await page.keyboard.press("Escape");
    await vid.waitFor({ state: "hidden", timeout: 4000 });
    check(`[${vp.name}] ESC closes demo`, !(await vid.isVisible()));
  }

  check(`[${vp.name}] no console/page errors`, errs.length === 0, errs.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();

console.log(`\nPASS (${ok.length})`);
ok.forEach((o) => console.log("  ✓ " + o));
if (fails.length) {
  console.log(`\nFAIL (${fails.length})`);
  fails.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
console.log("\nAll modal interaction checks passed.");
