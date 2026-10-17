# 温水の收藏站 — 设计文档

- 日期：2026-10-17
- 状态：待评审
- 仓库：`github.com/Q-wind520/qwind-collectsite`
- 站点名：温水の收藏站
- 视觉方向：A++ 博客氛围版（整页固定背景 + 毛玻璃面板 + 珊瑚粉 + 手写感标题 + 轻花瓣）

## 1. 概述

温水の收藏站是一个公开的个人内容收藏站。首批收录五类内容：

1. NovelAI 作品图（含提示词、画师、角色、分级）
2. 画师 / 词条词库
3. 网页链接与书签
4. 笔记 / 文章
5. 文件 / 资源

五类内容共用一套基础条目模型，各自有专属字段；通过标签、搜索和详情页互相串联。站点以静态方式构建，内容在本地用 Markdown/MDX 维护，`git push` 后由 GitHub Actions 自动发布到 GitHub Pages。

这个站首先是站主自己的长期档案，其次才是给访客浏览的作品集。因此设计优先保证：新增内容足够省事、图片足够好看、几年后还能维护。

## 2. 用户与成功标准

### 主要用户

- **站主（维护者）**：在本地新增、修改、整理条目，偶尔调整视觉和部署配置。
- **访客**：通过链接进入，浏览作品、查画师、复制提示词、读笔记、下载文件。

### 成功标准

- 新增一条内容并上线：熟练后不超过 5 分钟，流程为“新建 → 放图 → `pnpm check` → `git push`”。
- 手机 4G 下首屏可交互时间不超过 3 秒；Lighthouse Performance / Accessibility 均 ≥ 90。
- 画廊筛选、灯箱、提示词复制、搜索、密码遮罩全部可用。
- 五类内容都能在首页和标签页被聚合到。
- 仓库首年保持在 200MB 以内，不因图片膨胀到无法克隆。
- 受保护内容不会出现在 sitemap、RSS 和站内搜索里，并带 `noindex`。

## 3. 非目标

- 不做多用户、注册、评论、点赞等社交功能。
- 不做在线后台或浏览器内编辑器；内容只从本地 Git 发布。
- 不做真正的权限系统；受保护内容只做前端遮罩。
- 不接入数据库、全文搜索服务或第三方 CMS。
- 不做移动 App；移动端只保证网页可用。
- v1 不自动抓取参考站数据，也不复制参考站的词条、配图和汇编结构。

## 4. 约束

- 首批规模：少于 100 条内容，图片总量小于 1GB。
- 纯静态托管，无服务端运行时。
- 仓库公开；受保护内容仍会出现在 Git 历史和构建产物中。
- 参考站 `AgIzT/NovelAI-Tag` 的代码是 MIT，但词条文本、配图和汇编数据不在 MIT 范围内，禁止直接搬运。
- 中文优先；界面文案、日期格式、搜索都以中文为主。
- 本地环境：Node 24、pnpm、`gh` 已登录、`wrangler` 已登录（v1 不使用 Cloudflare）。

## 5. 信息架构

| 路径 | 内容 | 主要视图 |
|---|---|---|
| `/` | 首页 | 整页背景、个人档案卡、精选作品、画廊预览、最近更新、公告 |
| `/gallery` | NovelAI 作品 | 卡片网格、画师/分级/标签筛选、排序、灯箱 |
| `/gallery/[slug]` | 作品详情 | 大图、提示词、画师/角色、复制按钮、相关作品 |
| `/artists` | 画师 / 词条 | 可搜索列表、别名、代表作品 |
| `/artists/[slug]` | 画师详情 | 画师 tag、相关 tag、代表作品、外部链接 |
| `/links` | 网页收藏 | 卡片列表、域名/标签筛选、外跳 |
| `/notes` | 笔记文章 | 列表、摘要、更新时间 |
| `/notes/[slug]` | 笔记详情 | MDX 正文、目录、代码高亮、相关条目 |
| `/files` | 文件资源 | 表格/列表、类型、大小、下载或预览 |
| `/tags/[tag]` | 跨类型标签页 | 该标签下的作品、画师、链接、笔记、文件 |
| `/search` | 全站搜索 | 按类型分组的结果 |
| `/about` | 关于 | 个人简介、友链、版权与使用说明 |
| `/protected` | 受保护内容入口 | 密码层；解锁后展示受保护条目 |

