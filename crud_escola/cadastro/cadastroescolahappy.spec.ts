import { test, expect } from '@playwright/test';

test('cadastrar escola com dados válidos', async ({ page }) => {

  const timestamp = Date.now();

  await page.goto('http://localhost:3000/lista_escolas');

  await page.getByRole('button', {
    name: 'Cadastrar escola'
  }).click();

  await page.waitForURL('**/cadastro_escola');

  const inputs = page.locator('input');

  await inputs.nth(0).fill(`Escola ${timestamp}`);

  await inputs.nth(1).fill('62910-000');

  // NÃO usa buscar CEP
  await inputs.nth(2).fill('Próximo ao louro');

  await inputs.nth(3).fill('Palhano Ceará');

  await page.getByRole('button', {
    name: 'Cadastrar Escola'
  }).click();

  await page.waitForURL('**/lista_escolas', {
  timeout: 150000
});

});