import type {
  Cta as CtaContent,
  Highlight,
  Metric,
  ProjectMeta,
  SectionHead,
} from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { renderInline } from '@/lib/richText';
import { Cta } from '@/components/Cta/Cta';

/**
 * Las piezas que comparten los tres proyectos: la ficha de la izquierda, la
 * lista de highlights y la fila de métricas.
 *
 * No son un componente "Proyecto" genérico a propósito. Los tres casos tienen
 * cuerpos muy distintos (un ticket, un replay con diagrama, una tarjeta de
 * quiz) y forzarlos al mismo molde terminaría en un componente con ocho props
 * opcionales. Se comparte lo que de verdad es igual.
 */

export function Head({ head, id }: { head: SectionHead; id: string }) {
  return (
    <div className="sec-head">
      <p className="label">
        <span className="idx">{head.index}</span> / {head.label}
      </p>
      <h2 id={id}>{head.title}</h2>
    </div>
  );
}

/**
 * La capa en plano arriba, el detalle técnico abajo.
 *
 * El orden es el punto: el sitio entero está escrito para alguien que sabe qué
 * es un access pattern, y mucha gente que abre un portfolio no lo sabe. La
 * primera frase dice qué es la cosa y para quién; la segunda sigue siendo tan
 * técnica como antes, solo que más chica y en gris.
 */
export function Lead({ plain, technical }: { plain: string; technical: string }) {
  return (
    <>
      <p className="lead reveal" ref={useReveal<HTMLParagraphElement>()}>
        {renderInline(plain)}
      </p>
      <p className="oneliner reveal" ref={useReveal<HTMLParagraphElement>()}>
        {renderInline(technical)}
      </p>
    </>
  );
}

export function Aside({ index, meta }: { index: string; meta: ProjectMeta }) {
  return (
    <aside className="side">
      <div className="pidx" aria-hidden="true">
        {index}
      </div>
      <dl className="meta">
        <div>
          <dt>{meta.yearLabel}</dt>
          <dd>{meta.year}</dd>
        </div>
        <div>
          <dt>{meta.roleLabel}</dt>
          <dd>{meta.role}</dd>
        </div>
        <div className="stack">
          <dt>{meta.stackLabel}</dt>
          <dd>
            <ul>
              {meta.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </aside>
  );
}

export function Highlights({ label, items }: { label: string; items: readonly Highlight[] }) {
  return (
    <>
      <h4 className="subhead">{label}</h4>
      <ol className="hl">
        {items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong> {renderInline(item.body)}
          </li>
        ))}
      </ol>
    </>
  );
}

export function Metrics({ items }: { items: readonly Metric[] }) {
  return (
    <div className="metrics reveal" ref={useReveal<HTMLDivElement>()}>
      {items.map((metric) => (
        <div className="metric" key={metric.caption}>
          <div className={metric.isText ? 'n txt' : 'n'}>{metric.value}</div>
          <p className="c">{metric.caption}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * `primaryFirst` es false en open source: el mockup deja ese link en el estilo
 * neutro porque la acción destacada de la página no es irse a GitHub.
 */
export function Ctas({
  items,
  primaryFirst = true,
}: {
  items: readonly CtaContent[];
  primaryFirst?: boolean;
}) {
  return (
    <div className="ctas reveal" ref={useReveal<HTMLDivElement>()}>
      {items.map((cta, i) => (
        <Cta key={cta.label} cta={cta} primary={primaryFirst && i === 0} />
      ))}
    </div>
  );
}
