import { describe, expect, it } from 'vitest';
import { assetUrl, withBase } from '../../src/lib/url';

describe('withBase', () => {
  it('prefixes a root path with the production base', () => {
    expect(withBase('/gallery', '/qwind-collectsite')).toBe('/qwind-collectsite/gallery');
  });

  it('keeps a root path when the base is slash', () => {
    expect(withBase('/gallery', '/')).toBe('/gallery');
  });

  it('does not produce a double slash', () => {
    expect(withBase('gallery', '/qwind-collectsite/')).toBe('/qwind-collectsite/gallery');
  });

  it('handles the root path', () => {
    expect(withBase('/', '/qwind-collectsite')).toBe('/qwind-collectsite/');
  });
});

describe('assetUrl', () => {
  it('prefixes local asset paths', () => {
    expect(assetUrl('/_astro/image.webp', '/qwind-collectsite')).toBe('/qwind-collectsite/_astro/image.webp');
  });

  it('keeps absolute URLs unchanged', () => {
    expect(assetUrl('https://example.com/image.webp', '/qwind-collectsite')).toBe('https://example.com/image.webp');
  });

  it('does not double-prefix an already-based path', () => {
    expect(assetUrl('/qwind-collectsite/_astro/image.webp', '/qwind-collectsite')).toBe('/qwind-collectsite/_astro/image.webp');
  });
});
