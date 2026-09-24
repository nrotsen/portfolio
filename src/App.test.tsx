import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import axe from 'axe-core';
import { beforeAll, describe, expect, it } from 'vitest';
import { App } from './App';
import { CONTENT } from '@/content';
import { LANGS, type Lang } from '@/content/types';

/**
 * `matchMedia` no existe en happy-dom y `usePrefersReducedMotion` lo llama en su
 * efecto. Se declara "sin reducir" para que los tests vean la página como la ve
 * la mayoría.
 */
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe.each(LANGS)('página %s', (lang: Lang) => {
  const content = CONTENT[lang];

  it('tiene un solo h1, y es el titular del hero', () => {
    render(<App content={content} />);
    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAttribute('id', 'hero-h');
  });

  it('el HTML estático trae la conversación entera', () => {
    // A propósito con `renderToStaticMarkup` y no con `render`: lo que se
    // chequea es lo que se sirve, antes de que corra un solo efecto. En el
    // navegador el hook vacía el chat enseguida para reproducirlo; quien navega
    // sin JS se queda con este HTML y tiene que poder leer el diálogo.
    const html = renderToStaticMarkup(<App content={content} />);

    expect(html).toContain('gasté 12k en el super');
    expect(html).toContain('Mayo: ingresos');
    expect(html).toContain('registrar_gasto');
  });

  it('el diagrama se anuncia como imagen con su descripción', () => {
    render(<App content={content} />);
    const diagram = screen.getByRole('img', {
      name: new RegExp(content.projects.finanzasAgent.architecture.svgTitle.slice(0, 40), 'i'),
    });
    expect(diagram.tagName.toLowerCase()).toBe('svg');
  });

  it('pasa axe sin violaciones', async () => {
    const { container } = render(<App content={content} />);
    document.documentElement.lang = lang;

    const results = await axe.run(container, {
      // `region` pide que todo el contenido esté dentro de un landmark: acá el
      // contenedor del test no es el <body>, así que el landmark queda afuera.
      rules: { region: { enabled: false } },
    });

    const summary = results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    }));

    expect(summary).toEqual([]);
  }, 30_000);
});
