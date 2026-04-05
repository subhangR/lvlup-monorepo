const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "whatsapp";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/system-design/problem-breakdowns/whatsapp";

(async () => {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 5000 } });

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // Expand all MUI accordions
  console.log("Expanding accordion sections...");
  const accordionButtons = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Found ${accordionButtons.length} closed accordion buttons`);

  for (const btn of accordionButtons) {
    try {
      const text = await btn.innerText();
      console.log(`  Expanding: "${text.trim().substring(0, 60)}"`);
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
      const expanded = await btn.getAttribute("aria-expanded");
      console.log(`    -> aria-expanded: ${expanded}`);
    } catch (e) {
      console.log(`    -> ERROR: ${e.message?.substring(0, 80)}`);
    }
  }

  // Retry any still closed
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

  // Extract text content
  console.log("Extracting content...");
  const content = await page.evaluate(() => {
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
    "Understand the Problem": content.includes("Understand the Problem"),
    "Functional Requirements": content.includes("Functional Requirements"),
    "Non-Functional Requirements": content.includes("Non-Functional"),
    "High-Level Design": content.includes("High-Level Design"),
    "Deep Dives": content.includes("Deep Dive") || content.includes("Potential Deep"),
    "What is Expected": content.includes("Expected") || content.includes("Mid-level"),
    "Accordion content (Approach)": content.includes("Approach"),
    "Accordion content (Challenges)":
      content.includes("Challenges") || content.includes("Challenge"),
  };
  console.log("\nContent verification:");
  let allPassed = true;
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "PASS" : "FAIL"} ${key}`);
    if (!val) allPassed = false;
  }

  // Take screenshots - resize viewport first for proper section captures
  console.log("\nTaking screenshots...");
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.waitForTimeout(1000);

  // Full-page screenshot
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

  // Section screenshots using scroll + viewport capture
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(ssDir, `section-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Question: ${QUESTION_SLUG}`);
  console.log(`Content: ${content.length} chars`);
  console.log(`Screenshots: ${idx - 1} sections + 1 full-page`);
  console.log(`All checks passed: ${allPassed}`);
  console.log(`Output: ${outDir}`);

  await browser.close();
  console.log("Done!");
})();
