import type { Lang } from '@/content/types';

export const LANG_STORAGE_KEY = 'nb-lang';

/**
 * Recuerda el idioma que el usuario eligió a mano.
 *
 * Lo usa una sola cosa: el script inline de `/` que redirige a `/es` en la
 * primera visita de un navegador en español. Si el usuario ya eligió, la
 * redirección no corre más — elegir EN teniendo el navegador en español no
 * puede ser una decisión que se pierde al recargar.
 *
 * El `try` no es decorativo: `localStorage` tira en Safari con cookies
 * bloqueadas y en modo privado de algunos navegadores.
 */
export function rememberLang(lang: Lang): void {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Sin storage no se recuerda la preferencia. No es motivo para romper nada.
  }
}
