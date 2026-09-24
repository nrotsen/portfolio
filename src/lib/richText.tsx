import { Fragment, type ReactNode } from 'react';

/**
 * Marcado inline mínimo para el copy de los diccionarios.
 *
 *   `código`  → <code>
 *   *acento*  → <em class="accent">  (cobalto, sin cursiva)
 *
 * Existe para que `src/content/*.ts` siga siendo texto plano: un traductor
 * puede mover un `código` de lugar sin tocar JSX, y no hay
 * `dangerouslySetInnerHTML` en ninguna parte del sitio.
 *
 * Deliberadamente NO hay marcador con guion bajo: el copy está lleno de
 * `tool_use`, `agent_runner` y `wa_id`, y un par suelto se comería el medio.
 */

const TOKEN = /(`[^`]+`|\*[^*]+\*)/g;

export function renderInline(text: string): ReactNode {
  const parts = text.split(TOKEN).filter((part) => part !== '');

  return parts.map((part, i) => {
    const key = `${i}-${part}`;

    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }

    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={key} className="accent">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <Fragment key={key}>{part}</Fragment>;
  });
}

/** La versión sin marcado, para `aria-label`, `<title>` y metadatos. */
export function stripInline(text: string): string {
  return text.replace(/[`*]/g, '');
}
