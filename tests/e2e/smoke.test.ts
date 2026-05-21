import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero section heading
    await expect(page.locator('h1')).toContainText('Transform School Operations');
    
    // Check for CTA buttons
    await expect(page.locator('header').getByRole('button', { name: /Sign In/i })).toBeVisible();
    await expect(page.locator('main').getByRole('button', { name: /Get Started/i })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('header').getByRole('button', { name: /Sign In/i }).click();
    
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('h2')).toContainText(/Sign in/i);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('main').getByRole('button', { name: /Get Started Free/i }).click();
    
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.locator('h2')).toContainText(/Create an account/i);
  });
});
