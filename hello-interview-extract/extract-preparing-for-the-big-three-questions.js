const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "preparing-for-the-big-three-questions";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/behavioral/course/preparing-for-the-big-three-questions";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = context.pages()[0] || (await context.newPage());

  // First navigate to the behavioral course landing page
  console.log("Navigating to behavioral course...");
  try {
    await page.goto(
      "https://www.hellointerview.com/learn/behavioral/course/why-the-behavioral-matters",
      {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      }
    );
  } catch (e) {
    console.log(`Navigation note: ${e.message?.substring(0, 100)}`);
  }
  await page.waitForTimeout(5000);
  console.log(`Current URL: ${page.url()}`);

  // Now click on "The Big Three Questions" in the sidebar
  console.log('Looking for "Big Three Questions" link in sidebar...');
  const bigThreeLink = await page.$('a:has-text("Big Three Questions")');
  if (bigThreeLink) {
    console.log("Found link, clicking...");
    await bigThreeLink.click();
    await page.waitForTimeout(5000);
    console.log(`Current URL after click: ${page.url()}`);
  } else {
    // Try alternative: look for any text containing "Big Three" and click it
    console.log("Trying alternative selectors...");
    const links = await page.$$("a");
    for (const link of links) {
      const text = await link.innerText().catch(() => "");
      if (text.toLowerCase().includes("big three")) {
        console.log(`Found link with text: "${text.trim()}"`);
        await link.click();
        await page.waitForTimeout(5000);
        console.log(`Current URL after click: ${page.url()}`);
        break;
      }
    }
  }

  // Also try direct navigation as fallback
  if (!page.url().includes("big-three") && !page.url().includes("preparing")) {
    console.log("Trying direct URL navigation...");
    try {
      await page.goto(QUESTION_URL, { waitUntil: "commit", timeout: 30000 });
    } catch (e) {
      console.log(`Direct nav note: ${e.message?.substring(0, 100)}`);
    }
    await page.waitForTimeout(5000);
    console.log(`Current URL: ${page.url()}`);
  }

  // Check for premium paywall
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  if (bodyText.includes("Get Premium") || bodyText.includes("Upgrade To Practice")) {
    console.log("WARNING: Premium paywall detected");
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

  // Content verification
  const firstLine = content.split("\n").find((l) => l.trim().length > 10) || "";
  console.log(`First meaningful line: "${firstLine.trim().substring(0, 80)}"`);

  const checks = {
    "Has substantial content (>500 chars)": content.length > 500,
    "Big Three / Three Questions topic":
      content.toLowerCase().includes("big three") ||
      content.toLowerCase().includes("three questions"),
    "Tell me about yourself": content.toLowerCase().includes("tell me about yourself"),
    "Why this company/role":
      content.toLowerCase().includes("why") &&
      (content.toLowerCase().includes("company") || content.toLowerCase().includes("role")),
    "Greatest weakness or strength":
      content.toLowerCase().includes("weakness") ||
      content.toLowerCase().includes("strength") ||
      content.toLowerCase().includes("greatest"),
    "Content is NOT from why-the-behavioral-matters":
      !content.startsWith("Limited Time Offer") || content.includes("The Big Three"),
  };
  console.log("\nContent verification:");
  let allPassed = true;
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
    if (!val) allPassed = false;
  }

  // Take screenshots
  console.log("\nTaking screenshots...");
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

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

  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Question: ${QUESTION_SLUG}`);
  console.log(`Content: ${content.length} chars`);
  console.log(`Screenshots: ${idx - 1} sections + 1 full-page`);
  console.log(`All checks passed: ${allPassed}`);
  console.log(`Output: ${outDir}`);

  await browser.close();
  console.log("Done!");
})();
