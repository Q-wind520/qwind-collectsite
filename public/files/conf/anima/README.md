# Anima 工作流（固化版）

这是我在这台机器上跑 Anima 的默认工作流。参数来自 2026-11 的 20 张采样器对比，结构参考了 Anima 官方模板、官方 LLLite 重绘模板，以及社区的 `anima_uni_workflow_fixed`。

## 文件

| 文件 | 用途 |
| --- | --- |
| `anima-t2i.json` | ComfyUI 界面工作流：出图 + 2× 放大 |
| `anima-t2i-api.json` | 同一套图的 API 格式，给脚本 `POST /prompt` |
| `anima-refine.json` | ComfyUI 界面工作流：涂遮罩 + LLLite 局部重绘 + 2× 放大 |
| `anima-refine-api.json` | 精修流程的 API 格式（用 `LoadImageMask` 代替手涂） |

## 模型

| 类型 | 文件 |
| --- | --- |
| UNet | `anima-aesthetic-v1.1.safetensors` |
| Turbo LoRA | `anima-turbo-lora-v0.2.safetensors` |
| CLIP | `qwen_3_06b_base.safetensors`（type: `stable_diffusion`） |
| VAE | `qwen_image_vae.safetensors` |
| 放大 | `RealESRGAN_x4plus_anime_6B.pth` |
| 重绘补丁 | `anima-lllite-inpainting-v2.safetensors` |
| 安全检查（可选） | WD14 Tagger，`wd-v1-4-moat-tagger-v2` |

模型来自 [circlestone-labs/Anima](https://huggingface.co/circlestone-labs/Anima) 和 [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite)，放大模型来自 Real-ESRGAN 的 anime 6B 权重。

## 出图默认参数

- 832×1216（2:3 竖图，约 1MP）
- `euler_ancestral`（也就是 euler_a）
- `simple` 调度器
- 8 步，CFG 1，denoise 1
- UNet 以 `fp8_e4m3fn` 加载
- 放大：RealESRGAN x4 → `ImageScaleBy 0.5` → 2× 输出（1664×2432）

### 为什么是这套

- 20 张同内容同种子的横向对比里，euler_a 最稳，er_sde 次之；dpmpp_2m_sde_gpu 波动最大，euler 偏平。
- 8 步 turbo 下，`beta` 调度器会更平、对比更低；社区官方模板里的 `er_sde + beta + 26/30 步` 是给非 turbo 模式的。
- 832×1216 和官方 1024×1024 的像素量接近，4GB 显存也能跑，出图约 2 分钟一张。

## 精修工作流

`anima-refine.json` 是给已经生成的图做局部重绘的：

1. `LoadImage` 载入 1MP 左右的图。
2. 在 `Painter` 上涂出要重绘的区域。
3. 正向提示词写整张图的内容，负向保留 `bad hands` 等。
4. 运行：`UNet → AnimaLLLiteApply → Turbo LoRA → KSampler`，latent 由 `VAEEncodeForInpaint` 编码。
5. 输出重绘图，再自动 2× 放大。

默认 `denoise 1.0`、LLLite strength 1.0、`grow_mask_by 12`。同 mask 下，这比我自己写的 `SetLatentNoiseMask` 手部结构更完整。

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

画师 tag 直接写在角色后面，例如 `@askzy`。负向里保留 `artist name`，避免画师签名进画面。

## 使用

### 界面

把 `anima-t2i.json` 或 `anima-refine.json` 拖进 ComfyUI，改提示词/图片/seed 后运行。出图会同时保存原图和 2× 放大图。

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
- 这套参数只覆盖 8 步 turbo；切回非 turbo（26/30 步、CFG 4~7）时要重新调调度器和步数。
- 精修图的构图/颜色可能轻微变化，重要作品建议固定 seed 多跑几张挑。

## 来源

- [circlestone-labs/Anima](https://huggingface.co/circlestone-labs/Anima)
- [Comfy-Org/Anima-LLLite](https://huggingface.co/Comfy-Org/Anima-LLLite)
- 社区 `anima_uni_workflow_fixed.app.json`（采样器参数、LLLite、放大组件）
- 官方 `image_anima_base_v1.json` / `image_anima_lllite_image_inpainting.json`
- 本站 2026-11 的采样器对比：`/notes/anima-sampler-notes/`
