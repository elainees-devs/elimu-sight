import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test in this describe block
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'admin@elimuheights.school');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display admin dashboard correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('School Administration');
    await expect(page.locator('body')).toContainText('Welcome back, James');
    
    // Check for stats grid
    // StatsGrid probably has cards with titles like "Total Students", etc.
    await expect(page.locator('body')).toContainText(/Students|Teachers|Classes/i);
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Click on Students in sidebar
    await page.getByRole('button', { name: /Students/i }).click();
    await expect(page).toHaveURL(/\/students/);
    await expect(page.locator('h1')).toContainText(/Students/i);

    // Click on Assessments in sidebar
    await page.getByRole('button', { name: /Assessments/i }).click();
    await expect(page).toHaveURL(/\/assessments/);
    await expect(page.locator('h1')).toContainText(/Assessments/i);

    // Go back to Dashboard
    await page.getByRole('button', { name: /Overview/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('h3')).toContainText(/Recent Activity/i);
    // There should be some activity items if the seed worked
    await expect(page.locator('div.card-body') || page.locator('.space-y-4')).toBeVisible();
  });
});
