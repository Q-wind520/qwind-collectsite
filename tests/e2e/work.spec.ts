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
  await expect(dialog.locator('[data-work-modal-title]')).toBeVisible();
  await expect(dialog.locator('[data-work-modal-image]')).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/gallery(\?.*)?$/);
});

test('overlay image opens a zoomable lightbox and Escape returns to the overlay', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();

  const dialog = page.locator('[data-work-modal]');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: '放大查看作品图' }).click();
  const lightbox = page.locator('.pswp');
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator('.pswp__img')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
  await expect(dialog).toBeVisible();
});

test('closing the zoom lightbox keeps the overlay open', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();

  const dialog = page.locator('[data-work-modal]');
  await dialog.getByRole('button', { name: '放大查看作品图' }).click();
  const lightbox = page.locator('.pswp');
  await expect(lightbox).toBeVisible();

  await lightbox.getByRole('button', { name: 'Close' }).click();
  await expect(lightbox).toBeHidden();
  await expect(dialog).toBeVisible();
});

test('gallery overlay lays out image and details side by side, then stacks on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();
  const dialog = page.locator('[data-work-modal]');
  const image = await dialog.locator('[data-work-modal-media]').boundingBox();
  const panel = await dialog.locator('[data-work-modal-panel]').boundingBox();
  expect(image).not.toBeNull();
  expect(panel).not.toBeNull();
  expect(panel!.x).toBeGreaterThan(image!.x + image!.width - 1);

  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();
  await expect(dialog).toBeVisible();
  const compactImage = await dialog.locator('[data-work-modal-media]').boundingBox();
  const compactPanel = await dialog.locator('[data-work-modal-panel]').boundingBox();
  expect(compactImage).not.toBeNull();
  expect(compactPanel).not.toBeNull();
  expect(compactPanel!.y).toBeGreaterThan(compactImage!.y + compactImage!.height - 1);
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

test('home work links open the overlay too', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.preview').first().click();
  const dialog = page.locator('[data-work-modal]');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/gallery\/[a-z0-9-]+$/);
  await expect(dialog.locator('[data-work-modal-title]')).not.toBeEmpty();
  await expect(dialog.locator('[data-work-modal-image]')).toBeInViewport();
  await expect(dialog.getByRole('link', { name: /完整页面/ })).toHaveCount(0);
});

test('clicking blank space inside the overlay closes it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();

  const dialog = page.locator('[data-work-modal]');
  const panel = await dialog.locator('[data-work-modal-panel]').boundingBox();
  expect(panel).not.toBeNull();
  await page.mouse.click(panel!.x - 8, panel!.y + 40);
  await expect(dialog).toBeHidden();
});

test('overlay close button closes immediately', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();

  const dialog = page.locator('[data-work-modal]');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '关闭作品详情' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/gallery(\?.*)?$/);
});