导航顺序：作品、画师、书签、笔记、文件。搜索和明暗切换放在右侧。移动端导航收进菜单。

## 6. 数据模型

### 6.1 基础字段

所有集合共用以下字段，使用 Zod 在构建时校验：

```ts
// 各集合共用的普通字段
const baseFields = {
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  summary: z.string().max(200).optional(),
  tags: z.array(z.string().min(1)).default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  protected: z.boolean().default(false),
  sourceUrl: z.string().url().optional(),
  license: z.string().optional(),
  related: z.array(z.string()).default([]),
};

// 图片字段在 defineCollection 的 schema 回调里合并：
// schema: ({ image }) => z.object({ ...baseFields, cover: image().optional() })
```

规则：

- `slug` 只用小写字母、数字和连字符；标题可以是中文。文件名即 slug，构建时校验唯一性。
- `createdAt` 必填，`updatedAt` 可选；列表默认按 `createdAt` 倒序。
- `draft: true` 只在开发环境显示，不进入生产构建、sitemap、RSS 和搜索索引。
- `protected: true` 进入受保护集合；详情页显示密码层，并加 `noindex`。
- `featured: true` 进入首页精选，最多取 3 条。
- 标签是自由字符串，构建时聚合出计数和标签页；不维护单独的标签文件。

### 6.2 作品 `works`

```ts
// schema: ({ image }) => z.object({ ...baseFields, ... })
{
  images: z.array(image()).min(1),      // 第一张作为封面
  prompt: z.object({
    positive: z.string().default(''),
    negative: z.string().default(''),
    artist: z.string().optional(),
    character: z.string().optional(),
    model: z.string().optional(),        // 例如 NAI v4.5 / NAI v5
  }),
  artists: z.array(reference('artists')).default([]),
  rating: z.enum(['general', 'sensitive', 'nsfw', 'r18g']).default('general'),
  originalUrl: z.string().url().optional(),
}
```

- 详情页展示完整提示词，提供“复制正向”“复制负向”“复制全部”。
- `rating` 为 `nsfw` 或 `r18g` 时，缩略图默认模糊，点击后显示 18+ 提示；与 `protected` 独立。
- 作品可以关联多个画师词条；画师详情页反向聚合作品。

### 6.3 画师 / 词条 `artists`

```ts
{
  ...baseFields,
  artistTag: z.string().min(1),         // 实际可复制的 NAI tag
  aliases: z.array(z.string()).default([]),
  relatedTags: z.array(z.string()).default([]),
  externalLinks: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).default([]),
  notes: z.string().optional(),         // 短评，不替代笔记
}
```

- 详情页提供画师 tag 一键复制。
- 如果没有关联作品，仍可展示词条信息和外部链接。
- 画师列表支持按名称、别名、tag 搜索。

### 6.4 书签 `links`

```ts
{
  ...baseFields,
  url: z.string().url(),
  domain: z.string().optional(),        // 构建时从 url 派生，不手填
  favicon: z.string().url().optional(),
  description: z.string().max(300).optional(),
  archivedUrl: z.string().url().optional(),
}
```

- 点击直接外跳，统一 `target="_blank"` 和 `rel="noopener noreferrer"`。
- 域名筛选从 `url` 派生，避免手填不一致。

### 6.5 笔记 `notes`

```ts
{
  readingTime: z.number().optional(),   // 构建时派生，不手填
  toc: z.boolean().default(true),
}
```

- 正文就是 `.mdx` 文件内容，不放进 frontmatter；标题、摘要、标签走 frontmatter。
- 代码块用 Astro 内置 Shiki；不引入额外高亮库。
- 详情页右侧目录只在桌面显示；移动端折叠。

### 6.6 文件 `files`

```ts
{
  ...baseFields,
  filePath: z.string(),                 // public/files 下的相对路径，或外部 URL
  size: z.number().optional(),          // 字节
  mime: z.string().optional(),
  preview: image().optional(),
  sha256: z.string().optional(),
  external: z.boolean().default(false),
}
```

