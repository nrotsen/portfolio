import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  EMPTY_STATE,
  applyStep,
  finalState,
  type ReplayState,
  type Timeline,
} from '@/lib/buildTimeline';

export interface UseReplayResult {
  state: ReplayState;
  /** Va en el contenedor: dispara el replay cuando entra en pantalla. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** El botón "Replay": reinicia desde cero, esté donde esté. */
  replay: () => void;
}

/**
 * Reproduce un timeline con `setTimeout`.
 *
 * El estado inicial es el FINAL del guion, no el vacío: así el HTML
 * prerenderizado ya trae la conversación entera y quien navega sin JS la lee
 * completa. Recién en el efecto de montaje —cuando ya sabemos que hay JS— se
 * vacía y se espera el scroll.
 *
 * Con `prefers-reduced-motion: reduce` no se vacía nunca: se queda en el
 * estado final, sin timers y sin animación.
 */
export function useReplay(timeline: Timeline, reducedMotion: boolean): UseReplayResult {
  const [state, setState] = useState<ReplayState>(() => finalState(timeline));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback((): void => {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }, []);

  const play = useCallback((): void => {
    clearTimers();
    setState(EMPTY_STATE);

    for (const step of timeline.steps) {
      timers.current.push(
        setTimeout(() => {
          setState((previous) => applyStep(previous, step));
        }, step.at),
      );
    }
  }, [clearTimers, timeline]);

  const replay = useCallback((): void => {
    if (reducedMotion) {
      setState(finalState(timeline));
      return;
    }
    play();
  }, [play, reducedMotion, timeline]);

  useEffect(() => {
    if (reducedMotion) {
      clearTimers();
      setState(finalState(timeline));
      return;
    }

    // Hay JS y hay movimiento: se vacía y se espera a que el bloque entre en
    // pantalla. Sin `IntersectionObserver` arranca directo.
    setState(EMPTY_STATE);

    const el = containerRef.current;
    if (el === null || !('IntersectionObserver' in window)) {
      play();
      return clearTimers;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            play();
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [clearTimers, play, reducedMotion, timeline]);

  return { state, containerRef, replay };
}
