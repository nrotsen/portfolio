import type { BuenInventario as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { Aside, Ctas, Highlights, Metrics } from '@/components/Project/Project';
import { TicketMock } from './TicketMock';
import s from './BuenInventario.module.css';

export function BuenInventario({ project }: { project: Content }) {
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
        <p className="oneliner reveal" ref={useReveal<HTMLParagraphElement>()}>
          {project.oneLiner}
        </p>

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