- 小于 10MB 的文件放 `public/files/`；更大的文件只存外部链接或 R2 URL，不进 Git。
- 图片和 PDF 支持预览；其他类型直接下载。
- 文件条目不参与全文搜索，只索引标题、摘要和标签。

### 6.7 关系与校验

- `works.artists` → `artists` 使用 Astro `reference()`；引用不存在时构建失败。
- 画师详情页的“代表作品”由构建时反向过滤 `works.artists` 得到，不再维护双向字段，避免循环引用和数据不一致。
- `tags` 为隐式关系；构建时生成标签计数和 `/tags/[tag]`。
- 额外推荐关系用 `related` 存 slug，不做强校验，允许跨类型但仅用于展示。
- 所有图片路径在构建时校验存在；缺失图片直接让构建失败。
- 重复 slug 在同一集合内构建失败；跨集合允许相同 slug，因为 URL 前缀不同。

## 7. 内容目录

```text
src/content/
  works/<slug>.md
  artists/<slug>.md
  links/<slug>.md
  notes/<slug>.md
  files/<slug>.md
src/assets/
  works/<slug>/01.webp
  artists/<slug>/avatar.webp
  files/<slug>/preview.webp
```

- 一个条目一个 Markdown/MDX 文件；作品正文可写简短说明，笔记正文写完整 MDX。
- 作品图片放在 `src/assets/works/<slug>/`，与条目 slug 对应；frontmatter 用相对路径引用，交给 `astro:assets` 处理。
- 原图不放进仓库；`scripts/optimize-image.ts` 把原图压成最长边 2400px、WebP 质量 82 的展示图，再放入 `src/assets/`。
- 仓库只保留展示图和缩略图；原图放在仓库外的本地目录并单独备份。

## 8. 页面与交互

### 8.1 首页 `/`

- 整页固定背景图，顶部毛玻璃导航。
- 首屏：站点名、英文副标题、一行状态徽章（收录数量 / 整理中）。
- 个人档案卡：头像、昵称、简介、GitHub / 博客 / RSS 入口、条目/画师/标签统计。
- 公告条：可关闭，状态存 `localStorage`；内容来自站点配置。
- 精选作品：`featured` 的前 3 条，卡片网格。
- 画廊预览：最近 8 张作品，带“全部作品”入口。
- 最近更新：跨类型取最近 3–5 条，显示类型、标题、相对时间。

### 8.2 画廊 `/gallery`

- 桌面 3 列、平板 2 列、手机 1–2 列；统一 4:3 裁切。
- 顶部粘性筛选条：画师、分级、标签、排序（最新 / 最早 / 随机）。
- 筛选状态同步到 URL query，例如 `?artist=xxx&rating=general&tag=yyy`；刷新和分享保持状态。
- 结果计数实时更新；无结果时显示空状态和“清除筛选”。
- 卡片悬停显示标题、画师、标签；点击打开灯箱。
- 灯箱用 PhotoSwipe：左右键切换、`Esc` 关闭、移动端滑动、显示标题和提示词面板。
- 提示词面板提供复制正向、复制负向、复制全部；复制成功有 toast。
- `nsfw` / `r18g` 缩略图默认模糊；首次点击显示 18+ 确认。

### 8.3 作品详情 `/gallery/[slug]`

- 左侧大图/图集，右侧信息栏：标题、日期、画师、角色、分级、标签。
- 提示词用等宽字体分块展示，复制按钮固定在块右上角。
- “查看原图”跳 `originalUrl` 或打开原图灯箱。
- 底部展示同画师/同标签的相关作品。

### 8.4 画师 `/artists` 与 `/artists/[slug]`

- 列表：头像/首字母占位、名称、`artistTag`、作品数、标签；支持名称/别名/tag 搜索。
- 详情：画师 tag 一键复制、别名、相关 tag、代表作品网格、外部链接、短评。
- 没有头像时用首字母 + 珊瑚粉背景占位，不强制上传。

### 8.5 书签 `/links`

