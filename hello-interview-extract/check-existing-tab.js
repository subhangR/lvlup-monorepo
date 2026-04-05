const { chromium } = require("playwright");
const path = require("path");

(async () => {
  console.log("Connecting to Chrome via CDP...");
  const browser = await chromium.connectOverCDP("http://localhost:9222");

  const contexts = browser.contexts();
  console.log(`Browser contexts: ${contexts.length}`);

  // List all existing pages/tabs
  for (let i = 0; i < contexts.length; i++) {
    const pages = contexts[i].pages();
    console.log(`\nContext ${i}: ${pages.length} pages`);
    for (let j = 0; j < pages.length; j++) {
      const p = pages[j];
      console.log(`  Page ${j}: ${p.url()}`);

      // Check if this page is on hellointerview
      if (p.url().includes("hellointerview")) {
        console.log("  >> Found Hello Interview tab!");
        const text = await p.evaluate(() => document.body.innerText.substring(0, 2000));
        const isLoggedIn = text.includes("Shaik") || text.includes("Dashboard");
        const hasPremium = text.includes("Premium Community") || text.includes("premium");
        console.log(`  >> Logged in: ${isLoggedIn}`);
        console.log(`  >> Premium: ${hasPremium}`);
        console.log(`  >> Snippet: ${text.substring(0, 300)}`);

        // Take screenshot of this tab
        await p.screenshot({ path: path.join(__dirname, "screenshots", "existing-tab.png") });
        console.log("  >> Screenshot saved");
      }
    }
  }

  await browser.close();
})();
