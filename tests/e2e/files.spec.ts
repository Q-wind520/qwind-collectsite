import { test, expect } from '@playwright/test';

test('file list shows a downloadable row', async ({ page }) => {
  await page.goto('/files');
  await expect(page.getByRole('heading', { name: '文件' })).toBeVisible();
  await expect(page.getByRole('link', { name: '示例文件' })).toHaveAttribute('href', '/files/example.txt');
});
