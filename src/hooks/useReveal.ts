import { useEffect, useRef, type RefObject } from 'react';

const REVEALED = 'in';

/**
 * Aparición al entrar en pantalla, con `IntersectionObserver`.
 *
 * Toca la clase por DOM en vez de por estado de React: son ~30 elementos y
 * ninguno necesita re-renderizar el árbol para cambiar una opacidad.
 *
 * Sin JS no pasa nada y está bien: la regla que esconde (`.js .reveal`) solo
 * aplica cuando el script inline del `<head>` agregó `js` al `<html>`. El
 * contenido del HTML estático se ve siempre.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add(REVEALED);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(REVEALED);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
