# 人物电脑壁纸 20 张（高画质）设计

日期：2026-11-26
状态：LoRA 来源已定（用户修复代理后自行下载更好的风格/场景 LoRA）

## 意图与 why

用户要 20 张"电脑壁纸（人物）级质量和尺寸"的作品：横屏 16:9、高细节、人物主题，自由搭配画师串与风格/场景 LoRA 提高质感。年龄分级由执行者定。目的是拿到一批可直接当桌面壁纸的高质量人物图。

## 目标 / 非目标

- 目标：20 张横屏人物壁纸入库（`src/content/works/` + `src/assets/works/`），尺寸 2720×1536，细节达到壁纸级；风格多样、画师串打散。
- 非目标：不改站点代码/配置；不做 nsfw/r18g；不批量改动已有作品。
- 反目标：竖图（手机比例）、低细节、分级串档、缺图导致 `pnpm check` 失败。

## 约束（来自笔记 / 更新后的工作流）

- 底模 `anima-aesthetic-v1.1` fp8 + **20 步精修**（无 turbo，CFG 4，euler_a / simple）。笔记 `anima-speed-attempts` 结论：20 步发丝/裙褶/背景细节明显更多，壁纸用精修不用草稿。
- latent 横图 **1360×768**（16:9，约 1MP，落在 Anima 最佳区间），2× 放大 → **2720×1536**。
- 质量词：`safe, masterpiece, best quality, year 2025, newest, highres, detailed background, aesthetic, very aesthetic`（v2 壁纸用词）。
- 负面：基础负面 + `worst quality, low quality, score_1/2/3, artist name, blurry, jpeg artifacts, chromatic aberration, watermark, signature, text, logo`；额外加 `bad hands, extra fingers` 保人物质量。
- 分级：全部 `general`（壁纸面向公开浏览）；人物一律成年、`adult`，负面含 `child, loli, shota`。
- 画师串：`@artist` 规范小写，权重偏高如 `(@artist:0.8~1.2)`，每档打散。
- LoRA：优先用新下载的高质量 Anima 风格/光照/细节 LoRA（槽 2）；turbo 只在槽 1 且精修预设下为 `None`。
- 用户审查视觉，执行者不打开图片内容，只做尺寸/格式的技术校验。

## LoRA 最终到位情况

Civitai 下载需登录 + 人机验证；代理恢复后，用主 Firefox 的实时 cookie 走通了 CDN 直链下载（S1 的 SHA256 `d27d2c74…` 与官方发布值一致，文件完整）。每个下载会话只能领一次验证，因此拿到优先级最高的 2 个（也是对壁纸质感提升最大的 2 个）：

- **S1 Dramatic Lighting**（`s1_dram`，戏剧光照，已装、已冒烟验证可加载）
- **Anima Highres/Aesthetic Boost**（高分辨率/审美增强，已装）

本地另有 11 个风格 LoRA 作搭配：水彩/平涂/Drifters/gpt-image/像素/Chibi/Sketchy×2/2 角色 LoRA（v2 已验证可用）。合计 13 个 LoRA 足够 20 张风格多样。

其余候选（Detail Tweaker / Light Concepts / Masterpiece / MeMaAni Flat）因验证门槛未下，不阻塞本批次。

## 方案

1. 确认能从已登录 Firefox 下载 1~2 个高质量 LoRA 作为验证；失败则退回本地 11 个 LoRA（v2 方案），不再卡住。
2. 写 20 组壁纸任务脚本（横图 latent、20 步精修、新 LoRA + 画师串），照 `generate-rating-balance-40.py` 结构复用 staging / 入库逻辑。
3. 启动 ComfyUI，批量生成到 staging，技术校验尺寸格式，转 WebP 入库。
4. `pnpm check` + `pnpm build`；不提交，留给用户审查。

## 留待执行者决定

- 具体 20 组主题/角色/画师/风格分配：按"风格多样、画师打散"原则，从现有角色库 + Civitai 高分风格取材。
- LoRA 下载地址/文件名的精确版本：以 API 返回的最新 Anima 兼容版本为准。
