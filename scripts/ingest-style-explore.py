#!/usr/bin/env python3
"""把 style-explore 的 1/2/3/6/8 号图入库：转 webp + 写作品条目。"""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path("/home/qwind/ComfyUI-Installs/ComfyUI/ComfyUI/output/anima/style-explore")
TEMPLATE = ROOT / "public/files/conf/anima/anima-t2i-api.json"
Q = "safe, masterpiece, best quality, year 2025, newest, highres, detailed background, "

negative = json.loads(TEMPLATE.read_text(encoding="utf-8"))["6"]["inputs"]["text"]

ENTRIES = [
    dict(img="01-chibi-hill", slug="anima-style-chibi-hill",
         title="Anima 画风实验 · Chibi 萌系（草坡）",
         summary="Chibi LoRA：草坡上的萌系少女，平涂大头身。",
         tags=["Anima", "画风实验", "Chibi", "LoRA"],
         style="Chibi", scene="草坡 / 蒲公英 / 花丛", character="",
         positive="1girl, solo, chibi, no lineart, cute, sitting on a grassy hill, sunny day, wildflowers, gentle smile, holding a dandelion, wide shot"),
    dict(img="02-chibi-cafe", slug="anima-style-chibi-cafe",
         title="Anima 画风实验 · Chibi 萌系（咖啡馆）",
         summary="Chibi LoRA：咖啡馆里的两位萌系角色。",
         tags=["Anima", "画风实验", "Chibi", "LoRA"],
         style="Chibi", scene="咖啡馆 / 甜点 / 暖光", character="",
         positive="1boy, 1girl, chibi, no lineart, two friends at a cafe table, pastries and coffee, warm afternoon light, laughing, upper body"),
    dict(img="03-watercolor-cat", slug="anima-style-watercolor-cat",
         title="Anima 画风实验 · 透明水彩（窗台猫）",
         summary="透明水彩 LoRA：窗台午睡的猫与绿植。",
         tags=["Anima", "画风实验", "水彩", "LoRA"],
         style="透明水彩", scene="窗台 / 猫 / 绿植 / 晨光", character="",
         positive="watercolor \\(medium\\), transparent_watercolor, a fluffy cat sleeping on a windowsill, soft morning light, potted plants, cozy room, still life"),
    dict(img="06-pixel-knight", slug="anima-style-pixel-knight",
         title="Anima 画风实验 · 像素风（森林骑士）",
         summary="像素风 LoRA：暗色森林里执剑的骑士，发光蘑菇。",
         tags=["Anima", "画风实验", "像素", "LoRA"],
         style="像素风", scene="暗色森林 / 骑士 / 发光蘑菇", character="",
         positive="pixel art, pix_merge, a knight with a sword in a dark forest, glowing mushrooms, adventure, side view"),
    dict(img="08-gpt-library", slug="anima-style-gpt-library",
         title="Anima 画风实验 · gpt-image-2（巨型图书馆）",
         summary="gpt-image-2 风格 LoRA：巨型古籍图书馆，光束与浮尘。",
         tags=["Anima", "画风实验", "gpt-image-2", "LoRA", "场景"],
         style="gpt-image-2", scene="巨型图书馆 / 光束 / 漂浮的书", character="",
         positive="@gpt-image-2, a vast ancient library, floating books, warm light beams, dust motes, fantasy, no humans"),
]

q = lambda s: json.dumps(s, ensure_ascii=False)


def main():
    for e in ENTRIES:
        slug = e["slug"]
        src = SRC / f"{e['img']}_00001_.png"
        if not src.exists():
            print(f"[{slug}] 缺图 {src}, skip")
            continue
        asset = ROOT / "src/assets/works" / slug / "01.webp"
        asset.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["node", "scripts/optimize-image.mjs", str(src), str(asset)],
                       cwd=ROOT, check=True)
        model = f"Anima Aesthetic v1.1 + {e['style']} LoRA"
        lines = [
            "---",
            f"title: {q(e['title'])}",
            f"slug: {slug}",
            f"summary: {q(e['summary'])}",
            "tags: [" + ", ".join(q(t) for t in e["tags"]) + "]",
            "createdAt: 2026-11-20",
            "kind: painting",
            "tier: sketch",
            "experiment: [prompt, lora]",
            "artists: []",
            "images:",
            f"  - ../../assets/works/{slug}/01.webp",
            "prompt:",
            f"  positive: {q(Q + e['positive'])}",
            f"  negative: {q(negative)}",
            f"  artist: \"\"",
            f"  character: {q(e['character'])}",
            f"  scene: {q(e['scene'])}",
            f"  model: {q(model)}",
            "rating: general",
            "---",
            "",
        ]
        entry = ROOT / "src/content/works" / f"{slug}.md"
        entry.write_text("\n".join(lines), encoding="utf-8")
        print(f"[{slug}] -> rating: general, model: {model}")


if __name__ == "__main__":
    main()
