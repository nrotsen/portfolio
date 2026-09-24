import type { Lang } from '../content/types.ts';
import { LANG_STORAGE_KEY, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './storageKeys.ts';

/**
 * El único script que corre antes del primer paint.
 *
 * Hace tres cosas, y las tres tienen que pasar ANTES de que se pinte algo:
 *
 * 1. Marca `html.js`, que es lo que habilita la regla que esconde los bloques
 *    hasta que entran en pantalla. Si se agregara después, habría un flash de
 *    contenido que enseguida se desvanece.
 * 2. Restaura el tema elegido. Sin esto, quien eligió oscuro come un flash
 *    blanco en cada carga.
 * 3. Solo en `/`: manda a `/es` a quien tiene el navegador en español y nunca
 *    eligió idioma.
 *
 * Vive acá y no escrito a mano en `prerender.ts` para que las claves de
 * `localStorage` salgan de los mismos módulos que las escriben. Un script
 * inline con una clave copiada a mano es una bomba de tiempo: el día que
 * alguien renombra la constante, el script sigue leyendo la vieja y nadie se
 * entera hasta que un usuario ve el flash.
 */
export function buildBootScript(lang: Lang): string {
  const common = [
    "var d=document.documentElement;d.className+=' js';",
    `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');`,
    `if(t==='dark'||t==='light'){d.setAttribute('${THEME_ATTRIBUTE}',t);}}catch(e){}`,
  ].join('');

  const redirect =
    lang === 'en'
      ? [
          `try{var l=localStorage.getItem('${LANG_STORAGE_KEY}');`,
          "if(!l&&(navigator.language||'').toLowerCase().indexOf('es')===0)",
          "{location.replace('/es');}}catch(e){}",
        ].join('')
      : '';

  return `(function(){${common}${redirect}})();`;
}
