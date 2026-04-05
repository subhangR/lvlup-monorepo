const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  console.log("Navigating...");
  await page.goto("https://www.hellointerview.com/learn/system-design/problem-breakdowns/tinder", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // Click ONLY the accordion buttons that contain solution titles
  console.log("Expanding accordion sections...");
  const buttons = await page.$$('button[data-state="closed"]');
  console.log(`Found ${buttons.length} closed accordion buttons`);

  for (const btn of buttons) {
    try {
      const text = await btn.innerText();
      if (text.includes("Solution") || text.includes("solution")) {
        console.log(`  Expanding: ${text.trim().substring(0, 60)}`);
        await btn.click();
        await page.waitForTimeout(800);
      }
    } catch (e) {
      /* skip */
    }
  }

  await page.waitForTimeout(2000);

  // Extract full rendered text content
  console.log("Extracting text content...");
  const content = await page.evaluate(() => {
    // Get the main article/content area - try multiple selectors
    const selectors = [
      "article",
      "main",
      '[class*="prose"]',
      '[class*="Article"]',
      '[class*="markdown"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.length > 1000) {
        return el.innerText;
      }
    }
    // Fallback: get the largest content div
    const divs = [...document.querySelectorAll("div")];
    divs.sort((a, b) => b.innerText.length - a.innerText.length);
    return divs[0]?.innerText || document.body.innerText;
  });

  const outDir = __dirname;
  fs.writeFileSync(path.join(outDir, "tinder-raw-content.txt"), content, "utf8");
  console.log(`Saved ${content.length} chars of text content`);

  // Take full-page screenshot
  await page.screenshot({
    path: path.join(outDir, "screenshots", "full-page-expanded.png"),
    fullPage: true,
  });
  console.log("Full-page screenshot saved");

  // Take section screenshots
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, "screenshots", `expanded-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  await browser.close();
  console.log("Done!");
})();
