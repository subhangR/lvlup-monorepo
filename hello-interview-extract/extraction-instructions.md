# Hello Interview Content Extraction - Instructions

## Overview

This document describes how to extract system design question content from Hello
Interview (hellointerview.com) using Playwright connected to a logged-in Chrome
session via Chrome DevTools Protocol (CDP). This approach works for both free
and **premium-locked** content.

---

## Prerequisites

1. **Chrome Debug Profile** exists at:
   `~/Library/Application Support/Google/Chrome-Debug`
   - This profile has the Shaik Manzil premium account logged in
2. **Playwright** is installed (available via `npx playwright`)
3. **Output folder:**
   `/Users/subhang/Desktop/Projects/auto-levleup/hello-interview-extract/`

---

## Step 1: Launch Chrome with Remote Debugging

Chrome MUST be launched with `--remote-debugging-port` flag and a non-default
`--user-data-dir`.

```bash
# Kill any existing Chrome instances first
pkill -f "Google Chrome" 2>/dev/null
sleep 3

# Launch Chrome with debugging enabled using the debug profile
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/Library/Application Support/Google/Chrome-Debug" &

sleep 8

# Verify CDP is ready
curl -s http://localhost:9222/json/version | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'CDP ready: {d[\"Browser\"]}')"
```

### Important Notes:

- Chrome's default profile path (`~/Library/Application Support/Google/Chrome`)
  is **rejected** by Chrome when using `--remote-debugging-port`. A separate
  `Chrome-Debug` directory is required.
- Chrome cookies are encrypted with macOS Keychain keys **tied to the profile
  path**. Copying profiles loses sessions. The user must log in once in the
  debug profile.
- After first login, the session persists across Chrome restarts as long as the
  same `--user-data-dir` path is used.

---

## Step 2: Verify Login Status

Before extracting, verify the premium session is active:

```javascript
const { chromium } = require("playwright");

const browser = await chromium.connectOverCDP("http://localhost:9222");
const context = browser.contexts()[0];
const pages = context.pages();

// Check existing tabs for Hello Interview
for (const page of pages) {
  if (page.url().includes("hellointerview")) {
    const text = await page.evaluate(() =>
      document.body.innerText.substring(0, 2000)
    );
    const isLoggedIn = text.includes("Shaik") || text.includes("Dashboard");
    console.log(`Logged in: ${isLoggedIn}`);
  }
}
```

**Key indicators of logged-in state:**

