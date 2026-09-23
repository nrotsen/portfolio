# Portfolio — content brief (EN / ES)

Single source of copy for every mockup. Every number here comes from the repos; do not invent metrics, clients, testimonials, logos or star ratings (same honesty rule as the Buen Inventario landing). Placeholders are marked `[[like this]]`.

## Identity

- Name: **Nestor Berlanga**
- Role — EN: **Product engineer · full-stack** / ES: **Product engineer · full-stack**
- Location — EN: Argentina · works remote / ES: Argentina · trabajo remoto
- GitHub: https://github.com/nrotsen
- Email: `[[email]]` · LinkedIn: `[[linkedin]]`

## Nav

EN: Work · Open source · How I work · Contact
ES: Proyectos · Open source · Cómo trabajo · Contacto

## Hero

EN
- Eyebrow: Product engineer · full-stack · Argentina
- Headline: **I build products end to end — from the DynamoDB access pattern to the checkout button.**
- Sub: I designed, built and run Buen Inventario, a SaaS that small Argentine retailers use to manage stock, sales, credit and tax invoicing. I care about the unglamorous parts: idempotent webhooks, honest numbers, tests that guard the architecture.
- CTAs: See the work · GitHub
- Fact strip: `~2,000 commits` shipped to production in 15 months · `290+` test files · `4` repos in one product

ES
- Eyebrow: Product engineer · full-stack · Argentina
- Headline: **Construyo productos de punta a punta: desde el access pattern en DynamoDB hasta el botón de checkout.**
- Sub: Diseñé, construí y opero Buen Inventario, un SaaS con el que comercios argentinos manejan stock, ventas, cuentas corrientes y facturación electrónica. Me importan las partes poco vistosas: webhooks idempotentes, números honestos, tests que protegen la arquitectura.
- CTAs: Ver proyectos · GitHub
- Fact strip: `~2.000 commits` en producción en 15 meses · `290+` archivos de test · `4` repos en un producto

---

## 01 — Buen Inventario (featured, the star)

Link: https://www.bueninventario.com · Demo: https://www.bueninventario.com (hero demo) · App: app.bueninventario.com

EN
- Kicker: Featured · SaaS · 2025 → today
- Title: **Buen Inventario**
- One-liner: The all-in-one back office for small Argentine shops: stock, point of sale, customer credit, ARCA e-invoicing and an online store — built for owners who'd rather not read a manual.
- Highlights (pick 4–5 to show):
  1. **Tax invoicing that survives outages.** ARCA (AFIP) e-invoicing over SOAP with an emission worker, invoice-number reservation, credit notes, a reconcile cron and certificate-expiry alerts.
  2. **Multi-tenant on DynamoDB, no runtime scans.** Every access pattern is a key or GSI query partitioned by company; scans only exist in migration scripts.
  3. **Payments without double charges.** Mercado Pago payments and subscriptions with webhooks deduplicated by payment id.
  4. **A counter-ready PWA.** Installable admin with barcode scanning (native BarcodeDetector + ZXing WASM fallback), virtualised tables and real-time sync over Socket.io.
  5. **A landing you can use, not just read.** The hero is an interactive demo — sell, sell on credit, close the register — prerendered to static HTML; the build fails if the demo didn't render.
  6. **Honesty as a rule in code.** No customer counts, logos or testimonials: numbers only describe the product. Prices in the JSON-LD and on the page come from the same constant.
- Metrics row: `4 repos` · `~2,075 commits` · `290+ test files` · `Lighthouse CI + bundle budgets`
- Stack: TypeScript · React 19 · Vite · Tailwind · TanStack Query · Node / Express 5 · Socket.io · DynamoDB · S3 · KMS · Mercado Pago · ARCA SOAP · Vercel
- CTAs: Try the live demo · Visit site

