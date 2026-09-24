import { expect, test } from '@playwright/test';

const FIRST_MESSAGE = 'gasté 12k en el super';
const LAST_MESSAGE = 'Mayo: ingresos $1.800.000';

test('el replay se reproduce al llegar al bloque', async ({ page }) => {
  await page.goto('/');

  const log = page.getByRole('log');

  // Antes de entrar en pantalla el chat está vacío: el HTML traía la
  // conversación entera y el JS la limpió para reproducirla.
  await expect(log.getByText(FIRST_MESSAGE)).toHaveCount(0);

  await page.locator('#replay').scrollIntoViewIfNeeded();

  await expect(log.getByText(FIRST_MESSAGE)).toBeVisible({ timeout: 10_000 });
  await expect(log.getByText(LAST_MESSAGE)).toBeVisible({ timeout: 30_000 });
});

test('el botón Replay vuelve a empezar', async ({ page }) => {
  await page.goto('/');
  await page.locator('#replay').scrollIntoViewIfNeeded();

  const log = page.getByRole('log');
  await expect(log.getByText(LAST_MESSAGE)).toBeVisible({ timeout: 30_000 });

  await page.getByRole('button', { name: 'Replay' }).click();

  await expect(log.getByText(LAST_MESSAGE)).toHaveCount(0);
  await expect(log.getByText(FIRST_MESSAGE)).toBeVisible({ timeout: 10_000 });
});

test.describe('con prefers-reduced-motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('el replay muestra el estado final sin esperar', async ({ page }) => {
    await page.goto('/');

    // Sin scrollear y sin timers: la conversación ya está entera.
    const log = page.getByRole('log');
    await expect(log.getByText(FIRST_MESSAGE)).toBeVisible();
    await expect(log.getByText(LAST_MESSAGE)).toBeVisible();

    // Y la traza también, con sus siete líneas.
    await expect(page.getByRole('list', { name: 'Agent trace' }).locator('li')).toHaveCount(7);
  });
});
