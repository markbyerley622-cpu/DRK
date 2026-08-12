/**
 * The deck opens on a two-second title card that covers the viewport.
 *
 * Every harness has to get past it before it can drive or photograph anything,
 * and none of them should sit through it: a keypress dismisses the card, and
 * this waits for it to detach rather than sleeping a guessed interval.
 */
export async function dismissCurtain(page) {
  const curtain = page.locator("[data-drk-curtain]");
  if (!(await curtain.count())) return;
  await page.keyboard.press("Escape");
  await curtain.waitFor({ state: "detached", timeout: 6000 }).catch(() => {});
}
