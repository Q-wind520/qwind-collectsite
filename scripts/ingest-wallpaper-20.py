#!/usr/bin/env python3
"""把 staging 的壁纸生图压成 WebP 并写入 works 条目（20 张人物电脑壁纸）。

前置：generate-wallpaper-20.py 已把图放到 /tmp/anima-wp20-out/<slug>/。
产物：
  src/assets/works/<slug>/01.webp
  src/content/works/<slug>.md  （rating general、tier refined、experiment [lora]、完整元数据）
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
_gen_spec = importlib.util.spec_from_file_location(
    "genwp", Path(__file__).resolve().parent / "generate-wallpaper-20.py"
)
_gen = importlib.util.module_from_spec(_gen_spec)
_gen_spec.loader.exec_module(_gen)
JOBS = _gen.JOBS

STAGING = Path("/tmp/anima-wp20-out")
PROGRESS = Path("/tmp/anima-wp20-progress.json")


def yaml_str(s: str) -> str:
    """用 JSON 引号做 YAML 双引号字符串（与站内 new-entry.ts 一致）。"""
    return json.dumps(s, ensure_ascii=False)


def build_entry_lines(job: dict, slug: str) -> list[str]:
    tags = list(dict.fromkeys(["Anima", "壁纸", "原创"] + job["tags"]))
    lora = job["lora"]
    model = "Anima Aesthetic v1.1 + 20步精修 + " + lora.replace(".safetensors", "")
    lines = [
        "---",
        f"title: {yaml_str(job['title'])}",
        f"slug: {slug}",
        "summary: " + yaml_str("Anima 20 步精修人物壁纸：" + job["scene"]),
        "tags: [" + ", ".join(yaml_str(t) for t in tags) + "]",
        "createdAt: 2026-11-26",
        "kind: painting",
        "tier: refined",
        "experiment: [lora]",
        "artists: []",
        "images:",
        f"  - ../../assets/works/{slug}/01.webp",
        "prompt:",
        f"  positive: {yaml_str(job['prompt'])}",
        "  negative: " + yaml_str(_gen.BASE_NEGATIVE),
        '  artist: ""',
        f"  character: {yaml_str(job['character'])}",
        f"  scene: {yaml_str(job['scene'])}",
        f"  model: {yaml_str(model)}",
        "rating: general",
        "---",
        "",
    ]
    return lines


def ingest_one(job: dict, *, dry_run: bool = False) -> bool:
    slug = job["slug"]
    src = STAGING / slug / "01.png"
    upscaled = STAGING / slug / "01-upscaled.png"
    pick = upscaled if upscaled.exists() else src
    if not dry_run and not pick.exists():
        print(f"[{slug}] skip (no image)")
        return False

    if dry_run:
        lines = build_entry_lines(job, slug)
        rating = next(ln for ln in lines if ln.startswith("rating:"))
        print(f"[{slug}] dry-run ok: {len(lines)} lines, {rating}, src={pick.name}")
        return True

    asset = ROOT / "src/assets/works" / slug / "01.webp"
    asset.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["node", "scripts/optimize-image.mjs", str(pick), str(asset)],
        cwd=ROOT, check=True,
    )
    entry = ROOT / "src/content/works" / f"{slug}.md"
    entry.write_text("\n".join(build_entry_lines(job, slug)), encoding="utf-8")
    print(f"[{slug}] ingested -> {entry.relative_to(ROOT)}")
    return True


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.dry_run:
        print("DRY RUN — checking entry generation (no files written)")
        ok = sum(1 for j in JOBS if ingest_one(j, dry_run=True))
        print(f"dry-run: {ok}/{len(JOBS)} entries would be generated")
        return

    progress = json.loads(PROGRESS.read_text(encoding="utf-8")) if PROGRESS.exists() else {}
    done = 0
    for job in JOBS:
        state = progress.get(job["slug"], {}).get("state")
        if state != "done":
            print(f"[{job['slug']}] skip (state={state})")
            continue
        if ingest_one(job):
            done += 1
    print(f"ingested {done}/{len(JOBS)} works")


if __name__ == "__main__":
    main()
