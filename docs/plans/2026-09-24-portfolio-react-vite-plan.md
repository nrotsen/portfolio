# Portfolio en React + Vite — plan de implementación

**Fecha:** 2026-09-24
**Estado:** aprobado para ejecutar
**Diseño de referencia:** `mockups/c-swiss.html` (dirección C, "Swiss Precision")
**Contenido de referencia:** `mockups/CONTENT.md` (EN + ES, única fuente de copy)

---

## 1. Objetivo

Convertir el mockup C en un sitio de producción que:

1. Se vea **idéntico al mockup** en 320–1920 px, sin overflow horizontal (el mockup ya pasa este chequeo; el sitio también tiene que pasarlo).
2. Sea **bilingüe con URLs propias**: `/` en inglés, `/es` en español, las dos prerenderizadas a HTML estático, con `hreflang` y metadatos por idioma.
3. Cargue rápido y sin JS obligatorio para leer: el contenido está en el HTML; el JS agrega el replay del chat, el switch de idioma y las animaciones.
4. Tenga la misma vara de calidad que el resto de tus repos: TypeScript estricto, tests, CI y un build que falla si algo importante no se renderizó.

**Fuera de alcance:** blog, CMS, analytics con cookies, formulario de contacto (contacto = links).

> **Enmienda (2026-09-24, después de ver el sitio andando):** el modo oscuro estaba fuera de
> alcance y entró igual, a pedido. Junto con eso bajó la escala tipográfica: en pantallas grandes
> el titular ocupaba media ventana y había que alejar el navegador al 80% para leer cómodo. Las
> dos cosas viven en `src/styles/tokens.css`.

## 2. Decisiones técnicas

| Decisión | Elección | Por qué |
|---|---|---|
| Build | Vite 7 + React 19 + TypeScript ~5.8 estricto, **pnpm** | Mismo stack que `buen-inventario-landingpage`: nada nuevo que aprender, versiones ya probadas en tu máquina. |
| Estilos | **CSS plano con custom properties + CSS Modules** por componente. Sin Tailwind. | El diseño es a medida y los tokens ya existen en el mockup; pasarlo a utilidades sería traducir sin ganar nada. Los tokens van a `src/styles/tokens.css`. |
| Tipografías | **Self-hosted** con `@fontsource/schibsted-grotesk` y `@fontsource/ibm-plex-mono`, subset latin, `font-display: swap`, preload de los 2 pesos del hero. | Sin requests a Google (privacidad y velocidad); el mockup usa Google Fonts solo por comodidad. |
| Prerender | Mismo patrón que la landing: `vite build` → `vite build --ssr src/entry-server.tsx` → `tsx scripts/prerender.ts` con `react-dom/static`. Dos salidas: `dist/index.html` (en) y `dist/es/index.html` (es). | Probado en producción por vos. Sin router ni framework extra: son 2 páginas. |
| i18n | Diccionarios tipados `src/content/en.ts` y `src/content/es.ts` que cumplen el mismo tipo `SiteContent`. El idioma sale de la URL, no de `localStorage`. | Si falta un texto en un idioma, **no compila**. Cada idioma tiene su URL para compartir y para SEO. |
| Switch EN/ES | Links reales (`<a href="/es">`) con `hreflang`. Recordar la preferencia es opcional y solo para redirigir la primera visita a `/` si el navegador está en español (script inline chico, respeta si el usuario eligió EN). | Funciona sin JS; no hay flash de idioma equivocado porque el HTML ya viene en el idioma correcto. |
| Animaciones | CSS + `IntersectionObserver` en un hook `useReveal`. Todo respeta `prefers-reduced-motion`. | Igual que el mockup; sin librerías de animación. |
| Replay del chat | Componente con un **timeline puro** (`buildTimeline(script) → Step[]`) y un hook que lo reproduce. El guion vive en `src/content/replay.ts`. | La lógica se testea sin DOM ni timers reales; el componente queda tonto. |
| Diagrama | Componente React con el SVG del mockup C (ya corregido con `DataAdapter`), textos desde el diccionario. | Un solo diagrama, bilingüe, sin imágenes. |
| Tests | Vitest + Testing Library + happy-dom (unit/componentes); **Playwright** (e2e: overflow, idioma, reduced motion, replay). | Mismo setup que la landing más Playwright, que ya usás para generar assets. |
| Deploy | Vercel, `cleanUrls: true`. Preview por PR, producción desde `main`. | Ya tenés Vercel CLI 33.5 instalada y es lo que usás en tus otros repos. |
| Licencia | Código MIT; el contenido (textos) queda como "all rights reserved" en el README. | Que puedan reusar el código sin copiarte la bio. |

