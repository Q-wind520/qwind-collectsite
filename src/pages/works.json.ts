import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildWorkDetail } from '../lib/work-detail';

export const prerender = true;

export const GET: APIRoute = async () => {
  const includeDrafts = import.meta.env.DEV;
  const works = (await getCollection('works')).filter((work) => includeDrafts || !work.data.draft);
  const details = await Promise.all(works.map((work) => buildWorkDetail(work).then((item) => item.detail)));

  return new Response(JSON.stringify(details), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
