import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || 'https://collect.qwind.top';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
