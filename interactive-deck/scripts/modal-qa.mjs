/** Interaction QA for the two new overlays: contact + demo player. */
import { chromium } from "@playwright/test";

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

  /* ---------------- DEMO PLAYER ---------------- */
  await page.evaluate(() => document.getElementById("control")?.scrollIntoView());
  await page.waitForTimeout(900);
  const watch = page.locator("button", { hasText: "WATCH THE SYSTEM" }).first();
  check(`[${vp.name}] demo trigger visible`, await watch.isVisible());

  if (await watch.isVisible()) {
    await watch.click();
    const vid = page.getByRole("dialog", { name: "DRK Control Layer" });
    await vid.waitFor({ state: "visible", timeout: 5000 });
    check(`[${vp.name}] demo dialog opens`, await vid.isVisible());

    const video = vid.locator("video");
    check(`[${vp.name}] video muted`, await video.evaluate((v) => v.muted));
    check(`[${vp.name}] video has controls`, await video.evaluate((v) => v.controls));
    // the source must actually resolve
    const status = await page.evaluate(async () =>
      (await fetch("/demo.mp4", { method: "HEAD" })).status,
    );
    check(`[${vp.name}] /demo.mp4 serves`, status === 200, `HTTP ${status}`);

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
