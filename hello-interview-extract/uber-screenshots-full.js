const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = await context.newPage();

  // Set viewport before navigation
  await page.setViewportSize({ width: 1400, height: 900 });

  await page.goto("https://www.hellointerview.com/learn/system-design/problem-breakdowns/uber", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // Expand all MUI accordions
  const accordionButtons = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Found ${accordionButtons.length} closed accordions`);

  for (const btn of accordionButtons) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
    } catch (e) {
      /* skip */
    }
  }

  // Retry
  const stillClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  if (stillClosed.length > 0) {
    console.log(`Retrying ${stillClosed.length} closed accordions...`);
    for (const btn of stillClosed) {
      try {
        await btn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await btn.click({ force: true });
        await page.waitForTimeout(800);
      } catch (e) {
        /* skip */
      }
    }
  }
  await page.waitForTimeout(2000);

  // Verify all expanded
  const finalClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Remaining closed: ${finalClosed.length}`);

  const ssDir = path.join(__dirname, "questions", "uber", "screenshots");
  fs.mkdirSync(ssDir, { recursive: true });

  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Full-page screenshot
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  const fullPageSize = fs.statSync(path.join(ssDir, "full-page.png")).size;
  console.log(`Full-page screenshot: ${(fullPageSize / 1024).toFixed(0)}KB`);

  // Section screenshots
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Page height: ${pageHeight}px`);

  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(ssDir, `section-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  // Close just this tab, not the browser
  await page.close();
  await browser.close();
  console.log("Done!");
})();
