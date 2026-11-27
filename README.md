# 温水の收藏站

个人收藏站：NovelAI 作品与生图实验记录、画师、网页书签、笔记与文件。

- 主站：https://collect.qwind.top/
- GitHub Pages 镜像：https://q-wind520.github.io/qwind-collectsite/
- 设计文档：`docs/superpowers/specs/2026-10-17-qwind-collectsite-design.md`

## 本地开发

```bash
pnpm install
pnpm dev
```

## 新增内容

```bash
pnpm new work --kind painting --tier refined --experiment prompt
pnpm new work --kind style --tier refined --experiment lora --artist "artist:xxx"
pnpm new work --kind composition --scene "wide shot, rule of thirds"
pnpm optimize-image ~/Pictures/originals/foo.png src/assets/works/foo/01.webp
pnpm check
git add .
git commit -m "content: add foo"
git push
```

作品浏览不再按「画作 / 画风 / 构图」分栏，而是「作品 + 多轴标签」：

- `kind` 只决定详情页提示词区块的类型：`painting` 正向提示词、`style` 画师串、`composition` 构图/场景串；它不参与浏览分类。
- `tier` 是质量层级：`sketch` 草稿 / `refined` 精修 / `showcase` 精选。用 `sketch` 而不是 `draft`，避免和发布状态 `draft` 混淆。
- `experiment` 是生图实验类型，可多选：`prompt` 提示词测试、`lora` LoRA 测试、`sampler` 采样器对比、`steps` 步数对比、`cfg` CFG 对比、`upscale` 放大对比、`inpaint` 局部重绘、`quantize` 量化对比。
- `tags` 承担内容主题、风格、构图等自由标签，画廊里支持多选筛选。

主分类（人物 / 场景 / …）和 `/gallery/<主题>/` 等每个主题有 10 件以上再拆。示例作品已设置为 `draft: true`，生产构建不会显示；本地开发模式仍会显示草稿。

## 工具

- `/tools`：提示词转换，支持 Anima、NovelAI V4.5、NovelAI V5 三者互转，包括权重、嵌套括号和画师 tag。
- 权重按官方语法原样转换：NovelAI `{tag}` = ×1.05、`[tag]` = ÷1.05、V4+ 数字权重 `1.2::tag::`；Anima 用 A1111 风格 `(tag:2)`，官方建议数值高于 SDXL，工具不自动缩放。
- NovelAI → Anima 时 `_` 转为空格（`score_*` 除外）；Anima → V4.5 时画师名转 `_`，Anima → V5 时画师名保留空格。
- V4.5 → V5 会把下划线 tag 和画师名统一为空格；V5 → V4.5 会把画师名改回下划线，并提示 V5 专属 tag 与 V4.5 不支持的 Unicode 字符。
- 转换在浏览器本地完成，不请求后端。
- 转换规则集中在 `src/lib/prompt-convert.ts` 的模型与转译注册表中，新增模型时扩展注册表即可。

## 内容目录

- `src/content/works/` 作品
- `src/content/artists/` 画师元数据（作品页筛选用，不再有独立页面）
- `src/content/links/` 书签
- `src/content/notes/` 笔记
- `src/content/files/` 文件

## NSFW 内容

`rating: nsfw` / `r18g` 的作品默认隐藏，不进入 sitemap 和默认搜索结果。导航栏的 `NSFW` 开关会在当前浏览器中开启显示；开启前需要完成三次成年确认，设置只保存在本机 `localStorage`。这不是访问控制，图片仍在公开构建产物中，不要放真正私密的内容。

## 个性化

- 头像：`public/images/avatar.jpg`（当前取自 blog.qwind.top）
- 横幅：`public/images/banner.svg`
- 站点名、简介、公告、社交链接：`src/config/site.ts`

## 部署

### Cloudflare Pages（主站）

- 项目：`qwind-collectsite`
- 生产分支：`main`
- 构建命令：`pnpm run build`
- 输出目录：`dist`
- 环境变量：`SITE_URL=https://collect.qwind.top`
- 自定义域：`collect.qwind.top`
- DNS：在腾讯云给 `collect` 添加 CNAME，指向 `qwind-collectsite.pages.dev`

Cloudflare 会在每次推送到 `main` 后自动构建。也可以本地手动部署：

```bash
pnpm deploy:cf
```

### GitHub Pages（镜像）

推送到 `main` 后，GitHub Actions 自动构建并发布到 GitHub Pages。构建时使用 `BASE_PATH=/qwind-collectsite`、`SITE_URL=https://q-wind520.github.io`。

## 支持 / 云要饭

如果本站的内容对你有用，欢迎随手投喂一杯咖啡；不订阅、不捆绑，完全随缘。

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4a67?style=for-the-badge&logo=github)](https://github.com/sponsors/Q-wind520)
[![爱发电](https://img.shields.io/badge/%E7%88%B1%E5%8F%91%E7%94%B5-%E6%8A%95%E5%96%82%E4%B8%80%E6%AC%A1-f0808c?style=for-the-badge)](https://afdian.com/a/qwind520)

爱发电付费按「1 个月」计费，选 1 个月即一次性投喂，平台没有自动续费；GitHub Sponsors 适合海外朋友，个人赞助 GitHub 不抽成。

## 许可

- 代码使用 MIT，见 `LICENSE`。
- 除特别声明外，本站内容（文字、作品、笔记等）按 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans) 共享，见 `LICENSE-CONTENT`。
- 作品图片、第三方词条等如另有版权声明，以该声明为准。
