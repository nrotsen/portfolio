import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CONTENT } from '@/content';
import { LANG_STORAGE_KEY } from '@/lib/langPreference';
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
    expect(screen.getByRole('link', { name: 'Proyectos' })).toHaveAttribute('href', '#work');
    unmount();

    render(<Nav nav={CONTENT.en.nav} lang="en" />);
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');
  });
});
