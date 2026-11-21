# Rating 分级补齐 40 张 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 40 件 Anima 作品（`sensitive` 20 / `nsfw` 20），补平 `rating` 分级的稀缺档，每条含合规提示词与 WebP 图片，通过 `pnpm check` 与 `pnpm build`。

**Architecture:** 复用现有 `anima-t2i-api.json` 模板与 `generate-sensitive-batch.py` 模式：新建一个 40 任务生成脚本（分档负面词）→ 通过按需启动器起 headless ComfyUI → 逐组出图到 staging → 入库脚本转 WebP 并写内容条目 → 校验。

**Tech Stack:** Python 3（urllib 调 ComfyUI API）、ComfyUI headless（launcher `172.17.0.1:8191`、生图 `172.17.0.1:8190`）、Node `sharp`（`optimize-image.mjs`）、Astro content collections。

**Spec:** `docs/superpowers/specs/2026-11-21-rating-balance-40-works-design.md`

## Global Constraints

- 模型链：`anima-aesthetic-v1.1.safetensors` + `anima-turbo-lora-v0.2.safetensors`，CLIP `qwen_3_06b_base.safetensors`，VAE `qwen_image_vae.safetensors`，放大 `RealESRGAN_x4plus_anime_6B.pth`。
- 出图参数：832×1216、`euler_ancestral`、`simple`、8 步、CFG 1.0、denoise 1.0、UNet `fp8_e4m3fn`；2× 放大（`ImageScaleBy 0.5`）。
- 质量词：`safe, masterpiece, best quality, year 2025, newest, highres, detailed background`。
- 基础负面词：`worst quality, low quality, score_1, score_2, score_3, artist name, blurry, jpeg artifacts, chromatic aberration, watermark, signature, text, logo`。
- `sensitive` 额外负面：`nsfw, nude, naked, explicit, nipples, areola, panties, see-through, revealing clothes, child, loli, shota`；正面须含 `adult` 与 `safe`。
- `nsfw` 额外负面：`child, loli, shota`（不得含 nsfw/nude 等排除词，否则出不了图）；正面须含 `adult`。所有角色均成年、虚构。
- slug 前缀：`bal40-s01..20`（sensitive）、`bal40-n01..20`（nsfw），seed 唯一且与已有作品不冲突。
- 前端不读图：执行者只用 `file`/`identify`/Python PIL 校验文件存在、尺寸、格式，不查看图像内容；视觉审查由用户完成。
- 生成任务清单 20+20，主题取现有角色库与 `docs/anima-prompt-library.md`，画师串打散、场景/构图/镜头多样。
- 不提交、不推送，留给审查。

## Review Focus

- sensitive 越线成露骨：若 sensitive 负面缺 `nsfw/nude/explicit/child` 排除词或正面缺 `adult`，会越档 → Task 1 的断言测试与 `--verify` 覆盖。
- nsfw 负面误用 sensitive 排除词：会把目标内容一起屏蔽、出图为空或退化 → Task 1 断言 `nsfw` 负面不含 `nsfw/nude` 等词。
- nsfw 出现未成年：正面须 `adult`、负面须 `child/loli/shota` → Task 1 断言覆盖。
- `pnpm check` 因缺图/坏 frontmatter 失败 → Task 3 校验 40 个 WebP 存在 + `pnpm check` + `pnpm build`。
- slug 碰撞覆盖已有作品 → Task 1 断言 `bal40-` 前缀在 `src/content/works/` 中不存在。

---

### Task 1: 40 任务生图脚本

**Files:**
- Create: `scripts/generate-rating-balance-40.py`

**Interfaces:**
- Consumes: `public/files/conf/anima/anima-t2i-api.json`（模板），笔记中的提示词规范。
- Produces: `JOBS`（40 个 dict，键含 `slug/title/tags/character/scene/prompt/rating/seed`）、`build_prompt(job)->dict`、`submit(job)->str`、`wait_done(pid)->dict`、`copy_outputs(job,h)->list[str]`、`load_progress()/save_progress()`、CLI `--list/--status/--verify/--all/--slug`。staging 目录 `/tmp/anima-rating40-out/<slug>/`，进度 `/tmp/anima-rating40-progress.json`。

- [ ] **Step 1: 写断言测试 `scripts/test-generate-rating-balance-40.py`**（pytest）

