const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "fb-post-search";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-post-search";

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];

  // Create a new page to avoid stale context issues
  const page = await context.newPage();

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log("DOM loaded, waiting for SPA render...");
  await page.waitForTimeout(8000);

  // Verify we're on the right page
  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);

  // Expand all MUI accordions - re-query each time to avoid stale refs
  console.log("Expanding accordion sections...");
  let closedCount = (await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]'))
    .length;
  console.log(`Found ${closedCount} closed accordion buttons`);

  let maxAttempts = closedCount + 5;
  let attempt = 0;
  while (attempt < maxAttempts) {
    const btns = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
    if (btns.length === 0) break;
    attempt++;
    const btn = btns[0];
    try {
      const text = await btn.innerText();
      console.log(`  [${attempt}] Expanding: "${text.trim().substring(0, 60)}"`);
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1200);
    } catch (e) {
      console.log(`  [${attempt}] ERROR: ${e.message?.substring(0, 80)}`);
      await page.waitForTimeout(500);
    }
  }

  // Final check
  const finalClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Accordions still closed: ${finalClosed.length}`);
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

  // Take screenshots
  console.log("\nTaking screenshots...");

  // Set viewport first
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.waitForTimeout(500);

  // Find the scrollable container
  const scrollInfo = await page.evaluate(() => {
    const all = document.querySelectorAll("*");
    let best = null;
    let bestHeight = 0;
    for (const el of all) {
      if (el.scrollHeight > el.clientHeight + 100 && el.scrollHeight > bestHeight) {
        best = {
          tag: el.tagName,
          id: el.id,
          className: (el.className || "").substring(0, 80),
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
        };
        bestHeight = el.scrollHeight;
      }
    }
    return {
      best,
      docHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
    };
  });
  console.log("Scroll info:", JSON.stringify(scrollInfo));

  // Full-page screenshot
  await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
  console.log("Full-page screenshot saved");

  // Take section screenshots by scrolling the inner container
  const scrollSelector = scrollInfo.best
    ? scrollInfo.best.id
      ? `#${scrollInfo.best.id}`
      : scrollInfo.best.className
        ? `${scrollInfo.best.tag}.${scrollInfo.best.className.split(" ")[0]}`
        : scrollInfo.best.tag
    : null;

  const totalHeight = scrollInfo.best ? scrollInfo.best.scrollHeight : scrollInfo.docHeight;
  console.log(`Scrollable: ${scrollSelector || "window"}, height: ${totalHeight}px`);

  let idx = 1;
  for (let y = 0; y < totalHeight; y += 800) {
    if (scrollSelector) {
      await page.evaluate(
        ({ sel, scrollY }) => {
          const el = document.querySelector(sel);
          if (el) el.scrollTop = scrollY;
          else window.scrollTo(0, scrollY);
        },
        { sel: scrollSelector, scrollY: y }
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

  // Close the new tab we opened, not the browser
  await page.close();
  await browser.close();
  console.log("Done!");
})();
