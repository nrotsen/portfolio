import type { ArchitectureDiagram as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import s from './ArchitectureDiagram.module.css';

const INK = '#111214';
const SOFT = '#55585F';
const RULE = '#DCDCD7';
const ACCENT = '#2B44E8';
const TINT = '#E9ECFF';
const PAPER = '#FAFAF8';

/**
 * El diagrama de finanzas-agent, en SVG inline.
 *
 * Inline y no `<img>` por dos razones: los textos salen del diccionario —así el
 * diagrama está traducido, no es una captura en inglés— y el `<title>` viaja en
 * el HTML, que es lo que lee un lector de pantalla y lo que el prerender usa
 * como centinela.
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
              <path d="M0 0 L10 5 L0 10 z" fill={INK} />
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
              <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
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
              <path d="M0 0 L10 5 L0 10 z" fill={SOFT} />
            </marker>
          </defs>

          {/* Carriles */}
          <g fill="none" stroke={RULE} strokeWidth="1">
            <line x1="0" y1="110" x2="760" y2="110" strokeDasharray="2 4" />
            <line x1="0" y1="222" x2="760" y2="222" strokeDasharray="2 4" />
            <line x1="380" y1="232" x2="380" y2="410" strokeDasharray="2 4" />
          </g>
          <g fontSize="10" fill={SOFT} letterSpacing=".06em">
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
          <text x="400" y="240" fontSize="10" fill={ACCENT} letterSpacing=".06em">
            {lanes.userData}
          </text>

          {/* Edge */}
          <g stroke={INK} strokeWidth="1" fill={PAPER}>
            <rect x="0" y="30" width="160" height="50" />
            <rect x="200" y="30" width="160" height="50" />
            <rect x="400" y="30" width="160" height="50" />
            <rect x="600" y="30" width="160" height="50" fill="#fff" />
          </g>
          <g fontSize="13" fill={INK}>
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
            <text x="614" y="70" fontSize="10.5" fill={SOFT}>
              {labels.webhookSub}
            </text>
          </g>
          <g stroke={INK} strokeWidth="1" fill="none">
            <line x1="160" y1="55" x2="198" y2="55" markerEnd="url(#arrow-ink)" />
            <line x1="360" y1="55" x2="398" y2="55" markerEnd="url(#arrow-ink)" />
            <line x1="560" y1="55" x2="598" y2="55" markerEnd="url(#arrow-ink)" />
          </g>

          {/* El traspaso asíncrono: lo único en cobalto, porque es la decisión */}
          <path
            d="M680 80 V 164 H 562"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd="url(#arrow-accent)"
          />
          <rect x="604" y="126" width="104" height="20" fill={TINT} />
          <text x="612" y="140" fontSize="11" fill={ACCENT} fontWeight="600">
            {labels.asyncInvoke}
          </text>

          {/* Compute */}
          <rect x="400" y="140" width="160" height="50" fill={INK} />
          <text x="414" y="162" fontSize="13" fill="#fff" fontWeight="600">
            λ agent runner
          </text>
          <text x="414" y="180" fontSize="10.5" fill="#B9C2FF">
            {labels.runnerSub}
          </text>

          <rect x="200" y="140" width="160" height="50" fill={PAPER} stroke={INK} />
          <text x="214" y="162" fontSize="13" fill={INK} fontWeight="600">
            Claude
          </text>
          <text x="214" y="180" fontSize="10.5" fill={SOFT}>
            {labels.claudeSub}
          </text>
          <line
            x1="362"
            y1="165"
            x2="398"
            y2="165"
            stroke={INK}
            markerStart="url(#arrow-ink)"
            markerEnd="url(#arrow-ink)"
          />

          <rect
            x="0"
            y="140"
            width="160"
            height="50"
            fill={PAPER}
            stroke={SOFT}
            strokeDasharray="3 3"
          />
          <text x="14" y="170" fontSize="13" fill={INK}>
            Secrets Manager
          </text>
          <path
            d="M80 140 V 124 H 440 V 138"
            fill="none"
            stroke={SOFT}
            strokeDasharray="3 3"
            markerEnd="url(#arrow-soft)"
          />
          <text x="210" y="120" fontSize="10.5" fill={SOFT}>
            {labels.coldStart}
          </text>

          {/* Runner → estado y datos */}
          <g stroke={INK} strokeWidth="1" fill="none">
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
          <rect x="0" y="260" width="180" height="50" fill={PAPER} stroke={INK} />
          <text x="14" y="282" fontSize="13" fill={INK} fontWeight="600">
            ConversationStore
          </text>
          <text x="14" y="300" fontSize="10.5" fill={SOFT}>
            {labels.conversationStoreSub}
          </text>
          <line x1="80" y1="310" x2="80" y2="348" stroke={INK} markerEnd="url(#arrow-ink)" />
          <rect x="0" y="350" width="160" height="50" fill={PAPER} stroke={INK} />
          <text x="14" y="372" fontSize="13" fill={INK} fontWeight="600">
            DynamoDB
          </text>
          <text x="14" y="390" fontSize="10.5" fill={SOFT}>
            {labels.dynamoChatSub}
          </text>

          {/* Datos del usuario: todo pasa por el DataAdapter */}
          <rect x="420" y="260" width="160" height="50" fill={TINT} stroke={ACCENT} />
          <text x="434" y="282" fontSize="13" fill={INK} fontWeight="600">
            DataAdapter
          </text>
          <text x="434" y="300" fontSize="10.5" fill={ACCENT}>
            {labels.dataAdapterSub}
          </text>
          <g fill="none" strokeWidth="1">
            <path d="M500 310 V 328 H 470 V 348" stroke={INK} markerEnd="url(#arrow-ink)" />
            <path
              d="M500 328 H 590 V 348"
              stroke={SOFT}
              strokeDasharray="3 3"
              markerEnd="url(#arrow-soft)"
            />
            <path
              d="M590 328 H 700 V 348"
              stroke={SOFT}
              strokeDasharray="3 3"
              markerEnd="url(#arrow-soft)"
            />
          </g>

          <rect x="400" y="350" width="140" height="50" fill={PAPER} stroke={INK} />
          <text x="412" y="372" fontSize="12.5" fill={INK} fontWeight="600">
            Google Sheets
          </text>
          <text x="412" y="390" fontSize="10.5" fill={SOFT}>
            {labels.sheetsSub}
          </text>

          <rect
            x="545"
            y="350"
            width="100"
            height="50"
            fill="none"
            stroke={SOFT}
            strokeDasharray="3 3"
          />
          <text x="555" y="372" fontSize="12.5" fill={INK} fontWeight="600">
            DynamoDB
          </text>
          <text x="555" y="390" fontSize="10.5" fill={SOFT}>
            {labels.dynamoPlannedSub}
          </text>

          <rect
            x="650"
            y="350"
            width="110"
            height="50"
            fill="none"
            stroke={SOFT}
            strokeDasharray="3 3"
          />
          <text x="660" y="372" fontSize="12.5" fill={INK} fontWeight="600">
            {labels.inMemory}
          </text>
          <text x="660" y="390" fontSize="10.5" fill={SOFT}>
            {labels.inMemorySub}
          </text>
        </svg>
      </div>

      <figcaption className={s.caption}>{diagram.caption}</figcaption>
    </figure>
  );
}
