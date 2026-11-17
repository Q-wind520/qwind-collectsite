import { test, expect } from '@playwright/test';

test('filters by tag and syncs the URL', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('[data-work]:visible').first()).toBeVisible();
  await page.locator('input[name="tag"][value="海边"]').check();
  await expect(page).toHaveURL(/tag=/);
  await expect(page.locator('[data-work]:visible')).toHaveCount(3);
  await expect(page.locator('[data-result-count]')).toContainText('3 件作品');

  await page.locator('input[name="tag"][value="海边"]').uncheck();
  await expect(page.locator('[data-work]:visible')).toHaveCount(6);
});

test('filters by tier and experiment and syncs the URL', async ({ page }) => {
  await page.goto('/gallery');
  await page.selectOption('select[name="tier"]', 'sketch');
  await expect(page).toHaveURL(/tier=sketch/);
  await expect(page.locator('[data-work]:visible')).toHaveCount(1);
  await expect(page.locator('[data-work]:visible')).toHaveAttribute('data-tier', 'sketch');

  await page.goto('/gallery');
  await page.selectOption('select[name="experiment"]', 'lora');
  await expect(page).toHaveURL(/experiment=lora/);
  await expect(page.locator('[data-work]:visible')).toHaveCount(2);
  for (const card of await page.locator('[data-work]:visible').all()) {
    await expect(card).toHaveAttribute('data-experiments', /lora/);
  }
});

test('has no flat painting, style and composition navigation', async ({ page }) => {
  await page.goto('/gallery?kind=style');
  await expect(page.getByRole('heading', { name: '作品', level: 1 })).toBeVisible();
  await expect(page.locator('[data-kind-link]')).toHaveCount(0);
  await expect(page.locator('[data-work]:visible')).toHaveCount(6);
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

test('gallery uses a waterfall layout', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/gallery');
  const grid = page.locator('#gallery-grid');
  await expect(grid).toHaveClass(/masonry-ready/);
  const boxes = await page.locator('#gallery-grid [data-work]:visible').evaluateAll((cards) =>
    cards.slice(0, 4).map((card) => {
      const rect = card.getBoundingClientRect();
      return { x: Math.round(rect.x), y: Math.round(rect.y), height: Math.round(rect.height) };
    }));
  expect(boxes).toHaveLength(4);
  expect(boxes[0].y).toBe(boxes[1].y);
  expect(boxes[1].y).toBe(boxes[2].y);
  expect(boxes[3].y).toBeGreaterThan(0);
  expect(new Set(boxes.slice(0, 3).map((box) => box.x)).size).toBe(3);
});

test('gallery has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/gallery');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});
