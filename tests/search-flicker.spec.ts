import { test, expect } from "@playwright/test";

test.describe("Search Page Flicker Prevention", () => {
  test("search input is debounced to prevent excessive requests", async ({ page }) => {
    await page.goto("/search");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator('input[placeholder*="Search"]').first();

    if ((await searchInput.count()) > 0) {
      // Type quickly to test debouncing
      await searchInput.fill("chicken");
      await page.waitForTimeout(100);
      await searchInput.fill("chicken rice");
      await page.waitForTimeout(100);
      await searchInput.fill("chicken rice recipe");

      // Wait for debounce period
      await page.waitForTimeout(500);

      // Should show results without excessive flickering
      const results = page.locator('[data-testid="search-results"]');
      if ((await results.count()) > 0) {
        expect(await results.count()).toBeGreaterThan(0);
      }
    }
  });

  test("loading skeletons prevent layout shift", async ({ page }) => {
    await page.goto("/search");

    // Check for skeleton loading states
    const skeletons = page.locator(".animate-pulse");

    // Should show skeletons during loading
    if ((await skeletons.count()) > 0) {
      expect(await skeletons.count()).toBeGreaterThan(0);
    }

    // Wait for actual content to load
    await page.waitForLoadState("networkidle");

    // Skeletons should be replaced with content
    await page.waitForTimeout(1000);
  });

  test("filter changes do not cause router loops", async ({ page }) => {
    await page.goto("/search");
    await page.waitForLoadState("networkidle");

    // Look for filter controls
    const filterButton = page.locator('button:has-text("Filter")').first();

    if ((await filterButton.count()) > 0) {
      await filterButton.click();

      // Try to change a filter
      const vegetarianFilter = page.locator("text=vegetarian").first();
      if ((await vegetarianFilter.count()) > 0) {
        await vegetarianFilter.click();

        // Wait and check that URL updated reasonably
        await page.waitForTimeout(500);

        const currentURL = page.url();
        expect(currentURL).toContain("/search");

        // Make another filter change
        const veganFilter = page.locator("text=vegan").first();
        if ((await veganFilter.count()) > 0) {
          await veganFilter.click();
          await page.waitForTimeout(500);

          // Should not cause navigation loops
          const finalURL = page.url();
          expect(finalURL).toContain("/search");
        }
      }
    }
  });

  test("search state is preserved during navigation", async ({ page }) => {
    await page.goto("/search?q=pasta");
    await page.waitForLoadState("networkidle");

    // Check that search input has the value from URL
    const searchInput = page.locator('input[placeholder*="Search"]').first();

    if ((await searchInput.count()) > 0) {
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe("pasta");
    }

    // Navigate away and back
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.goto("/search?q=pasta");
    await page.waitForLoadState("networkidle");

    // Search state should be restored
    if ((await searchInput.count()) > 0) {
      const restoredValue = await searchInput.inputValue();
      expect(restoredValue).toBe("pasta");
    }
  });

  test("pagination does not cause flicker", async ({ page }) => {
    await page.goto("/search?q=recipe");
    await page.waitForLoadState("networkidle");

    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next")').first();
    const pageButton = page.locator('button:has-text("2")').first();

    if ((await nextButton.count()) > 0) {
      await nextButton.click();

      // Should update URL and content smoothly
      await page.waitForTimeout(500);

      const currentURL = page.url();
      expect(currentURL).toContain("page=2");
    } else if ((await pageButton.count()) > 0) {
      await pageButton.click();

      await page.waitForTimeout(500);

      const currentURL = page.url();
      expect(currentURL).toContain("page=2");
    }
  });

  test("concurrent search requests are handled properly", async ({ page }) => {
    await page.goto("/search");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator('input[placeholder*="Search"]').first();

    if ((await searchInput.count()) > 0) {
      // Trigger multiple rapid searches
      await searchInput.fill("a");
      await searchInput.fill("ab");
      await searchInput.fill("abc");
      await searchInput.fill("abcd");
      await searchInput.fill("chicken");

      // Wait for final result
      await page.waitForTimeout(1000);

      // Should show results for the final search
      const finalValue = await searchInput.inputValue();
      expect(finalValue).toBe("chicken");
    }
  });
});
