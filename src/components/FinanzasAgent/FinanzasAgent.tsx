import type { FinanzasAgent as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { renderInline } from '@/lib/richText';
import { Aside, Ctas } from '@/components/Project/Project';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ChatReplay } from './ChatReplay';
import s from './FinanzasAgent.module.css';

export function FinanzasAgent({ project }: { project: Content }) {
  return (
    <article className="project grid" id="p02" aria-labelledby="p02-h">
      <Aside index="02" meta={project.meta} />

      <div className="body">
        <p className="kicker reveal" ref={useReveal<HTMLParagraphElement>()}>
          {project.kicker}
        </p>
        <h3 id="p02-h" className="ptitle sm reveal" ref={useReveal<HTMLHeadingElement>()}>
          {project.title}
        </h3>
        <p className="oneliner reveal" ref={useReveal<HTMLParagraphElement>()}>
          {project.oneLiner}
        </p>

        <ChatReplay ui={project.replay} />
        <ArchitectureDiagram diagram={project.architecture} />

        <div className={`${s.decisions} reveal`} ref={useReveal<HTMLDivElement>()}>
          {project.decisions.map((decision) => (
            <div className={s.decision} key={decision.id}>
              <p className={s.n}>{decision.id}</p>
              <h4>{decision.title}</h4>
              <p>{renderInline(decision.body)}</p>
            </div>
          ))}
        </div>

        <Ctas items={project.ctas} />
      </div>
    </article>
  );
}
