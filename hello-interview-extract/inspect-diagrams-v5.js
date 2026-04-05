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

  // Find the main scroll container and scroll through it
  const mainContainer = await page.$("main.flex-1");
  if (mainContainer) {
    const scrollHeight = await mainContainer.evaluate((el) => el.scrollHeight);
    console.log(`Main container scrollHeight: ${scrollHeight}px`);

    // Scroll through the main container to trigger lazy rendering
    for (let y = 0; y < scrollHeight; y += 500) {
      await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(3000);

    // Scroll back to top
    await mainContainer.evaluate((el) => el.scrollTo(0, 0));
    await page.waitForTimeout(1000);
  }

  // Now look for Excalidraw-specific elements
  const diagramInfo = await page.evaluate(() => {
    const body = document.body;

    // 1. Look for Excalidraw canvas elements
    const canvases = body.querySelectorAll("canvas");
    const canvasResults = [];
    for (const c of canvases) {
      canvasResults.push({
        width: c.width,
        height: c.height,
        cssWidth: c.style.width,
        cssHeight: c.style.height,
        parentClass: (c.parentElement?.className || "").substring(0, 150),
        grandparentClass: (c.parentElement?.parentElement?.className || "").substring(0, 150),
        dataAttrs: Array.from(c.attributes)
          .filter((a) => a.name.startsWith("data-"))
          .map((a) => `${a.name}=${a.value}`),
      });
    }

    // 2. Look for the MuiBox-root containers with cursor:pointer (diagram wrappers)
    const diagramWrappers = body.querySelectorAll('div.MuiBox-root[style*="cursor:pointer"]');
    const wrapperResults = [];
    for (const w of diagramWrappers) {
      const rect = w.getBoundingClientRect();
      const innerHtml = w.innerHTML;
      const hasCanvas = w.querySelector("canvas") !== null;
      const hasSvg = w.querySelector("svg") !== null;
      const hasImg = w.querySelector("img") !== null;

      // Look for Excalidraw scene data
      const excalidrawEl = w.querySelector('[class*="excalidraw"]');
      const staticCanvas = w.querySelector("canvas.excalidraw__canvas");

      // Check all children
      const childTags = Array.from(w.children).map(
        (c) => `${c.tagName}.${(c.className || "").substring(0, 50)}`
      );

      wrapperResults.push({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        hasCanvas,
        hasSvg,
        hasImg,
        hasExcalidraw: !!excalidrawEl,
        excalidrawClass: excalidrawEl?.className?.substring(0, 150),
        staticCanvasClass: staticCanvas?.className?.substring(0, 100),
        childTags,
        htmlSnippet: innerHtml.substring(0, 500),
      });
    }

    // 3. Look for Excalidraw __canvas elements
    const excCanvases = body.querySelectorAll('.excalidraw__canvas, canvas[class*="excalidraw"]');
    const excCanvasResults = [];
    for (const c of excCanvases) {
      excCanvasResults.push({
        class: c.className,
        width: c.width,
        height: c.height,
      });
    }

    // 4. Look for SVGs with Excalidraw-like content (hand-drawn style paths)
    const allSvgs = body.querySelectorAll("svg");
    const diagramSvgs = [];
    for (const svg of allSvgs) {
      const rect = svg.getBoundingClientRect();
      if (rect.width < 100 || rect.height < 50) continue;

      // Excalidraw SVGs typically have g elements with specific transforms
      const gElements = svg.querySelectorAll("g");
      const pathElements = svg.querySelectorAll("path");
      const textElements = svg.querySelectorAll("text");
      const rectElements = svg.querySelectorAll("rect");

      if (pathElements.length > 3 || (textElements.length > 0 && rectElements.length > 0)) {
        diagramSvgs.push({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          viewBox: svg.getAttribute("viewBox"),
          gCount: gElements.length,
          pathCount: pathElements.length,
          textCount: textElements.length,
          rectCount: rectElements.length,
          parentClass: (svg.parentElement?.className || "").substring(0, 150),
          firstTextContent: textElements[0]?.textContent?.substring(0, 50),
          svgHTML: svg.outerHTML.substring(0, 300),
        });
      }
    }

    // 5. Look for data-theme="light" or similar Excalidraw wrapper attributes
    const excWrappers = body.querySelectorAll('[class*="excalidraw"]');
    const excWrapperResults = [];
    for (const w of excWrappers) {
      const rect = w.getBoundingClientRect();
      excWrapperResults.push({
        tag: w.tagName,
        class: (w.className || "").substring(0, 200),
        id: w.id,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        childCount: w.children.length,
        childTags: Array.from(w.children)
          .slice(0, 5)
          .map((c) => `${c.tagName}.${(c.className || "").substring(0, 40)}`),
      });
    }

    // 6. Search for data URLs (base64 images)
    const html = body.innerHTML;
    const dataImgCount = (html.match(/data:image/g) || []).length;
    const blobCount = (html.match(/blob:/g) || []).length;

    return {
      canvasResults,
      wrapperResults,
      excCanvasResults,
      diagramSvgs,
      excWrapperResults,
      dataImgCount,
      blobCount,
    };
  });

  console.log(`\n=== EXCALIDRAW DIAGRAM ANALYSIS ===`);

  console.log(`\nCanvases: ${diagramInfo.canvasResults.length}`);
  for (const c of diagramInfo.canvasResults) {
    console.log(`  ${c.width}x${c.height} (css: ${c.cssWidth}x${c.cssHeight})`);
    console.log(`  parent: ${c.parentClass}`);
    console.log(`  data: ${c.dataAttrs.join(", ")}`);
  }

  console.log(`\nDiagram wrappers (MuiBox cursor:pointer): ${diagramInfo.wrapperResults.length}`);
  for (let i = 0; i < diagramInfo.wrapperResults.length; i++) {
    const w = diagramInfo.wrapperResults[i];
    console.log(`\n  Wrapper ${i + 1}: ${w.width}x${w.height}`);
    console.log(
      `  canvas: ${w.hasCanvas}, svg: ${w.hasSvg}, img: ${w.hasImg}, excalidraw: ${w.hasExcalidraw}`
    );
    console.log(`  children: ${w.childTags.join(", ")}`);
    console.log(`  html: ${w.htmlSnippet.substring(0, 200)}...`);
  }

  console.log(`\nExcalidraw canvases: ${diagramInfo.excCanvasResults.length}`);
  for (const c of diagramInfo.excCanvasResults) {
    console.log(`  ${c.class}: ${c.width}x${c.height}`);
  }

  console.log(`\nDiagram SVGs: ${diagramInfo.diagramSvgs.length}`);
  for (const svg of diagramInfo.diagramSvgs) {
    console.log(`  ${svg.width}x${svg.height}, viewBox: ${svg.viewBox}`);
    console.log(
      `  paths: ${svg.pathCount}, texts: ${svg.textCount} (first: "${svg.firstTextContent}")`
    );
    console.log(`  parent: ${svg.parentClass}`);
    console.log(`  html: ${svg.svgHTML.substring(0, 200)}...`);
  }

  console.log(`\nExcalidraw wrapper elements: ${diagramInfo.excWrapperResults.length}`);
  for (const w of diagramInfo.excWrapperResults) {
    console.log(`  ${w.tag}#${w.id}.${w.class}`);
    console.log(`  size: ${w.width}x${w.height}, children: ${w.childCount}`);
    console.log(`  childTags: ${w.childTags.join(", ")}`);
  }

  console.log(`\nData URLs in HTML: ${diagramInfo.dataImgCount}`);
  console.log(`Blob URLs in HTML: ${diagramInfo.blobCount}`);

  await browser.close();
  console.log("\nDone!");
})();
