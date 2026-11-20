#!/usr/bin/env python3
"""探索 6 种画风 LoRA，生成 10 张 general 图。

ComfyUI: http://127.0.0.1:8188
模板: public/files/conf/anima/anima-t2i-api.json
  - 节点 2 = Lora Loader Stack（lora_01=turbo，lora_02=画风）
  - 节点 5/6 = 正/负提示词，8 = KSampler，10 = SaveImage
用法: python3 scripts/generate-style-explore.py --list | --only SLUG | --all
"""
import argparse
import copy
import json
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMFY = "http://127.0.0.1:8188"
TEMPLATE = ROOT / "public/files/conf/anima/anima-t2i-api.json"
CLIENT_ID = "qwind-style-explore"
OUT_DIR = Path("/home/qwind/ComfyUI-Installs/ComfyUI/ComfyUI/output/anima/style-explore")
QUALITY = "safe, masterpiece, best quality, year 2025, newest, highres, detailed background, "

JOBS = [
    {"slug": "01-chibi-hill", "style": "Chibi 萌系", "lora": "anima-style-chibi.safetensors", "strength": 0.9, "seed": 100001,
     "prompt": "1girl, solo, chibi, no lineart, cute, sitting on a grassy hill, sunny day, wildflowers, gentle smile, holding a dandelion, wide shot"},
    {"slug": "02-chibi-cafe", "style": "Chibi 萌系", "lora": "anima-style-chibi.safetensors", "strength": 0.85, "seed": 100002,
     "prompt": "1boy, 1girl, chibi, no lineart, two friends at a cafe table, pastries and coffee, warm afternoon light, laughing, upper body"},
    {"slug": "03-watercolor-cat", "style": "透明水彩", "lora": "anima-style-watercolor.safetensors", "strength": 0.9, "seed": 100003,
     "prompt": "watercolor \\(medium\\), transparent_watercolor, a fluffy cat sleeping on a windowsill, soft morning light, potted plants, cozy room, still life"},
    {"slug": "04-watercolor-sakura", "style": "透明水彩", "lora": "anima-style-watercolor.safetensors", "strength": 0.85, "seed": 100004,
     "prompt": "watercolor \\(medium\\), transparent_watercolor, 1girl, solo, walking under cherry blossoms, petals falling, gentle smile, spring, scenic"},
    {"slug": "05-pixel-village", "style": "像素风", "lora": "anima-style-pixel.safetensors", "strength": 0.9, "seed": 100005,
     "prompt": "pixel art, pix_merge, a small fantasy village at sunset, mountains, river, 16-bit, retro game, landscape"},
    {"slug": "06-pixel-knight", "style": "像素风", "lora": "anima-style-pixel.safetensors", "strength": 0.85, "seed": 100006,
     "prompt": "pixel art, pix_merge, a knight with a sword in a dark forest, glowing mushrooms, adventure, side view"},
    {"slug": "07-flat-rooftop", "style": "动画平涂", "lora": "anima-style-anime-coloring.safetensors", "strength": 0.8, "seed": 100007,
     "prompt": "1girl, solo, headphones, sitting on a rooftop, city skyline at dusk, glowing windows, calm mood, from behind"},
    {"slug": "08-gpt-library", "style": "gpt-image-2 风格", "lora": "anima-style-gpt-image.safetensors", "strength": 0.85, "seed": 100008,
     "prompt": "@gpt-image-2, a vast ancient library, floating books, warm light beams, dust motes, fantasy, no humans"},
    {"slug": "09-drifters-warrior", "style": "Drifters 动画风", "lora": "anima-style-drifters.safetensors", "strength": 0.85, "seed": 100009,
     "prompt": "Drifters Anime Style, a lone warrior standing on a battlefield, banners, dramatic clouds, epic, wide shot"},
    {"slug": "10-base-library", "style": "底模对照(无风格LoRA)", "lora": "None", "strength": 1.0, "seed": 100010,
     "prompt": "1girl, solo, reading a book in a cozy library, warm lamp light, plants, detailed"},
]


def api(path, payload=None, timeout=120):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(COMFY + path, data=data,
                                 headers={"Content-Type": "application/json"},
                                 method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def build_graph(job):
    g = json.loads(TEMPLATE.read_text(encoding="utf-8"))
    assert g["2"]["class_type"] == "Lora Loader Stack (rgthree)", g["2"]["class_type"]
    g["2"]["inputs"]["lora_01"] = "anima-turbo-lora-v0.2.safetensors"
    g["2"]["inputs"]["strength_01"] = 1.0
    g["2"]["inputs"]["lora_02"] = job["lora"]
    g["2"]["inputs"]["strength_02"] = job["strength"]
    g["5"]["inputs"]["text"] = QUALITY + job["prompt"]
    g["8"]["inputs"]["seed"] = job["seed"]
    g["10"]["inputs"]["filename_prefix"] = f"anima/style-explore/{job['slug']}"
    # 去掉 2× 放大分支，只出基础图，加快速度
    for k in ("11", "12", "13", "14"):
        g.pop(k, None)
    return g


def wait(pid, timeout=600):
    end = time.time() + timeout
    while time.time() < end:
        h = api(f"/history/{pid}")
        if pid in h:
            st = h[pid].get("status", {})
            if st.get("completed"):
                for m in st.get("messages") or []:
                    if m[0] == "execution_error":
                        raise RuntimeError(str(m[1])[:400])
                return h[pid]
        time.sleep(4)
    raise TimeoutError(pid)


def run(job):
    print(f"[{job['slug']}] {job['style']} @ {job['strength']} ...", flush=True)
    t0 = time.time()
    pid = api("/prompt", {"prompt": build_graph(job), "client_id": CLIENT_ID})["prompt_id"]
    h = wait(pid)
    imgs = (h.get("outputs", {}).get("10", {}) or {}).get("images", [])
    print(f"  完成 {time.time()-t0:.1f}s -> {[i['filename'] for i in imgs]}", flush=True)
    return imgs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--only")
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    if a.list:
        for j in JOBS:
            print(f"{j['slug']:<18} {j['style']:<20} {j['lora']} @{j['strength']}")
        return
    if a.only:
        run(next(j for j in JOBS if j["slug"] == a.only))
    elif a.all:
        for j in JOBS:
            run(j)
        print("全部完成，输出目录:", OUT_DIR)
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
