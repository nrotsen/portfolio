import type { BuenInventario as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { Aside, Ctas, Highlights, Lead, Metrics } from '@/components/Project/Project';
import { TicketMock } from './TicketMock';
import s from './BuenInventario.module.css';

export function BuenInventario({ project }: { project: Content }) {
  return (
    <article className="project grid" id="p02" aria-labelledby="p02-h">
      <Aside meta={project.meta} />

      <div className="body">
        <p className="kicker reveal" ref={useReveal<HTMLParagraphElement>()}>
          {project.kicker}
        </p>
        <h3 id="p02-h" className="ptitle reveal" ref={useReveal<HTMLHeadingElement>()}>
          {project.title}
        </h3>
        <Lead plain={project.plainLead} technical={project.oneLiner} />

        <div className={s.split}>
          <TicketMock ticket={project.ticket} />

          <div className="reveal" ref={useReveal<HTMLDivElement>()}>
            <Highlights label={project.highlightsLabel} items={project.highlights} />
          </div>
        </div>

        <Metrics items={project.metrics} />
        <Ctas items={project.ctas} />
      </div>
    </article>
  );
}
