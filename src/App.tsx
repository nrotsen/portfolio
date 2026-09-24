import type { SiteContent } from '@/content/types';
import { Contact } from '@/components/Contact/Contact';
import { Experience } from '@/components/Experience/Experience';
import { Footer } from '@/components/Footer/Footer';
import { Hero } from '@/components/Hero/Hero';
import { Nav } from '@/components/Nav/Nav';
import { Principles } from '@/components/Principles/Principles';
import { ProjectIndex } from '@/components/ProjectIndex/ProjectIndex';

/**
 * La página entera, en un idioma.
 *
 * Recibe el diccionario y no lo importa: `App` no sabe que existen `en.ts` y
 * `es.ts`, ni puede preguntarle el idioma a `navigator`. Quien elige es la URL
 * —`/` o `/es`— y eso pasa una sola vez, en `entry-server.tsx` y `main.tsx`.
 */
export function App({ content }: { content: SiteContent }) {
  return (
    <>
      <a className="skip" href="#main">
        {content.skipToContent}
      </a>

      <Nav nav={content.nav} lang={content.lang} />

      <main id="main">
        <Hero hero={content.hero} />
        <Experience head={content.experience} projects={content.projects} />
        <ProjectIndex head={content.work} projects={content.projects} />
        <Principles head={content.how} items={content.principles} />
        <Contact head={content.contactHead} contact={content.contact} />
      </main>

      <Footer footer={content.footer} />
    </>
  );
}

export default App;
