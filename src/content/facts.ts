import type { Lang } from './types';

/**
 * Los números del sitio, en un solo lugar.
 *
 * Contados el 2026-09-24 sobre los repos reales. Actualizarlos es cambiar este
 * archivo: los dos idiomas los formatean desde acá, así que no hay forma de que
 * `/` diga 2.000 y `/es` diga 1.900.
 */
export const FACTS = {
  /** Desde junio de 2023, cuando empezó Andes Docs. */
  yearsProfessional: 3,
  /** Andes Docs en el trabajo y Buen Inventario propio, los dos en uso diario. */
  productsInDailyUse: 2,
  /** Commits sumando los 4 repos de Buen Inventario. */
  commitsBuenInventario: 2075,
  monthsShipping: 15,
  testFiles: 322,
  repos: 4,
  drillItems: 169,
  drillDiagrams: 15,
  drillTests: 58,
} as const;

/**
 * Dominio del sitio. El de Vercel hasta que haya uno propio: cambiar esta
 * constante alcanza — canonical, hreflang, sitemap, robots, OG y JSON-LD salen
 * de acá, y el test de e2e compara contra esta misma constante en vez de
 * repetir la URL.
 */
export const SITE_URL = 'https://portfolio-ten-zeta-80.vercel.app';

export const GITHUB_URL = 'https://github.com/nrotsen';
export const GITHUB_HANDLE = 'github.com/nrotsen';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/n%C3%A9stor-berlanga-6b1b66219/';
export const LINKEDIN_HANDLE = 'linkedin.com/in/néstor-berlanga';
export const EMAIL = 'nestor.alive@gmail.com';

export const REPO_URL = `${GITHUB_URL}/portfolio`;
export const FINANZAS_AGENT_URL = `${GITHUB_URL}/finanzas-agent`;
export const DRILLS_URL = `${GITHUB_URL}/software-engineering-drills`;
export const DRILLS_HANDLE = 'github.com/nrotsen/software-engineering-drills';
export const DRILLS_APP_URL = 'https://software-engineering-drills.vercel.app';
export const BUEN_INVENTARIO_URL = 'https://www.bueninventario.com';
export const ANDESDOCS_URL = 'https://andesdocs.com';

export const FULL_NAME = 'Néstor Berlanga';
export const JOB_TITLE = 'Product engineer · full-stack';

const LOCALES: Record<Lang, string> = { en: 'en-US', es: 'es-AR' };

/**
 * `~2,000` en inglés, `~2.000` en español. El separador de miles es la razón
 * por la que los números viven en `facts.ts` y no escritos a mano en cada
 * diccionario: escritos a mano, uno de los dos idiomas queda mal tarde o
 * temprano.
 */
export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALES[lang]).format(value);
}

/** Path público de cada idioma. El inglés vive en la raíz. */
export function pathFor(lang: Lang): string {
  return lang === 'en' ? '/' : '/es';
}

/** URL canónica absoluta de un idioma. */
export function canonicalFor(lang: Lang): string {
  return lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/es`;
}
