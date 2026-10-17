# 温水の收藏站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个公开的个人收藏站，支持作品、画师、书签、笔记、文件五类内容，静态部署到 GitHub Pages。

**Architecture:** Astro 7 静态站点，Content Collections + Zod 校验内容，Tailwind v4 + CSS tokens 实现视觉，原生 TypeScript 处理筛选、搜索、灯箱和密码遮罩。内容在本地 Markdown/MDX 维护，`git push` 触发 GitHub Actions 构建并发布。

**Tech Stack:** Astro 7.4.0、TypeScript 5.9.3、Tailwind CSS 4.3.3、PhotoSwipe 5.4.4、Vitest 5.0.5、Playwright 1.64.1、pnpm 12.5.1、Node 24。

**Spec:** `docs/superpowers/specs/2026-10-17-qwind-collectsite-design.md`

## Global Constraints

- Node `24.20.0`，pnpm `12.5.1`，TypeScript `5.9.3`（`@astrojs/check` 尚不支持 TypeScript 7）。
- Astro `7.4.0`，静态输出；禁止引入服务端运行时、数据库或 CMS。
- 不引入 React/Vue/Svelte；交互只用原生 TypeScript。
- 站点标题固定为 `温水の收藏站`；仓库固定为 `Q-wind520/qwind-collectsite`。
- 生产 base path 为 `/qwind-collectsite`，由 CI 的 `BASE_PATH` 注入；本地开发 base 为 `/`。
- 所有内部链接与 public 资源必须经过 `withBase()`，禁止硬编码以 `/` 开头的站内链接。
- 中文优先；界面文案、日期格式、搜索都以中文为主。
- 首批内容 <100 条、图片总量 <1GB；原图不进 Git。
- 受保护内容只是前端遮罩；公开仓库会暴露源文件。不得把真正私密内容放入仓库。
- v1 的密码遮罩只用于 `works`；其他类型即使写了 `protected: true`，也会被公开列表、搜索、RSS、sitemap 过滤掉，不展示。
- 参考站 `AgIzT/NovelAI-Tag` 只借鉴代码结构，不复制词条、配图或汇编数据。
- 每个任务结束前必须运行 `pnpm check` 和对应测试，并提交一次 Git commit。

## Review Focus

- **中文/带空格/带 `#` 的标签**：标签页 URL、筛选和搜索都应正常，不能出现空路由、双编码或 404。测试落在 Task 3、Task 4、Task 10。
- **缺失图片或重复 slug**：构建必须失败并给出可读错误，不能静默生成破图或覆盖条目。测试落在 Task 3。
- **中文搜索的空查询、标点、单字查询**：不能抛异常或返回全站结果；单字应退化为子串匹配。测试落在 Task 10。
- **受保护内容在错误密码、未解锁、JS 关闭时**：标题、正文和图片不能显示；页面必须带 `noindex`。测试落在 Task 12。
- **360px 宽度下的长标题/长标签**：不能出现横向滚动或按钮溢出。测试落在 Task 2、Task 4、Task 13。

---

### Task 1: 脚手架、工具链与 base path

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/lib/url.ts`
- Create: `tests/unit/url.test.ts`
- Create: `src/pages/index.astro`

**Interfaces:**
- Produces: `withBase(path: string, base?: string): string`
- Produces: npm scripts `dev`, `build`, `check`, `test`, `test:e2e`, `new`, `optimize-image`

- [ ] **Step 1: 创建 `package.json` 与配置文件**

`package.json`：

```json
{
  "name": "qwind-collectsite",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@12.5.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "new": "tsx scripts/new-entry.ts",
    "optimize-image": "tsx scripts/optimize-image.ts"
  },
  "dependencies": {
    "@astrojs/mdx": "^8.1.0",
    "@astrojs/rss": "^4.0.19",
    "astro": "^7.4.0",
    "lxgw-wenkai-webfont": "^1.7.0",
    "photoswipe": "^5.4.4",
    "sharp": "^0.35.5"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "@playwright/test": "^1.64.1",
    "@tailwindcss/vite": "^4.3.3",
    "@types/node": "^24.0.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.23.15",
    "typescript": "5.9.3",
    "vitest": "^5.0.5"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild", "sharp"]
  }
}
```

`astro.config.mjs`：

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: 'https://qwind520.github.io',
  base,
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`tsconfig.json`：

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "types": ["node"]
  }
}
```

`vitest.config.ts`：

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

`playwright.config.ts`：

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

`.gitignore`：

```gitignore
node_modules/
dist/
.astro/
.env
.playwright/
test-results/
playwright-report/
.DS_Store
*.log
```

`src/env.d.ts`：

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 2: 安装依赖**

Run: `pnpm install`

Expected: `pnpm-lock.yaml` 创建，安装成功；如果 pnpm 提示构建脚本被阻止，运行 `pnpm approve-builds` 并允许 `esbuild`、`sharp`。

- [ ] **Step 3: 写失败的 `withBase` 测试**

`tests/unit/url.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { assetUrl, withBase } from '../../src/lib/url';

describe('withBase', () => {
  it('prefixes a root path with the production base', () => {
    expect(withBase('/gallery', '/qwind-collectsite')).toBe('/qwind-collectsite/gallery');
  });

  it('keeps a root path when the base is slash', () => {
    expect(withBase('/gallery', '/')).toBe('/gallery');
  });

  it('does not produce a double slash', () => {
    expect(withBase('gallery', '/qwind-collectsite/')).toBe('/qwind-collectsite/gallery');
  });

  it('handles the root path', () => {
    expect(withBase('/', '/qwind-collectsite')).toBe('/qwind-collectsite/');
  });
});

describe('assetUrl', () => {
  it('prefixes local asset paths', () => {
    expect(assetUrl('/_astro/image.webp', '/qwind-collectsite')).toBe('/qwind-collectsite/_astro/image.webp');
  });

  it('keeps absolute URLs unchanged', () => {
    expect(assetUrl('https://example.com/image.webp', '/qwind-collectsite')).toBe('https://example.com/image.webp');
  });
});
```

- [ ] **Step 4: 运行测试确认失败**

Run: `pnpm vitest run tests/unit/url.test.ts`

Expected: FAIL，报错找不到 `src/lib/url`。

- [ ] **Step 5: 实现 `src/lib/url.ts`**

```ts
export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const joined = `${cleanBase}${cleanPath}`;
  return joined === '' ? '/' : joined;
}

export function assetUrl(src: string, base = import.meta.env.BASE_URL): string {
  if (/^https?:\/\//.test(src)) return src;
  return withBase(src, base);
}
```

- [ ] **Step 6: 运行测试确认通过**

Run: `pnpm vitest run tests/unit/url.test.ts`

Expected: PASS，4 tests。

- [ ] **Step 7: 创建最小首页并验证构建**

`src/pages/index.astro`：

```astro
---
const title = '温水の收藏站';
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
  </body>
</html>
```

Run: `pnpm build`

Expected: 构建成功，输出 `dist/index.html`。

- [ ] **Step 8: 提交**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts .gitignore src/env.d.ts src/lib/url.ts tests/unit/url.test.ts src/pages/index.astro
git commit -m "chore: scaffold Astro project and base-path helper"
```

---

### Task 2: 设计系统与站点外壳

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/config/site.ts`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/ProfileCard.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`
- Create: `public/images/avatar.svg`
- Create: `public/images/banner.svg`
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/home.spec.ts`

**Interfaces:**
- Produces: `site` 配置对象（name、description、bio、avatar、banner、links、announcement、protectedPasswordHash）
- Produces: `BaseLayout` props `{ title?, description?, image?, noindex? }`
- Produces: CSS tokens `--color-*`、`--glass-*`、`--radius-*`、`--font-*`

- [ ] **Step 1: 写首页外壳的 E2E 测试**

`tests/e2e/home.spec.ts`：

```ts
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
```

- [ ] **Step 2: 安装 Playwright 浏览器并运行测试确认失败**

Run: `pnpm exec playwright install chromium`
Run: `pnpm test:e2e tests/e2e/home.spec.ts`

Expected: FAIL，找不到标题或导航。

- [ ] **Step 3: 创建设计 tokens**

`src/styles/tokens.css`：

```css
:root {
  --font-sans: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
  --font-warm: "LXGW WenKai", "Kaiti SC", "STKaiti", "Noto Serif SC", serif;
  --font-mono: "Share Tech Mono", "JetBrains Mono", ui-monospace, monospace;

  --color-text: #4c4948;
  --color-muted: #8b8380;
  --color-accent: #f0808c;
  --color-accent-soft: #fff0f0;
  --color-bg: #f6e7ec;
  --color-line: rgba(76, 73, 72, 0.12);

  --glass-bg: rgba(255, 255, 255, 0.68);
  --glass-border: rgba(255, 255, 255, 0.64);
  --glass-shadow: 0 18px 52px -30px rgba(60, 24, 38, 0.55);
  --glass-blur: 18px;

  --header-bg: rgba(255, 255, 255, 0.56);
  --radius-panel: 20px;
  --radius-card: 15px;
  --radius-thumb: 12px;

  color-scheme: light;
}

:root[data-theme="dark"] {
  --color-text: #f2ece9;
  --color-muted: #b8aeaa;
  --color-accent: #f4a7ad;
  --color-accent-soft: rgba(244, 167, 173, 0.14);
  --color-bg: #171214;
  --color-line: rgba(255, 255, 255, 0.14);

  --glass-bg: rgba(28, 22, 26, 0.62);
  --glass-border: rgba(255, 255, 255, 0.14);
  --glass-shadow: 0 18px 52px -30px rgba(0, 0, 0, 0.7);
  --header-bg: rgba(28, 22, 26, 0.58);

  color-scheme: dark;
}
```

- [ ] **Step 4: 创建全局样式**

`src/styles/global.css`：

```css
@import "tailwindcss";
@import "lxgw-wenkai-webfont/lxgwwenkai-regular.css";
@import "./tokens.css";

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  background: var(--color-bg);
}

body {
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text);
  background: transparent;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; }
img { max-width: 100%; display: block; }
button, input, select, textarea { font: inherit; }
[hidden] { display: none !important; }

.warm { font-family: var(--font-warm); }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

.skip-link {
  position: fixed; top: 8px; left: 8px; z-index: 100;
  padding: 8px 14px; border-radius: 999px;
  color: #fff; background: var(--color-accent);
  transform: translateY(-160%);
}
.skip-link:focus { transform: translateY(0); }

.backdrop {
  position: fixed; inset: 0; z-index: -3;
  background:
    linear-gradient(180deg, rgba(33, 16, 28, 0.18), rgba(33, 16, 28, 0.52)),
    var(--banner-image),
    linear-gradient(150deg, #f9a8d4, #a78bfa 52%, #312e81);
  background-size: cover;
  background-position: center 30%;
}
:root[data-theme="dark"] .backdrop {
  background:
    linear-gradient(180deg, rgba(10, 6, 9, 0.55), rgba(10, 6, 9, 0.78)),
    var(--banner-image),
    linear-gradient(150deg, #3b1d3a, #1e1b4b 52%, #0b1020);
  background-size: cover;
  background-position: center 30%;
}

.petals { position: fixed; inset: 0; z-index: -2; pointer-events: none; overflow: hidden; }
.petal {
  position: absolute; top: -24px; width: 9px; height: 9px; opacity: 0.45;
  background: rgba(255, 255, 255, 0.8); border-radius: 70% 30% 62% 38%;
  animation: fall linear infinite;
}
.p1 { left: 6%; animation-duration: 19s; animation-delay: -3s; }
.p2 { left: 18%; animation-duration: 24s; animation-delay: -11s; width: 6px; height: 6px; }
.p3 { left: 33%; animation-duration: 21s; animation-delay: -7s; }
.p4 { left: 49%; animation-duration: 27s; animation-delay: -16s; width: 7px; height: 7px; }
.p5 { left: 64%; animation-duration: 18s; animation-delay: -2s; }
.p6 { left: 78%; animation-duration: 25s; animation-delay: -13s; width: 11px; height: 11px; }
.p7 { left: 91%; animation-duration: 22s; animation-delay: -9s; width: 6px; height: 6px; }

@keyframes fall {
  0% { transform: translate3d(0, 0, 0) rotate(0deg); }
  100% { transform: translate3d(46px, 108vh, 0) rotate(340deg); }
}

.container {
  width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 20px;
}

.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-panel);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(var(--glass-blur)) saturate(1.18);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.18);
}

:root[data-theme="dark"] .work-card,
:root[data-theme="dark"] .artist-card,
:root[data-theme="dark"] .link-card,
:root[data-theme="dark"] .locked-card {
  background: var(--glass-bg);
}
:root[data-theme="dark"] select,
:root[data-theme="dark"] input {
  background: rgba(28, 22, 26, 0.55);
  color: var(--color-text);
}
:root[data-theme="dark"] .profile-links a {
  background: var(--color-accent-soft);
  border-color: var(--glass-border);
}

.page { padding: 28px 0 40px; }
.page-head { margin-bottom: 22px; color: #fff; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.3); }
.page-head h1 { margin: 0; font-size: clamp(30px, 5vw, 46px); font-weight: 600; letter-spacing: 0.02em; }
.page-head p { margin: 6px 0 0; color: rgba(255, 255, 255, 0.82); }
.kicker { margin: 0 0 8px; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; }

:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

@media (max-width: 760px) {
  .backdrop {
    background-attachment: scroll;
    background-position: center 20%;
  }
  .petals { display: none; }
  :root { --glass-blur: 10px; }
}

@media (max-width: 480px) {
  .container { padding: 0 14px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .petal { display: none; }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: 创建站点配置**

`src/config/site.ts`：

```ts
export const site = {
  name: '温水の收藏站',
  englishName: 'QwQwind Archive',
  description: '温水の个人收藏站：NovelAI 作品、画师词条、网页书签、笔记与文件。',
  bio: '记录喜欢的东西：NovelAI 作品、画师词条、网页收藏和零散笔记。慢慢收，慢慢看。',
  avatar: '/images/avatar.svg',
  banner: '/images/banner.svg',
  announcement: '图鉴施工中，画廊和画师页先上线，书签与笔记陆续补。',
  links: [
    { label: 'GitHub', href: 'https://github.com/Q-wind520' },
    { label: '博客', href: 'https://blog.qwind.top/' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  // 示例密码是 qwind；正式使用前替换哈希。
  protectedPasswordHash: '6fc0fccf335a068190743e17ece458a983aac2edff6d26fd607801fbaf9ec075',
} as const;
```

- [ ] **Step 6: 创建占位素材**

`public/favicon.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#fda1a0"/><stop offset="1" stop-color="#a78bfa"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <path d="M32 48s-14-8.6-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 10.4-14 19-14 19Z" fill="#fff" opacity=".92"/>
</svg>
```

`public/images/avatar.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#fda1a0"/><stop offset="1" stop-color="#818cf8"/>
  </linearGradient></defs>
  <rect width="200" height="200" rx="100" fill="url(#g)"/>
  <text x="100" y="124" text-anchor="middle" font-size="84" font-family="serif" fill="#fff">温</text>
</svg>
```

`public/images/banner.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#f9a8d4"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <circle cx="330" cy="280" r="260" fill="#fff" opacity=".16"/>
  <circle cx="1180" cy="620" r="340" fill="#fff" opacity=".1"/>
  <circle cx="900" cy="180" r="120" fill="#fda1a0" opacity=".22"/>
</svg>
```

- [ ] **Step 7: 创建站点外壳组件**

`src/components/SiteHeader.astro`：

```astro
---
import { site } from '../config/site';
import { withBase } from '../lib/url';

const items = [
  { label: '作品', href: '/gallery' },
  { label: '画师', href: '/artists' },
  { label: '书签', href: '/links' },
  { label: '笔记', href: '/notes' },
  { label: '文件', href: '/files' },
];
---
<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href={withBase('/')}>
      <img src={withBase(site.avatar)} alt="" width="27" height="27" />
      <span>{site.name}</span>
    </a>
    <nav class="topnav" data-nav aria-label="主导航">
      {items.map((item) => (
        <a href={withBase(item.href)}>{item.label}</a>
      ))}
    </nav>
    <div class="top-actions">
      <button type="button" data-search-open>搜索 <kbd>⌘K</kbd></button>
      <button type="button" data-theme-toggle aria-label="切换明暗主题">◐</button>
      <button type="button" class="menu-toggle" data-menu-toggle aria-label="打开菜单">☰</button>
    </div>
  </div>
</header>

<style>
  .topbar {
    position: sticky; top: 0; z-index: 30;
    background: var(--header-bg);
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(18px) saturate(1.25);
    -webkit-backdrop-filter: blur(18px) saturate(1.25);
  }
  .topbar-inner {
    max-width: 1180px; margin: 0 auto; height: 56px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    padding: 0 20px; font-size: 12px;
  }
  .brand { display: flex; align-items: center; gap: 9px; font-weight: 700; text-decoration: none; }
  .brand img { border-radius: 50%; border: 1.5px solid #fff; }
  .topnav { display: flex; gap: 20px; }
  .topnav a { color: var(--color-muted); text-decoration: none; padding-bottom: 3px; border-bottom: 1px solid transparent; }
  .topnav a:hover { color: var(--color-accent); border-color: var(--color-accent); }
  .top-actions { display: flex; align-items: center; gap: 7px; }
  .top-actions button {
    color: var(--color-muted); background: rgba(255, 255, 255, 0.35);
    border: 1px solid var(--glass-border); border-radius: 999px;
    padding: 6px 11px; font-size: 11px; cursor: pointer;
  }
  .top-actions kbd { font: inherit; font-size: 9px; opacity: 0.7; }
  .menu-toggle { display: none; }
  @media (max-width: 760px) {
    .topnav { display: none; }
    .topnav[data-open="true"] {
      display: flex; position: absolute; top: 56px; left: 12px; right: 12px;
      flex-direction: column; gap: 12px; padding: 16px;
      background: var(--glass-bg); border: 1px solid var(--glass-border);
      border-radius: var(--radius-panel); backdrop-filter: blur(18px);
    }
    .menu-toggle { display: inline-block; }
  }
</style>

<script>
  const root = document.documentElement;
  const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('qwind-theme', next);
  });

  const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  menuButton?.addEventListener('click', () => {
    if (!nav) return;
    nav.dataset.open = nav.dataset.open === 'true' ? 'false' : 'true';
  });

  document.querySelector('[data-search-open]')?.addEventListener('click', () => {
    document.querySelector<HTMLDialogElement>('[data-search-dialog]')?.showModal();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.querySelector<HTMLDialogElement>('[data-search-dialog]')?.showModal();
    }
  });
