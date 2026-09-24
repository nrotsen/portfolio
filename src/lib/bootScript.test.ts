import { describe, expect, it } from 'vitest';
import { buildBootScript } from './bootScript';
import { LANG_STORAGE_KEY, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './storageKeys';

/**
 * El script inline es la única parte del sitio que no pasa por el bundler, así
 * que nadie más lo va a revisar: no hay tipos, no hay lint que lo lea como
 * código y un error de sintaxis rompe la página entera en silencio.
 */
describe('buildBootScript', () => {
  it('marca html.js antes del primer paint, en los dos idiomas', () => {
    for (const lang of ['en', 'es'] as const) {
      expect(buildBootScript(lang)).toContain("d.className+=' js'");
    }
  });

  it('restaura el tema usando las mismas claves que el resto del código', () => {
    const script = buildBootScript('es');
    expect(script).toContain(THEME_STORAGE_KEY);
    expect(script).toContain(THEME_ATTRIBUTE);
  });

  it('solo / redirige por idioma', () => {
    // En /es la redirección no tiene sentido: ya estás donde te mandaría.
    expect(buildBootScript('en')).toContain(LANG_STORAGE_KEY);
    expect(buildBootScript('en')).toContain("location.replace('/es')");
    expect(buildBootScript('es')).not.toContain('location.replace');
  });

  it('es una IIFE que no deja nada colgado del window', () => {
    for (const lang of ['en', 'es'] as const) {
      const script = buildBootScript(lang);
      expect(script.startsWith('(function(){')).toBe(true);
      expect(script.endsWith('})();')).toBe(true);
    }
  });

  it('envuelve todo acceso a localStorage en un try', () => {
    // Safari con cookies bloqueadas tira al leer localStorage. Sin el try, el
    // script muere y la página se queda sin la clase `js`.
    for (const lang of ['en', 'es'] as const) {
      const script = buildBootScript(lang);
      const reads = (script.match(/localStorage/g) ?? []).length;
      const catches = (script.match(/catch\(e\)\{\}/g) ?? []).length;
      expect(catches).toBeGreaterThanOrEqual(1);
      expect(reads).toBeGreaterThan(0);
      expect(script).not.toMatch(/[^{]localStorage\.getItem[^)]*\)[^}]*$/);
    }
  });

  it('es JavaScript válido', () => {
    for (const lang of ['en', 'es'] as const) {
      expect(() => new Function(buildBootScript(lang))).not.toThrow();
    }
  });
});
