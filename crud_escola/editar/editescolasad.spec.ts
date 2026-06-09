import { test, expect } from '@playwright/test';

test('não deve editar escola com campos vazios', async ({ page }) => {
    await page.goto('http://localhost:3000/lista_escolas');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Editar' }).first().click();
    await page.waitForURL('**/editEscola**', { timeout: 15000 });

    await expect(page.getByRole('button', { name: 'Atualizar Escola' }))
        .toBeVisible({ timeout: 15000 });

    await page.locator('input').nth(0).fill('');

    await page.locator('input').nth(1).fill('');

    await page.locator('input').nth(2).fill('');

    await page.locator('input[name="address"]').fill('');

    await page.getByRole('button', { name: 'Atualizar Escola' }).click();

    await expect(page).toHaveURL(/editEscola/, { timeout: 10000 });

});


test('não deve editar escola com CEP inválido', async ({ page }) => {
    await page.goto('http://localhost:3000/lista_escolas');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Editar' }).first().click();
    await page.waitForURL('**/editEscola**', { timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Atualizar Escola' }))
        .toBeVisible({ timeout: 15000 });

    await page.locator('input').nth(0).fill('escola teste');
    await page.locator('input').nth(1).fill('00000-000');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.waitForTimeout(1500);
    await page.locator('input').nth(2).fill('ponto de referência teste');

    await page.getByRole('button', { name: 'Atualizar Escola' }).click();

    await expect(
        page.getByText('O CEP nao pode ser composto apenas por zeros.')
    ).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(/editEscola/, { timeout: 5000 });
});