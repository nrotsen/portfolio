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

const n = (value: number): string => formatNumber(value, 'es');

export const es: SiteContent = {
  lang: 'es',

  meta: {
    title: `${FULL_NAME} — Product engineer · full-stack`,
    description:
      'Product engineer, full-stack. Diseñé, construí y opero Buen Inventario, un SaaS para comercios argentinos. Casos: Buen Inventario, finanzas-agent, software-engineering-drills.',
    ogImageAlt: `${FULL_NAME} — product engineer, full-stack. Argentina, trabajo remoto.`,
    ogLocale: 'es_AR',
  },

  skipToContent: 'Saltar al contenido',

  nav: {
    markAriaLabel: `${FULL_NAME} — inicio`,
    markRole: '/ product engineer',
    primaryAriaLabel: 'Principal',
    links: [
      { href: '#work', label: 'Proyectos' },
      { href: '#p04', label: 'Open source' },
      { href: '#how', label: 'Cómo trabajo' },
      { href: '#contact', label: 'Contacto' },
    ],
    langSwitch: {
      groupLabel: 'Idioma',
      otherLabel: 'View in English',
    },
    themeToggle: {
      label: 'Tema oscuro',
    },
  },

  hero: {
    eyebrowMain: 'Product engineer · full-stack · Argentina',
    eyebrowAside: 'Trabajo remoto',
    headline:
      'Construyo productos de punta a punta: desde el *access pattern en DynamoDB* hasta el *botón de checkout*.',
    sub: 'Diseñé, construí y opero Buen Inventario, un SaaS con el que comercios argentinos manejan stock, ventas, cuentas corrientes y facturación electrónica. Me importan las partes poco vistosas: webhooks idempotentes, números honestos, tests que protegen la arquitectura.',
    ctas: [
      { label: 'Ver proyectos', href: '#work', external: false },
      { label: 'GitHub', href: GITHUB_URL, external: true },
    ],
    facts: [
      {
        value: `~${n(FACTS.commitsShipped)}`,
        caption: `commits en producción en ${FACTS.monthsShipping} meses`,
      },
      { value: `${n(FACTS.testFiles)}+`, caption: 'archivos de test' },
      { value: n(FACTS.repos), caption: 'repos en un producto' },
    ],
  },

  work: { index: 'A', label: 'Índice', title: 'Proyectos' },

  projects: {
    andesDocs: {
      kicker: 'Puesto actual · SaaS B2B · 2023 → hoy',
      title: 'Andes Docs',
      plainLead:
        'Una plataforma de contratos que usan inmobiliarias, desarrolladoras, empresas de transporte y equipos legales de Argentina. Arman un documento respondiendo unas preguntas, lo firman con validez jurídica y les avisa antes de que venza — todo desde el navegador.',
      oneLiner:
        'Trabajo sobre todo el stack: las APIs REST en Node y TypeScript, las interfaces de React que van encima, y las integraciones sobre las que se apoya el producto — firma electrónica, autenticación, propiedades, mails y WhatsApp.',
      meta: {
        yearLabel: 'Año',
        year: 'Jun 2023 → hoy',
        roleLabel: 'Rol',
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
        sectionLabel: 'Qué hace la plataforma',
        svgTitle:
          'El ciclo de vida de un documento en Andes Docs, en cuatro pasos: crear el documento respondiendo preguntas sobre los modelos de la empresa; guardarlo, negociarlo y compartirlo en la nube; firmarlo electrónicamente con validez jurídica; y controlar renovaciones y vencimientos.',
        steps: [
          {
            index: '01',
            title: 'Crear',
            body: 'Se responden preguntas y el documento se arma solo.',
          },
          {
            index: '02',
            title: 'Colaborar',
            body: 'Se guarda, se negocia y se comparte en la nube.',
          },
          {
            index: '03',
            title: 'Firmar',
            body: 'Firma electrónica con validez jurídica.',
          },
          {
            index: '04',
            title: 'Controlar',
            body: 'Renovaciones y vencimientos, vigilados.',
          },
        ],
      },
      highlightsLabel: 'Qué hice',
      highlights: [
        {
          title: 'Sostuve el desarrollo con el CTO ausente.',
          body: 'Tomé la responsabilidad principal del desarrollo durante una ausencia prolongada y entregué features de punta a punta, del modelo de datos a la pantalla.',
        },
        {
          title: 'Prueba que resiste a un auditor.',
          body: 'Una feature de prevención de lavado de dinero que mete el resultado del chequeo en listas restrictivas adentro del PDF firmado. Quien tiene obligación de reportar se queda con un solo documento a prueba de alteraciones, en vez de un contrato más un informe aparte que nadie puede vincular.',
        },
        {
          title: 'Un fin de semana para sacar un punto único de falla.',
          body: 'El proveedor de la integración de edición de documentos la discontinuó. Escribí un microservicio en `.NET` desde cero para reemplazarla en un fin de semana, y con eso se fue la dependencia de una empresa de afuera.',
        },
        {
          title: 'Las integraciones sobre las que se apoya el producto.',
          body: 'ZapSign para firma electrónica, con sus webhooks y la máquina de estados alrededor; Auth0 para autenticación y permisos por rol; Tokko Broker para propiedades, con credenciales encriptadas; SendGrid y la API de WhatsApp para todo lo que la plataforma manda.',
        },
        {
          title: 'Consultas que siguen rápidas cuando se acumulan documentos.',
          body: 'Access patterns en DynamoDB resueltos con GSIs en vez de scans, y S3 para guardar los documentos.',
        },
      ],
      metrics: [
        { value: '120+', caption: 'empresas en la plataforma', isText: false },
        { value: '50.000+', caption: 'documentos generados', isText: false },
        { value: '30.000+', caption: 'firmados electrónicamente', isText: false },
        { value: 'Inmobiliarias · transporte · legales', caption: 'quiénes la usan', isText: true },
      ],
      metricsNote:
        'Números publicados por Andes Docs en su propio sitio. Describen la plataforma, no mi aporte individual.',
      ctas: [{ label: 'Ver Andes Docs', href: ANDESDOCS_URL, external: true }],
    },

    buenInventario: {
      kicker: 'Destacado · SaaS · 2025 → hoy',
      title: 'Buen Inventario',
      plainLead:
        'Lo usan comercios argentinos todos los días para cobrar, controlar el stock, fiarle a los clientes de siempre y facturar. Lo diseñé, lo construí y lo mantengo andando.',
      oneLiner:
        'El sistema de gestión todo en uno para comercios argentinos: stock, caja, cuentas corrientes, facturación ARCA y tienda online — pensado para dueños que no quieren leer un manual.',
      meta: {
        yearLabel: 'Año',
        year: '2025 → hoy',
        roleLabel: 'Rol',
        role: 'Diseño, desarrollo y operación',
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
      highlightsLabel: 'Puntos clave',
      highlights: [
        {
          title: 'Facturación que aguanta caídas.',
          body: 'Facturación electrónica ARCA (AFIP) por SOAP con worker de emisión, reserva de numeración, notas de crédito, cron de conciliación y alertas de vencimiento de certificados.',
        },
        {
          title: 'Multi-tenant en DynamoDB, sin scans en runtime.',
          body: 'Cada access pattern es una query por clave o GSI particionada por empresa; los scans solo existen en scripts de migración.',
        },
        {
          title: 'Pagos sin cobros dobles.',
          body: 'Pagos y suscripciones con Mercado Pago, con webhooks deduplicados por payment id.',
        },
        {
          title: 'Una PWA lista para el mostrador.',
          body: 'Panel instalable con lector de códigos de barras (`BarcodeDetector` nativo + fallback ZXing WASM), tablas virtualizadas y sincronización en tiempo real por Socket.io.',
        },
        {
          title: 'Una landing que se usa, no solo se lee.',
          body: 'El hero es una demo interactiva — vender, fiar, cerrar caja — prerenderizada a HTML estático; el build falla si la demo no se renderizó.',
        },
      ],
      ticket: {
        ariaLabel:
          'Maqueta de la caja de Buen Inventario: un ticket con cuatro productos, total $20.650 y botón Cobrar.',
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
        note: 'Su producto, su marca — maqueta ilustrativa',
      },
      metrics: [
        { value: n(FACTS.repos), caption: 'repos', isText: false },
        { value: `~${n(FACTS.commitsBuenInventario)}`, caption: 'commits', isText: false },
        { value: `${n(FACTS.testFiles)}+`, caption: 'archivos de test', isText: false },
        { value: 'Lighthouse CI', caption: '+ presupuestos de bundle', isText: true },
      ],
      ctas: [
        { label: 'Probar la demo', href: BUEN_INVENTARIO_URL, external: true },
        { label: 'Ver sitio', href: BUEN_INVENTARIO_URL, external: true },
      ],
    },

    finanzasAgent: {
      kicker: 'Agente de IA · Serverless · 2026',
      title: 'finanzas-agent',
      plainLead:
        'Le escribo a un número de WhatsApp qué gasté y aparece en mi planilla de presupuesto — sin abrir una app ni llenar un formulario. Además me avisa antes de cada vencimiento.',
      oneLiner:
        'Un agente de finanzas personales que vive en WhatsApp. Le escribo qué gasté, cobré o debo; Claude lo convierte en filas de un Google Sheet y me avisa antes de cada vencimiento. Unos US$2/mes en AWS.',
      meta: {
        yearLabel: 'Año',
        year: '2026',
        roleLabel: 'Rol',
        role: 'Autor',
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
        headLabel: 'Replay · WhatsApp ⇄ traza',
        replayButton: 'Repetir',
        chatWho: 'finanzas-agent',
        chatStatus: 'en línea',
        chatDayDivider: 'hoy',
        traceTitle: 'Por dentro',
        traceSubtitle: 'agent_runner · tool use',
        traceAriaLabel: 'Traza del agente',
        logAriaLabel: 'Replay de la conversación',
        caption: 'Replay de una conversación real.',
        captionRight: 'rule · tool_use · result',
      },
      architecture: {
        sectionLabel: 'Arquitectura',
        svgTitle:
          'WhatsApp va a la Meta Cloud API, después a API Gateway y después a la Lambda webhook, que delega de forma asíncrona en la Lambda agent runner. El runner habla con Claude por tool use y lee Secrets Manager en el cold start. El estado de la conversación pasa por ConversationStore hacia DynamoDB con TTL de 24 horas. Los datos del usuario pasan solo por el DataAdapter: Google Sheets en producción, DynamoDB planificado, en memoria en los tests.',
        caption:
          'Azul = el traspaso asíncrono que permite al webhook responderle a Meta en menos de un segundo. El estado de la conversación y los datos del usuario van separados: las tools solo ven el DataAdapter; punteado = planificado o solo tests.',
        lanes: {
          edge: 'EDGE',
          compute: 'COMPUTE',
          state: 'ESTADO DEL RUNTIME',
          userData: 'DATOS DEL USUARIO',
        },
        labels: {
          webhookSub: 'HMAC · allowlist',
          asyncInvoke: 'async invoke',
          runnerSub: 'loop de tool use acotado',
          claudeSub: 'tool use',
          coldStart: 'cold start',
          conversationStoreSub: 'historial · idempotencia',
          dynamoChatSub: 'chat · TTL 24h',
          dataAdapterSub: 'interfaz · 15 tools',
          sheetsSub: 'en producción',
          dynamoPlannedSub: 'fase 2',
          inMemory: 'En memoria',
          inMemorySub: 'tests',
        },
      },
      decisionsLabel: 'Decisiones',
      decisions: [
        {
          id: 'D1',
          title: 'Responderle a Meta en menos de un segundo.',
          body: 'Meta reintenta a los ~5s, así que el webhook solo valida el HMAC, chequea la allowlist y delega de forma asíncrona; el trabajo del LLM ocurre en una segunda Lambda.',
        },
        {
          id: 'D2',
          title: 'Idempotente por message id.',
          body: 'Las invocaciones async son at-least-once; el runner corta si el mensaje ya fue procesado.',
        },
        {
          id: 'D3',
          title: 'El agente no sabe dónde viven los datos.',
          body: 'Una interfaz `DataAdapter`: hoy Sheets, mañana DynamoDB, en memoria en los tests. 15 tools, loop de tool use acotado.',
        },
      ],
      ctas: [{ label: 'Ver el código', href: FINANZAS_AGENT_URL, external: true }],
    },

    drills: {
      kicker: 'Open source · Herramienta de estudio · 2026',
      title: 'software-engineering-drills',
      plainLead:
        'Una herramienta gratis para desarrolladores que preparan entrevistas: ejercicios cortos sobre los fundamentos, con la explicación de por qué cada respuesta es la correcta. Open source y se usa desde el navegador.',
      oneLiner:
        'Un entrenador de práctica activa para fundamentos de ingeniería de software — POO, modelado, concurrencia y patrones de diseño — con un solo core y dos frontends: una CLI y una web.',
      meta: {
        yearLabel: 'Año',
        year: '2026',
        roleLabel: 'Rol',
        role: 'Autor · MIT',
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
      highlightsLabel: 'Puntos clave',
      highlights: [
        {
          title: 'Un core, dos frontends.',
          body: 'La corrección se escribe una vez y la comparten la CLI y la app React.',
        },
        {
          title: 'La arquitectura la hace cumplir un test.',
          body: '`architecture.test.ts` falla si el core importa de la CLI, la web, React o módulos de Node.',
        },
        {
          title: 'Un contrato, tres repositorios.',
          body: 'El guardado de progreso tiene tres implementaciones que pasan la misma suite de contrato con `describe.each`.',
        },
        {
          title: 'El contenido es una unión discriminada.',
          body: `${n(FACTS.drillItems)} ítems en 4 secciones y 3 niveles, más ${n(FACTS.drillDiagrams)} diagramas SVG protegidos por un test de diagramas huérfanos o faltantes.`,
        },
      ],
      quiz: {
        ariaLabel:
          'Un ítem real del repo: ¿qué patrón es withRetry y cómo lo reconocés? La respuesta correcta es Decorator: recibe X y devuelve X con capacidad extra.',
        section: 'Patrones de diseño · nivel 2',
        format: 'opción múltiple',
        question: '¿Qué patrón es este, y cómo lo reconocés?',
        snippetCaption: 'el drill muestra esto primero',
        options: [
          { letter: 'A', text: 'Decorator: recibe X, devuelve X con capacidad extra.' },
          {
            letter: 'B',
            text: 'Adapter: acopla `UserRepository` a un cliente con distinta firma.',
          },
          { letter: 'C', text: 'Proxy: intercepta cada método con una política de retry.' },
          { letter: 'D', text: 'Strategy: elige la política de retry en runtime.' },
        ],
        correctIndex: 0,
        correctMark: 'correcta',
        whyLabel: 'Por qué:',
        why: 'La firma es la clave: recibe la interfaz X, devuelve la interfaz X. Eso te deja apilarlos en cualquier orden.',
        source: 'Ítem real `d2-c1a`, copiado del repo.',
      },
      code: {
        file: 'architecture.test.ts',
        caption: 'la idea, simplificada',
      },
      metrics: [
        { value: n(FACTS.drillItems), caption: 'ítems', isText: false },
        { value: n(FACTS.drillDiagrams), caption: 'diagramas', isText: false },
        { value: n(FACTS.drillTests), caption: 'tests', isText: false },
        { value: 'MIT', caption: 'licencia', isText: false },
      ],
      ctas: [
        { label: 'Probar los drills', href: DRILLS_APP_URL, external: true },
        { label: DRILLS_HANDLE, href: DRILLS_URL, external: true },
      ],
    },
  },

  how: { index: 'B', label: 'Principios', title: 'Cómo trabajo' },

  principles: [
    {
      title: 'Primero el documento de diseño.',
      body: 'El trabajo no trivial empieza como un plan fechado con los trade-offs por escrito — los repos los guardan en `docs/plans/`.',
    },
    {
      title: 'Tests que protegen decisiones, no solo funciones.',
      body: 'Tests de arquitectura, suites de contrato, un build que falla si la demo no renderiza.',
    },
    {
      title: 'Confiabilidad aburrida.',
      body: 'Claves de idempotencia, defaults que fallan cerrado, IAM de mínimo privilegio, secretos fuera del repo.',
    },
    {
      title: 'Productos honestos.',
      body: 'Sin prueba social falsa ni patrones oscuros; si un número está en la página, es verdad.',
    },
  ],

  contactHead: { index: 'C', label: 'Contacto', title: 'Contacto' },

  contact: {
    headline: 'Construyamos algo que funcione un *lunes a la mañana*.',
    sub: 'Abierto a roles senior de producto / full-stack, remotos.',
    links: [
      { key: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, external: false },
      { key: 'GitHub', value: GITHUB_HANDLE, href: GITHUB_URL, external: true },
      { key: 'LinkedIn', value: LINKEDIN_HANDLE, href: LINKEDIN_URL, external: true },
    ],
  },

  footer: {
    copyright: `© 2026 ${FULL_NAME}`,
    builtWith: 'Hecho con React + Vite',
    sourceLabel: 'código',
    sourceHref: REPO_URL,
  },
};
