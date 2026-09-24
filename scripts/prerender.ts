import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createElement, type ComponentType } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { LANGS, type Lang } from '../src/content/types.ts';
import { buildHead, buildRobots, buildSitemap } from '../src/lib/seo.ts';

/**
 * Genera el HTML estático de los dos idiomas.
 *
 * Entra `dist/index.html` (el template que dejó `vite build`) y salen
 * `dist/index.html` en inglés y `dist/es/index.html` en español, cada uno con
 * su `<head>`, su `<html lang>` y la página entera adentro de `#root`.
 *
 * El build falla si algo no se renderizó. No es paranoia: `prerenderToNodeStream`
 * NO rechaza cuando un componente tira — React recupera en el boundary más
 * cercano y resuelve normal. Sin los chequeos de abajo, `pnpm build` salía 0 con
 * un `dist/` que servía una página a medias.
 */

const DIST = resolve(import.meta.dirname, '../dist');
const HEAD_START = '<!--head-start-->';
const HEAD_END = '<!--head-end-->';
const APP_MARKER = '<!--app-html-->';

/**
 * Centinelas: fragmentos que tienen que estar en el HTML de CADA idioma.
 *
 * Son atributos, no frases de copy, a propósito. `id="hero-h"` no se cambia en
 * una pasada de redacción; un titular sí. Si alguno deja de existir porque el
 * componente cambió a propósito, hay que actualizar esta lista — que es
 * exactamente la conversación que queremos tener.
 */
const SENTINELS: readonly { what: string; needle: string }[] = [
  { what: 'el <h1> del hero', needle: 'id="hero-h"' },
  { what: 'el SVG del diagrama', needle: 'aria-labelledby="arch-title"' },
  { what: 'el contenedor del replay', needle: 'id="replay"' },
  { what: 'el mock del ticket', needle: 'role="img"' },
];

/**
 * Preload de las dos fuentes que usa el hero. Los nombres son los de
 * @fontsource antes del hash de Vite; se buscan en `dist/assets/` en vez de
 * escribirse literales porque el hash cambia en cada build.
 */
const PRELOAD_FONTS = [
  'schibsted-grotesk-latin-wght-normal',
  'ibm-plex-mono-latin-400-normal',
] as const;

/**
 * Redirección de primera visita, solo en `/`.
 *
 * Además agrega `js` al `<html>`, que es lo que habilita la regla que esconde
 * los bloques hasta que entran en pantalla. Van juntos en un solo script inline
 * para que la clase esté puesta antes del primer paint y no haya un flash de
 * contenido que después se desvanece.
 */
const INLINE_SCRIPT_EN = `(function(){var d=document.documentElement;d.className+=' js';try{var s=localStorage.getItem('nb-lang');if(!s&&(navigator.language||'').toLowerCase().indexOf('es')===0){location.replace('/es');}}catch(e){}})();`;
const INLINE_SCRIPT_ES = `(function(){document.documentElement.className+=' js';})();`;

interface EntryServerModule {
  AppShell: ComponentType<{ lang: Lang }>;
}

/**
 * Carga el bundle SSR que `vite build --ssr` deja en `dist-ssr/`.
 *
 * El specifier se calcula en vez de escribirse literal porque `dist-ssr/` está
 * gitignoreado y lo produce el mismo `pnpm build` unos segundos antes de que
 * corra este script — pero `tsc -b` corre antes que los dos, y un import
 * estático a un archivo que todavía no existe no chequea nunca. El contrato se
 * verifica en runtime: si `entry-server.tsx` deja de exportar `AppShell`, el
 * build rompe con un mensaje legible en vez de pasarle `undefined` a
 * `createElement`.
 */
