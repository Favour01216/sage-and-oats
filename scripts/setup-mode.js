#!/usr/bin/env node

/**
 * Setup script to configure the app for different source modes
 * Usage:
 *   node scripts/setup-mode.js live     # Switch to LIVE mode with mock API
 *   node scripts/setup-mode.js mirror   # Switch to MIRROR mode with Supabase
 */

const fs = require("fs");
const path = require("path");

const mode = process.argv[2];
const envFile = path.join(__dirname, "..", ".env.local");

if (!mode || !["live", "mirror"].includes(mode)) {
  console.error("Usage: node scripts/setup-mode.js [live|mirror]");
  process.exit(1);
}

// Read existing .env.local or create empty object
const envVars = {};
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf-8");
  envContent.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  });
}

if (mode === "live") {
  console.log("🚀 Configuring LIVE mode with mock external API...");
  envVars["NEXT_PUBLIC_SOURCE_MODE"] = "live";
  envVars["EXTERNAL_API_BASE_URL"] = "http://localhost:3000/api/mock-external";
  envVars["EXTERNAL_API_KEY"] = "mock-api-key";

  console.log("✅ LIVE mode configured!");
  console.log("   - Source: External API (mock)");
  console.log("   - Mock API URL: http://localhost:3000/api/mock-external");
  console.log("   - Search page will use useExternalSearch hook");
  console.log("   - Recipe pages will fetch from mock API");
} else {
  console.log("🏠 Configuring MIRROR mode with Supabase...");
  envVars["NEXT_PUBLIC_SOURCE_MODE"] = "mirror";
  // Remove external API vars
  delete envVars["EXTERNAL_API_BASE_URL"];
  delete envVars["EXTERNAL_API_KEY"];

  console.log("✅ MIRROR mode configured!");
  console.log("   - Source: Supabase + Algolia");
  console.log("   - Search page will use InstantSearch");
  console.log("   - Recipe pages will fetch from Supabase");
}

// Write updated .env.local
const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

fs.writeFileSync(envFile, envContent);

console.log(`\n📝 Updated .env.local with SOURCE_MODE=${mode}`);
console.log("🔄 Restart your dev server to apply changes: npm run dev");
