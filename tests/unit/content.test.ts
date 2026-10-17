import { describe, expect, it } from 'vitest';
import { collectAllTags, collectTags, sortByDate, tagRoutes, tagToSlug, validateSlugs } from '../../src/lib/content';

describe('tagToSlug', () => {
  it('normalizes spaces, case and punctuation', () => {
    expect(tagToSlug('  Artist / Ref #1 ')).toBe('artist-ref-1');
  });

  it('keeps Chinese characters', () => {
    expect(tagToSlug('画师 参考')).toBe('画师-参考');
  });
});

describe('collectAllTags', () => {
  it('includes related tags from artists', () => {
    const tags = collectAllTags([
      { data: { tags: ['a'], relatedTags: ['b'] } },
      { data: { tags: ['c'] } },
    ]);
    expect([...tags]).toEqual(['a', 'b', 'c']);
  });
});

describe('tagRoutes', () => {
  it('throws when two tags normalize to the same slug', () => {
    expect(() => tagRoutes(['AI', 'ai'])).toThrow(/Tag slug collision/);
  });
});

describe('collectTags', () => {
  it('counts tags and ignores drafts and protected entries', () => {
    const tags = collectTags([
      { data: { tags: ['a', 'b'], draft: false } },
      { data: { tags: ['a'], draft: true } },
      { data: { tags: ['a', 'c'], draft: false, protected: true } },
    ]);
    expect(tags.get('a')).toBe(1);
    expect(tags.get('b')).toBe(1);
    expect(tags.get('c')).toBeUndefined();
  });
});

describe('validateSlugs', () => {
  it('rejects duplicate slugs', () => {
    expect(() => validateSlugs([
      { id: 'a', data: { slug: 'a' } },
      { id: 'a', data: { slug: 'a' } },
    ])).toThrow(/Duplicate slug/);
  });

  it('rejects a filename that does not match the slug', () => {
    expect(() => validateSlugs([{ id: 'a', data: { slug: 'b' } }])).toThrow(/Slug mismatch/);
  });
});

describe('sortByDate', () => {
  it('sorts newest first without mutating the input', () => {
    const input = [
      { data: { createdAt: new Date('2026-01-01') } },
      { data: { createdAt: new Date('2026-10-01') } },
    ];
    const sorted = sortByDate(input);
    expect(sorted[0].data.createdAt.toISOString()).toContain('2026-10-01');
    expect(input[0].data.createdAt.toISOString()).toContain('2026-01-01');
  });
});
