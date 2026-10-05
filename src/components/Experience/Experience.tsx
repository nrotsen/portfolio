import type { PastRole as PastRoleContent, SectionHead, SiteContent } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { AndesDocs } from '@/components/AndesDocs/AndesDocs';
import { Head } from '@/components/Project/Project';

interface Props {
  head: SectionHead;
  projects: SiteContent['projects'];
}

/**
 * Un trabajo anterior, con la misma grilla que un proyecto pero sin stack,
 * diagrama ni métricas: se cuenta lo que hay.
 */
function PastRole({ role, id }: { role: PastRoleContent; id: string }) {
  return (
    <article className="project grid" id={id} aria-labelledby={`${id}-h`}>
      <aside className="side">
        <dl className="meta">
          <div>
            <dt>{role.yearLabel}</dt>
            <dd>{role.year}</dd>
          </div>
          <div>
            <dt>{role.roleLabel}</dt>
            <dd>{role.role}</dd>
          </div>
        </dl>
      </aside>

      <div className="body">
        <p className="kicker reveal" ref={useReveal<HTMLParagraphElement>()}>
          {role.kicker}
        </p>
        <h3 id={`${id}-h`} className="ptitle sm reveal" ref={useReveal<HTMLHeadingElement>()}>
          {role.title}
        </h3>
        <p className="lead reveal" ref={useReveal<HTMLParagraphElement>()}>
          {role.body}
        </p>
      </div>
    </article>
  );
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
        <PastRole role={projects.applash} id="applash" />
      </div>
    </section>
  );
}
