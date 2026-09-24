import { BUEN_INVENTARIO_URL } from '@/content/facts';
import type { TicketMock as TicketContent } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import s from './TicketMock.module.css';

const HOST = 'bueninventario.com';

/**
 * Maqueta de la caja de Buen Inventario.
 *
 * Todo el interior es `aria-hidden` y el conjunto se anuncia como una sola
 * imagen con su descripción: para un lector de pantalla esto es un dibujo, no
 * una tabla de precios que se pueda recorrer celda por celda.
 *
 * El contenido va en español en los dos idiomas: es una captura de un producto
 * argentino. Traducir "Cobrar" sería mostrar un producto que no existe.
 */
export function TicketMock({ ticket }: { ticket: TicketContent }) {
  return (
    <figure className={`${s.frame} reveal`} ref={useReveal<HTMLElement>()}>
      <div className={s.browser} role="img" aria-label={ticket.ariaLabel}>
        <div className={s.bar} aria-hidden="true">
          <span className={s.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={s.url}>
            <b>{HOST}</b>
            {ticket.browserUrlPath}
          </span>
        </div>

        <div className={s.app} lang="es-AR" aria-hidden="true">
          <div className={s.top}>
            <span className={s.logo}>
              <i />
              Buen Inventario
            </span>
            <span className={s.pill}>{ticket.statusPill}</span>
          </div>

          <div className={s.ticket}>
            <div className={s.ticketHead}>
              {ticket.ticketTitle} <span>{ticket.ticketNumber}</span>
            </div>

            <table className={s.table}>
              <thead>
                <tr>
                  <th>{ticket.columns.product}</th>
                  <th className={s.qty}>{ticket.columns.qty}</th>
                  <th className={s.price}>{ticket.columns.subtotal}</th>
                </tr>
              </thead>
              <tbody>
                {ticket.rows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td className={s.qty}>
                      <span>{row.qty}</span>
                    </td>
                    <td className={s.price}>{row.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={s.pay}>
              {ticket.payMethods.map((method, i) => (
                <span key={method} className={i === 0 ? s.on : undefined}>
                  {method}
                </span>
              ))}
            </div>

            <div className={s.total}>
              <span className={s.totalLabel}>{ticket.totalLabel}</span>
              <span className={s.totalAmount}>{ticket.totalAmount}</span>
            </div>

            <div className={s.actions}>
              <span className={`${s.action} ${s.ghost}`}>{ticket.actionGhost}</span>
              <span className={s.action}>{ticket.actionPrimary}</span>
            </div>
          </div>
        </div>
      </div>

      <figcaption className={s.note}>
        <span>{ticket.note}</span>
        <a href={BUEN_INVENTARIO_URL}>{HOST} ↗</a>
      </figcaption>
    </figure>
  );
}
