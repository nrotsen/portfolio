import { useEffect, useMemo, useRef } from 'react';
import { REPLAY_SCRIPT, type TraceToken } from '@/content/replay';
import type { ReplayUi } from '@/content/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useReplay } from '@/hooks/useReplay';
import { useReveal } from '@/hooks/useReveal';
import { buildTimeline } from '@/lib/buildTimeline';
import s from './ChatReplay.module.css';

const TOKEN_CLASS: Record<TraceToken['kind'], string | undefined> = {
  kw: s.kw,
  rule: s.rule,
  fn: s.fn,
  str: s.str,
  dim: s.dim,
  plain: undefined,
};

/** Mantiene el panel pegado al final mientras se agregan líneas. */
function useStickToBottom<T extends HTMLElement>(count: number, enabled: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (el === null || !enabled) return;
    el.scrollTop = el.scrollHeight;
  }, [count, enabled]);
  return ref;
}

export function ChatReplay({ ui }: { ui: ReplayUi }) {
  const timeline = useMemo(() => buildTimeline(REPLAY_SCRIPT), []);
  const reducedMotion = usePrefersReducedMotion();
  const { state, containerRef, replay } = useReplay(timeline, reducedMotion);

  // Con reduced motion el estado ya llega completo: mover el scroll solo
  // porque sí es exactamente el tipo de movimiento que el usuario pidió evitar.
  const chatRef = useStickToBottom<HTMLDivElement>(state.messages.length, !reducedMotion);
  const traceRef = useStickToBottom<HTMLOListElement>(state.traces.length, !reducedMotion);

  const animate = !reducedMotion;

  return (
    <div className={`${s.replay} reveal`} id="replay" ref={useReveal<HTMLDivElement>()}>
      <div className={s.head}>
        <p className={`label ${s.label}`}>{ui.headLabel}</p>
        <button type="button" className={s.button} onClick={replay}>
          <span aria-hidden="true">↻</span> {ui.replayButton}
        </button>
      </div>

      <div className={s.panes} ref={containerRef}>
        <div className={s.chat}>
          <div className={s.chatTop}>
            <div className={s.avatar} aria-hidden="true">
              fa
            </div>
            <div>
              <div className={s.who}>{ui.chatWho}</div>
              <div className={s.status}>{ui.chatStatus}</div>
            </div>
          </div>

          <div
            className={s.log}
            ref={chatRef}
            role="log"
            aria-live="polite"
            aria-label={ui.logAriaLabel}
            lang="es-AR"
          >
            <div className={s.day}>{ui.chatDayDivider}</div>

            {state.messages.map((msg, i) => (
              <div
                key={`${i}-${msg.time}`}
                className={[s.msg, msg.kind === 'user' ? s.user : s.agent, animate ? s.enter : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>{msg.text}</span>
                <span className={s.time}>{msg.time + (msg.kind === 'user' ? ' ✓✓' : '')}</span>
              </div>
            ))}

            {state.typing && (
              <div className={`${s.msg} ${s.agent} ${s.typing}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
        </div>

        <div className={s.trace}>
          <div className={s.traceTop}>
            <b>{ui.traceTitle}</b>
            <span>{ui.traceSubtitle}</span>
          </div>

          <ol className={s.traceLog} ref={traceRef} aria-label={ui.traceAriaLabel}>
            {state.traces.map((line, i) => (
              <li key={i}>
                <span>
                  {line.tokens.map((token, j) => (
                    <span key={j} className={TOKEN_CLASS[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </li>
            ))}

            {state.cursor && animate && (
              <li className={s.cursorLine} aria-hidden="true">
                <span>
                  <span className={s.cursor} />
                </span>
              </li>
            )}
          </ol>
        </div>
      </div>

      <p className={s.caption}>
        <span>{ui.caption}</span>
        <span>{ui.captionRight}</span>
      </p>
    </div>
  );
}
