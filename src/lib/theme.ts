import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './storageKeys';

export type Theme = 'light' | 'dark';

export { THEME_ATTRIBUTE, THEME_STORAGE_KEY };

/**
 * El tema tiene tres estados, no dos: claro, oscuro y "lo que diga el sistema".
 *
 * Mientras nadie elija, no hay atributo en el `<html>` y manda la media query
 * de `tokens.css` — que es lo correcto: alguien que puso su sistema en oscuro
 * a las nueve de la noche ya eligió, solo que no acá. El atributo aparece
 * recién cuando el usuario toca el botón, y a partir de ahí gana él.
 */

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** Lo que el usuario eligió, o `null` si todavía manda el sistema. */
export function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * El tema que se está viendo ahora mismo: el atributo si lo hay, y si no, el
 * del sistema. Se lee del DOM y no del storage porque el atributo ya lo puso
 * el script inline del `<head>`, y esa es la verdad que tiene la pantalla.
 */
export function resolveTheme(): Theme {
  const attribute = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(attribute) ? attribute : systemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin storage el tema dura lo que dura la pestaña. No es motivo para
    // romper el click.
  }
}
