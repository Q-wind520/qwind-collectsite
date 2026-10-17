import { describe, expect, it } from 'vitest';
import { bigrams, normalize, searchEntries, type SearchEntry } from '../../src/lib/search';

const entries: SearchEntry[] = [
  { id: 'w1', type: 'work', title: '黄昏下的旅人', summary: '暖色场景', tags: ['场景', '画师参考'], url: '/gallery/w1', text: '', date: '2026-10-01' },
  { id: 'n1', type: 'note', title: 'NAI v5 心得', summary: '画师 tag 组合', tags: ['AI'], url: '/notes/n1', text: '两个画师 tag 通常比三个更容易控制', date: '2026-09-01' },
];

describe('normalize', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalize('  NAI   V5  ')).toBe('nai v5');
  });
});

describe('bigrams', () => {
  it('creates Chinese bigrams', () => {
    expect(bigrams('画师参考')).toContain('画师');
    expect(bigrams('画师参考')).toContain('师参');
  });
});

describe('searchEntries', () => {
  it('matches a Chinese title', () => {
    expect(searchEntries(entries, '黄昏').map((entry) => entry.id)).toEqual(['w1']);
  });

  it('matches a tag', () => {
    expect(searchEntries(entries, '画师参考').map((entry) => entry.id)).toEqual(['w1']);
  });

  it('matches note body text', () => {
    expect(searchEntries(entries, '三个').map((entry) => entry.id)).toEqual(['n1']);
  });

  it('returns nothing for an empty query', () => {
    expect(searchEntries(entries, '   ')).toEqual([]);
  });

  it('does not throw for punctuation', () => {
    expect(() => searchEntries(entries, '???')).not.toThrow();
  });
});
