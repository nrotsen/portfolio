import type { ArchitectureDiagram as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import s from './ArchitectureDiagram.module.css';

/**
 * El diagrama de finanzas-agent, en SVG inline.
 *
 * Inline y no `<img>` por tres razones: los textos salen del diccionario —así
 * el diagrama está traducido, no es una captura en inglés—, el `<title>` viaja
 * en el HTML, que es lo que lee un lector de pantalla y lo que el prerender usa
 * como centinela, y los colores salen de los tokens, así que el mismo dibujo
 * sirve en tema claro y en oscuro.
 *
 * Lo que cuenta el dibujo: el estado de la conversación y los datos del usuario
 * están separados, y las tools solo ven el `DataAdapter`.
 */
export function ArchitectureDiagram({ diagram }: { diagram: Content }) {
  const { labels, lanes } = diagram;

  return (
    <figure className={`${s.arch} reveal`} ref={useReveal<HTMLElement>()}>
      <h4 className="subhead">{diagram.sectionLabel}</h4>

      <div className={s.scroll}>
        <svg viewBox="0 0 760 420" role="img" aria-labelledby="arch-title">
          <title id="arch-title">{diagram.svgTitle}</title>

          <defs>
            <marker
              id="arrow-ink"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className={s.arrowInk} />
            </marker>
            <marker
              id="arrow-accent"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className={s.arrowAccent} />
            </marker>
            <marker
              id="arrow-soft"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className={s.arrowSoft} />
            </marker>
          </defs>

          {/* Carriles */}
          <g className={s.lane}>
            <line x1="0" y1="110" x2="760" y2="110" />
            <line x1="0" y1="222" x2="760" y2="222" />
            <line x1="380" y1="232" x2="380" y2="410" />
          </g>
          <g fontSize="10" className={s.laneLabel}>
            <text x="0" y="12">
              {lanes.edge}
            </text>
            <text x="0" y="128">
              {lanes.compute}
            </text>
            <text x="0" y="240">
              {lanes.state}
            </text>
          </g>
          <text x="400" y="240" fontSize="10" className={s.laneLabelAccent}>
            {lanes.userData}
          </text>

          {/* Edge */}
          <rect x="0" y="30" width="160" height="50" className={s.box} />
          <rect x="200" y="30" width="160" height="50" className={s.box} />
          <rect x="400" y="30" width="160" height="50" className={s.box} />
          <rect x="600" y="30" width="160" height="50" className={s.boxSurface} />

          <g fontSize="13" className={s.title}>
            <text x="14" y="60">
              WhatsApp
            </text>
            <text x="214" y="60">
              Meta Cloud API
            </text>
            <text x="414" y="60">
              API Gateway
            </text>
            <text x="614" y="52" fontWeight="600">
              λ webhook
            </text>
          </g>
          <text x="614" y="70" fontSize="10.5" className={s.sub}>
            {labels.webhookSub}
          </text>

          <g className={s.link}>
            <line x1="160" y1="55" x2="198" y2="55" markerEnd="url(#arrow-ink)" />
            <line x1="360" y1="55" x2="398" y2="55" markerEnd="url(#arrow-ink)" />
            <line x1="560" y1="55" x2="598" y2="55" markerEnd="url(#arrow-ink)" />
          </g>

          {/* El traspaso asíncrono: lo único en cobalto, porque es la decisión */}
          <path d="M680 80 V 164 H 562" className={s.linkAccent} markerEnd="url(#arrow-accent)" />
          <rect x="604" y="126" width="104" height="20" className={s.pill} />
          <text x="612" y="140" fontSize="11" fontWeight="600" className={s.subAccent}>
            {labels.asyncInvoke}
          </text>

          {/* Compute */}
          <rect x="400" y="140" width="160" height="50" className={s.boxSolid} />
          <text x="414" y="162" fontSize="13" fontWeight="600" className={s.titleInverse}>
            λ agent runner
          </text>
          <text x="414" y="180" fontSize="10.5" className={s.subInverse}>
            {labels.runnerSub}
          </text>

          <rect x="200" y="140" width="160" height="50" className={s.box} />
          <text x="214" y="162" fontSize="13" fontWeight="600" className={s.title}>
            Claude
          </text>
          <text x="214" y="180" fontSize="10.5" className={s.sub}>
            {labels.claudeSub}
          </text>
          <line
            x1="362"
            y1="165"
            x2="398"
            y2="165"
            className={s.link}
            markerStart="url(#arrow-ink)"
            markerEnd="url(#arrow-ink)"
          />

          <rect x="0" y="140" width="160" height="50" className={s.boxDashed} />
          <text x="14" y="170" fontSize="13" className={s.title}>
            Secrets Manager
          </text>
          <path d="M80 140 V 124 H 440 V 138" className={s.linkSoft} markerEnd="url(#arrow-soft)" />
          <text x="210" y="120" fontSize="10.5" className={s.sub}>
            {labels.coldStart}
          </text>

          {/* Runner → estado y datos */}
          <g className={s.link}>
            <path
              d="M440 190 V 212 H 145 V 258"
              markerStart="url(#arrow-ink)"
              markerEnd="url(#arrow-ink)"
            />
            <line
              x1="500"
              y1="190"
              x2="500"
              y2="258"
              markerStart="url(#arrow-ink)"
              markerEnd="url(#arrow-ink)"
            />
          </g>

          {/* Estado del runtime */}
          <rect x="0" y="260" width="180" height="50" className={s.box} />
          <text x="14" y="282" fontSize="13" fontWeight="600" className={s.title}>
            ConversationStore
          </text>
          <text x="14" y="300" fontSize="10.5" className={s.sub}>
            {labels.conversationStoreSub}
          </text>
          <line x1="80" y1="310" x2="80" y2="348" className={s.link} markerEnd="url(#arrow-ink)" />
          <rect x="0" y="350" width="160" height="50" className={s.box} />
          <text x="14" y="372" fontSize="13" fontWeight="600" className={s.title}>
            DynamoDB
          </text>
          <text x="14" y="390" fontSize="10.5" className={s.sub}>
            {labels.dynamoChatSub}
          </text>

          {/* Datos del usuario: todo pasa por el DataAdapter */}
          <rect x="420" y="260" width="160" height="50" className={s.boxTint} />
          <text x="434" y="282" fontSize="13" fontWeight="600" className={s.title}>
            DataAdapter
          </text>
          <text x="434" y="300" fontSize="10.5" className={s.subAccent}>
            {labels.dataAdapterSub}
          </text>

          <path d="M500 310 V 328 H 470 V 348" className={s.link} markerEnd="url(#arrow-ink)" />
          <path d="M500 328 H 590 V 348" className={s.linkSoft} markerEnd="url(#arrow-soft)" />
          <path d="M590 328 H 700 V 348" className={s.linkSoft} markerEnd="url(#arrow-soft)" />

          <rect x="400" y="350" width="140" height="50" className={s.box} />
          <text x="412" y="372" fontSize="12.5" fontWeight="600" className={s.title}>
            Google Sheets
          </text>
          <text x="412" y="390" fontSize="10.5" className={s.sub}>
            {labels.sheetsSub}
          </text>

          <rect x="545" y="350" width="100" height="50" className={s.boxGhost} />
          <text x="555" y="372" fontSize="12.5" fontWeight="600" className={s.title}>
            DynamoDB
          </text>
          <text x="555" y="390" fontSize="10.5" className={s.sub}>
            {labels.dynamoPlannedSub}
          </text>

          <rect x="650" y="350" width="110" height="50" className={s.boxGhost} />
          <text x="660" y="372" fontSize="12.5" fontWeight="600" className={s.title}>
            {labels.inMemory}
          </text>
          <text x="660" y="390" fontSize="10.5" className={s.sub}>
            {labels.inMemorySub}
          </text>
        </svg>
      </div>

      <figcaption className={s.caption}>{diagram.caption}</figcaption>
    </figure>
  );
}
