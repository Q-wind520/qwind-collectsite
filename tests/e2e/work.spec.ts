import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('work detail shows prompt and copies it', async ({ page }) => {
  await page.goto('/gallery/example-work');
  await expect(page.getByRole('heading', { name: '黄昏下的旅人' })).toBeVisible();
  await expect(page.getByText('1girl, solo, sunset, warm light, detailed background')).toBeVisible();
  await page.getByRole('button', { name: '复制正向' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('1girl, solo, sunset');
});

test('gallery opens a lightbox and closes with Escape', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible a[data-pswp]').first().click();
  await expect(page.locator('.pswp')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.pswp')).toBeHidden();
});
