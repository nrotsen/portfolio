import { en } from './en';
import { es } from './es';
import type { Lang, SiteContent } from './types';

/**
 * Los dos diccionarios, indexados por idioma. Es el único lugar del que sale el
 * copy: `App` recibe un `SiteContent` y no importa nada de `./en` ni de `./es`,
 * así que ningún componente puede "saber" en qué idioma está.
 */
export const CONTENT: Record<Lang, SiteContent> = { en, es };

export function contentFor(lang: Lang): SiteContent {
  return CONTENT[lang];
}

export type { Lang, SiteContent };
