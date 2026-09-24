import { CONTENT } from '../content/index.ts';
import {
  FULL_NAME,
  GITHUB_URL,
  JOB_TITLE,
  LINKEDIN_URL,
  SITE_URL,
  canonicalFor,
  pathFor,
} from '../content/facts.ts';
import type { Lang } from '../content/types.ts';
import { LANGS } from '../content/types.ts';

/**
 * El `<head>` de cada idioma, como strings.
 *
 * Vive en `src/` y no en `scripts/` porque sale del mismo diccionario que la
 * página: el `<title>` y el `og:title` son el mismo campo que el `<h1>` no
 * puede contradecir. `scripts/prerender.ts` lo importa y lo inyecta.
 *
 * Todo lo que entra al HTML pasa por `escapeHtml`. El copy tiene comillas,
 * guiones largos y ampersands, y un `description` sin escapar rompe el
 * atributo entero.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function meta(attr: 'name' | 'property', key: string, value: string): string {
  return `<meta ${attr}="${key}" content="${escapeHtml(value)}">`;
}

function ogImageFor(lang: Lang): string {
  return `${SITE_URL}/og-${lang}.png`;
}

/** El `Person` de schema.org. Un solo bloque: el sitio es una persona. */
export function buildJsonLd(lang: Lang): string {
  const content = CONTENT[lang];

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: FULL_NAME,
    url: canonicalFor(lang),
    jobTitle: JOB_TITLE,
    description: content.meta.description,
    nationality: 'AR',
    knowsLanguage: ['es-AR', 'en'],
    sameAs: [GITHUB_URL, LINKEDIN_URL],
  };

  return `<script type="application/ld+json">${JSON.stringify(person)}</script>`;
}

/**
 * Los `<link rel="alternate">` de los dos idiomas más `x-default`.
 *
 * `x-default` apunta al inglés porque es la raíz y la que ve quien llega sin
 * preferencia declarada.
 */
function alternates(): string[] {
  const links = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${canonicalFor(l)}">`,
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${canonicalFor('en')}">`);
  return links;
}

export function buildHead(lang: Lang): string {
  const content = CONTENT[lang];
  const { title, description, ogImageAlt, ogLocale } = content.meta;
  const canonical = canonicalFor(lang);
  const otherLang: Lang = lang === 'en' ? 'es' : 'en';

  const tags: string[] = [
    `<title>${escapeHtml(title)}</title>`,
    meta('name', 'description', description),
    meta('name', 'author', FULL_NAME),
    meta('name', 'theme-color', '#FAFAF8'),
    `<link rel="canonical" href="${canonical}">`,
    ...alternates(),

    meta('property', 'og:type', 'profile'),
    meta('property', 'og:site_name', FULL_NAME),
    meta('property', 'og:url', canonical),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:image', ogImageFor(lang)),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', ogImageAlt),
    meta('property', 'og:locale', ogLocale),
    meta('property', 'og:locale:alternate', CONTENT[otherLang].meta.ogLocale),

    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', ogImageFor(lang)),
    meta('name', 'twitter:image:alt', ogImageAlt),

    `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,

    buildJsonLd(lang),
  ];

  return tags.join('\n    ');
}

/** `sitemap.xml`: son dos URLs, no hace falta una librería. */
export function buildSitemap(lastmod: string): string {
  const urls = LANGS.map((lang) => {
    const alt = LANGS.map(
      (l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="${canonicalFor(l)}"/>`,
    ).join('\n');
    return [
      '  <url>',
      `    <loc>${canonicalFor(lang)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      alt,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function buildRobots(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
}

export { pathFor };