- "Shaik Manzil" appears in the sidebar bottom
- "Start Practice" button (not "Upgrade To Practice")
- No lock icons on sidebar question links
- Banner says "Up to 15% off select mock interviews" (not "Up to 20% off Hello
  Interview Premium")

**If NOT logged in:** Navigate to `https://www.hellointerview.com` in the debug
Chrome, click "Sign in / Sign up", log in with the Shaik Manzil account.

---

## Step 3: Extract Content with Playwright

### 3a. Connect to Chrome and Navigate

```javascript
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const browser = await chromium.connectOverCDP("http://localhost:9222");
const context = browser.contexts()[0];

// Use an EXISTING page or create a new one
const page = context.pages()[0] || (await context.newPage());

// Navigate to the question
await page.goto(QUESTION_URL, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(5000);
```

### 3b. Expand ALL MUI Accordion Sections

Hello Interview uses **Material UI (MUI) Accordions** for the expandable
solution sections. The accordion structure is:

```
DIV.MuiAccordion-root
  H3.MuiAccordion-heading
    BUTTON.MuiAccordionSummary-root[aria-expanded="false"]  <-- CLICK TARGET
      SPAN.MuiAccordionSummary-content
        P (title text like "Bad Solution: ...")
  DIV.MuiAccordionDetails-root  <-- HIDDEN CONTENT (shown after click)
```

**Expansion code:**

```javascript
const accordionButtons = await page.$$(
  'button.MuiAccordionSummary-root[aria-expanded="false"]'
);
console.log(`Found ${accordionButtons.length} closed accordion buttons`);

for (const btn of accordionButtons) {
  const text = await btn.innerText();
  console.log(`Expanding: ${text.trim().substring(0, 60)}`);
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await btn.click({ force: true });
  await page.waitForTimeout(1000);

  // Verify expansion
  const expanded = await btn.getAttribute("aria-expanded");
  if (expanded !== "true") {
    console.log(`WARNING: Failed to expand "${text.trim().substring(0, 40)}"`);
  }
}

// Verify none remain closed
const stillClosed = await page.$$(
  'button.MuiAccordionSummary-root[aria-expanded="false"]'
);
if (stillClosed.length > 0) {
  console.log(
    `WARNING: ${stillClosed.length} accordions still closed, retrying...`
  );
  for (const btn of stillClosed) {
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
    await page.waitForTimeout(800);
  }
}

await page.waitForTimeout(2000);
```

### 3c. Extract Full Text Content

```javascript
const content = await page.evaluate(() => {
  const main =
    document.querySelector("article") || document.querySelector("main");
  if (main) return main.innerText;
  return document.body.innerText;
});

fs.writeFileSync(OUTPUT_PATH, content, "utf8");
```

### 3d. Content Verification

After extraction, verify key sections are present:

```javascript
const checks = {
  "Has title":
    content.includes("Understand the Problem") ||
    content.includes("Common Problems"),
  "Functional Requirements": content.includes("Functional Requirements"),
  "Non-Functional Requirements": content.includes(
    "Non-Functional Requirements"
  ),
  "Core Entities":
    content.includes("Core Entities") || content.includes("Defining the Core"),
  "API section": content.includes("The API") || content.includes("API"),
  "High-Level Design": content.includes("High-Level Design"),
  "Deep Dives":
    content.includes("Deep Dive") || content.includes("Potential Deep"),
  "What is Expected":
    content.includes("What is Expected") || content.includes("Mid-level"),
};
```

### 3e. Take Screenshots

```javascript
// Full-page screenshot with all accordions expanded
await page.screenshot({ path: FULL_SCREENSHOT_PATH, fullPage: true });

// Section-by-section screenshots
const pageHeight = await page.evaluate(
  () => document.documentElement.scrollHeight
);
await page.setViewportSize({ width: 1400, height: 900 });
let idx = 1;
for (let y = 0; y < pageHeight; y += 800) {
  await page.evaluate((sy) => window.scrollTo(0, sy), y);
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(
      screenshotDir,
      `section-${String(idx).padStart(2, "0")}.png`
    ),
  });
  idx++;
}
```

---

## Complete Extraction Script Template

The following is a complete, ready-to-run extraction script. Replace
`QUESTION_SLUG` and `QUESTION_URL` for each question.

```javascript
// extract-{slug}.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const QUESTION_SLUG = "REPLACE_ME"; // e.g., 'google-docs'
const QUESTION_URL = "REPLACE_ME"; // e.g., 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs'

(async () => {
  // --- Connect to logged-in Chrome ---
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = context.pages()[0] || (await context.newPage());

  // --- Navigate ---
  console.log(`Navigating to ${QUESTION_SLUG}...`);
  await page.goto(QUESTION_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // --- Expand all MUI accordions ---
  console.log("Expanding accordion sections...");
  const accordionButtons = await page.$$(
    'button.MuiAccordionSummary-root[aria-expanded="false"]'
  );
  console.log(`Found ${accordionButtons.length} closed accordion buttons`);

  for (const btn of accordionButtons) {
    try {
      const text = await btn.innerText();
      console.log(`  Expanding: "${text.trim().substring(0, 60)}"`);
      await btn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
      const expanded = await btn.getAttribute("aria-expanded");
      console.log(`    -> aria-expanded: ${expanded}`);
    } catch (e) {
      console.log(`    -> ERROR: ${e.message?.substring(0, 80)}`);
    }
  }

  // Retry any still closed
  const stillClosed = await page.$$(
    'button.MuiAccordionSummary-root[aria-expanded="false"]'
  );
  if (stillClosed.length > 0) {
    console.log(`Retrying ${stillClosed.length} closed accordions...`);
    for (const btn of stillClosed) {
      try {
        await btn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await btn.click({ force: true });
        await page.waitForTimeout(800);
      } catch (e) {
        /* skip */
      }
    }
  }
  await page.waitForTimeout(2000);

  // --- Extract text content ---
  console.log("Extracting content...");
  const content = await page.evaluate(() => {
    const main =
      document.querySelector("article") || document.querySelector("main");
    if (main) return main.innerText;
    return document.body.innerText;
  });

  // --- Setup output directories ---
  const outDir = path.join(__dirname, "questions", QUESTION_SLUG);
  const ssDir = path.join(outDir, "screenshots");
  fs.mkdirSync(ssDir, { recursive: true });

  // --- Save raw content ---
  fs.writeFileSync(
    path.join(outDir, `${QUESTION_SLUG}-raw-content.txt`),
    content,
    "utf8"
  );
  console.log(`Saved ${content.length} chars of raw content`);

  // --- Content verification ---
  const checks = {
    "Understand the Problem": content.includes("Understand the Problem"),
    "Functional Requirements": content.includes("Functional Requirements"),
    "Non-Functional Requirements": content.includes("Non-Functional"),
    "High-Level Design": content.includes("High-Level Design"),
    "Deep Dives":
      content.includes("Deep Dive") || content.includes("Potential Deep"),
    "What is Expected":
      content.includes("Expected") || content.includes("Mid-level"),
    "Accordion content (Approach)": content.includes("Approach"),
    "Accordion content (Challenges)":
      content.includes("Challenges") || content.includes("Challenge"),
  };
  console.log("\nContent verification:");
  let allPassed = true;
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
    if (!val) allPassed = false;
  }

  // --- Take screenshots ---
  console.log("\nTaking screenshots...");

  // Full-page screenshot
  await page.screenshot({
    path: path.join(ssDir, "full-page.png"),
    fullPage: true,
  });
  console.log("Full-page screenshot saved");

  // Section screenshots
  const pageHeight = await page.evaluate(
    () => document.documentElement.scrollHeight
  );
  await page.setViewportSize({ width: 1400, height: 900 });
  let idx = 1;
  for (let y = 0; y < pageHeight; y += 800) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(ssDir, `section-${String(idx).padStart(2, "0")}.png`),
    });
    idx++;
  }
  console.log(`Took ${idx - 1} section screenshots`);

  // --- Summary ---
  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Question: ${QUESTION_SLUG}`);
  console.log(`Content: ${content.length} chars`);
  console.log(`Screenshots: ${idx - 1} sections + 1 full-page`);
  console.log(`All checks passed: ${allPassed}`);
  console.log(`Output: ${outDir}`);

  await browser.close();
  console.log("Done!");
})();
```

---

## Question URL Reference

### Free Questions (16)

| #   | Question               | Slug                       | URL                                                                |
| --- | ---------------------- | -------------------------- | ------------------------------------------------------------------ |
| 1   | Bit.ly                 | `bitly`                    | `/learn/system-design/problem-breakdowns/bitly`                    |
| 2   | Dropbox                | `dropbox`                  | `/learn/system-design/problem-breakdowns/dropbox`                  |
| 3   | Local Delivery Service | `gopuff`                   | `/learn/system-design/problem-breakdowns/gopuff`                   |
| 4   | Ticketmaster           | `ticketmaster`             | `/learn/system-design/problem-breakdowns/ticketmaster`             |
| 5   | FB News Feed           | `fb-news-feed`             | `/learn/system-design/problem-breakdowns/fb-news-feed`             |
| 6   | Tinder                 | `tinder`                   | `/learn/system-design/problem-breakdowns/tinder`                   |
| 7   | LeetCode               | `leetcode`                 | `/learn/system-design/problem-breakdowns/leetcode`                 |
| 8   | WhatsApp               | `whatsapp`                 | `/learn/system-design/problem-breakdowns/whatsapp`                 |
| 9   | Rate Limiter           | `distributed-rate-limiter` | `/learn/system-design/problem-breakdowns/distributed-rate-limiter` |
| 10  | FB Live Comments       | `fb-live-comments`         | `/learn/system-design/problem-breakdowns/fb-live-comments`         |
| 11  | FB Post Search         | `fb-post-search`           | `/learn/system-design/problem-breakdowns/fb-post-search`           |
| 12  | YouTube Top K          | `top-k`                    | `/learn/system-design/problem-breakdowns/top-k`                    |
| 13  | Uber                   | `uber`                     | `/learn/system-design/problem-breakdowns/uber`                     |
| 14  | YouTube                | `youtube`                  | `/learn/system-design/problem-breakdowns/youtube`                  |
| 15  | Web Crawler            | `web-crawler`              | `/learn/system-design/problem-breakdowns/web-crawler`              |
| 16  | Ad Click Aggregator    | `ad-click-aggregator`      | `/learn/system-design/problem-breakdowns/ad-click-aggregator`      |

### Premium Questions (12)

| #   | Question               | Slug                 | URL                                                          |
| --- | ---------------------- | -------------------- | ------------------------------------------------------------ |
| 17  | News Aggregator        | `google-news`        | `/learn/system-design/problem-breakdowns/google-news`        |
| 18  | Yelp                   | `yelp`               | `/learn/system-design/problem-breakdowns/yelp`               |
| 19  | Strava                 | `strava`             | `/learn/system-design/problem-breakdowns/strava`             |
| 20  | Online Auction         | `online-auction`     | `/learn/system-design/problem-breakdowns/online-auction`     |
| 21  | Price Tracking Service | `camelcamelcamel`    | `/learn/system-design/problem-breakdowns/camelcamelcamel`    |
| 22  | Instagram              | `instagram`          | `/learn/system-design/problem-breakdowns/instagram`          |
| 23  | Robinhood              | `robinhood`          | `/learn/system-design/problem-breakdowns/robinhood`          |
| 24  | Google Docs            | `google-docs`        | `/learn/system-design/problem-breakdowns/google-docs`        |
| 25  | Distributed Cache      | `distributed-cache`  | `/learn/system-design/problem-breakdowns/distributed-cache`  |
| 26  | Job Scheduler          | `job-scheduler`      | `/learn/system-design/problem-breakdowns/job-scheduler`      |
| 27  | Payment System         | `payment-system`     | `/learn/system-design/problem-breakdowns/payment-system`     |
| 28  | Metrics Monitoring     | `metrics-monitoring` | `/learn/system-design/problem-breakdowns/metrics-monitoring` |

**Base URL:** `https://www.hellointerview.com`

