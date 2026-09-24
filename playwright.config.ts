import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Los e2e corren contra `dist/`, no contra el dev server: lo que se testea es
 * el HTML estático que se publica, incluido el prerender.
 *
 * Chromium y WebKit. WebKit no es un capricho: es el único motor que corre en
 * iPhone, y la mitad de los bugs de sticky y de scroll horizontal aparecen
 * solo ahí.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] !== undefined ? 2 : 0,
  // Un worker en CI: los e2e comparten un solo server estático.
  ...(process.env['CI'] !== undefined ? { workers: 1 } : {}),
  reporter: process.env['CI'] !== undefined ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'pnpm exec tsx scripts/serve-dist.ts',
    url: BASE_URL,
    reuseExistingServer: process.env['CI'] === undefined,
    timeout: 60_000,
  },
});
