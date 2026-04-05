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
  await page.waitForTimeout(5000);

  // Find all images in the main content area
  const imageInfo = await page.evaluate(() => {
    const main = document.querySelector("article") || document.querySelector("main");
    const container = main || document.body;
    const imgs = container.querySelectorAll("img");
    const results = [];

    for (const img of imgs) {
      const rect = img.getBoundingClientRect();
      // Skip tiny images (icons, avatars) and ads
      if (rect.width < 100 || rect.height < 80) continue;

      // Get parent context
      const parent = img.parentElement;
      const grandparent = parent?.parentElement;

      // Check if it looks like a diagram (not a profile pic or ad)
      const src = img.src || img.getAttribute("src") || "";
      const alt = img.alt || "";
      const title = img.title || "";

      results.push({
        src: src.substring(0, 200),
        alt,
        title,
        width: rect.width,
        height: rect.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        parentTag: parent?.tagName,
        parentClass: parent?.className?.substring(0, 100),
        grandparentTag: grandparent?.tagName,
        grandparentClass: grandparent?.className?.substring(0, 100),
        // Check for figure/caption
        figCaption:
          parent?.querySelector("figcaption")?.innerText ||
          grandparent?.querySelector("figcaption")?.innerText ||
          "",
        // Nearby text
        nearbyText: (parent?.innerText || "").substring(0, 100),
      });
    }

    // Also check for SVGs that might be diagrams
    const svgs = container.querySelectorAll("svg");
    const svgResults = [];
    for (const svg of svgs) {
      const rect = svg.getBoundingClientRect();
      if (rect.width < 100 || rect.height < 80) continue;
      svgResults.push({
        width: rect.width,
        height: rect.height,
        parentTag: svg.parentElement?.tagName,
        parentClass: svg.parentElement?.className?.substring(0, 100),
        childCount: svg.children.length,
      });
    }

    // Also check for canvas elements
    const canvases = container.querySelectorAll("canvas");

    // Also check for iframes (Excalidraw might use these)
    const iframes = container.querySelectorAll("iframe");
    const iframeResults = [];
    for (const iframe of iframes) {
      iframeResults.push({
        src: iframe.src?.substring(0, 200),
        width: iframe.width,
        height: iframe.height,
      });
    }

    return {
      images: results,
      svgCount: svgResults.length,
      svgs: svgResults,
      canvasCount: canvases.length,
      iframeCount: iframes.length,
      iframes: iframeResults,
    };
  });

  console.log(`\n=== DIAGRAM ANALYSIS ===`);
  console.log(`Images (>100x80): ${imageInfo.images.length}`);
  console.log(`SVGs (>100x80): ${imageInfo.svgCount}`);
  console.log(`Canvases: ${imageInfo.canvasCount}`);
  console.log(`Iframes: ${imageInfo.iframeCount}`);

  console.log("\n--- Images ---");
  for (const img of imageInfo.images) {
    console.log(`\n  src: ${img.src}`);
    console.log(`  alt: "${img.alt}"`);
    console.log(
      `  size: ${Math.round(img.width)}x${Math.round(img.height)} (natural: ${img.naturalWidth}x${img.naturalHeight})`
    );
    console.log(`  parent: ${img.parentTag}.${img.parentClass}`);
    console.log(`  caption: "${img.figCaption}"`);
  }

  if (imageInfo.svgs.length > 0) {
    console.log("\n--- SVGs ---");
    for (const svg of imageInfo.svgs) {
      console.log(
        `  size: ${Math.round(svg.width)}x${Math.round(svg.height)}, children: ${svg.childCount}, parent: ${svg.parentTag}.${svg.parentClass}`
      );
    }
  }

  if (imageInfo.iframes.length > 0) {
    console.log("\n--- Iframes ---");
    for (const iframe of imageInfo.iframes) {
      console.log(`  src: ${iframe.src}`);
    }
  }

  await browser.close();
  console.log("\nDone!");
})();
