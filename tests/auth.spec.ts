import { test, expect } from '@playwright/test';

//This test is disabled as the auth is handled by Clerk
test.skip('User can sign in with Clerk', async ({ page }) => {
  await page.goto('/');

  // Click on "Sign In" button
  await page.click('text=Sign In');

  // Clerk login modal
  await page.fill('input[type="email"]', 'testuser@example.com');
  await page.fill('input[type="password"]', 'testpassword');
  await page.click('button:has-text("Sign in")');

  // Check if redirected to dashboard
  await page.waitForURL('/dashboard');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome, testuser')).toBeVisible();
});
