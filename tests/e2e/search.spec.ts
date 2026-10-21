import { test, expect } from '@playwright/test';

test('global search finds a work by Chinese title', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /搜索/ }).first().click();
  await expect(page.locator('[data-search-dialog]')).toBeVisible();
  await page.locator('[data-search-dialog] [data-search-input]').fill('普拉娜');
  await expect(page.locator('[data-search-dialog] [data-search-results]')).toContainText('普拉娜海边镜头');
});

test('tag page aggregates a cross-type tag', async ({ page }) => {
  await page.goto('/tags/画师参考');
  await expect(page.getByRole('heading', { name: '#画师参考' })).toBeVisible();
});

test('search results open a work overlay', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /搜索/ }).first().click();
  const search = page.locator('[data-search-dialog]');
  await search.locator('[data-search-input]').fill('普拉娜');
  await search.getByRole('link', { name: /普拉娜海边镜头/ }).click();
  const work = page.locator('[data-work-modal]');
  await expect(work).toBeVisible();
  await expect(work.locator('[data-work-modal-title]')).toHaveText('普拉娜海边镜头');
  await page.keyboard.press('Escape');
  await expect(work).toBeHidden();
});
