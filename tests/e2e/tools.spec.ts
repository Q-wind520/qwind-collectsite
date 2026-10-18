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
  await expect(page.locator('[data-output]')).toHaveValue(/\(@konya_karasue:0\.73\)/);
});
