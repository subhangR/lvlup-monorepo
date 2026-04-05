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

  // First, let's understand the accordion structure
  const accordionInfo = await page.evaluate(() => {
    // Find elements containing solution text
    const results = [];
    const allElements = document.querySelectorAll("*");
    for (const el of allElements) {
      const text = el.textContent?.trim() || "";
      if (
        (text.startsWith("Bad Solution") ||
          text.startsWith("Good Solution") ||
          text.startsWith("Great Solution")) &&
        text.length < 200
      ) {
        results.push({
          tag: el.tagName,
          className: el.className?.substring?.(0, 100) || "",
          role: el.getAttribute("role"),
          dataState: el.getAttribute("data-state"),
          ariaExpanded: el.getAttribute("aria-expanded"),
          parentTag: el.parentElement?.tagName,
          parentClass: el.parentElement?.className?.substring?.(0, 100) || "",
          parentDataState: el.parentElement?.getAttribute("data-state"),
          parentAriaExpanded: el.parentElement?.getAttribute("aria-expanded"),
          grandParentTag: el.parentElement?.parentElement?.tagName,
          grandParentDataState: el.parentElement?.parentElement?.getAttribute("data-state"),
          text: text.substring(0, 80),
        });
      }
    }
    return results;
  });

  console.log("Accordion structure:");
  for (const info of accordionInfo) {
    console.log(JSON.stringify(info));
  }

  // Now expand all accordions based on what we found
  console.log("\nExpanding accordions...");

  const expandedCount = await page.evaluate(() => {
    let count = 0;

    // Strategy 1: Find all elements with data-state="closed" and change to "open"
    document.querySelectorAll('[data-state="closed"]').forEach((el) => {
      el.setAttribute("data-state", "open");
      // Also find and show the associated content
      const content = el.nextElementSibling;
      if (content) {
        content.setAttribute("data-state", "open");
        content.style.display = "";
        content.style.height = "auto";
        content.style.overflow = "visible";
      }
      count++;
    });

    // Strategy 2: Click all accordion triggers with aria-expanded="false"
    document.querySelectorAll('[aria-expanded="false"]').forEach((el) => {
      el.click();
      count++;
    });

    return count;
  });

  console.log(`Modified ${expandedCount} elements`);
  await page.waitForTimeout(2000);

  // Try clicking accordion triggers individually
  console.log("\nClicking accordion triggers by text...");
  const solutionTexts = [
    "Bad Solution: Database Polling for Matches",
    "Good Solution: Transactions",
    "Great Solution: Sharded Cassandra with Single-Partition Transactions",
    "Great Solution: Redis for Atomic Operations",
    "Good Solution: Use of Indexed Databases for Real-Time Querying",
    "Good Solution: Pre-computation and Caching",
    "Great Solution: Combination of Pre-computation and Indexed Database",
    "Bad Solution: DB Query + Contains Check",
    "Great Solution: Cache + DB Query + Contains Check",
    "Great Solution: Cache + Contains Check + Bloom Filter",
  ];

  for (const text of solutionTexts) {
    try {
      // Find the element containing this text and click it
      const clicked = await page.evaluate((searchText) => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        while (walker.nextNode()) {
          const el = walker.currentNode;
          const elText = el.textContent?.trim();
          if (elText === searchText || elText?.startsWith(searchText)) {
            // Find the closest clickable ancestor
            let target = el;
            for (let i = 0; i < 8; i++) {
              if (!target.parentElement) break;
              target = target.parentElement;
              if (
                target.getAttribute("data-state") === "closed" ||
                target.getAttribute("aria-expanded") === "false" ||
                target.tagName === "BUTTON" ||
                target.getAttribute("role") === "button"
              ) {
                target.click();
                return `Clicked: ${target.tagName}.${target.className?.substring?.(0, 50)}`;
              }
            }
            // Try clicking the element itself
            el.click();
            return `Direct click: ${el.tagName}`;
          }
        }
        return null;
      }, text);

      if (clicked) {
        console.log(`  ${text.substring(0, 50)}: ${clicked}`);
        await page.waitForTimeout(800);
      } else {
        console.log(`  ${text.substring(0, 50)}: NOT FOUND`);
      }
    } catch (e) {
      console.log(`  ${text.substring(0, 50)}: ERROR ${e.message?.substring(0, 50)}`);
    }
  }

  await page.waitForTimeout(2000);

  // Now extract the full text content
  console.log("\nExtracting content...");
  const content = await page.evaluate(() => {
    const el = document.querySelector("article") || document.querySelector("main") || document.body;
    return el.innerText;
  });

  fs.writeFileSync(path.join(__dirname, "tinder-raw-content.txt"), content, "utf8");
  console.log(`Saved ${content.length} chars`);

  // Check if accordion content was captured
  const hasRedis = content.includes("Redis") && content.includes("MULTI");
  const hasBloom = content.includes("Bloom") && content.includes("probabilistic");
  const hasGeoHash =
    content.includes("geohash") ||
    content.includes("Geohash") ||
    content.includes("geo-spatial") ||
    content.includes("geospatial");
  console.log(
    `Content check - Redis detail: ${hasRedis}, Bloom detail: ${hasBloom}, Geo detail: ${hasGeoHash}`
  );

  // Take full page screenshot
  await page.screenshot({
    path: path.join(__dirname, "screenshots", "full-page-v3.png"),
    fullPage: true,
  });

  // Section screenshots
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(__dirname, "screenshots", `v3-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  await browser.close();
  console.log("Done!");
})();
