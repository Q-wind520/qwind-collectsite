import { test, expect } from '@playwright/test';

test('home renders the archive shell without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '温水の收藏站', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: '打开菜单' })).toBeAttached();
  await expect(page.getByRole('button', { name: '打开菜单' })).toBeVisible();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});

test('home shows featured works and recent entries', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '精选作品' })).toBeVisible();
  await expect(page.locator('[data-work]').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '最近更新' })).toBeVisible();
});

test('announcement can be dismissed and stays dismissed', async ({ page }) => {
  await page.goto('/');
  const notice = page.locator('[data-announcement]');
  await expect(notice).toBeVisible();
  await notice.getByRole('button', { name: '关闭公告' }).click();
  await expect(notice).toBeHidden();
  await page.reload();
  await expect(notice).toBeHidden();
});
