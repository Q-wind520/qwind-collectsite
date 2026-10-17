import { describe, expect, it } from 'vitest';
import { sha256Hex } from '../../src/lib/protected';

describe('sha256Hex', () => {
  it('hashes the sample password', async () => {
    await expect(sha256Hex('qwind')).resolves.toBe('6fc0fccf335a068190743e17ece458a983aac2edff6d26fd607801fbaf9ec075');
  });
});
