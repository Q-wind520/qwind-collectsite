import { test, expect } from '@playwright/test';

test('protected work stays hidden until the correct password', async ({ page }) => {
  await page.goto('/gallery/protected-work');
  await expect(page.getByRole('heading', { name: '这段内容需要密码' })).toBeVisible();
  await expect(page.locator('[data-protected-content]')).toBeHidden();

  await page.locator('[data-protected-input]').fill('wrong');
  await page.getByRole('button', { name: '解锁' }).click();
  await expect(page.getByText('密码不正确。')).toBeVisible();

  await page.locator('[data-protected-input]').fill('qwind');
  await page.getByRole('button', { name: '解锁' }).click();
  await expect(page.locator('[data-protected-content]')).toBeVisible();
  await expect(page.getByText('这段正文在解锁前不应该显示。')).toBeVisible();
});

test('protected page is noindex', async ({ page }) => {
  await page.goto('/gallery/protected-work');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('protected content stays hidden when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/gallery/protected-work');
  await expect(page.locator('[data-protected-content]')).toBeHidden();
  await expect(page.getByText('这段正文在解锁前不应该显示。')).toBeHidden();
  await context.close();
});
