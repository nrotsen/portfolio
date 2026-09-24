import type { SiteContent } from './types';
import {
  ANDESDOCS_URL,
  BUEN_INVENTARIO_URL,
  DRILLS_APP_URL,
  DRILLS_HANDLE,
  DRILLS_URL,
  EMAIL,
  FACTS,
  FINANZAS_AGENT_URL,
  FULL_NAME,
  GITHUB_HANDLE,
  GITHUB_URL,
  LINKEDIN_HANDLE,
  LINKEDIN_URL,
  REPO_URL,
  formatNumber,
} from './facts';

const n = (value: number): string => formatNumber(value, 'en');

export const en: SiteContent = {
  lang: 'en',

  meta: {
    title: `${FULL_NAME} — Product engineer · full-stack`,
    description:
      'Product engineer, full-stack. I designed, built and run Buen Inventario, a SaaS for small Argentine retailers. Case studies: Buen Inventario, finanzas-agent, software-engineering-drills.',
    ogImageAlt: `${FULL_NAME} — product engineer, full-stack. Argentina, works remote.`,
    ogLocale: 'en_US',
  },

  skipToContent: 'Skip to content',

  nav: {
    markAriaLabel: `${FULL_NAME} — home`,
    markRole: '/ product engineer',
    primaryAriaLabel: 'Primary',
    menuLabel: 'Menu',
    links: [
      { href: '#experience', label: 'Experience' },
      { href: '#work', label: 'Projects' },
      { href: '#how', label: 'How I work' },
      { href: '#contact', label: 'Contact' },
    ],
    langSwitch: {
      groupLabel: 'Language',
      otherLabel: 'Ver en español',
    },
    themeToggle: {
      label: 'Dark theme',
    },
  },

  hero: {
    eyebrowMain: 'Product engineer · full-stack · Argentina',
    eyebrowAside: 'Works remote',
    headline: 'I build products end to end — from the *database* to the *checkout button*.',
    sub: "I'm the main developer on Andes Docs, a contract platform Argentine companies use every day, and I designed, built and run Buen Inventario, a SaaS for small shops. I like the unglamorous parts: idempotent webhooks, honest numbers, tests that guard the architecture.",
    ctas: [
      { label: 'See the work', href: '#experience', external: false },
      { label: 'GitHub', href: GITHUB_URL, external: true },
    ],
    facts: [
      {
        value: n(FACTS.yearsProfessional),
        caption: 'years building and shipping production software',
      },
      {
        value: n(FACTS.productsInDailyUse),
        caption: 'products in daily use — one at work, one my own',
      },
      { value: `${n(FACTS.testFiles)}+`, caption: 'test files in the SaaS I built and run' },
    ],
  },

  experience: { label: 'Where I work', title: 'Experience' },
  work: { label: 'Built on my own', title: 'Projects' },

  projects: {
    andesDocs: {
      kicker: 'Current role · B2B SaaS · 2023 → today',
      title: 'Andes Docs',
      plainLead:
        'A contract platform used by Argentine real-estate agencies, property developers, transport companies and legal teams. They build a document by answering a few questions, sign it with full legal validity, and get warned before it expires — without leaving the browser.',
      oneLiner:
        'I work across the whole stack: the REST APIs in Node and TypeScript, the React interfaces on top of them, and the integrations the product leans on — e-signature, authentication, listings, email and WhatsApp.',
      meta: {
        yearLabel: 'Year',
        year: 'Jun 2023 → today',
        roleLabel: 'Role',
        role: 'Fullstack developer',
        stackLabel: 'Stack',
        stack: [
          'Node.js',
          'TypeScript',
          'Express',
          'React',
          'Material UI',
          'Redux Toolkit',
          'Jotai',
          'DynamoDB',
          'S3',
          'Auth0',
          'ZapSign',
          '.NET',
          'SendGrid',
          'WhatsApp API',
        ],
      },
      lifecycle: {
        sectionLabel: 'What the platform does',
        svgTitle:
          'The document lifecycle in Andes Docs, in four steps: create a document by answering questions against the company templates; store, negotiate and share it in the cloud; sign it electronically with legal validity; and track renewals and expiry dates.',
        steps: [
          {
            index: '01',
            title: 'Create',
            body: 'Answer a few questions; the document builds itself.',
          },
          {
            index: '02',
            title: 'Collaborate',
            body: 'Stored, negotiated and shared in the cloud.',
          },
          {
            index: '03',
            title: 'Sign',
            body: 'Electronic signature, legally valid.',
          },
          {
            index: '04',
            title: 'Track',
            body: 'Renewals and expiry dates, watched.',
          },
        ],
      },
      highlightsLabel: 'What I did',
      highlights: [
        {
          title: 'Primary developer on the platform.',
          body: 'I took primary ownership of development and ship features end to end, from the data model to the screen.',
        },
        {
          title: 'Proof that stands up to an auditor.',
          body: 'An anti-money-laundering feature that embeds watchlist-screening results inside the signed PDF itself. Clients with reporting obligations get one tamper-evident document instead of a contract plus a separate report nobody can tie back to it.',
        },
        {
          title: 'A weekend rebuild to remove a single point of failure.',
          body: 'The vendor behind the document-editing integration discontinued it. I wrote a `.NET` microservice from scratch to replace it over a weekend, and the dependency on an outside company went away with it.',
        },
        {
          title: 'The integrations the product leans on.',
          body: 'ZapSign for e-signature, webhooks and the state machine around them; Auth0 for authentication and per-role permissions; Tokko Broker for real-estate listings, with encrypted credentials; SendGrid and the WhatsApp API for everything the platform sends out.',
        },
        {
          title: 'Queries that stay fast as the documents pile up.',
          body: 'DynamoDB access patterns backed by GSIs instead of scans, and S3 for document storage.',
        },
      ],
      metrics: [
        { value: '120+', caption: 'companies on the platform', isText: false },
        { value: '50,000+', caption: 'documents generated', isText: false },
        { value: '30,000+', caption: 'signed electronically', isText: false },
        { value: 'Real estate · transport · legal', caption: 'who uses it', isText: true },
      ],
      metricsNote:
        'Figures published by Andes Docs on their own site. They describe the platform, not my individual contribution.',
      ctas: [{ label: 'Visit Andes Docs', href: ANDESDOCS_URL, external: true }],
    },

    buenInventario: {
      kicker: 'Featured · SaaS · 2025 → today',
      title: 'Buen Inventario',
      plainLead:
        'Argentine shop owners use it every day to ring up sales, keep stock straight, let regulars buy on credit and issue tax invoices. I designed it, built it and keep it running.',
      oneLiner:
        "The all-in-one back office for small Argentine shops: stock, point of sale, customer credit, ARCA e-invoicing and an online store — built for owners who'd rather not read a manual.",
      meta: {
        yearLabel: 'Year',
        year: '2025 → today',
        roleLabel: 'Role',
        role: 'Designed, built, runs it',
        stackLabel: 'Stack',
        stack: [
          'TypeScript',
          'React 19',
          'Vite',
          'Tailwind v4',
          'TanStack Query',
          'Zustand',
          'shadcn/ui',
          'Node / Express 5',
          'Socket.io',
          'DynamoDB',
          'S3',
          'KMS',
          'Mercado Pago',
          'ARCA SOAP',
          'Vercel',
        ],
      },
      highlightsLabel: 'Highlights',
      highlights: [
        {
          title: 'Tax invoicing that survives outages.',
          body: 'ARCA (AFIP) e-invoicing over SOAP with an emission worker, invoice-number reservation, credit notes, a reconcile cron and certificate-expiry alerts.',
        },
        {
          title: 'Multi-tenant on DynamoDB, no runtime scans.',
          body: 'Every access pattern is a key or GSI query partitioned by company; scans only exist in migration scripts.',
        },
        {
          title: 'Payments without double charges.',
          body: 'Mercado Pago payments and subscriptions with webhooks deduplicated by payment id.',
        },
        {
          title: 'A counter-ready PWA.',
          body: 'Installable admin with barcode scanning (native `BarcodeDetector` + ZXing WASM fallback), virtualised tables and real-time sync over Socket.io.',
        },
        {
          title: 'A landing you can use, not just read.',
          body: "The hero is an interactive demo — sell, sell on credit, close the register — prerendered to static HTML; the build fails if the demo didn't render.",
        },
      ],
      ticket: {
        ariaLabel:
          'Mock-up of the Buen Inventario point of sale: a ticket with four items, a total of $20.650 and a Cobrar button.',
        browserUrlPath: '/demo',
        statusPill: 'Caja abierta',
        ticketTitle: 'Venta',
        ticketNumber: 'Ticket 0042',
        columns: { product: 'Producto', qty: 'Cant.', subtotal: 'Subtotal' },
        rows: [
          { name: 'Yerba mate 1 kg', qty: '2', subtotal: '$9.800' },
          { name: 'Leche entera 1 L', qty: '3', subtotal: '$4.350' },
          { name: 'Pan lactal', qty: '1', subtotal: '$2.900' },
          { name: 'Galletitas surtidas', qty: '2', subtotal: '$3.600' },
        ],
        payMethods: ['Efectivo', 'Débito', 'Mercado Pago', 'Fiado'],
        totalLabel: 'Total',
        totalAmount: '$20.650',
        actionGhost: 'Fiar',
        actionPrimary: 'Cobrar',
        note: 'Their product, their brand — illustrative mock-up',
      },
      metrics: [
        { value: n(FACTS.repos), caption: 'repos', isText: false },
        {
          value: `~${n(FACTS.commitsBuenInventario)}`,
          caption: `commits in ${FACTS.monthsShipping} months`,
          isText: false,
        },
        { value: `${n(FACTS.testFiles)}+`, caption: 'test files', isText: false },
        { value: 'Lighthouse CI', caption: '+ bundle budgets', isText: true },
      ],
      ctas: [
        { label: 'Try the live demo', href: BUEN_INVENTARIO_URL, external: true },
        { label: 'Visit site', href: BUEN_INVENTARIO_URL, external: true },
      ],
    },

    finanzasAgent: {
      kicker: 'AI agent · Serverless · 2026',
      title: 'finanzas-agent',
      plainLead:
        'I text a WhatsApp number what I spent, and it lands in my budget spreadsheet — no app to open, no form to fill in. It also reminds me before a bill is due.',
      oneLiner:
        'A personal-finance agent that lives in WhatsApp. I text what I spent, earned or owe; Claude turns it into rows in a Google Sheet and reminds me before bills are due. About US$2/month on AWS.',
      meta: {
        yearLabel: 'Year',
        year: '2026',
        roleLabel: 'Role',
        role: 'Author',
        stackLabel: 'Stack',
        stack: [
          'Python 3.12',
          'AWS Lambda',
          'API Gateway',
          'DynamoDB',
          'Secrets Manager',
          'SAM',
          'Claude API',
          'Meta Cloud API',
          'Google Sheets API',
        ],
      },
      replay: {
        headLabel: 'Replay · WhatsApp ⇄ trace',
        replayButton: 'Replay',
        chatWho: 'finanzas-agent',
        chatStatus: 'online',
        chatDayDivider: 'hoy',
        traceTitle: 'Under the hood',
        traceSubtitle: 'agent_runner · tool use',
        traceAriaLabel: 'Agent trace',
        logAriaLabel: 'Conversation replay',
        caption: 'Replay of a real conversation. The agent speaks Rioplatense Spanish.',
        captionRight: 'rule · tool_use · result',
      },
      architecture: {
        sectionLabel: 'Architecture',
        svgTitle:
          'WhatsApp goes to the Meta Cloud API, then API Gateway, then the webhook Lambda, which hands off asynchronously to the agent-runner Lambda. The runner talks to Claude with tool use and reads Secrets Manager on cold start. Conversation state goes through ConversationStore into DynamoDB with a 24-hour TTL. User data only goes through the DataAdapter: Google Sheets in production, DynamoDB planned, in-memory in tests.',
        caption:
          'Blue = the async hand-off that lets the webhook answer Meta in under a second. Conversation state and user data are kept apart: the tools only see the DataAdapter; dashed = planned or test-only.',
        lanes: {
          edge: 'EDGE',
          compute: 'COMPUTE',
          state: 'RUNTIME STATE',
          userData: 'USER DATA',
        },
        labels: {
          webhookSub: 'HMAC · allowlist',
          asyncInvoke: 'async invoke',
          runnerSub: 'bounded tool-use loop',
          claudeSub: 'tool use',
          coldStart: 'cold start',
          conversationStoreSub: 'history · idempotency',
          dynamoChatSub: 'chat · TTL 24h',
          dataAdapterSub: 'interface · 15 tools',
          sheetsSub: 'in production',
          dynamoPlannedSub: 'phase 2',
          inMemory: 'In-memory',
          inMemorySub: 'tests',
        },
      },
      decisionsLabel: 'Decisions',
      decisions: [
        {
          id: 'D1',
          title: 'Answer Meta in under a second.',
          body: 'Meta retries after ~5s, so the webhook only validates the HMAC, checks the allowlist and hands off asynchronously; the LLM work happens in a second Lambda.',
        },
        {
          id: 'D2',
          title: 'Idempotent by message id.',
          body: 'Async invokes are at-least-once; the runner short-circuits on an already-processed message.',
        },
        {
          id: 'D3',
          title: "The agent doesn't know where data lives.",
          body: 'A `DataAdapter` interface: Sheets today, DynamoDB tomorrow, in-memory in tests. 15 tools, bounded tool-use loop.',
        },
      ],
      ctas: [{ label: 'Read the code', href: FINANZAS_AGENT_URL, external: true }],
    },

    drills: {
      kicker: 'Open source · Learning tool · 2026',
      title: 'software-engineering-drills',
      plainLead:
        'A free study tool for developers preparing for interviews: short exercises on the fundamentals, with an explanation of why each answer is right. Open source, and anyone can use it in the browser.',
      oneLiner:
        'An active-recall trainer for software engineering fundamentals — OOP, modelling, concurrency and design patterns — with one core and two frontends: a CLI and a web app.',
      meta: {
        yearLabel: 'Year',
        year: '2026',
        roleLabel: 'Role',
        role: 'Author · MIT',
        stackLabel: 'Stack',
        stack: [
          'TypeScript',
          'React 19',
          'React Router 7',
          'Vite',
          'Tailwind v4',
          'Vitest',
          'Inquirer',
        ],
      },
      highlightsLabel: 'Highlights',
      highlights: [
        {
          title: 'One core, two frontends.',
          body: 'Grading is written once and shared by the CLI and the React app.',
        },
        {
          title: 'Architecture enforced by a test.',
          body: '`architecture.test.ts` fails if the core imports from the CLI, the web app, React or Node built-ins.',
        },
        {
          title: 'One contract, three repositories.',
          body: 'Progress storage has three implementations passing the same `describe.each` contract suite.',
        },
        {
          title: 'Content as a discriminated union.',
          body: `${n(FACTS.drillItems)} items across 4 sections and 3 levels, plus ${n(FACTS.drillDiagrams)} SVG diagrams guarded by an orphan/missing-diagram test.`,
        },
      ],
      quiz: {
        ariaLabel:
          'A real drill from the repo: which pattern is withRetry, and how do you recognise it? The correct answer is Decorator — it takes X and returns X with an extra capability.',
        section: 'Design patterns · level 2',
        format: 'multiple choice',
        question: 'Which pattern is this, and how do you recognise it?',
        snippetCaption: 'the drill shows this first',
        options: [
          { letter: 'A', text: 'Decorator: takes X, returns X with an extra capability.' },
          {
            letter: 'B',
            text: 'Adapter: couples `UserRepository` to a client with a different signature.',
          },
          { letter: 'C', text: 'Proxy: intercepts every method with a retry policy.' },
          { letter: 'D', text: 'Strategy: picks the retry policy at runtime.' },
        ],
        correctIndex: 0,
        correctMark: 'correct',
        whyLabel: 'Why:',
        why: 'The signature is the giveaway: it takes interface X and returns interface X. That is what lets you stack them in any order.',
        source: 'Real item `d2-c1a`, translated from the repo.',
      },
      code: {
        file: 'architecture.test.ts',
        caption: 'the idea, simplified',
      },
      metrics: [
        { value: n(FACTS.drillItems), caption: 'items', isText: false },
        { value: n(FACTS.drillDiagrams), caption: 'diagrams', isText: false },
        { value: n(FACTS.drillTests), caption: 'tests', isText: false },
        { value: 'MIT', caption: 'licence', isText: false },
      ],
      ctas: [
        { label: 'Try the drills', href: DRILLS_APP_URL, external: true },
        { label: DRILLS_HANDLE, href: DRILLS_URL, external: true },
      ],
    },
  },

  how: { label: 'Principles', title: 'How I work' },

  principles: [
    {
      title: 'Design doc before code.',
      body: 'Non-trivial work starts as a dated plan with the trade-offs written down — the repos keep them in `docs/plans/`.',
    },
    {
      title: 'Tests that protect decisions, not just functions.',
      body: "Architecture tests, contract suites, a build that fails when the demo doesn't render.",
    },
    {
      title: 'Boring reliability.',
      body: 'Idempotency keys, fail-closed defaults, least-privilege IAM, secrets out of the repo.',
    },
    {
      title: 'Honest products.',
      body: "No fake social proof, no dark patterns; if a number is on the page, it's true.",
    },
  ],

  contactHead: { label: 'Contact', title: 'Contact' },

  contact: {
    headline: "Let's build something that works on a *Monday morning*.",
    sub: 'Open to senior product / full-stack roles, remote.',
    links: [
      { key: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, external: false },
      { key: 'GitHub', value: GITHUB_HANDLE, href: GITHUB_URL, external: true },
      { key: 'LinkedIn', value: LINKEDIN_HANDLE, href: LINKEDIN_URL, external: true },
    ],
  },

  footer: {
    copyright: `© 2026 ${FULL_NAME}`,
    builtWith: 'Built with React + Vite',
    sourceLabel: 'source',
    sourceHref: REPO_URL,
  },
};
