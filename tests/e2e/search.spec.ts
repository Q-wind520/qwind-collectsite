import { test, expect } from '@playwright/test';

test('global search finds a work by Chinese title', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /搜索/ }).first().click();
  await expect(page.locator('[data-search-dialog]')).toBeVisible();
  await page.locator('[data-search-dialog] [data-search-input]').fill('黄昏');
  await expect(page.locator('[data-search-dialog] [data-search-results]')).toContainText('黄昏下的旅人');
});

test('tag page aggregates a cross-type tag', async ({ page }) => {
  await page.goto('/tags/画师参考');
  await expect(page.getByRole('heading', { name: '#画师参考' })).toBeVisible();
});
