import type { AndesDocs as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { Aside, Ctas, Highlights, Lead, Metrics } from '@/components/Project/Project';
import { LifecycleDiagram } from './LifecycleDiagram';
import s from './AndesDocs.module.css';

/**
 * El trabajo en relación de dependencia va primero, no último.
 *
 * Es el proyecto con más tiempo encima y el único donde hay un equipo, un CTO y
 * clientes que pagan. Quien abre esta página buscando a alguien para contratar
 * empieza por acá.
 */
export function AndesDocs({ project }: { project: Content }) {
  return (
    <article className="project grid" id="p01" aria-labelledby="p01-h">
      <Aside index="01" meta={project.meta} />

      <div className="body">
        <p className="kicker reveal" ref={useReveal<HTMLParagraphElement>()}>
          {project.kicker}
        </p>
        <h3 id="p01-h" className="ptitle reveal" ref={useReveal<HTMLHeadingElement>()}>
          {project.title}
        </h3>
        <Lead plain={project.plainLead} technical={project.oneLiner} />

        <LifecycleDiagram lifecycle={project.lifecycle} />

        <div className={`${s.highlights} reveal`} ref={useReveal<HTMLDivElement>()}>
          <Highlights label={project.highlightsLabel} items={project.highlights} />
        </div>

        <Metrics items={project.metrics} />
        <p className={s.note}>{project.metricsNote}</p>

        <Ctas items={project.ctas} />
      </div>
    </article>
  );
}
