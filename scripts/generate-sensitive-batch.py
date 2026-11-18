#!/usr/bin/env python3
"""批量生成 sensitive 分级的 Anima 作品图（ComfyUI API）。

用法：
  python3 scripts/generate-sensitive-batch.py --list
  python3 scripts/generate-sensitive-batch.py --all
  python3 scripts/generate-sensitive-batch.py --slug <slug> [--slug <slug> ...]
  python3 scripts/generate-sensitive-batch.py --status

生成图暂存到 /tmp/anima-sensitive-out/<slug>/，再由 optimize-image 入库。
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

COMFY = os.environ.get("COMFY_URL", "http://172.17.0.1:8190")
CLIENT_ID = "qwind-collectsite-sensitive-batch"
STAGING = Path("/tmp/anima-sensitive-out")
TEMPLATE = Path("public/files/conf/anima/anima-t2i-api.json")
LOG = Path("/tmp/anima-sensitive-progress.json")

# 固定的质量词与负向词，与工作流模板一致
QUALITY = "safe, masterpiece, best quality, year 2025, newest, highres, detailed background"
NEGATIVE = (
    "worst quality, low quality, score_1, score_2, score_3, artist name, blurry, "
    "jpeg artifacts, chromatic aberration, watermark, signature, text, logo, nsfw, "
    "nude, naked, explicit, nipples, areola, panties, see-through, revealing clothes, "
    "child, loli, shota"
)

# 10 组 sensitive（轻微暴露/性感但不露骨）主题。
# 提示词结构：[质量词] [主体] [外观] [服装] [姿势/表情] [场景] [光照] [构图] [风格] [额外 tags]
# rating=sensitive 与 general 的关键差别：泳装/露肩/绝对领域/露腰等轻微暴露元素；
# 负向词仍严格排除 nude/nsfw/child 等，不会越到 nsfw/r18g。
JOBS = [
    {
        "slug": "sensitive-miku-summer",
        "title": "夏日花田的初音未来",
        "tags": ["Anima", "初音未来", "泳装", "夏日"],
        "character": "hatsune miku",
        "scene": "夏日花田 / 天空 / 微风",
        "prompt": (
            f"{QUALITY}, 1girl, solo, hatsune miku \\(vocaloid\\), vocaloid, @askzy, "
            "aqua hair, twin tails, aqua eyes, white and blue bikini, bright smile, "
            "sunlit flower meadow, distant mountains, gentle breeze, soft morning light, "
            "cowboy shot, looking at viewer, lens flare, anime coloring, cel shading"
        ),
        "rating": "sensitive",
        "seed": 520101,
    },
    {
        "slug": "frieren-onsen",
        "title": "温泉边的芙莉莲",
        "tags": ["Anima", "芙莉莲", "温泉", "露肩"],
        "character": "frieren",
        "scene": "露天温泉 / 蒸汽 / 岩石",
        "prompt": (
            f"{QUALITY}, 1girl, solo, frieren \\(sousou no frieren\\), @askzy, "
            "silver hair, long hair, green eyes, elf, bath towel around body, bare shoulders, "
            "gentle expression, outdoor onsen, steam, rocks, warm evening light, "
            "upper body, looking at viewer, anime coloring, cel shading"
        ),
        "seed": 520102,
    },
    {
        "slug": "marin-classroom",
        "title": "教室里的喜多川海梦",
        "tags": ["Anima", "喜多川海梦", "露肩", "教室"],
        "character": "kitagawa marin",
        "scene": "教室 / 窗边 / 午后",
        "prompt": (
            f"{QUALITY}, 1girl, solo, kitagawa marin \\(sono bisque doll\\), @askzy, "
            "long blonde hair, pink tips, red eyes, off-shoulder knit sweater, pleated skirt, "
            "sitting on windowsill, playful smile, sunlit classroom, afternoon light, "
            "cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "seed": 520103,
    },
    {
        "slug": "raiden-shrine",
        "title": "神社台阶的雷电将军",
        "tags": ["Anima", "雷电将军", "露肩", "和风"],
        "character": "raiden shogun",
        "scene": "神社台阶 / 樱花 / 黄昏",
        "prompt": (
            f"{QUALITY}, 1girl, solo, raiden shogun \\(genshin impact\\), @askzy, "
            "long purple hair, braided ponytail, violet eyes, off-shoulder kimono, "
            "bare shoulders, serene expression, standing on shrine steps, falling sakura, "
            "warm sunset light, cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "seed": 520104,
    },
    {
        "slug": "sensitive-furina-poolside",
        "title": "泳池边的芙宁娜",
        "tags": ["Anima", "芙宁娜", "泳装", "夏日"],
        "character": "furina",
        "scene": "泳池边 / 遮阳伞 / 夏日",
        "prompt": (
            f"{QUALITY}, 1girl, solo, furina \\(genshin impact\\), @askzy, "
            "white and blue hair, short hair, blue eyes, striped bikini, straw hat, "
            "cheerful smile, leaning by swimming pool, summer sunlight, water reflection, "
            "cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "rating": "sensitive",
        "seed": 520105,
    },
    {
        "slug": "hutao-night",
        "title": "夜祭中的胡桃",
        "tags": ["Anima", "胡桃", "浴衣", "夜祭"],
        "character": "hu tao",
        "scene": "夜祭 / 灯笼 / 浴衣",
        "prompt": (
            f"{QUALITY}, 1girl, solo, hu tao \\(genshin impact\\), @askzy, "
            "long dark brown hair, red eyes, summer yukata, bare shoulders, "
            "playful grin, holding paper lantern, night festival stalls, warm lantern light, "
            "cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "seed": 520106,
    },
    {
        "slug": "sensitive-takina-gym",
        "title": "训练场的井之上泷奈",
        "tags": ["Anima", "井之上泷奈", "运动", "露腰"],
        "character": "takina ingo",
        "scene": "训练场 / 运动装 / 清晨",
        "prompt": (
            f"{QUALITY}, 1girl, solo, takina ingo \\(lycoris recoil\\), @askzy, "
            "short silver hair, blue eyes, sports bra, midriff, athletic shorts, "
            "determined expression, training gym, morning light, dynamic pose, "
            "cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "rating": "sensitive",
        "seed": 520107,
    },
    {
        "slug": "violet-evening",
        "title": "露台的薇尔莉特",
        "tags": ["Anima", "薇尔莉特", "露肩", "黄昏"],
        "character": "violet evergreen",
        "scene": "露台 / 黄昏 / 连衣裙",
        "prompt": (
            f"{QUALITY}, 1girl, solo, violet evergreen \\(violet evergreen garden\\), @askzy, "
            "long platinum blonde hair, blue eyes, off-shoulder evening dress, bare shoulders, "
            "gentle smile, standing on balcony, golden hour light, distant cityscape, "
            "cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "seed": 520108,
    },
    {
        "slug": "chisato-locker",
        "title": "更衣室的锦木千束",
        "tags": ["Anima", "锦木千束", "运动", "露肩"],
        "character": "chisato nishikigi",
        "scene": "更衣室 / 运动后 / 毛巾",
        "prompt": (
            f"{QUALITY}, 1girl, solo, nishikigi chisato \\(lycoris recoil\\), @askzy, "
            "short blonde hair, green eyes, sports tank top, bare shoulders, "
            "towel around neck, bright smile, locker room, soft indoor light, "
            "upper body, looking at viewer, anime coloring, cel shading"
        ),
        "seed": 520109,
    },
    {
        "slug": "sensitive-fern-river",
        "title": "河畔的菲伦",
        "tags": ["Anima", "菲伦", "泳装", "夏日"],
        "character": "fern",
        "scene": "河畔 / 夏日 / 泳装",
        "prompt": (
            f"{QUALITY}, 1girl, solo, fern \\(sousou no frieren\\), @askzy, "
            "long dark hair, green eyes, modest one-piece swimsuit, bare shoulders, "
            "calm expression, sitting by clear river, summer greenery, dappled sunlight, "
            "cowboy shot, looking at viewer, anime coloring, cel shading"
        ),
        "rating": "sensitive",
        "seed": 520110,
    },
]


def api(path: str, payload: dict | None = None, timeout: int = 60) -> dict:
    url = COMFY + path
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST" if data else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {exc.code} {path}: {body[:800]}") from exc


def build_prompt(job: dict) -> dict:
    graph = json.loads(TEMPLATE.read_text(encoding="utf-8"))
    graph["5"]["inputs"]["text"] = job["prompt"]
    graph["6"]["inputs"]["text"] = NEGATIVE
    graph["8"]["inputs"]["seed"] = job["seed"]
    # 输出文件名前缀带上 slug，便于在 anima 输出目录里区分
    graph["10"]["inputs"]["filename_prefix"] = f"anima/sensitive/{job['slug']}"
    graph["14"]["inputs"]["filename_prefix"] = f"anima/sensitive/{job['slug']}-upscaled"
    return graph


def submit(job: dict) -> str:
    result = api("/prompt", {"prompt": build_prompt(job), "client_id": CLIENT_ID})
    if "prompt_id" not in result:
        raise RuntimeError(f"submit failed: {result}")
    return result["prompt_id"]


def history(prompt_id: str) -> dict | None:
    h = api(f"/history/{prompt_id}")
    return h.get(prompt_id)


def wait_done(prompt_id: str, timeout: int = 900) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        h = history(prompt_id)
        if h and h.get("status", {}).get("completed"):
            status = h["status"]
            messages = status.get("messages") or []
            for m in messages:
                if m[0] == "execution_error":
                    raise RuntimeError(f"execution_error: {m[1]}")
            return h
        time.sleep(5)
    raise TimeoutError(f"prompt {prompt_id} timeout after {timeout}s")


def copy_outputs(job: dict, h: dict) -> list[str]:
    out_dir = STAGING / job["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)
    # ComfyUI 输出目录（launcher 配置）
    comfy_out = Path("/home/qwind/.cache/anima-comfyui/output")
    copied: list[str] = []
    for node in h.get("outputs", {}).values():
        for img in node.get("images", []):
            src = comfy_out / img["subfolder"] / img["filename"] if img.get("subfolder") else comfy_out / img["filename"]
            if not src.exists():
                print(f"  [warn] missing output {src}", file=sys.stderr)
                continue
            # 优先取 upscaled，其次原图；统一命名为 01.png / 01-upscaled.png
            name = "01-upscaled.png" if "upscaled" in img["filename"] else "01.png"
            dst = out_dir / name
            shutil.copy2(src, dst)
            copied.append(str(dst))
    return copied


def load_progress() -> dict:
    if LOG.exists():
        return json.loads(LOG.read_text(encoding="utf-8"))
    return {}


def save_progress(p: dict) -> None:
    LOG.write_text(json.dumps(p, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true", help="列出全部任务")
    ap.add_argument("--all", action="store_true", help="生成全部任务")
    ap.add_argument("--slug", action="append", default=[], help="指定 slug（可重复）")
    ap.add_argument("--status", action="store_true", help="查看进度")
    ap.add_argument("--verify", action="store_true", help="不提交，只用模板校验提示词可序列化")
    args = ap.parse_args()

    if args.list:
        for j in JOBS:
            print(f"{j['slug']:<34} seed={j['seed']}  {j['title']}")
        return
    if args.status:
        p = load_progress()
        for j in JOBS:
            print(f"{j['slug']:<34} {p.get(j['slug'], {}).get('state', 'pending')}")
        return

    selected = JOBS if args.all else [j for j in JOBS if j["slug"] in args.slug]
    if not selected:
        print("未选择任务，使用 --all 或 --slug <slug>", file=sys.stderr)
        sys.exit(1)

    progress = load_progress()
    for job in selected:
        slug = job["slug"]
        print(f"[{slug}] submit seed={job['seed']}")
        try:
            if args.verify:
                graph = build_prompt(job)
                print(f"  verify ok: node5={len(graph['5']['inputs']['text'])} chars, node8 seed={graph['8']['inputs']['seed']}")
                continue
            pid = submit(job)
            print(f"  prompt_id={pid}, waiting...")
            progress[slug] = {"state": "running", "prompt_id": pid}
            save_progress(progress)
            h = wait_done(pid)
            files = copy_outputs(job, h)
            progress[slug] = {"state": "done", "prompt_id": pid, "files": files}
            save_progress(progress)
            print(f"  done -> {files}")
        except Exception as exc:  # noqa: BLE001
            progress[slug] = {"state": "error", "error": str(exc)}
            save_progress(progress)
            print(f"  ERROR: {exc}", file=sys.stderr)


if __name__ == "__main__":
    main()
