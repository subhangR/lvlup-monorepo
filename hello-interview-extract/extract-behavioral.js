// extract-behavioral.js — Extract behavioral interview content from Hello Interview
// Usage: node extract-behavioral.js <slug> <url>
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SLUG = process.argv[2];
const URL = process.argv[3];

if (!SLUG || !URL) {
  console.error("Usage: node extract-behavioral.js <slug> <url>");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "questions", `behavioral-${SLUG}`);
const SS_DIR = path.join(OUT_DIR, "screenshots");
const RAW_FILE = path.join(OUT_DIR, `behavioral-${SLUG}-raw-content.txt`);

(async () => {
  console.log(`[${SLUG}] Connecting to Chrome via CDP...`);
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    // Navigate
    console.log(`[${SLUG}] Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(8000);

    // Scroll through main.flex-1 container to trigger lazy rendering
    console.log(`[${SLUG}] Scrolling main container...`);
    const mainContainer = await page.$("main.flex-1");
    if (mainContainer) {
      const scrollHeight = await mainContainer.evaluate((el) => el.scrollHeight);
      console.log(`[${SLUG}] Scroll height: ${scrollHeight}`);
      for (let y = 0; y < scrollHeight; y += 400) {
        await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
        await page.waitForTimeout(150);
      }
      // Scroll back to top
      await mainContainer.evaluate((el) => el.scrollTo(0, 0));
      await page.waitForTimeout(1000);
    }

    // Expand all MUI accordions (if any exist on behavioral pages)
    const accordionButtons = await page.$$(
      'button.MuiAccordionSummary-root[aria-expanded="false"]'
    );
    if (accordionButtons.length > 0) {
      console.log(`[${SLUG}] Expanding ${accordionButtons.length} accordions...`);
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
      await page.waitForTimeout(2000);
    }

    // Extract text content from the main content area (second child of main.flex-1)
    console.log(`[${SLUG}] Extracting content...`);
    const content = await page.evaluate(() => {
      // Behavioral pages: content is in main.flex-1 > div.flex.flex-col (second child)
      const mainFlex = document.querySelector("main.flex-1");
      if (mainFlex && mainFlex.children.length >= 2) {
        return mainFlex.children[1].innerText;
      }
      // Fallback: try main.flex-1 itself
      if (mainFlex) return mainFlex.innerText;
      // Last resort
      const main = document.querySelector("article") || document.querySelector("main");
      if (main) return main.innerText;
      return document.body.innerText;
    });

    // Verify we got actual content, not a 404
    if (content.includes("Page Not Found") || content.length < 500) {
      console.error(
        `[${SLUG}] ERROR: Page returned 404 or too little content (${content.length} chars)`
      );
      console.error(`[${SLUG}] Content preview: ${content.substring(0, 200)}`);
      await page.close();
      process.exit(1);
    }

    // Setup output directories
    fs.mkdirSync(SS_DIR, { recursive: true });

    // Save raw content
    fs.writeFileSync(RAW_FILE, content, "utf8");
    console.log(`[${SLUG}] Saved ${content.length} chars of raw content`);

    // Take screenshots
    console.log(`[${SLUG}] Taking screenshots...`);
    await page.screenshot({ path: path.join(SS_DIR, "full-page.png"), fullPage: true });

    // Section screenshots by scrolling main.flex-1
    if (mainContainer) {
      const scrollHeight = await mainContainer.evaluate((el) => el.scrollHeight);
      await page.setViewportSize({ width: 1400, height: 900 });
      let idx = 1;
      for (let y = 0; y < scrollHeight; y += 800) {
        await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
        await page.waitForTimeout(200);
        await page.screenshot({
          path: path.join(SS_DIR, `section-${String(idx).padStart(2, "0")}.png`),
        });
        idx++;
      }
      console.log(`[${SLUG}] Took ${idx - 1} section screenshots`);
    }

    // Summary
    console.log(`\n=== [${SLUG}] EXTRACTION COMPLETE ===`);
    console.log(`Content: ${content.length} chars`);
    console.log(`Output: ${OUT_DIR}`);

    await page.close();
  } catch (err) {
    console.error(`[${SLUG}] FATAL ERROR: ${err.message}`);
    try {
      await page.close();
    } catch (e) {
      /* ignore */
    }
    process.exit(1);
  }
})();
