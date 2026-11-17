import { test, expect } from '@playwright/test';

test('note list opens a note with headings and content', async ({ page }) => {
  await page.goto('/notes');
  await expect(page.getByRole('heading', { name: '笔记' })).toBeVisible();
  await page.getByRole('link', { name: 'Anima 提示词笔记：语法、参数与避坑' }).click();
  await expect(page.getByRole('heading', { name: '先记结论' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '版本与参数' })).toBeVisible();
});
