// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',  // Modo servidor: genera endpoints API
  adapter: node({
    mode: 'standalone'  // Se ejecuta como servidor independiente
  })
});
