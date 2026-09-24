import { describe, expect, it } from 'vitest';
import { CONTENT } from './index';
import { FACTS, formatNumber } from './facts';
import { LANGS, type Lang } from './types';

/**
 * Que los dos idiomas tengan la misma FORMA lo garantiza `tsc`: los dos cumplen
 * `SiteContent`. Lo que `tsc` no puede ver es si un campo quedó vacío, si sobró
 * un placeholder o si un número se escribió a mano en un idioma. Eso es lo que
 * se chequea acá.
 */

type Entry = { path: string; value: string };

function strings(value: unknown, path = ''): Entry[] {
  if (typeof value === 'string') return [{ path, value }];
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`));
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      strings(item, path === '' ? key : `${path}.${key}`),
    );
  }
  return [];
}

describe.each(LANGS)('diccionario %s', (lang: Lang) => {
  const entries = strings(CONTENT[lang]);

  it('tiene texto de sobra para revisar', () => {
    expect(entries.length).toBeGreaterThan(150);
  });

  it('no deja ningún string vacío', () => {
    const empty = entries.filter((entry) => entry.value.trim() === '');
    expect(empty).toEqual([]);
  });

  it('no deja placeholders sin completar', () => {
    // `[[…]]` es la marca del brief de contenido; `TODO(content)` la del plan.
    const pending = entries.filter(
      (entry) => entry.value.includes('[[') || entry.value.includes('TODO(content)'),
    );
    expect(pending).toEqual([]);
  });

  it('no deja marcado inline sin cerrar', () => {
    const unbalanced = entries.filter((entry) => {
      const backticks = (entry.value.match(/`/g) ?? []).length;
      const asterisks = (entry.value.match(/\*/g) ?? []).length;
      return backticks % 2 !== 0 || asterisks % 2 !== 0;
    });
    expect(unbalanced).toEqual([]);
  });
});

describe('números', () => {
  it('cada idioma usa su separador de miles', () => {
    expect(formatNumber(FACTS.commitsBuenInventario, 'en')).toBe('2,075');
    expect(formatNumber(FACTS.commitsBuenInventario, 'es')).toBe('2.075');
  });

  it('el número de miles sale formateado para su idioma en la página', () => {
    // Los commits viven en la fila de métricas de Buen Inventario. El hero ya
    // no lleva ningún número de cuatro cifras: sus tres cifras son años,
    // productos y archivos de test, que es lo que se lee sin ser del rubro.
    const commits = (lang: Lang): string | undefined =>
      CONTENT[lang].projects.buenInventario.metrics.find((metric) =>
        metric.caption.startsWith('commits'),
      )?.value;

    expect(commits('en')).toBe('~2,075');
    expect(commits('es')).toBe('~2.075');
  });

  it('el hero no arranca con jerga de ingeniero', () => {
    // Es la primera pantalla y la lee gente que no sabe qué es un commit.
    const captions = LANGS.flatMap((lang) =>
      CONTENT[lang].hero.facts.map((fact) => fact.caption.toLowerCase()),
    );

    expect(captions.some((caption) => caption.includes('commit'))).toBe(false);
    expect(captions.some((caption) => caption.includes('repo'))).toBe(false);
  });

  it('los dos idiomas cuentan lo mismo', () => {
    const numbersOf = (lang: Lang): string[] =>
      CONTENT[lang].projects.drills.metrics.map((metric) => metric.value.replace(/[.,]/g, ''));

    expect(numbersOf('en')).toEqual(numbersOf('es'));
  });
});

describe('links', () => {
  it('todos los href son absolutos, anclas o mailto', () => {
    for (const lang of LANGS) {
      const hrefs = strings(CONTENT[lang])
        .filter((entry) => entry.path.endsWith('href') || entry.path.endsWith('Href'))
        .map((entry) => entry.value);

      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(href).toMatch(/^(https:\/\/|mailto:|#|\/)/);
      }
    }
  });
});
