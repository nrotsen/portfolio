import type { Principle, SectionHead } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { renderInline } from '@/lib/richText';
import s from './Principles.module.css';

interface Props {
  head: SectionHead;
  items: readonly Principle[];
}

/**
 * Cada principio es su propio componente porque cada uno necesita su
 * `useReveal`, y un hook adentro de un `.map()` no es un hook: es un bug
 * esperando a que la lista cambie de largo.
 */
function PrincipleItem({ principle, index }: { principle: Principle; index: number }) {
  return (
    <li className={`${s.item} reveal`} ref={useReveal<HTMLLIElement>()}>
      <span className={s.n} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <h3>{principle.title}</h3>
        <p>{renderInline(principle.body)}</p>
      </div>
    </li>
  );
}

export function Principles({ head, items }: Props) {
  return (
    <section className="sec" id="how" aria-labelledby="how-h">
      <div className="wrap grid">
        <div className="side">
          <p className="label">{head.label}</p>
          <h2 id="how-h" className={s.title}>
            {head.title}
          </h2>
        </div>

        <div className="body">
          <ol className={s.list}>
            {items.map((principle, i) => (
              <PrincipleItem key={principle.title} principle={principle} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
