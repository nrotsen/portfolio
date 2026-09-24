import type { Contact as ContactContent, SectionHead } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { renderInline } from '@/lib/richText';
import s from './Contact.module.css';

interface Props {
  head: SectionHead;
  contact: ContactContent;
}

export function Contact({ head, contact }: Props) {
  return (
    <section className="sec" id="contact" aria-labelledby="contact-h">
      <div className="wrap grid">
        <div className="side">
          <p className="label">{head.label}</p>
        </div>

        <div className="body">
          <h2
            id="contact-h"
            className={`${s.headline} reveal`}
            ref={useReveal<HTMLHeadingElement>()}
          >
            {renderInline(contact.headline)}
          </h2>

          <p className={`${s.sub} reveal`} ref={useReveal<HTMLParagraphElement>()}>
            {contact.sub}
          </p>

          <ul className={`${s.links} reveal`} ref={useReveal<HTMLUListElement>()}>
            {contact.links.map((link) => (
              <li key={link.key}>
                <a href={link.href}>
                  <span className={s.key}>{link.key}</span>
                  <span className={s.value}>{link.value}</span>
                  <span className={s.arrow} aria-hidden="true">
                    {link.external ? '↗' : '→'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
