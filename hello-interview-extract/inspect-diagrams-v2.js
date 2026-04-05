const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

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
  await page.waitForTimeout(5000);

  // Scroll through entire page to trigger lazy loading
  console.log("Scrolling through page to trigger lazy loading...");
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Page height: ${scrollHeight}px`);

  for (let y = 0; y < scrollHeight; y += 500) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(2000);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Now inspect all potential diagram elements
  const analysis = await page.evaluate(() => {
    const main =
      document.querySelector("article") || document.querySelector("main") || document.body;

    // 1. ALL images regardless of size
    const allImgs = main.querySelectorAll("img");
    const imgResults = [];
    for (const img of allImgs) {
      const rect = img.getBoundingClientRect();
      const src = img.src || img.getAttribute("src") || img.getAttribute("data-src") || "";
      // Skip very small icons
      if (rect.width < 50 && rect.height < 50 && img.naturalWidth < 50) continue;

      imgResults.push({
        src: src.substring(0, 300),
        alt: img.alt || "",
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        loading: img.loading,
        parentTag: img.parentElement?.tagName,
        parentClass: (img.parentElement?.className || "").substring(0, 150),
        isDiagram:
          src.includes("diagram") ||
          src.includes("design") ||
          src.includes("architecture") ||
          src.includes("excalidraw") ||
          src.includes("draw") ||
          src.includes("system"),
      });
    }

    // 2. Check for Excalidraw-specific elements
    const excalidrawElements = main.querySelectorAll(
      '[class*="excalidraw"], [data-type*="excalidraw"], [id*="excalidraw"]'
    );

    // 3. Check for picture elements
    const pictures = main.querySelectorAll("picture");
    const pictureResults = [];
    for (const pic of pictures) {
      const sources = pic.querySelectorAll("source");
      const img = pic.querySelector("img");
      pictureResults.push({
        sourcesCount: sources.length,
        sourceTypes: Array.from(sources).map((s) => s.type),
        imgSrc: img?.src?.substring(0, 200),
        imgAlt: img?.alt,
      });
    }

    // 4. Check for figure elements (often wrap diagrams)
    const figures = main.querySelectorAll("figure");
    const figureResults = [];
    for (const fig of figures) {
      const img = fig.querySelector("img");
      const caption = fig.querySelector("figcaption");
      const rect = fig.getBoundingClientRect();
      figureResults.push({
        hasImg: !!img,
        imgSrc: img?.src?.substring(0, 200),
        caption: caption?.innerText || "",
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }

    // 5. Check for any element with "diagram" in class/id
    const diagramEls = main.querySelectorAll(
      '[class*="diagram" i], [class*="Diagram" i], [id*="diagram" i], [class*="figure" i], [class*="illustration" i]'
    );

    // 6. Check for Mermaid diagrams
    const mermaidEls = main.querySelectorAll('[class*="mermaid"], .mermaid, pre.mermaid');

    // 7. Check for any zoom/lightbox wrappers (these often contain diagrams)
    const zoomEls = main.querySelectorAll(
      '[class*="zoom"], [class*="lightbox"], [class*="modal"], [data-rmiz], [class*="Zoom"]'
    );
    const zoomResults = [];
    for (const z of zoomEls) {
      const img = z.querySelector("img");
      zoomResults.push({
        tag: z.tagName,
        class: (z.className || "").substring(0, 150),
        dataAttrs: Array.from(z.attributes)
          .filter((a) => a.name.startsWith("data-"))
          .map((a) => `${a.name}=${a.value}`)
          .join(", "),
        hasImg: !!img,
        imgSrc: img?.src?.substring(0, 200),
        imgAlt: img?.alt,
      });
    }

    // 8. Check for next/image components (Next.js optimized images)
    const nextImgs = main.querySelectorAll(
      '[data-nimg], span[style*="display:inline-block"] > img'
    );
    const nextImgResults = [];
    for (const img of nextImgs) {
      const rect = img.getBoundingClientRect();
      nextImgResults.push({
        src: (img.src || "").substring(0, 300),
        alt: img.alt,
        dataNimg: img.getAttribute("data-nimg"),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }

    return {
      totalImages: imgResults.length,
      images: imgResults,
      excalidrawCount: excalidrawElements.length,
      pictureCount: pictures.length,
      pictures: pictureResults,
      figureCount: figures.length,
      figures: figureResults,
      diagramElCount: diagramEls.length,
      mermaidCount: mermaidEls.length,
      zoomCount: zoomEls.length,
      zooms: zoomResults,
      nextImgCount: nextImgs.length,
      nextImgs: nextImgResults,
    };
  });

  console.log(`\n=== FULL DIAGRAM ANALYSIS (after scroll) ===`);
  console.log(`Total images: ${analysis.totalImages}`);
  console.log(`Excalidraw elements: ${analysis.excalidrawCount}`);
  console.log(`Picture elements: ${analysis.pictureCount}`);
  console.log(`Figure elements: ${analysis.figureCount}`);
  console.log(`Diagram-class elements: ${analysis.diagramElCount}`);
  console.log(`Mermaid elements: ${analysis.mermaidCount}`);
  console.log(`Zoom/lightbox elements: ${analysis.zoomCount}`);
  console.log(`Next.js images: ${analysis.nextImgCount}`);

  console.log("\n--- All Images ---");
  for (const img of analysis.images) {
    console.log(`\n  src: ${img.src}`);
    console.log(`  alt: "${img.alt}"`);
    console.log(
      `  rendered: ${img.width}x${img.height}, natural: ${img.naturalWidth}x${img.naturalHeight}`
    );
    console.log(`  parent: ${img.parentTag} class="${img.parentClass}"`);
    console.log(`  isDiagram: ${img.isDiagram}, loading: ${img.loading}`);
  }

  if (analysis.figures.length > 0) {
    console.log("\n--- Figures ---");
    for (const fig of analysis.figures) {
      console.log(
        `  img: ${fig.imgSrc}, caption: "${fig.caption}", size: ${fig.width}x${fig.height}`
      );
    }
  }

  if (analysis.zooms.length > 0) {
    console.log("\n--- Zoom/Lightbox elements ---");
    for (const z of analysis.zooms) {
      console.log(`  tag: ${z.tag}, class: "${z.class}"`);
      console.log(`  data: ${z.dataAttrs}`);
      console.log(`  img: ${z.imgSrc}, alt: "${z.imgAlt}"`);
    }
  }

  if (analysis.nextImgs.length > 0) {
    console.log("\n--- Next.js Images ---");
    for (const img of analysis.nextImgs) {
      console.log(`  src: ${img.src}`);
      console.log(`  alt: "${img.alt}", nimg: ${img.dataNimg}, size: ${img.width}x${img.height}`);
    }
  }

  await browser.close();
  console.log("\nDone!");
})();
