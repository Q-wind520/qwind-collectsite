export function sortByDate<T extends { data: { createdAt: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
}

export function tagToSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[/?#%]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export type WorkKind = 'painting' | 'style' | 'composition';

export const WORK_KINDS: WorkKind[] = ['painting', 'style', 'composition'];

export function isNsfw(rating?: string): boolean {
  return rating === 'nsfw' || rating === 'r18g';
}

export function kindCounts(entries: { data: { kind?: string; draft: boolean; rating?: string } }[], includeNsfw = false): Record<WorkKind, number> {
  const counts: Record<WorkKind, number> = { painting: 0, style: 0, composition: 0 };
  for (const entry of entries) {
    if (entry.data.draft || (!includeNsfw && isNsfw(entry.data.rating))) continue;
    const kind = (entry.data.kind ?? 'painting') as WorkKind;
    if (kind in counts) counts[kind] += 1;
  }
  return counts;
}

export function collectAllTags(entries: { data: { tags: string[]; relatedTags?: string[]; draft?: boolean; rating?: string } }[]): Set<string> {
  const tags = new Set<string>();
  for (const entry of entries) {
    if (entry.data.draft || isNsfw(entry.data.rating)) continue;
    for (const tag of entry.data.tags) tags.add(tag);
    for (const tag of entry.data.relatedTags ?? []) tags.add(tag);
  }
  return tags;
}

export function tagRoutes(tags: Iterable<string>): { tag: string; slug: string }[] {
  const bySlug = new Map<string, string[]>();
  for (const tag of tags) {
    const slug = tagToSlug(tag);
    if (!slug) continue;
    const names = bySlug.get(slug) ?? [];
    names.push(tag);
    bySlug.set(slug, names);
  }
  const routes: { tag: string; slug: string }[] = [];
  for (const [slug, names] of bySlug) {
    if (names.length > 1) {
      throw new Error(`Tag slug collision: ${names.map((name) => `"${name}"`).join(' and ')} both map to "${slug}"`);
    }
    routes.push({ tag: names[0], slug });
  }
  return routes;
}

export function collectTags(entries: { data: { tags: string[]; draft: boolean; rating?: string } }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    if (entry.data.draft || isNsfw(entry.data.rating)) continue;
    for (const tag of entry.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

export function validateSlugs(entries: { id: string; data: { slug: string } }[]): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (entry.id !== entry.data.slug) {
      throw new Error(`Slug mismatch: file "${entry.id}" declares slug "${entry.data.slug}"`);
    }
    if (seen.has(entry.data.slug)) {
      throw new Error(`Duplicate slug: ${entry.data.slug}`);
    }
    seen.add(entry.data.slug);
  }
}

export type EntryType = 'works' | 'links' | 'notes' | 'files';

export function entryUrl(type: EntryType, slug: string): string {
  switch (type) {
    case 'works': return `/gallery/${slug}`;
    case 'notes': return `/notes/${slug}`;
    case 'links': return '/links';
    case 'files': return '/files';
  }
}
