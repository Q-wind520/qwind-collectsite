import { test, expect } from '@playwright/test';

test('prompt converter loads a sample and converts Anima to NovelAI', async ({ page }) => {
  await page.goto('/tools');
  await page.getByRole('button', { name: '载入示例' }).click();
  const output = page.locator('[data-output]');
  await expect(output).toHaveValue(/artist:konya_karasue/);
  await expect(output).toHaveValue(/1\.5::masterpiece::/);
  await expect(page.locator('[data-status]')).toContainText('已转换为 NovelAI V4.5');
});

test('prompt converter can swap direction and convert back', async ({ page }) => {
  await page.goto('/tools');
  await page.getByRole('button', { name: '载入示例' }).click();
  await page.getByRole('button', { name: '交换' }).click();
  await expect(page.locator('[data-output]')).toHaveValue(/\(@konya karasue:0\.73\)/);
});

test('translation details open in a floating card', async ({ page }) => {
  await page.goto('/tools');
  const popover = page.locator('[data-rules-popover]');
  await expect(popover).toBeHidden();
  await page.getByRole('button', { name: '详情' }).click();
  await expect(popover).toBeVisible();
  await expect(popover.locator('.rule-card')).toHaveCount(6);
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
});

test('prompt converter offers NovelAI V5 and normalizes legacy underscores', async ({ page }) => {
  await page.goto('/tools');
  await page.locator('[data-source-select]').selectOption('novelai');
  await page.locator('[data-target-select]').selectOption('novelai-v5');
  await page.locator('[data-source]').fill('artist:foo_bar, long_hair, year_2023, score_7');
  await page.getByRole('button', { name: '转换' }).click();
  await expect(page.locator('[data-output]')).toHaveValue(/artist:foo bar, long hair, year 2023, score_7/);
  await expect(page.locator('[data-status]')).toContainText('已转换为 NovelAI V5');
});
