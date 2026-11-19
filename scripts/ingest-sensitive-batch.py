#!/usr/bin/env python3
"""把 staging 的生图压成 WebP 并写入 works 内容条目。

前置：generate-sensitive-batch.py 已把图放到 /tmp/anima-sensitive-out/<slug>/。
产物：
  src/assets/works/<slug>/01.webp    （由 sharp optimize-image 压缩）
  src/content/works/<slug>.md        （rating 按 job.rating，含完整提示词元数据）
"""

from __future__ import annotations

import importlib.util
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location(
    "gen_batch", Path(__file__).resolve().parent / "generate-sensitive-batch.py"
)
_gen = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_gen)
JOBS = _gen.JOBS

STAGING = Path("/tmp/anima-sensitive-out")
PROGRESS = Path("/tmp/anima-sensitive-progress.json")


def yaml_str(s: str) -> str:
    """用 JSON 引号做 YAML 双引号字符串（与站内 new-entry.ts 一致）。"""
    return json.dumps(s, ensure_ascii=False)


def main() -> None:
    progress = json.loads(PROGRESS.read_text(encoding="utf-8")) if PROGRESS.exists() else {}
    for job in JOBS:
        slug = job["slug"]
        state = progress.get(slug, {}).get("state")
        if state != "done":
            print(f"[{slug}] skip (state={state})")
            continue

        src = STAGING / slug / "01.png"
        upscaled = STAGING / slug / "01-upscaled.png"
        # 优先用 2× 放大图作为展示图源，细节更完整；optimize-image 会缩到 2400px 内
        pick = upscaled if upscaled.exists() else src
        if not pick.exists():
            print(f"[{slug}] skip (no image)")
            continue

        asset = ROOT / "src/assets/works" / slug / "01.webp"
        asset.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["node", "scripts/optimize-image.mjs", str(pick), str(asset)],
            cwd=ROOT, check=True,
        )

        tags = ["Anima"] + job["tags"]
        lines = [
            "---",
            f"title: {yaml_str(job['title'])}",
            f"slug: {slug}",
            f"summary: {yaml_str('Anima Aesthetic v1.1 + Turbo LoRA 生成的作品：' + job['scene'])}",
            "tags: [" + ", ".join(yaml_str(t) for t in tags) + "]",
            "createdAt: 2026-11-18",
            "kind: painting",
            "tier: refined",
            "experiment: [prompt]",
            "artists: [askzy]",
            "images:",
            f"  - ../../assets/works/{slug}/01.webp",
            "prompt:",
            f"  positive: {yaml_str(job['prompt'])}",
            "# 负向词与工作流模板一致",
            "  negative: \"worst quality, low quality, score_1, score_2, score_3, artist name, blurry, jpeg artifacts, chromatic aberration, watermark, signature, text, logo, nsfw, nude, naked, explicit, nipples, areola, panties, see-through, revealing clothes, child, loli, shota\"",
            "  artist: \"@askzy\"",
            f"  character: {yaml_str(job['character'])}",
            f"  scene: {yaml_str(job['scene'])}",
            "  model: \"Anima Aesthetic v1.1 + Turbo LoRA\"",
            f"rating: {job.get('rating', 'general')}",
            "---",
            "",
        ]
        entry = ROOT / "src/content/works" / f"{slug}.md"
        entry.write_text("\n".join(lines), encoding="utf-8")
        print(f"[{slug}] ingested -> {entry.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