---

## Step 5: Extract Diagrams

Hello Interview diagrams are **Excalidraw-exported SVGs** embedded via
`<object type="image/svg+xml">` elements. They are NOT regular `<img>` tags or
inline SVGs.

### DOM Structure

```
div.MuiBox-root[style*="cursor:pointer"]     <-- Clickable wrapper
  div.MuiGrid-root (container)
    div.MuiGrid-root (row - diagram area)
      div.relative.w-full
        button (zoom icon with 24x24 SVG)    <-- NOT the diagram
        span.w-full.h-full
          <object data="https://files.hellointerview.com/...svg"
                  type="image/svg+xml">       <-- THE ACTUAL DIAGRAM
    div.MuiGrid-root (row - caption)
      span.MuiTypography-caption              <-- Caption text
```

### Important: Scroll Container

The main content is inside a scroll container `main.flex-1` (not
`document.body`). You MUST scroll this container to trigger lazy rendering of
diagrams before extracting them:

```javascript
const mainContainer = await page.$("main.flex-1");
const scrollHeight = await mainContainer.evaluate((el) => el.scrollHeight);
for (let y = 0; y < scrollHeight; y += 400) {
  await mainContainer.evaluate((el, sy) => el.scrollTo(0, sy), y);
  await page.waitForTimeout(150);
}
await page.waitForTimeout(2000);
```

