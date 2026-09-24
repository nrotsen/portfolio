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
 * El índice 01 / 02 / 03. El orden no es cronológico: primero el producto que
 * está en producción, después el caso con más ingeniería para mostrar, y al
 * final el open source.
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
