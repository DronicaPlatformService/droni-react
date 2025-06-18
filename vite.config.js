import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: '/droni/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/oauth2': {
        target: 'http://39.115.66.158:18086',
        changeOrigin: true,
      },
    },
  },
});
