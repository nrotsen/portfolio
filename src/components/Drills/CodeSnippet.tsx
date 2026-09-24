import type { CodeCard } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import s from './Drills.module.css';

/**
 * `architecture.test.ts`, simplificado.
 *
 * Es el highlight del repo puesto en pantalla: la regla "el core no conoce a
 * sus frontends" no está en un README, está en un test que falla.
 */
export function CodeSnippet({ code }: { code: CodeCard }) {
  return (
    <div className={`${s.code} reveal`} ref={useReveal<HTMLDivElement>()}>
      <div className={s.codeTop}>
        <b>{code.file}</b>
        <span>{code.caption}</span>
      </div>
      <pre>
        <code>
          <span className={s.comment}>{'// the core must not know its frontends'}</span>
          {'\n'}
          <span className={s.kw}>const</span>
          {' forbidden = [\n  '}
          <span className={s.str}>{'"../cli"'}</span>
          {', '}
          <span className={s.str}>{'"../web"'}</span>
          {', '}
          <span className={s.str}>{'"react"'}</span>
          {', '}
          <span className={s.bad}>{'/^node:/'}</span>
          {',\n];\n\n'}
          <span className={s.fn}>it</span>
          {'('}
          <span className={s.str}>{'"core imports nothing from the edges"'}</span>
          {', () => {\n  '}
          <span className={s.kw}>for</span>
          {' ('}
          <span className={s.kw}>const</span>
          {' file '}
          <span className={s.kw}>of</span>
          {' coreFiles)\n    '}
          <span className={s.kw}>for</span>
          {' ('}
          <span className={s.kw}>const</span>
          {' dep '}
          <span className={s.kw}>of</span> <span className={s.fn}>importsOf</span>
          {'(file))\n      '}
          <span className={s.fn}>expect</span>
          {'('}
          <span className={s.fn}>isForbidden</span>
          {'(dep)).'}
          <span className={s.fn}>toBe</span>
          {'('}
          <span className={s.kw}>false</span>
          {');\n});'}
        </code>
      </pre>
    </div>
  );
}
