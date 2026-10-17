import { describe, expect, it } from 'vitest';
import { formatBytes } from '../../src/lib/format';

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(52)).toBe('52 B'));
  it('formats kilobytes', () => expect(formatBytes(2048)).toBe('2.0 KB'));
  it('formats megabytes', () => expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB'));
  it('handles zero', () => expect(formatBytes(0)).toBe('0 B'));
});
