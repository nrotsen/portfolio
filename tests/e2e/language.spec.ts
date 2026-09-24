import { expect, test } from '@playwright/test';
import { canonicalFor } from '../../src/content/facts.ts';

/**
 * Cada idioma es una URL con su propio HTML. Lo que se testea acá es que sea
 * verdad en el documento servido, no en lo que hace el JS después.
 */

test('el switch navega y cambia el idioma del documento', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('link', { name: 'Ver en español' }).click();

  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toContainText('Construyo productos');

  await page.getByRole('link', { name: 'View in English' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('I build products');
});

test('el idioma activo está marcado con aria-current', async ({ page }) => {
  await page.goto('/es');

  const group = page.getByRole('group', { name: 'Idioma' });
  await expect(group.getByRole('link', { name: 'ES' })).toHaveAttribute('aria-current', 'true');
  await expect(group.getByRole('link', { name: 'View in English' })).not.toHaveAttribute(
    'aria-current',
    'true',
  );
});

test('cada idioma declara su canonical y sus hreflang', async ({ page }) => {
  // Derivado de `facts.ts`, no repetido: cuando cambió el dominio, esta era la
  // única copia que no se actualizaba sola y el test pasaba a mentir.
  for (const [path, canonical] of [
    ['/', canonicalFor('en')],
    ['/es', canonicalFor('es')],
  ] as const) {
    await page.goto(path);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      canonicalFor('en'),
    );
  }
});

test.describe('primera visita con el navegador en español', () => {
  test.use({ locale: 'es-AR' });

  test('/ redirige a /es si nunca se eligió idioma', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/es$/);
  });

  test('/ respeta el inglés si el usuario lo eligió', async ({ page }) => {
    await page.goto('/es');
    // Elegir EN a mano deja la preferencia guardada.
    await page.getByRole('link', { name: 'View in English' }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
