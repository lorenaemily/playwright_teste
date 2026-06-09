import { test, expect } from '@playwright/test';

test('editar escola com dados válidos', async ({ page }) => {
  await page.goto('http://localhost:3000/lista_escolas');
  await page.waitForLoadState('networkidle');
  
  await page.getByRole('button', { name: 'Editar' }).first().click();
  await page.waitForURL('**/editEscola**', { timeout: 15000 });
  
  await expect(page.getByRole('button', { name: 'Atualizar Escola' })).toBeVisible({ timeout: 15000 });
  
  const inputs = await page.locator('input').all();
  
  await inputs[0].fill('Escola mateus editada');
  await inputs[2].fill('proximo a minha casa');  
  
  await page.getByRole('button', { name: 'Atualizar Escola' }).click();
  await page.waitForURL('**/lista_escolas', { timeout: 30000 });
});