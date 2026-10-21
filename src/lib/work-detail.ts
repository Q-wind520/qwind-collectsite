import { getImage } from 'astro:assets';
import { getEntry, type CollectionEntry } from 'astro:content';
import { assetUrl, withBase } from './url';
import { tagToSlug } from './content';

export type WorkDetail = {
  title: string;
  summary: string;
  date: string;
  kind: string;
  rating: string;
  model: string;
  artists: string;
  tags: { label: string; href: string | null }[];
  image: { src: string; width: number; height: number; alt: string };
  positive: string;
  positiveLabel: string;
  positiveAction: string;
  negative: string;
  href: string;
  path: string;
};

const kindLabels = { painting: '画作', style: '画风', composition: '构图' } as const;

export async function buildWorkDetail(work: CollectionEntry<'works'>): Promise<{ detail: WorkDetail; artistNames: string[] }> {
  const cover = work.data.images[0];
  const large = await getImage({ src: cover, width: 1600, format: 'webp' });
  const artistEntries = await Promise.all(work.data.artists.map((ref) => getEntry(ref)));
  if (artistEntries.some((entry) => !entry)) throw new Error(`Missing artist reference in work "${work.id}"`);
  const artistNames = artistEntries.filter(Boolean).map((entry) => entry!.data.title);

  const positiveLabel = work.data.kind === 'style'
    ? '画师串'
    : work.data.kind === 'composition'
      ? '构图 / 场景串'
      : '正向提示词';
  const positiveAction = work.data.kind === 'style'
    ? '复制画师串'
    : work.data.kind === 'composition'
      ? '复制构图串'
      : '复制正向';
  const positive = work.data.kind === 'style'
    ? (work.data.prompt.artist || work.data.prompt.positive)
    : work.data.kind === 'composition'
      ? (work.data.prompt.scene || work.data.prompt.positive)
      : work.data.prompt.positive;
  const href = withBase(`/gallery/${work.data.slug}`);

  return {
    artistNames,
    detail: {
      title: work.data.title,
      summary: work.data.summary ?? '',
      date: work.data.createdAt.toISOString().slice(0, 10),
      kind: kindLabels[work.data.kind],
      rating: work.data.rating,
      model: work.data.prompt.model || '—',
      artists: artistNames.join(' / ') || '—',
      tags: work.data.tags.map((tag) => {
        const slug = tagToSlug(tag);
        return { label: tag, href: slug ? withBase(`/tags/${slug}`) : null };
      }),
      image: {
        src: assetUrl(large.src),
        width: cover.width,
        height: cover.height,
        alt: work.data.title,
      },
      positive,
      positiveLabel,
      positiveAction,
      negative: work.data.prompt.negative,
      href,
      path: new URL(href, 'https://local.invalid').pathname,
    },
  };
}