- 卡片列表：favicon、标题、域名、摘要、标签、更新时间。
- 顶部按域名和标签筛选；搜索框只过滤标题/摘要/标签。
- 外跳统一新窗口；失效链接不自动检测，保持静态。

### 8.6 笔记 `/notes`

- 列表：标题、摘要、日期、标签、阅读时间。
- 详情：MDX 正文、桌面右侧目录、代码高亮、复制代码按钮由 Shiki 输出后的小脚本增强。
- RSS 只包含笔记，按 `createdAt` 倒序。

### 8.7 文件 `/files`

- 表格视图：文件名、类型、大小、更新时间、下载/预览。
- 图片和 PDF 打开预览弹窗；其他类型直接下载。
- 外部文件标注“外部”，点击新窗口打开。

### 8.8 标签与搜索

- `/tags/[tag]`：按类型分组展示该标签下的条目；组内按时间倒序。
- `/search`：输入即时过滤；结果按类型分组，显示类型、标题、摘要、标签。
- `⌘K / Ctrl+K` 打开命令面板；`Esc` 关闭；上下键选择，回车跳转。
- 搜索索引在构建时生成，包含标题、摘要、标签、类型、URL；笔记额外包含正文纯文本前 2000 字。
- 中文搜索使用字符 bigram + 原文子串匹配；英文按单词小写匹配；不做拼音。
- `protected` 和 `draft` 条目不进入索引。

### 8.9 受保护内容

- 入口 `/protected` 与列表页的通用锁定占位卡。
- 密码以 SHA-256 哈希存在站点配置中；用户输入后在前端计算哈希比对。
- 解锁状态存 `sessionStorage`，关闭标签页即失效；提供“重新上锁”。
- 受保护详情页加 `<meta name="robots" content="noindex, nofollow">`，不进入 sitemap、RSS、搜索索引。
- 明确提示：这是前端遮罩，不是安全边界。

## 9. 视觉系统

### 9.1 色彩

| Token | 浅色 | 深色 |
|---|---|---|
| 背景图 | 博客横幅（可替换） | 同一张，叠加深色遮罩 |
| 面板 | `rgba(255,255,255,.68)` | `rgba(28,22,26,.62)` |
| 正文 | `#4c4948` | `#f2ece9` |
| 次要文字 | `#8b8380` | `#b8aeaa` |
| 强调 | `#f0808c` | `#f4a7ad` |
| 强调浅底 | `#fff0f0` | `rgba(244,167,173,.14)` |
| 边框 | `rgba(255,255,255,.64)` | `rgba(255,255,255,.14)` |

- 强调色只用于链接、选中态、标签、按钮和小面积装饰。
- 毛玻璃：`backdrop-filter: blur(18px) saturate(1.18)`；移动端降到 `blur(10px)`。
- 深色模式不换背景图，只加深色遮罩和面板透明度；避免维护两套素材。

### 9.2 字体

- 标题/昵称/栏目名：`LXGW WenKai`，自托管 WOFF2 子集；不可用时回退 `Kaiti SC`、`Noto Serif SC`、`serif`。
- 正文/UI：`Noto Sans SC` + 系统无衬线栈；正文 14–15px，行高 1.8。
- 提示词/代码：`Share Tech Mono` 或 `JetBrains Mono` 回退 `ui-monospace`。
- 中文字体只加载实际需要的字重；标题字体做子集化，避免几 MB 的完整字体。
- `font-display: swap`；字体加载失败不影响可读性。

### 9.3 布局与形状

- 内容最大宽度 1120–1180px；桌面 12 栏、平板 8 栏、手机单栏。
- 面板圆角 20px；卡片圆角 15px；缩略图圆角 12px。
- 面板阴影 `0 18px 52px -30px rgba(60,24,38,.55)`，不使用硬边框。
- 区块间距 16–30px；页面上下留白充足，避免信息拥挤。
- 作品网格统一 4:3 裁切；灯箱看完整比例。

### 9.4 背景与动效

