import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONTENT } from '@/content';
import { LANGS } from '@/content/types';
import { LANG_STORAGE_KEY } from '@/lib/langPreference';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';
import { Nav } from './Nav';

describe('switch de idioma', () => {
  it('son links reales, con su hreflang y su URL', () => {
    render(<Nav nav={CONTENT.en.nav} lang="en" />);

    const es = screen.getByRole('link', { name: 'Ver en español' });
    expect(es).toHaveAttribute('href', '/es');
    expect(es).toHaveAttribute('hreflang', 'es');
  });

  it('marca el idioma activo con aria-current', () => {
    render(<Nav nav={CONTENT.es.nav} lang="es" />);

    expect(screen.getByRole('link', { name: 'ES' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'View in English' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('recuerda la elección para que la redirección de primera visita no la pise', async () => {
    window.localStorage.removeItem(LANG_STORAGE_KEY);
    render(<Nav nav={CONTENT.es.nav} lang="es" />);

    await userEvent.click(screen.getByRole('link', { name: 'View in English' }));

    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
  });

  it('los links del nav salen del diccionario del idioma', () => {
    const { unmount } = render(<Nav nav={CONTENT.es.nav} lang="es" />);
    const es = screen.getByRole('navigation', { name: 'Principal' });
    expect(within(es).getByRole('link', { name: 'Experiencia' })).toHaveAttribute(
      'href',
      '#experience',
    );
    expect(within(es).getByRole('link', { name: 'Proyectos' })).toHaveAttribute('href', '#work');
    unmount();

    render(<Nav nav={CONTENT.en.nav} lang="en" />);
    const en = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(en).getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'href',
      '#experience',
    );
    expect(within(en).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#work');
  });
});

describe('botón de tema', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('dice qué tema está activo con aria-pressed', () => {
    render(<Nav nav={CONTENT.en.nav} lang="en" />);
    // El sistema está en claro y nadie eligió: el toggle está sin apretar.
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('un click pinta el tema oscuro y lo recuerda', async () => {
    render(<Nav nav={CONTENT.es.nav} lang="es" />);
    const button = screen.getByRole('button', { name: 'Tema oscuro' });

    await userEvent.click(button);

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(button);

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('light');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('menú de mobile', () => {
  /**
   * Los links viven dos veces en el HTML: la fila de desktop y el menú. Es a
   * propósito — `display: none` deja solo uno en el árbol de accesibilidad
   * según el ancho — pero conviene que un test lo diga, porque visto en el DOM
   * pelado parece un bug.
   */
  it('es un <details>, así que abre sin JavaScript', () => {
    const { container } = render(<Nav nav={CONTENT.en.nav} lang="en" />);

    const details = container.querySelector('details');
    expect(details).not.toBeNull();
    expect(details?.querySelector('summary')).not.toBeNull();
  });

  it('lleva los mismos links que la fila de desktop, con su propio nombre', () => {
    render(<Nav nav={CONTENT.es.nav} lang="es" />);

    const menu = screen.getByRole('navigation', { name: 'Menú' });
    const desktop = screen.getByRole('navigation', { name: 'Principal' });

    const names = (el: HTMLElement) =>
      within(el)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'));

    expect(names(menu)).toEqual(names(desktop));
    expect(names(menu)).toHaveLength(CONTENT.es.nav.links.length);
  });
});

describe('secciones', () => {
  /**
   * Experiencia y Proyectos son dos secciones distintas desde que el trabajo
   * en relación de dependencia dejó de estar mezclado con lo propio. Si algún
   * día vuelven a ser una sola, este test lo dice.
   */
  it('cada link del nav apunta a una sección que existe en la página', () => {
    const expected = ['#experience', '#work', '#how', '#contact'];

    for (const lang of LANGS) {
      expect(CONTENT[lang].nav.links.map((link) => link.href)).toEqual(expected);
    }
  });
});