async function loadAppShell(): Promise<EntryServerModule['AppShell']> {
  const bundleUrl = new URL('../dist-ssr/entry-server.js', import.meta.url).href;
  const bundle = (await import(bundleUrl)) as Partial<EntryServerModule>;

  if (typeof bundle.AppShell !== 'function') {
    throw new Error(
      '[prerender] dist-ssr/entry-server.js no exporta AppShell. ' +
        'Revisar src/entry-server.tsx y el paso `vite build --ssr` del build.',
    );
  }

  return bundle.AppShell;
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function renderApp(AppShell: EntryServerModule['AppShell'], lang: Lang): Promise<string> {
  let renderError: unknown = null;

  const { prelude } = await prerenderToNodeStream(createElement(AppShell, { lang }), {
    onError(error) {
      if (renderError === null) renderError = error;
    },
  });

  const html = await streamToString(prelude);

  // Después de consumir el stream: los errores de un boundary aparecen mientras
  // React sigue renderizando, no antes de devolver el prelude.
  if (renderError !== null) {
    throw new Error(
      `[prerender] React tiró durante el render estático de "${lang}" — el HTML ` +
        'quedaría incompleto. Ver el error de abajo.',
      { cause: renderError },
    );
  }

  return html;
}

async function findFontPreloads(): Promise<string[]> {
  const assets = await readdir(resolve(DIST, 'assets'));

  return PRELOAD_FONTS.map((name) => {
    const file = assets.find((asset) => asset.startsWith(name) && asset.endsWith('.woff2'));

    if (file === undefined) {
      throw new Error(
        `[prerender] No hay ningún .woff2 que empiece con "${name}" en dist/assets. ` +
          'Cambió @fontsource o se dejó de importar ese subset en src/styles/index.css.',
      );
    }

    return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`;
  });
}

function checkSentinels(html: string, lang: Lang): void {
  for (const { what, needle } of SENTINELS) {
    if (!html.includes(needle)) {
      throw new Error(
        `[prerender] Falta ${what} (${needle}) en el HTML de "${lang}". ` +
          'O el componente no se renderizó, o cambió de estructura. Si cambió a ' +
          'propósito, actualizar SENTINELS en scripts/prerender.ts.',
      );
    }
  }
}

function injectSection(html: string, start: string, end: string, replacement: string): string {
  const from = html.indexOf(start);
  const to = html.indexOf(end);

  if (from === -1 || to === -1 || to < from) {
    throw new Error(
      `[prerender] No se encontraron los marcadores ${start} … ${end} en dist/index.html. ` +
        'Si cambió index.html, actualizar los marcadores acá.',
    );
  }

  // Reemplazo por función: en un string de reemplazo las secuencias con signo
  // peso son patrones de sustitución, y el HTML que inyectamos está lleno de
  // precios en pesos ($20.650, $1.800.000).
  return html.slice(0, from) + replacement + html.slice(to + end.length);
}

async function writePage(template: string, lang: Lang, appHtml: string, preloads: string[]) {
  const inline = lang === 'en' ? INLINE_SCRIPT_EN : INLINE_SCRIPT_ES;

  const head = [...preloads, buildHead(lang), `<script>${inline}</script>`].join('\n    ');

  let html = injectSection(template, HEAD_START, HEAD_END, head);
  html = html.replace(/^<html lang="[a-z-]+">/m, `<html lang="${lang}">`);

  const appIndex = html.indexOf(APP_MARKER);
  if (appIndex === -1) {
    throw new Error(`[prerender] No se encontró ${APP_MARKER} en dist/index.html.`);
  }
  html = html.slice(0, appIndex) + appHtml + html.slice(appIndex + APP_MARKER.length);

  const outDir = lang === 'en' ? DIST : resolve(DIST, lang);
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, 'index.html'), html, 'utf8');

  return Buffer.byteLength(html, 'utf8');
}

async function main(): Promise<void> {
  const started = Date.now();

  const AppShell = await loadAppShell();
  const template = await readFile(resolve(DIST, 'index.html'), 'utf8');
  const preloads = await findFontPreloads();

  const sizes: string[] = [];

  for (const lang of LANGS) {
    const appHtml = await renderApp(AppShell, lang);
    checkSentinels(appHtml, lang);
    const bytes = await writePage(template, lang, appHtml, preloads);
    sizes.push(`${lang}: ${(bytes / 1024).toFixed(1)} KB`);
  }

  const today = new Date().toISOString().slice(0, 10);
  await writeFile(resolve(DIST, 'sitemap.xml'), buildSitemap(today), 'utf8');
  await writeFile(resolve(DIST, 'robots.txt'), buildRobots(), 'utf8');

  console.log(`[prerender] ${sizes.join(' · ')} en ${((Date.now() - started) / 1000).toFixed(2)}s`);
}

main().catch((err: unknown) => {
  console.error('[prerender] falló:', err);
  process.exit(1);
});
