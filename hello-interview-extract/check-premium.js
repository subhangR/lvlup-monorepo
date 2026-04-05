const { chromium } = require("playwright");
const path = require("path");

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0] || (await browser.newContext());
  const page = await context.newPage();

  // Navigate to a premium-locked question
  console.log("Navigating to Google Docs (premium-locked)...");
  await page.goto(
    "https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs",
    {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    }
  );
  await page.waitForTimeout(8000);

  // Take screenshot to see what's showing
  await page.screenshot({
    path: path.join(__dirname, "screenshots", "premium-check.png"),
    fullPage: true,
  });
  console.log("Screenshot saved");

  // Get ALL text from the page
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log(`\nFull page text length: ${fullText.length} chars`);

  // Check for key indicators
  const checks = {
    "Shaik Manzil": fullText.includes("Shaik"),
    "Premium badge": fullText.includes("Premium Community"),
    "Get Premium prompt": fullText.includes("Get Premium"),
    "Upgrade prompt": fullText.includes("Upgrade") || fullText.includes("upgrade"),
    "Locked content": fullText.includes("locked") || fullText.includes("Locked"),
    Subscribe: fullText.includes("Subscribe") || fullText.includes("subscribe"),
    "Has Google Docs title": fullText.includes("Google Docs"),
    "Has Understand the Problem": fullText.includes("Understand the Problem"),
    "Has Functional Requirements": fullText.includes("Functional Requirements"),
    "Has Deep Dive": fullText.includes("Deep Dive") || fullText.includes("Potential Deep"),
    "Sign in prompt": fullText.includes("Sign in") || fullText.includes("Login"),
  };

  console.log("\nContent checks:");
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
  }

  // Show first 1000 chars of main content (not sidebar)
  const mainText = await page.evaluate(() => {
    const main = document.querySelector("article") || document.querySelector("main");
    return main ? main.innerText.substring(0, 1500) : "NO MAIN ELEMENT FOUND";
  });
  console.log(`\nMain content preview:\n${mainText.substring(0, 1000)}`);

  await browser.close();
})();
