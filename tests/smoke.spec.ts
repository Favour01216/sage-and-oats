import { test, expect } from '@playwright/test';

test('smoke test - app loads', async ({ page }) => {
  // Just verify the app can start and load
  await page.goto('/');
  
  // Wait for any element that indicates the app loaded
  await expect(page).toHaveTitle(/Sage/i);
  
  // Check that some basic content is visible
  const body = page.locator('body');
  await expect(body).toBeVisible();
});