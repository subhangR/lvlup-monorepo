const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "whatsapp";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/system-design/problem-breakdowns/whatsapp";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(6000);

  // Expand all MUI accordions
  console.log("Expanding accordion sections...");
  let expandPass = 1;
  while (expandPass <= 3) {
    const closed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
    if (closed.length === 0) {
      console.log(`Pass ${expandPass}: All expanded!`);
      break;
    }
    console.log(`Pass ${expandPass}: ${closed.length} closed`);
    for (let i = 0; i < closed.length; i++) {
      try {
        const fresh = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
        if (fresh.length === 0) break;
        await fresh[0].scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await fresh[0].click({ force: true });
        await page.waitForTimeout(1200);
      } catch (e) {
        await page.waitForTimeout(500);
      }
    }
    expandPass++;
  }
  await page.waitForTimeout(2000);

  const outDir = path.join(__dirname, "questions", QUESTION_SLUG);
  const ssDir = path.join(outDir, "screenshots");
  fs.mkdirSync(ssDir, { recursive: true });

  await page.setViewportSize({ width: 1400, height: 900 });
  await page.waitForTimeout(1000);

  // Use querySelectorAll('main')[1] to get the correct scrollable main
  const mainHeight = await page.evaluate(() => {
    const mains = document.querySelectorAll("main");
    const m = mains[1] || mains[0];
    if (m) {
      m.scrollTop = 0;
      return m.scrollHeight;
    }
    return 0;
  });
  console.log(`Main content scroll height: ${mainHeight}px`);
  await page.waitForTimeout(500);

  // Full-page screenshot from top
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

  // Verify scroll works
  const testScroll = await page.evaluate(() => {
    const m = document.querySelectorAll("main")[1];
    if (!m) return { found: false };
    m.scrollTop = 800;
    return { found: true, scrollTop: m.scrollTop, scrollHeight: m.scrollHeight };
  });
  console.log("Scroll test:", JSON.stringify(testScroll));
  await page.waitForTimeout(300);

  // Reset to top
  await page.evaluate(() => {
    const m = document.querySelectorAll("main")[1];
    if (m) m.scrollTop = 0;
  });
  await page.waitForTimeout(300);

  // Section screenshots
  let idx = 1;
  for (let y = 0; y < mainHeight; y += 800) {
    await page.evaluate((scrollY) => {
      const m = document.querySelectorAll("main")[1];
      if (m) m.scrollTop = scrollY;
    }, y);
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ssDir, `section-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  // Clean old
  for (let i = idx; i <= 55; i++) {
    const f = path.join(ssDir, `section-${String(i).padStart(2, "0")}.png`);
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }

  await page.close();
  await browser.close();
  console.log("Done!");
})();
