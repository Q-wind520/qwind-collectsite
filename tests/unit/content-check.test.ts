import { describe, expect, it } from 'vitest';
import { validateContentFiles } from '../../src/lib/content-check';

describe('validateContentFiles', () => {
  it('rejects duplicate slugs and names both files', () => {
    expect(() => validateContentFiles([
      { file: 'src/content/works/sub/a.md', slug: 'a' },
      { file: 'src/content/works/other/a.md', slug: 'a' },
    ])).toThrow(/Duplicate slug "a".*sub\/a\.md.*other\/a\.md/s);
  });

  it('rejects a filename that does not match the slug', () => {
    expect(() => validateContentFiles([
      { file: 'src/content/works/foo.md', slug: 'bar' },
    ])).toThrow(/Slug mismatch.*foo\.md.*bar/);
  });

  it('rejects NSFW works that are not protected', () => {
    expect(() => validateContentFiles([
      { file: 'src/content/works/foo.md', slug: 'foo', rating: 'nsfw', protected: false },
    ])).toThrow(/NSFW.*protected/);
  });

  it('accepts valid files', () => {
    expect(() => validateContentFiles([
      { file: 'src/content/works/foo.md', slug: 'foo', rating: 'general', protected: false },
      { file: 'src/content/works/bar.md', slug: 'bar', rating: 'nsfw', protected: true },
    ])).not.toThrow();
  });
});
