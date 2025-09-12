import { test, expect } from "@playwright/test";

test.describe("SafeImage Component", () => {
  test("recipe card renders image or fallback", async ({ page }) => {
    // Navigate to the home page which should have recipe cards
    await page.goto("/");

    // Wait for recipe cards to load
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });

    // Check if the first recipe card has an image or fallback
    const firstCard = page.locator('[data-testid="recipe-card"]').first();

    // Should have either an img element or a fallback div
    const hasImage = (await firstCard.locator("img").count()) > 0;
    const hasFallback = (await firstCard.locator('div:has-text("Recipe Image")').count()) > 0;

    expect(hasImage || hasFallback).toBe(true);

    // If it has an image, it should have a non-empty src
    if (hasImage) {
      const img = firstCard.locator("img").first();
      const src = await img.getAttribute("src");
      expect(src).toBeTruthy();
      expect(src).not.toBe("");
    }
  });

  test("recipe hero renders image with proper alt text", async ({ page }) => {
    // Navigate to a recipe page
    await page.goto("/");

    // Wait for recipe cards and click the first one
    await page.waitForSelector('[data-testid="recipe-card"] a', { timeout: 10000 });
    await page.locator('[data-testid="recipe-card"] a').first().click();

    // Wait for recipe page to load
    await page.waitForLoadState("networkidle");

    // Check if hero image is present
    const heroSection = page.locator('[data-testid="recipe-hero"]');
    if ((await heroSection.count()) > 0) {
      const heroImage = heroSection.locator("img").first();
      if ((await heroImage.count()) > 0) {
        const alt = await heroImage.getAttribute("alt");
        expect(alt).toBeTruthy();
        expect(alt).not.toBe("");
      }
    }
  });
});
