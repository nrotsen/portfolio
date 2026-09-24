import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/**
 * Deriva de `vite.config.ts` en vez de redeclarar plugins y alias: si el alias
 * `@` cambia allá, acá se refleja solo.
 *
 * Sin `globals: true` a propósito — los tests importan `describe`/`it`/`expect`
 * desde 'vitest'. Habilitarlo obligaría a sumar "vitest/globals" a los types de
 * `tsconfig.app.json`, que incluye TODO `src`, y entonces un `expect()` escrito
 * por error dentro de un componente de producción compilaría limpio.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
);