## 3. Estructura del repo

```
portfolio/
├── docs/plans/                 este plan
├── mockups/                    referencia visual (no se buildea)
├── public/                     favicon, og-en.png, og-es.png, robots.txt
├── scripts/
│   ├── prerender.ts            genera dist/index.html y dist/es/index.html
│   └── generate-og.ts          OG images con Playwright desde un template HTML
├── src/
│   ├── content/
│   │   ├── types.ts            SiteContent (el contrato de los dos idiomas)
│   │   ├── en.ts / es.ts       copy de CONTENT.md
│   │   ├── facts.ts            números compartidos (commits, tests, ítems…) — una sola fuente
│   │   └── replay.ts           guion del chat + traza
│   ├── components/
│   │   ├── Nav/                marca, links, switch EN/ES
│   │   ├── Hero/               eyebrow, titular, CTAs, 3 números grandes
│   │   ├── ProjectIndex/       layout 01/02/03 con columna sticky (≥1024px)
│   │   ├── BuenInventario/     texto + TicketMock (marca de BI adentro)
│   │   ├── FinanzasAgent/      texto + ChatReplay + ArchitectureDiagram + decisiones + war story
│   │   ├── Drills/             texto + QuizCard + CodeSnippet
│   │   ├── Principles/         "How I work"
│   │   ├── Contact/
│   │   └── Footer/
│   ├── hooks/                  useReveal, usePrefersReducedMotion, useReplay
│   ├── lib/                    buildTimeline, seo (meta + JSON-LD por idioma)
│   ├── styles/                 tokens.css, base.css (reset, grid de 12 columnas)
│   ├── App.tsx                 recibe `lang` y el diccionario
│   ├── main.tsx                hidratación en el navegador
│   └── entry-server.tsx        AppShell por idioma, para el prerender
├── tests/e2e/                  Playwright
├── .github/workflows/ci.yml
├── vercel.json
└── README.md
```

## 4. Fases

Cada fase termina con **todo verde** (`pnpm typecheck && pnpm test && pnpm build`) y un commit. No arrancar la siguiente con la anterior en rojo.

### Fase 0 — Datos que faltan (5 min, antes de empezar)

- [ ] Email de contacto (el que quieras público).
- [ ] URL de LinkedIn.
- [ ] Dominio. Si todavía no hay, se usa `*.vercel.app` y se agrega después sin cambiar código (va en `src/content/facts.ts` → `SITE_URL`).
- [ ] Confirmar el rol del hero: "Product engineer · full-stack".

Si falta algo, arrancar igual con placeholders marcados como `TODO(content)` y un test que falle en CI si queda alguno en `main` (ver Fase 6).

### Fase 1 — Scaffold y tooling

- [ ] `pnpm create vite@latest . --template react-ts` dentro de `portfolio/` (el repo ya existe, con `mockups/` y `docs/`).
- [ ] TypeScript estricto: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- [ ] ESLint (flat config) con `typescript-eslint`, `react-hooks` y `jsx-a11y`. Prettier.
- [ ] Scripts: `dev`, `build` (tsc + vite + ssr + prerender), `preview`, `typecheck`, `lint`, `test`, `test:e2e`.
- [ ] `.editorconfig`, `.gitignore` (`dist`, `dist-ssr`, `node_modules`, `test-results`, `playwright-report`).
- [ ] `vercel.json` con `cleanUrls: true` y headers de caché largos para `/assets/*`.

**Done:** `pnpm dev` abre una página vacía; `pnpm build` genera `dist/`.

### Fase 2 — Tokens, base y contenido tipado

- [ ] Pasar las custom properties de `c-swiss.html` a `src/styles/tokens.css` (colores, tipografías, radio, espacios). Nada de hex sueltos en los componentes.
- [ ] `base.css`: reset, grid de 12 columnas (`.wrap`, `.grid`), foco visible, `prefers-reduced-motion`. **No** poner `font-variant-numeric: tabular-nums` global (en Schibsted Grotesk ensancha comas y puntos; fue el bug del mockup): solo en índices y tablas.
- [ ] Fonts self-hosted con preload.
- [ ] `src/content/types.ts` + `en.ts` + `es.ts` pasando **todo** el copy de `CONTENT.md`. Los números van a `facts.ts` y los dos idiomas los formatean con `Intl.NumberFormat` (`~2,000` / `~2.000`).
- [ ] Test: los dos diccionarios cumplen `SiteContent` (lo garantiza `tsc`) y ningún string está vacío.

