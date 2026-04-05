const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "bitly";
const QUESTION_URL = "https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];

  // Use a NEW page to avoid navigation conflicts
  const page = await context.newPage();

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(6000);

  // Verify we're on the right page
  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);

  // Expand all MUI accordions - re-query each time to avoid stale references
  console.log("Expanding accordion sections...");
  let expandPass = 1;
  while (expandPass <= 3) {
    const closed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
    if (closed.length === 0) {
      console.log(`Pass ${expandPass}: All accordions expanded!`);
      break;
    }
    console.log(`Pass ${expandPass}: Found ${closed.length} closed accordions`);

    for (let i = 0; i < closed.length; i++) {
      try {
        // Re-query to get fresh reference
        const freshButtons = await page.$$(
          'button.MuiAccordionSummary-root[aria-expanded="false"]'
        );
        if (freshButtons.length === 0) break;
        const btn = freshButtons[0]; // Always click the first closed one

        const text = await btn.innerText().catch(() => "(unknown)");
        console.log(`  Expanding: "${text.trim().substring(0, 60)}"`);
        await btn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await btn.click({ force: true });
        await page.waitForTimeout(1200);
      } catch (e) {
        console.log(`    -> ERROR: ${e.message?.substring(0, 80)}`);
        await page.waitForTimeout(500);
      }
    }
    expandPass++;
  }

  // Final check
  const finalClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  const finalOpen = await page.$$('button.MuiAccordionSummary-root[aria-expanded="true"]');
  console.log(`\nFinal state: ${finalOpen.length} expanded, ${finalClosed.length} still closed`);

  await page.waitForTimeout(2000);

  // Extract text content - target main content area
  console.log("Extracting content...");
  const content = await page.evaluate(() => {
    // Try to find the main content container
    const main = document.querySelector("article") || document.querySelector("main");
    if (main) return main.innerText;
    return document.body.innerText;
  });

  // Setup output directories
  const outDir = path.join(__dirname, "questions", QUESTION_SLUG);
  const ssDir = path.join(outDir, "screenshots");
  fs.mkdirSync(ssDir, { recursive: true });

  // Save raw content
  fs.writeFileSync(path.join(outDir, `${QUESTION_SLUG}-raw-content.txt`), content, "utf8");
  console.log(`Saved ${content.length} chars of raw content`);

  // Content verification
  const checks = {
    "Functional Requirements": content.includes("Functional Requirements"),
    "Non-Functional Requirements": content.includes("Non-Functional"),
    "High-Level Design": content.includes("High-Level Design"),
    "Deep Dives": content.includes("Deep Dive") || content.includes("Potential Deep"),
    "What is Expected": content.includes("Expected") || content.includes("Mid-level"),
    "Core Entities": content.includes("Core Entities") || content.includes("Defining the Core"),
    "API section": content.includes("The API") || content.includes("API"),
    "Accordion content (Approach)": content.includes("Approach"),
    "URL shortening context":
      content.includes("shorten") || content.includes("URL") || content.includes("redirect"),
  };
  console.log("\nContent verification:");
  let allPassed = true;
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
    if (!val) allPassed = false;
  }

  // Take screenshots
  console.log("\nTaking screenshots...");

  // Scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Full-page screenshot
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

  // Section screenshots
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.waitForTimeout(500);
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

  // Summary
  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Question: ${QUESTION_SLUG}`);
  console.log(`Content: ${content.length} chars`);
  console.log(`Screenshots: ${idx - 1} sections + 1 full-page`);
  console.log(`All checks passed: ${allPassed}`);
  console.log(`Output: ${outDir}`);

  // Close only the page we created, not the browser
  await page.close();
  await browser.close();
  console.log("Done!");
})();
