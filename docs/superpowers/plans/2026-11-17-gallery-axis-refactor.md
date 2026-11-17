# 作品分类轴改造（最小版）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把「画作 / 画风 / 构图」从平级导航降级为提示词模式，新增 `tier` 与 `experiment` 两个可筛选字段，让作品浏览变成「作品 + 多轴标签」。

**Architecture:** 保留 `kind` 仅用于详情页提示词区块（正向 / 画师串 / 构图串），不再参与导航、计数和搜索分类。新增 `tier`（单选）与 `experiment`（多选数组），画廊筛选条提供层级、实验、标签（多选 chips）、画师、分级、排序。标签是唯一的内容主题轴，主分类和 `/gallery/<主题>/` 留到每个主题 10 件后再拆。

**Tech Stack:** Astro 7 content collections + Zod, 原生 TS 客户端脚本, Vitest, Playwright。

**Spec:** 本次对话中的分类评价 + `docs/superpowers/specs/2026-10-17-qwind-collectsite-design.md`

## Global Constraints

- 中文界面优先；视觉沿用现有毛玻璃 / 珊瑚粉 tokens。
- `draft: true` 仍是发布状态，只在开发环境显示；不要与 `tier` 混用。
- `tier` 取值用 `sketch | refined | showcase`，中文标签为 草稿 / 精修 / 精选；不用 `draft` 以免与发布字段冲突。
- `experiment` 取值固定为：`prompt, lora, sampler, steps, cfg, upscale, inpaint, quantize`。
- `kind` 保留 `painting | style | composition`，只决定提示词区块的标题与复制按钮。
- 不新增主分类字段，不改 `/gallery/[slug]` URL 结构。
- 所有新字段有默认值，旧内容无需批量迁移。

---

### Task 1: 分类词汇与 schema

**Files:**
- Create: `src/lib/work-meta.ts`
- Modify: `src/content.config.ts`
- Test: `tests/unit/work-meta.test.ts`

**Interfaces:**
- Produces: `WORK_TIERS`, `WorkTier`, `TIER_LABELS`, `WORK_EXPERIMENTS`, `WorkExperiment`, `EXPERIMENT_LABELS`, `WORK_KINDS`, `WorkKind`.

- [ ] Step 1: 写失败测试，断言每个 tier / experiment / kind 都有中文标签。
- [ ] Step 2: 运行 `pnpm test tests/unit/work-meta.test.ts`，确认模块不存在导致失败。
- [ ] Step 3: 创建 `src/lib/work-meta.ts`，用 `as const` 元组和 `Record<Union, string>` 定义词汇与标签。
- [ ] Step 4: 在 `src/content.config.ts` 的 works schema 加入 `tier` 默认 `refined`、`experiment` 默认 `[]`，并把 `kind` 改为引用 `WORK_KINDS`。
- [ ] Step 5: 运行 `pnpm test tests/unit/work-meta.test.ts`，确认通过。

### Task 2: 可测试的筛选判断

**Files:**
- Create: `src/lib/work-filter.ts`
- Test: `tests/unit/work-filter.test.ts`

**Interfaces:**
- Produces: `WorkFilterState { artist: string; rating: string; tags: string[]; tier: string; experiment: string }`
- Produces: `WorkFilterData { nsfw: boolean; artists: string[]; rating: string; tags: string[]; tier: string; experiments: string[] }`
- Produces: `matchesWorkFilter(data: WorkFilterData, filter: WorkFilterState, nsfwOn: boolean): boolean`
- 语义：同一轴内 OR（标签多选时命中任一即可），不同轴之间 AND；NSFW 未开启时隐藏。

- [ ] Step 1: 写失败测试覆盖 NSFW、画师、分级、标签 OR、tier、experiment。
- [ ] Step 2: 运行 `pnpm test tests/unit/work-filter.test.ts`，确认失败。
- [ ] Step 3: 实现纯函数，空字符串 / 空数组表示该轴不筛选。
- [ ] Step 4: 运行测试确认通过。

### Task 3: 画廊界面改为多轴筛选

