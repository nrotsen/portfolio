import { expect, test } from '@playwright/test';

/**
 * Cero scroll horizontal, en 12 anchos y en los dos idiomas.
 *
 * El chequeo tiene dos partes porque una sola no alcanza:
 *
 * 1. El documento no scrollea de costado (`scrollWidth <= clientWidth`).
 * 2. Ningún elemento se sale del viewport. Sin esto, un bloque que sobresale
 *    pero queda tapado por el `overflow-x: hidden` del `body` pasa como sano —
 *    y en Safari el mismo bloque sí mueve la página.
 *
 * Se excluye lo que vive dentro de un contenedor con `overflow-x: auto`: el
 * diagrama de arquitectura está pensado para leerse con scroll propio en
 * mobile, y ahí salirse de los 390px es la intención, no el bug.
 */

const WIDTHS = [320, 360, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1600, 1920] as const;
const PAGES = ['/', '/es'] as const;

const TOLERANCE = 1;

interface Offender {
  selector: string;
  right: number;
  left: number;
}

for (const path of PAGES) {
  test.describe(`overflow ${path}`, () => {
    for (const width of WIDTHS) {
      test(`${width}px no scrollea de costado`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);

        // Todo revelado: un bloque con `translateY` todavía sin animar puede
        // tapar un desbordamiento que aparece recién cuando entra en pantalla.
        await page.evaluate(() => {
          document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
        });

        const offenders = await page.evaluate((tolerance): Offender[] => {
          const scrollable = (el: Element): boolean => {
            for (let node: Element | null = el; node !== null; node = node.parentElement) {
              const overflowX = getComputedStyle(node).overflowX;
              if (overflowX === 'auto' || overflowX === 'scroll') return true;
            }
            return false;
          };

          const describe = (el: Element): string => {
            const id = el.id !== '' ? `#${el.id}` : '';
            const cls =
              typeof el.className === 'string' && el.className !== ''
                ? `.${el.className.trim().split(/\s+/).join('.')}`
                : '';
            return `${el.tagName.toLowerCase()}${id}${cls}`;
          };

          const limit = document.documentElement.clientWidth;
          const found: Offender[] = [];

          for (const el of document.querySelectorAll('body *')) {
            if (scrollable(el)) continue;

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            if (getComputedStyle(el).position === 'fixed') continue;
            // El "saltar al contenido" vive en left: -9999px hasta que recibe
            // foco. Está entero afuera por la izquierda: no mueve nada.
            if (rect.right <= 0) continue;

            if (rect.right > limit + tolerance || rect.left < -tolerance) {
              found.push({
                selector: describe(el),
                right: Math.round(rect.right),
                left: Math.round(rect.left),
              });
            }
          }

          return found;
        }, TOLERANCE);

        expect(offenders, `elementos fuera del viewport en ${width}px`).toEqual([]);

        const doc = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(doc.scrollWidth).toBeLessThanOrEqual(doc.clientWidth + TOLERANCE);
      });
    }
  });
}
