import { test, expect } from '@playwright/test';

test('link list shows external links and filters by domain', async ({ page }) => {
  await page.goto('/links');
  await expect(page.getByRole('heading', { name: '书签' })).toBeVisible();
  const link = page.locator('[data-link-card]').first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('target', '_blank');
  await page.selectOption('select[name="domain"]', 'docs.novelai.net');
  await expect(page.locator('[data-link-card]:visible')).toHaveCount(1);
});
