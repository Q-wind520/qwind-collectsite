# Anima 工作流（固化版）

2026-11-25 定稿：**fp8 + 20 步无 turbo** 作为精修默认，**8 步 turbo + LoRA** 作为草稿流；两条流程都保留 RealESRGAN 2× 放大。int8 和 TeaCache 不再放进工作流，失败记录见 `/notes/anima-speed-attempts/`。

## 文件

| 文件 | 用途 |
| --- | --- |
| `anima-t2i.json` | ComfyUI 界面工作流：精修/草稿两套参数 + 2× 放大 |
| `anima-t2i-api.json` | 同一套图的 API 格式，给脚本 `POST /prompt` |
| `anima-refine.json` | ComfyUI 界面工作流：涂遮罩 + LLLite 局部重绘 + 2× 放大 |
| `anima-refine-api.json` | 精修流程的 API 格式（用 `LoadImageMask` 代替手涂） |

## 模型

| 类型 | 文件 |
| --- | --- |
| UNet | `anima-aesthetic-v1.1.safetensors` |
| 草稿 LoRA | `anima-turbo-lora-v0.2.safetensors` |
| CLIP | `qwen_3_06b_base.safetensors`（type: `stable_diffusion`） |
| VAE | `qwen_image_vae.safetensors` |
| 放大 | `RealESRGAN_x4plus_anime_6B.pth` |
| 重绘补丁 | `anima-lllite-inpainting-v2.safetensors` |
| 安全检查（可选） | WD14 Tagger，`wd-v1-4-moat-tagger-v2` |

模型来自 [circlestone-labs/Anima](https://huggingface.co/circlestone-labs/Anima) 和 [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite)。

## 两套预设

| 预设 | LoRA 槽 1 | 步数 | CFG | 采样器 / 调度器 | 用途 |
| --- | --- | --- | --- | --- | --- |
| **精修（默认）** | `None` | 20 | 4 | `euler_ancestral` / `simple` | 背景、发丝、裙褶细节；约 10 分钟 |
| 草稿 | `anima-turbo-lora-v0.2` @ 1.0 | 8 | 1 | `euler_ancestral` / `simple` | 试构图；约 2 分钟 |

换预设时三件事一起改：LoRA、步数、CFG。

## 放大（所有流程都走）

- 放大模型：`RealESRGAN_x4plus_anime_6B`
- 4× 放大后 `ImageScaleBy 0.5` → **2× 输出**
- 832×1216 → 1664×2432
- 草稿和精修共用同一条放大链，出图同时保存原图和放大图

这是目前最稳的分辨率提升方式：不改构图、不重新采样、不引入二次生成的脸/手漂移。

## 为什么是 20 步无 turbo

同提示词、同 seed、832×1216 的对比：

- 8 步 turbo：单张约 2 分钟，线条硬、脸部清晰，但草地/花田/背景基本是平的。
- 20 步无 turbo：单张约 9~10 分钟，花田、发丝、裙褶和光照层次明显更多；代价是脸部线条更柔。
- 20 步下 `beta` 调度器会把草地压成大片色块；`simple` 保留的细节更多。
- euler_a 在 CFG 5 时背景也会变平；CFG 4 是细节和稳定性的平衡点。

## 精修工作流

`anima-refine.json` 是给已经生成的图做局部重绘的：

1. `LoadImage` 载入 1MP 左右的图。
2. 在 `Painter` 上涂出要重绘的区域。
3. 正向提示词写整张图的内容，负向保留 `bad hands` 等。
4. 运行：`UNet → AnimaLLLiteApply → LoRA 栈（默认 None）→ KSampler`，latent 由 `VAEEncodeForInpaint` 编码。
5. 输出重绘图，再自动 2× 放大。

精修也走 **20 步无 turbo、CFG 4**（草稿才用 8 步 turbo）；默认 `denoise 1.0`、LLLite strength 1.0、`grow_mask_by 12`。同 mask 下，这比 `SetLatentNoiseMask` 的手部结构更完整。

### 使用 LLLite 的前置条件

- 安装 `ComfyUI-Anima-LLLite`（提供 `AnimaLLLiteApply`）和 Painter 节点。
- 把模型补丁放到 `models/model_patches/`，并在 `extra_model_paths.yaml` 里登记：

```yaml
model_patches: models/model_patches
```

- 重启 ComfyUI 后，`ModelPatchLoader` 里能看到 `anima-lllite-inpainting-v2.safetensors`。

## 提示词结构（社区模板）

```text
[质量词] [主体描述] [外观细节] [服装] [姿势/表情] [场景] [光照] [构图] [风格] [额外 tags]
```

默认质量词：

```text
safe, masterpiece, best quality, year 2025, newest, highres, detailed background
```

可在后面加 `aesthetic, very aesthetic`（v2 系列用了这组词）。画师 tag 直接写在角色后面，例如 `@askzy`。负向里保留 `artist name`，避免画师签名进画面。

## 使用

### 界面

把 `anima-t2i.json` 或 `anima-refine.json` 拖进 ComfyUI，改提示词/图片/seed 后运行。出图会同时保存原图和 2× 放大图。

- LoRA 栈槽 1 放 turbo；画风 LoRA 从槽 2 开始。
- 精修预设槽 1 选 `None`；草稿预设槽 1 选 `anima-turbo-lora-v0.2`。

### API

```bash
curl -s http://127.0.0.1:8190/prompt \
  -H 'Content-Type: application/json' \
  -d "{\"prompt\": $(cat anima-t2i-api.json), \"client_id\": \"anima\"}"
```

精修 API 需要先把图放到 `input/refine/input.png`、遮罩放到 `input/refine/mask.png`（白色为重绘区）。

## 备注

- ComfyUI 里 `euler_a` 的实际 ID 是 `euler_ancestral`。
- WD14 节点默认静音；取消静音只输出 tag，不会改图。
- 20 步精修的脸部线条比 8 步 turbo 更柔；要更硬的线条时用草稿预设，或出图后再做一次放大/局部重绘。
- 精修图的构图/颜色可能轻微变化，重要作品建议固定 seed 多跑几张挑。

## 失败的加速尝试

TeaCache（跳步，等效少跑几步）和 int8 + LoRA（原生报错、W8A8 翻译器更慢）都没有进入默认工作流；实测数据与结论见笔记：

`/notes/anima-speed-attempts/`

## 来源

- [circlestone-labs/Anima](https://huggingface.co/circlestone-labs/Anima)
- [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite)
- 社区 `anima_uni_workflow_fixed.app.json`
- 官方 `image_anima_base_v1.json` / `image_anima_lllite_image_inpainting.json`
- 本站采样器对比：`/notes/anima-sampler-notes/`
