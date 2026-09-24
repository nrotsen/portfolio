import type { ScriptEntry, TraceToken } from '@/content/replay';

/**
 * Del guion del chat a una lista de pasos con tiempos absolutos.
 *
 * Es una función pura y ese es todo el punto: el replay se testea sin DOM, sin
 * React y sin timers reales — se le pasa el guion y se mira la lista. El hook
 * `useReplay` queda con una sola responsabilidad (disparar `setTimeout` en los
 * `at` que dice esta lista) y el componente queda tonto.
 */

export type Step =
  | { at: number; kind: 'user'; text: string; time: string }
  | { at: number; kind: 'agent'; text: string; time: string }
  /** Muestra los tres puntitos; el siguiente paso `agent` los saca. */
  | { at: number; kind: 'typing' }
  /** Muestra el cursor al pie de la traza; el siguiente `trace` lo saca. */
  | { at: number; kind: 'cursor' }
  | { at: number; kind: 'trace'; tokens: readonly TraceToken[] };

export interface Timeline {
  steps: readonly Step[];
  /** Cuándo termina el último paso, en ms desde el arranque. */
  durationMs: number;
}

/** Tiempos del replay, en ms. Copiados del mockup para que se sienta igual. */
export const TIMINGS = {
  /** Aire antes del primer mensaje, para que no arranque de golpe al entrar. */
  start: 400,
  /** Lo que "tarda en escribir" el usuario. */
  user: 700,
  /** Cursor parpadeando antes de que aparezca una línea de traza. */
  trace: 650,
  /** Los tres puntitos antes de una respuesta del agente. */
  typing: 1200,
} as const;

export function buildTimeline(script: readonly ScriptEntry[]): Timeline {
  const steps: Step[] = [];
  let at = TIMINGS.start;

  for (const entry of script) {
    switch (entry.kind) {
      case 'user': {
        at += TIMINGS.user;
        steps.push({ at, kind: 'user', text: entry.text, time: entry.time });
        break;
      }
      case 'trace': {
        steps.push({ at, kind: 'cursor' });
        at += TIMINGS.trace;
        steps.push({ at, kind: 'trace', tokens: entry.tokens });
        break;
      }
      case 'agent': {
        steps.push({ at, kind: 'typing' });
        at += TIMINGS.typing;
        steps.push({ at, kind: 'agent', text: entry.text, time: entry.time });
        break;
      }
    }
  }

  return { steps, durationMs: at };
}

/** Estado visible del replay en un instante dado. */
export interface ReplayState {
  messages: readonly { kind: 'user' | 'agent'; text: string; time: string }[];
  traces: readonly { tokens: readonly TraceToken[] }[];
  typing: boolean;
  cursor: boolean;
}

export const EMPTY_STATE: ReplayState = {
  messages: [],
  traces: [],
  typing: false,
  cursor: false,
};

/**
 * Aplica un paso al estado. Vive acá, al lado de `buildTimeline`, porque es la
 * otra mitad de la misma regla: `typing` y `cursor` son transitorios y los
 * apaga el paso que los sigue, no un timer aparte.
 */
export function applyStep(state: ReplayState, step: Step): ReplayState {
  switch (step.kind) {
    case 'user':
    case 'agent':
      return {
        ...state,
        messages: [...state.messages, { kind: step.kind, text: step.text, time: step.time }],
        typing: false,
      };
    case 'typing':
      return { ...state, typing: true };
    case 'cursor':
      return { ...state, cursor: true };
    case 'trace':
      return { ...state, traces: [...state.traces, { tokens: step.tokens }], cursor: false };
  }
}

/**
 * El estado final del guion, sin esperar nada. Es lo que se muestra con
 * `prefers-reduced-motion: reduce` y lo que renderiza el prerender, así que el
 * HTML estático ya trae la conversación entera.
 */
export function finalState(timeline: Timeline): ReplayState {
  return timeline.steps.reduce(applyStep, EMPTY_STATE);
}
