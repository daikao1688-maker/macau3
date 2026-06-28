// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const site = process.env.ASTRO_SITE || 'https://macau3.zhuanqian388.workers.dev';
const base = process.env.ASTRO_BASE ?? '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    react(),
    sitemap()
  ]
});
