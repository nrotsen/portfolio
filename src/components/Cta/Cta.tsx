import type { Cta as CtaContent } from '@/content/types';

/**
 * La flecha dice a dónde va el link: ↓ baja en la misma página, ↗ sale del
 * sitio. Es `aria-hidden` porque para un lector de pantalla el destino ya está
 * en el `href`.
 */
export function Cta({ cta, primary = false }: { cta: CtaContent; primary?: boolean }) {
  return (
    <a className={primary ? 'btn primary' : 'btn'} href={cta.href}>
      {cta.label}{' '}
      <span className="arr" aria-hidden="true">
        {cta.external ? '↗' : '↓'}
      </span>
    </a>
  );
}
