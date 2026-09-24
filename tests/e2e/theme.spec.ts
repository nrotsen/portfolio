import { createRequire } from 'node:module';
import { expect, test, type Page } from '@playwright/test';

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve('axe-core');

/** El fondo del `<body>`, que es lo que de verdad se ve. */
function background(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

const LIGHT_BG = 'rgb(250, 250, 248)';
const DARK_BG = 'rgb(18, 19, 22)';

test.describe('tema por preferencia del sistema', () => {
  test.describe('sistema en oscuro', () => {
    test.use({ colorScheme: 'dark' });

    test('la página arranca oscura sin que nadie elija nada', async ({ page }) => {
      await page.goto('/');

      expect(await background(page)).toBe(DARK_BG);
      // Sin atributo: todavía manda el sistema, no una elección guardada.
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
    });
  });

  test.describe('sistema en claro', () => {
    test.use({ colorScheme: 'light' });

    test('la página arranca clara', async ({ page }) => {
      await page.goto('/');
      expect(await background(page)).toBe(LIGHT_BG);
    });
  });
});

test.describe('el botón de tema', () => {
  test.use({ colorScheme: 'light' });

  test('cambia el tema y lo recuerda entre páginas', async ({ page }) => {
    await page.goto('/');
    expect(await background(page)).toBe(LIGHT_BG);

    await page.getByRole('button', { name: 'Dark theme' }).click();

    expect(await background(page)).toBe(DARK_BG);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // La elección tiene que sobrevivir a una navegación de verdad, no solo a
    // un re-render: son dos documentos distintos.
    await page.getByRole('link', { name: 'Ver en español' }).click();
    await expect(page).toHaveURL(/\/es$/);
    expect(await background(page)).toBe(DARK_BG);
    await expect(page.getByRole('button', { name: 'Tema oscuro' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test.describe('elegir claro con el sistema en oscuro', () => {
    test.use({ colorScheme: 'dark' });

    test('gana el usuario, no el sistema', async ({ page }) => {
      await page.goto('/');
      expect(await background(page)).toBe(DARK_BG);

      await page.getByRole('button', { name: 'Dark theme' }).click();

      expect(await background(page)).toBe(LIGHT_BG);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

      await page.reload();
      expect(await background(page)).toBe(LIGHT_BG);
    });
  });

  test('sin el script inline habría flash: el tema ya está en el primer paint', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dark theme' }).click();

    // `domcontentloaded`, no `load`: en ese momento el CSS ya se aplicó y
    // todavía no corrió la hidratación de React. Si el tema dependiera del
    // JS de la app, acá el fondo sería el claro.
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(await background(page)).toBe(DARK_BG);
  });
});

/**
 * Contraste real, medido sobre la página pintada.
 *
 * Es el único chequeo que no se puede hacer en happy-dom: `color-contrast`
 * necesita colores computados de verdad. Y es justo la regla que rompe un tema
 * oscuro hecho a ojo — el cobalto del tema claro sobre fondo negro da 2.4:1.
 */
for (const scheme of ['light', 'dark'] as const) {
  for (const path of ['/', '/es'] as const) {
    test.describe(`contraste ${scheme} ${path}`, () => {
      // `reducedMotion` no es un extra: con la animación de entrada en vuelo,
      // los bloques están a media opacidad y axe mide el color mezclado con el
      // fondo. Medía violaciones que no existían. Apagarla usa el mismo
      // mecanismo que el sitio ya tiene y deja todo visible desde el frame uno.
      test.use({ colorScheme: scheme, reducedMotion: 'reduce' });

      test('sin violaciones de color-contrast', async ({ page }) => {
        await page.goto(path);
        await page.addScriptTag({ path: AXE_PATH });

        const violations = await page.evaluate(async () => {
          const results = await (
            window as unknown as {
              axe: {
                run: (
                  ctx: Document,
                  opts: unknown,
                ) => Promise<{
                  violations: { id: string; nodes: { target: string[]; html: string }[] }[];
                }>;
              };
            }
          ).axe.run(document, { runOnly: ['color-contrast'] });

          return results.violations.map((violation) => ({
            id: violation.id,
            nodes: violation.nodes.map((node) => `${node.target.join(' ')} :: ${node.html}`),
          }));
        });

        expect(violations).toEqual([]);
      });
    });
  }
}
