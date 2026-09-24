import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  applyTheme,
  isTheme,
  resolveTheme,
  storedTheme,
} from './theme';

function stubMatchMedia(prefersDark: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: prefersDark && query.includes('dark'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

describe('theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('acepta solo los dos temas que existen', () => {
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('light')).toBe(true);
    expect(isTheme('sepia')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('sin elección previa, manda el sistema', () => {
    stubMatchMedia(true);
    expect(storedTheme()).toBeNull();
    expect(resolveTheme()).toBe('dark');

    stubMatchMedia(false);
    expect(resolveTheme()).toBe('light');
  });

  it('el atributo le gana al sistema', () => {
    // Es el caso que justifica el atributo: sistema en oscuro, usuario que
    // eligió claro. Si ganara el sistema, la elección se perdería al recargar.
    stubMatchMedia(true);
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    expect(resolveTheme()).toBe('light');
  });

  it('elegir un tema lo pinta y lo recuerda', () => {
    stubMatchMedia(false);
    applyTheme('dark');

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(storedTheme()).toBe('dark');
    expect(resolveTheme()).toBe('dark');
  });

  it('un valor basura en el storage no se usa', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(storedTheme()).toBeNull();
  });
});