**Files:**
- Modify: `src/pages/gallery/index.astro`
- Modify: `src/components/FilterBar.astro`
- Modify: `src/components/WorkCard.astro`
- Delete: `src/components/GallerySidebar.astro`
- Modify: `src/content/works/example-work.md`（测试夹具：`tier: sketch`、`experiment: [prompt]`）
- Modify: `src/content/works/plana-beach.md`、`src/content/works/alona-beach.md`（`experiment: [lora]`）

**Interfaces:**
- FilterBar 新增 `select[name="tier"]`、`select[name="experiment"]`，标签改为 `input[type="checkbox"][name="tag"]` chips。
- WorkCard 暴露 `data-tier`、`data-experiments`（`|` 分隔），新增层级 / 实验小徽章。

- [ ] Step 1: 删除侧栏引用与 `gallery-layout` 两栏布局，标题改为「作品」。
- [ ] Step 2: 在 FilterBar 渲染层级与实验下拉，以及多选标签 chips；保留画师、分级、排序、清除、结果计数。
- [ ] Step 3: WorkCard 输出新 data 属性，并用 `TIER_LABELS` / `EXPERIMENT_LABELS` 渲染徽章。
- [ ] Step 4: 删除 `GallerySidebar.astro`。

### Task 4: 客户端筛选脚本

**Files:**
- Modify: `src/scripts/gallery-filter.ts`

**Interfaces:**
- Consumes: `matchesWorkFilter`。
- 读取 `artist, rating, tier, experiment, sort` 和多个 `tag`；URL 用重复的 `tag=` 参数同步。

- [ ] Step 1: 删除 kind 切换、标题改写、分类计数逻辑。
- [ ] Step 2: 用 `FormData.getAll('tag')` 读取多选标签，用 dataset 组装 `WorkFilterData` 调用 `matchesWorkFilter`。
- [ ] Step 3: 初始化时从 URL 恢复 select 与 checkbox，`history.replaceState` 写回 `tier` / `experiment` / 多个 `tag`。

### Task 5: 详情、JSON、弹层、搜索与首页统计

**Files:**
- Modify: `src/lib/work-detail.ts`
- Modify: `src/pages/works.json.ts`（经由 buildWorkDetail）
- Modify: `src/pages/gallery/[slug].astro`
- Modify: `src/components/WorkModal.astro`
- Modify: `src/scripts/work-modal.ts`
- Modify: `src/pages/search-index.json.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- `WorkDetail` 新增 `tier: string`、`tierLabel: string`、`experiment: string[]`、`experimentLabel: string`，移除 `kind`。
- 详情页 kicker 改为 `WORK / <层级> / <分级>`，facts 增加层级与实验。
- 搜索类型统一为「作品」；首页统计改为 作品 / 标签 / 笔记 / 书签。

- [ ] Step 1: 扩展 `buildWorkDetail` 与 `WorkDetail` 类型。
- [ ] Step 2: 详情页与弹层展示层级、实验，kicker 改用层级。
- [ ] Step 3: 搜索索引类型改「作品」，把层级与实验中文标签并入可搜索文本。
- [ ] Step 4: 首页统计移除 `kindCounts`，改用可见作品、标签、笔记、书签数量。

### Task 6: 创建脚本与文档

**Files:**
- Modify: `scripts/new-entry.ts`
- Modify: `README.md`
- Modify: `tests/unit/content.test.ts`（删除 `kindCounts` 测试）

- [ ] Step 1: `pnpm new work` 增加 `--tier`、`--experiment`，校验取值并写入 frontmatter。
- [ ] Step 2: README 说明 `kind` 只控制提示词模式，浏览用 `tier` / `experiment` / `tags`，并记录 `sketch` 命名原因。
- [ ] Step 3: 删除已废弃的 `kindCounts` 导入与测试。

### Task 7: 端到端验收

**Files:**
- Modify: `tests/e2e/gallery.spec.ts`

- [ ] Step 1: 删除侧栏 kind 切换测试，新增「无分类侧栏、标题为作品」断言。
- [ ] Step 2: 新增 tier、experiment、标签多选筛选与 URL 同步测试。
- [ ] Step 3: 运行 `pnpm test`、`pnpm check`、`pnpm build`、`pnpm test:e2e`。
