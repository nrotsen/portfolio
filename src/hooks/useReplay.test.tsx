import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REPLAY_SCRIPT } from '@/content/replay';
import { buildTimeline } from '@/lib/buildTimeline';
import { useReplay } from './useReplay';

const timeline = buildTimeline(REPLAY_SCRIPT);

function Probe({ reducedMotion }: { reducedMotion: boolean }) {
  const { state, containerRef, replay } = useReplay(timeline, reducedMotion);
  return (
    <div ref={containerRef}>
      <button type="button" onClick={replay}>
        replay
      </button>
      <output data-testid="messages">{state.messages.length}</output>
      <output data-testid="traces">{state.traces.length}</output>
      <output data-testid="typing">{String(state.typing)}</output>
    </div>
  );
}

/**
 * `IntersectionObserver` no existe en happy-dom. Se reemplaza por uno que
 * dispara enseguida: lo que se testea acá es el timeline, no el scroll — eso lo
 * cubre el e2e.
 */
function stubIntersectionObserver(): void {
  class Immediate {
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      this.callback(
        [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve(): void {}
    disconnect(): void {}
  }
  vi.stubGlobal('IntersectionObserver', Immediate);
}

const messages = (): number => Number(screen.getByTestId('messages').textContent);
const traces = (): number => Number(screen.getByTestId('traces').textContent);

describe('useReplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubIntersectionObserver();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('arranca vacío y se llena con el paso del tiempo', () => {
    render(<Probe reducedMotion={false} />);

    expect(messages()).toBe(0);
    expect(traces()).toBe(0);

    act(() => void vi.advanceTimersByTime(timeline.steps[0]?.at ?? 0));
    expect(messages()).toBe(1);

    act(() => void vi.advanceTimersByTime(timeline.durationMs));
    expect(messages()).toBe(6);
    expect(traces()).toBe(7);
    expect(screen.getByTestId('typing').textContent).toBe('false');
  });

  it('el botón reinicia desde cero', () => {
    render(<Probe reducedMotion={false} />);
    act(() => void vi.advanceTimersByTime(timeline.durationMs));
    expect(messages()).toBe(6);

    act(() => screen.getByRole('button').click());
    expect(messages()).toBe(0);

    act(() => void vi.advanceTimersByTime(timeline.durationMs));
    expect(messages()).toBe(6);
  });

  it('con reduced motion muestra el final sin esperar y sin programar timers', () => {
    render(<Probe reducedMotion />);

    expect(messages()).toBe(6);
    expect(traces()).toBe(7);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancela los timers al desmontar', () => {
    const { unmount } = render(<Probe reducedMotion={false} />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
