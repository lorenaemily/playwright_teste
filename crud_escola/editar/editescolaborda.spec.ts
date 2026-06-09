import { test, expect } from '@playwright/test';

// ✅ URL padronizada para localhost:3000
const URL_LISTA = 'http://localhost:3000/lista_escolas';

async function abrirEdicao(page: any) {
    await page.goto(URL_LISTA);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Editar' }).first().click();
    await page.waitForURL('**/editEscola**', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
}

async function preencherCEP(page: any, cep: string) {
    const inputCep = page.locator('input').nth(1);
    await inputCep.clear();
    await inputCep.fill(cep);
    const botaoBuscar = page.getByRole('button', { name: 'Buscar' });
    await expect(botaoBuscar).toBeEnabled({ timeout: 5000 });
    await botaoBuscar.click();
    await page.waitForTimeout(2000);
}

async function verificarResultado(page: any, descricao: string) {
    await page.waitForTimeout(5000);
    const url = page.url();
    console.log(`[${descricao}] URL: ${url}`);

    const cadastrando = await page.getByText(/atualizando|salvando/i).isVisible().catch(() => false);
    if (cadastrando) {
        console.warn(`[FALHA] Sistema travou em "${descricao}"`);
        expect(false, `FALHA DE VALIDAÇÃO: sistema travou em "${descricao}"`).toBe(true);
    }

    if (url.includes('lista_escolas')) {
        console.warn(`[FALHA] Sistema aceitou dado inválido em "${descricao}"`);
        expect(false, `FALHA DE VALIDAÇÃO: sistema aceitou "${descricao}" e redirecionou`).toBe(true);
    }

    expect(url).toMatch(/editEscola/);
    console.log(`[OK] Sistema bloqueou: "${descricao}"`);
}


test('borda: nome com 1 caractere', async ({ page }) => {
    await abrirEdicao(page);

    await page.locator('input').nth(0).fill('A');
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('ponto teste');

    await page.getByRole('button', { name: 'ATUALIZAR ESCOLA' }).click();
    await verificarResultado(page, 'nome com 1 caractere');
});

test('borda: nome com 255 caracteres', async ({ page }) => {
    await abrirEdicao(page);

    await page.locator('input').nth(0).fill('A'.repeat(255));
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('ponto teste');

    await page.getByRole('button', { name: 'ATUALIZAR ESCOLA' }).click();
    await verificarResultado(page, 'nome com 255 caracteres');
});

test('borda: nome com caracteres especiais', async ({ page }) => {
    await abrirEdicao(page);

    await page.locator('input').nth(0).fill('@#$%¨&*()!');
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('ponto teste');

    await page.getByRole('button', { name: 'ATUALIZAR ESCOLA' }).click();
    await verificarResultado(page, 'nome com caracteres especiais');
});

test('borda: ponto de referência com espaços em branco', async ({ page }) => {
    await abrirEdicao(page);

    await page.locator('input').nth(0).fill('Escola Teste Borda');
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('   ');

    await page.getByRole('button', { name: 'ATUALIZAR ESCOLA' }).click();
    await verificarResultado(page, 'ponto de referência com espaços');
});