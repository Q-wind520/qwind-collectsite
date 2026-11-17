import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/url';
import { isNsfw } from '../lib/content';
import { EXPERIMENT_LABELS, TIER_LABELS } from '../lib/work-meta';
import type { SearchEntry } from '../lib/search';

export const GET: APIRoute = async () => {
  const works = (await getCollection('works')).filter((entry) => !entry.data.draft);
  const links = (await getCollection('links')).filter((entry) => !entry.data.draft);
  const notes = (await getCollection('notes')).filter((entry) => !entry.data.draft);
  const files = (await getCollection('files')).filter((entry) => !entry.data.draft);

  const index: SearchEntry[] = [
    ...works.map((entry) => ({
      id: `work-${entry.id}`, type: '作品',
      title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase(`/gallery/${entry.data.slug}`), text: [
        entry.data.prompt.positive,
        entry.data.prompt.artist,
        entry.data.prompt.scene,
        TIER_LABELS[entry.data.tier],
        ...entry.data.experiment.map((experiment) => EXPERIMENT_LABELS[experiment]),
      ].filter(Boolean).join(' '),
      date: entry.data.createdAt.toISOString(), nsfw: isNsfw(entry.data.rating),
    })),
    ...links.map((entry) => ({
      id: `link-${entry.id}`, type: '书签', title: entry.data.title,
      summary: entry.data.summary ?? entry.data.description ?? '', tags: entry.data.tags,
      url: withBase('/links'), text: entry.data.url,
      date: entry.data.createdAt.toISOString(), nsfw: false,
    })),
    ...notes.map((entry) => ({
      id: `note-${entry.id}`, type: '笔记', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase(`/notes/${entry.data.slug}`), text: (entry.body ?? '').replace(/[#*_>`[\]()]/g, ' ').slice(0, 2000),
      date: entry.data.createdAt.toISOString(), nsfw: false,
    })),
    ...files.map((entry) => ({
      id: `file-${entry.id}`, type: '文件', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase('/files'), text: '',
      date: entry.data.createdAt.toISOString(), nsfw: false,
    })),
    {
      id: 'tool-prompt-converter', type: '工具', title: '提示词转换',
      summary: 'Anima 与 NovelAI 提示词互转。',
      tags: ['工具', '提示词', 'Anima', 'NovelAI'],
      url: withBase('/tools'), text: '提示词转换 权重 括号 画师 tag',
      date: new Date('2026-10-18').toISOString(), nsfw: false,
    },
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