**Done:** tokens y copy completos; `tsc` rompe si se borra un texto de un solo idioma.

### Fase 3 — Secciones estáticas

Portar sección por sección desde el mockup, comparando lado a lado en 390, 768, 1024 y 1440 px:

- [ ] `Nav`: marca, links con anclas, switch EN/ES como links reales con `hreflang` y `aria-current`. Nav en una línea en tablet (fix del mockup: `white-space: nowrap`, ocultar el rol < 960px).
- [ ] `Hero`: eyebrow, titular con énfasis en cobalto, sub, CTAs, 3 números grandes.
- [ ] `ProjectIndex`: layout 01/02/03; columna izquierda sticky desde 1024px.
- [ ] `BuenInventario` + `TicketMock` (marca de BI: ink `#0a0a0a`, paper `#fafaf7`, teal `#14b8a6`, bordes 1.5px, sombra offset). Incluye los ajustes < 360px del mockup.
- [ ] `ArchitectureDiagram` (SVG del mockup C, textos del diccionario, `role="img"` + `<title>` por idioma).
- [ ] `Drills` + `QuizCard` + `CodeSnippet`. **Reemplazar la pregunta inventada del mockup por un ítem real** de `software-engineering-drills` (sección D, patrones de diseño): copiar enunciado, opciones y explicación tal cual.
- [ ] `Principles`, `Contact`, `Footer`.
- [ ] Todas las métricas de texto (p. ej. "Lighthouse CI") pueden partir línea; los números no (fix del mockup).

**Done:** la página en `/` y `/es` se ve como el mockup, sin JS de comportamiento todavía.

### Fase 4 — Comportamiento

- [ ] `useReveal` (IntersectionObserver, clase `.in`, sin animación con reduced motion). **El contenido tiene que ser visible sin JS**: la clase que oculta se agrega solo cuando JS corre (`html.js .reveal`), igual que el mockup.
- [ ] `lib/buildTimeline.ts`: del guion (`replay.ts`) a una lista de pasos `{ at: ms, kind: 'user' | 'typing' | 'agent' | 'trace', … }`. Función pura.
- [ ] `useReplay`: reproduce el timeline con `setTimeout`, arranca al entrar en pantalla, botón "Replay" reinicia, cancela limpio al desmontar. Con reduced motion muestra el estado final directo.
- [ ] `ChatReplay`: chat (siempre en español, es el producto real) + panel de traza; caption en inglés en `/`.
- [ ] Redirección opcional de primera visita (`/` → `/es` si `navigator.language` empieza con `es` y el usuario nunca eligió idioma). Script inline chico en el `<head>` de `/` solamente.

**Done:** el replay se reproduce una vez al hacer scroll, "Replay" funciona, y con reduced motion no hay animaciones.

### Fase 5 — Prerender, SEO y assets

- [ ] `entry-server.tsx` exporta `renderPage(lang)`.
- [ ] `scripts/prerender.ts` (basado en el de la landing): renderiza `en` y `es`, inyecta en el template, escribe `dist/index.html` y `dist/es/index.html`. Captura `onError` y **falla el build** si algo tiró.
- [ ] **Centinelas** (el build falla si faltan en el HTML de cada idioma): el `<h1>`, el SVG del diagrama (`role="img"`) y el contenedor del replay. Mismo criterio que la landing: usar atributos estables, no frases de copy.
- [ ] Por idioma: `<html lang>`, `<title>`, `description`, canonical, `hreflang` en/es/x-default, Open Graph y Twitter card, JSON-LD `Person` (nombre, `sameAs` a GitHub y LinkedIn, `jobTitle`).
- [ ] `scripts/generate-og.ts`: OG 1200×630 por idioma con Playwright desde un template HTML con el estilo C. Favicon (el cuadrado cobalto de la marca).
- [ ] `robots.txt` y `sitemap.xml` (2 URLs).

