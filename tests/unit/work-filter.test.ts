import { describe, expect, it } from 'vitest';
import { matchesWorkFilter, type WorkFilterData, type WorkFilterState } from '../../src/lib/work-filter';

const base: WorkFilterData = {
  nsfw: false,
  artists: ['example-artist'],
  rating: 'general',
  tags: ['海边', '蔚蓝档案'],
  tier: 'refined',
  experiments: ['lora'],
};

const empty: WorkFilterState = { artist: '', rating: '', tags: [], tier: '', experiment: '' };

describe('matchesWorkFilter', () => {
  it('hides NSFW works until NSFW mode is on', () => {
    expect(matchesWorkFilter({ ...base, nsfw: true }, empty, false)).toBe(false);
    expect(matchesWorkFilter({ ...base, nsfw: true }, empty, true)).toBe(true);
  });

  it('matches every active axis', () => {
    expect(matchesWorkFilter(base, { ...empty, artist: 'example-artist' }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, artist: 'other' }, false)).toBe(false);
    expect(matchesWorkFilter(base, { ...empty, rating: 'general' }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, rating: 'nsfw' }, false)).toBe(false);
    expect(matchesWorkFilter(base, { ...empty, tier: 'refined' }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, tier: 'sketch' }, false)).toBe(false);
    expect(matchesWorkFilter(base, { ...empty, experiment: 'lora' }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, experiment: 'prompt' }, false)).toBe(false);
  });

  it('matches any selected tag', () => {
    expect(matchesWorkFilter(base, { ...empty, tags: ['海边'] }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, tags: ['不存在', '蔚蓝档案'] }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, tags: ['不存在'] }, false)).toBe(false);
  });

  it('combines different axes with AND', () => {
    expect(matchesWorkFilter(base, { ...empty, tier: 'refined', experiment: 'lora', tags: ['海边'] }, false)).toBe(true);
    expect(matchesWorkFilter(base, { ...empty, tier: 'sketch', experiment: 'lora' }, false)).toBe(false);
  });
});
