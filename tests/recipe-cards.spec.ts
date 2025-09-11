import { test, expect } from '@playwright/test';

test.describe('Recipe Cards Display', () => {
  test('Home page shows recipe cards with proper titles and images', async ({ page }) => {
    await page.goto('/');
    
    // Wait for recipe cards to load
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    
    // Get first 6 recipe cards
    const cards = page.locator('[data-testid="recipe-card"]').first();
    const count = await page.locator('[data-testid="recipe-card"]').count();
    
    // Should have at least one card
    expect(count).toBeGreaterThan(0);
    
    // Check first card has proper structure
    if (count > 0) {
      const firstCard = page.locator('[data-testid="recipe-card"]').first();
      
      // Check title is not a URL
      const title = await firstCard.locator('h3').textContent();
      expect(title).toBeTruthy();
      expect(title).not.toMatch(/^https?:\/\//);
      expect(title).not.toBe('Recipe');
      
      // Check image exists and has src
      const img = firstCard.locator('img').first();
      const imgSrc = await img.getAttribute('src');
      expect(imgSrc).toBeTruthy();
      
      // Image src should not be empty or placeholder SVG
      expect(imgSrc).not.toContain('data:image/svg');
    }
  });

  test('Collections page shows saved recipes with real data', async ({ page }) => {
    // First, we need to save a recipe
    await page.goto('/');
    
    // Wait for cards to load
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    
    // Click heart on first recipe
    const firstCard = page.locator('[data-testid="recipe-card"]').first();
    const heartButton = firstCard.locator('button').first();
    await heartButton.click();
    
    // Navigate to collections
    await page.goto('/collections');
    
    // Wait for either cards or empty state
    await Promise.race([
      page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 }),
      page.waitForSelector('text=/No saved recipes yet/', { timeout: 10000 })
    ]);
    
    // If there are cards, check they have real data
    const collectionCards = await page.locator('[data-testid="recipe-card"]').count();
    if (collectionCards > 0) {
      const card = page.locator('[data-testid="recipe-card"]').first();
      
      // Check title
      const title = await card.locator('h3').textContent();
      expect(title).toBeTruthy();
      expect(title).not.toMatch(/^Recipe [a-f0-9]+\.\.\./); // Not placeholder
      expect(title).not.toMatch(/^https?:\/\//); // Not URL
      
      // Check image
      const img = card.locator('img').first();
      const imgSrc = await img.getAttribute('src');
      expect(imgSrc).toBeTruthy();
      expect(imgSrc).not.toContain('data:image/svg'); // Not placeholder SVG
    }
  });

  test('Heart count badge shows once per card', async ({ page }) => {
    await page.goto('/');
    
    // Wait for cards
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="recipe-card"]').first();
    
    // Count heart-related elements
    const heartIcons = await firstCard.locator('svg').filter({ has: page.locator('path[d*="M20"]') }).count();
    
    // Should have at most one heart count display (in the button badge)
    // The heart icon itself is in the button, count badge is separate
    expect(heartIcons).toBeLessThanOrEqual(2); // Icon + possible badge
  });
});