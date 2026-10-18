import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase('/sitemap.xml'), site!).href;
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
