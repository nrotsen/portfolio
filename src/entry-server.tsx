import { contentFor } from '@/content';
import type { Lang } from '@/content/types';
import { App } from './App';

/**
 * El árbol que se prerenderiza, por idioma.
 *
 * Es un módulo aparte de `main.tsx` a propósito: `main.tsx` importa el CSS
 * global y toca `document`, dos cosas que no existen en Node.
 *
 * Sin `StrictMode`: duplica el render y no aporta nada fuera del navegador.
 */
export function AppShell({ lang }: { lang: Lang }) {
  return <App content={contentFor(lang)} />;
}
