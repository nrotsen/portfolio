import type { QuizCard as Content } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { renderInline } from '@/lib/richText';
import s from './Drills.module.css';

/**
 * El código del ítem `d2-c1a`, copiado del repo.
 *
 * No se traduce: es código real de `software-engineering-drills`, y la gracia
 * de la pregunta es reconocer el patrón por la firma — recibe `UserRepository`,
 * devuelve `UserRepository`.
 *
 * Lo único que cambió respecto del repo son los saltos de línea: la tarjeta
 * mide ~430px y las líneas originales, pensadas para 100 columnas, se cortaban.
 * Es el mismo código con otro ancho de impresión, no otro código.
 */
function Snippet() {
  return (
    <pre>
      <code>
        <span className={s.kw}>export function</span> <span className={s.fn}>withRetry</span>
        {'(\n  repo: UserRepository,\n  opts: RetryOpts,\n): UserRepository {\n'}
        {'  '}
        <span className={s.kw}>return</span>
        {' {\n'}
        {'    findById: (id) => retry(() => repo.findById(id), opts),\n'}
        {'    findByEmail: (e) => retry(() => repo.findByEmail(e), opts),\n'}
        {'    save: (u) => repo.save(u),\n'}
        {'  };\n}\n\n'}
        <span className={s.kw}>const</span>
        {' repo = '}
        <span className={s.fn}>withCache</span>
        {'(\n  '}
        <span className={s.fn}>withRetry</span>
        {'(new PgUserRepository(pool), { attempts: 3 }),\n'}
        {'  { ttlMs: 60_000 },\n);'}
      </code>
    </pre>
  );
}

/**
 * Una tarjeta de práctica real del repo, ya corregida.
 *
 * Es una imagen para lectores de pantalla (`role="img"` + `aria-label`) y no
 * una lista de opciones navegable: acá no se juega, se muestra cómo se ve el
 * producto. Quien quiera jugar tiene el link al repo abajo.
 */
export function QuizCard({ quiz }: { quiz: Content }) {
  return (
    <div
      className={`${s.quiz} reveal`}
      role="img"
      aria-label={quiz.ariaLabel}
      ref={useReveal<HTMLDivElement>()}
    >
      <div className={s.quizTop} aria-hidden="true">
        <span>{quiz.section}</span>
        <span>{quiz.format}</span>
      </div>

      <div aria-hidden="true">
        <p className={s.question}>{quiz.question}</p>

        <div className={s.snippet}>
          <Snippet />
        </div>
        <p className={s.snippetCap}>{quiz.snippetCaption}</p>

        <div className={s.options}>
          {quiz.options.map((option, i) => {
            const correct = i === quiz.correctIndex;
            return (
              <div key={option.letter} className={correct ? `${s.option} ${s.ok}` : s.option}>
                <span className={s.letter}>{option.letter}</span>
                <span>{renderInline(option.text)}</span>
                <span className={s.mark}>{correct ? `✓ ${quiz.correctMark}` : ''}</span>
              </div>
            );
          })}
        </div>

        <p className={s.why}>
          <b>{quiz.whyLabel}</b> {quiz.why}
        </p>
        <p className={s.source}>{renderInline(quiz.source)}</p>
      </div>
    </div>
  );
}
