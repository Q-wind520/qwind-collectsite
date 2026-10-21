import { test, expect } from '@playwright/test';

test.use({ colorScheme: 'light' });

test('theme toggle persists across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '切换明暗主题' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('images have alt text and the page has a skip link', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.getByRole('link', { name: '跳到主内容' })).toBeAttached();
  const missingAlt = await page.locator('img:not([alt])').count();
  expect(missingAlt).toBe(0);
});

test('mobile pages do not scroll horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/', '/gallery', '/tools', '/links', '/notes', '/files', '/search', '/about']) {
    await page.goto(path);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
  }
});

test('work detail and tag pages stay inside a 360px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/gallery/example-work', '/tags/画师参考']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')]
      .filter((element) => {
        const style = getComputedStyle(element);
        if (style.position === 'fixed' || style.display === 'none') return false;
        return element.getBoundingClientRect().right > window.innerWidth + 1;
      })
      .map((element) => element.tagName + '.' + element.className)
      .slice(0, 5));
    expect(overflow).toEqual([]);
  }
});

test('sitemap excludes NSFW content', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const text = await response.text();
  expect(text).not.toContain('kitten-shadow');
});

test('modal dialogs open centered in the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto('/');
  await page.getByRole('button', { name: '搜索 ⌘K' }).click();
  const search = await page.locator('[data-search-dialog]').boundingBox();
  expect(search).not.toBeNull();
  expect(Math.abs(search!.x + search!.width / 2 - 640)).toBeLessThan(2);
  expect(Math.abs(search!.y + search!.height / 2 - 400)).toBeLessThan(2);
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: '显示 NSFW 内容' }).click();
  const nsfw = await page.locator('[data-nsfw-dialog]').boundingBox();
  expect(nsfw).not.toBeNull();
  expect(Math.abs(nsfw!.x + nsfw!.width / 2 - 640)).toBeLessThan(2);
  expect(Math.abs(nsfw!.y + nsfw!.height / 2 - 400)).toBeLessThan(2);
  await page.keyboard.press('Escape');

  await page.goto('/files');
  await page.locator('[data-preview]').first().click();
  const preview = await page.locator('[data-preview-dialog]').boundingBox();
  expect(preview).not.toBeNull();
  expect(Math.abs(preview!.x + preview!.width / 2 - 640)).toBeLessThan(2);
  expect(Math.abs(preview!.y + preview!.height / 2 - 400)).toBeLessThan(2);

  await page.goto('/gallery');
  await page.locator('#gallery-grid [data-work]:visible .thumb').first().click();
  const work = page.locator('[data-work-modal]');
  await expect(work).toBeVisible();
  const box = await work.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.x + box!.width / 2 - 640)).toBeLessThan(2);
  expect(Math.abs(box!.y + box!.height / 2 - 400)).toBeLessThan(2);
});
