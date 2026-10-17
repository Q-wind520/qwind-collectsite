import { test, expect } from '@playwright/test';

test('filters by tag and syncs the URL', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('[data-work]').first()).toBeVisible();
  await page.selectOption('select[name="tag"]', '场景');
  await expect(page).toHaveURL(/tag=/);
  await expect(page.locator('[data-work]:visible')).toHaveCount(1);
  await expect(page.locator('[data-result-count]')).toContainText('1 件作品');
});

test('sidebar switches between painting, style and composition', async ({ page }) => {
  await page.goto('/gallery?kind=style');
  await expect(page.locator('[data-gallery-title]')).toHaveText('画风');
  await expect(page.locator('[data-work]:visible')).toHaveCount(1);

  await page.goto('/gallery?kind=composition');
  await expect(page.locator('[data-gallery-title]')).toHaveText('构图');
  await expect(page.locator('[data-work]:visible')).toHaveCount(1);

  await page.goto('/gallery?kind=painting');
  await expect(page.locator('[data-gallery-title]')).toHaveText('画作');
  await expect(page.locator('[data-kind-link="painting"]')).toHaveAttribute('aria-current', 'page');
});

test('protected works show a locked placeholder', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('[data-protected="true"]')).toHaveCount(1);
});

test('gallery has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/gallery');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});
