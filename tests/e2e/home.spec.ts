import { test, expect } from '@playwright/test';

test('home renders the archive shell without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '温水の收藏站', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeAttached();
  await expect(page.getByRole('button', { name: '打开菜单' })).toBeVisible();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});
