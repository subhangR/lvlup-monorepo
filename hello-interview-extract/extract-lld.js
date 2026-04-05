// Usage: node extract-lld.js <slug> <url>
// e.g.: node extract-lld.js connect-four https://www.hellointerview.com/learn/code-design/problem-breakdowns/connect-four
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SLUG = process.argv[2];
const URL = process.argv[3];

if (!SLUG || !URL) {
  console.error("Usage: node extract-lld.js <slug> <url>");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "questions", `lld-${SLUG}`);
const SS_DIR = path.join(OUT_DIR, "screenshots");

(async () => {
  console.log(`[${SLUG}] Connecting to Chrome via CDP...`);
  const browser = await chromium.connectOverCDP("http://localhost:9222", { timeout: 60000 });
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log(`[${SLUG}] Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(8000);

    // Expand all MUI accordions
    console.log(`[${SLUG}] Expanding accordions...`);
    let accordionButtons = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
    console.log(`[${SLUG}] Found ${accordionButtons.length} closed accordion buttons`);

    for (const btn of accordionButtons) {
      try {
        const text = await btn.innerText();
        console.log(`[${SLUG}]   Expanding: "${text.trim().substring(0, 60)}"`);
        await btn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await btn.click({ force: true });
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`[${SLUG}]   ERROR expanding: ${e.message?.substring(0, 80)}`);
      }
    }

    // Retry any still closed
    const stillClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
    if (stillClosed.length > 0) {
      console.log(`[${SLUG}] Retrying ${stillClosed.length} still-closed accordions...`);
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

    // Scroll through main container to trigger lazy rendering
    console.log(`[${SLUG}] Scrolling main container...`);
    const mainContainer = await page.$("main.flex-1");
    if (mainContainer) {
      const scrollHeight = await mainContainer.evaluate((el) => el.scrollHeight);
      for (let y = 0; y < scrollHeight; y += 400) {
        await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
        await page.waitForTimeout(150);
      }
      // Scroll back to top
      await mainContainer.evaluate((el) => el.scrollTo(0, 0));
      await page.waitForTimeout(1000);
    }

    // Extract text content
    console.log(`[${SLUG}] Extracting content...`);
    const content = await page.evaluate(() => {
      const main = document.querySelector("article") || document.querySelector("main");
      if (main) return main.innerText;
      return document.body.innerText;
    });

    // Save raw content
    fs.mkdirSync(SS_DIR, { recursive: true });
    const rawPath = path.join(OUT_DIR, `lld-${SLUG}-raw-content.txt`);
    fs.writeFileSync(rawPath, content, "utf8");
    console.log(`[${SLUG}] Saved ${content.length} chars to ${rawPath}`);

    // Take screenshots
    console.log(`[${SLUG}] Taking screenshots...`);
    await page.screenshot({ path: path.join(SS_DIR, "full-page.png"), fullPage: true });

    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 1400, height: 900 });
    let idx = 1;
    for (let y = 0; y < pageHeight; y += 800) {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(SS_DIR, `section-${String(idx).padStart(2, "0")}.png`),
      });
      idx++;
    }
    console.log(`[${SLUG}] Took ${idx - 1} section screenshots`);

    // Summary
    console.log(`\n=== [${SLUG}] EXTRACTION COMPLETE ===`);
    console.log(`Content: ${content.length} chars`);
    console.log(`Output: ${OUT_DIR}`);

    if (content.length < 5000) {
      console.error(`WARNING: Content seems too short (${content.length} chars < 5000)`);
      process.exit(2);
    }
  } catch (err) {
    console.error(`[${SLUG}] FATAL ERROR: ${err.message}`);
    process.exit(1);
  } finally {
    await page.close();
  }

  process.exit(0);
})();