- 整页固定背景图，`background-size: cover`，`background-position: center 30%`。
- 背景上叠两层渐变：顶部轻暗、底部深暗，保证白色标题可读。
- 7 片 CSS 花瓣缓慢飘落，透明度 0.3–0.55，周期 18–27 秒。
- 移动端：背景改为 `scroll`、关闭花瓣、降低模糊；低端设备不出现明显掉帧。
- 尊重 `prefers-reduced-motion: reduce`：关闭花瓣和大部分过渡。
- 卡片悬停只做 3px 上浮和 1.05 倍图片缩放，时长 300–600ms。

### 9.5 响应式

- `≤760px`：导航收起，个人卡纵向排列，作品 2 列，画廊 3 列，统计横向铺满。
- `≤480px`：标题缩小，作品 2 列、间距收紧，花瓣隐藏，搜索按钮只留图标。
- 灯箱在手机上支持滑动和双指缩放（PhotoSwipe 原生能力）。

### 9.6 可访问性

- 所有图片必须有 `alt`；装饰图用空 `alt`。
- 键盘可完成筛选、打开灯箱、切换图片、复制提示词、关闭弹窗。
- 焦点环可见；不使用 `outline: none` 除非有替代样式。
- 正文与背景对比度达到 WCAG AA；毛玻璃面板保证足够不透明度。
- 页面有跳转到主内容的 skip link；标题层级不跳级。
- 复制按钮的 toast 使用 `aria-live="polite"`。

## 10. 技术架构

### 10.1 技术栈

- **框架**：Astro（当前稳定版），静态输出，TypeScript 严格模式。
- **内容**：Content Collections + `glob` loader + Zod；MDX 用于笔记。
- **样式**：Tailwind CSS v4 + 全局 CSS 变量；复杂视觉用 Astro scoped CSS 补充。
- **交互**：原生 TypeScript 小模块，不引入 React/Vue/Svelte；只有需要交互的组件加载脚本。
- **灯箱**：PhotoSwipe 5。
- **图片**：`astro:assets` + Sharp；构建时输出 AVIF/WebP 和多尺寸。
- **搜索**：构建时生成 `search-index.json`；客户端原生过滤，不引入搜索库。
- **图标**：内联 SVG，不引入图标库。
- **部署**：GitHub Actions → GitHub Pages。
- **测试**：`astro check`、Vitest（工具函数）、Playwright（冒烟）。

### 10.2 为什么不上框架

站点只有筛选、搜索、灯箱、密码层四类交互，原生 TS 足够；不上 React/Svelte 可以减少包体、构建复杂度和版本维护。Astro 的静态 HTML 负责内容，脚本只在需要时加载。

### 10.3 目录结构

```text
qwind-collectsite/
  .github/workflows/deploy.yml
  docs/superpowers/specs/
  public/
    files/
    favicon.svg
    og-default.webp
  scripts/
    new-entry.ts
    import-nai.ts
    optimize-image.ts
  src/
    assets/
      works/
      artists/
    config/
      site.ts               # 站点名、简介、社交链接、公告、密码哈希
    components/
      SiteHeader.astro
      SiteFooter.astro
      ProfileCard.astro
      WorkCard.astro
      GalleryGrid.astro
      FilterBar.astro
      Lightbox.astro
      PromptBlock.astro
      ProtectedGate.astro
      SearchDialog.astro
      TagPill.astro
    content/
      works/
      artists/
      links/
      notes/
      files/
    content.config.ts
    layouts/
      BaseLayout.astro
      EntryLayout.astro
    lib/
      search.ts
      tags.ts
      dates.ts
      protected.ts
      images.ts
    pages/
      index.astro
      gallery/index.astro
      gallery/[slug].astro
      artists/index.astro
      artists/[slug].astro
      links/index.astro
      notes/index.astro
      notes/[slug].astro
      files/index.astro
      tags/[tag].astro
      search.astro
      about.astro
      protected.astro
      rss.xml.ts
      sitemap.xml.ts
    styles/
      global.css
      tokens.css
  astro.config.mjs
  package.json
  tsconfig.json
  README.md
```

### 10.4 构建与数据流

1. Astro 读取五个集合，Zod 校验 frontmatter。
2. 构建时聚合标签、画师关联、最近更新、精选。
3. `astro:assets` 处理图片，生成多尺寸和多格式。
4. 生成 `search-index.json`、`sitemap.xml`、`rss.xml`。
5. 静态 HTML + 少量 JS 输出到 `dist/`。
6. GitHub Actions 上传 artifact，GitHub Pages 发布。