ES
- Kicker: Destacado · SaaS · 2025 → hoy
- Title: **Buen Inventario**
- One-liner: El sistema de gestión todo en uno para comercios argentinos: stock, caja, cuentas corrientes, facturación ARCA y tienda online — pensado para dueños que no quieren leer un manual.
- Highlights:
  1. **Facturación que aguanta caídas.** Facturación electrónica ARCA (AFIP) por SOAP con worker de emisión, reserva de numeración, notas de crédito, cron de conciliación y alertas de vencimiento de certificados.
  2. **Multi-tenant en DynamoDB, sin scans en runtime.** Cada access pattern es una query por clave o GSI particionada por empresa; los scans solo existen en scripts de migración.
  3. **Pagos sin cobros dobles.** Pagos y suscripciones con Mercado Pago, con webhooks deduplicados por payment id.
  4. **Una PWA lista para el mostrador.** Panel instalable con lector de códigos de barras (BarcodeDetector nativo + fallback ZXing WASM), tablas virtualizadas y sincronización en tiempo real por Socket.io.
  5. **Una landing que se usa, no solo se lee.** El hero es una demo interactiva — vender, fiar, cerrar caja — prerenderizada a HTML estático; el build falla si la demo no se renderizó.
  6. **La honestidad como regla en el código.** Sin cantidad de clientes, logos ni testimonios: los números solo describen el producto. El precio del JSON-LD y el de la página salen de la misma constante.
- Metrics: `4 repos` · `~2.075 commits` · `290+ archivos de test` · `Lighthouse CI + presupuestos de bundle`
- CTAs: Probar la demo · Ver sitio

---

## 02 — finanzas-agent (case study with live replay)

Link: https://github.com/nrotsen/finanzas-agent

EN
- Kicker: AI agent · Serverless · 2026
- Title: **finanzas-agent**
- One-liner: A personal-finance agent that lives in WhatsApp. I text what I spent, earned or owe; Claude turns it into rows in a Google Sheet and reminds me before bills are due. About US$2/month on AWS.
- Architecture (for a small diagram): WhatsApp → Meta Cloud API → API Gateway → Lambda **webhook** —(async invoke)→ Lambda **agent runner** ⇄ Claude (tool use) · ⇄ DynamoDB (history, TTL 24h) · ⇄ Google Sheets · Secrets Manager on cold start.
- Decisions (3):
  1. **Answer Meta in under a second.** Meta retries after ~5s, so the webhook only validates the HMAC, checks the allowlist and hands off asynchronously; the LLM work happens in a second Lambda.
  2. **Idempotent by message id.** Async invokes are at-least-once; the runner short-circuits on an already-processed message.
  3. **The agent doesn't know where data lives.** A `DataAdapter` interface: Sheets today, DynamoDB tomorrow, in-memory in tests. 15 tools, bounded tool-use loop.
- War story: Argentine numbers arrive as `54 9 11…` but Meta's whitelist stores `54 11 15…` — replies failed with `#131030` until the wa_id was normalised.
- Stack: Python 3.12 · AWS Lambda · API Gateway · DynamoDB · Secrets Manager · SAM · Claude API · Meta Cloud API · Google Sheets API
- CTA: Read the code

ES
- Kicker: Agente de IA · Serverless · 2026
- Title: **finanzas-agent**
- One-liner: Un agente de finanzas personales que vive en WhatsApp. Le escribo qué gasté, cobré o debo; Claude lo convierte en filas de un Google Sheet y me avisa antes de cada vencimiento. Unos US$2/mes en AWS.
- Decisions:
  1. **Responderle a Meta en menos de un segundo.** Meta reintenta a los ~5s, así que el webhook solo valida el HMAC, chequea la allowlist y delega de forma asíncrona; el trabajo del LLM ocurre en una segunda Lambda.
  2. **Idempotente por message id.** Las invocaciones async son at-least-once; el runner corta si el mensaje ya fue procesado.
  3. **El agente no sabe dónde viven los datos.** Una interfaz `DataAdapter`: hoy Sheets, mañana DynamoDB, en memoria en los tests. 15 tools, loop de tool use acotado.
- War story: los números argentinos llegan como `54 9 11…` pero la whitelist de Meta guarda `54 11 15…` — las respuestas fallaban con `#131030` hasta normalizar el wa_id.
- CTA: Ver el código

### Chat replay script (always in Spanish — it's the real product; show a small "translated" caption in EN mode)

Left pane = WhatsApp-style chat. Right pane = "under the hood" trace of tool calls, revealed in sync.

1. user: `gasté 12k en el super`
   agent: `¿con qué pagaste? efectivo / débito / crédito / transferencia / mp`
   trace: `rule · medio_pago missing → ask, don't guess`
