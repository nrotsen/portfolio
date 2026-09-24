import type { SectionHead, SiteContent } from '@/content/types';
import { AndesDocs } from '@/components/AndesDocs/AndesDocs';
import { BuenInventario } from '@/components/BuenInventario/BuenInventario';
import { Drills } from '@/components/Drills/Drills';
import { FinanzasAgent } from '@/components/FinanzasAgent/FinanzasAgent';
import { Head } from '@/components/Project/Project';

interface Props {
  head: SectionHead;
  projects: SiteContent['projects'];
}

/**
 * El índice 01 a 04. El orden no es cronológico ni por gusto propio: primero
 * el trabajo en relación de dependencia, que es lo que busca quien contrata;
 * después el SaaS propio en producción, después el caso con más ingeniería
 * para mostrar, y al final el open source.
 */
export function ProjectIndex({ head, projects }: Props) {
  return (
    <section className="sec" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="grid">
          <Head head={head} id="work-h" />
        </div>

        <AndesDocs project={projects.andesDocs} />
        <BuenInventario project={projects.buenInventario} />
        <FinanzasAgent project={projects.finanzasAgent} />
        <Drills project={projects.drills} />
      </div>
    </section>
  );
}
