import { test, expect } from '@playwright/test';

test('User can create a new project', async ({ page }) => {
  await page.goto('/dashboard');

  // Click "New Project"
  await page.click('button:has-text("New Project")');

  // Fill project details
  await page.fill('input[name="title"]', 'Test Project');
  await page.click('button:has-text("Create")');

  // Check if project appears
  await expect(page.locator('text=Test Project')).toBeVisible();
});
