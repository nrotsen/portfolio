import type { SectionHead, SiteContent } from '@/content/types';
import { BuenInventario } from '@/components/BuenInventario/BuenInventario';
import { Drills } from '@/components/Drills/Drills';
import { FinanzasAgent } from '@/components/FinanzasAgent/FinanzasAgent';
import { Head } from '@/components/Project/Project';

interface Props {
  head: SectionHead;
  projects: SiteContent['projects'];
}

/**
 * Los proyectos propios. El trabajo en relación de dependencia vive en su
 * propia sección, arriba de esta.
 *
 * El orden no es cronológico: primero el SaaS que está en producción y tiene
 * usuarios reales, después el caso con más ingeniería para mostrar, y al final
 * el open source.
 */
export function ProjectIndex({ head, projects }: Props) {
  return (
    <section className="sec" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="grid">
          <Head head={head} id="work-h" />
        </div>

        <BuenInventario project={projects.buenInventario} />
        <FinanzasAgent project={projects.finanzasAgent} />
        <Drills project={projects.drills} />
      </div>
    </section>
  );
}
