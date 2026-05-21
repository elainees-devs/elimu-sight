import { test, expect } from '@playwright/test';

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    // Log in
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'admin@elimuheights.school');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Go to Students
    await page.getByRole('button', { name: /Students/i }).click();
    await expect(page).toHaveURL(/\/students/);
  });

  test('should display student list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Students');
    // Check if table or empty state is visible
    const table = page.locator('table');
    const emptyState = page.locator('text=No students found');
    await expect(table.or(emptyState)).toBeVisible();
  });

  test('should open new student modal', async ({ page }) => {
    await page.getByRole('button', { name: /New Student/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText(/New Student/i);
    
    // Check form fields
    await expect(page.locator('label', { hasText: 'Full Name' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Gender' })).toBeVisible();
  });

  test('should create a new student', async ({ page }) => {
    await page.getByRole('button', { name: /New Student/i }).click();
    
    // Fill the form
    await page.fill('input[name="fullName"]', 'Test Student');
    await page.selectOption('select[name="gender"]', 'Male');
    await page.fill('input[name="dateOfBirth"]', '2010-01-01');
    await page.fill('input[name="guardianName"]', 'Test Guardian');
    await page.fill('input[name="guardianPhone"]', '+254700000000');
    
    // Submit
    await page.click('button:has-text("Save")');
    
    // Modal should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Should see success message or new row in table
    // (Depending on how the UI handles success, it might show a toast or just update table)
    await expect(page.locator('table')).toContainText('Test Student');
  });
});
