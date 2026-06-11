import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('login com credenciais inválidas', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="email"]').fill('usernexistente@gmail.com');
  await page.locator('input[name="password"]').fill('12345678');
  await page.getByRole('button', { name: 'ENTRAR' }).click();
  
  await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
});

test('login com campos vazios', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="email"]').fill('');
  await page.locator('input[name="password"]').fill('');
  await page.getByRole('button', { name: 'ENTRAR' }).click();
  
  await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
});