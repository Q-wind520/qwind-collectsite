import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/url';
import type { SearchEntry } from '../lib/search';

export const GET: APIRoute = async () => {
  const works = (await getCollection('works')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const links = (await getCollection('links')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const notes = (await getCollection('notes')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const files = (await getCollection('files')).filter((entry) => !entry.data.draft && !entry.data.protected);

  const index: SearchEntry[] = [
    ...works.map((entry) => ({
      id: `work-${entry.id}`, type: ({ painting: '画作', style: '画风', composition: '构图' } as const)[entry.data.kind],
      title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase(`/gallery/${entry.data.slug}`), text: [entry.data.prompt.positive, entry.data.prompt.artist, entry.data.prompt.scene].filter(Boolean).join(' '),
      date: entry.data.createdAt.toISOString(),
    })),
    ...links.map((entry) => ({
      id: `link-${entry.id}`, type: '书签', title: entry.data.title,
      summary: entry.data.summary ?? entry.data.description ?? '', tags: entry.data.tags,
      url: withBase('/links'), text: entry.data.url,
      date: entry.data.createdAt.toISOString(),
    })),
    ...notes.map((entry) => ({
      id: `note-${entry.id}`, type: '笔记', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase(`/notes/${entry.data.slug}`), text: (entry.body ?? '').replace(/[#*_>`[\]()]/g, ' ').slice(0, 2000),
      date: entry.data.createdAt.toISOString(),
    })),
    ...files.map((entry) => ({
      id: `file-${entry.id}`, type: '文件', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase('/files'), text: '',
      date: entry.data.createdAt.toISOString(),
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
