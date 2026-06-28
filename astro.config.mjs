// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const site = process.env.ASTRO_SITE || 'https://daikao1688-maker.github.io';
const base = process.env.ASTRO_BASE || '/macau3';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    react(),
    sitemap()
  ]
});
