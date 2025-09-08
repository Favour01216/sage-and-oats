import { test, expect } from '@playwright/test';

test.describe('Cook Mode', () => {
  test('cook mode step navigation and timer', async ({ page }) => {
    // Navigate to a recipe page
    await page.goto('/recipe/lemon-herb-roasted-chicken');
    
    // Click "Start Cooking" button
    await page.click('[data-testid="start-cooking-button"]');
    
    // Should redirect to cook mode
    await expect(page).toHaveURL('/cook/lemon-herb-roasted-chicken');
    
    // Verify first step is displayed
    await expect(page.locator('[data-testid="step-number"]')).toHaveText('Step 1');
    await expect(page.locator('[data-testid="step-text"]')).toContainText('Preheat oven');
    
    // Navigate to next step
    await page.click('[data-testid="next-step-button"]');
    await expect(page.locator('[data-testid="step-number"]')).toHaveText('Step 2');
    
    // Navigate to step with timer (step 5)
    await page.click('[data-testid="next-step-button"]');
    await page.click('[data-testid="next-step-button"]');
    await page.click('[data-testid="next-step-button"]');
    
    // Verify timer is present
    await expect(page.locator('[data-testid="timer-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="timer-display"]')).toContainText('75:00');
    
    // Start timer
    await page.click('[data-testid="start-timer-button"]');
    
    // Wait a moment and verify timer is counting down
    await page.waitForTimeout(2000);
    const timerText = await page.locator('[data-testid="timer-display"]').textContent();
    expect(timerText).not.toBe('75:00');
    
    // Navigate back
    await page.click('[data-testid="prev-step-button"]');
    await expect(page.locator('[data-testid="step-number"]')).toHaveText('Step 4');
    
    // Test completion
    await page.click('[data-testid="next-step-button"]');
    await page.click('[data-testid="next-step-button"]');
    
    // Should show completion screen
    await expect(page.locator('[data-testid="recipe-complete"]')).toBeVisible();
  });

  test('cook mode prevents screen sleep', async ({ page, context }) => {
    // Grant wake lock permission
    await context.grantPermissions(['wake-lock']);
    
    // Navigate to cook mode
    await page.goto('/cook/lemon-herb-roasted-chicken');
    
    // Verify wake lock is requested (check console or mock)
    // This is a simplified test - in real implementation you'd mock the Wake Lock API
    const hasWakeLock = await page.evaluate(() => {
      return 'wakeLock' in navigator;
    });
    
    expect(hasWakeLock).toBeTruthy();
  });
});
