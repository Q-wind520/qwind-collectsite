# 温水の收藏站

个人收藏站：NovelAI 画作、画风、构图、网页书签、笔记与文件。

- 线上：https://q-wind520.github.io/qwind-collectsite/
- 设计文档：`docs/superpowers/specs/2026-10-17-qwind-collectsite-design.md`

## 本地开发

```bash
pnpm install
pnpm dev
```

## 新增内容

```bash
pnpm new work --kind painting
pnpm new work --kind style --artist "artist:xxx"
pnpm new work --kind composition --scene "wide shot, rule of thirds"
pnpm optimize-image ~/Pictures/originals/foo.png src/assets/works/foo/01.webp
pnpm check
git add .
git commit -m "content: add foo"
git push
```

作品分类通过 `kind` 区分：`painting`（画作，原图 + 提示词）、`style`（画风，画师串 + 参考图）、`composition`（构图，构图/场景串 + 参考图）。

## 内容目录

- `src/content/works/` 作品
- `src/content/artists/` 画师元数据（作品页筛选用，不再有独立页面）
- `src/content/links/` 书签
- `src/content/notes/` 笔记
- `src/content/files/` 文件

## 受保护内容

`protected: true` 只是前端遮罩，内容仍在构建产物和 Git 历史中。v1 只对作品启用密码层；其他类型写 `protected: true` 会被公开列表和索引过滤。`rating: nsfw` / `r18g` 的作品必须同时设置 `protected: true`，否则 `pnpm check` 会失败。不要把真正私密的内容放进这个公开仓库。

## 个性化

- 头像：`public/images/avatar.jpg`（当前取自 blog.qwind.top）
- 横幅：`public/images/banner.svg`
- 站点名、简介、公告、社交链接：`src/config/site.ts`

## 部署

推送到 `main` 后，GitHub Actions 自动构建并发布到 GitHub Pages。首次部署需要在仓库 Settings → Pages 中把 Source 设为 GitHub Actions。

## 许可

代码使用 MIT；作品、词条、图片和笔记的版权归各自作者所有，不在 MIT 范围内。
