import type { Drills as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { Aside, Ctas, Highlights, Lead, Metrics } from '@/components/Project/Project';
import { CodeSnippet } from './CodeSnippet';
import { QuizCard } from './QuizCard';
import s from './Drills.module.css';

export function Drills({ project }: { project: Content }) {
  return (
    <article className="project grid" id="drills" aria-labelledby="drills-h">
      <Aside meta={project.meta} />

      <div className="body">
        <p className="kicker reveal" ref={useReveal<HTMLParagraphElement>()}>
          {project.kicker}
        </p>
        <h3 id="drills-h" className="ptitle sm reveal" ref={useReveal<HTMLHeadingElement>()}>
          {project.title}
        </h3>
        <Lead plain={project.plainLead} technical={project.oneLiner} />

        <div className={s.split}>
          <QuizCard quiz={project.quiz} />
          <CodeSnippet code={project.code} />
        </div>

        <div className={`${s.highlights} reveal`} ref={useReveal<HTMLDivElement>()}>
          <Highlights label={project.highlightsLabel} items={project.highlights} />
        </div>

        <Metrics items={project.metrics} />
        <Ctas items={project.ctas} />
      </div>
    </article>
  );
}
