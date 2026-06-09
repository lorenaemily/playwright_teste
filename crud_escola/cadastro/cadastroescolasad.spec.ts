import { test, expect } from '@playwright/test';

test('não deve cadastrar escola com cep inválido', async ({ page }) => {
  await page.goto('http://localhost:3000/lista_escolas');
  await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();
  await page.goto('http://localhost:3000/cadastro_escola');
  await page.getByRole('button', { name: 'Cadastrar Escola' }).click();

  await page.getByRole('textbox', { name: 'Ex: Escola Municipal João' }).fill('escola joão barbosa');
  await page.getByRole('textbox', { name: 'Ex: 58000-' }).fill('00000-0000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('textbox', { name: 'Ex: Próximo à praça central' }).fill('teste sad');
  await page.getByRole('button', { name: 'Cadastrar Escola' }).click();
  await page.waitForURL('**/cadastro_escola', { timeout: 15000 });
});

test('não deve cadastrar escola com campos obrigatórios vazios', async ({ page }) => {
  await page.goto('http://localhost:3000/lista_escolas');
  await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();
  await page.goto('http://localhost:3000/cadastro_escola');
  await page.getByRole('button', { name: 'Cadastrar Escola' }).click();

  await page.getByRole('textbox', { name: 'Ex: Escola Municipal João' }).fill(' ');
  await page.getByRole('textbox', { name: 'Ex: 58000-' }).fill('62910-000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('textbox', { name: 'Ex: Próximo à praça central' }).fill('teste sad');
  await page.getByRole('button', { name: 'Cadastrar Escola' }).click();
  await page.waitForURL('**/cadastro_escola', { timeout: 15000 });
});

test('não deve cadastrar escola com endereço vazio', async ({ page }) => {
  await page.goto('http://localhost:3000/lista_escolas');
  await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();
  await page.goto('http://localhost:3000/cadastro_escola');
  await page.getByRole('button', { name: 'Cadastrar Escola' }).click();

  await page.getByRole('textbox', { name: 'Ex: Escola Municipal João' }).fill('escola joão barbosa');
  await page.getByRole('textbox', { name: 'Ex: 58000-' }).fill('62910-000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('textbox', { name: 'Preenchido automaticamente pelo CEP' }).fill('');
  await page.getByRole('textbox', { name: 'Ex: Próximo à praça central' }).fill('teste sad');
  await page.getByRole('button', { name: 'Cadastrar Escola' }).click();
  await page.waitForURL('**/cadastro_escola', { timeout: 15000 });
});