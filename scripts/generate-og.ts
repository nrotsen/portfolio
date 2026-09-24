import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { CONTENT } from '../src/content/index.ts';
import { FULL_NAME, GITHUB_HANDLE, JOB_TITLE } from '../src/content/facts.ts';
import { LANGS, type Lang } from '../src/content/types.ts';
import { escapeHtml } from '../src/lib/seo.ts';

/**
 * Genera `public/og-en.png`, `public/og-es.png` y `public/apple-touch-icon.png`
 * con Playwright, desde un template HTML con el mismo estilo que el sitio.
 *
 * Se corre a mano (`pnpm generate:og`) y el resultado se commitea: no está en
 * el `build` porque bajar un Chromium en cada deploy para dibujar dos PNG que
 * cambian una vez por año es tiempo de CI tirado.
 *
 * Los textos salen del diccionario, así que la card social dice lo mismo que la
 * página — incluidos los números, que vienen de `facts.ts`.
 */

const PUBLIC_DIR = resolve(import.meta.dirname, '../public');
const OG = { width: 1200, height: 630 } as const;
const ICON = 180;

function ogHtml(lang: Lang): string {
  const content = CONTENT[lang];
  const [first, second, third] = content.hero.facts;

  const facts = [first, second, third]
    .map(
      (fact) => `
        <div class="fact">
          <div class="num">${escapeHtml(fact.value)}</div>
          <div class="cap">${escapeHtml(fact.caption)}</div>
        </div>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400;600;700;800&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: ${OG.width}px; height: ${OG.height}px;
    background: #FAFAF8; color: #111214;
    font-family: "Schibsted Grotesk", system-ui, sans-serif;
    padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .top { display: flex; align-items: center; gap: 14px; font-family: "IBM Plex Mono", monospace; font-size: 20px; color: #55585F; letter-spacing: .04em; }
  .top i { width: 18px; height: 18px; background: #2B44E8; display: block; }
  h1 { font-size: 92px; line-height: .95; letter-spacing: -.045em; font-weight: 700; max-width: 16ch; }
  h1 em { font-style: normal; color: #2B44E8; }
  .facts { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 2px solid #111214; }
  .fact { padding: 24px 24px 0 0; }
  .fact + .fact { padding-left: 24px; border-left: 1px solid #DCDCD7; }
  .num { font-size: 56px; font-weight: 700; letter-spacing: -.04em; line-height: 1; }
  .cap { font-family: "IBM Plex Mono", monospace; font-size: 17px; color: #55585F; margin-top: 10px; }
  .foot { font-family: "IBM Plex Mono", monospace; font-size: 20px; color: #55585F; }
</style>
</head>
<body>
  <div class="top"><i></i>${escapeHtml(JOB_TITLE)} · Argentina</div>
  <h1>${escapeHtml(FULL_NAME)} <em>— ${escapeHtml(content.projects.buenInventario.title)}, ${escapeHtml(content.projects.finanzasAgent.title)}, drills</em></h1>
  <div class="facts">${facts}</div>
  <div class="foot">${escapeHtml(GITHUB_HANDLE)}</div>
</body>
</html>`;
}

const iconHtml = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html, body { margin: 0; width: ${ICON}px; height: ${ICON}px; }
  body { background: #FAFAF8; display: grid; place-items: center; }
  i { width: ${Math.round(ICON * 0.56)}px; height: ${Math.round(ICON * 0.56)}px; background: #2B44E8; display: block; }
</style></head><body><i></i></body></html>`;

async function main(): Promise<void> {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const browser = await chromium.launch();

  try {
    for (const lang of LANGS) {
      const page = await browser.newPage({ viewport: OG, deviceScaleFactor: 1 });
      await page.setContent(ogHtml(lang), { waitUntil: 'networkidle' });
      const png = await page.screenshot({ type: 'png' });
      await writeFile(resolve(PUBLIC_DIR, `og-${lang}.png`), png);
      await page.close();
      console.log(`[og] public/og-${lang}.png`);
    }

    const page = await browser.newPage({
      viewport: { width: ICON, height: ICON },
      deviceScaleFactor: 1,
    });
    await page.setContent(iconHtml, { waitUntil: 'load' });
    await writeFile(resolve(PUBLIC_DIR, 'apple-touch-icon.png'), await page.screenshot());
    await page.close();
    console.log('[og] public/apple-touch-icon.png');
  } finally {
    await browser.close();
  }
}

main().catch((err: unknown) => {
  console.error('[og] falló:', err);
  process.exit(1);
});
