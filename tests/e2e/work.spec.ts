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

test('gallery opens a work overlay from the image and closes with Escape', async ({ page }) => {
  await page.goto('/gallery');
  const card = page.locator('#gallery-grid [data-work]:visible').first();
  await card.locator('.thumb').click();

  const dialog = page.locator('[data-work-modal]');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/gallery\/[a-z0-9-]+$/);
  await expect(dialog.locator('iframe')).toHaveAttribute('src', /embed=1/);
  await expect(dialog.frameLocator('iframe').locator('h1')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/gallery(\?.*)?$/);
});

test('gallery title opens the same overlay and the back button closes it', async ({ page }) => {
  await page.goto('/gallery');
  const card = page.locator('#gallery-grid [data-work]:visible').first();
  await card.locator('.title').click();

  const dialog = page.locator('[data-work-modal]');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/gallery\/[a-z0-9-]+$/);

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/gallery(\?.*)?$/);
});
