import type { Footer as FooterContent } from '@/content/types';
import s from './Footer.module.css';

export function Footer({ footer }: { footer: FooterContent }) {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.inner}`}>
        <span>{footer.copyright}</span>
        <span>
          {footer.builtWith} · <a href={footer.sourceHref}>{footer.sourceLabel}</a>
        </span>
      </div>
    </footer>
  );
}
