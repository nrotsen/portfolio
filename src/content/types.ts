/**
 * El contrato que cumplen los dos idiomas.
 *
 * Todo el copy del sitio pasa por acá. Si se agrega un campo y un idioma no lo
 * tiene, `tsc` rompe — que es exactamente el punto: no hay forma de publicar
 * `/es` con un párrafo en inglés porque nadie lo tradujo.
 *
 * Los strings admiten un marcado inline mínimo (ver `src/lib/richText.tsx`):
 *   `código` → <code>
 *   *acento*  → <em class="accent">, que el CSS pinta en cobalto
 *
 * No hay marcador con guion bajo a propósito: el copy está lleno de `tool_use`,
 * `agent_runner` y `wa_id`, y cualquier par de guiones bajos sueltos se comería
 * el texto del medio.
 */

export type Lang = 'en' | 'es';

export const LANGS: readonly Lang[] = ['en', 'es'] as const;

export interface Meta {
  /** <title> y og:title */
  title: string;
  /** <meta name="description"> */
  description: string;
  /** alt de la imagen OG */
  ogImageAlt: string;
  /** og:locale */
  ogLocale: string;
}

export interface LangSwitch {
  /** Etiqueta del grupo de botones, para lectores de pantalla */
  groupLabel: string;
  /** Texto accesible del link al OTRO idioma */
  otherLabel: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface ThemeToggleLabels {
  /** El botón es un toggle: el estado lo cuenta `aria-pressed`, no la etiqueta. */
  label: string;
}

export interface Nav {
  markAriaLabel: string;
  /** Lo chiquito al lado del nombre; se oculta por debajo de 960px */
  markRole: string;
  primaryAriaLabel: string;
  /** El botón de menú en mobile: es un ícono, necesita nombre accesible. */
  menuLabel: string;
  links: readonly NavLink[];
  langSwitch: LangSwitch;
  themeToggle: ThemeToggleLabels;
}

export interface Cta {
  label: string;
  href: string;
  /** Con true se dibuja ↗ y se abre el link externo */
  external: boolean;
}

export interface Fact {
  value: string;
  /** Si el valor termina en "+", el signo se sube como <sup> */
  caption: string;
}

export interface Hero {
  eyebrowMain: string;
  eyebrowAside: string;
  /** Usa *acento* para las dos frases en cobalto */
  headline: string;
  sub: string;
  ctas: readonly [Cta, Cta];
  facts: readonly [Fact, Fact, Fact];
}

export interface SectionHead {
  label: string;
  title: string;
}

export interface ProjectMeta {
  yearLabel: string;
  year: string;
  roleLabel: string;
  role: string;
  stackLabel: string;
  stack: readonly string[];
}

export interface Highlight {
  /** Va en <strong> al principio del ítem */
  title: string;
  body: string;
}

export interface Metric {
  value: string;
  caption: string;
  /** true cuando el "número" es texto ("Lighthouse CI") y necesita partir línea */
  isText: boolean;
}

export interface ProjectBase {
  kicker: string;
  title: string;
  /**
   * Qué es y para quién, sin jerga. Va primero y en grande.
   *
   * Existe porque el resto de la página está escrita para alguien que sabe qué
   * es un access pattern, y quien abre un portfolio muchas veces no lo sabe.
   * No reemplaza nada: `oneLiner` sigue abajo con el detalle técnico.
   */
  plainLead: string;
  oneLiner: string;
  meta: ProjectMeta;
  ctas: readonly Cta[];
}

export interface TicketMock {
  /** aria-label del mock: describe lo que se ve, no la marca */
  ariaLabel: string;
  browserUrlPath: string;
  statusPill: string;
  ticketTitle: string;
  ticketNumber: string;
  columns: { product: string; qty: string; subtotal: string };
  rows: readonly { name: string; qty: string; subtotal: string }[];
  payMethods: readonly string[];
  totalLabel: string;
  totalAmount: string;
  actionGhost: string;
  actionPrimary: string;
  note: string;
}

export interface BuenInventario extends ProjectBase {
  metrics: readonly Metric[];
  highlightsLabel: string;
  highlights: readonly Highlight[];
  ticket: TicketMock;
}

export interface LifecycleStep {
  /** 01, 02, 03… */
  index: string;
  title: string;
  body: string;
}

export interface Lifecycle {
  sectionLabel: string;
  /** La única descripción del diagrama para un lector de pantalla */
  svgTitle: string;
  steps: readonly [LifecycleStep, LifecycleStep, LifecycleStep, LifecycleStep];
}

export interface AndesDocs extends ProjectBase {
  highlightsLabel: string;
  highlights: readonly Highlight[];
  lifecycle: Lifecycle;
  metrics: readonly Metric[];
  /**
   * De dónde salen las métricas. No es opcional a propósito: son números de
   * otra empresa, y publicarlos sin decir de quién son es exactamente la
   * prueba social prestada que el principio 04 dice no usar.
   */
  metricsNote: string;
}

export interface Decision {
  /** D1 / D2 / D3 */
  id: string;
  title: string;
  body: string;
}

export interface ReplayUi {
  headLabel: string;
  replayButton: string;
  chatWho: string;
  chatStatus: string;
  chatDayDivider: string;
  traceTitle: string;
  traceSubtitle: string;
  traceAriaLabel: string;
  logAriaLabel: string;
  caption: string;
  captionRight: string;
}

export interface ArchitectureDiagram {
  sectionLabel: string;
  /** <title> del SVG: la única descripción del diagrama para lectores de pantalla */
  svgTitle: string;
  caption: string;
  lanes: { edge: string; compute: string; state: string; userData: string };
  labels: {
    webhookSub: string;
    asyncInvoke: string;
    runnerSub: string;
    claudeSub: string;
    coldStart: string;
    conversationStoreSub: string;
    dynamoChatSub: string;
    dataAdapterSub: string;
    sheetsSub: string;
    dynamoPlannedSub: string;
    inMemory: string;
    inMemorySub: string;
  };
}

export interface FinanzasAgent extends ProjectBase {
  replay: ReplayUi;
  architecture: ArchitectureDiagram;
  decisionsLabel: string;
  decisions: readonly [Decision, Decision, Decision];
}

export interface QuizCard {
  ariaLabel: string;
  section: string;
  format: string;
  question: string;
  snippetCaption: string;
  options: readonly { letter: string; text: string }[];
  /** Índice de la opción correcta dentro de `options` */
  correctIndex: number;
  correctMark: string;
  whyLabel: string;
  why: string;
  source: string;
}

export interface CodeCard {
  file: string;
  caption: string;
}

export interface Drills extends ProjectBase {
  metrics: readonly Metric[];
  highlightsLabel: string;
  highlights: readonly Highlight[];
  quiz: QuizCard;
  code: CodeCard;
}

export interface Principle {
  title: string;
  body: string;
}

export interface Contact {
  /** Usa *acento* */
  headline: string;
  sub: string;
  links: readonly { key: string; value: string; href: string; external: boolean }[];
}

export interface Footer {
  copyright: string;
  builtWith: string;
  sourceLabel: string;
  sourceHref: string;
}

export interface SiteContent {
  lang: Lang;
  meta: Meta;
  skipToContent: string;
  nav: Nav;
  hero: Hero;
  experience: SectionHead;
  work: SectionHead;
  projects: {
    andesDocs: AndesDocs;
    buenInventario: BuenInventario;
    finanzasAgent: FinanzasAgent;
    drills: Drills;
  };
  how: SectionHead;
  principles: readonly [Principle, Principle, Principle, Principle];
  contactHead: SectionHead;
  contact: Contact;
  footer: Footer;
}
