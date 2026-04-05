const { chromium } = require("playwright");

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log("Navigating to Tinder question...");
  await page.goto("https://www.hellointerview.com/learn/system-design/problem-breakdowns/tinder", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(8000);

  // Expand all MUI accordions
  let accordionButtons = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Expanding ${accordionButtons.length} accordions...`);
  for (const btn of accordionButtons) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
    } catch (e) {}
  }
  await page.waitForTimeout(3000);

  // Get HTML around known diagram locations
  const htmlAnalysis = await page.evaluate(() => {
    const body = document.body;
    const html = body.innerHTML;

    // Find positions of known diagram-adjacent text
    const markers = [
      "High-Level Design",
      "simple client-server",
      "Defining the Core Entities",
      "We can do this with a simple",
    ];

    const results = {};
    for (const marker of markers) {
      const pos = html.indexOf(marker);
      if (pos >= 0) {
        // Get surrounding HTML (500 chars before and after)
        const start = Math.max(0, pos - 200);
        const end = Math.min(html.length, pos + marker.length + 2000);
        results[marker] = html.substring(start, end);
      } else {
        results[marker] = "NOT FOUND";
      }
    }

    // Also search for any Excalidraw-related strings in the full HTML
    const excalidrawPatterns = ["excalidraw", "Excalidraw", "EXCALIDRAW", "excali"];
    const excalidrawFinds = {};
    for (const pat of excalidrawPatterns) {
      const idx = html.indexOf(pat);
      excalidrawFinds[pat] =
        idx >= 0
          ? html.substring(Math.max(0, idx - 50), Math.min(html.length, idx + 200))
          : "NOT FOUND";
    }

    // Search for common diagram image hosting patterns
    const imgPatterns = [
      "files.hellointerview.com",
      "amazonaws.com",
      "cloudfront.net",
      "imgix.net",
      "cloudinary.com",
      "data:image",
      "blob:",
      ".excalidraw",
    ];
    const imgFinds = {};
    for (const pat of imgPatterns) {
      const matches = [];
      let searchFrom = 0;
      while (searchFrom < html.length) {
        const idx = html.indexOf(pat, searchFrom);
        if (idx < 0) break;
        // Get the surrounding context to find the full URL
        const start = Math.max(0, idx - 100);
        const end = Math.min(html.length, idx + 200);
        const context = html.substring(start, end);
        // Extract src/href if present
        const srcMatch = context.match(/(?:src|href|url)\s*[=:]\s*["']?([^"'\s>]+)/i);
        if (srcMatch) {
          matches.push(srcMatch[1].substring(0, 300));
        }
        searchFrom = idx + pat.length;
        if (matches.length >= 5) break;
      }
      if (matches.length > 0) {
        imgFinds[pat] = [...new Set(matches)]; // unique
      }
    }

    // Find scroll containers
    const scrollContainers = [];
    const allDivs = document.querySelectorAll("div, main, article, section");
    for (const div of allDivs) {
      const style = getComputedStyle(div);
      if (
        (style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll") &&
        div.scrollHeight > div.clientHeight + 100
      ) {
        scrollContainers.push({
          tag: div.tagName,
          class: (div.className || "").substring(0, 100),
          id: div.id,
          scrollHeight: div.scrollHeight,
          clientHeight: div.clientHeight,
          scrollTop: div.scrollTop,
        });
      }
    }

    return { results, excalidrawFinds, imgFinds, scrollContainers };
  });

  console.log("\n=== HTML around diagram locations ===");
  for (const [marker, html] of Object.entries(htmlAnalysis.results)) {
    console.log(`\n--- "${marker}" ---`);
    console.log(html.substring(0, 600));
    console.log("...");
  }

  console.log("\n=== Excalidraw patterns ===");
  for (const [pat, result] of Object.entries(htmlAnalysis.excalidrawFinds)) {
    console.log(`${pat}: ${result === "NOT FOUND" ? "NOT FOUND" : result.substring(0, 200)}`);
  }

  console.log("\n=== Image hosting patterns ===");
  for (const [pat, urls] of Object.entries(htmlAnalysis.imgFinds)) {
    console.log(`\n${pat}:`);
    for (const url of urls) {
      console.log(`  ${url}`);
    }
  }

  console.log("\n=== Scroll containers ===");
  for (const sc of htmlAnalysis.scrollContainers) {
    console.log(
      `  ${sc.tag}#${sc.id}.${sc.class}: scrollH=${sc.scrollHeight}, clientH=${sc.clientHeight}, scrollTop=${sc.scrollTop}`
    );
  }

  await browser.close();
  console.log("\nDone!");
})();
