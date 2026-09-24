import type { Lifecycle } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import s from './AndesDocs.module.css';

/** Ancho y separación de cada paso dentro del viewBox de 760. */
const BOX_W = 166;
const GAP = 32;
const BOX_H = 108;
const TOP = 26;

/**
 * El ciclo de vida de un documento: crear → colaborar → firmar → controlar.
 *
 * Es lo que hace el producto contado en cuatro cajas, y está acá porque el
 * resto de la sección habla de lo que hice yo. Sin esto, alguien que no conoce
 * Andes Docs lee cinco bullets técnicos sobre un producto que no entendió.
 *
 * El dibujo es mío, no de ellos: formas y tokens del portfolio, sin su marca.
 */
export function LifecycleDiagram({ lifecycle }: { lifecycle: Lifecycle }) {
  return (
    <figure className={`${s.lifecycle} reveal`} ref={useReveal<HTMLElement>()}>
      <h4 className="subhead">{lifecycle.sectionLabel}</h4>

      <div className={s.scroll}>
        <svg viewBox="0 0 760 150" role="img" aria-labelledby="lifecycle-title">
          <title id="lifecycle-title">{lifecycle.svgTitle}</title>

          <defs>
            <marker
              id="lifecycle-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className={s.arrowInk} />
            </marker>
          </defs>

          {lifecycle.steps.map((step, i) => {
            const x = i * (BOX_W + GAP);
            // El paso de la firma es el que el producto vende: va en cobalto.
            const accent = step.index === '03';

            return (
              <g key={step.index}>
                <rect
                  x={x}
                  y={TOP}
                  width={BOX_W}
                  height={BOX_H}
                  className={accent ? s.boxAccent : s.box}
                />
                <text x={x + 14} y={TOP + 24} fontSize="11" className={s.index}>
                  {step.index}
                </text>
                <text x={x + 14} y={TOP + 46} fontSize="14" fontWeight="600" className={s.title}>
                  {step.title}
                </text>
                {/* Cortado a mano: SVG no sabe hacer wrap de texto. */}
                {wrap(step.body, 22).map((line, j) => (
                  <text key={j} x={x + 14} y={TOP + 66 + j * 13} fontSize="10" className={s.body}>
                    {line}
                  </text>
                ))}

                {i < lifecycle.steps.length - 1 && (
                  <line
                    x1={x + BOX_W + 4}
                    y1={TOP + BOX_H / 2}
                    x2={x + BOX_W + GAP - 6}
                    y2={TOP + BOX_H / 2}
                    className={s.link}
                    markerEnd="url(#lifecycle-arrow)"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

/**
 * Corta un texto en líneas de como mucho `max` caracteres, sin partir palabras.
 *
 * `<text>` de SVG no hace wrap: lo que no entra se dibuja igual y se sale de la
 * caja. Es fea pero es la forma honesta de tener el texto traducido adentro del
 * dibujo en vez de una imagen en inglés.
 */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(' ')) {
    if (line === '') {
      line = word;
    } else if (`${line} ${word}`.length <= max) {
      line = `${line} ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line !== '') lines.push(line);
  return lines;
}
