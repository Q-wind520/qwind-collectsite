import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { withBase } from '../lib/url';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const notes = (await getCollection('notes'))
    .filter((note) => !note.data.draft && !note.data.protected)
    .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.createdAt,
      description: note.data.summary ?? '',
      link: withBase(`/notes/${note.data.slug}`),
    })),
  });
}
