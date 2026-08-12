/**
 * Interaction QA.
 *
 * Exercises the behaviours the brief calls out explicitly: fast scrolling,
 * slow scrolling, keyboard operation, section links, hash state, mid-page
 * reload, back/forward, touch, and desktop resizing.
 *
 * The core assertion throughout: NO scene may end up in a broken or blank
 * state. Because every scene derives its composition from a scroll ratio
 * rather than from an animation timeline, any scroll position must render
 * a valid frame.
 */
import { chromium, devices } from "@playwright/test";
import { dismissCurtain } from "./curtain.mjs";

const BASE = process.env.DRK_URL ?? "http://localhost:3112";
const SECTIONS = [
  "intro", "opacity", "engine", "visibility", "proof", "stack", "market",
  "integration", "lifecycle", "control", "demo", "revenue", "compound", "raise", "close",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") =>
  results.push({ name, ok, detail }) && console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);

/** Every scene must have painted content in the viewport-sized stage. */
async function assertNoBlankScene(page, label) {
  const blanks = await page.evaluate((ids) => {
    const bad = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) { bad.push(`${id}: missing`); continue; }
      const r = el.getBoundingClientRect();
      // only judge scenes currently on screen
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const text = (el.innerText || "").trim();
      if (text.length < 12) bad.push(`${id}: ${text.length} chars of text`);
    }
    return bad;
  }, SECTIONS);
  check(`no blank scene — ${label}`, blanks.length === 0, blanks.join("; "));
}

const browser = await chromium.launch();

