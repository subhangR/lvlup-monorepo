const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "special-interview-types";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/behavioral/course/special-interview-types";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222", { timeout: 60000 });
  const context = browser.contexts()[0];
  const page = context.pages()[0] || (await context.newPage());

  console.log(`Navigating to ${QUESTION_URL}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // Check what content loaded by looking at the heading
  const headingText = await page.evaluate(() => {
    // Try to find the main heading in the content area
    const h1 = document.querySelector("h1");
    const h2 = document.querySelector("h2");
    return { h1: h1?.innerText || "", h2: h2?.innerText || "" };
  });
  console.log(`Page headings - H1: "${headingText.h1}", H2: "${headingText.h2}"`);

  // Check current URL
  console.log(`Current URL: ${page.url()}`);

  // If the URL doesn't match, we need to click the sidebar link
  if (!page.url().includes("special-interview-types")) {
    console.log("URL does not match, trying to click sidebar link...");

    // Look for the sidebar link
    const sidebarLink = await page.$('a[href*="special-interview-types"]');
    if (sidebarLink) {
      console.log("Found sidebar link, clicking...");
      await sidebarLink.click();
      await page.waitForTimeout(5000);
      console.log(`After click URL: ${page.url()}`);
    } else {
      console.log("No sidebar link found, trying direct navigation again...");
      await page.goto(QUESTION_URL, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(5000);
    }
  }

  // Verify we're on the right page
  const currentUrl = page.url();
  console.log(`Final URL: ${currentUrl}`);

  // Check the page title/heading after navigation
  const pageTitle = await page.evaluate(() => {
    // Look for the main content heading
    const mainContent = document.querySelector("article") || document.querySelector("main");
    if (mainContent) {
      const firstH1 = mainContent.querySelector("h1");
      const firstH2 = mainContent.querySelector("h2");
      return {
        h1: firstH1?.innerText || "",
        h2: firstH2?.innerText || "",
        firstText: mainContent.innerText.substring(0, 500),
      };
    }
    return { h1: "", h2: "", firstText: "" };
  });
  console.log(`Content heading H1: "${pageTitle.h1}"`);
  console.log(`Content heading H2: "${pageTitle.h2}"`);
  console.log(`First 300 chars: ${pageTitle.firstText.substring(0, 300)}`);

  // Check if logged in (premium content)
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  const hasPremiumAccess =
    !bodyText.includes("Get Premium") && !bodyText.includes("Upgrade To Practice");
  console.log(`Premium access: ${hasPremiumAccess}`);

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

  // Also expand <details> elements
  const detailsElements = await page.$$("details:not([open])");
  if (detailsElements.length > 0) {
    console.log(`Found ${detailsElements.length} closed <details> elements, expanding...`);
    for (const el of detailsElements) {
      try {
        await el.evaluate((node) => node.setAttribute("open", ""));
        await page.waitForTimeout(300);
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

  // Content verification
  const checks = {
    "Has substantial content (>500 chars)": content.length > 500,
    "Special interview types mentioned":
      content.toLowerCase().includes("special") || content.toLowerCase().includes("interview type"),
    "Has practical content (>1000 chars)": content.length > 1000,
    "Not showing wrong section (Select)":
      !content.startsWith("Select: Choosing Responses") || content.includes("Special Interview"),
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

  await browser.close();
  console.log("Done!");
})();
