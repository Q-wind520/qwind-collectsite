import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/url';
import { collectTags, entryUrl, tagRoutes } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const [works, artists, links, notes, files] = await Promise.all([
    getCollection('works'), getCollection('artists'), getCollection('links'), getCollection('notes'), getCollection('files'),
  ]);

  const staticPaths = ['/', '/gallery', '/artists', '/links', '/notes', '/files', '/search', '/about'];
  const entryPaths = [
    ...works.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => entryUrl('works', entry.data.slug)),
    ...artists.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => entryUrl('artists', entry.data.slug)),
    ...notes.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => entryUrl('notes', entry.data.slug)),
  ];
  const tagPaths = tagRoutes(collectTags([...works, ...artists, ...links, ...notes, ...files]).keys())
    .map(({ slug }) => `/tags/${slug}`);

  const urls = [...new Set([...staticPaths, ...entryPaths, ...tagPaths])]
    .map((path) => `<url><loc>${new URL(withBase(path), site!).href}</loc></url>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
