# 补齐 rating 分级作品 40 张（sensitive 20 / nsfw 20）

日期：2026-11-21
状态：已选定方案 A，待执行

## 意图与 why

站点 `rating` 分级极不均匀：`general` 160 / `sensitive` 8 / `nsfw` 4 / `r18g` 0；而 `tier` 轴是草稿 84 / 精修 84 / 精选 0。目标是补 40 张作品，把稀缺档 `sensitive`、`nsfw` 填起来，让分级分布不再一边倒。

## 目标 / 非目标 / 反目标

- 目标：新增 40 条 `src/content/works/*.md` + 对应 `src/assets/works/<slug>/01.webp`；`sensitive` 与 `nsfw` 各 20；`general` 不加、`r18g` 不碰。
- 非目标：不改 tier 分布、不新增画师/标签体系、不改站点代码与配置。
- 反目标：生成图分级串档（sensitive 越过 nsfw 红线、或出现 child/loli/shota），或入库条目缺 prompt/图片导致 `pnpm check` 失败。

## 约束（来自笔记与现有工作流）

- 模型链：Anima Aesthetic v1.1 + Turbo LoRA v0.2，CLIP `qwen_3_06b_base`，VAE `qwen_image_vae`，RealESRGAN x4 anime 放大。
- 出图参数：832×1216、`euler_a`（ComfyUI `euler_ancestral`）、`simple`、8 步、CFG 1、denoise 1、UNet fp8；2× 放大到 1664×2432。
- 提示词结构：`[质量词] [主体] [外观] [服装] [姿势/表情] [场景] [光照] [构图] [风格] [额外]`；质量词固定 `safe, masterpiece, best quality, year 2025, newest, highres, detailed background`；画师 `@artist`；权重 `(tag:2)` 偏高；约 200 token，混合写法。
- 负面固定：`worst quality, low quality, score_1, score_2, score_3, artist name, blurry, jpeg artifacts, chromatic aberration, watermark, signature, text, logo`。
- 分级红线：
  - `sensitive`＝泳装/露肩/露腰/绝对领域等轻微暴露；负面追加 `nsfw, nude, naked, explicit, nipples, areola, panties, see-through, revealing clothes, child, loli, shota`；正面写 `adult`。
  - `nsfw`＝允许露骨内容，参考 `comfy-88564943`；必须 `adult`，严禁 child/loli/shota；保留 WD14 安全复核。
- ComfyUI 通过按需启动器起：`POST http://172.17.0.1:8191/start`（无 token），headless 跑在 `172.17.0.1:8190`；GPU 空闲 3640MB > 3072 门槛。
- 执行者不读取/查看生成图片内容，由用户自行审查。技术校验只查文件存在、尺寸、格式，不看图像内容。

## 方案

采用方案 A（一条龙生成并入库），因为用户已明确选择，且已有成熟的脚本与模板可直接复用。

1. 以 `public/files/conf/anima/anima-t2i-api.json` 为模板，参考 `scripts/generate-sensitive-batch.py` 的 JOBS 写法，产出 40 组提示词（20 sensitive + 20 nsfw），主题从现有角色库（初音、雷电、芙莉莲、胡桃、原神/碧蓝角色等）与 `docs/anima-prompt-library.md` 取，覆盖不同场景/构图/画师。
2. 启动 ComfyUI，逐组 `POST /prompt` 生成， staging 到 `/tmp`，WD14 复核分级（sensitive 档若越线则重生成或改档）。
3. `optimize-image` 转 webp 到 `src/assets/works/<slug>/01.webp`。
4. 按现有 work frontmatter 结构写 40 条 `.md`（`kind: painting`、`tier: refined`、对应 `experiment`、`rating`、`prompt.{positive,negative,artist,character,scene,model}`）。
5. `pnpm check` + `pnpm build` 验证；不提交，留给审查。

## 留待执行者决定（builder 可自定）

- 具体 40 组 slug 命名：沿用 `bal-40-s##` / `bal-40-n##` 前缀避免与已有 slug 冲突。
- 画师/角色分配：每档内打散，避免全押一个画师。
- seed：每组固定唯一值，便于复现。