### 10.5 图片策略

- 展示图最长边 2400px，WebP 质量 82；原图不进仓库。
- 构建时输出 400 / 800 / 1200 / 1600 四档，浏览器按 `srcset` 选择。
- 首屏图片 `loading="eager"` + `fetchpriority="high"`；其余 `loading="lazy"` + `decoding="async"`。
- 图片容器使用固定 `aspect-ratio`，避免布局偏移。
- 缩略图使用同一张展示图的 800px 版本，不额外维护缩略图。

### 10.6 搜索实现

- 构建时生成数组：`id, type, title, summary, tags, url, text`。
- 文本规范化：小写、去多余空白、保留中文；英文按空格切词，中文按字符 bigram。
- 查询时同时匹配原文子串和 bigram，标题命中权重高于正文。
- 结果按类型分组，组内按相关度和时间排序。
- 少于 100 条时全量索引在 100KB 以内，直接内联或按需 fetch。

## 11. 部署

### 11.1 仓库与分支

- 仓库：`Q-wind520/qwind-collectsite`，公开。
- 主分支：`main`；所有发布从 `main` 触发。
- 不设 `dev` 分支；小站用 feature 分支 + PR 即可，个人维护时可直接 push。

### 11.2 GitHub Actions

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
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- `package.json` 写 `"packageManager": "pnpm@<version>"`，供 `pnpm/action-setup@v4` 读取；CI 不额外硬编码版本。
- `astro.config.mjs` 的 `site` 使用 `https://qwind520.github.io`，`base` 设为 `/qwind-collectsite`；两者不要写反。
- 绑定自定义域名后，移除 `base`，更新 `site`，添加 `public/CNAME`。
- GitHub Pages 没有 PR 预览；需要预览时再接 Cloudflare Pages，不改构建产物。

### 11.3 后续升级路径

- 图片总量超过 1–2GB：原图迁 R2，展示图仍随仓库构建。
- 需要真访问控制：Cloudflare Access 保护 `/protected/*`。
- 需要 PR 预览：Cloudflare Pages 连接同一仓库。
- 这些升级都不改变 Astro 代码结构，只改部署和数据 URL。

## 12. 内容工作流

### 12.1 新建条目

```bash
pnpm new work
pnpm new artist
pnpm new link
pnpm new note
pnpm new file
```

脚本询问标题、slug、标签、日期等，生成带 frontmatter 的 Markdown 文件；作品额外创建图片目录。

### 12.2 图片处理

```bash
pnpm optimize-image ~/Pictures/originals/foo.png src/assets/works/foo/01.webp
```

- 使用 Sharp：最长边 2400px，WebP q82，剥离 EXIF，保留 ICC。
- 原图留在 `~/Pictures/archive-originals/`，该目录不进入 Git。
- 可选：生成 20px 的 LQIP base64 写入 frontmatter，用于模糊占位；v1 非必需。

### 12.3 NovelAI 元数据导入（可选）

```bash
pnpm import:nai ~/Pictures/originals/foo.png
```

- 读取 PNG `tEXt` 块中的 NovelAI 元数据（`Description` / `Comment` 的 JSON）。
- 提取正向、负向提示词、模型、种子、采样器、画师/角色 tag。
- 生成作品条目草稿，图片自动转 WebP 放入 `src/assets/works/<slug>/`。
- 解析失败时回退为手动新建，不阻塞流程。
- 该脚本属于 Phase 2，先保证手动流程可用。

### 12.4 发布

```bash
pnpm check
git add .
git commit -m "content: add ..."
git push
```

- `pnpm check` 包含 `astro check` 和内容校验。
- 构建失败时 GitHub Actions 不会发布，线上保持上一版。
- 草稿只在 `pnpm dev` 可见；生产构建过滤 `draft`。

### 12.5 备份

- 内容与展示图在 Git 仓库中，天然多副本。
- 原图目录单独备份到外置硬盘或对象存储。
- 每年导出一次仓库 tag，避免历史过大时难以克隆。

## 13. 受保护内容

