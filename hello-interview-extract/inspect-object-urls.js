const { chromium } = require("playwright");

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = await context.newPage();

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

  // Scroll to render all
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

  // Find all <object> elements and get their data URLs
  const objectInfo = await page.evaluate(() => {
    const objects = document.querySelectorAll("object");
    const results = [];
    for (const obj of objects) {
      const rect = obj.getBoundingClientRect();
      results.push({
        data: obj.getAttribute("data") || obj.data || "",
        type: obj.type || "",
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        className: (obj.className || "").substring(0, 150),
        // Try to access the embedded document
        hasContentDocument: !!obj.contentDocument,
        contentDocType: obj.contentDocument?.documentElement?.tagName,
        svgViewBox: obj.contentDocument?.querySelector("svg")?.getAttribute("viewBox"),
        svgPaths: obj.contentDocument?.querySelectorAll("path")?.length,
        svgTexts: obj.contentDocument?.querySelectorAll("text")?.length,
      });
    }
    return results;
  });

  console.log(`\nFound ${objectInfo.length} <object> elements:\n`);
  for (let i = 0; i < objectInfo.length; i++) {
    const obj = objectInfo[i];
    console.log(`${i + 1}. [${obj.width}x${obj.height}]`);
    console.log(`   data: ${obj.data}`);
    console.log(`   type: ${obj.type}`);
    console.log(`   class: ${obj.className}`);
    console.log(`   contentDoc: ${obj.hasContentDocument}, docType: ${obj.contentDocType}`);
    console.log(`   svgViewBox: ${obj.svgViewBox}, paths: ${obj.svgPaths}, texts: ${obj.svgTexts}`);
    console.log("");
  }

  await browser.close();
  console.log("Done!");
})();
