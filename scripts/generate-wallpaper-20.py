#!/usr/bin/env python3
"""批量生成 20 张人物电脑壁纸（横图 16:9、20 步精修、新 LoRA + 画师串）。

ComfyUI: http://172.17.0.1:8190（launcher 按需启动的 headless 实例）
模板: public/files/conf/anima/anima-t2i-api.json
  - 节点 2 = Lora Loader Stack（lora_01=None，lora_02=风格 LoRA）
  - 节点 7 = 1360×768 横图；8 = KSampler 20 步 CFG 4；10/14 = 原图/2× 放大
用法: --list | --verify | --status | --all | --slug SLUG
生成图暂存 /tmp/anima-wp20-out/<slug>/，再由 ingest-wallpaper-20.py 入库。
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMFY = "http://172.17.0.1:8190"
CLIENT_ID = "qwind-collectsite-wallpaper20"
TEMPLATE = ROOT / "public/files/conf/anima/anima-t2i-api.json"
STAGING = Path("/tmp/anima-wp20-out")
LOG = Path("/tmp/anima-wp20-progress.json")

QUALITY = "safe, masterpiece, best quality, year 2025, newest, highres, detailed background, aesthetic, very aesthetic"
BASE_NEGATIVE = (
    "worst quality, low quality, score_1, score_2, score_3, artist name, blurry, "
    "jpeg artifacts, chromatic aberration, watermark, signature, text, logo, "
    "bad hands, extra fingers, bad anatomy, child, loli, shota"
)

# 新下载的两个 LoRA（优先级最高，壁纸质感提升最大）
S1 = "S1_Dramatic Lighting Anima_V2.safetensors"
BOOST = "anima-highres-aesthetic-boost.safetensors"
# 本地风格 LoRA（v2 已验证可用）
LOCAL = {
    "watercolor": "anima-style-watercolor.safetensors",
    "drifters": "anima-style-drifters.safetensors",
    "gpt": "anima-style-gpt-image.safetensors",
    "pixel": "anima-style-pixel.safetensors",
    "chibi": "anima-style-chibi.safetensors",
    "coloring": "anima-style-anime-coloring.safetensors",
    "sketchy": "anima_sketchy.safetensors",
}

# 提示词结构：[质量] [主体] [外观] [服装] [姿势/表情] [场景] [光照] [构图] [风格] [画师]
# 一律 adult；人物壁纸；风格多样、画师串打散；s1_dram 触发新光照 LoRA。
JOBS = [
    {"slug": "wp20-01", "seed": 600101, "lora": S1, "lora_strength": 0.85,
     "title": "雨夜霓虹街头的剑士", "tags": ["原创", "赛博朋克", "壁纸", "雨夜"],
     "character": "original character", "scene": "雨夜霓虹街头 /  reflections",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, silver short hair, cyan eyes, black techwear jacket, standing in a rainy neon city street at night, wet pavement reflections, glowing kanji signs, s1_dram, dramatic rim lighting, cinematic, cowboy shot, from low angle, confident expression, (@guweiz:0.9), (@krenz cushart:0.6), purple and teal palette, highly detailed background"},
    {"slug": "wp20-02", "seed": 600102, "lora": BOOST, "lora_strength": 0.8,
     "title": "晨光花田的少女", "tags": ["原创", "治愈", "壁纸", "花田"],
     "character": "original character", "scene": "晨光花田 / 远山",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long blonde hair, blue eyes, white summer dress, standing in a vast wildflower meadow at sunrise, petals drifting, gentle breeze, distant mountains, warm backlight, lens flare, cowboy shot, gentle smile, (@anmi:0.9), (@rella:0.5), (@askzy:0.4), soft morning light, highly detailed background"},
    {"slug": "wp20-03", "seed": 600103, "lora": S1, "lora_strength": 0.8,
     "title": "月下神社的巫女", "tags": ["原创", "和风", "壁纸", "月夜"],
     "character": "original character", "scene": "月下神社 / 灯笼",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long black hair, red eyes, white and red miko outfit, standing at a moonlit shinto shrine, stone lanterns, autumn leaves, s1_dram, dramatic moonlight and shadow, cowboy shot, serene expression, (@hiten:0.9), (@wanke:0.5), full body, cinematic, highly detailed background"},
    {"slug": "wp20-04", "seed": 600104, "lora": LOCAL["watercolor"], "lora_strength": 0.85,
     "title": "水彩湖畔的侧影", "tags": ["原创", "水彩", "壁纸", "湖畔"],
     "character": "original character", "scene": "湖畔 / 水彩 / 黄昏",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, silver hair, green eyes, light blue dress, sitting by a quiet lake at dusk, watercolor medium, transparent watercolor, soft reflections, willow trees, cowboy shot, from side, calm expression, (@askzy:0.8), (@ciloranko:0.5), painterly, highly detailed background"},
    {"slug": "wp20-05", "seed": 600105, "lora": S1, "lora_strength": 0.9,
     "title": "战场夕阳的铠甲骑士", "tags": ["原创", "奇幻", "壁纸", "战场"],
     "character": "original character", "scene": "夕阳战场 / 旗帜",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long red hair, amber eyes, ornate silver armor, holding a sword, standing on a battlefield at sunset, banners waving, dramatic clouds, s1_dram, cinematic rim light, full body, from low angle, determined expression, (@krenz cushart:0.9), (@fuzichoco:0.5), highly detailed background"},
    {"slug": "wp20-06", "seed": 600106, "lora": BOOST, "lora_strength": 0.8,
     "title": "图书馆窗边的学者", "tags": ["原创", "治愈", "壁纸", "图书馆"],
     "character": "original character", "scene": "古典图书馆 / 窗边",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long brown hair, hazel eyes, elegant blouse, sitting by a window in a grand old library, stacks of books, floating dust motes in warm light, reading, cowboy shot, gentle smile, (@rella:0.9), (@anmi:0.5), highly detailed background"},
    {"slug": "wp20-07", "seed": 600107, "lora": LOCAL["drifters"], "lora_strength": 0.8,
     "title": "废土公路的流浪者", "tags": ["原创", "废土", "壁纸", "公路"],
     "character": "original character", "scene": "废土公路 / 黄昏",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, short silver hair, gray eyes, worn leather jacket, standing on a deserted highway at dusk, abandoned cars, dusty wind, Drifters anime style, cowboy shot, from side, determined expression, (@wanke:0.9), (@hiten:0.5), cinematic, highly detailed background"},
    {"slug": "wp20-08", "seed": 600108, "lora": S1, "lora_strength": 0.85,
     "title": "星空下的占星师", "tags": ["原创", "奇幻", "壁纸", "星空"],
     "character": "original character", "scene": "星空 / 占星台",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long violet hair, golden eyes, dark blue robe, standing on an observatory balcony under a starry sky, glowing constellations, s1_dram, dramatic starlight, cowboy shot, looking up, serene expression, (@fuzichoco:0.9), (@askzy:0.5), highly detailed background"},
    {"slug": "wp20-09", "seed": 600109, "lora": BOOST, "lora_strength": 0.8,
     "title": "樱花树下的和服少女", "tags": ["原创", "和风", "壁纸", "樱花"],
     "character": "original character", "scene": "樱花树下 / 春日",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long pink hair, brown eyes, floral kimono, standing under blooming cherry trees, petals falling, soft spring sunlight, cowboy shot, gentle smile, (@ciloranko:0.9), (@anmi:0.5), highly detailed background"},
    {"slug": "wp20-10", "seed": 600110, "lora": LOCAL["gpt"], "lora_strength": 0.85,
     "title": "未来都市天台的少女", "tags": ["原创", "科幻", "壁纸", "天台"],
     "character": "original character", "scene": "未来都市 / 天台黄昏",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, short cyan hair, blue eyes, white and blue futuristic outfit, standing on a rooftop overlooking a sci-fi city at dusk, glowing windows, flying vehicles, gpt-image-2 style, cowboy shot, calm expression, (@guweiz:0.9), (@krenz cushart:0.5), highly detailed background"},
    {"slug": "wp20-11", "seed": 600111, "lora": S1, "lora_strength": 0.85,
     "title": "深海遗迹的潜水者", "tags": ["原创", "奇幻", "壁纸", "深海"],
     "character": "original character", "scene": "深海遗迹 / 发光水母",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long teal hair, aqua eyes, diving suit, floating inside an underwater ruin, glowing jellyfish, light rays from above, s1_dram, dramatic caustics lighting, cowboy shot, curious expression, (@anmi:0.9), (@rella:0.5), highly detailed background"},
    {"slug": "wp20-12", "seed": 600112, "lora": BOOST, "lora_strength": 0.8,
     "title": "秋日枫林的旅人", "tags": ["原创", "治愈", "壁纸", "秋日"],
     "character": "original character", "scene": "秋日枫林 / 小径",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long auburn hair, green eyes, cozy sweater, walking along a path in an autumn maple forest, fallen leaves, warm golden light, cowboy shot, from behind, peaceful mood, (@askzy:0.9), (@hiten:0.5), highly detailed background"},
    {"slug": "wp20-13", "seed": 600113, "lora": S1, "lora_strength": 0.9,
     "title": "哥特教堂的修女", "tags": ["原创", "哥特", "壁纸", "教堂"],
     "character": "original character", "scene": "哥特教堂 / 彩窗",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long black hair, pale skin, nun habit, standing inside a gothic cathedral, stained glass casting colored light, candles, s1_dram, dramatic lighting and shadow, cowboy shot, solemn expression, (@fuzichoco:0.9), (@wanke:0.5), cinematic, highly detailed background"},
    {"slug": "wp20-14", "seed": 600114, "lora": LOCAL["pixel"], "lora_strength": 0.85,
     "title": "像素风的山间小镇", "tags": ["原创", "像素", "壁纸", "小镇"],
     "character": "original character", "scene": "山间小镇 / 像素黄昏",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, short brown hair, brown eyes, simple travel clothes, standing in a pixel art mountain town at sunset, tiled roofs, warm windows, pixel art, pix_merge, cowboy shot, cheerful expression, (@ciloranko:0.9), (@askzy:0.5), highly detailed background"},
    {"slug": "wp20-15", "seed": 600115, "lora": BOOST, "lora_strength": 0.8,
     "title": "冬日雪原的旅人", "tags": ["原创", "冬日", "壁纸", "雪原"],
     "character": "original character", "scene": "冬日雪原 / 远山",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long white hair, blue eyes, thick winter coat and scarf, standing in a snowy field at dawn, snow-capped mountains, falling snow, breath visible in cold air, cowboy shot, warm smile, (@rella:0.9), (@anmi:0.5), highly detailed background"},
    {"slug": "wp20-16", "seed": 600116, "lora": S1, "lora_strength": 0.85,
     "title": "霓虹和室的剑道少女", "tags": ["原创", "和风", "壁纸", "霓虹"],
     "character": "original character", "scene": "和室 / 霓虹夜色",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long dark hair, red eyes, black dojo uniform, holding a wooden sword in a traditional dojo at night, neon light through paper screens, s1_dram, dramatic neon and shadow, cowboy shot, focused expression, (@hiten:0.9), (@guweiz:0.5), highly detailed background"},
    {"slug": "wp20-17", "seed": 600117, "lora": LOCAL["coloring"], "lora_strength": 0.8,
     "title": "夏日海岸的清凉少女", "tags": ["原创", "夏日", "壁纸", "海岸"],
     "character": "original character", "scene": "夏日海岸 / 蓝天",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long aqua hair, blue eyes, white sundress, standing on a sunny beach, turquoise sea and blue sky, seashells in hand, anime coloring, cel shading, cowboy shot, bright smile, (@askzy:0.9), (@anmi:0.5), highly detailed background"},
    {"slug": "wp20-18", "seed": 600118, "lora": BOOST, "lora_strength": 0.8,
     "title": "蒸汽朋克工坊的技师", "tags": ["原创", "蒸汽朋克", "壁纸", "工坊"],
     "character": "original character", "scene": "蒸汽朋克工坊 / 齿轮",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, short auburn hair, amber eyes, leather goggles and vest, standing in a steampunk workshop, brass gears and pipes, warm lamplight, holding a wrench, cowboy shot, curious expression, (@krenz cushart:0.9), (@wanke:0.5), highly detailed background"},
    {"slug": "wp20-19", "seed": 600119, "lora": LOCAL["sketchy"], "lora_strength": 0.8,
     "title": "铅笔素描的芭蕾舞者", "tags": ["原创", "素描", "壁纸", "芭蕾"],
     "character": "original character", "scene": "素描舞台 / 聚光",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long blonde hair, blue eyes, ballet costume, mid-dance pose on a stage, graphite sketch, cross-hatching, monochrome with accent, dramatic spotlight, full body, graceful expression, (@rella:0.9), (@fuzichoco:0.5), highly detailed background"},
    {"slug": "wp20-20", "seed": 600120, "lora": S1, "lora_strength": 0.85,
     "title": "龙脊雪山之巅的冒险者", "tags": ["原创", "奇幻", "壁纸", "雪山"],
     "character": "original character", "scene": "雪山之巅 / 云海",
     "prompt": QUALITY + ", 1girl, solo, adult, original character, long silver hair, red eyes, fur-lined cloak, standing on a snowy mountain peak above a sea of clouds, dramatic sky, wind blowing cloak, s1_dram, cinematic backlight, full body, from low angle, determined expression, (@guweiz:0.9), (@hiten:0.5), highly detailed background"},
]


def api(path: str, payload: dict | None = None, timeout: int = 60) -> dict:
    url = COMFY + path
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url, data=data,
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
    graph["7"]["inputs"] = {"width": 1360, "height": 768, "batch_size": 1}
    graph["8"]["inputs"]["steps"] = 20
    graph["8"]["inputs"]["cfg"] = 4.0
    graph["8"]["inputs"]["sampler_name"] = "euler_ancestral"
    graph["8"]["inputs"]["scheduler"] = "simple"
    graph["2"]["inputs"]["lora_01"] = "None"
    graph["2"]["inputs"]["lora_02"] = job["lora"]
    graph["2"]["inputs"]["strength_02"] = job["lora_strength"]
    graph["5"]["inputs"]["text"] = job["prompt"]
    graph["6"]["inputs"]["text"] = BASE_NEGATIVE
    graph["8"]["inputs"]["seed"] = job["seed"]
    graph["10"]["inputs"]["filename_prefix"] = f"anima/wp20/{job['slug']}"
    graph["14"]["inputs"]["filename_prefix"] = f"anima/wp20/{job['slug']}-upscaled"
    return graph


def submit(job: dict) -> str:
    result = api("/prompt", {"prompt": build_prompt(job), "client_id": CLIENT_ID})
    if "prompt_id" not in result:
        raise RuntimeError(f"submit failed: {result}")
    return result["prompt_id"]


def history(prompt_id: str) -> dict | None:
    return api(f"/history/{prompt_id}").get(prompt_id)


def wait_done(prompt_id: str, timeout: int = 1800) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        h = history(prompt_id)
        if h and h.get("status", {}).get("completed"):
            for m in h["status"].get("messages") or []:
                if m[0] == "execution_error":
                    raise RuntimeError(f"execution_error: {m[1]}")
            return h
        time.sleep(10)
    raise TimeoutError(f"prompt {prompt_id} timeout after {timeout}s")


def copy_outputs(job: dict, h: dict) -> list[str]:
    out_dir = STAGING / job["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)
    comfy_out = Path("/home/qwind/.cache/anima-comfyui/output")
    copied: list[str] = []
    for node in h.get("outputs", {}).values():
        for img in node.get("images", []):
            src = (
                comfy_out / img["subfolder"] / img["filename"]
                if img.get("subfolder")
                else comfy_out / img["filename"]
            )
            if not src.exists():
                print(f"  [warn] missing output {src}", file=sys.stderr)
                continue
            name = "01-upscaled.png" if "upscaled" in img["filename"] else "01.png"
            dst = out_dir / name
            shutil.copy2(src, dst)
            copied.append(str(dst))
    return copied


def load_progress() -> dict:
    return json.loads(LOG.read_text(encoding="utf-8")) if LOG.exists() else {}


def save_progress(p: dict) -> None:
    LOG.write_text(json.dumps(p, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--slug", action="append", default=[])
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--verify", action="store_true")
    args = ap.parse_args()

    if args.list:
        for j in JOBS:
            print(f"{j['slug']:<10} seed={j['seed']} lora={j['lora'][:28]:28} {j['title']}")
        return
    if args.status:
        p = load_progress()
        for j in JOBS:
            print(f"{j['slug']:<10} {p.get(j['slug'], {}).get('state', 'pending')}")
        return

    if args.all or args.verify:
        selected = JOBS
    elif args.slug:
        selected = [j for j in JOBS if j["slug"] in args.slug]
    else:
        print("未选择任务，使用 --all / --slug <slug> / --verify", file=sys.stderr)
        sys.exit(1)

    if args.verify:
        for j in selected:
            g = build_prompt(j)
            json.dumps(g)
            print(f"  verify ok {j['slug']}: latent 1360x768 steps20 cfg4 lora02={g['2']['inputs']['lora_02']}")
        return

    progress = load_progress()
    for job in selected:
        slug = job["slug"]
        print(f"[{slug}] submit lora={job['lora'][:24]} seed={job['seed']}", flush=True)
        try:
            pid = submit(job)
            progress[slug] = {"state": "running", "prompt_id": pid}
            save_progress(progress)
            h = wait_done(pid)
            files = copy_outputs(job, h)
            progress[slug] = {"state": "done", "prompt_id": pid, "files": files}
            save_progress(progress)
            print(f"  done -> {files}", flush=True)
        except Exception as exc:  # noqa: BLE001
            progress[slug] = {"state": "error", "error": str(exc)}
            save_progress(progress)
            print(f"  ERROR: {exc}", file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
