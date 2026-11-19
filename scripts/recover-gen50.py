#!/usr/bin/env python3
"""从 ComfyUI 输出目录回收已生成但脚本误判为丢失的图片。

扫描 anima/gen50/ 下的 png，按 slug 匹配，复制到 staging 并把进度标记为 done。
"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path("/home/qwind/.cache/anima-comfyui/output/anima/gen50")
STAGING = ROOT / ".gen50-staging"
PROGRESS = ROOT / "scripts/.gen50-progress.json"
PLAN = ROOT / "scripts/.anima-50-jobs.json"

def main():
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    progress = json.loads(PROGRESS.read_text(encoding="utf-8")) if PROGRESS.exists() else {}
    slugs = {j["slug"] for j in plan}
    recovered = []
    for slug in slugs:
        imgs = sorted(OUT.glob(f"{slug}*.png"))
        if not imgs:
            continue
        d = STAGING / slug
        d.mkdir(parents=True, exist_ok=True)
        for img in imgs:
            if "upscaled" in img.name:
                dst = d / "01-upscaled.png"
            else:
                dst = d / "01.png"
            shutil.copy2(img, dst)
        # 只有原图和放大图都在才算完整
        if (d / "01-upscaled.png").exists() and (d / "01.png").exists():
            if progress.get(slug, {}).get("state") != "done":
                recovered.append(slug)
            progress[slug] = {"state": "done", "recovered": True,
                              "files": [str(d / "01.png"), str(d / "01-upscaled.png")],
                              "rating": next(j["rating"] for j in plan if j["slug"] == slug)}
    PROGRESS.write_text(json.dumps(progress, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"recovered {len(recovered)}: {recovered}")
    from collections import Counter
    print("tally:", Counter(v["state"] for v in progress.values()))

if __name__ == "__main__":
    main()
