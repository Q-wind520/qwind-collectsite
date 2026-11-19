#!/usr/bin/env python3
"""把已生成的 50 张图压 WebP 并写作品条目（按方案的分级/提示词）。

读 scripts/.anima-50-jobs.json + scripts/.gen50-progress.json，
产物 src/assets/works/<slug>/01.webp + src/content/works/<slug>.md
"""
from __future__ import annotations

import importlib.util
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAN = ROOT / "scripts/.anima-50-jobs.json"
PROGRESS = ROOT / "scripts/.gen50-progress.json"
STAGING = ROOT / ".gen50-staging"

def main():
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    progress = json.loads(PROGRESS.read_text(encoding="utf-8")) if PROGRESS.exists() else {}
    count = 0
    for job in plan:
        slug = job["slug"]
        if progress.get(slug, {}).get("state") != "done":
            continue
        src = STAGING / slug / "01-upscaled.png"
        if not src.exists():
            src = STAGING / slug / "01.png"
        if not src.exists():
            print(f"[{slug}] no image, skip"); continue
        asset = ROOT / "src/assets/works" / slug / "01.webp"
        asset.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["node", "scripts/optimize-image.mjs", str(src), str(asset)],
                       cwd=ROOT, check=True)

        q = lambda s: json.dumps(s, ensure_ascii=False)
        tags = job["tags"]
        artist_slug = job["artist"].lstrip("@").replace(" ", "-")
        lines = [
            "---",
            f"title: {q(job['title'])}",
            f"slug: {slug}",
            f"summary: {q('Anima Aesthetic v1.1 + Turbo LoRA 精细绘制：' + job['scene'])}",
            "tags: [" + ", ".join(q(t) for t in tags) + "]",
            "createdAt: 2026-11-18",
            "kind: painting", "tier: refined", "experiment: [prompt]",
            f"artists: [{artist_slug}]",
            "images:", f"  - ../../assets/works/{slug}/01.webp",
            "prompt:",
            f"  positive: {q(job['prompt'])}",
            f"  negative: {q(job['negative'])}",
            f"  artist: {q(job['artist'])}",
            f"  character: {q(job['character'])}",
            f"  scene: {q(job['scene'])}",
            "  model: \"Anima Aesthetic v1.1 + Turbo LoRA\"",
            f"rating: {job['rating']}",
            "---", "",
        ]
        entry = ROOT / "src/content/works" / f"{slug}.md"
        entry.write_text("\n".join(lines), encoding="utf-8")
        count += 1
        print(f"[{slug}] -> {job['rating']}")
    print(f"ingested {count} works")

if __name__ == "__main__":
    main()