```python
import importlib.util
from pathlib import Path
p = Path(__file__).parent / "generate-rating-balance-40.py"
spec = importlib.util.spec_from_file_location("g", p); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def test_job_counts_and_unique():
    assert len(m.JOBS) == 40
    assert sum(j["rating"] == "sensitive" for j in m.JOBS) == 20
    assert sum(j["rating"] == "nsfw" for j in m.JOBS) == 20
    assert len({j["slug"] for j in m.JOBS}) == 40
    assert len({j["seed"] for j in m.JOBS}) == 40

def test_slug_prefix_no_collision():
    for j in m.JOBS:
        assert j["slug"].startswith("bal40-")
        assert not (Path("src/content/works") / (j["slug"] + ".md")).exists()

def test_negative_words_per_rating():
    for j in m.JOBS:
        neg = m.build_prompt(j)["6"]["inputs"]["text"].lower()
        if j["rating"] == "sensitive":
            for w in ("nsfw", "nude", "explicit", "child", "loli", "shota"):
                assert w in neg
        else:
            for w in ("nsfw", "nude", "explicit"):
                assert w not in neg
            for w in ("child", "loli", "shota"):
                assert w in neg

def test_no_minors_and_adult():
    for j in m.JOBS:
        assert "adult" in j["prompt"]
        assert not any(w in j["prompt"].lower() for w in ("loli", "shota", "child"))

def test_template_wiring():
    for j in m.JOBS:
        g = m.build_prompt(j)
        assert g["7"]["inputs"] == {"width": 832, "height": 1216, "batch_size": 1}
        assert g["8"]["inputs"]["steps"] == 8 and g["8"]["inputs"]["sampler_name"] == "euler_ancestral"
```
- [ ] **Step 2: 跑测试确认失败**（脚本不存在）
- [ ] **Step 3: 实现 `generate-rating-balance-40.py`**：照 `generate-sensitive-batch.py` 结构，`COMFY=http://172.17.0.1:8190`，定义 `QUALITY`、基础负面、`SENSITIVE_NEGATIVE`、`NSFW_NEGATIVE`；写 40 个 JOBS（sensitive 用泳装/露肩/露腰/绝对领域元素，nsfw 用露骨成人内容，参考 `comfy-88564943`）；`build_prompt` 设 node 5/6/8/10/14；`copy_outputs` 取 upscaled 优先、统一命名 `01.png`/`01-upscaled.png`。
- [ ] **Step 4: 跑测试确认通过**
- [ ] **Step 5: `--verify` 离线校验 40 组提示词可序列化**
- [ ] **Step 6: Commit**（`feat: add 40-job rating-balance generation script`）

### Task 2: 入库脚本

**Files:**
- Create: `scripts/ingest-rating-balance-40.py`

**Interfaces:**
- Consumes: Task 1 的 `JOBS` 与 `/tmp/anima-rating40-progress.json`、`/tmp/anima-rating40-out/<slug>/`。
- Produces: `src/assets/works/<slug>/01.webp`、`src/content/works/<slug>.md`（frontmatter 含 `rating`、`tier: refined`、`kind: painting`、`experiment: [prompt]`、完整 prompt 元数据）。

- [ ] **Step 1: 写断言测试 `scripts/test-ingest-rating-balance-40.py`**

```python
import importlib.util
from pathlib import Path
p = Path(__file__).parent / "ingest-rating-balance-40.py"
spec = importlib.util.spec_from_file_location("i", p); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def test_yaml_str():
    s = m.yaml_str("abc\"def")
    assert s.startswith('"') and s.endswith('"')

def test_entry_lines_rating_and_tier(tmp_path):
    job = {"slug": "bal40-s01", "title": "T", "tags": ["x"], "scene": "S",
           "character": "c", "prompt": "p", "rating": "sensitive"}
    lines = m.build_entry_lines(job, "bal40-s01")
    assert "rating: sensitive" in lines
    assert "tier: refined" in lines
    assert "kind: painting" in lines
    assert "images:" in lines and "../../assets/works/bal40-s01/01.webp" in lines
```
- [ ] **Step 2: 跑测试确认失败**
- [ ] **Step 3: 实现脚本**：`build_entry_lines(job, slug)->list[str]` 按现有 frontmatter 结构生成；`main()` 仅处理 `state=done` 的任务，优先用 `01-upscaled.png`，调 `node scripts/optimize-image.mjs` 转 WebP；`artists` 按 job 的画师写（无则 `[]`），`negative` 用与生成一致的对应档负面词。
- [ ] **Step 4: 跑测试确认通过**
- [ ] **Step 5: `--dry-run` 用假 staging 校验 40 条目生成无异常**
- [ ] **Step 6: Commit**（`feat: add rating-balance ingest script`）

### Task 3: 启动 ComfyUI 并执行生成、入库与校验

**Files:** 无新增代码（运行 Task 1/2 脚本）。

- [ ] **Step 1: 启动 ComfyUI**：`curl -s -X POST http://172.17.0.1:8191/start`，确认返回 `running:true`；轮询 `http://172.17.0.1:8190/system_stats` 200 即用。失败则停止并报告。
- [ ] **Step 2: 全量生成**：`python3 scripts/generate-rating-balance-40.py --all`，确认进度文件 40 条 `state=done`（失败项记录错误，不强行入库）。
- [ ] **Step 3: 技术校验图片（不读内容）**：`python3 - <<'PY'` 用 PIL 打开每个 `/tmp/anima-rating40-out/<slug>/01-upscaled.png`（或 `01.png`），断言 `size == (1664,2432)` 或原图 `(832,1216)` 且格式 PNG；输出清单。
- [ ] **Step 4: 入库**：`python3 scripts/ingest-rating-balance-40.py`，确认生成 40 个 WebP + 40 个 `.md`。
- [ ] **Step 5: 校验产物**：`pnpm check`（content check 通过）+ `pnpm build`（构建成功）；若失败按报错修复后重跑。
- [ ] **Step 6: 不提交**：`git status` 展示新增文件，留给用户审查。