**Done:** `pnpm build && pnpm preview` sirve `/` y `/es` con el contenido completo en el HTML (verificar con "ver código fuente"); el build falla si se rompe un centinela.

### Fase 6 — Tests y calidad

- [ ] Unit: `buildTimeline` (orden, tiempos, que la traza de `registrar_gasto` aparece después de "débito"), formateo de números por idioma, `useReplay` con fake timers (reinicio, cancelación al desmontar, reduced motion).
- [ ] Componentes: switch de idioma (links y `aria-current`), `ChatReplay` en estado final, `a11y` con `vitest-axe` en la página completa.
- [ ] E2E con Playwright (Chromium + WebKit, así queda cubierto Safari):
  - **Overflow horizontal = 0** en 320, 360, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1600, 1920 px, en `/` y `/es` (portar `overflow-check.html`: excluir lo que está dentro de un contenedor con `overflow-x: auto`, como el diagrama en mobile).
  - Switch de idioma navega y cambia `<html lang>`.
  - Con `reducedMotion: 'reduce'`: el replay muestra el estado final sin esperar.
  - Sin JS (`javaScriptEnabled: false`): todo el texto visible.
- [ ] Test de contenido: falla si queda algún `TODO(content)` o `[[` en `src/content/`.

**Done:** `pnpm test` y `pnpm test:e2e` verdes en local.

### Fase 7 — CI y deploy

- [ ] `.github/workflows/ci.yml`: install con caché de pnpm → lint → typecheck → test → build → e2e (Playwright con navegadores cacheados) → Lighthouse CI sobre `dist/` con umbrales: performance ≥ 95, accesibilidad = 100, best practices ≥ 95, SEO = 100.
- [ ] Crear el repo en GitHub (`nrotsen/portfolio`, público) y pushear. **Pedir confirmación antes de pushear y de hacerlo público.** Instalar `gh` antes (`winget install GitHub.cli` + `gh auth login`) o crearlo desde la web.
- [ ] Conectar Vercel al repo (preview por PR, producción desde `main`). Dominio si lo hay.
- [ ] Probar en el celular real (iPhone/Safari y Android): scroll, sticky, replay, switch de idioma.

**Done:** URL pública funcionando, CI verde en `main`.

### Fase 8 — README del portfolio

- [ ] README en inglés: qué es, stack, decisiones (tabla de la sección 2), cómo correrlo, cómo están hechos el prerender y los tests de overflow. El README del portfolio también es parte del portfolio.

## 5. Riesgos y cómo se cubren

| Riesgo | Mitigación |
|---|---|
| Diferencias visuales con el mockup | Comparar lado a lado en 4 anchos por sección (Fase 3); los tokens se copian, no se reinterpretan. |
| Un idioma queda incompleto | `SiteContent` tipado: no compila si falta un texto. |
| El replay o el diagrama no se renderizan en el HTML estático | Centinelas en el prerender (Fase 5). |
| Regresiones de responsive | E2E de overflow en 12 anchos × 2 idiomas × 2 motores (Fase 6). |
| Números desactualizados (commits, tests) | Una sola fuente en `facts.ts`, con la fecha en que se contaron en un comentario. Actualizarlos es cambiar un archivo. |
| Contenido inventado | La pregunta del quiz sale del repo real (Fase 3); el ticket de BI dice "illustrative mock-up" en su epígrafe, como en el mockup. |

## 6. Pendientes que no son de este plan

De `finanzas-agent` (branch `portfolio-cleanup`, sin pushear):

1. Instalar Python 3.12 (`winget install Python.Python.3.12`) y correr los 35 tests antes de publicar.
2. Crear el secreto `finanzas-agent/allowed-senders` con tu número **antes** del próximo `sam deploy` (sin él el bot ignora todo, a propósito).
3. Publicarlo con historia limpia (el commit inicial tiene datos personales) y pasarlo a público. Requiere confirmación explícita.

El portfolio linkea a `github.com/nrotsen/finanzas-agent`: ese link da 404 hasta que se haga el punto 3, así que conviene hacerlo antes de la Fase 7.

## 7. Cómo retomar mañana

Abrir Claude Code en `C:\Users\nesto\Developer\portfolio` y pedir:

> Ejecutá `docs/plans/2026-09-24-portfolio-react-vite-plan.md` desde la Fase 0.

Si los datos de la Fase 0 están a mano, pasarlos en el mismo mensaje.
