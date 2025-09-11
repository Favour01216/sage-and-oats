const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const BASE = process.env.PROD_URL || process.argv[2];
  if (!BASE) throw new Error("Provide PROD_URL env or pass it as an arg");

  const outDir = path.join(__dirname, "..", "images");
  fs.mkdirSync(outDir, { recursive: true });

  const routes = [
    { path: "/", name: "home" },
    { path: "/search?q=chicken", name: "search" },
    { path: "/my-collection", name: "collection" },
    // Add a real recipe slug if you know it:
    // { path: "/recipe/<your-slug>", name: "recipe" },
  ];

  const browser = await chromium.launch();
  const page = await browser.newPage({
    deviceScaleFactor: 2,
    viewport: { width: 1440, height: 900 },
  });

  for (const r of routes) {
    const url = `${BASE}${r.path}`;
    console.log("Screenshot:", url);
    await page.goto(url, { waitUntil: "networkidle" });
    // Wait for cards/hero to be ready (if present)
    await page.waitForTimeout(800);
    const file = path.join(outDir, `${r.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
  }

  await browser.close();
  console.log("Screenshots saved to /images");
})();
