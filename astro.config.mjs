import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { rehypeTableWrap } from './scripts/rehype-table-wrap.mjs';

const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || 'https://collect.qwind.top';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    mdx(),
    icon({
      include: {
        lucide: [
          'arrow-left', 'arrow-left-right', 'arrow-right', 'arrow-up-right', 'audio-lines',
          'bookmark', 'calendar-days', 'check', 'chevron-down', 'clock', 'clock-fading',
          'coffee', 'copy', 'eraser', 'external-link', 'eye', 'eye-off', 'file', 'file-archive', 'file-audio',
          'file-image', 'file-question-mark', 'file-text', 'file-video-camera', 'folder-open',
          'funnel', 'github', 'globe', 'heart', 'image', 'image-off', 'images', 'info', 'list-filter',
          'megaphone', 'menu', 'moon', 'notebook-pen', 'palette', 'pen-line', 'play',
          'rotate-ccw', 'rss', 'search', 'search-x', 'settings-2', 'sliders-horizontal', 'sparkles',
          'star', 'sun', 'tags', 'triangle-exclamation-point', 'user-round', 'wand-sparkles', 'x',
        ],
      },
    }),
  ],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeTableWrap] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
