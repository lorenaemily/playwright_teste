import { test, expect } from '@playwright/test';

test('excluir escola', async ({ page }) => {

  await page.goto('http://localhost:3000/lista_escolas');

  await page.waitForLoadState('networkidle');

  // pega o nome da primeira escola
  const nomeEscola = await page
    .locator('table tbody tr')
    .first()
    .locator('td')
    .nth(0)
    .textContent();

  // aceita alerta
  page.once('dialog', async dialog => {
    await dialog.accept();
  });

  // exclui
  await page.getByRole('button', {
    name: 'Excluir'
  }).first().click();

  // verifica que o nome sumiu
  await expect(
    page.getByText(nomeEscola || '')
  ).not.toBeVisible();

});