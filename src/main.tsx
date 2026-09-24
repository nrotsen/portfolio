import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './App';
import { contentFor } from '@/content';
import type { Lang } from '@/content/types';

/**
 * El idioma sale del documento, no de `navigator` ni de `localStorage`.
 *
 * `/` y `/es` son dos HTML distintos, cada uno con su `<html lang>`: si el
 * cliente eligiera por su cuenta, podría hidratar en un idioma distinto del que
 * se sirvió y React tiraría todo el HTML prerenderizado a la basura.
 */
function langFromDocument(): Lang {
  return document.documentElement.lang === 'es' ? 'es' : 'en';
}

const root = document.getElementById('root');

if (root === null) {
  throw new Error('[main] No existe #root: el HTML no es el que genera el prerender.');
}

hydrateRoot(
  root,
  <StrictMode>
    <App content={contentFor(langFromDocument())} />
  </StrictMode>,
);