### 13.1 实现

- `protected: true` 的条目在列表页只显示通用占位卡：类型 + 锁图标，不显示标题、封面和摘要。
- 详情页先渲染密码层，正文和图片在 DOM 中但默认隐藏；密码正确后由客户端移除隐藏状态。这里不做加密，只是遮罩。
- 密码哈希存在 `src/config/site.ts`，使用 SHA-256；不存明文。
- 解锁状态存 `sessionStorage`，键名 `qwind-unlocked`；提供“重新上锁”。
- `noindex, nofollow`，不进 sitemap、RSS、搜索索引。

### 13.2 安全边界

必须明确告诉站主和访客：

- 受保护内容仍在构建产物和 Git 历史里；密码也在前端。
- 它只能防误入、防搜索引擎、防 casual 浏览，不能防开发者工具。
- 真正私密的内容不要放进这个公开仓库。
- 需要真保护时，升级到 Cloudflare Access 或 R2 私有桶 + 签名 URL。

### 13.3 公开仓库的取舍

- 公开仓库意味着受保护条目的源文件、图片、frontmatter 都可被查看。
- 如果站主不能接受，受保护内容应放在独立私有仓库或对象存储，构建时通过 CI secret 合并；这会显著增加复杂度，v1 不做。

## 14. 性能、SEO 与可访问性

### 14.1 性能预算

- 首屏 JS ≤ 80KB gzip（PhotoSwipe 按需加载）。
- CSS ≤ 40KB gzip。
- 首屏图片 ≤ 250KB（手机）。
- LCP ≤ 2.5s（4G）；CLS ≤ 0.1；INP ≤ 200ms。
- Lighthouse Performance / Accessibility ≥ 90。

### 14.2 优化手段

- 静态 HTML；交互脚本按需加载。
- 图片多尺寸 + AVIF/WebP；首屏预加载，其余懒加载。
- 字体子集化；关键字体 `preload`，非关键 `swap`。
- 毛玻璃和花瓣在移动端降级；避免大面积 `backdrop-filter` 叠加。
- 不引入分析脚本；如需统计，用 Cloudflare Web Analytics（无 Cookie）。

### 14.3 SEO

- 每页独立 `title`、`description`、canonical。
- Open Graph / Twitter Card；默认 OG 图 + 作品封面图。
- `sitemap.xml` 由构建生成，排除 `draft` / `protected` / `noindex`。
- `rss.xml` 只含笔记。
- 结构化数据可选：`Person`（关于页）、`ImageObject`（作品页）；v1 先不做。

### 14.4 可访问性

- 语义化 landmark：`header`、`nav`、`main`、`footer`。
- 跳转链接、可见焦点、键盘操作、`aria-live` toast。
- 图片 `alt` 必填；灯箱按钮有可读标签。
- 颜色对比 AA；毛玻璃面板不透明度过低时不启用。

## 15. 测试与验收

### 15.1 自动化

- `pnpm check`：`astro check` + TypeScript。
- `pnpm test`：Vitest 覆盖 slug 规范化、标签聚合、搜索 bigram、日期格式化、密码哈希。
- `pnpm test:e2e`：Playwright 冒烟
  - 首页加载、导航可见
  - 画廊筛选后 URL 同步、结果数量变化
  - 灯箱打开、键盘切换、`Esc` 关闭
  - 搜索输入、结果跳转
  - 受保护页输入错误/正确密码
  - 移动端 390×844 视口无横向滚动

### 15.2 手动验收

- 新增一条作品 → push → Actions 成功 → 线上出现。
- 手机实际浏览：背景、毛玻璃、滚动性能可接受。
- 深浅色切换后文字对比度正常。
- 关闭 JS 后，列表和详情仍可阅读（筛选和灯箱降级）。
- 受保护内容不出现在 sitemap、RSS、搜索。
- 图片缺失、slug 重复时构建失败且有明确报错。

### 15.3 内容验收

- 五类内容各至少 1 条示例。
- 每条作品有提示词、标签、封面。
- 画师与作品的关联在作品页和画师页两侧都能看到，至少 1 组。
- 标签页能聚合跨类型内容。

## 16. 实施阶段