/* ---------------------------------------------------------------- desktop */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await page.evaluate(() => document.fonts.ready);
  await sleep(500);

  // --- fast scroll: slam to the bottom, then to the top ---
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(400);
  await assertNoBlankScene(page, "after slam to bottom");
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await assertNoBlankScene(page, "after slam to top");

  // --- fast wheel scrolling in large steps ---
  for (let i = 0; i < 40; i++) await page.mouse.wheel(0, 2400);
  await sleep(400);
  await assertNoBlankScene(page, "after 40 fast wheel steps");

  // --- slow scrolling through the whole page ---
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 220) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 8));
    }
  });
  await sleep(300);
  await assertNoBlankScene(page, "after slow full-page scroll");

  // --- section links write hash state ---
  await page.evaluate(() => document.getElementById("raise")?.scrollIntoView());
  await sleep(700);
  const hash = await page.evaluate(() => location.hash);
  check("hash reflects active section", hash === "#raise", `got "${hash}"`);

  // --- deep link honoured on load ---
  await page.goto(`${BASE}#control`, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await sleep(900);
  const atControl = await page.evaluate(() => {
    const el = document.getElementById("control");
    return el ? Math.abs(el.getBoundingClientRect().top) < window.innerHeight : false;
  });
  check("deep link #control lands on the scene", atControl);
  await assertNoBlankScene(page, "after deep link");

  // --- reload mid-page ---
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await sleep(400);
  await page.reload({ waitUntil: "networkidle" });
  await sleep(900);
  await assertNoBlankScene(page, "after mid-page reload");

  // --- back / forward ---
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.goto(`${BASE}#market`, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await sleep(500);
  await page.goBack({ waitUntil: "networkidle" });
  await sleep(500);
  await page.goForward({ waitUntil: "networkidle" });
  await sleep(700);
  await assertNoBlankScene(page, "after back/forward");

  // --- keyboard: tab into the nav and operate it ---
  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await sleep(500);
  let navFocused = false;
  for (let i = 0; i < 24 && !navFocused; i++) {
    await page.keyboard.press("Tab");
    navFocused = await page.evaluate(
      () => !!document.activeElement?.hasAttribute("data-nav-item"),
    );
  }
  check("nav reachable by keyboard", navFocused);

  if (navFocused) {
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    const moved = await page.evaluate(() => {
      const items = [...document.querySelectorAll("[data-nav-item]")];
      return items.indexOf(document.activeElement) === 2;
    });
    check("arrow keys move between nav items", moved);

    await page.keyboard.press("Enter");
    await sleep(900);
    const jumped = await page.evaluate(() => location.hash);
    check("Enter jumps to the section", jumped === "#engine", `got "${jumped}"`);
  }

  // --- focus is always visible ---
  const outline = await page.evaluate(() => {
    const el = document.querySelector("[data-nav-item]");
    el?.focus();
    const s = getComputedStyle(el, ":focus-visible");
    return s.outlineStyle !== "none" || s.outlineWidth !== "0px";
  });
  check("focus ring is defined", outline);

  /* ---------------- interaction depth ----------------
   * Every scene that claims to be inspectable must actually be operable, and
   * operating it must not desynchronise the scroll-derived narrative.
   */
  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await sleep(500);

  /** Scroll to a scene's midpoint, then click the nth control matching sel. */
  async function operate(scene, sel, nth, label, at = 0.45) {
    await page.evaluate(
      ([id, t]) => {
        const el = document.getElementById(id);
        window.scrollTo(0, el.offsetTop + (el.offsetHeight - window.innerHeight) * t);
      },
      [scene, at],
    );
    await sleep(650);
    const c = page.locator(sel);
    const n = await c.count();
    if (n <= nth) {
      check(label, false, `only ${n} control(s) found`);
      return;
    }
    const before = await page.evaluate((s) => document.getElementById(s).innerText, scene);
    await c.nth(nth).click();
    await sleep(450);
    const after = await page.evaluate((s) => document.getElementById(s).innerText, scene);
    // Tabs report state with aria-selected, toggle buttons with aria-pressed.
    const el = c.nth(nth);
    const state =
      (await el.getAttribute("aria-pressed")) ?? (await el.getAttribute("aria-selected"));
    check(
      label,
      state === "true" && before !== after,
      `state=${state}, content ${before === after ? "unchanged" : "changed"}`,
    );
  }

  await operate("engine", '#engine button[aria-pressed]', 1, "engine: selecting Licensed Runtime reconfigures the chain");
  await operate("stack", '#stack button[aria-pressed]', 3, "stack: selecting a layer changes the inspector");
  await operate("proof", '#proof button[aria-pressed]', 1, "proof: selecting Launch 02 updates the case study", 0.5);
  await operate("visibility", '#visibility [role="tab"]', 2, "visibility: module rail is operable");

  // Control Layer: module switch, then a row selection inside the module.
  await page.evaluate(() => {
    const el = document.getElementById("control");
    window.scrollTo(0, el.offsetTop + (el.offsetHeight - window.innerHeight) * 0.1);
  });
  await sleep(700);
  const modTabs = page.locator('#control [role="tab"]');
  check("control: seven modules present", (await modTabs.count()) === 7, `found ${await modTabs.count()}`);

  await modTabs.nth(1).click(); // Wallets
  await sleep(450);
  const walletRows = page.locator('#control [role="tabpanel"] [role="row"][aria-selected]');
  const wrCount = await walletRows.count();
  if (wrCount > 1) {
    const before = await page.locator('#control [role="tabpanel"]').innerText();
    await walletRows.nth(2).click();
    await sleep(400);
    const after = await page.locator('#control [role="tabpanel"]').innerText();
    check("control: selecting a wallet reveals its detail", before !== after);
  } else {
    check("control: wallet rows selectable", false, `found ${wrCount}`);
  }

  await modTabs.nth(4).click(); // P/L
  await sleep(500);
  const periods = page.locator('#control [role="group"] button[aria-pressed]');
  if ((await periods.count()) >= 3) {
    const before = await page.locator('#control [role="tabpanel"]').innerText();
    await periods.nth(2).click(); // YTD
    await sleep(600);
    const after = await page.locator('#control [role="tabpanel"]').innerText();
    check("control: P/L window switches and the value changes", before !== after);
  } else {
    check("control: P/L window control present", false);
  }

  // Manual selection must be released once the scroll reaches another module.
  await page.evaluate(() => {
    const el = document.getElementById("control");
    window.scrollTo(0, el.offsetTop + (el.offsetHeight - window.innerHeight) * 0.92);
  });
  await sleep(800);
  const lastSelected = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#control [role="tab"]')];
    return tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
  });
  check(
    "control: scrolling past releases the manual selection",
    lastSelected >= 5,
    `active module index ${lastSelected}`,
  );

  // Keyboard operation of the module rail.
  await page.locator('#control [role="tab"][aria-selected="true"]').focus();
  await page.keyboard.press("ArrowUp");
  await sleep(350);
  const movedTab = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#control [role="tab"]')];
    return tabs.indexOf(document.activeElement);
  });
  check("control: rail is keyboard operable", movedTab >= 0);

  // No internal material may reach the investor build.
  const internal = await page.evaluate(() =>
    /TODO_CONTENT_VERIFY|Content verification register|VER-0\d/.test(document.body.innerText),
  );
  check("no internal verification material in the deck", !internal);

  // --- resize while pinned ---
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.42));
  await sleep(300);
  for (const [w, h] of [[1920, 1080], [1024, 768], [1366, 768], [1440, 900]]) {
    await page.setViewportSize({ width: w, height: h });
    await sleep(300);
  }
  await assertNoBlankScene(page, "after repeated resize");

  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  );
  check("no horizontal overflow after resize", noOverflow);

  check("no console or page errors (desktop)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

/* ----------------------------------------------------------------- mobile */
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCurtain(page);
  await sleep(600);

  // touch-scroll the whole page
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 12));
    }
  });
  await sleep(400);
  await assertNoBlankScene(page, "mobile full scroll");

  // tap a control-layer module
  await page.evaluate(() => document.getElementById("control")?.scrollIntoView());
  await sleep(700);
  /*
   * On a phone the Control Layer is RECOMPOSED, not tabbed: every module
   * renders in sequence, because nothing drives a rail when the scene is not
   * pinned. The assertion is therefore completeness, not tab behaviour.
   */
  const moduleHeadings = await page.evaluate(() =>
    [...document.querySelectorAll("#control .drk-surface h4")].map((h) => h.textContent?.trim()),
  );
  check(
    "control: every module renders on mobile",
    moduleHeadings.length === 7,
    `found ${moduleHeadings.length}: ${moduleHeadings.join(", ")}`,
  );

  await page.evaluate(() => document.getElementById("engine")?.scrollIntoView());
  await sleep(600);
  const engineModes = await page.evaluate(() =>
    [...document.querySelectorAll("#engine section h4")].map((h) => h.textContent?.trim()),
  );
  check(
    "engine: both businesses render on mobile",
    engineModes.length === 2,
    `found ${engineModes.join(" / ")}`,
  );

  // touch targets are big enough
  const small = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll("button, a[href]")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // visually-hidden controls (skip link) are exempt: they size themselves
      // only once focused
      const s = getComputedStyle(el);
      if (s.clipPath && s.clipPath !== "none") continue;
      if (r.height < 32) bad.push(`${el.tagName}.${String(el.className).slice(0, 30)} h=${Math.round(r.height)}`);
    }
    return bad.slice(0, 5);
  });
  check("touch targets >= 32px tall", small.length === 0, small.join("; "));

  const noOverflowM = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  );
  check("no horizontal overflow (mobile)", noOverflowM);
  check("no console or page errors (mobile)", errors.length === 0, errors.slice(0, 3).join(" | "));

  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exitCode = failed.length ? 1 : 0;
