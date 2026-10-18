import { test, expect } from '@playwright/test';

test('file list shows the audio rows', async ({ page }) => {
  await page.goto('/files');
  await expect(page.getByRole('heading', { name: '文件' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Arona/ })).toHaveAttribute('href', /\/files\/Audios\/Arona-.*\.mp3$/);
  await expect(page.getByRole('link', { name: /ATRI/ })).toHaveAttribute('href', /\/files\/Audios\/ATRI-.*\.wav$/);
});
