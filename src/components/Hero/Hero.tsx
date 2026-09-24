import type { Fact, Hero as HeroContent } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { renderInline } from '@/lib/richText';
import { Cta } from '@/components/Cta/Cta';
import s from './Hero.module.css';

const COLUMNS = Array.from({ length: 12 }, (_, i) => i);

/**
 * El "+" de "290+" se sube como `<sup>` y se pinta en cobalto — es tipografía,
 * no dato, así que la decisión vive acá y no en el diccionario, que solo dice
 * "290+".
 */
function FactNumber({ value }: { value: string }) {
  if (!value.endsWith('+')) return <>{value}</>;
  return (
    <>
      {value.slice(0, -1)}
      <sup>+</sup>
    </>
  );
}

function FactCell({ fact }: { fact: Fact }) {
  return (
    <div className={s.fact}>
      <div className={s.num}>
        <FactNumber value={fact.value} />
      </div>
      <p className={s.cap}>{fact.caption}</p>
    </div>
  );
}

export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className={s.hero} id="top" aria-labelledby="hero-h">
      <div className={s.cols} aria-hidden="true">
        <div className="wrap">
          <div className="grid">
            {COLUMNS.map((i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className={`wrap ${s.inner}`}>
        <div className="grid">
          <p className={`${s.eyebrow} label reveal`} ref={useReveal<HTMLParagraphElement>()}>
            <span className={s.live}>{hero.eyebrowMain}</span>
            <span>· {hero.eyebrowAside}</span>
          </p>

          <h1 id="hero-h" className={`${s.headline} reveal`} ref={useReveal<HTMLHeadingElement>()}>
            {renderInline(hero.headline)}
          </h1>

          <p className={`${s.sub} reveal`} ref={useReveal<HTMLParagraphElement>()}>
            {hero.sub}
          </p>

          <div className={`${s.ctas} reveal`} ref={useReveal<HTMLDivElement>()}>
            {hero.ctas.map((cta) => (
              <Cta key={cta.label} cta={cta} primary={cta === hero.ctas[0]} />
            ))}
          </div>

          <div className={`${s.facts} reveal`} ref={useReveal<HTMLDivElement>()}>
            {hero.facts.map((fact) => (
              <FactCell key={fact.caption} fact={fact} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
