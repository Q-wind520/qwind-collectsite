import { test, expect } from '@playwright/test';

test('file list shows the audio rows', async ({ page }) => {
  await page.goto('/files');
  await expect(page.getByRole('heading', { name: '文件' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Arona/ })).toHaveAttribute('href', /\/files\/Audios\/Arona-.*\.mp3$/);
  await expect(page.getByRole('link', { name: /ATRI/ })).toHaveAttribute('href', /\/files\/Audios\/ATRI-.*\.wav$/);
});

test('audio preview closes from the backdrop and has no close button', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/files');
  await page.locator('[data-preview]').first().click();
  const dialog = page.locator('[data-preview-dialog]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: '关闭' })).toHaveCount(0);
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
});
