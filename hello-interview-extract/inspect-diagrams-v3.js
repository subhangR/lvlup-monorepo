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
  console.log("Expanding accordions...");
  let accordionButtons = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  console.log(`Found ${accordionButtons.length} closed accordions`);
  for (const btn of accordionButtons) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
    } catch (e) {}
  }
  // Retry
  const stillClosed = await page.$$('button.MuiAccordionSummary-root[aria-expanded="false"]');
  for (const btn of stillClosed) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      await page.waitForTimeout(800);
    } catch (e) {}
  }
  await page.waitForTimeout(3000);

  // Scroll through entire page to trigger lazy loading
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Page height after expansion: ${scrollHeight}px`);
  for (let y = 0; y < scrollHeight; y += 500) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));

  // Now find all potential diagram images
  const analysis = await page.evaluate(() => {
    const body = document.body;

    // Find ALL images that are larger than typical icons
    const allImgs = body.querySelectorAll("img");
    const diagramCandidates = [];
    for (const img of allImgs) {
      const rect = img.getBoundingClientRect();
      const src = img.src || "";
      // Look for images that could be diagrams (>200px wide, not avatars/icons)
      if (rect.width >= 200 && rect.height >= 100) {
        const parentChain = [];
        let el = img.parentElement;
        for (let i = 0; i < 5 && el; i++) {
          parentChain.push(`${el.tagName}.${(el.className || "").substring(0, 60)}`);
          el = el.parentElement;
        }
        diagramCandidates.push({
          src: src.substring(0, 400),
          alt: img.alt,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          natural: `${img.naturalWidth}x${img.naturalHeight}`,
          parentChain: parentChain.slice(0, 3),
        });
      }
    }

    // Check for Excalidraw rendered scenes (they use specific SVG structure)
    const allSvgs = body.querySelectorAll("svg");
    const largeSvgs = [];
    for (const svg of allSvgs) {
      const rect = svg.getBoundingClientRect();
      if (rect.width >= 200 && rect.height >= 100) {
        const hasText = svg.querySelectorAll("text").length;
        const hasRect = svg.querySelectorAll("rect").length;
        const hasLine = svg.querySelectorAll("line, path").length;
        largeSvgs.push({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          textEls: hasText,
          rectEls: hasRect,
          lineEls: hasLine,
          parentClass: (svg.parentElement?.className || "").substring(0, 100),
          viewBox: svg.getAttribute("viewBox"),
          role: svg.getAttribute("role"),
        });
      }
    }

    // Check for canvas elements (Excalidraw sometimes renders on canvas)
    const allCanvas = body.querySelectorAll("canvas");
    const largeCanvas = [];
    for (const c of allCanvas) {
      if (c.width >= 200 && c.height >= 100) {
        largeCanvas.push({
          width: c.width,
          height: c.height,
          parentClass: (c.parentElement?.className || "").substring(0, 100),
        });
      }
    }

    // Look for specific Excalidraw or draw.io patterns
    const excalidraw = body.querySelectorAll(
      '.excalidraw, [class*="excalidraw"], [data-testid*="excalidraw"]'
    );
    const drawio = body.querySelectorAll('[class*="drawio"], [class*="draw-io"]');

    // Look for any element with specific diagram-related data attributes
    const dataImgEls = body.querySelectorAll("[data-src], [data-image], [data-original]");
    const lazySrcs = [];
    for (const el of dataImgEls) {
      const dataSrc =
        el.getAttribute("data-src") ||
        el.getAttribute("data-image") ||
        el.getAttribute("data-original") ||
        "";
      if (dataSrc && dataSrc.length > 10) {
        lazySrcs.push({
          tag: el.tagName,
          dataSrc: dataSrc.substring(0, 300),
          class: (el.className || "").substring(0, 100),
        });
      }
    }

    // Check for medium-zoom or react-medium-image-zoom (common in docs)
    const zoomImgs = body.querySelectorAll(
      "[data-rmiz], [data-rmiz-content], [data-zoom], [data-zoom-src]"
    );
    const zoomResults = [];
    for (const el of zoomImgs) {
      const attrs = {};
      for (const attr of el.attributes) {
        if (attr.name.startsWith("data-")) attrs[attr.name] = attr.value?.substring(0, 200);
      }
      const img = el.querySelector("img") || (el.tagName === "IMG" ? el : null);
      zoomResults.push({
        tag: el.tagName,
        class: (el.className || "").substring(0, 100),
        dataAttrs: attrs,
        imgSrc: img?.src?.substring(0, 300),
        imgAlt: img?.alt,
      });
    }

    // Check for any contentful div with inline styles that could be diagram containers
    const styledDivs = body.querySelectorAll('div[style*="background-image"]');
    const bgImgDivs = [];
    for (const div of styledDivs) {
      const rect = div.getBoundingClientRect();
      if (rect.width >= 200 && rect.height >= 100) {
        const style = div.getAttribute("style");
        bgImgDivs.push({
          style: style.substring(0, 300),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    }

    // Get total page content length
    const mainContent = document.querySelector("article") || document.querySelector("main");
    const contentLen = mainContent ? mainContent.innerText.length : 0;

    return {
      contentLength: contentLen,
      diagramCandidates,
      largeSvgs,
      largeCanvas,
      excalidrawCount: excalidraw.length,
      drawioCount: drawio.length,
      lazySrcs,
      zoomResults,
      bgImgDivs,
    };
  });

  console.log(`\n=== DIAGRAM ANALYSIS (with accordions expanded) ===`);
  console.log(`Content length: ${analysis.contentLength} chars`);
  console.log(`Large images (>200x100): ${analysis.diagramCandidates.length}`);
  console.log(`Large SVGs: ${analysis.largeSvgs.length}`);
  console.log(`Large canvases: ${analysis.largeCanvas.length}`);
  console.log(`Excalidraw elements: ${analysis.excalidrawCount}`);
  console.log(`Draw.io elements: ${analysis.drawioCount}`);
  console.log(`Lazy-load sources: ${analysis.lazySrcs.length}`);
  console.log(`Zoom-wrapped images: ${analysis.zoomResults.length}`);
  console.log(`Background-image divs: ${analysis.bgImgDivs.length}`);

  if (analysis.diagramCandidates.length > 0) {
    console.log("\n--- Large Images ---");
    for (const img of analysis.diagramCandidates) {
      console.log(`\n  src: ${img.src}`);
      console.log(`  alt: "${img.alt}", size: ${img.width}x${img.height}, natural: ${img.natural}`);
      console.log(`  parents: ${img.parentChain.join(" > ")}`);
    }
  }

  if (analysis.largeSvgs.length > 0) {
    console.log("\n--- Large SVGs ---");
    for (const svg of analysis.largeSvgs) {
      console.log(`  size: ${svg.width}x${svg.height}, viewBox: ${svg.viewBox}`);
      console.log(`  texts: ${svg.textEls}, rects: ${svg.rectEls}, lines: ${svg.lineEls}`);
      console.log(`  parent: ${svg.parentClass}`);
    }
  }

  if (analysis.zoomResults.length > 0) {
    console.log("\n--- Zoom-wrapped elements ---");
    for (const z of analysis.zoomResults) {
      console.log(`  ${z.tag}.${z.class}`);
      console.log(`  data: ${JSON.stringify(z.dataAttrs)}`);
      console.log(`  img: ${z.imgSrc}`);
    }
  }

  if (analysis.lazySrcs.length > 0) {
    console.log("\n--- Lazy sources ---");
    for (const l of analysis.lazySrcs) {
      console.log(`  ${l.tag}.${l.class}: ${l.dataSrc}`);
    }
  }

  if (analysis.bgImgDivs.length > 0) {
    console.log("\n--- Background-image divs ---");
    for (const d of analysis.bgImgDivs) {
      console.log(`  ${d.width}x${d.height}: ${d.style}`);
    }
  }

  await browser.close();
  console.log("\nDone!");
})();
