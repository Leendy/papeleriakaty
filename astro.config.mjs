// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// Configuración básica de Astro
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  base: '/',
  integrations: [tailwind()],
  server: {
    port: 3000,
    host: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true'
    }
  },
  vite: {
    server: {
      proxy: {}
    }
  }
});