2. user: `débito`
   trace: `tool_use registrar_gasto({ monto: 12000, categoria: "comida", medio_pago: "debito", fecha: "2026-05-19" })` → `result { id: "g_8f2c" } · sheet row appended`
   agent: `✅ Registrado: $12.000 en comida (débito).`
3. user: `cómo voy este mes?`
   trace: `tool_use resumen_financiero({ periodo: "este mes" })` → `result { ingresos: 1800000, gastos: 950000 }`; `tool_use vencimientos_proximos({ dias: 3 })` → `result [ tarjeta_visa · 280000 · in 2 days ]`
   agent: `Mayo: ingresos $1.800.000, gastos $950.000. Neto +$850.000. ⚠️ Vence en 2 días: tarjeta_visa ($280.000).`

EN caption: "Replay of a real conversation. The agent speaks Rioplatense Spanish."
ES caption: "Replay de una conversación real."

---

## 03 — software-engineering-drills (open source)

Link: https://github.com/nrotsen/software-engineering-drills · MIT

EN
- Kicker: Open source · Learning tool · 2026
- Title: **software-engineering-drills**
- One-liner: An active-recall trainer for software engineering fundamentals — OOP, modelling, concurrency and design patterns — with one core and two frontends: a CLI and a web app.
- Highlights:
  1. **One core, two frontends.** Grading is written once and shared by the CLI and the React app.
  2. **Architecture enforced by a test.** `architecture.test.ts` fails if the core imports from the CLI, the web app, React or Node built-ins.
  3. **One contract, three repositories.** Progress storage has three implementations passing the same `describe.each` contract suite.
  4. **Content as a discriminated union.** 169 items across 4 sections and 3 levels, plus 15 SVG diagrams guarded by an orphan/missing-diagram test.
- Metrics: `169 items` · `15 diagrams` · `58 tests` · `MIT`
- Stack: TypeScript · React 19 · React Router 7 · Vite · Tailwind v4 · Vitest · Inquirer

ES
- Kicker: Open source · Herramienta de estudio · 2026
- One-liner: Un entrenador de práctica activa para fundamentos de ingeniería de software — POO, modelado, concurrencia y patrones de diseño — con un solo core y dos frontends: una CLI y una web.
- Highlights:
  1. **Un core, dos frontends.** La corrección se escribe una vez y la comparten la CLI y la app React.
  2. **La arquitectura la hace cumplir un test.** `architecture.test.ts` falla si el core importa de la CLI, la web, React o módulos de Node.
  3. **Un contrato, tres repositorios.** El guardado de progreso tiene tres implementaciones que pasan la misma suite de contrato con `describe.each`.
  4. **El contenido es una unión discriminada.** 169 ítems en 4 secciones y 3 niveles, más 15 diagramas SVG protegidos por un test de diagramas huérfanos o faltantes.
- Metrics: `169 ítems` · `15 diagramas` · `58 tests` · `MIT`

---

## How I work / Cómo trabajo (4 principles)

EN
1. **Design doc before code.** Non-trivial work starts as a dated plan with the trade-offs written down — the repos keep them in `docs/plans/`.
2. **Tests that protect decisions, not just functions.** Architecture tests, contract suites, a build that fails when the demo doesn't render.
3. **Boring reliability.** Idempotency keys, fail-closed defaults, least-privilege IAM, secrets out of the repo.
4. **Honest products.** No fake social proof, no dark patterns; if a number is on the page, it's true.

ES
1. **Primero el documento de diseño.** El trabajo no trivial empieza como un plan fechado con los trade-offs por escrito — los repos los guardan en `docs/plans/`.
2. **Tests que protegen decisiones, no solo funciones.** Tests de arquitectura, suites de contrato, un build que falla si la demo no renderiza.
3. **Confiabilidad aburrida.** Claves de idempotencia, defaults que fallan cerrado, IAM de mínimo privilegio, secretos fuera del repo.
4. **Productos honestos.** Sin prueba social falsa ni patrones oscuros; si un número está en la página, es verdad.

## Contact / Contacto

EN: **Let's build something that works on a Monday morning.** Open to senior product / full-stack roles, remote. · Email · GitHub · LinkedIn
ES: **Construyamos algo que funcione un lunes a la mañana.** Abierto a roles senior de producto / full-stack, remotos. · Email · GitHub · LinkedIn

Footer: © 2026 Nestor Berlanga · Built with React + Vite · [source](https://github.com/nrotsen/portfolio)
