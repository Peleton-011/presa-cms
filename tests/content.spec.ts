import { test, expect } from '@playwright/test';

test('User can create and edit Markdown content', async ({ page }) => {
  await page.goto('/project/test-project');

  // Click "New Content"
  await page.click('button:has-text("New Content")');

  // Fill Markdown editor
  await page.fill('.editor textarea', '# Hello World\nThis is a test.');
  await page.click('button:has-text("Save")');

  // Verify saved content
  await expect(page.locator('.content-preview')).toContainText('Hello World');
});
