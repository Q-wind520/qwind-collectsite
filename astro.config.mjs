import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: 'https://q-wind520.github.io',
  base,
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