</script>
```

`src/components/SiteFooter.astro`：

```astro
---
import { site } from '../config/site';
import { withBase } from '../lib/url';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container footer-inner">
    <span>© {year} {site.name} · 个人收藏，非商业使用</span>
    <span>
      <a href={withBase('/about')}>关于</a>
      <a href={withBase('/rss.xml')}>RSS</a>
      <a href="https://github.com/Q-wind520" target="_blank" rel="noopener noreferrer">GitHub</a>
    </span>
  </div>
</footer>

<style>
  .site-footer { padding: 18px 0 28px; color: rgba(255, 255, 255, 0.82); font-size: 10px; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35); }
  .footer-inner { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  a { text-decoration: none; margin-left: 12px; }
  a:hover { color: #fff; }
</style>
```

`src/components/ProfileCard.astro`：

```astro
---
import { site } from '../config/site';
import { withBase } from '../lib/url';

interface Props {
  stats: { label: string; value: number }[];
}
const { stats } = Astro.props;
const hrefFor = (href: string) => (href.startsWith('http') ? href : withBase(href));
---
<section class="glass profile">
  <img class="avatar" src={withBase(site.avatar)} alt="温水头像" width="82" height="82" />
  <div class="profile-main">
    <div class="profile-name"><b class="warm">温水</b><span>QwQwind</span></div>
    <p class="profile-bio">{site.bio}</p>
  </div>
  <div class="profile-links">
    {site.links.map((link, index) => (
      <a class={index === 0 ? 'primary' : ''} href={hrefFor(link.href)} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {link.label}
      </a>
    ))}
  </div>
  <div class="stats">
    {stats.map((stat) => (
      <div><b>{stat.value}</b><span>{stat.label}</span></div>
    ))}
  </div>
</section>

<style>
  .profile { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding: 17px 20px; }
  .avatar { width: 82px; height: 82px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,.9); box-shadow: 0 8px 24px -10px rgba(76,40,50,.4); }
  .profile-main { flex: 1; min-width: 180px; }
  .profile-name { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .profile-name b { font-size: 20px; font-weight: 650; }
  .profile-name span { font-size: 9.5px; letter-spacing: .16em; color: var(--color-muted); text-transform: uppercase; }
  .profile-bio { margin: 5px 0 0; font-size: 12px; line-height: 1.7; color: var(--color-muted); }
  .profile-links { display: flex; gap: 7px; flex-wrap: wrap; }
  .profile-links a { display: inline-flex; padding: 7px 12px; border-radius: 999px; font-size: 11px; text-decoration: none; color: var(--color-accent); background: var(--color-accent-soft); border: 1px solid rgba(255,224,224,.9); }
  .profile-links a.primary { color: #fff; background: var(--color-accent); border-color: var(--color-accent); }
  .profile-links a:hover { transform: translateY(-1px); }
  .stats { display: flex; gap: 24px; padding-left: 22px; border-left: 1px solid var(--color-line); }
  .stats div { text-align: center; }
  .stats b { display: block; font-size: 19px; font-weight: 600; color: var(--color-accent); }
  .stats span { font-size: 9px; letter-spacing: .1em; color: var(--color-muted); }
  @media (max-width: 760px) {
    .stats { width: 100%; padding-left: 0; border-left: 0; border-top: 1px solid var(--color-line); padding-top: 12px; justify-content: space-around; }
  }
</style>
```

- [ ] **Step 8: 创建 `BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { site } from '../config/site';
import { withBase } from '../lib/url';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}

const {
  title = site.name,
  description = site.description,
  image = '/og-default.png',
  noindex = false,
} = Astro.props;

const pageTitle = title === site.name ? title : `${title} · ${site.name}`;
const canonical = new URL(Astro.url.pathname, Astro.site!).href;
const ogImage = image.startsWith('http') ? image : new URL(withBase(image), Astro.site!).href;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href={withBase('/favicon.svg')} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    {noindex && <meta name="robots" content="noindex, nofollow" />}
    <script is:inline>
      (() => {
        const key = 'qwind-theme';
        const saved = localStorage.getItem(key);
        const dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      })();
    </script>
  </head>
  <body>
    <a class="skip-link" href="#main">跳到主内容</a>
    <div class="backdrop" aria-hidden="true" style={`--banner-image: url(${withBase(site.banner)})`}></div>
    <div class="petals" aria-hidden="true">
      <span class="petal p1"></span><span class="petal p2"></span><span class="petal p3"></span>
      <span class="petal p4"></span><span class="petal p5"></span><span class="petal p6"></span><span class="petal p7"></span>
    </div>
    <SiteHeader />
    <main id="main"><slot /></main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 9: 替换首页为外壳**

`src/pages/index.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProfileCard from '../components/ProfileCard.astro';
import { site } from '../config/site';
---
<BaseLayout>
  <section class="hero">
    <p class="hero-kicker">✦ Personal Archive · 2026</p>
    <h1 class="warm">{site.name}</h1>
    <p class="hero-sub">{site.englishName} · Images, Artists & Notes</p>
  </section>

  <div class="container home-content">
    <ProfileCard stats={[
      { label: '条目', value: 0 },
      { label: '画师', value: 0 },
      { label: '标签', value: 0 },
    ]} />
  </div>
</BaseLayout>

<style>
  .hero { max-width: 1180px; margin: 0 auto; padding: 76px 20px 84px; text-align: center; color: #fff; }
  .hero-kicker { display: inline-flex; padding: 5px 13px; border-radius: 999px; font-size: 9.5px; letter-spacing: .22em; text-transform: uppercase; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.34); }
  .hero h1 { margin: 18px 0 0; font-size: clamp(44px, 7vw, 74px); font-weight: 600; letter-spacing: .14em; text-shadow: 0 6px 36px rgba(0,0,0,.42); }
  .hero-sub { margin: 12px 0 0; font-size: 10.5px; letter-spacing: .3em; text-transform: uppercase; color: rgba(255,255,255,.8); }
  .home-content { margin-top: -34px; }
</style>
```

- [ ] **Step 10: 运行 E2E 与构建**

Run: `pnpm test:e2e tests/e2e/home.spec.ts`
Expected: PASS。

Run: `pnpm build`
Expected: 构建成功。

- [ ] **Step 11: 提交**

```bash
git add src/styles src/config/site.ts src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/ProfileCard.astro src/layouts/BaseLayout.astro src/pages/index.astro public/favicon.svg public/images tests/e2e/home.spec.ts
git commit -m "feat: add glass archive shell and design tokens"
```

---

### Task 3: 内容集合、示例内容与内容工具

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/works/example-work.md`
- Create: `src/content/works/second-work.md`
- Create: `src/content/works/protected-work.md`
- Create: `src/content/artists/example-artist.md`
- Create: `src/content/artists/second-artist.md`
- Create: `src/content/links/example-link.md`
- Create: `src/content/notes/example-note.mdx`
- Create: `src/content/files/example-file.md`
- Create: `src/assets/works/example-work/01.webp`
- Create: `src/assets/works/example-work/02.webp`
- Create: `src/assets/works/second-work/01.webp`
- Create: `src/assets/works/protected-work/01.webp`
- Create: `public/files/example.txt`
- Create: `scripts/make-placeholders.mjs`
- Create: `src/lib/content.ts`
- Create: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: collections `works`, `artists`, `links`, `notes`, `files`
- Produces: `sortByDate(entries)`, `tagToSlug(tag)`, `collectTags(entries)`, `validateSlugs(entries)`, `entryUrl(type, slug)`

- [ ] **Step 1: 写内容工具测试**

`tests/unit/content.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { collectTags, sortByDate, tagToSlug, validateSlugs } from '../../src/lib/content';

describe('tagToSlug', () => {
  it('normalizes spaces, case and punctuation', () => {
    expect(tagToSlug('  Artist / Ref #1 ')).toBe('artist-ref-1');
  });

  it('keeps Chinese characters', () => {
    expect(tagToSlug('画师 参考')).toBe('画师-参考');
  });
});

describe('collectTags', () => {
  it('counts tags and ignores drafts and protected entries', () => {
    const tags = collectTags([
      { data: { tags: ['a', 'b'], draft: false } },
      { data: { tags: ['a'], draft: true } },
      { data: { tags: ['a', 'c'], draft: false, protected: true } },
    ]);
    expect(tags.get('a')).toBe(1);
    expect(tags.get('b')).toBe(1);
    expect(tags.get('c')).toBeUndefined();
  });
});

describe('validateSlugs', () => {
  it('rejects duplicate slugs', () => {
    expect(() => validateSlugs([
      { id: 'a', data: { slug: 'a' } },
      { id: 'a', data: { slug: 'a' } },
    ])).toThrow(/Duplicate slug/);
  });

  it('rejects a filename that does not match the slug', () => {
    expect(() => validateSlugs([{ id: 'a', data: { slug: 'b' } }])).toThrow(/Slug mismatch/);
  });
});

describe('sortByDate', () => {
  it('sorts newest first without mutating the input', () => {
    const input = [
      { data: { createdAt: new Date('2026-01-01') } },
      { data: { createdAt: new Date('2026-10-01') } },
    ];
    const sorted = sortByDate(input);
    expect(sorted[0].data.createdAt.toISOString()).toContain('2026-10-01');
    expect(input[0].data.createdAt.toISOString()).toContain('2026-01-01');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test tests/unit/content.test.ts`

Expected: FAIL，找不到 `src/lib/content`。

- [ ] **Step 3: 创建 `src/lib/content.ts`**

```ts
export function sortByDate<T extends { data: { createdAt: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
}

export function tagToSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[/?#%]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function collectTags(entries: { data: { tags: string[]; draft: boolean; protected?: boolean } }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    if (entry.data.draft || entry.data.protected) continue;
    for (const tag of entry.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

export function validateSlugs(entries: { id: string; data: { slug: string } }[]): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (entry.id !== entry.data.slug) {
      throw new Error(`Slug mismatch: file "${entry.id}" declares slug "${entry.data.slug}"`);
    }
    if (seen.has(entry.data.slug)) {
      throw new Error(`Duplicate slug: ${entry.data.slug}`);
    }
    seen.add(entry.data.slug);
  }
}

export type EntryType = 'works' | 'artists' | 'links' | 'notes' | 'files';

export function entryUrl(type: EntryType, slug: string): string {
  switch (type) {
    case 'works': return `/gallery/${slug}`;
    case 'artists': return `/artists/${slug}`;
    case 'notes': return `/notes/${slug}`;
    case 'links': return '/links';
    case 'files': return '/files';
  }
}
```

- [ ] **Step 4: 创建内容集合 schema**

`src/content.config.ts`：

```ts
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const base = {
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  summary: z.string().max(200).optional(),
  tags: z.array(z.string().min(1)).default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  protected: z.boolean().default(false),
  sourceUrl: z.url().optional(),
  license: z.string().optional(),
  related: z.array(z.string()).default([]),
};

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...base,
    images: z.array(image()).min(1),
    prompt: z.object({
      positive: z.string().default(''),
      negative: z.string().default(''),
      artist: z.string().optional(),
      character: z.string().optional(),
      model: z.string().optional(),
    }),
    artists: z.array(reference('artists')).default([]),
    rating: z.enum(['general', 'sensitive', 'nsfw', 'r18g']).default('general'),
    originalUrl: z.url().optional(),
  }),
});

const artists = defineCollection({
  loader: glob({ base: './src/content/artists', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...base,
    avatar: image().optional(),
    artistTag: z.string().min(1),
    aliases: z.array(z.string()).default([]),
    relatedTags: z.array(z.string()).default([]),
    externalLinks: z.array(z.object({
      label: z.string(),
      url: z.url(),
    })).default([]),
    notes: z.string().optional(),
  }),
});

const links = defineCollection({
  loader: glob({ base: './src/content/links', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    url: z.url(),
    favicon: z.url().optional(),
    description: z.string().max(300).optional(),
    archivedUrl: z.url().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    readingTime: z.number().optional(),
    toc: z.boolean().default(true),
  }),
});

const files = defineCollection({
  loader: glob({ base: './src/content/files', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...base,
    filePath: z.string().min(1),
    size: z.number().optional(),
    mime: z.string().optional(),
    preview: image().optional(),
    sha256: z.string().optional(),
    external: z.boolean().default(false),
  }),
});

export const collections = { works, artists, links, notes, files };
```

- [ ] **Step 5: 生成占位图**

`scripts/make-placeholders.mjs`：

```js
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const palettes = [
  ['#fbcfe8', '#f472b6', '#831843'],
  ['#bae6fd', '#38bdf8', '#0c4a6e'],
  ['#ddd6fe', '#a78bfa', '#4c1d95'],
  ['#fde68a', '#f59e0b', '#78350f'],
];

const makeSvg = (a, b, c, label) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <circle cx="300" cy="280" r="220" fill="#fff" opacity=".18"/>
  <circle cx="900" cy="600" r="300" fill="#fff" opacity=".1"/>
  <text x="60" y="830" fill="#fff" font-size="42" font-family="sans-serif" opacity=".85">${label}</text>
</svg>`;

const files = [
  ['src/assets/works/example-work/01.webp', 0, 'SAMPLE 01'],
  ['src/assets/works/example-work/02.webp', 1, 'SAMPLE 02'],
  ['src/assets/works/second-work/01.webp', 2, 'SAMPLE 03'],
  ['src/assets/works/protected-work/01.webp', 3, 'LOCKED'],
];

for (const [path, index, label] of files) {
  await mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
  const [a, b, c] = palettes[index];
  await sharp(Buffer.from(makeSvg(a, b, c, label))).webp({ quality: 82 }).toFile(path);
}

await mkdir('public/files', { recursive: true });
await writeFile('public/files/example.txt', 'This is a sample file for the collection.\n', 'utf8');

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#f9a8d4"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#312e81"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="300" text-anchor="middle" font-size="64" font-family="sans-serif" fill="#fff">QwQwind Archive</text>
  <text x="600" y="370" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#fff" opacity=".8">Images, Artists &amp; Notes</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-default.png');

console.log('placeholders written');
```

Run: `node scripts/make-placeholders.mjs`
Expected: 打印 `placeholders written`。

- [ ] **Step 6: 创建示例内容**

`src/content/artists/example-artist.md`：

```md
---
title: 示例画师
slug: example-artist
summary: 用来跑通画师列表、详情和作品关联的示例词条。
tags: [画师参考]
createdAt: 2026-10-01
artistTag: "artist:example"
aliases: ["Example Artist"]
relatedTags: [场景, 角色]
externalLinks:
  - label: 示例链接
    url: https://example.com
notes: 这是一条示例画师词条。
---
```

`src/content/artists/second-artist.md`：

```md
---
title: 第二位画师
slug: second-artist
summary: 用来测试筛选和列表的第二条画师词条。
tags: [画师参考, 角色]
createdAt: 2026-09-20
artistTag: "artist:second"
---
```

`src/content/works/example-work.md`：

```md
---
title: 黄昏下的旅人
slug: example-work
summary: 一张用来跑通画廊、灯箱和提示词复制的示例作品。
tags: [画师参考, 场景]
createdAt: 2026-10-01
featured: true
images:
  - ../../assets/works/example-work/01.webp
  - ../../assets/works/example-work/02.webp
prompt:
  positive: "1girl, solo, sunset, warm light, detailed background"
  negative: "lowres, bad anatomy, watermark"
  artist: "artist:example"
  character: "character:example"
  model: "NAI v5"
artists: [example-artist]
rating: general
---
这是示例作品的说明，用来验证 Markdown 正文渲染。
```

`src/content/works/second-work.md`：

```md
---
title: 深海回声
slug: second-work
summary: 第二条示例作品，用于筛选和排序测试。
tags: [深海, 角色]
createdAt: 2026-09-20
images:
  - ../../assets/works/second-work/01.webp
prompt:
  positive: "1girl, underwater, blue light, bubbles"
  negative: "lowres, bad anatomy"
  model: "NAI v5"
artists: [second-artist]
rating: sensitive
---
第二张示例作品。
```

`src/content/works/protected-work.md`：

```md
---
title: 受保护的夜航
slug: protected-work
summary: 用来验证密码遮罩的示例作品。
tags: [角色]
createdAt: 2026-09-10
protected: true
images:
  - ../../assets/works/protected-work/01.webp
prompt:
  positive: "1girl, night, city lights"
  negative: "lowres"
  model: "NAI v5"
artists: [second-artist]
rating: nsfw
---
这段正文在解锁前不应该显示。
```

`src/content/links/example-link.md`：

```md
---
title: NovelAI 官方文档
slug: example-link
summary: 提示词语法和模型说明。
tags: [AI, 工具]
createdAt: 2026-09-25
url: https://docs.novelai.net/
description: NovelAI 的官方文档入口。
---
```

`src/content/notes/example-note.mdx`：

````mdx
---
title: NAI v5 画师 tag 的组合心得
slug: example-note
summary: 记录画师 tag 叠加时的观察。
tags: [AI, 画师参考]
createdAt: 2026-10-02
toc: true
---

## 先确定画面主体

先写角色和构图，再叠画师 tag。

## 画师 tag 的权重

两个画师 tag 通常比三个更容易控制。

~~~text
artist:example, artist:second
~~~
````

`src/content/files/example-file.md`：

```md
---
title: 示例文件
slug: example-file
summary: 用来跑通文件列表和下载的示例。
tags: [资源]
createdAt: 2026-09-15
filePath: /files/example.txt
size: 42
mime: text/plain
external: false
---
```

- [ ] **Step 7: 运行类型检查与单元测试**

Run: `pnpm check`
Expected: PASS，五个集合与示例内容通过 Zod 校验。

Run: `pnpm test tests/unit/content.test.ts`
Expected: PASS。

- [ ] **Step 8: 提交**

```bash
git add src/content.config.ts src/content src/assets scripts/make-placeholders.mjs src/lib/content.ts tests/unit/content.test.ts public/files public/og-default.png
git commit -m "feat: add content collections, samples and content helpers"
```

---

### Task 4: 画廊列表与筛选

**Files:**
- Create: `src/lib/filter.ts`
- Create: `src/components/WorkCard.astro`
- Create: `src/components/LockedCard.astro`
- Create: `src/components/GalleryGrid.astro`
- Create: `src/components/FilterBar.astro`
- Create: `src/pages/gallery/index.astro`
- Create: `src/scripts/gallery-filter.ts`
- Create: `tests/unit/filter.test.ts`
- Create: `tests/e2e/gallery.spec.ts`

**Interfaces:**
- Consumes: `works` collection、`artists` collection、`validateSlugs`、`collectTags`
- Produces: `filterWorks(works, filter)`、`WorkSummary`
- Produces: `/gallery` 页面与 URL query 参数 `artist`、`rating`、`tag`、`sort`

- [ ] **Step 1: 写筛选逻辑测试**

`tests/unit/filter.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { filterWorks, type WorkSummary } from '../../src/lib/filter';

const works: WorkSummary[] = [
  { slug: 'a', title: 'A', artists: ['x'], tags: ['场景'], rating: 'general', date: '2026-10-01', protected: false },
  { slug: 'b', title: 'B', artists: ['y'], tags: ['角色'], rating: 'nsfw', date: '2026-09-01', protected: false },
  { slug: 'c', title: 'C', artists: ['x'], tags: ['场景'], rating: 'general', date: '2026-08-01', protected: true },
];

describe('filterWorks', () => {
  it('filters by tag and excludes protected works', () => {
    expect(filterWorks(works, { tag: '场景' }).map((w) => w.slug)).toEqual(['a']);
  });

  it('filters by artist', () => {
    expect(filterWorks(works, { artist: 'x' }).map((w) => w.slug)).toEqual(['a']);
  });

  it('filters by rating', () => {
    expect(filterWorks(works, { rating: 'nsfw' }).map((w) => w.slug)).toEqual(['b']);
  });

  it('sorts oldest first', () => {
    expect(filterWorks(works, { sort: 'oldest' }).map((w) => w.slug)).toEqual(['b', 'a']);
  });

  it('does not mutate the input', () => {
    const copy = [...works];
    filterWorks(works, { sort: 'oldest' });
    expect(works).toEqual(copy);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test tests/unit/filter.test.ts`

Expected: FAIL，找不到 `src/lib/filter`。

- [ ] **Step 3: 实现 `src/lib/filter.ts`**

```ts
export type WorkSummary = {
  slug: string;
  title: string;
  artists: string[];
  tags: string[];
  rating: string;
  date: string;
  protected: boolean;
};

export type GalleryFilter = {
  artist?: string;
  rating?: string;
  tag?: string;
  sort?: 'newest' | 'oldest' | 'random';
};

export function filterWorks(works: WorkSummary[], filter: GalleryFilter): WorkSummary[] {
  let result = works.filter((work) => !work.protected);

  if (filter.artist) result = result.filter((work) => work.artists.includes(filter.artist!));
  if (filter.rating) result = result.filter((work) => work.rating === filter.rating);
  if (filter.tag) result = result.filter((work) => work.tags.includes(filter.tag!));

  if (filter.sort === 'oldest') {
    return [...result].sort((a, b) => a.date.localeCompare(b.date));
  }
  if (filter.sort === 'random') {
    return shuffle([...result]);
  }
  return [...result].sort((a, b) => b.date.localeCompare(a.date));
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test tests/unit/filter.test.ts`

Expected: PASS。

- [ ] **Step 5: 创建作品卡片**

`src/components/WorkCard.astro`：

```astro
---
import { Image, getImage } from 'astro:assets';
import { getEntry, type CollectionEntry } from 'astro:content';
import { assetUrl, withBase } from '../lib/url';

interface Props { work: CollectionEntry<'works'>; }
const { work } = Astro.props;
const cover = work.data.images[0];
const large = await getImage({ src: cover, width: 1600, format: 'webp' });
const artistEntries = await Promise.all(work.data.artists.map((ref) => getEntry(ref)));
const artistNames = artistEntries.filter(Boolean).map((entry) => entry!.data.title);
const artistSlugs = work.data.artists.map((ref) => ref.id);
---
<article
  class="work-card"
  data-work
  data-artists={artistSlugs.join(' ')}
  data-tags={work.data.tags.join('|')}
  data-rating={work.data.rating}
  data-date={work.data.createdAt.toISOString()}
>
  <a
    class="thumb"
    href={assetUrl(large.src)}
    data-pswp
    data-pswp-width={cover.width}
    data-pswp-height={cover.height}
    data-prompt-positive={work.data.prompt.positive}
    data-prompt-negative={work.data.prompt.negative}
    aria-label={`查看《${work.data.title}》大图`}
  >
    <Image
      src={cover}
      alt={work.data.title}
      widths={[400, 800, 1200]}
      formats={['avif', 'webp']}
      loading="lazy"
      decoding="async"
    />
  </a>
  <div class="caption">
    <a class="title" href={withBase(`/gallery/${work.data.slug}`)}>{work.data.title}</a>
    <div class="meta">
      <span>{artistNames.join(' / ') || '未分类'}</span>
      <span>{work.data.createdAt.toISOString().slice(0, 10)}</span>
    </div>
  </div>
</article>

<style>
  .work-card { border-radius: var(--radius-card); overflow: hidden; background: rgba(255,255,255,.55); border: 1px solid var(--glass-border); box-shadow: 0 8px 24px -18px rgba(76,40,50,.45); transition: transform .3s, box-shadow .3s; }
  .work-card:hover { transform: translateY(-3px); box-shadow: 0 16px 34px -20px rgba(76,40,50,.5); }
  .thumb { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: rgba(0,0,0,.06); }
  .thumb :global(img) { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
  .work-card:hover .thumb :global(img) { transform: scale(1.05); }
  .caption { padding: 10px 12px 12px; }
  .title { display: block; font-size: 13px; font-weight: 550; text-decoration: none; }
  .title:hover { color: var(--color-accent); }
  .meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 4px; font-size: 10px; color: var(--color-muted); }
</style>
```

`src/components/LockedCard.astro`：

```astro
---
import { withBase } from '../lib/url';
interface Props { slug: string; }
const { slug } = Astro.props;
---
<a class="locked-card glass" href={withBase(`/gallery/${slug}`)} data-work data-protected="true">
  <span class="lock" aria-hidden="true">🔒</span>
  <b>受保护条目</b>
  <small>输入密码后查看</small>
</a>

<style>
  .locked-card { display: grid; place-items: center; gap: 6px; aspect-ratio: 4 / 3; text-decoration: none; color: var(--color-muted); background: rgba(255,255,255,.42); }
  .locked-card .lock { font-size: 28px; }
  .locked-card b { font-size: 13px; color: var(--color-text); }
  .locked-card small { font-size: 10px; }
</style>
```

`src/components/GalleryGrid.astro`：

```astro
---
import type { CollectionEntry } from 'astro:content';
import WorkCard from './WorkCard.astro';
import LockedCard from './LockedCard.astro';

interface Props { works: CollectionEntry<'works'>[]; }
const { works } = Astro.props;
---
<div class="gallery-grid" id="gallery-grid" data-gallery-grid>
  {works.map((work) => (
    work.data.protected
      ? <LockedCard slug={work.data.slug} />
      : <WorkCard work={work} />
  ))}
</div>

<style>
  .gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  @media (max-width: 760px) { .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
```

- [ ] **Step 6: 创建筛选条与画廊页**

`src/components/FilterBar.astro`：

```astro
---
interface Props {
  artists: { id: string; name: string }[];
  tags: [string, number][];
}
const { artists, tags } = Astro.props;
---
<form class="glass filter-bar" data-filter-form>
  <label>画师
    <select name="artist">
      <option value="">全部</option>
      {artists.map((artist) => <option value={artist.id}>{artist.name}</option>)}
    </select>
  </label>
  <label>分级
    <select name="rating">
      <option value="">全部</option>
      <option value="general">一般</option>
      <option value="sensitive">敏感</option>
      <option value="nsfw">NSFW</option>
      <option value="r18g">R18G</option>
    </select>
  </label>
  <label>标签
    <select name="tag">
      <option value="">全部</option>
      {tags.map(([tag, count]) => <option value={tag}>{tag} ({count})</option>)}
    </select>
  </label>
  <label>排序
    <select name="sort">
      <option value="newest">最新</option>
      <option value="oldest">最早</option>
      <option value="random">随机</option>
    </select>
  </label>
  <button type="reset">清除</button>
  <span class="result-count" data-result-count></span>
</form>

<style>
  .filter-bar { display: flex; align-items: end; gap: 10px; flex-wrap: wrap; padding: 12px 14px; margin-bottom: 14px; }
  label { display: grid; gap: 3px; font-size: 9px; letter-spacing: .08em; color: var(--color-muted); }
  select { border: 1px solid var(--color-line); border-radius: 999px; background: rgba(255,255,255,.65); padding: 6px 10px; font-size: 11px; color: var(--color-text); }
  button { border: 1px solid var(--color-line); border-radius: 999px; background: transparent; padding: 6px 12px; font-size: 11px; color: var(--color-muted); cursor: pointer; }
  button:hover { color: var(--color-accent); border-color: var(--color-accent); }
  .result-count { margin-left: auto; font-size: 10px; color: var(--color-muted); }
</style>
```

`src/pages/gallery/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import GalleryGrid from '../../components/GalleryGrid.astro';
import FilterBar from '../../components/FilterBar.astro';
import { collectTags, validateSlugs } from '../../lib/content';

const works = (await getCollection('works')).filter((work) => !work.data.draft);
validateSlugs(works);
const artists = (await getCollection('artists'))
  .filter((artist) => !artist.data.draft && !artist.data.protected)
  .sort((a, b) => a.data.title.localeCompare(b.data.title, 'zh-CN'));
const tags = [...collectTags(works).entries()].sort((a, b) => b[1] - a[1]);
---
<BaseLayout title="作品" description="温水の收藏站的作品画廊。">
  <div class="container page">
    <header class="page-head">
      <p class="kicker">GALLERY</p>
      <h1>作品</h1>
      <p>NovelAI 作品与提示词。点击图片看大图，点标题进入详情。</p>
    </header>
    <FilterBar artists={artists.map((artist) => ({ id: artist.id, name: artist.data.title }))} tags={tags} />
    <GalleryGrid works={works} />
  </div>
  <script>import '../../scripts/gallery-filter';</script>
</BaseLayout>
```

- [ ] **Step 7: 实现画廊筛选脚本**

`src/scripts/gallery-filter.ts`：

```ts
const form = document.querySelector<HTMLFormElement>('[data-filter-form]');
const grid = document.querySelector<HTMLElement>('[data-gallery-grid]');
const count = document.querySelector<HTMLElement>('[data-result-count]');

const FIELDS = ['artist', 'rating', 'tag', 'sort'] as const;

function readFilter(formEl: HTMLFormElement) {
  const data = new FormData(formEl);
  return {
    artist: String(data.get('artist') || ''),
    rating: String(data.get('rating') || ''),
    tag: String(data.get('tag') || ''),
    sort: String(data.get('sort') || 'newest'),
  };
}

function apply() {
  if (!form || !grid) return;
  const filter = readFilter(form);
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-work]')];

  for (const card of cards) {
    if (card.dataset.protected === 'true') {
      card.hidden = Boolean(filter.artist || filter.rating || filter.tag);
      continue;
    }
    const artistMatch = !filter.artist || (card.dataset.artists || '').split(' ').includes(filter.artist);
    const ratingMatch = !filter.rating || card.dataset.rating === filter.rating;
    const tagMatch = !filter.tag || (card.dataset.tags || '').split('|').includes(filter.tag);
    card.hidden = !(artistMatch && ratingMatch && tagMatch);
  }

  const visible = cards.filter((card) => !card.hidden);
  const sorted = [...visible].sort((a, b) => {
    if (filter.sort === 'random') return Math.random() - 0.5;
    const delta = (a.dataset.date || '').localeCompare(b.dataset.date || '');
    return filter.sort === 'oldest' ? delta : -delta;
  });
  for (const card of sorted) grid.appendChild(card);

  if (count) count.textContent = `${visible.filter((card) => card.dataset.protected !== 'true').length} 件作品`;

  const params = new URLSearchParams();
  if (filter.artist) params.set('artist', filter.artist);
  if (filter.rating) params.set('rating', filter.rating);
  if (filter.tag) params.set('tag', filter.tag);
  if (filter.sort !== 'newest') params.set('sort', filter.sort);
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}`);
}

if (form && grid) {
  const params = new URLSearchParams(location.search);
  for (const field of FIELDS) {
    const control = form.elements.namedItem(field);
    if (control instanceof HTMLSelectElement && params.get(field)) {
      control.value = params.get(field)!;
    }
  }
  form.addEventListener('change', apply);
  form.addEventListener('reset', () => window.setTimeout(apply, 0));
  apply();
}
```

- [ ] **Step 8: 写画廊 E2E**

`tests/e2e/gallery.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test('filters by tag and syncs the URL', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('[data-work]').first()).toBeVisible();
  await page.selectOption('select[name="tag"]', '场景');
  await expect(page).toHaveURL(/tag=/);
  await expect(page.locator('[data-work]:visible')).toHaveCount(1);
  await expect(page.locator('[data-result-count]')).toContainText('1 件作品');
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
```

- [ ] **Step 9: 运行测试**

Run: `pnpm test tests/unit/filter.test.ts`
Expected: PASS。

Run: `pnpm test:e2e tests/e2e/gallery.spec.ts`
Expected: PASS。

- [ ] **Step 10: 提交**

```bash
git add src/lib/filter.ts src/components/WorkCard.astro src/components/LockedCard.astro src/components/GalleryGrid.astro src/components/FilterBar.astro src/pages/gallery src/scripts/gallery-filter.ts tests/unit/filter.test.ts tests/e2e/gallery.spec.ts
git commit -m "feat: add gallery grid and client-side filtering"
```

---

### Task 5: 作品详情、提示词复制与灯箱

**Files:**
- Create: `src/components/PromptBlock.astro`
- Create: `src/components/Lightbox.astro`
- Create: `src/scripts/copy.ts`
- Create: `src/scripts/lightbox.ts`
- Create: `src/pages/gallery/[slug].astro`
- Modify: `src/pages/gallery/index.astro`
- Create: `tests/e2e/work.spec.ts`

**Interfaces:**
- Consumes: `works` collection、`getImage`、`PhotoSwipe`
- Produces: `/gallery/[slug]`、`PromptBlock` props `{ positive, negative }`、`Lightbox` prop `{ gallerySelector? }`

- [ ] **Step 1: 写作品详情 E2E**

`tests/e2e/work.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('work detail shows prompt and copies it', async ({ page }) => {
  await page.goto('/gallery/example-work');
  await expect(page.getByRole('heading', { name: '黄昏下的旅人' })).toBeVisible();
  await expect(page.getByText('1girl, solo, sunset, warm light, detailed background')).toBeVisible();
  await page.getByRole('button', { name: '复制正向' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('1girl, solo, sunset');
});

test('gallery opens a lightbox and closes with Escape', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('#gallery-grid a[data-pswp]').first().click();
  await expect(page.locator('.pswp')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.pswp')).toBeHidden();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test:e2e tests/e2e/work.spec.ts`

Expected: FAIL，详情页 404、灯箱不存在。

- [ ] **Step 3: 实现复制脚本**

`src/scripts/copy.ts`：

```ts
document.addEventListener('click', async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-copy-text]');
  if (!button) return;
  const text = button.dataset.copyText || '';
  try {
    await navigator.clipboard.writeText(text);
    const previous = button.textContent;
    button.textContent = '已复制';
    window.setTimeout(() => { button.textContent = previous; }, 1200);
  } catch {
    button.textContent = '复制失败';
  }
});
```

`src/components/PromptBlock.astro`：

```astro
---
interface Props { positive: string; negative: string; }
const { positive, negative } = Astro.props;
---
<section class="prompt-block">
  <div class="prompt-head">
    <h2>正向提示词</h2>
    <button type="button" data-copy-text={positive}>复制正向</button>
  </div>
  <pre>{positive || '—'}</pre>
  <div class="prompt-head">
    <h2>负向提示词</h2>
    <button type="button" data-copy-text={negative}>复制负向</button>
  </div>
  <pre>{negative || '—'}</pre>
</section>
<script>import '../scripts/copy';</script>

<style>
  .prompt-block { display: grid; gap: 8px; }
  .prompt-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .prompt-head h2 { margin: 0; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--color-muted); }
  button { border: 1px solid var(--color-line); border-radius: 999px; background: transparent; padding: 5px 10px; font-size: 10px; color: var(--color-accent); cursor: pointer; }
  pre { margin: 0 0 8px; padding: 12px; border-radius: 12px; background: rgba(0,0,0,.05); font-family: var(--font-mono); font-size: 11px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; }
</style>
```

- [ ] **Step 4: 实现灯箱**

`src/scripts/lightbox.ts`：

```ts
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const root = document.querySelector<HTMLElement>('[data-lightbox-root]');
if (root) {
  const selector = root.dataset.selector || '#gallery-grid';
  const lightbox = new PhotoSwipeLightbox({
    gallery: selector,
    children: 'a[data-pswp]',
    pswpModule: PhotoSwipe,
    bgOpacity: 0.92,
  });

  lightbox.on('uiRegister', () => {
    lightbox.pswp?.ui?.registerElement({
      name: 'prompt-panel',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '<div class="pswp__prompt"><div class="pswp__prompt-text"></div><div class="pswp__prompt-actions"><button type="button" data-copy-positive>复制正向</button><button type="button" data-copy-negative>复制负向</button></div></div>',
      onInit: (element, pswp) => {
        const text = element.querySelector<HTMLElement>('.pswp__prompt-text')!;
        const positiveButton = element.querySelector<HTMLButtonElement>('[data-copy-positive]')!;
        const negativeButton = element.querySelector<HTMLButtonElement>('[data-copy-negative]')!;
        const currentAnchor = () => pswp.currSlide?.data?.element as HTMLElement | undefined;
        const update = () => {
          const anchor = currentAnchor();
          const prompt = anchor?.dataset.promptPositive || '';
          text.textContent = prompt ? (prompt.length > 180 ? `${prompt.slice(0, 180)}…` : prompt) : '暂无提示词';
          positiveButton.onclick = () => navigator.clipboard.writeText(anchor?.dataset.promptPositive || '');
          negativeButton.onclick = () => navigator.clipboard.writeText(anchor?.dataset.promptNegative || '');
        };
        pswp.on('change', update);
        update();
      },
    });
  });

  lightbox.init();
}
```

`src/components/Lightbox.astro`：

```astro
---
interface Props { gallerySelector?: string; }
const { gallerySelector = '#gallery-grid' } = Astro.props;
---
<div data-lightbox-root data-selector={gallerySelector} hidden></div>
<script>import '../scripts/lightbox';</script>

<style is:global>
  .pswp__prompt {
    position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%);
    z-index: 10; width: min(680px, calc(100vw - 32px));
    padding: 12px 14px; border-radius: 14px;
    background: rgba(20, 16, 18, 0.72); color: #fff;
    backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.16);
  }
  .pswp__prompt-text { font-size: 11px; line-height: 1.6; opacity: 0.9; }
  .pswp__prompt-actions { display: flex; gap: 8px; margin-top: 8px; }
  .pswp__prompt-actions button {
    border: 1px solid rgba(255,255,255,.28); border-radius: 999px;
    background: transparent; color: #fff; padding: 4px 10px; font-size: 10px; cursor: pointer;
  }
</style>
```

- [ ] **Step 5: 实现作品详情页**

`src/pages/gallery/[slug].astro`：

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import { Image, getImage } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PromptBlock from '../../components/PromptBlock.astro';
import Lightbox from '../../components/Lightbox.astro';
import { assetUrl, withBase } from '../../lib/url';
import { tagToSlug } from '../../lib/content';

export async function getStaticPaths() {
  const works = await getCollection('works');
  return works
    .filter((work) => !work.data.draft)
    .map((work) => ({ params: { slug: work.data.slug }, props: { work } }));
}

const { work } = Astro.props;
const { Content } = await render(work);
const cover = work.data.images[0];
const large = await getImage({ src: cover, width: 1600, format: 'webp' });
const artists = await Promise.all(work.data.artists.map((ref) => getEntry(ref)));
---
<BaseLayout
  title={work.data.title}
  description={work.data.summary}
  image={large.src}
  noindex={work.data.protected}
>
  <div class="container page" id="work-lightbox">
    <article class="glass work-detail">
      <div class="work-media">
        <a href={assetUrl(large.src)} data-pswp data-pswp-width={cover.width} data-pswp-height={cover.height} aria-label={`查看《${work.data.title}》大图`}>
          <Image src={cover} alt={work.data.title} widths={[600, 1200, 1600]} formats={['avif', 'webp']} loading="eager" />
        </a>
        {work.data.images.length > 1 && (
          <div class="work-thumbs">
            {work.data.images.slice(1).map((image) => (
              <a href={assetUrl(image.src)} data-pswp data-pswp-width={image.width} data-pswp-height={image.height} aria-label="查看大图">
                <Image src={image} alt="" widths={[160, 320]} formats={['avif', 'webp']} loading="lazy" />
              </a>
            ))}
          </div>
        )}
      </div>
      <div class="work-info">
        <p class="kicker">WORK / {work.data.rating.toUpperCase()}</p>
        <h1 class="warm">{work.data.title}</h1>
        {work.data.summary && <p class="summary">{work.data.summary}</p>}
        <dl class="facts">
          <div><dt>日期</dt><dd>{work.data.createdAt.toISOString().slice(0, 10)}</dd></div>
          <div><dt>画师</dt><dd>{artists.filter(Boolean).map((artist) => artist!.data.title).join(' / ') || '—'}</dd></div>
          <div><dt>模型</dt><dd>{work.data.prompt.model || '—'}</dd></div>
          <div><dt>分级</dt><dd>{work.data.rating}</dd></div>
        </dl>
        <div class="tags">{work.data.tags.map((tag) => <a href={withBase(`/tags/${tagToSlug(tag)}`)}>#{tag}</a>)}</div>
        <PromptBlock positive={work.data.prompt.positive} negative={work.data.prompt.negative} />
      </div>
    </article>
    <div class="glass work-body"><Content /></div>
  </div>
  <Lightbox gallerySelector="#work-lightbox" />
</BaseLayout>

<style>
  .work-detail { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, .65fr); gap: 20px; padding: 20px; }
  .work-media a { display: block; border-radius: 14px; overflow: hidden; }
  .work-media :global(img) { width: 100%; height: auto; }
  .work-thumbs { display: flex; gap: 6px; margin-top: 6px; }
  .work-thumbs a { width: 64px; height: 48px; border-radius: 8px; }
  .work-thumbs :global(img) { width: 100%; height: 100%; object-fit: cover; }
  .work-info h1 { margin: 6px 0 10px; font-size: clamp(28px, 4vw, 42px); line-height: 1.15; }
  .summary { color: var(--color-muted); font-size: 13px; }
  .facts { display: grid; gap: 8px; margin: 16px 0; }
  .facts div { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--color-line); }
  .facts dt { font-size: 10px; letter-spacing: .1em; color: var(--color-muted); }
  .facts dd { margin: 0; font-size: 12px; }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .tags a { font-size: 11px; color: var(--color-accent); text-decoration: none; }
  .work-body { margin-top: 14px; padding: 20px; }
  @media (max-width: 760px) { .work-detail { grid-template-columns: 1fr; padding: 14px; } }
</style>
```

- [ ] **Step 6: 在画廊页挂载灯箱**

在 `src/pages/gallery/index.astro` 的 `</BaseLayout>` 前加入：

```astro
<Lightbox gallerySelector="#gallery-grid" />
```

并在 frontmatter 加入：

```ts
import Lightbox from '../../components/Lightbox.astro';
```

- [ ] **Step 7: 运行 E2E**

Run: `pnpm test:e2e tests/e2e/work.spec.ts`
Expected: PASS。

- [ ] **Step 8: 提交**

```bash
git add src/components/PromptBlock.astro src/components/Lightbox.astro src/scripts/copy.ts src/scripts/lightbox.ts src/pages/gallery tests/e2e/work.spec.ts
git commit -m "feat: add work detail, prompt copy and PhotoSwipe lightbox"
```

---

### Task 6: 画师列表与详情

**Files:**
- Create: `src/components/ArtistCard.astro`
- Create: `src/pages/artists/index.astro`
- Create: `src/pages/artists/[slug].astro`
- Create: `src/scripts/artist-filter.ts`
- Create: `tests/e2e/artists.spec.ts`

**Interfaces:**
- Consumes: `artists`、`works`、`reference`、`WorkCard`、`Lightbox`
- Produces: `/artists`、`/artists/[slug]`、画师 tag 一键复制

- [ ] **Step 1: 写画师 E2E**

`tests/e2e/artists.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('artist list filters and detail copies the artist tag', async ({ page }) => {
  await page.goto('/artists');
  await expect(page.getByRole('heading', { name: '画师' })).toBeVisible();
  await page.getByPlaceholder('搜索画师、别名或 tag').fill('示例');
  await expect(page.locator('[data-artist-card]:visible')).toHaveCount(1);
  await page.locator('[data-artist-card]:visible').first().click();
  await expect(page.getByRole('heading', { name: '示例画师' })).toBeVisible();
  await page.getByRole('button', { name: '复制画师 tag' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe('artist:example');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test:e2e tests/e2e/artists.spec.ts`
Expected: FAIL，页面 404。

- [ ] **Step 3: 创建画师卡片与列表**

`src/components/ArtistCard.astro`：

```astro
---
import type { CollectionEntry } from 'astro:content';
import { assetUrl, withBase } from '../lib/url';

interface Props { artist: CollectionEntry<'artists'>; workCount: number; }
const { artist, workCount } = Astro.props;
const initial = artist.data.title.slice(0, 1);
---
<a
  class="artist-card glass"
  href={withBase(`/artists/${artist.data.slug}`)}
  data-artist-card
  data-search={`${artist.data.title} ${artist.data.aliases.join(' ')} ${artist.data.artistTag}`.toLowerCase()}
>
  <span class="avatar">
    {artist.data.avatar ? <img src={assetUrl(artist.data.avatar.src)} alt="" /> : initial}
  </span>
  <span class="info">
    <b>{artist.data.title}</b>
    <small>{artist.data.artistTag}</small>
  </span>
  <span class="count">{workCount} 件</span>
</a>

<style>
  .artist-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; text-decoration: none; }
  .avatar { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #fda1a0, #a78bfa); color: #fff; font-weight: 700; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .info { flex: 1; min-width: 0; }
  .info b { display: block; font-size: 13px; }
  .info small { display: block; font-size: 10px; color: var(--color-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .count { font-size: 10px; color: var(--color-muted); }
</style>
```

`src/pages/artists/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArtistCard from '../../components/ArtistCard.astro';

const artists = (await getCollection('artists'))
  .filter((artist) => !artist.data.draft && !artist.data.protected)
  .sort((a, b) => a.data.title.localeCompare(b.data.title, 'zh-CN'));
const works = (await getCollection('works')).filter((work) => !work.data.draft && !work.data.protected);
const countFor = (id: string) => works.filter((work) => work.data.artists.some((ref) => ref.id === id)).length;
---
<BaseLayout title="画师" description="温水の收藏站的画师与词条。">
  <div class="container page">
    <header class="page-head">
      <p class="kicker">ARTISTS</p>
      <h1>画师</h1>
      <p>画师 tag、别名和代表作品。</p>
    </header>
    <div class="glass artist-tools">
      <input type="search" placeholder="搜索画师、别名或 tag" data-artist-search />
    </div>
    <div class="artist-list" data-artist-list>
      {artists.map((artist) => <ArtistCard artist={artist} workCount={countFor(artist.id)} />)}
    </div>
  </div>
  <script>import '../../scripts/artist-filter';</script>
</BaseLayout>

<style>
  .artist-tools { padding: 10px 14px; margin-bottom: 12px; }
  input { width: 100%; border: 0; background: transparent; outline: none; font-size: 13px; color: var(--color-text); }
  .artist-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  @media (max-width: 760px) { .artist-list { grid-template-columns: 1fr; } }
</style>
```

`src/scripts/artist-filter.ts`：

```ts
const input = document.querySelector<HTMLInputElement>('[data-artist-search]');
const cards = [...document.querySelectorAll<HTMLElement>('[data-artist-card]')];

input?.addEventListener('input', () => {
  const query = input.value.trim().toLowerCase();
  for (const card of cards) {
    card.hidden = Boolean(query) && !(card.dataset.search || '').includes(query);
  }
});
```

- [ ] **Step 4: 创建画师详情页**

`src/pages/artists/[slug].astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import WorkCard from '../../components/WorkCard.astro';
import Lightbox from '../../components/Lightbox.astro';
import { assetUrl, withBase } from '../../lib/url';
import { tagToSlug } from '../../lib/content';

export async function getStaticPaths() {
  const artists = await getCollection('artists');
  return artists
    .filter((artist) => !artist.data.draft && !artist.data.protected)
    .map((artist) => ({ params: { slug: artist.data.slug }, props: { artist } }));
}

const { artist } = Astro.props;
const works = (await getCollection('works'))
  .filter((work) => !work.data.draft && work.data.artists.some((ref) => ref.id === artist.id))
  .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
---
<BaseLayout title={artist.data.title} description={artist.data.summary} image={artist.data.avatar?.src}>
  <div class="container page">
    <header class="glass artist-head">
      <span class="avatar">{artist.data.avatar ? <img src={assetUrl(artist.data.avatar.src)} alt="" /> : artist.data.title.slice(0, 1)}</span>
      <div class="artist-main">
        <p class="kicker">ARTIST</p>
        <h1 class="warm">{artist.data.title}</h1>
        <p>{artist.data.summary}</p>
        <div class="tags">
          {artist.data.aliases.map((alias) => <span>{alias}</span>)}
          {artist.data.relatedTags.map((tag) => <a href={withBase(`/tags/${tagToSlug(tag)}`)}>#{tag}</a>)}
        </div>
      </div>
      <button type="button" data-copy-text={artist.data.artistTag}>复制画师 tag</button>
    </header>

    {works.length > 0 && (
      <section class="artist-works" id="artist-works">
        <h2 class="warm section-title">代表作品</h2>
        <div class="grid">{works.map((work) => <WorkCard work={work} />)}</div>
      </section>
    )}

    {artist.data.notes && <div class="glass artist-notes"><p>{artist.data.notes}</p></div>}
  </div>
  <Lightbox gallerySelector="#artist-works" />
</BaseLayout>

<style>
  .artist-head { display: flex; align-items: flex-start; gap: 16px; padding: 18px 20px; margin-bottom: 18px; flex-wrap: wrap; }
  .avatar { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #fda1a0, #a78bfa); color: #fff; font-weight: 700; font-size: 28px; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .artist-main { flex: 1; min-width: 200px; }
  .artist-main h1 { margin: 4px 0 6px; font-size: clamp(26px, 4vw, 38px); }
  .artist-main p { margin: 0; color: var(--color-muted); font-size: 12px; }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; font-size: 10px; color: var(--color-accent); }
  .tags a { text-decoration: none; }
  button { border: 1px solid var(--color-line); border-radius: 999px; background: transparent; padding: 8px 12px; font-size: 11px; color: var(--color-accent); cursor: pointer; }
  .artist-works { margin-top: 8px; }
  .section-title { color: #fff; font-size: 20px; margin: 0 0 12px; text-shadow: 0 2px 16px rgba(0,0,0,.3); }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .artist-notes { margin-top: 16px; padding: 16px 18px; font-size: 12px; color: var(--color-muted); }
  @media (max-width: 760px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
<script>import '../../scripts/copy';</script>
```

- [ ] **Step 5: 运行 E2E**

Run: `pnpm test:e2e tests/e2e/artists.spec.ts`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/ArtistCard.astro src/pages/artists src/scripts/artist-filter.ts tests/e2e/artists.spec.ts
git commit -m "feat: add artist list and detail pages"
```

---

### Task 7: 书签列表

**Files:**
- Create: `src/components/LinkCard.astro`
- Create: `src/pages/links/index.astro`
- Create: `src/scripts/link-filter.ts`
- Create: `tests/e2e/links.spec.ts`

**Interfaces:**
- Consumes: `links` collection
- Produces: `/links`、域名/标签筛选

- [ ] **Step 1: 写书签 E2E**

`tests/e2e/links.spec.ts`：

```ts
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test:e2e tests/e2e/links.spec.ts`
Expected: FAIL，页面 404。

- [ ] **Step 3: 实现书签卡片与页面**

`src/components/LinkCard.astro`：

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props { link: CollectionEntry<'links'>; }
const { link } = Astro.props;
const domain = new URL(link.data.url).hostname;
const initial = domain.slice(0, 1).toUpperCase();
---
<a
  class="link-card glass"
  href={link.data.url}
  target="_blank"
  rel="noopener noreferrer"
  data-link-card
  data-domain={domain}
  data-tags={link.data.tags.join('|')}
>
  <span class="favicon">
    {link.data.favicon ? <img src={link.data.favicon} alt="" loading="lazy" /> : initial}
  </span>
  <span class="body">
    <b>{link.data.title}</b>
    <small>{domain}</small>
    <p>{link.data.summary || link.data.description}</p>
  </span>
</a>

<style>
  .link-card { display: flex; gap: 12px; padding: 13px 15px; text-decoration: none; }
  .favicon { display: grid; place-items: center; width: 34px; height: 34px; flex: none; border-radius: 10px; background: var(--color-accent-soft); color: var(--color-accent); font-size: 13px; font-weight: 700; overflow: hidden; }
  .favicon img { width: 100%; height: 100%; object-fit: cover; }
  .body { min-width: 0; }
  .body b { display: block; font-size: 13px; }
  .body small { display: block; font-size: 10px; color: var(--color-muted); }
  .body p { margin: 4px 0 0; font-size: 11px; color: var(--color-muted); line-height: 1.6; }
</style>
```

`src/pages/links/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import LinkCard from '../../components/LinkCard.astro';

const links = (await getCollection('links'))
  .filter((link) => !link.data.draft && !link.data.protected)
  .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
const domains = [...new Set(links.map((link) => new URL(link.data.url).hostname))].sort();
const tags = [...new Set(links.flatMap((link) => link.data.tags))].sort();
---
<BaseLayout title="书签" description="温水の收藏站的网页收藏。">
  <div class="container page">
    <header class="page-head"><p class="kicker">LINKS</p><h1>书签</h1><p>网页、工具和教程。</p></header>
    <div class="glass link-tools">
      <select name="domain" data-link-domain>
        <option value="">全部域名</option>
        {domains.map((domain) => <option value={domain}>{domain}</option>)}
      </select>
      <select name="tag" data-link-tag>
        <option value="">全部标签</option>
        {tags.map((tag) => <option value={tag}>{tag}</option>)}
      </select>
    </div>
    <div class="link-list" data-link-list>
      {links.map((link) => <LinkCard link={link} />)}
    </div>
  </div>
  <script>import '../../scripts/link-filter';</script>
</BaseLayout>

<style>
  .link-tools { display: flex; gap: 8px; padding: 10px 12px; margin-bottom: 12px; }
  select { border: 1px solid var(--color-line); border-radius: 999px; background: rgba(255,255,255,.65); padding: 6px 10px; font-size: 11px; }
  .link-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  @media (max-width: 760px) { .link-list { grid-template-columns: 1fr; } }
</style>
```

`src/scripts/link-filter.ts`：

```ts
const domainSelect = document.querySelector<HTMLSelectElement>('[data-link-domain]');
const tagSelect = document.querySelector<HTMLSelectElement>('[data-link-tag]');
const cards = [...document.querySelectorAll<HTMLElement>('[data-link-card]')];

function apply() {
  const domain = domainSelect?.value || '';
  const tag = tagSelect?.value || '';
  for (const card of cards) {
    const domainMatch = !domain || card.dataset.domain === domain;
    const tagMatch = !tag || (card.dataset.tags || '').split('|').includes(tag);
    card.hidden = !(domainMatch && tagMatch);
  }
}

domainSelect?.addEventListener('change', apply);
tagSelect?.addEventListener('change', apply);
```

- [ ] **Step 4: 运行 E2E**

Run: `pnpm test:e2e tests/e2e/links.spec.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/LinkCard.astro src/pages/links src/scripts/link-filter.ts tests/e2e/links.spec.ts
git commit -m "feat: add bookmark list with domain and tag filters"
```

---

### Task 8: 笔记与 RSS

**Files:**
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/notes/[slug].astro`
- Create: `src/pages/rss.xml.ts`
- Create: `tests/e2e/notes.spec.ts`

**Interfaces:**
- Consumes: `notes` collection、`render`、`@astrojs/rss`
- Produces: `/notes`、`/notes/[slug]`、`/rss.xml`（仅笔记）

- [ ] **Step 1: 写笔记 E2E**

`tests/e2e/notes.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test('note list opens a note with headings and content', async ({ page }) => {
  await page.goto('/notes');
  await expect(page.getByRole('heading', { name: '笔记' })).toBeVisible();
  await page.getByRole('link', { name: 'NAI v5 画师 tag 的组合心得' }).click();
  await expect(page.getByRole('heading', { name: '先确定画面主体' })).toBeVisible();
  await expect(page.getByText('两个画师 tag 通常比三个更容易控制。')).toBeVisible();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test:e2e tests/e2e/notes.spec.ts`
Expected: FAIL，页面 404。

- [ ] **Step 3: 实现笔记列表与详情**

`src/pages/notes/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { withBase } from '../../lib/url';

const notes = (await getCollection('notes'))
  .filter((note) => !note.data.draft && !note.data.protected)
  .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
const readingTime = (body: string) => Math.max(1, Math.round(body.replace(/\s+/g, '').length / 300));
---
<BaseLayout title="笔记" description="温水の收藏站的笔记与文章。">
  <div class="container page">
    <header class="page-head"><p class="kicker">NOTES</p><h1>笔记</h1><p>零散记录、配置和心得。</p></header>
    <div class="note-list">
      {notes.map((note) => (
        <a class="glass note-card" href={withBase(`/notes/${note.data.slug}`)}>
          <span class="date">{note.data.createdAt.toISOString().slice(0, 10)}</span>
          <b class="warm">{note.data.title}</b>
          <p>{note.data.summary}</p>
          <span class="meta">{readingTime(note.body ?? '')} 分钟 · {note.data.tags.map((tag) => `#${tag}`).join(' ')}</span>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .note-list { display: grid; gap: 10px; }
  .note-card { display: grid; gap: 5px; padding: 16px 18px; text-decoration: none; }
  .note-card b { font-size: 18px; }
  .note-card p { margin: 0; font-size: 12px; color: var(--color-muted); }
  .date, .meta { font-size: 10px; color: var(--color-muted); }
</style>
```

`src/pages/notes/[slug].astro`：

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const notes = await getCollection('notes');
  return notes
    .filter((note) => !note.data.draft && !note.data.protected)
    .map((note) => ({ params: { slug: note.data.slug }, props: { note } }));
}

const { note } = Astro.props;
const { Content, headings } = await render(note);
---
<BaseLayout title={note.data.title} description={note.data.summary} noindex={note.data.protected}>
  <div class="container page">
    <article class="glass note-article">
      <header>
        <p class="kicker">NOTE / {note.data.createdAt.toISOString().slice(0, 10)}</p>
        <h1 class="warm">{note.data.title}</h1>
        {note.data.summary && <p class="summary">{note.data.summary}</p>}
        <div class="tags">{note.data.tags.map((tag) => <span>#{tag}</span>)}</div>
      </header>
      {note.data.toc && headings.length > 0 && (
        <aside class="toc">
          <b>目录</b>
          {headings.filter((heading) => heading.depth <= 3).map((heading) => (
            <a href={`#${heading.slug}`}>{heading.text}</a>
          ))}
        </aside>
      )}
      <div class="prose"><Content /></div>
    </article>
  </div>
</BaseLayout>

<style>
  .note-article { padding: 24px; }
  .note-article h1 { margin: 6px 0 8px; font-size: clamp(28px, 4vw, 42px); }
  .summary { color: var(--color-muted); font-size: 13px; }
  .tags { display: flex; gap: 8px; margin: 10px 0 20px; font-size: 10px; color: var(--color-accent); }
  .toc { display: grid; gap: 4px; padding: 10px 12px; margin: 0 0 20px; border-left: 2px solid var(--color-accent); font-size: 11px; }
  .toc a { color: var(--color-muted); text-decoration: none; }
  .toc a:hover { color: var(--color-accent); }
  .prose :global(h2) { margin-top: 28px; font-size: 22px; }
  .prose :global(h3) { margin-top: 22px; font-size: 17px; }
  .prose :global(p) { margin: 10px 0; }
  .prose :global(pre) { padding: 14px; border-radius: 12px; overflow-x: auto; font-family: var(--font-mono); font-size: 11px; }
  .prose :global(code) { font-family: var(--font-mono); }
  @media (min-width: 900px) {
    .note-article { max-width: 820px; margin: 0 auto; }
  }
</style>
```

- [ ] **Step 4: 实现 RSS**

`src/pages/rss.xml.ts`：

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { withBase } from '../lib/url';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const notes = (await getCollection('notes'))
    .filter((note) => !note.data.draft && !note.data.protected)
    .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.createdAt,
      description: note.data.summary ?? '',
      link: withBase(`/notes/${note.data.slug}`),
    })),
  });
}
```

- [ ] **Step 5: 运行 E2E 与构建**

Run: `pnpm test:e2e tests/e2e/notes.spec.ts`
Expected: PASS。

Run: `pnpm build`
Expected: 构建成功，`dist/rss.xml` 存在。

- [ ] **Step 6: 提交**

```bash
git add src/pages/notes src/pages/rss.xml.ts tests/e2e/notes.spec.ts
git commit -m "feat: add notes pages and RSS feed"
```

---

### Task 9: 文件列表与预览

**Files:**
- Create: `src/lib/format.ts`
- Create: `src/pages/files/index.astro`
- Create: `src/scripts/file-preview.ts`
- Create: `tests/unit/format.test.ts`
- Create: `tests/e2e/files.spec.ts`

**Interfaces:**
- Produces: `formatBytes(bytes: number): string`
- Produces: `/files` 列表与图片/PDF 预览

- [ ] **Step 1: 写 `formatBytes` 测试**

`tests/unit/format.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { formatBytes } from '../../src/lib/format';

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(52)).toBe('52 B'));
  it('formats kilobytes', () => expect(formatBytes(2048)).toBe('2.0 KB'));
  it('formats megabytes', () => expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB'));
  it('handles zero', () => expect(formatBytes(0)).toBe('0 B'));
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test tests/unit/format.test.ts`
Expected: FAIL，找不到 `src/lib/format`。

- [ ] **Step 3: 实现 `formatBytes`**

`src/lib/format.ts`：

```ts
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return index === 0 ? `${Math.round(value)} ${units[index]}` : `${value.toFixed(1)} ${units[index]}`;
}
```

- [ ] **Step 4: 实现文件页面**

`src/pages/files/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { formatBytes } from '../../lib/format';
import { withBase } from '../../lib/url';

const files = (await getCollection('files'))
  .filter((file) => !file.data.draft && !file.data.protected)
  .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
const hrefFor = (file: (typeof files)[number]) =>
  file.data.external || file.data.filePath.startsWith('http') ? file.data.filePath : withBase(file.data.filePath);
---
<BaseLayout title="文件" description="温水の收藏站的文件与资源。">
  <div class="container page">
    <header class="page-head"><p class="kicker">FILES</p><h1>文件</h1><p>可下载的资源与预览。</p></header>
    <div class="glass file-table">
      {files.map((file) => (
        <div class="file-row" data-file-row data-mime={file.data.mime || ''} data-href={hrefFor(file)}>
          <span class="type">{file.data.mime?.split('/')[0] || 'FILE'}</span>
          <a class="name" href={hrefFor(file)} target={file.data.external ? '_blank' : undefined} rel={file.data.external ? 'noopener noreferrer' : undefined}>
            {file.data.title}
          </a>
          <span class="meta">{file.data.size ? formatBytes(file.data.size) : '—'}</span>
          <span class="meta">{file.data.createdAt.toISOString().slice(0, 10)}</span>
          {(file.data.mime?.startsWith('image/') || file.data.mime === 'application/pdf') && (
            <button type="button" data-preview>预览</button>
          )}
        </div>
      ))}
    </div>
  </div>
  <dialog class="preview-dialog" data-preview-dialog>
    <button type="button" class="close" data-preview-close>关闭</button>
    <div data-preview-body></div>
  </dialog>
  <script>import '../../scripts/file-preview';</script>
</BaseLayout>

<style>
  .file-table { padding: 4px 14px; }
  .file-row { display: grid; grid-template-columns: 54px minmax(0, 1fr) 74px 92px auto; gap: 10px; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--color-line); font-size: 12px; }
  .file-row:last-child { border-bottom: 0; }
  .type { font-size: 9px; letter-spacing: .08em; color: var(--color-accent); }
  .name { text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .name:hover { color: var(--color-accent); }
  .meta { font-size: 10px; color: var(--color-muted); text-align: right; }
  button { border: 1px solid var(--color-line); border-radius: 999px; background: transparent; padding: 4px 9px; font-size: 10px; color: var(--color-muted); cursor: pointer; }
  .preview-dialog { width: min(860px, calc(100vw - 32px)); max-height: 86vh; border: 1px solid var(--glass-border); border-radius: var(--radius-panel); padding: 16px; background: var(--glass-bg); backdrop-filter: blur(18px); color: var(--color-text); }
  .preview-dialog::backdrop { background: rgba(0,0,0,.55); }
  .close { margin-left: auto; display: block; }
  .preview-dialog :global(img) { max-height: 70vh; margin: 0 auto; }
  .preview-dialog :global(iframe) { width: 100%; height: 70vh; border: 0; }
  @media (max-width: 600px) { .file-row { grid-template-columns: 44px minmax(0, 1fr) auto; } .file-row .meta:nth-of-type(2) { display: none; } }
</style>
```

`src/scripts/file-preview.ts`：

```ts
const dialog = document.querySelector<HTMLDialogElement>('[data-preview-dialog]');
const body = document.querySelector<HTMLElement>('[data-preview-body]');
const close = document.querySelector<HTMLButtonElement>('[data-preview-close]');

for (const row of document.querySelectorAll<HTMLElement>('[data-file-row]')) {
  row.querySelector<HTMLButtonElement>('[data-preview]')?.addEventListener('click', () => {
    if (!dialog || !body) return;
    const href = row.dataset.href || '';
    const mime = row.dataset.mime || '';
    body.innerHTML = '';
    if (mime.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = href;
      img.alt = '';
      body.append(img);
    } else if (mime === 'application/pdf') {
      const frame = document.createElement('iframe');
      frame.src = href;
      frame.title = 'PDF 预览';
      body.append(frame);
    }
    dialog.showModal();
  });
}

close?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
```

- [ ] **Step 5: 写文件 E2E**

`tests/e2e/files.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test('file list shows a downloadable row', async ({ page }) => {
  await page.goto('/files');
  await expect(page.getByRole('heading', { name: '文件' })).toBeVisible();
  await expect(page.getByRole('link', { name: '示例文件' })).toHaveAttribute('href', '/files/example.txt');
});
```

- [ ] **Step 6: 运行测试**

Run: `pnpm test tests/unit/format.test.ts`
Run: `pnpm test:e2e tests/e2e/files.spec.ts`
Expected: PASS。

- [ ] **Step 7: 提交**

```bash
git add src/lib/format.ts src/pages/files src/scripts/file-preview.ts tests/unit/format.test.ts tests/e2e/files.spec.ts
git commit -m "feat: add file list and preview dialog"
```

---

### Task 10: 标签页与全站搜索

**Files:**
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/search.astro`
- Create: `src/pages/search-index.json.ts`
- Create: `src/components/SearchDialog.astro`
- Create: `src/lib/search.ts`
- Create: `src/scripts/search-ui.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `tests/unit/search.test.ts`
- Create: `tests/e2e/search.spec.ts`

**Interfaces:**
- Produces: `SearchEntry`、`normalize(text)`、`bigrams(text)`、`searchEntries(entries, query)`
- Produces: `/search-index.json`、`/search`、`/tags/[tag]`、全局搜索对话框

- [ ] **Step 1: 写搜索单元测试**

`tests/unit/search.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { bigrams, normalize, searchEntries, type SearchEntry } from '../../src/lib/search';

const entries: SearchEntry[] = [
  { id: 'w1', type: 'work', title: '黄昏下的旅人', summary: '暖色场景', tags: ['场景', '画师参考'], url: '/gallery/w1', text: '', date: '2026-10-01' },
  { id: 'n1', type: 'note', title: 'NAI v5 心得', summary: '画师 tag 组合', tags: ['AI'], url: '/notes/n1', text: '两个画师 tag 通常比三个更容易控制', date: '2026-09-01' },
];

describe('normalize', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalize('  NAI   V5  ')).toBe('nai v5');
  });
});

describe('bigrams', () => {
  it('creates Chinese bigrams', () => {
    expect(bigrams('画师参考')).toContain('画师');
    expect(bigrams('画师参考')).toContain('师参');
  });
});

describe('searchEntries', () => {
  it('matches a Chinese title', () => {
    expect(searchEntries(entries, '黄昏').map((entry) => entry.id)).toEqual(['w1']);
  });

  it('matches a tag', () => {
    expect(searchEntries(entries, '画师参考').map((entry) => entry.id)).toEqual(['w1']);
  });

  it('matches note body text', () => {
    expect(searchEntries(entries, '三个').map((entry) => entry.id)).toEqual(['n1']);
  });

  it('returns nothing for an empty query', () => {
    expect(searchEntries(entries, '   ')).toEqual([]);
  });

  it('does not throw for punctuation', () => {
    expect(() => searchEntries(entries, '???')).not.toThrow();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test tests/unit/search.test.ts`
Expected: FAIL，找不到 `src/lib/search`。

- [ ] **Step 3: 实现搜索库**

`src/lib/search.ts`：

```ts
export type SearchEntry = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  url: string;
  text: string;
  date: string;
};

export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function bigrams(text: string): string[] {
  const compact = normalize(text).replace(/[^\p{L}\p{N}]+/gu, '');
  const result = new Set<string>();
  for (let index = 0; index < compact.length - 1; index += 1) {
    result.add(compact.slice(index, index + 2));
  }
  return [...result];
}

export function searchEntries(entries: SearchEntry[], query: string, limit = 20): SearchEntry[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const queryBigrams = bigrams(normalizedQuery);

  return entries
    .map((entry) => {
      const title = normalize(entry.title);
      const summary = normalize(entry.summary);
      const tags = normalize(entry.tags.join(' '));
      const text = normalize(entry.text);
      let score = 0;

      if (title.includes(normalizedQuery)) score += 12;
      if (tags.includes(normalizedQuery)) score += 8;
      if (summary.includes(normalizedQuery)) score += 4;
      if (text.includes(normalizedQuery)) score += 2;

      for (const bigram of queryBigrams) {
        if (title.includes(bigram)) score += 4;
        if (tags.includes(bigram)) score += 3;
        if (summary.includes(bigram)) score += 2;
        if (text.includes(bigram)) score += 1;
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
    .slice(0, limit)
    .map(({ entry }) => entry);
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test tests/unit/search.test.ts`
Expected: PASS。

- [ ] **Step 5: 生成搜索索引**

`src/pages/search-index.json.ts`：

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/url';
import type { SearchEntry } from '../lib/search';

export const GET: APIRoute = async () => {
  const works = (await getCollection('works')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const artists = (await getCollection('artists')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const links = (await getCollection('links')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const notes = (await getCollection('notes')).filter((entry) => !entry.data.draft && !entry.data.protected);
  const files = (await getCollection('files')).filter((entry) => !entry.data.draft && !entry.data.protected);

  const index: SearchEntry[] = [
    ...works.map((entry) => ({
      id: `work-${entry.id}`, type: '作品', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase(`/gallery/${entry.data.slug}`), text: entry.data.prompt.positive,
      date: entry.data.createdAt.toISOString(),
    })),
    ...artists.map((entry) => ({
      id: `artist-${entry.id}`, type: '画师', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: [...entry.data.tags, entry.data.artistTag],
      url: withBase(`/artists/${entry.data.slug}`), text: entry.data.notes ?? '',
      date: entry.data.createdAt.toISOString(),
    })),
    ...links.map((entry) => ({
      id: `link-${entry.id}`, type: '书签', title: entry.data.title,
      summary: entry.data.summary ?? entry.data.description ?? '', tags: entry.data.tags,
      url: withBase('/links'), text: entry.data.url,
      date: entry.data.createdAt.toISOString(),
    })),
    ...notes.map((entry) => ({
      id: `note-${entry.id}`, type: '笔记', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase(`/notes/${entry.data.slug}`), text: (entry.body ?? '').replace(/[#*_>`[\]()]/g, ' ').slice(0, 2000),
      date: entry.data.createdAt.toISOString(),
    })),
    ...files.map((entry) => ({
      id: `file-${entry.id}`, type: '文件', title: entry.data.title,
      summary: entry.data.summary ?? '', tags: entry.data.tags,
      url: withBase('/files'), text: '',
      date: entry.data.createdAt.toISOString(),
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
```

- [ ] **Step 6: 实现搜索 UI**

`src/scripts/search-ui.ts`：

```ts
import { searchEntries, type SearchEntry } from '../lib/search';

const roots = [...document.querySelectorAll<HTMLElement>('[data-search-root]')];

if (roots.length > 0) {
  let indexPromise: Promise<SearchEntry[]> | null = null;
  const load = () => (indexPromise ??= fetch(`${import.meta.env.BASE_URL}search-index.json`).then((response) => response.json()));

  for (const root of roots) {
    const input = root.querySelector<HTMLInputElement>('[data-search-input]');
    const results = root.querySelector<HTMLElement>('[data-search-results]');
    if (!input || !results) continue;

    let entries: SearchEntry[] = [];
    load().then((data) => { entries = data; if (input.value) render(); });

    const render = () => {
      const query = input.value.trim();
      if (!query) {
        results.innerHTML = '<p class="search-empty">输入标题、标签或正文关键词。</p>';
        return;
      }
      const found = searchEntries(entries, query);
      results.innerHTML = found.length
        ? found.map((entry) => `<a class="search-hit" href="${entry.url}"><span>${entry.type}</span><b>${escapeHtml(entry.title)}</b><small>${escapeHtml(entry.summary)}</small></a>`).join('')
        : '<p class="search-empty">没有找到匹配内容。</p>';
    };

    input.addEventListener('input', render);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character);
}
```

`src/components/SearchDialog.astro`：

```astro
---
---
<dialog class="search-dialog" data-search-dialog>
  <form method="dialog" class="dialog-close"><button aria-label="关闭搜索">✕</button></form>
  <div data-search-root data-autofocus="true">
    <label class="sr-only" for="global-search">搜索全站</label>
    <input id="global-search" data-search-input type="search" placeholder="搜索标题、标签或正文…" autocomplete="off" />
    <div data-search-results class="search-results"><p class="search-empty">输入标题、标签或正文关键词。</p></div>
  </div>
</dialog>
<script>import '../scripts/search-ui';</script>

<style>
  .search-dialog { width: min(640px, calc(100vw - 28px)); max-height: 78vh; border: 1px solid var(--glass-border); border-radius: var(--radius-panel); padding: 16px; background: var(--glass-bg); color: var(--color-text); backdrop-filter: blur(18px); }
  .search-dialog::backdrop { background: rgba(0,0,0,.55); }
  .dialog-close { display: flex; justify-content: flex-end; }
  .dialog-close button { border: 0; background: transparent; font-size: 16px; cursor: pointer; color: var(--color-muted); }
  input { width: 100%; border: 1px solid var(--color-line); border-radius: 12px; padding: 10px 12px; background: rgba(255,255,255,.55); color: var(--color-text); }
  .search-results { margin-top: 10px; display: grid; gap: 6px; overflow-y: auto; max-height: 56vh; }
  .search-results :global(.search-hit) { display: grid; grid-template-columns: 44px 1fr; gap: 2px 10px; padding: 9px 10px; border-radius: 10px; text-decoration: none; }
  .search-results :global(.search-hit:hover) { background: var(--color-accent-soft); }
  .search-results :global(.search-hit span) { grid-row: span 2; font-size: 9px; color: var(--color-accent); }
  .search-results :global(.search-hit b) { font-size: 12px; }
  .search-results :global(.search-hit small) { font-size: 10px; color: var(--color-muted); }
  .search-results :global(.search-empty) { font-size: 11px; color: var(--color-muted); }
</style>
```

- [ ] **Step 7: 在布局中挂载搜索对话框**

在 `src/layouts/BaseLayout.astro` 的 `</body>` 前加入：

```astro
<SearchDialog />
```

并在 frontmatter 加入：

```ts
import SearchDialog from '../components/SearchDialog.astro';
```

- [ ] **Step 8: 实现搜索页与标签页**

`src/pages/search.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="搜索" description="搜索温水の收藏站的全部内容。">
  <div class="container page">
    <header class="page-head"><p class="kicker">SEARCH</p><h1>搜索</h1><p>标题、标签、正文都可以搜。</p></header>
    <div class="glass search-page" data-search-root>
      <input data-search-input type="search" placeholder="搜索标题、标签或正文…" autofocus />
      <div data-search-results class="search-results"><p class="search-empty">输入标题、标签或正文关键词。</p></div>
    </div>
  </div>
  <script>import '../scripts/search-ui';</script>
</BaseLayout>

<style>
  .search-page { padding: 16px; }
  input { width: 100%; border: 1px solid var(--color-line); border-radius: 12px; padding: 10px 12px; background: rgba(255,255,255,.55); color: var(--color-text); }
  .search-results { margin-top: 12px; display: grid; gap: 6px; }
  .search-results :global(.search-hit) { display: grid; grid-template-columns: 44px 1fr; gap: 2px 10px; padding: 10px 12px; border-radius: 10px; text-decoration: none; }
  .search-results :global(.search-hit:hover) { background: var(--color-accent-soft); }
  .search-results :global(.search-hit span) { grid-row: span 2; font-size: 9px; color: var(--color-accent); }
  .search-results :global(.search-hit b) { font-size: 13px; }
  .search-results :global(.search-hit small) { font-size: 10px; color: var(--color-muted); }
  .search-results :global(.search-empty) { font-size: 11px; color: var(--color-muted); }
</style>
```

`src/pages/tags/[tag].astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import WorkCard from '../../components/WorkCard.astro';
import { collectTags, tagToSlug, validateSlugs } from '../../lib/content';
import { withBase } from '../../lib/url';

export async function getStaticPaths() {
  const [works, artists, links, notes, files] = await Promise.all([
    getCollection('works'), getCollection('artists'), getCollection('links'), getCollection('notes'), getCollection('files'),
  ]);
  const tags = collectTags([...works, ...artists, ...links, ...notes, ...files]);
  return [...tags.keys()]
    .map((tag) => ({ tag, slug: tagToSlug(tag) }))
    .filter((item) => item.slug.length > 0)
    .map((item) => ({ params: { tag: item.slug }, props: { tag: item.tag } }));
}

const { tag } = Astro.props;
const [works, artists, links, notes, files] = await Promise.all([
  getCollection('works'), getCollection('artists'), getCollection('links'), getCollection('notes'), getCollection('files'),
]);
for (const collection of [works, artists, links, notes, files]) validateSlugs(collection);
const match = (entry: { data: { tags: string[] } }) => entry.data.tags.includes(tag);
const taggedWorks = works.filter((entry) => !entry.data.draft && !entry.data.protected && match(entry));
const taggedArtists = artists.filter((entry) => !entry.data.draft && !entry.data.protected && match(entry));
const taggedLinks = links.filter((entry) => !entry.data.draft && !entry.data.protected && match(entry));
const taggedNotes = notes.filter((entry) => !entry.data.draft && !entry.data.protected && match(entry));
const taggedFiles = files.filter((entry) => !entry.data.draft && !entry.data.protected && match(entry));
---
<BaseLayout title={`#${tag}`} description={`标签 #${tag} 下的收藏。`}>
  <div class="container page">
    <header class="page-head"><p class="kicker">TAG</p><h1>#{tag}</h1></header>
    {taggedWorks.length > 0 && <section class="tag-section"><h2>作品</h2><div class="grid">{taggedWorks.map((work) => <WorkCard work={work} />)}</div></section>}
    <section class="glass tag-list">
      {taggedArtists.map((entry) => <a href={withBase(`/artists/${entry.data.slug}`)}>画师 · {entry.data.title}</a>)}
      {taggedLinks.map((entry) => <a href={withBase('/links')}>书签 · {entry.data.title}</a>)}
      {taggedNotes.map((entry) => <a href={withBase(`/notes/${entry.data.slug}`)}>笔记 · {entry.data.title}</a>)}
      {taggedFiles.map((entry) => <a href={withBase('/files')}>文件 · {entry.data.title}</a>)}
    </section>
  </div>
</BaseLayout>

<style>
  .tag-section { margin-bottom: 16px; }
  .tag-section h2 { color: #fff; font-size: 18px; margin: 0 0 10px; }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .tag-list { display: grid; gap: 2px; padding: 8px 14px; }
  .tag-list a { padding: 9px 0; border-bottom: 1px solid var(--color-line); text-decoration: none; font-size: 12px; }
  .tag-list a:hover { color: var(--color-accent); }
  @media (max-width: 760px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
```

- [ ] **Step 9: 写搜索 E2E**

`tests/e2e/search.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test('global search finds a work by Chinese title', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /搜索/ }).first().click();
  await expect(page.locator('[data-search-dialog]')).toBeVisible();
  await page.locator('[data-search-dialog] [data-search-input]').fill('黄昏');
  await expect(page.locator('[data-search-dialog] [data-search-results]')).toContainText('黄昏下的旅人');
});

test('tag page aggregates a cross-type tag', async ({ page }) => {
  await page.goto('/tags/画师参考');
  await expect(page.getByRole('heading', { name: '#画师参考' })).toBeVisible();
});
```

- [ ] **Step 10: 运行测试**

Run: `pnpm test tests/unit/search.test.ts`
Run: `pnpm test:e2e tests/e2e/search.spec.ts`
Expected: PASS。

- [ ] **Step 11: 提交**

```bash
git add src/lib/search.ts src/scripts/search-ui.ts src/components/SearchDialog.astro src/pages/search.astro src/pages/search-index.json.ts src/pages/tags src/layouts/BaseLayout.astro tests/unit/search.test.ts tests/e2e/search.spec.ts
git commit -m "feat: add tag pages and client-side site search"
```

---

### Task 11: 首页整合

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/RecentList.astro`
- Create: `src/scripts/announcement.ts`
- Create: `tests/e2e/home.spec.ts`（修改）

**Interfaces:**
- Consumes: 五个集合、`sortByDate`、`collectTags`、`ProfileCard`、`WorkCard`
- Produces: 首页精选、画廊预览、最近更新、公告关闭

- [ ] **Step 1: 扩展首页 E2E**

在 `tests/e2e/home.spec.ts` 追加：

```ts
test('home shows featured works and recent entries', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '精选作品' })).toBeVisible();
  await expect(page.locator('[data-work]').first()).toBeVisible();
  await expect(page.getByText('NAI v5 画师 tag 的组合心得')).toBeVisible();
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
```

- [ ] **Step 2: 创建最近更新组件**

`src/components/RecentList.astro`：

```astro
---
interface Props {
  items: { type: string; title: string; href: string; date: Date }[];
}
const { items } = Astro.props;
---
<div class="glass recent-list">
  {items.map((item) => (
    <a class="recent-row" href={item.href}>
      <span class="type">{item.type}</span>
      <b>{item.title}</b>
      <span class="date">{item.date.toISOString().slice(0, 10)}</span>
    </a>
  ))}
</div>

<style>
  .recent-list { padding: 4px 15px; }
  .recent-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--color-line); text-decoration: none; font-size: 12.5px; }
  .recent-row:last-child { border-bottom: 0; }
  .recent-row:hover b { color: var(--color-accent); }
  .type { width: 36px; flex: none; font-size: 9px; letter-spacing: .08em; color: var(--color-accent); }
  .date { margin-left: auto; font-size: 10px; color: var(--color-muted); }
</style>
```

- [ ] **Step 3: 重写首页**

`src/pages/index.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProfileCard from '../components/ProfileCard.astro';
import WorkCard from '../components/WorkCard.astro';
import RecentList from '../components/RecentList.astro';
import { Image } from 'astro:assets';
import { site } from '../config/site';
import { withBase } from '../lib/url';
import { sortByDate, collectTags } from '../lib/content';
import { getCollection } from 'astro:content';

const [works, artists, links, notes, files] = await Promise.all([
  getCollection('works'), getCollection('artists'), getCollection('links'), getCollection('notes'), getCollection('files'),
]);

const publicWorks = sortByDate(works.filter((entry) => !entry.data.draft && !entry.data.protected));
const featured = publicWorks.filter((entry) => entry.data.featured).slice(0, 3);
const preview = publicWorks.slice(0, 8);
const tags = collectTags([...works, ...artists, ...links, ...notes, ...files]);

const recent = [
  ...works.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => ({ type: '作品', title: entry.data.title, href: withBase(`/gallery/${entry.data.slug}`), date: entry.data.createdAt })),
  ...notes.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => ({ type: '笔记', title: entry.data.title, href: withBase(`/notes/${entry.data.slug}`), date: entry.data.createdAt })),
  ...links.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => ({ type: '书签', title: entry.data.title, href: withBase('/links'), date: entry.data.createdAt })),
  ...files.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => ({ type: '文件', title: entry.data.title, href: withBase('/files'), date: entry.data.createdAt })),
].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
---
<BaseLayout>
  <section class="hero">
    <p class="hero-kicker">✦ Personal Archive · 2026</p>
    <h1 class="warm">{site.name}</h1>
    <p class="hero-sub">{site.englishName} · Images, Artists & Notes</p>
    <span class="hero-badge">首批收录 {publicWorks.length} 件作品 · 持续整理中</span>
  </section>

  <div class="container home-content">
    <ProfileCard stats={[
      { label: '条目', value: publicWorks.length + artists.filter((entry) => !entry.data.draft && !entry.data.protected).length + links.filter((entry) => !entry.data.draft && !entry.data.protected).length + notes.filter((entry) => !entry.data.draft && !entry.data.protected).length + files.filter((entry) => !entry.data.draft && !entry.data.protected).length },
      { label: '画师', value: artists.filter((entry) => !entry.data.draft && !entry.data.protected).length },
      { label: '标签', value: tags.size },
    ]} />

    <div class="glass notice" data-announcement>
      <span>📢 <b>公告</b> · {site.announcement}</span>
      <button type="button" aria-label="关闭公告" data-announcement-close>✕</button>
    </div>

    <section class="home-section">
      <div class="section-head"><h2 class="warm">精选作品</h2><a href={withBase('/gallery')}>全部作品 →</a></div>
      <div class="grid">{featured.map((work) => <WorkCard work={work} />)}</div>
    </section>

    <section class="home-section">
      <div class="section-head"><h2 class="warm">画廊</h2><a href={withBase('/gallery')}>进入画廊 →</a></div>
      <div class="preview-grid">
        {preview.map((work) => (
          <a class="preview" href={withBase(`/gallery/${work.data.slug}`)} aria-label={work.data.title}>
            <Image src={work.data.images[0]} alt={work.data.title} widths={[300, 600]} formats={['avif', 'webp']} loading="lazy" />
          </a>
        ))}
      </div>
    </section>

    <section class="home-section">
      <div class="section-head"><h2 class="warm">最近更新</h2><a href={withBase('/search')}>搜索全部 →</a></div>
      <RecentList items={recent} />
    </section>
  </div>
  <script>import '../scripts/announcement';</script>
</BaseLayout>

<style>
  .hero { max-width: 1180px; margin: 0 auto; padding: 76px 20px 84px; text-align: center; color: #fff; }
  .hero-kicker { display: inline-flex; padding: 5px 13px; border-radius: 999px; font-size: 9.5px; letter-spacing: .22em; text-transform: uppercase; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.34); }
  .hero h1 { margin: 18px 0 0; font-size: clamp(44px, 7vw, 74px); font-weight: 600; letter-spacing: .14em; text-shadow: 0 6px 36px rgba(0,0,0,.42); }
  .hero-sub { margin: 12px 0 0; font-size: 10.5px; letter-spacing: .3em; text-transform: uppercase; color: rgba(255,255,255,.8); }
  .hero-badge { display: inline-flex; margin-top: 22px; padding: 7px 15px; border-radius: 999px; font-size: 11px; background: rgba(240,128,140,.5); border: 1px solid rgba(255,255,255,.38); }
  .home-content { margin-top: -34px; }
  .notice { display: flex; align-items: center; gap: 9px; margin-top: 14px; padding: 10px 15px; border-radius: 14px; font-size: 11.5px; color: #9a5d63; background: rgba(255,244,243,.82); }
  .notice b { color: var(--color-accent); }
  .notice button { margin-left: auto; border: 0; background: transparent; color: inherit; cursor: pointer; }
  .home-section { margin-top: 18px; }
  .section-head { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; margin-bottom: 12px; }
  .section-head h2 { margin: 0; font-size: 20px; color: #fff; text-shadow: 0 2px 16px rgba(0,0,0,.3); }
  .section-head a { font-size: 11px; color: rgba(255,255,255,.82); text-decoration: none; }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .preview-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .preview { aspect-ratio: 1; border-radius: 12px; overflow: hidden; }
  .preview img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .preview:hover img { transform: scale(1.06); }
  @media (max-width: 760px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .preview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
</style>
```

`src/scripts/announcement.ts`：

```ts
const notice = document.querySelector<HTMLElement>('[data-announcement]');
const close = document.querySelector<HTMLButtonElement>('[data-announcement-close]');
const key = 'qwind-announcement-dismissed';

if (notice && localStorage.getItem(key) === '1') {
  notice.hidden = true;
}

close?.addEventListener('click', () => {
  if (!notice) return;
  notice.hidden = true;
  localStorage.setItem(key, '1');
});
```

- [ ] **Step 4: 运行首页 E2E**

Run: `pnpm test:e2e tests/e2e/home.spec.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/pages/index.astro src/components/RecentList.astro src/scripts/announcement.ts tests/e2e/home.spec.ts
git commit -m "feat: integrate home page with real content"
```

---

### Task 12: 受保护内容遮罩

**Files:**
- Create: `src/lib/protected.ts`
- Create: `src/components/ProtectedGate.astro`
- Create: `src/scripts/protected.ts`
- Create: `src/pages/protected.astro`
- Modify: `src/pages/gallery/[slug].astro`
- Modify: `src/pages/gallery/index.astro`
- Create: `tests/unit/protected.test.ts`
- Create: `tests/e2e/protected.spec.ts`

**Interfaces:**
- Produces: `sha256Hex(text: string): Promise<string>`
- Produces: `ProtectedGate` 组件、`/protected` 入口

- [ ] **Step 1: 写哈希测试**

`tests/unit/protected.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { sha256Hex } from '../../src/lib/protected';

describe('sha256Hex', () => {
  it('hashes the sample password', async () => {
    await expect(sha256Hex('qwind')).resolves.toBe('6fc0fccf335a068190743e17ece458a983aac2edff6d26fd607801fbaf9ec075');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test tests/unit/protected.test.ts`
Expected: FAIL，找不到 `src/lib/protected`。

- [ ] **Step 3: 实现哈希与遮罩组件**

`src/lib/protected.ts`：

```ts
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
```

`src/components/ProtectedGate.astro`：

```astro
---
interface Props { hash: string; enabled?: boolean; }
const { hash, enabled = true } = Astro.props;
---
{enabled ? (
  <div class="protected-gate" data-protected-gate data-hash={hash}>
    <form class="glass gate-form" data-protected-form>
      <p class="kicker">PROTECTED</p>
      <h2 class="warm">这段内容需要密码</h2>
      <p>输入密码后查看。遮罩只防误入，不是安全边界。</p>
      <label>
        <span class="sr-only">密码</span>
        <input type="password" data-protected-input autocomplete="current-password" placeholder="输入密码" />
      </label>
      <button type="submit">解锁</button>
      <p class="error" data-protected-error role="alert"></p>
    </form>
    <div data-protected-content hidden>
      <slot />
    </div>
  </div>
) : (
  <slot />
)}
<script>import '../scripts/protected';</script>

<style>
  .gate-form { max-width: 420px; margin: 40px auto; padding: 24px; display: grid; gap: 10px; }
  .gate-form h2 { margin: 0; font-size: 24px; }
  .gate-form p { margin: 0; font-size: 12px; color: var(--color-muted); }
  input { width: 100%; border: 1px solid var(--color-line); border-radius: 10px; padding: 9px 11px; background: rgba(255,255,255,.55); color: var(--color-text); }
  button { border: 0; border-radius: 999px; padding: 9px 14px; background: var(--color-accent); color: #fff; cursor: pointer; }
  .error { min-height: 1em; color: #b91c1c; }
</style>
```

`src/scripts/protected.ts`：

```ts
import { sha256Hex } from '../lib/protected';

const gate = document.querySelector<HTMLElement>('[data-protected-gate]');
const form = document.querySelector<HTMLFormElement>('[data-protected-form]');
const input = document.querySelector<HTMLInputElement>('[data-protected-input]');
const error = document.querySelector<HTMLElement>('[data-protected-error]');
const content = document.querySelector<HTMLElement>('[data-protected-content]');
const key = 'qwind-unlocked';

function showContent() {
  if (form) form.hidden = true;
  if (content) content.hidden = false;
}

if (gate && form && input && content) {
  if (sessionStorage.getItem(key) === '1') showContent();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const hash = await sha256Hex(input.value);
    if (hash === gate.dataset.hash) {
      sessionStorage.setItem(key, '1');
      showContent();
    } else if (error) {
      error.textContent = '密码不正确。';
    }
  });
}
```

- [ ] **Step 4: 在作品详情页包一层遮罩**

把 `src/pages/gallery/[slug].astro` 完整替换为：

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import { Image, getImage } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PromptBlock from '../../components/PromptBlock.astro';
import Lightbox from '../../components/Lightbox.astro';
import ProtectedGate from '../../components/ProtectedGate.astro';
import { assetUrl, withBase } from '../../lib/url';
import { tagToSlug } from '../../lib/content';
import { site } from '../../config/site';

export async function getStaticPaths() {
  const works = await getCollection('works');
  return works
    .filter((work) => !work.data.draft)
    .map((work) => ({ params: { slug: work.data.slug }, props: { work } }));
}

const { work } = Astro.props;
const { Content } = await render(work);
const cover = work.data.images[0];
const large = await getImage({ src: cover, width: 1600, format: 'webp' });
const artists = await Promise.all(work.data.artists.map((ref) => getEntry(ref)));
---
<BaseLayout
  title={work.data.title}
  description={work.data.summary}
  image={large.src}
  noindex={work.data.protected}
>
  <div class="container page" id="work-lightbox">
    <ProtectedGate hash={site.protectedPasswordHash} enabled={work.data.protected}>
      <article class="glass work-detail">
        <div class="work-media">
          <a href={assetUrl(large.src)} data-pswp data-pswp-width={cover.width} data-pswp-height={cover.height} aria-label={`查看《${work.data.title}》大图`}>
            <Image src={cover} alt={work.data.title} widths={[600, 1200, 1600]} formats={['avif', 'webp']} loading="eager" />
          </a>
          {work.data.images.length > 1 && (
            <div class="work-thumbs">
              {work.data.images.slice(1).map((image) => (
                <a href={assetUrl(image.src)} data-pswp data-pswp-width={image.width} data-pswp-height={image.height} aria-label="查看大图">
                  <Image src={image} alt="" widths={[160, 320]} formats={['avif', 'webp']} loading="lazy" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div class="work-info">
          <p class="kicker">WORK / {work.data.rating.toUpperCase()}</p>
          <h1 class="warm">{work.data.title}</h1>
          {work.data.summary && <p class="summary">{work.data.summary}</p>}
          <dl class="facts">
            <div><dt>日期</dt><dd>{work.data.createdAt.toISOString().slice(0, 10)}</dd></div>
            <div><dt>画师</dt><dd>{artists.filter(Boolean).map((artist) => artist!.data.title).join(' / ') || '—'}</dd></div>
            <div><dt>模型</dt><dd>{work.data.prompt.model || '—'}</dd></div>
            <div><dt>分级</dt><dd>{work.data.rating}</dd></div>
          </dl>
          <div class="tags">{work.data.tags.map((tag) => <a href={withBase(`/tags/${tagToSlug(tag)}`)}>#{tag}</a>)}</div>
          <PromptBlock positive={work.data.prompt.positive} negative={work.data.prompt.negative} />
        </div>
      </article>
      <div class="glass work-body"><Content /></div>
    </ProtectedGate>
  </div>
  <Lightbox gallerySelector="#work-lightbox" />
</BaseLayout>

<style>
  .work-detail { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, .65fr); gap: 20px; padding: 20px; }
  .work-media a { display: block; border-radius: 14px; overflow: hidden; }
  .work-media :global(img) { width: 100%; height: auto; }
  .work-thumbs { display: flex; gap: 6px; margin-top: 6px; }
  .work-thumbs a { width: 64px; height: 48px; border-radius: 8px; }
  .work-thumbs :global(img) { width: 100%; height: 100%; object-fit: cover; }
  .work-info h1 { margin: 6px 0 10px; font-size: clamp(28px, 4vw, 42px); line-height: 1.15; }
  .summary { color: var(--color-muted); font-size: 13px; }
  .facts { display: grid; gap: 8px; margin: 16px 0; }
  .facts div { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--color-line); }
  .facts dt { font-size: 10px; letter-spacing: .1em; color: var(--color-muted); }
  .facts dd { margin: 0; font-size: 12px; }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .tags a { font-size: 11px; color: var(--color-accent); text-decoration: none; }
  .work-body { margin-top: 14px; padding: 20px; }
  @media (max-width: 760px) { .work-detail { grid-template-columns: 1fr; padding: 14px; } }
</style>
```

`ProtectedGate` 在 `enabled=false` 时直接渲染插槽，所以普通作品不会出现密码层。

- [ ] **Step 5: 创建 `/protected` 页面**

`src/pages/protected.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import { withBase } from '../lib/url';

const protectedWorks = (await getCollection('works')).filter((work) => work.data.protected && !work.data.draft);
---
<BaseLayout title="受保护内容" description="需要密码查看的收藏。" noindex>
  <div class="container page">
    <header class="page-head"><p class="kicker">PROTECTED</p><h1>受保护内容</h1><p>只显示通用占位卡，不泄露标题和封面。</p></header>
    <div class="locked-list">
      {protectedWorks.map((work, index) => (
        <a class="glass locked-row" href={withBase(`/gallery/${work.data.slug}`)}>
          <span>🔒</span>
          <b>受保护条目 {String(index + 1).padStart(2, '0')}</b>
          <small>输入密码后查看</small>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .locked-list { display: grid; gap: 8px; }
  .locked-row { display: flex; align-items: center; gap: 10px; padding: 13px 15px; text-decoration: none; }
  .locked-row b { font-size: 13px; }
  .locked-row small { margin-left: auto; font-size: 10px; color: var(--color-muted); }
</style>
```

- [ ] **Step 6: 写受保护 E2E**

`tests/e2e/protected.spec.ts`：

```ts
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
```

- [ ] **Step 7: 运行测试**

Run: `pnpm test tests/unit/protected.test.ts`
Run: `pnpm test:e2e tests/e2e/protected.spec.ts`
Expected: PASS。

- [ ] **Step 8: 提交**

```bash
git add src/lib/protected.ts src/components/ProtectedGate.astro src/scripts/protected.ts src/pages/protected.astro src/pages/gallery tests/unit/protected.test.ts tests/e2e/protected.spec.ts
git commit -m "feat: add client-side protected content gate"
```

---

### Task 13: Sitemap、主题、无障碍与响应式收尾

**Files:**
- Create: `src/pages/sitemap.xml.ts`
- Create: `public/robots.txt`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `tests/e2e/polish.spec.ts`

**Interfaces:**
- Produces: `/sitemap.xml`、`/robots.txt`
- Produces: 主题切换持久化、可访问性基线

- [ ] **Step 1: 写收尾 E2E**

`tests/e2e/polish.spec.ts`：

```ts
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
  for (const path of ['/', '/gallery', '/artists', '/links', '/notes', '/files', '/search', '/about']) {
    await page.goto(path);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
  }
});

test('sitemap excludes protected content', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const text = await response.text();
  expect(text).not.toContain('protected-work');
});
```

- [ ] **Step 2: 实现 sitemap**

`src/pages/sitemap.xml.ts`：

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/url';
import { entryUrl } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const [works, artists, notes] = await Promise.all([
    getCollection('works'), getCollection('artists'), getCollection('notes'),
  ]);

  const staticPaths = ['/', '/gallery', '/artists', '/links', '/notes', '/files', '/search', '/about'];
  const entryPaths = [
    ...works.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => entryUrl('works', entry.data.slug)),
    ...artists.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => entryUrl('artists', entry.data.slug)),
    ...notes.filter((entry) => !entry.data.draft && !entry.data.protected).map((entry) => entryUrl('notes', entry.data.slug)),
  ];

  const urls = [...new Set([...staticPaths, ...entryPaths])]
    .map((path) => `<url><loc>${new URL(withBase(path), site!).href}</loc></url>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
```

`public/robots.txt`：

```text
User-agent: *
Allow: /
Disallow: /protected

Sitemap: https://qwind520.github.io/qwind-collectsite/sitemap.xml
```

- [ ] **Step 3: 补全无障碍样式**

在 `src/styles/global.css` 末尾追加：

```css
a, button, input, select { outline-offset: 3px; }
[data-work]:focus-within, .glass:focus-within { outline: 2px solid var(--color-accent); outline-offset: 3px; }
@media (max-width: 760px) {
  h1 { overflow-wrap: anywhere; }
  .section-head { flex-wrap: wrap; }
}
```

- [ ] **Step 4: 创建关于页**

`src/pages/about.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../config/site';
---
<BaseLayout title="关于" description="关于温水の收藏站。">
  <div class="container page">
    <article class="glass about-card">
      <p class="kicker">ABOUT</p>
      <h1 class="warm">关于本站</h1>
      <p>{site.bio}</p>
      <p>本站用于个人收藏与整理，非商业使用。作品、词条和图片版权归各自作者所有；参考站的词条与配图未在本站复用。</p>
      <p>受保护内容只是前端遮罩，不是安全边界；请勿在本站存放真正私密的信息。</p>
      <p><a href="https://blog.qwind.top/" target="_blank" rel="noopener noreferrer">博客</a> · <a href="https://github.com/Q-wind520" target="_blank" rel="noopener noreferrer">GitHub</a></p>
    </article>
  </div>
</BaseLayout>

<style>
  .about-card { max-width: 760px; margin: 0 auto; padding: 26px; }
  .about-card h1 { margin: 6px 0 16px; font-size: 34px; }
  .about-card p { font-size: 13px; color: var(--color-muted); }
  .about-card a { color: var(--color-accent); }
</style>
```

- [ ] **Step 5: 运行收尾 E2E 与构建**

Run: `pnpm test:e2e tests/e2e/polish.spec.ts`
Expected: PASS。

Run: `pnpm build`
Expected: 构建成功，`dist/sitemap.xml`、`dist/robots.txt` 存在。

- [ ] **Step 6: 提交**

```bash
git add src/pages/sitemap.xml.ts src/pages/about.astro public/robots.txt src/styles/global.css tests/e2e/polish.spec.ts
git commit -m "feat: add sitemap, about page and accessibility polish"
```

---

### Task 14: 内容脚手架与图片压缩脚本

**Files:**
- Create: `src/lib/slug.ts`
- Create: `scripts/new-entry.ts`
- Create: `scripts/optimize-image.ts`
- Create: `tests/unit/slug.test.ts`

**Interfaces:**
- Produces: `slugFromTitle(input: string): string`
- Produces: `pnpm new <type> [--title ...] [--slug ...] [--tags ...]`
- Produces: `pnpm optimize-image <input> <output>`

- [ ] **Step 1: 写 slug 测试**

`tests/unit/slug.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { slugFromTitle } from '../../src/lib/slug';

describe('slugFromTitle', () => {
  it('lowercases and hyphenates ASCII titles', () => {
    expect(slugFromTitle('Hello, World!')).toBe('hello-world');
  });

  it('trims leading and trailing separators', () => {
    expect(slugFromTitle('  --Foo Bar--  ')).toBe('foo-bar');
  });

  it('returns an empty string for a purely Chinese title', () => {
    expect(slugFromTitle('黄昏下的旅人')).toBe('');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test tests/unit/slug.test.ts`

Expected: FAIL，找不到 `src/lib/slug`。

- [ ] **Step 3: 实现 `src/lib/slug.ts`**

```ts
export function slugFromTitle(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

Run: `pnpm test tests/unit/slug.test.ts`
Expected: PASS。

- [ ] **Step 4: 实现新建条目脚本**

`scripts/new-entry.ts`：

```ts
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { slugFromTitle } from '../src/lib/slug';

const TYPES = {
  work: { dir: 'works', ext: 'md' },
  artist: { dir: 'artists', ext: 'md' },
  link: { dir: 'links', ext: 'md' },
  note: { dir: 'notes', ext: 'mdx' },
  file: { dir: 'files', ext: 'md' },
} as const;

type EntryType = keyof typeof TYPES;

function readFlag(args: string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

async function main() {
  const [rawType, ...args] = process.argv.slice(2);
  if (!rawType || !(rawType in TYPES)) {
    console.error('Usage: pnpm new <work|artist|link|note|file> [--title ...] [--slug ...] [--tags ...]');
    process.exit(1);
  }
  const type = rawType as EntryType;
  const rl = createInterface({ input, output });

  const title = readFlag(args, 'title') ?? (await rl.question('标题: '));
  const slugInput = readFlag(args, 'slug') ?? (await rl.question('slug（小写字母/数字/连字符）: '));
  const slug = slugInput || slugFromTitle(title);
  if (!slug) {
    console.error('无法从标题生成 slug，请显式传入 --slug。');
    process.exit(1);
  }
  const tags = (readFlag(args, 'tags') ?? (await rl.question('标签（逗号分隔，可留空）: ')))
    .split(',').map((tag) => tag.trim()).filter(Boolean);
  const summary = readFlag(args, 'summary') ?? '';
  const date = readFlag(args, 'date') ?? new Date().toISOString().slice(0, 10);
  const url = readFlag(args, 'url') ?? (type === 'link' ? await rl.question('URL: ') : '');
  rl.close();

  const file = `src/content/${TYPES[type].dir}/${slug}.${TYPES[type].ext}`;
  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `slug: ${slug}`,
    ...(summary ? [`summary: ${JSON.stringify(summary)}`] : []),
    `tags: [${tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
    `createdAt: ${date}`,
  ];

  if (type === 'work') {
    await mkdir(`src/assets/works/${slug}`, { recursive: true });
    lines.push('images:', `  - ../../assets/works/${slug}/01.webp`);
    lines.push('prompt:', '  positive: ""', '  negative: ""', '  model: "NAI v5"', 'rating: general');
    console.log(`把展示图放到 src/assets/works/${slug}/01.webp 后再构建。`);
  }
  if (type === 'artist') {
    lines.push(`artistTag: ${JSON.stringify(`artist:${slug}`)}`);
  }
  if (type === 'link') {
    if (!url) { console.error('链接条目必须提供 --url。'); process.exit(1); }
    lines.push(`url: ${JSON.stringify(url)}`);
  }
  if (type === 'file') {
    lines.push(`filePath: "/files/${slug}.txt"`, 'external: false');
  }
  lines.push('---', '');

  await writeFile(file, lines.join('\n'), 'utf8');
  console.log(`created ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 5: 实现图片压缩脚本**

`scripts/optimize-image.ts`：

```ts
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const [input, outputPath] = process.argv.slice(2);
if (!input || !outputPath) {
  console.error('Usage: pnpm optimize-image <input> <output.webp>');
  process.exit(1);
}

await mkdir(dirname(outputPath), { recursive: true });
await sharp(input)
  .rotate()
  .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(outputPath);

console.log(`optimized ${input} -> ${outputPath}`);
```

- [ ] **Step 6: 手动验证脚本**

Run:

```bash
pnpm new link --title "测试书签" --slug test-link --tags "测试" --url https://example.com
pnpm check
rm src/content/links/test-link.md
pnpm optimize-image src/assets/works/example-work/01.webp /tmp/optimized.webp
test -s /tmp/optimized.webp
```

Expected: `created src/content/links/test-link.md`；`pnpm check` 通过；`/tmp/optimized.webp` 非空。

- [ ] **Step 7: 提交**

```bash
git add src/lib/slug.ts scripts/new-entry.ts scripts/optimize-image.ts tests/unit/slug.test.ts
git commit -m "feat: add content scaffolding and image optimization scripts"
```

---

### Task 15: CI/CD、README 与首次部署

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Create: `LICENSE`（MIT，仅覆盖代码）
- Modify: `docs/superpowers/specs/2026-10-17-qwind-collectsite-design.md`（把状态改为“已实现”可选）

**Interfaces:**
- Produces: GitHub Actions 自动部署、项目使用说明、首次线上地址

- [ ] **Step 1: 创建 GitHub Actions**

`.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24
          build-cmd: "pnpm run check && pnpm run build"
        env:
          BASE_PATH: /qwind-collectsite

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: 创建 README**

`README.md`：

````md
# 温水の收藏站

个人收藏站：NovelAI 作品、画师词条、网页书签、笔记与文件。

- 线上：https://qwind520.github.io/qwind-collectsite/
- 设计文档：`docs/superpowers/specs/2026-10-17-qwind-collectsite-design.md`

## 本地开发

```bash
pnpm install
pnpm dev
```

## 新增内容

```bash
pnpm new work
pnpm optimize-image ~/Pictures/originals/foo.png src/assets/works/foo/01.webp
pnpm check
git add .
git commit -m "content: add foo"
git push
```

## 内容目录

- `src/content/works/` 作品
- `src/content/artists/` 画师
- `src/content/links/` 书签
- `src/content/notes/` 笔记
- `src/content/files/` 文件

## 受保护内容

`protected: true` 只是前端遮罩，内容仍在构建产物和 Git 历史中。v1 只对作品启用密码层；其他类型写 `protected: true` 会被公开列表和索引过滤。不要把真正私密的内容放进这个公开仓库。

## 部署

推送到 `main` 后，GitHub Actions 自动构建并发布到 GitHub Pages。首次部署需要在仓库 Settings → Pages 中把 Source 设为 GitHub Actions。

## 许可

代码使用 MIT；作品、词条、图片和笔记的版权归各自作者所有，不在 MIT 范围内。
````

`LICENSE`：

```text
MIT License

Copyright (c) 2026 Q-wind520

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: 运行完整验证**

Run:

```bash
pnpm check
pnpm test
pnpm build
pnpm test:e2e
```

Expected: 全部通过；`dist/index.html`、`dist/sitemap.xml`、`dist/rss.xml` 存在。

- [ ] **Step 4: 提交**

```bash
git add .github/workflows/deploy.yml README.md LICENSE
git commit -m "chore: add deployment workflow and project docs"
```

- [ ] **Step 5: 创建 GitHub 仓库**

Run:

```bash
gh repo create qwind-collectsite --public --source=. --remote=origin --push
```

Expected: 仓库创建成功，`main` 推送成功。

- [ ] **Step 6: 启用 GitHub Pages**

Run:

```bash
gh api --method POST -H "Accept: application/vnd.github+json" \
  /repos/Q-wind520/qwind-collectsite/pages \
  -f build_type=workflow
```

Expected: 返回 Pages 配置；如果提示已存在，改在 Settings → Pages 把 Source 设为 GitHub Actions。

- [ ] **Step 7: 触发并检查部署**

Run:

```bash
gh workflow run deploy.yml
gh run list --workflow deploy.yml --limit 1
```

Expected: 最新 run 状态为 `success`。

Run:

```bash
curl -IL https://qwind520.github.io/qwind-collectsite/
```

Expected: HTTP 200。

- [ ] **Step 8: 最终提交与状态检查**

```bash
git status
git log --oneline -5
```

Expected: 工作区干净；最近提交包含内容、功能、部署三个阶段。

---

## 完成标准

- `pnpm check`、`pnpm test`、`pnpm build`、`pnpm test:e2e` 全部通过。
- 线上首页、画廊、画师、书签、笔记、文件、搜索、标签、关于、受保护入口可访问。
- 新增一条作品后 `git push`，Actions 成功，线上出现。
- 受保护内容不在 sitemap、RSS、搜索索引中，并带 `noindex`。
- 360px 视口无横向滚动；图片有 `alt`；键盘可完成筛选、灯箱、复制。
- 仓库中有一份可照做的 README 和设计文档。
