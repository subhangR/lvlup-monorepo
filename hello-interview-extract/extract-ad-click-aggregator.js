const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "ad-click-aggregator";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/system-design/problem-breakdowns/ad-click-aggregator";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];

  // Create a NEW page
  const page = await context.newPage();

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log("DOM loaded, waiting 8s for SPA render...");
  await page.waitForTimeout(8000);

  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);

  // Scroll through the main.flex-1 scroll container to trigger lazy rendering
  console.log("Scrolling through main.flex-1 to trigger lazy content...");
  const scrollResult = await page.evaluate(async () => {
    const container = document.querySelector("main.flex-1");
    if (!container) return { found: false, scrollHeight: 0 };

    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const increment = 400;
    const delay = 150;

    for (let y = 0; y < scrollHeight; y += increment) {
      container.scrollTop = y;
      await new Promise((r) => setTimeout(r, delay));
    }
    // Scroll to bottom
    container.scrollTop = scrollHeight;
    await new Promise((r) => setTimeout(r, delay));

    // Scroll back to top
    container.scrollTop = 0;

    return { found: true, scrollHeight, clientHeight, steps: Math.ceil(scrollHeight / increment) };
  });
  console.log(`Scroll result:`, JSON.stringify(scrollResult));
  await page.waitForTimeout(2000);

  // Expand ALL MUI accordions using evaluate to avoid navigation issues
  console.log("Expanding accordion sections...");

  const expandResult = await page.evaluate(async () => {
    const results = [];
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    // First pass
    let btns = document.querySelectorAll('button.MuiAccordionSummary-root[aria-expanded="false"]');
    results.push(`Found ${btns.length} closed accordion buttons`);

    for (const btn of btns) {
      try {
        btn.scrollIntoView({ behavior: "instant", block: "center" });
        await delay(300);
        const text = (btn.innerText || "").trim().substring(0, 60);
        results.push(`Expanding: "${text}"`);
        btn.click();
        await delay(1000);
      } catch (e) {
        results.push(`ERROR: ${e.message?.substring(0, 80)}`);
      }
    }

    // Retry pass
    await delay(500);
    btns = document.querySelectorAll('button.MuiAccordionSummary-root[aria-expanded="false"]');
    if (btns.length > 0) {
      results.push(`Retrying ${btns.length} still-closed accordions...`);
      for (const btn of btns) {
        try {
          btn.scrollIntoView({ behavior: "instant", block: "center" });
          await delay(300);
          btn.click();
          await delay(1000);
        } catch (e) {
          results.push(`Retry ERROR: ${e.message?.substring(0, 80)}`);
        }
      }
    }

    const finalClosed = document.querySelectorAll(
      'button.MuiAccordionSummary-root[aria-expanded="false"]'
    ).length;
    results.push(`Accordions still closed after retry: ${finalClosed}`);
    return results;
  });

  for (const line of expandResult) {
    console.log(`  ${line}`);
  }
  await page.waitForTimeout(2000);

  // Extract text content
  console.log("Extracting content...");
  const content = await page.evaluate(() => {
    const el = document.querySelector("article") || document.querySelector("main");
    if (el) return el.innerText;
    return document.body.innerText;
  });

  // Setup output directories
  const outDir = path.join(__dirname, "questions", QUESTION_SLUG);
  const ssDir = path.join(outDir, "screenshots");
  fs.mkdirSync(ssDir, { recursive: true });

  // Save raw content
  const outFile = path.join(outDir, `${QUESTION_SLUG}-raw-content.txt`);
  fs.writeFileSync(outFile, content, "utf8");
  console.log(`Saved ${content.length} chars of raw content to ${outFile}`);

  // Content verification
  const checks = {
    "Functional Requirements": content.includes("Functional Requirements"),
    "Non-Functional Requirements": content.includes("Non-Functional"),
    "High-Level Design": content.includes("High-Level Design"),
    "Deep Dives": content.includes("Deep Dive") || content.includes("Potential Deep"),
  };
  console.log("\nContent verification:");
  let allPassed = true;
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "PASS" : "FAIL"} ${key}`);
    if (!val) allPassed = false;
  }

  // Take screenshots
  console.log("\nTaking screenshots...");
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.waitForTimeout(500);

  // Full-page screenshot
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

  // Section screenshots by scrolling in 800px increments
  const sectionScrollResult = await page.evaluate(() => {
    const container = document.querySelector("main.flex-1");
    if (container) {
      return {
        selector: "main.flex-1",
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
      };
    }
    return {
      selector: null,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: window.innerHeight,
    };
  });

  const totalHeight = sectionScrollResult.scrollHeight;
  console.log(
    `Section screenshots: scrollable=${sectionScrollResult.selector || "window"}, height=${totalHeight}px`
  );

  let idx = 1;
  for (let y = 0; y < totalHeight; y += 800) {
    if (sectionScrollResult.selector) {
      await page.evaluate(
        ({ sel, scrollY }) => {
          const el = document.querySelector(sel);
          if (el) el.scrollTop = scrollY;
          else window.scrollTo(0, scrollY);
        },
        { sel: sectionScrollResult.selector, scrollY: y }
      );
    } else {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
    }
    await page.waitForTimeout(300);
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

  // Close the page, NOT the browser
  await page.close();
  console.log("Page closed. Done!");
})();
