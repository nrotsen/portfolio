import type { Background as BackgroundContent } from '@/content/types';
import s from './Background.module.css';

/**
 * Skills, formación, certificaciones e idiomas: lo que un CV lleva al final.
 *
 * Va después de los principios y sin animación a propósito. Es una tabla para
 * escanear, no un caso para leer: quien llega hasta acá está buscando una
 * palabra puntual.
 */
export function Background({ background }: { background: BackgroundContent }) {
  return (
    <section className="sec" id="background" aria-labelledby="background-h">
      <div className="wrap grid">
        <div className="side">
          <p className="label">{background.head.label}</p>
          <h2 id="background-h" className={s.title}>
            {background.head.title}
          </h2>
        </div>

        <div className="body">
          {background.groups.map((group) => (
            <div className={s.group} key={group.label}>
              <h3 className="subhead">{group.label}</h3>
              <dl className={s.rows}>
                {group.rows.map((row) => (
                  <div key={row.key}>
                    <dt>{row.key}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
