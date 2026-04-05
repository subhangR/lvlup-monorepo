const { chromium } = require("playwright");

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");

  const contexts = browser.contexts();
  console.log(`Browser contexts: ${contexts.length}`);

  // Create a new page in the existing context
  const context = contexts[0] || (await browser.newContext());
  const page = await context.newPage();

  console.log("Navigating to Hello Interview...");
  await page.goto("https://www.hellointerview.com/learn/system-design/problem-breakdowns/tinder", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForTimeout(5000);

  // Check if logged in by looking for user name or premium badge
  const pageText = await page.evaluate(() => document.body.innerText.substring(0, 2000));

  const isLoggedIn =
    pageText.includes("Shaik") ||
    pageText.includes("Premium") ||
    pageText.includes("Your Dashboard");
  const isPremium = pageText.includes("Premium") || pageText.includes("Get Premium") === false;

  console.log(`Logged in: ${isLoggedIn}`);
  console.log(`Has premium indicators: ${isPremium}`);
  console.log(`Page snippet: ${pageText.substring(0, 500)}`);

  // Try a premium-locked page
  console.log("\nTesting premium-locked page (Google Docs)...");
  await page.goto(
    "https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs",
    {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    }
  );
  await page.waitForTimeout(3000);

  const lockedText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  const hasContent =
    lockedText.includes("Understand the Problem") || lockedText.includes("Functional Requirements");
  const isLocked =
    lockedText.includes("locked") ||
    lockedText.includes("upgrade") ||
    lockedText.includes("Get Premium") ||
    lockedText.includes("subscribe");

  console.log(`Premium page has content: ${hasContent}`);
  console.log(`Shows locked/upgrade: ${isLocked}`);
  console.log(`Page snippet: ${lockedText.substring(0, 500)}`);

  await browser.close();
  console.log("\nDone!");
})();
