#!/usr/bin/env python3
"""把 staging 的生图压成 WebP 并写入 works 内容条目（40 张 rating 补齐）。

前置：generate-rating-balance-40.py 已把图放到 /tmp/anima-rating40-out/<slug>/。
产物：
  src/assets/works/<slug>/01.webp
  src/content/works/<slug>.md    （rating 与生图一致，含完整提示词元数据）

负面词直接复用生图脚本的 negative_for(rating)，确保记录与实际生成一致。
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
_gen_spec = importlib.util.spec_from_file_location(
    "gen40", Path(__file__).resolve().parent / "generate-rating-balance-40.py"
)
_gen = importlib.util.module_from_spec(_gen_spec)
_gen_spec.loader.exec_module(_gen)
JOBS = _gen.JOBS
negative_for = _gen.negative_for

STAGING = Path("/tmp/anima-rating40-out")
PROGRESS = Path("/tmp/anima-rating40-progress.json")


def yaml_str(s: str) -> str:
    """用 JSON 引号做 YAML 双引号字符串（与站内 new-entry.ts 一致）。"""
    return json.dumps(s, ensure_ascii=False)


def build_entry_lines(job: dict, slug: str) -> list[str]:
    rating = job["rating"]
    tags = ["Anima", "精细"] + job["tags"]
    artist = job.get("artist", "")
    artists_line = f"artists: [{artist}]" if artist else "artists: []"
    artist_prompt = f"@{artist}" if artist else ""
    lines = [
        "---",
        f"title: {yaml_str(job['title'])}",
        f"slug: {slug}",
        "summary: " + yaml_str("Anima Aesthetic v1.1 + Turbo LoRA 精细绘制：" + job["scene"]),
        "tags: [" + ", ".join(yaml_str(t) for t in tags) + "]",
        "createdAt: 2026-11-21",
        "kind: painting",
        "tier: refined",
        "experiment: [prompt]",
        artists_line,
        "images:",
        f"  - ../../assets/works/{slug}/01.webp",
        "prompt:",
        f"  positive: {yaml_str(job['prompt'])}",
        f"  negative: {yaml_str(negative_for(rating))}",
        f"  artist: {yaml_str(artist_prompt)}",
        f"  character: {yaml_str(job['character'])}",
        f"  scene: {yaml_str(job['scene'])}",
        '  model: "Anima Aesthetic v1.1 + Turbo LoRA"',
        f"rating: {rating}",
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
    ap.add_argument("--dry-run", action="store_true", help="用假 staging 校验条目生成，不写文件")
    args = ap.parse_args()

    if args.dry_run:
        print("DRY RUN — checking entry generation from job definitions (no files written)")
        ok = sum(1 for j in JOBS if ingest_one(j, dry_run=True))
        print(f"dry-run: {ok}/{len(JOBS)} entries would be generated")
        return

    progress = json.loads(PROGRESS.read_text(encoding="utf-8")) if PROGRESS.exists() else {}
    done = 0
    for job in JOBS:
        slug = job["slug"]
        state = progress.get(slug, {}).get("state")
        if state != "done":
            print(f"[{slug}] skip (state={state})")
            continue
        if ingest_one(job):
            done += 1
    print(f"ingested {done}/{len(JOBS)} works")


if __name__ == "__main__":
    main()
