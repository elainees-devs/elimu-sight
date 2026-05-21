import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill the login form
    await page.fill('input[type="email"]', 'admin@elimuheights.school');
    await page.fill('input[type="password"]', 'admin123');
    
    // Submit the form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Should see user-specific content or dashboard header
    await expect(page.locator('header')).toContainText(/James Kariuki/i);
    await expect(page.locator('body')).toContainText(/Dashboard|Overview/i);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill the login form with wrong password
    await page.fill('input[type="email"]', 'admin@elimuheights.school');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');

    // Should show error message
    // Based on LoginForm.tsx, error message appears in a div with text
    await expect(page.locator('.bg-red-50')).toBeVisible();
    await expect(page.locator('.bg-red-50')).toContainText(/Invalid/i);
  });

  test('should allow user to log out', async ({ page }) => {
    // First log in
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'admin@elimuheights.school');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Click sign out button
    await page.getByRole('button', { name: /Sign out/i }).click();

    // Should redirect back to landing or login page
    await expect(page).toHaveURL(/\/(auth\/login)?$/);
  });
});