### 5a. Find Diagram Wrappers

```javascript
const wrappers = await page.$$('div.MuiBox-root[style*="cursor:pointer"]');
console.log(`Found ${wrappers.length} diagrams`);
```

### 5b. For Each Diagram: Screenshot + SVG Download

```javascript
for (let i = 0; i < wrappers.length; i++) {
  const wrapper = wrappers[i];
  await wrapper.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 1. Clipped PNG screenshot
  await wrapper.screenshot({ path: `diagram-${i + 1}.png` });

  // 2. Get SVG URL from <object> element
  const svgUrl = await wrapper.evaluate(
    (el) => el.querySelector("object")?.getAttribute("data") || ""
  );

  // 3. Download SVG
  if (svgUrl) {
    // Use https.get() or fetch to download from svgUrl
    // SVGs are hosted at files.hellointerview.com
  }

  // 4. Get caption
  const caption = await wrapper.evaluate(
    (el) => el.querySelector(".MuiTypography-caption")?.innerText?.trim() || ""
  );
}
```

### 5c. SVG Details

The downloaded SVGs are Excalidraw exports containing:

- Valid SVG with `<!-- svg-source:excalidraw -->` comment
- Embedded Excalidraw JSON payload in `<metadata>` (can be re-imported into
  Excalidraw for editing)
