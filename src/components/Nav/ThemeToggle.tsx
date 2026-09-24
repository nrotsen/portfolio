import { useEffect, useState } from 'react';
import type { ThemeToggleLabels } from '@/content/types';
import { applyTheme, resolveTheme, type Theme } from '@/lib/theme';
import s from './Nav.module.css';

/**
 * Botón de tema claro / oscuro.
 *
 * El estado arranca en `null` a propósito: en el prerender no se puede saber
 * qué tema está viendo nadie, y el primer render del cliente tiene que
 * coincidir con el HTML servido o React descarta la hidratación entera. El
 * `aria-pressed` aparece recién en el efecto, cuando ya hay DOM que preguntar.
 *
 * Los dos íconos están siempre en el DOM y los muestra o los esconde el CSS
 * según el tema activo. Es la única forma de que el ícono correcto esté
 * pintado desde el primer frame, incluso antes de que hidrate React: el
 * atributo `data-theme` ya lo puso el script inline del `<head>`, y el CSS no
 * necesita esperar a nadie.
 */
export function ThemeToggle({ labels }: { labels: ThemeToggleLabels }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(resolveTheme());
  }, []);

  const toggle = (): void => {
    const next: Theme = (theme ?? resolveTheme()) === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      className={s.theme}
      onClick={toggle}
      aria-label={labels.label}
      aria-pressed={theme === null ? undefined : theme === 'dark'}
      title={labels.label}
    >
      <svg className={s.sun} viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
        <circle cx="12" cy="12" r="4.4" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 2.4v2.6M12 19v2.6M4.2 12H1.6M22.4 12h-2.6" />
          <path d="M6.1 6.1 4.3 4.3M19.7 19.7l-1.8-1.8M17.9 6.1l1.8-1.8M4.3 19.7l1.8-1.8" />
        </g>
      </svg>

      <svg className={s.moon} viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
        <path d="M20.5 14.9A8.6 8.6 0 0 1 9.1 3.5a8.6 8.6 0 1 0 11.4 11.4z" fill="currentColor" />
      </svg>
    </button>
  );
}
