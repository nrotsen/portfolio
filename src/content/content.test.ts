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
    expect(formatNumber(FACTS.commitsShipped, 'en')).toBe('2,000');
    expect(formatNumber(FACTS.commitsShipped, 'es')).toBe('2.000');
    expect(formatNumber(FACTS.commitsBuenInventario, 'en')).toBe('2,075');
    expect(formatNumber(FACTS.commitsBuenInventario, 'es')).toBe('2.075');
  });

  it('el hero de cada idioma muestra el número formateado para ese idioma', () => {
    expect(CONTENT.en.hero.facts[0].value).toBe('~2,000');
    expect(CONTENT.es.hero.facts[0].value).toBe('~2.000');
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
