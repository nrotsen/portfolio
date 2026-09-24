/**
 * Guion del replay de finanzas-agent.
 *
 * El chat va siempre en español porque el producto es en español: el agente le
 * contesta a un argentino en WhatsApp. En `/` la única concesión al inglés es
 * el epígrafe, que aclara de qué idioma se trata.
 *
 * Es data pura — sin JSX, sin HTML — para que `buildTimeline` se pueda testear
 * sin DOM y para que la traza se pinte desde tokens en vez de strings con tags.
 */

export type TraceToken =
  | { kind: 'kw'; text: string }
  | { kind: 'rule'; text: string }
  | { kind: 'fn'; text: string }
  | { kind: 'str'; text: string }
  | { kind: 'dim'; text: string }
  | { kind: 'plain'; text: string };

export type ScriptEntry =
  | { kind: 'user'; text: string; time: string }
  | { kind: 'agent'; text: string; time: string }
  | { kind: 'trace'; tokens: readonly TraceToken[] };

const kw = (text: string): TraceToken => ({ kind: 'kw', text });
const rule = (text: string): TraceToken => ({ kind: 'rule', text });
const fn = (text: string): TraceToken => ({ kind: 'fn', text });
const str = (text: string): TraceToken => ({ kind: 'str', text });
const dim = (text: string): TraceToken => ({ kind: 'dim', text });
const t = (text: string): TraceToken => ({ kind: 'plain', text });

export const REPLAY_SCRIPT: readonly ScriptEntry[] = [
  { kind: 'user', text: 'gasté 12k en el super', time: '21:14' },
  { kind: 'trace', tokens: [rule('rule'), dim(' · '), t("medio_pago missing → ask, don't guess")] },
  {
    kind: 'agent',
    text: '¿con qué pagaste? efectivo / débito / crédito / transferencia / mp',
    time: '21:14',
  },
  { kind: 'user', text: 'débito', time: '21:15' },
  {
    kind: 'trace',
    tokens: [
      kw('tool_use'),
      t(' '),
      fn('registrar_gasto'),
      t('({ monto: 12000, categoria: '),
      str('"comida"'),
      t(', medio_pago: '),
      str('"debito"'),
      t(', fecha: '),
      str('"2026-05-19"'),
      t(' })'),
    ],
  },
  {
    kind: 'trace',
    tokens: [
      dim('→ '),
      kw('result'),
      t(' { id: '),
      str('"g_8f2c"'),
      t(' } '),
      dim('· '),
      t('sheet row appended'),
    ],
  },
  { kind: 'agent', text: '✅ Registrado: $12.000 en comida (débito).', time: '21:15' },
  { kind: 'user', text: 'cómo voy este mes?', time: '21:16' },
  {
    kind: 'trace',
    tokens: [
      kw('tool_use'),
      t(' '),
      fn('resumen_financiero'),
      t('({ periodo: '),
      str('"este mes"'),
      t(' })'),
    ],
  },
  {
    kind: 'trace',
    tokens: [dim('→ '), kw('result'), t(' { ingresos: 1800000, gastos: 950000 }')],
  },
  {
    kind: 'trace',
    tokens: [kw('tool_use'), t(' '), fn('vencimientos_proximos'), t('({ dias: 3 })')],
  },
  {
    kind: 'trace',
    tokens: [dim('→ '), kw('result'), t(' [ tarjeta_visa · 280000 · in 2 days ]')],
  },
  {
    kind: 'agent',
    text: 'Mayo: ingresos $1.800.000, gastos $950.000. Neto +$850.000. ⚠️ Vence en 2 días: tarjeta_visa ($280.000).',
    time: '21:16',
  },
];
