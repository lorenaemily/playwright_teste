import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('login com excesso de caracteres', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input[name="email"]').fill('kndsdknvojwobwibfjbsnjksbjkcbxjkxbvkcbkbjbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb@bbbbbbbbbbbbbbbbbb');
  await page.locator('input[name="password"]').fill('111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');

  // Clica no botão de login
  await page.getByRole('button', { name: 'ENTRAR' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // Verifica que continua na página de login (não redirecionou)
  await expect(page).toHaveURL(/login/);
});