import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('artist list filters and detail copies the artist tag', async ({ page }) => {
  await page.goto('/artists');
  await expect(page.getByRole('heading', { name: '画师' })).toBeVisible();
  await page.getByPlaceholder('搜索画师、别名或 tag').fill('示例');
  await expect(page.locator('[data-artist-card]:visible')).toHaveCount(1);
  await page.locator('[data-artist-card]:visible').first().click();
  await expect(page.getByRole('heading', { name: '示例画师' })).toBeVisible();
  await page.getByRole('button', { name: '复制画师 tag' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe('artist:example');
});