### Phase 0：地基（可独立验收）

- Astro 项目、TypeScript、Tailwind v4、全局 tokens。
- 五个集合 schema + 示例条目。
- 基础布局、导航、页脚、首页骨架。
- Git 仓库、GitHub Actions、Pages 部署跑通。
- README：本地开发、内容新增、部署说明。

验收：线上首页可访问；`pnpm check` 通过；新增示例条目后 push 能自动发布。

### Phase 1：核心画廊

- 画廊网格、筛选条、URL 同步、排序。
- 作品详情、提示词复制、PhotoSwipe 灯箱。
- 画师列表与详情、作品关联展示。
- 首页精选与最近作品接入真实数据。
- 图片响应式输出与懒加载。

验收：一批作品可完整浏览、筛选、复制提示词；手机可用。

### Phase 2：其余类型与搜索

- 书签、笔记、文件列表与详情。
- 标签聚合页、最近更新、全站搜索、命令面板。
- NovelAI 元数据导入脚本（可选）。
- RSS、sitemap、OG 图。

验收：五类内容可浏览；搜索和标签能跨类型聚合。

### Phase 3：保护、打磨与发布

- 受保护遮罩、`noindex`、搜索排除。
- 深色模式、无障碍、性能优化、移动端降级。
- 标题字体子集化：用 `pyftsubset` 或 `@fontsource` 的 unicode-range 方案，只保留站点实际用到的字符和字重。
- Playwright 冒烟、Lighthouse 检查。
- 关于页、版权说明、友链。
- 自定义域名（可选）。

验收：Lighthouse ≥ 90；受保护内容不泄露到索引；移动端滚动流畅。

## 17. 风险与待定项

### 风险

- **中文搜索质量**：bigram + 子串在 100 条内够用，但长笔记的相关度排序有限；必要时再引入 MiniSearch。
- **字体体积**：完整中文手写字体很大；必须子集化，否则首屏会被拖慢。
- **背景性能**：固定背景 + 毛玻璃在低端安卓上可能掉帧；已有移动端降级方案，需要在真机验证。
- **图片增长**：超过 1–2GB 后 Git 克隆变慢；按计划切 R2。
- **公开仓库与保护**：受保护内容仍公开；如果内容敏感，必须调整仓库策略。
- **参考站授权**：只借鉴代码结构，不复制内容；如要引用词条，先联系原作者。
- **NSFW 合规**：需要 18+ 提示、分级和 `noindex`；站主自行确认所在地法律与托管平台规则。

### 待定项

- 最终横幅图和头像素材（当前样稿借用博客素材）。
- 是否绑定自定义域名（如 `gallery.qwind.top`）。
- 首批内容的具体清单和数量。
- 是否在 v1 开放 NSFW 分类，还是先只收 `general` / `sensitive`。
- 是否保留深色模式（当前设计包含，成本可控）。

## 18. 附录：关键决策记录

| 决策 | 选择 | 理由 |
|---|---|---|
| 站点类型 | 静态 SSG | 规模小、无后端、Git 发布 |
| 框架 | Astro | 内容集合、图片优化、按需交互 |
| UI 框架 | 不使用 | 交互少，原生 TS 足够 |
| 样式 | Tailwind v4 + tokens | 快速布局，视觉仍可控 |
| 搜索 | 构建时索引 + 客户端过滤 | 100 条内无需服务 |
| 灯箱 | PhotoSwipe 5 | 成熟、移动端手势完整 |
| 托管 | GitHub Pages | 免费、与 GitHub 仓库一致 |
| 保护 | 前端遮罩 | 需求是防误入，不是安全边界 |
| 图片 | 展示图进 Git，原图不进 | 控制仓库体积 |
| 视觉 | 整页背景 + 毛玻璃 | 与博客形成同一人的视觉语言 |

## 19. 评审检查

- [ ] 目标与非目标是否准确
- [ ] 五类内容字段是否够用
- [ ] 页面与交互是否有遗漏
- [ ] 视觉方向是否与预期一致
- [ ] 受保护内容的边界是否接受
- [ ] 实施阶段顺序是否合理
- [ ] 待定项是否需要在开工前决定
