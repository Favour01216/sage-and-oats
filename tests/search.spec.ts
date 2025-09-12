import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("search filters change results", async ({ page }) => {
    // Navigate to search page
    await page.goto("/search");

    // Wait for initial results
    await page.waitForSelector('[data-testid="recipe-card"]');
    const initialResults = await page.locator('[data-testid="recipe-card"]').count();

    // Apply a filter (e.g., vegan tag)
    await page.click('[data-testid="filter-vegan"]');

    // Wait for filtered results
    await page.waitForTimeout(1000); // Wait for Algolia to update

    // Verify results changed
    const filteredResults = await page.locator('[data-testid="recipe-card"]').count();
    expect(filteredResults).toBeLessThanOrEqual(initialResults);

    // Verify all results have vegan tag
    const recipeTags = await page
      .locator('[data-testid="recipe-card"] [data-testid="tag-vegan"]')
      .count();
    expect(recipeTags).toBe(filteredResults);

    // Test time filter
    await page.fill('[data-testid="time-filter-max"]', "30");
    await page.waitForTimeout(1000);

    // Verify results are filtered by time
    const timeFilteredResults = await page.locator('[data-testid="recipe-card"]').count();
    expect(timeFilteredResults).toBeLessThanOrEqual(filteredResults);
  });

  test("search query returns relevant results", async ({ page }) => {
    // Navigate to search page
    await page.goto("/search");

    // Enter search query
    await page.fill('[data-testid="search-input"]', "chicken");
    await page.press('[data-testid="search-input"]', "Enter");

    // Wait for results
    await page.waitForTimeout(1000);

    // Verify results contain search term
    const results = await page.locator('[data-testid="recipe-card"]').count();
    expect(results).toBeGreaterThan(0);

    // Check that at least one result contains "chicken" in title
    const titles = await page.locator('[data-testid="recipe-title"]').allTextContents();
    const hasChicken = titles.some(title => title.toLowerCase().includes("chicken"));
    expect(hasChicken).toBeTruthy();
  });
});
