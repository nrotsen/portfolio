/**
 * Las claves que comparten el navegador y el script inline del `<head>`.
 *
 * Viven solas en un módulo sin una sola línea de DOM porque `prerender.ts`
 * —que corre en Node— tiene que leerlas para escribir ese script. Si estuvieran
 * en `theme.ts` o en `langPreference.ts`, el build arrastraría `window` y
 * `document` a un programa de TypeScript que no tiene la lib del DOM, y la
 * salida sería o un error de tipos o, peor, aflojar el tsconfig de los scripts.
 */

export const THEME_STORAGE_KEY = 'nb-theme';
export const THEME_ATTRIBUTE = 'data-theme';
export const LANG_STORAGE_KEY = 'nb-lang';