- Hand-drawn style fonts (Virgil) embedded as base64 woff2
- Typical sizes: 5KB-60KB per diagram

### 5d. Diagram Extraction Script

A ready-to-use script is available at
`hello-interview-extract/extract-diagrams.js`:

```bash
# Extract diagrams for any question
node extract-diagrams.js <slug> [url]

# Examples:
node extract-diagrams.js tinder
node extract-diagrams.js google-docs "https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs"
```

---

## Step 6: Output Structure (Updated)

For each question, create the following structure:

```
hello-interview-extract/
  questions/
    {question-slug}/
      {question-slug}-raw-content.txt    # Full extracted text
      {question-slug}-study-guide.md     # Formatted study guide
      screenshots/
        full-page.png                    # Full page with accordions expanded
        section-01.png                   # Scrolled section screenshots
        section-02.png
        ...
      diagrams/
        diagram-01.png                   # Clipped screenshot of diagram 1
        diagram-01.svg                   # Original Excalidraw SVG (vector, editable)
        diagram-02.png
        diagram-02.svg
        ...
        manifest.json                    # Index: { index, files, caption, context, svgUrl }
```

---

## Troubleshooting

### Chrome CDP won't connect

- Verify Chrome is running: `pgrep -l "Google Chrome"`
- Verify debug port: `curl -s http://localhost:9222/json/version`
- If not running, relaunch with the command in Step 1

### Session not logged in

- Check for "Shaik Manzil" in page text
- If missing, navigate to hellointerview.com in the debug Chrome and log in
  manually
- The debug profile is at `~/Library/Application Support/Google/Chrome-Debug`

### Accordions not expanding

- The selector is: `button.MuiAccordionSummary-root[aria-expanded="false"]`
- Must use `scrollIntoViewIfNeeded()` before clicking
- Must use `click({ force: true })`
- Wait at least 1000ms between clicks for content to render

### Content extraction returns sidebar only

- Use `document.querySelector('article') || document.querySelector('main')` to
  target main content
- If still getting sidebar, the page may not have finished rendering. Increase
  `waitForTimeout` to 8000ms.

### No diagrams found (0 wrappers)

- Accordions may not be expanded. Expand them first (Step 3b).
- The main scroll container (`main.flex-1`) must be scrolled through to trigger
  lazy rendering.
- Some pages (especially Behavioral) may genuinely have no diagrams.

### SVG download returns HTML instead of SVG

- The SVG URLs at `files.hellointerview.com` are public and don't require auth.
- If you get HTML back, the URL may be wrong. Check the `<object data="...">`
  attribute value.

### Diagram screenshots are blank or cut off

- Ensure `scrollIntoViewIfNeeded()` is called before `screenshot()`.
- Add `waitForTimeout(500)` after scrolling to allow rendering.

### Premium content showing paywall

- Session is not logged in. Log in to the debug Chrome instance.
- Verify with: page text should NOT contain "Get Premium" or "Upgrade To
  Practice"
