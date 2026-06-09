import { test, expect } from '@playwright/test';

const URL_CADASTRO = 'http://localhost:3000/cadastro_escola';

async function preencherCEP(page: any, cep: string) {
    const inputCep = page.locator('input').nth(1);
    await inputCep.fill(cep);
    const botaoBuscar = page.getByRole('button', { name: 'Buscar' });
    await expect(botaoBuscar).toBeEnabled({ timeout: 5000 });
    await botaoBuscar.click();
    await page.waitForTimeout(2000);
}

    //#teste

test('borda: nome da escola com 1 caractere', async ({ page }) => {
    await page.goto(URL_CADASTRO);
    await page.waitForLoadState('networkidle');

    await page.locator('input').nth(0).fill('A');
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('ponto teste');

    await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();


    await page.waitForTimeout(7000);

    const url = page.url();
    console.log(`[1 CHAR] URL: ${url}`);

    if (url.includes('lista_escolas')) {
        // Sistema aceitou — bug de validação
        console.warn('[FALHA DE VALIDAÇÃO] Sistema aceitou nome com 1 caractere');
        expect(false, 'FALHA DE VALIDAÇÃO: sistema aceitou nome com apenas 1 caractere').toBe(true);
    } else {
        // Verificou se ficou travado no "CADASTRANDO..."
        const cadastrando = await page.getByText(/cadastrando/i).isVisible().catch(() => false);
        if (cadastrando) {
            console.warn('[FALHA DE VALIDAÇÃO] Sistema ficou travado em "Cadastrando..." com nome de 1 caractere');
            expect(false, 'FALHA DE VALIDAÇÃO: sistema travou com nome de 1 caractere — sem validação mínima').toBe(true);
        }
        console.log('[OK] Sistema bloqueou nome com 1 caractere.');
    }
});

test('borda: nome da escola com 255 caracteres', async ({ page }) => {
    await page.goto(URL_CADASTRO);
    await page.waitForLoadState('networkidle');

    await page.locator('input').nth(0).fill('A'.repeat(255));
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('ponto teste');

    await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();
    await page.waitForTimeout(5000);

    const url = page.url();
    console.log(`[255 CHARS] URL: ${url}`);

    const cadastrando = await page.getByText(/cadastrando/i).isVisible().catch(() => false);
    if (cadastrando) {
        console.warn('[FALHA DE VALIDAÇÃO] Sistema travou com nome de 255 caracteres');
        expect(false, 'FALHA DE VALIDAÇÃO: sistema travou com nome de 255 caracteres').toBe(true);
    }
    expect(url, 'Sistema aceitou nome com 255 caracteres').toMatch(/cadastro_escola/);
});

test('borda: nome com caracteres especiais', async ({ page }) => {
    await page.goto(URL_CADASTRO);
    await page.waitForLoadState('networkidle');

    await page.locator('input').nth(0).fill('@#$%¨&*()!');
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('ponto teste');

    await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();
    await page.waitForTimeout(5000);

    const url = page.url();
    console.log(`[CARACTERES ESPECIAIS] URL: ${url}`);

    const cadastrando = await page.getByText(/cadastrando/i).isVisible().catch(() => false);
    if (cadastrando) {
        console.warn('[FALHA DE VALIDAÇÃO] Sistema travou com caracteres especiais');
        expect(false, 'FALHA DE VALIDAÇÃO: sistema travou com caracteres especiais no nome').toBe(true);
    }
    expect(url, 'Sistema aceitou nome com caracteres especiais').toMatch(/cadastro_escola/);
});

test('borda: ponto de referência com espaços em branco', async ({ page }) => {
    await page.goto(URL_CADASTRO);
    await page.waitForLoadState('networkidle');

    await page.locator('input').nth(0).fill('Escola Teste Borda');
    await preencherCEP(page, '62910-000');
    await page.locator('input').nth(2).fill('   ');


    await page.getByRole('button', { name: 'CADASTRAR ESCOLA' }).click();
    await page.waitForTimeout(6000);

    const url = page.url();
    console.log(`[ESPAÇOS EM BRANCO] URL: ${url}`);

    const cadastrando = await page.getByText(/cadastrando/i).isVisible().catch(() => false);
    if (cadastrando) {
        console.warn('[FALHA DE VALIDAÇÃO] Sistema travou com espaços em branco');
        expect(false, 'FALHA DE VALIDAÇÃO: sistema aceitou ponto de referência com apenas espaços').toBe(true);
    }
    expect(url, 'Sistema aceitou espaços em branco no ponto de referência').toMatch(/cadastro_escola/);
});