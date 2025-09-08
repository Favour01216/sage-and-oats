import { test, expect } from '@playwright/test';

test.describe('Hearts System', () => {
  test('anonymous heart persists after reload', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Wait for recipes to load
    await page.waitForSelector('[data-testid="recipe-card"]');
    
    // Click heart button on first recipe
    const heartButton = page.locator('[data-testid="heart-button"]').first();
    const initialCount = await heartButton.locator('[data-testid="heart-count"]').textContent();
    await heartButton.click();
    
    // Verify heart count increased
    await expect(heartButton.locator('[data-testid="heart-count"]')).toHaveText(String(Number(initialCount) + 1));
    
    // Reload page
    await page.reload();
    
    // Verify heart persists
    await page.waitForSelector('[data-testid="recipe-card"]');
    const reloadedHeartButton = page.locator('[data-testid="heart-button"]').first();
    await expect(reloadedHeartButton.locator('[data-testid="heart-count"]')).toHaveText(String(Number(initialCount) + 1));
  });

  test('merge hearts after sign-in', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Add anonymous heart
    await page.waitForSelector('[data-testid="recipe-card"]');
    const heartButton = page.locator('[data-testid="heart-button"]').first();
    await heartButton.click();
    
    // Navigate to account page
    await page.goto('/account');
    
    // Sign in (mock auth for testing)
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="sign-in-button"]');
    
    // Wait for redirect back to home
    await page.waitForURL('/');
    
    // Verify hearts are merged (heart button should still show as hearted)
    const mergedHeartButton = page.locator('[data-testid="heart-button"]').first();
    await expect(mergedHeartButton).toHaveAttribute('data-hearted', 'true');
  });
});
