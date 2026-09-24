import { expect, test } from '@playwright/test';

/**
 * El sitio se lee entero sin JavaScript.
 *
 * No es una pose: es la consecuencia de prerenderizar. Si algún día un texto
 * deja de estar en el HTML estático, este test lo dice antes que Google.
 */
test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [path, headline, lang] of [
    ['/', 'I build products', 'en'],
    ['/es', 'Construyo productos', 'es'],
  ] as const) {
    test(`${path} trae todo el contenido en el HTML`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toContainText(headline);

      // Un texto de cada sección, incluido lo que en el navegador es animación.
      await expect(page.getByText('Buen Inventario').first()).toBeVisible();
      await expect(page.getByText('finanzas-agent').first()).toBeVisible();
      await expect(page.getByText('software-engineering-drills').first()).toBeVisible();
      await expect(page.getByRole('log').getByText('gasté 12k en el super')).toBeVisible();
      await expect(page.getByText('tarjeta_visa · 280000 · in 2 days')).toBeVisible();
      await expect(page.getByRole('img', { name: /DataAdapter/ })).toBeAttached();
      await expect(page.getByRole('link', { name: /nestor\.alive/ })).toBeVisible();
    });
  }

  test('el switch de idioma funciona sin JS', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Ver en español' }).click();
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});
