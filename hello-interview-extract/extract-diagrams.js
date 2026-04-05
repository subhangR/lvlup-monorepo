const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const QUESTION_SLUG = process.argv[2] || "tinder";
const QUESTION_URL =
  process.argv[3] ||
  `https://www.hellointerview.com/learn/system-design/problem-breakdowns/${QUESTION_SLUG}`;

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location).then(resolve).catch(reject);
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222", { timeout: 60000 });
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
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
  const stillClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  for (const btn of stillClosed) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      await page.waitForTimeout(800);
    } catch (e) {}
  }
  await page.waitForTimeout(3000);

  // Scroll to render all lazy content
  const mainContainer = await page.$("main.flex-1");
  if (mainContainer) {
    const scrollHeight = await mainContainer.evaluate((el) => el.scrollHeight);
    console.log(`Scrolling main container (${scrollHeight}px)...`);
    for (let y = 0; y < scrollHeight; y += 400) {
      await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(2000);
    await mainContainer.evaluate((el) => el.scrollTo(0, 0));
    await page.waitForTimeout(1000);
  }

  // Setup output directories
  const outDir = path.join(__dirname, "questions", QUESTION_SLUG, "diagrams");
  fs.mkdirSync(outDir, { recursive: true });

  // Find all diagram wrappers and extract data
  const wrappers = await page.$$('div.MuiBox-root[style*="cursor:pointer"]');
  console.log(`\nFound ${wrappers.length} diagrams\n`);

  const manifest = [];

  for (let i = 0; i < wrappers.length; i++) {
    const wrapper = wrappers[i];
    const idx = String(i + 1).padStart(2, "0");

    try {
      await wrapper.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Get the <object> data URL and caption
      const meta = await wrapper.evaluate((el) => {
        const obj = el.querySelector("object");
        const dataUrl = obj?.getAttribute("data") || obj?.data || "";

        // Get caption from the typography element below the diagram
        const captionEl = el.querySelector(".MuiTypography-caption");
        const caption = captionEl?.innerText?.trim() || "";

        // Get nearby heading context
        let context = "";
        let prev = el.parentElement;
        while (prev) {
          const sibling = prev.previousElementSibling;
          if (sibling) {
            const headings = sibling.querySelectorAll("h1, h2, h3, h4");
            if (headings.length > 0) {
              context = headings[headings.length - 1].innerText?.trim() || "";
              break;
            }
            const text = sibling.innerText?.trim() || "";
            if (text.length > 10 && text.length < 200) {
              context = text;
              break;
            }
          }
          prev = sibling;
          if (!prev) break;
        }

        return { dataUrl, caption, context };
      });

      // 1. Take a clipped screenshot of the diagram
      const screenshotPath = path.join(outDir, `diagram-${idx}.png`);
      await wrapper.screenshot({ path: screenshotPath });

      // 2. Download the SVG file
      let svgSize = 0;
      if (meta.dataUrl) {
        try {
          const svgContent = await downloadFile(meta.dataUrl);
          const svgPath = path.join(outDir, `diagram-${idx}.svg`);
          fs.writeFileSync(svgPath, svgContent);
          svgSize = svgContent.length;
        } catch (e) {
          console.log(`    SVG download failed: ${e.message?.substring(0, 60)}`);
        }
      }

      const label = meta.caption || meta.context || "untitled";
      console.log(`  ${idx}. "${label}"`);
      console.log(
        `      SVG: ${meta.dataUrl ? path.basename(meta.dataUrl) : "N/A"} (${svgSize} bytes)`
      );

      manifest.push({
        index: i + 1,
        files: { png: `diagram-${idx}.png`, svg: `diagram-${idx}.svg` },
        caption: meta.caption,
        context: meta.context,
        svgUrl: meta.dataUrl,
      });
    } catch (e) {
      console.log(`  ${idx}. ERROR: ${e.message?.substring(0, 80)}`);
      manifest.push({ index: i + 1, error: e.message });
    }
  }

  // Save manifest
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  console.log(`\n=== DIAGRAM EXTRACTION COMPLETE ===`);
  console.log(`Question: ${QUESTION_SLUG}`);
  console.log(`Diagrams: ${wrappers.length}`);
  console.log(`Output: ${outDir}`);
  console.log(`Files per diagram: PNG (clipped screenshot) + SVG (original vector)`);

  await browser.close();
  console.log("Done!");
})();
