# portfolio

My personal site: three case studies, two languages, no framework beyond React and Vite.

It is also a small demonstration of how I work, so the parts that are usually hand-waved are the
ones that are written down here: how the two languages stay in sync, how the page gets into the
HTML before any JavaScript runs, and what has to break for the build to fail.

**Live:** https://portfolio.vercel.app · `/` in English, `/es` in Spanish.

---

## What it is

A single page in two languages, prerendered to static HTML at build time. JavaScript adds three
things and nothing else: the chat replay, the reveal-on-scroll animation, and remembering which
language you picked. With JavaScript off, every word is still there and the language switch still
works — they are real links to real URLs.

Three projects are on it:

| #   | Project                                                                               | What it is                                                                                                                            |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | [Buen Inventario](https://www.bueninventario.com)                                     | A SaaS back office for small Argentine shops: stock, point of sale, customer credit, ARCA e-invoicing. Designed, built and run by me. |
| 02  | [finanzas-agent](https://github.com/nrotsen/finanzas-agent)                           | A personal-finance agent in WhatsApp: Claude with tool use on two Lambdas, ~US$2/month.                                               |
| 03  | [software-engineering-drills](https://github.com/nrotsen/software-engineering-drills) | An active-recall trainer for engineering fundamentals. One core, a CLI and a web app. MIT.                                            |

## Stack and why

| Decision  | Choice                                                 | Why                                                                                                                                                   |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build     | Vite 7 + React 19 + TypeScript 5.8, strict             | Two pages and a handful of components. A framework with a router and a data layer would be paying rent on rooms nobody uses.                          |
| Styles    | Plain CSS with custom properties + CSS Modules         | The design is bespoke and the tokens already existed in the mockup. Translating them into utility classes would have been translation without a gain. |
| Fonts     | Self-hosted (`@fontsource`), latin subset, preloaded   | No requests to Google. Two files, both preloaded from the prerendered `<head>`.                                                                       |
| Prerender | `vite build` → `vite build --ssr` → `react-dom/static` | Two HTML files written at build time. No server, no hydration mismatch, no framework.                                                                 |
| i18n      | Typed dictionaries, one URL per language               | See below — it is the decision the whole repo is arranged around.                                                                                     |
| Animation | CSS + `IntersectionObserver`                           | No animation library. Everything respects `prefers-reduced-motion`.                                                                                   |
| Tests     | Vitest + Testing Library + axe, Playwright for e2e     | Unit tests for the pure parts, e2e for the parts that only exist in a browser.                                                                        |
| Deploy    | Vercel, `cleanUrls: true`                              | Static files. Nothing runs on a server.                                                                                                               |

## Two languages, two URLs, no flash

`/` is English and `/es` is Spanish. They are two separate HTML documents, each with its own
`<html lang>`, `<title>`, canonical and `hreflang`. The language switch is a pair of `<a>` elements,
not a toggle: it works without JavaScript, it can be shared, and the document you get is already in
the right language — there is no moment where the wrong one is on screen.

The copy lives in `src/content/en.ts` and `src/content/es.ts`, and both have to satisfy the same
`SiteContent` type. If a field is added and one language does not have it, `tsc` fails. Numbers are
not written by hand in either file: they come from `src/content/facts.ts` and are formatted with
`Intl.NumberFormat`, so English gets `~2,000` and Spanish gets `~2.000` from one source.

The copy is plain strings with a two-marker inline syntax (`` `code` `` and `*accent*`) parsed by
`src/lib/richText.tsx`. There is no `dangerouslySetInnerHTML` anywhere in the site. There is no
underscore marker on purpose: the copy is full of `tool_use`, `agent_runner` and `wa_id`.

## The build fails if the page did not render

`scripts/prerender.ts` renders both languages with `react-dom/static` and writes `dist/index.html`
and `dist/es/index.html`.

`prerenderToNodeStream` does **not** reject when a component throws — React recovers at the nearest
Suspense boundary and resolves normally. So the script checks two things and exits non-zero on
either:

1. `onError` fired during the render.
2. Four **sentinels** are missing from the HTML of either language: the `<h1>`, the architecture
   SVG, the replay container and the point-of-sale mock.

The sentinels are attributes (`id="hero-h"`, `aria-labelledby="arch-title"`, …), not sentences.
An `id` does not change during a copy edit; a headline does.

## Tests

```
pnpm test        # Vitest: pure logic, components, axe on the whole page
pnpm test:e2e    # Playwright: Chromium + WebKit against dist/
```

What they actually guard:

- **`buildTimeline`** turns the chat script into a list of steps with absolute timestamps. It is a
  pure function, so the replay is tested without a DOM, without React and without real timers —
  including the one thing the demo is there to show: the `registrar_gasto` tool call only happens
  _after_ the user says which payment method they used.
- **`useReplay`** is tested with fake timers: it starts empty, fills up, restarts on the button, and
  cancels every timer on unmount. With `prefers-reduced-motion` it renders the final state and
  schedules nothing.
- **Content** — no empty strings, no leftover placeholders, no unbalanced inline markup, every
  `href` absolute or an anchor, and both languages reporting the same numbers.
- **Horizontal overflow = 0** at 12 widths × 2 languages × 2 engines. It checks both that the
  document does not scroll sideways _and_ that no element sticks out of the viewport — because
  `overflow-x: hidden` on `body` hides the first symptom while Safari still scrolls. Elements inside
  an `overflow-x: auto` container are excluded: the architecture diagram is meant to scroll on its
  own on a phone.
- **No JavaScript** — every section, including the chat replay and the diagram, is in the HTML, and
  the language switch still navigates.

WebKit is in the matrix because it is the only engine on an iPhone, and sticky positioning and
horizontal scroll are where it disagrees.

CI runs format, lint, typecheck, unit tests, build, e2e, and Lighthouse CI over `dist/` with
thresholds: performance ≥ 95, accessibility = 100, best practices ≥ 95, SEO = 100.

## Running it

Requires Node 20.19+ (or 22.12+) and pnpm.

```bash
pnpm install
pnpm dev                 # dev server, English only (no prerender)
pnpm build               # typecheck + client + ssr + prerender into dist/
pnpm preview             # serves dist/ the way Vercel does, /es included
pnpm generate:og         # regenerates the OG images and the touch icon
```

`pnpm preview` is not `vite preview`: Vite's SPA fallback would serve the English page at `/es` and
every language test would pass for the wrong reason. `scripts/serve-dist.ts` resolves directories to
their `index.html` and 404s on anything else, like Vercel with `cleanUrls: true`.

## Layout

```
scripts/     prerender, OG image generation, the static server for preview and e2e
src/
  content/   the two dictionaries, the shared numbers, the chat script — all plain data
  components/  one folder per section, each with its own CSS Module
  hooks/     useReveal, usePrefersReducedMotion, useReplay
  lib/       buildTimeline, richText, seo (head + JSON-LD), language preference
  styles/    tokens.css (copied from the mockup), base.css
tests/e2e/   Playwright
mockups/     the three design directions this came from; not part of the build
docs/plans/  the plan this repo was built from
```

## Licence

The **code** is MIT — see [LICENSE](./LICENSE). Take the prerender script, the overflow test, the
replay timeline, whatever is useful.

The **content** — the copy, the case studies, the OG images and my name — is not. It is all rights
reserved. Reuse the machinery, write your own words.
