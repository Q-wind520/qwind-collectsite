import { describe, expect, it } from 'vitest';
import { slugFromTitle } from '../../src/lib/slug';

describe('slugFromTitle', () => {
  it('lowercases and hyphenates ASCII titles', () => {
    expect(slugFromTitle('Hello, World!')).toBe('hello-world');
  });

  it('trims leading and trailing separators', () => {
    expect(slugFromTitle('  --Foo Bar--  ')).toBe('foo-bar');
  });

  it('returns an empty string for a purely Chinese title', () => {
    expect(slugFromTitle('黄昏下的旅人')).toBe('');
  });
});
