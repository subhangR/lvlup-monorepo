const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 5000 } });

  console.log("Navigating...");
  await page.goto("https://www.hellointerview.com/learn/system-design/problem-breakdowns/tinder", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // Target exactly MUI Accordion buttons
  console.log("Clicking MUI accordion buttons...");
  const accordionButtons = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Found ${accordionButtons.length} closed MUI accordion buttons`);

  for (let i = 0; i < accordionButtons.length; i++) {
    const btn = accordionButtons[i];
    try {
      const text = await btn.innerText();
      console.log(`  [${i}] Clicking: "${text.trim().substring(0, 60)}"`);

      // Scroll the button into view first
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Click it
      await btn.click({ force: true });
      await page.waitForTimeout(1000);

      // Verify it expanded
      const expanded = await btn.getAttribute("aria-expanded");
      console.log(`      -> aria-expanded: ${expanded}`);
    } catch (e) {
      console.log(`      -> ERROR: ${e.message?.substring(0, 80)}`);
    }
  }

  // Check if any are still closed
  const stillClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`\nStill closed: ${stillClosed.length}`);

  // If still closed, try clicking again
  if (stillClosed.length > 0) {
    console.log("Retrying closed accordions...");
    for (const btn of stillClosed) {
      try {
        await btn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await btn.click({ force: true });
        await page.waitForTimeout(800);
        const text = await btn.innerText();
        const expanded = await btn.getAttribute("aria-expanded");
        console.log(`  "${text.trim().substring(0, 50)}" -> ${expanded}`);
      } catch (e) {
        /* skip */
      }
    }
  }

  await page.waitForTimeout(2000);

  // Extract full text content
  console.log("\nExtracting full content...");
  const content = await page.evaluate(() => {
    // Get the main content area
    const main = document.querySelector("main") || document.querySelector("article");
    if (main) return main.innerText;
    return document.body.innerText;
  });

  const outDir = __dirname;
  fs.writeFileSync(path.join(outDir, "tinder-raw-content.txt"), content, "utf8");
  console.log(`Total chars: ${content.length}`);

  // Content verification
  const checks = {
    "Redis for Atomic": content.includes("Redis"),
    "Bloom Filter detail":
      content.includes("Bloom filter") ||
      content.includes("bloom filter") ||
      content.includes("Bloom Filter"),
    "DB Query Contains": content.includes("Contains Check") || content.includes("contains check"),
    Geospatial:
      content.includes("geospatial") || content.includes("Geospatial") || content.includes("geo"),
    "Indexed Database detail":
      content.includes("MongoDB") ||
      content.includes("Elasticsearch") ||
      content.includes("geospatial"),
    "Pre-computation detail": content.includes("pre-comput") || content.includes("Pre-comput"),
    "What is Expected": content.includes("Probing the Basics") || content.includes("Mid-level"),
    "Deep Dive 3 intro": content.includes("pretty poor experience"),
  };
  console.log("\nContent verification:");
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
  }

  // Take full page screenshot with expanded accordions
  await page.screenshot({
    path: path.join(outDir, "screenshots", "full-expanded.png"),
    fullPage: true,
  });
  console.log("\nFull page screenshot saved");

  // Take section screenshots
  const screenshotDir = path.join(outDir, "screenshots");
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Page height: ${pageHeight}px`);

  // Reset viewport for section screenshots
  await page.setViewportSize({ width: 1400, height: 900 });
  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(screenshotDir, `expanded-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  await browser.close();
  console.log("Done!");
})();
