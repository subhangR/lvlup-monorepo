const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "deliver-telling-a-good-story";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/behavioral/course/deliver-telling-a-good-story";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222", { timeout: 120000 });
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(6000);

  // Check for premium paywall
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  if (bodyText.includes("Get Premium") || bodyText.includes("Upgrade To Practice")) {
    console.log("WARNING: Premium paywall detected - session may not be logged in");
  } else {
    console.log("No paywall detected - premium access confirmed");
  }

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

  // Also try expanding any collapsible sections / "Read more" buttons
  const readMoreButtons = await page.$$(
    'button:has-text("Read more"), button:has-text("Show more"), button:has-text("Expand")'
  );
  if (readMoreButtons.length > 0) {
    console.log(`Found ${readMoreButtons.length} "Read more" buttons, clicking...`);
    for (const btn of readMoreButtons) {
      try {
        await btn.scrollIntoViewIfNeeded();
        await btn.click({ force: true });
        await page.waitForTimeout(500);
      } catch (e) {
        /* skip */
      }
    }
  }

  // Extract text content
  console.log("Extracting content...");
  const content = await page.evaluate(() => {
    const main = document.querySelector("article") || document.querySelector("main");
    if (main) return main.innerText;
    return document.body.innerText;
  });

  // Setup output directories
  const outDir = path.join(__dirname, "questions", "behavioral", QUESTION_SLUG);
  const ssDir = path.join(outDir, "screenshots");
  fs.mkdirSync(ssDir, { recursive: true });

  // Save raw content
  fs.writeFileSync(path.join(outDir, `${QUESTION_SLUG}-raw-content.txt`), content, "utf8");
  console.log(`Saved ${content.length} chars of raw content`);

  // Content verification for behavioral pages
  const checks = {
    "Has substantial content (>500 chars)": content.length > 500,
    "Story/Storytelling mention":
      content.toLowerCase().includes("story") || content.toLowerCase().includes("storytelling"),
    "Deliver mention": content.toLowerCase().includes("deliver"),
    "STAR or framework":
      content.toLowerCase().includes("star") ||
      content.toLowerCase().includes("framework") ||
      content.toLowerCase().includes("structure"),
    "Example or practice":
      content.toLowerCase().includes("example") || content.toLowerCase().includes("practice"),
  };
  console.log("\nContent verification:");
  let allPassed = true;
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
    if (!val) allPassed = false;
  }

  // Take screenshots
  console.log("\nTaking screenshots...");

  // Full-page screenshot
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

  // Section screenshots
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: 1400, height: 900 });
  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
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
