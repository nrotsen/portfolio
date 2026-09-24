import { describe, expect, it } from 'vitest';
import { REPLAY_SCRIPT, type ScriptEntry } from '@/content/replay';
import { TIMINGS, applyStep, buildTimeline, finalState } from './buildTimeline';

describe('buildTimeline', () => {
  it('no adelanta nada: los pasos salen en orden de tiempo', () => {
    const { steps } = buildTimeline(REPLAY_SCRIPT);
    const times = steps.map((step) => step.at);

    expect(times).toEqual([...times].sort((a, b) => a - b));
    expect(steps[0]?.at).toBeGreaterThanOrEqual(TIMINGS.start);
  });

  it('pone el cursor antes de cada línea de traza y los puntitos antes de cada respuesta', () => {
    const script: ScriptEntry[] = [
      { kind: 'user', text: 'hola', time: '21:00' },
      { kind: 'trace', tokens: [{ kind: 'kw', text: 'tool_use' }] },
      { kind: 'agent', text: 'hola!', time: '21:00' },
    ];

    expect(buildTimeline(script).steps.map((step) => step.kind)).toEqual([
      'user',
      'cursor',
      'trace',
      'typing',
      'agent',
    ]);
  });

  it('la traza de registrar_gasto llega después de que el usuario dice "débito"', () => {
    const { steps } = buildTimeline(REPLAY_SCRIPT);

    const debito = steps.find((step) => step.kind === 'user' && step.text === 'débito');
    const registrar = steps.find(
      (step) =>
        step.kind === 'trace' && step.tokens.some((token) => token.text === 'registrar_gasto'),
    );

    expect(debito).toBeDefined();
    expect(registrar).toBeDefined();
    // Es la regla del agente: no adivinar el medio de pago. Si el timeline
    // dejara la tool antes de la respuesta, el replay contaría otra historia.
    expect(registrar?.at).toBeGreaterThan(debito?.at ?? Infinity);
  });

  it('la duración es el momento del último paso', () => {
    const { steps, durationMs } = buildTimeline(REPLAY_SCRIPT);
    expect(durationMs).toBe(steps.at(-1)?.at);
  });

  it('un guion vacío no produce pasos', () => {
    expect(buildTimeline([])).toEqual({ steps: [], durationMs: TIMINGS.start });
  });
});

describe('applyStep', () => {
  it('la respuesta del agente apaga los puntitos', () => {
    const typing = applyStep(finalState(buildTimeline([])), { at: 0, kind: 'typing' });
    expect(typing.typing).toBe(true);

    const answered = applyStep(typing, { at: 1, kind: 'agent', text: 'ok', time: '21:00' });
    expect(answered.typing).toBe(false);
    expect(answered.messages).toHaveLength(1);
  });

  it('la línea de traza apaga el cursor', () => {
    const base = finalState(buildTimeline([]));
    const cursor = applyStep(base, { at: 0, kind: 'cursor' });
    expect(cursor.cursor).toBe(true);

    const traced = applyStep(cursor, { at: 1, kind: 'trace', tokens: [] });
    expect(traced.cursor).toBe(false);
    expect(traced.traces).toHaveLength(1);
  });
});

describe('finalState', () => {
  it('es la conversación entera, sin transitorios', () => {
    const state = finalState(buildTimeline(REPLAY_SCRIPT));

    const users = REPLAY_SCRIPT.filter((entry) => entry.kind === 'user').length;
    const agents = REPLAY_SCRIPT.filter((entry) => entry.kind === 'agent').length;
    const traces = REPLAY_SCRIPT.filter((entry) => entry.kind === 'trace').length;

    expect(state.messages).toHaveLength(users + agents);
    expect(state.traces).toHaveLength(traces);
    expect(state.typing).toBe(false);
    expect(state.cursor).toBe(false);
  });
});
