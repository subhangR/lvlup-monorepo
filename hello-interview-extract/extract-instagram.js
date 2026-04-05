const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "instagram";
const QUESTION_URL =
  "https://www.hellointerview.com/learn/system-design/problem-breakdowns/instagram";

(async () => {
  let page = null;
  let browser = null;

  try {
    console.log("Connecting to Chrome via CDP...");
    browser = await chromium.connectOverCDP("http://localhost:9222");
    const context = browser.contexts()[0];

    // Always create a NEW page
    page = await context.newPage();

    console.log(`Navigating to ${QUESTION_SLUG}...`);
    await page.goto(QUESTION_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(8000);

    // Verify we're on the right page
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Scroll through main.flex-1 scroll container to trigger lazy rendering
    console.log("Scrolling through content to trigger lazy rendering...");
    const scrolled = await page.evaluate(async () => {
      const container = document.querySelector("main.flex-1");
      if (!container) {
        // Fallback: scroll the window
        const totalHeight = document.documentElement.scrollHeight;
        let scrollPos = 0;
        while (scrollPos < totalHeight) {
          scrollPos += 400;
          window.scrollTo(0, scrollPos);
          await new Promise((r) => setTimeout(r, 150));
        }
        return { container: "window", totalHeight };
      }
      const totalHeight = container.scrollHeight;
      let scrollPos = 0;
      while (scrollPos < totalHeight) {
        scrollPos += 400;
        container.scrollTop = scrollPos;
        await new Promise((r) => setTimeout(r, 150));
      }
      return { container: "main.flex-1", totalHeight };
    });
    console.log(`Scrolled ${scrolled.container} (height: ${scrolled.totalHeight}px)`);
    await page.waitForTimeout(2000);

    // Scroll back to top
    await page.evaluate(() => {
      const container = document.querySelector("main.flex-1");
      if (container) container.scrollTop = 0;
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // Expand all MUI accordions using JavaScript clicks to avoid navigation issues
    console.log("Expanding accordion sections...");
    let expandPass = 1;
    while (expandPass <= 3) {
      const closedCount = await page.evaluate(() => {
        return document.querySelectorAll('button.MuiAccordionSummary-root[aria-expanded="false"]')
          .length;
      });
      if (closedCount === 0) {
        console.log(`Pass ${expandPass}: All accordions expanded!`);
        break;
      }
      console.log(`Pass ${expandPass}: Found ${closedCount} closed accordions`);

      // Click each accordion one at a time using evaluate to avoid stale handles
      for (let i = 0; i < closedCount; i++) {
        try {
          const result = await page.evaluate(() => {
            const btn = document.querySelector(
              'button.MuiAccordionSummary-root[aria-expanded="false"]'
            );
            if (!btn) return null;
            const text = btn.innerText?.trim().substring(0, 60) || "(unknown)";
            btn.scrollIntoView({ block: "center" });
            btn.click();
            return text;
          });
          if (result === null) break;
          console.log(`  Expanded: "${result}"`);
          await page.waitForTimeout(1000);
        } catch (e) {
          console.log(`    -> ERROR: ${e.message?.substring(0, 80)}`);
          await page.waitForTimeout(500);
        }
      }
      expandPass++;
    }

    // Retry any still closed
    const stillClosedCount = await page.evaluate(() => {
      return document.querySelectorAll('button.MuiAccordionSummary-root[aria-expanded="false"]')
        .length;
    });
    if (stillClosedCount > 0) {
      console.log(`Retrying ${stillClosedCount} still-closed accordions...`);
      await page.evaluate(() => {
        const buttons = document.querySelectorAll(
          'button.MuiAccordionSummary-root[aria-expanded="false"]'
        );
        buttons.forEach((btn) => {
          btn.scrollIntoView({ block: "center" });
          btn.click();
        });
      });
      await page.waitForTimeout(2000);
    }

    // Final check
    const finalState = await page.evaluate(() => {
      const closed = document.querySelectorAll(
        'button.MuiAccordionSummary-root[aria-expanded="false"]'
      ).length;
      const open = document.querySelectorAll(
        'button.MuiAccordionSummary-root[aria-expanded="true"]'
      ).length;
      return { closed, open };
    });
    console.log(`\nFinal state: ${finalState.open} expanded, ${finalState.closed} still closed`);

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
    const outFile = path.join(outDir, `${QUESTION_SLUG}-raw-content.txt`);
    fs.writeFileSync(outFile, content, "utf8");
    console.log(`Saved ${content.length} chars of raw content`);

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

    // Set viewport for screenshots
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.waitForTimeout(500);

    // Scroll to top
    await page.evaluate(() => {
      const container = document.querySelector("main.flex-1");
      if (container) container.scrollTop = 0;
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // Full-page screenshot
    await page.screenshot({ path: path.join(ssDir, "full-page.png"), fullPage: true });
    console.log("Full-page screenshot saved");

    // Section screenshots using scroll + viewport capture
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
  } catch (e) {
    console.error(`Fatal error: ${e.message}`);
  } finally {
    // Close only the page, NOT the browser
    if (page) {
      try {
        await page.close();
      } catch (e) {
        /* page may already be closed */
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        /* ignore */
      }
    }
    console.log("Done!");
  }
})();
