const { chromium } = require("playwright");

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log("Navigating to Tinder question...");
  await page.goto("https://www.hellointerview.com/learn/system-design/problem-breakdowns/tinder", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(8000);

  // Expand all accordions
  let btns = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  for (const btn of btns) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
    } catch (e) {}
  }
  await page.waitForTimeout(3000);

  // Scroll to trigger rendering
  const mainContainer = await page.$("main.flex-1");
  if (mainContainer) {
    const sh = await mainContainer.evaluate((el) => el.scrollHeight);
    for (let y = 0; y < sh; y += 400) {
      await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(2000);
    await mainContainer.evaluate((el) => el.scrollTo(0, 0));
  }

  // Get detailed HTML of the first few diagram wrappers
  const wrappers = await page.$$('div.MuiBox-root[style*="cursor:pointer"]');
  console.log(`\nFound ${wrappers.length} wrappers`);

  // Look at wrapper 6 and 13 (should be architecture diagrams based on screenshots)
  for (const idx of [0, 5, 12]) {
    if (idx >= wrappers.length) continue;
    const wrapper = wrappers[idx];

    await wrapper.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const info = await wrapper.evaluate((el) => {
      // Get full DOM tree structure (not full HTML, just structure)
      function getStructure(node, depth = 0) {
        if (depth > 8) return "";
        const lines = [];
        const indent = "  ".repeat(depth);
        if (node.nodeType === 1) {
          // Element
          const tag = node.tagName.toLowerCase();
          const cls = (node.className || "").toString().substring(0, 80);
          const style = (node.getAttribute("style") || "").substring(0, 80);
          const attrs = [];
          if (cls) attrs.push(`class="${cls}"`);
          if (style) attrs.push(`style="${style}"`);
          if (node.getAttribute("viewBox")) attrs.push(`viewBox="${node.getAttribute("viewBox")}"`);
          if (node.getAttribute("d"))
            attrs.push(`d="${node.getAttribute("d").substring(0, 60)}..."`);

          const rect = node.getBoundingClientRect();
          const size = `${Math.round(rect.width)}x${Math.round(rect.height)}`;

          lines.push(`${indent}<${tag} ${attrs.join(" ")} [${size}]>`);

          for (const child of node.children) {
            lines.push(getStructure(child, depth + 1));
          }
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          lines.push(`${indent}TEXT: "${node.textContent.trim().substring(0, 50)}"`);
        }
        return lines.join("\n");
      }

      // Also get all SVGs and their details
      const svgs = el.querySelectorAll("svg");
      const svgDetails = [];
      for (const svg of svgs) {
        const rect = svg.getBoundingClientRect();
        svgDetails.push({
          viewBox: svg.getAttribute("viewBox"),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          childCount: svg.children.length,
          pathCount: svg.querySelectorAll("path").length,
          gCount: svg.querySelectorAll("g").length,
          textCount: svg.querySelectorAll("text").length,
          outerHTMLLength: svg.outerHTML.length,
          firstPath: svg.querySelector("path")?.getAttribute("d")?.substring(0, 100),
        });
      }

      return {
        structure: getStructure(el),
        svgs: svgDetails,
        totalHTML: el.innerHTML.length,
      };
    });

    console.log(`\n===== Wrapper ${idx + 1} =====`);
    console.log(`Total HTML: ${info.totalHTML} chars`);
    console.log(`SVGs found: ${info.svgs.length}`);
    for (const svg of info.svgs) {
      console.log(`  SVG: ${svg.width}x${svg.height}, viewBox: ${svg.viewBox}`);
      console.log(
        `    children: ${svg.childCount}, paths: ${svg.pathCount}, g: ${svg.gCount}, texts: ${svg.textCount}`
      );
      console.log(`    HTML size: ${svg.outerHTMLLength} chars`);
      console.log(`    firstPath: ${svg.firstPath}`);
    }
    console.log("\nDOM structure:");
    console.log(info.structure.substring(0, 2000));
  }

  await browser.close();
  console.log("\nDone!");
})();
