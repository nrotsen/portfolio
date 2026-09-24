import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Arranca en `false` a propósito: en el prerender no hay `matchMedia`, y el
 * primer render del cliente tiene que coincidir con el HTML servido o React
 * descarta la hidratación entera. El valor real llega en el efecto, antes de
 * que se dispare ninguna animación.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent): void => setReduced(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
