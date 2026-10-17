import { describe, expect, it } from 'vitest';
import { filterWorks, type WorkSummary } from '../../src/lib/filter';

const works: WorkSummary[] = [
  { slug: 'a', title: 'A', artists: ['x'], tags: ['场景'], rating: 'general', date: '2026-10-01', protected: false },
  { slug: 'b', title: 'B', artists: ['y'], tags: ['角色'], rating: 'nsfw', date: '2026-09-01', protected: false },
  { slug: 'c', title: 'C', artists: ['x'], tags: ['场景'], rating: 'general', date: '2026-08-01', protected: true },
];

describe('filterWorks', () => {
  it('filters by tag and excludes protected works', () => {
    expect(filterWorks(works, { tag: '场景' }).map((w) => w.slug)).toEqual(['a']);
  });

  it('filters by artist', () => {
    expect(filterWorks(works, { artist: 'x' }).map((w) => w.slug)).toEqual(['a']);
  });

  it('filters by rating', () => {
    expect(filterWorks(works, { rating: 'nsfw' }).map((w) => w.slug)).toEqual(['b']);
  });

  it('sorts oldest first', () => {
    expect(filterWorks(works, { sort: 'oldest' }).map((w) => w.slug)).toEqual(['b', 'a']);
  });

  it('does not mutate the input', () => {
    const copy = [...works];
    filterWorks(works, { sort: 'oldest' });
    expect(works).toEqual(copy);
  });
});
