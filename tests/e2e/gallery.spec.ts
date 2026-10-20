import { test, expect } from '@playwright/test';

test('filters by tag and syncs the URL', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('[data-work]:visible').first()).toBeVisible();
  await page.selectOption('select[name="tag"]', '海边');
  await expect(page).toHaveURL(/tag=/);
  await expect(page.locator('[data-work]:visible')).toHaveCount(3);
  await expect(page.locator('[data-result-count]')).toContainText('3 件作品');
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

test('NSFW works stay hidden until the adult check is completed', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('[data-work][data-nsfw="true"]').first()).toBeHidden();
  await page.getByRole('button', { name: '显示 NSFW 内容' }).click();
  await expect(page.getByRole('heading', { name: '确认已成年' })).toBeVisible();
  await page.getByRole('button', { name: '我已满 18 岁' }).click();
  await page.getByRole('button', { name: '继续确认' }).click();
  await page.getByRole('button', { name: '确认开启' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-nsfw', 'on');
  await expect(page.locator('[data-work][data-nsfw="true"]').first()).toBeVisible();
});

test('gallery has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/gallery');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});
