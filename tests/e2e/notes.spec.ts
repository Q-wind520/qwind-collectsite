import { test, expect } from '@playwright/test';

test('note list opens a note with headings and content', async ({ page }) => {
  await page.goto('/notes');
  await expect(page.getByRole('heading', { name: '笔记' })).toBeVisible();
  await page.getByRole('link', { name: 'NAI v5 画师 tag 的组合心得' }).click();
  await expect(page.getByRole('heading', { name: '先确定画面主体' })).toBeVisible();
  await expect(page.getByText('两个画师 tag 通常比三个更容易控制。')).toBeVisible();
});
