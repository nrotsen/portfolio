import { FULL_NAME, pathFor } from '@/content/facts';
import type { Lang, Nav as NavContent } from '@/content/types';
import { LANGS } from '@/content/types';
import { rememberLang } from '@/lib/langPreference';
import s from './Nav.module.css';

const LANG_LABEL: Record<Lang, string> = { en: 'EN', es: 'ES' };

interface Props {
  nav: NavContent;
  lang: Lang;
}

/**
 * El switch de idioma son links de verdad, no botones.
 *
 * Cada idioma tiene su URL (`/` y `/es`) y su HTML prerenderizado, así que
 * cambiar de idioma es navegar: funciona sin JS, se puede compartir, y no hay
 * flash de idioma equivocado porque el documento ya llega traducido. El único
 * JS que corre es recordar la elección, para que la redirección de primera
 * visita no la pise en la próxima.
 */
function LangSwitch({ lang, groupLabel, otherLabel }: NavContent['langSwitch'] & { lang: Lang }) {
  return (
    <div className={s.lang} role="group" aria-label={groupLabel}>
      {LANGS.map((l, i) => {
        const current = l === lang;
        return (
          <span key={l}>
            {i > 0 && <span aria-hidden="true">/</span>}
            <a
              href={pathFor(l)}
              hrefLang={l}
              lang={l}
              aria-current={current ? 'true' : undefined}
              aria-label={current ? undefined : otherLabel}
              onClick={() => rememberLang(l)}
            >
              {LANG_LABEL[l]}
            </a>
          </span>
        );
      })}
    </div>
  );
}

export function Nav({ nav, lang }: Props) {
  return (
    <header className={s.nav}>
      <div className={`wrap ${s.inner}`}>
        <a className={s.mark} href="#top" aria-label={nav.markAriaLabel}>
          <i aria-hidden="true" />
          {FULL_NAME} <small>{nav.markRole}</small>
        </a>

        <div className={s.right}>
          <nav className={s.links} aria-label={nav.primaryAriaLabel}>
            {nav.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <LangSwitch lang={lang} {...nav.langSwitch} />
        </div>
      </div>
    </header>
  );
}
