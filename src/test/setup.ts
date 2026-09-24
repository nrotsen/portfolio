import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * El auto-cleanup de Testing Library se engancha solo cuando Vitest corre con
 * `globals: true`, y acá los tests importan `describe`/`it`/`expect` a mano
 * (ver `vitest.config.ts`). Sin esto, el segundo `render()` de un archivo deja
 * dos páginas en el DOM y `getByRole('log')` encuentra dos.
 */
afterEach(cleanup);
