import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

/**
 * Sirve `dist/` como lo hace Vercel con `cleanUrls: true`.
 *
 * `vite preview` no sirve: su fallback de SPA devuelve `dist/index.html` para
 * cualquier ruta, así que `/es` mostraría la página en inglés y todos los tests
 * de idioma pasarían por la razón equivocada. Acá `/es` resuelve a
 * `dist/es/index.html` y lo que no existe es un 404 de verdad.
 */

const DIST = resolve(import.meta.dirname, '../dist');
const PORT = Number(process.env['PORT'] ?? 4173);

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function fileFor(pathname: string): Promise<string | null> {
  // `normalize` + el chequeo de prefijo cortan los `..` antes de que salgan
  // de `dist/`. Es un server local, pero un server local que sirve el cwd es
  // igual de malo que uno remoto que lo hace.
  const candidate = normalize(join(DIST, pathname));
  if (candidate !== DIST && !candidate.startsWith(DIST + sep)) return null;

  const direct = await stat(candidate).catch(() => null);
  if (direct?.isFile() === true) return candidate;

  if (direct?.isDirectory() === true) {
    const index = join(candidate, 'index.html');
    if ((await stat(index).catch(() => null))?.isFile() === true) return index;
  }

  // cleanUrls: /es → /es.html si existiera como archivo suelto
  const asHtml = `${candidate}.html`;
  if ((await stat(asHtml).catch(() => null))?.isFile() === true) return asHtml;

  return null;
}

const server = createServer((req, res) => {
  const pathname = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');

  void fileFor(pathname).then((file) => {
    if (file === null) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }

    res.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    createReadStream(file).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[serve] dist/ en http://localhost:${PORT}`);
});
