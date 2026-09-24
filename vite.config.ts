import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  css: {
    modules: {
      // Sin hash: el mismo nombre de clase tiene que salir del build de cliente
      // y del build SSR, o la hidratación encuentra un className distinto del
      // que prerenderizó. Los nombres de archivo del repo son únicos, así que
      // `[name]__[local]` no colisiona — y además se lee en el inspector.
      generateScopedName: '[name]__[local]',
    },
  },
  build: {
    // El HTML estático tiene que traer TODO el CSS: si Vite parte el CSS por
    // chunk, el primer paint del prerender llega sin estilos.
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
});
