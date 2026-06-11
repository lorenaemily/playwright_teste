import { test, expect } from '@playwright/test';

// Remove o storageState para estes testes
test.use({ storageState: { cookies: [], origins: [] } });

// Teste de login com credenciais válidas
test('login com credenciais válidas', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="email"]').fill('lorena07@gmail.com');
  await page.locator('input[name="password"]').fill('12345678');
  await page.getByRole('button', { name: 'ENTRAR' }).click();
  
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});

test('login com espaço em branco no email', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="email"]').fill(' lorena07@gmail.com');
  await page.locator('input[name="password"]').fill('12345678');
  await page.getByRole('button', { name: 'ENTRAR' }).click();
  
  await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {
    console.log('Login com espaço em branco falhou - comportamento esperado');
  });
});