import type { SectionHead, SiteContent } from '@/content/types';
import { AndesDocs } from '@/components/AndesDocs/AndesDocs';
import { Head } from '@/components/Project/Project';

interface Props {
  head: SectionHead;
  projects: SiteContent['projects'];
}

/**
 * Experiencia laboral, separada de los proyectos propios.
 *
 * Son dos cosas distintas y mezclarlas le pedía al lector que dedujera cuál es
 * cuál por la ficha lateral. Un trabajo tiene equipo, CTO, clientes que pagan y
 * decisiones que no son solo mías; un proyecto propio no. Quien contrata mira
 * primero esto, así que va primero y con su propio título.
 */
export function Experience({ head, projects }: Props) {
  return (
    <section className="sec" id="experience" aria-labelledby="experience-h">
      <div className="wrap">
        <div className="grid">
          <Head head={head} id="experience-h" />
        </div>

        <AndesDocs project={projects.andesDocs} />
      </div>
    </section>
  );
}
