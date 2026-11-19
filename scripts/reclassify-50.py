#!/usr/bin/env python3
"""一次性重分级：按 Civitai / 社交平台通行标准重新标定 50 张作品。

标准：
  general   —— 日常/风景/穿着整齐；泳装、露肩、薄纱、运动装、浴巾等社交平台可直接公开发布
  sensitive —— 明确性暗示着装（lingerie / bra & panties / negligee / garter belt / corset /
                sheer nightie 等），Softcore / Ecchi / Suggestive 范畴，但无露点、无露骨行为
  nsfw      —— 真正露点 / 露骨性行为 / 性器官展示（本项目不生成）

变更：原 sensitive 12 张 -> general；原 nsfw 8 张 -> sensitive；nsfw 清空。
同时清洗 tags 中的「敏感」「NSFW」字样，并同步方案脚本与素材库说明。
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAN = ROOT / "scripts/.anima-50-jobs.json"
PROGRESS = ROOT / "scripts/.gen50-progress.json"
LIB = ROOT / "docs/anima-prompt-library.md"
BUILDER = ROOT / "scripts/build-50-plan.py"

NEW_RATING = {
    **{f"gen50-g{i:02d}": "general" for i in range(1, 31)},
    **{f"gen50-s{i:02d}": "general" for i in range(1, 13)},
    **{f"gen50-n{i:02d}": "sensitive" for i in range(1, 9)},
}


def main():
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    changed = []
    for job in plan:
        slug = job["slug"]
        old = job["rating"]
        new = NEW_RATING[slug]
        job["rating"] = new
        job["tags"] = [t for t in job["tags"] if t not in ("敏感", "NSFW", "nsfw")]
        if old != new or "敏感" in job["tags"] or "NSFW" in job["tags"]:
            changed.append((slug, old, new))
    PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if PROGRESS.exists():
        prog = json.loads(PROGRESS.read_text(encoding="utf-8"))
        for slug, new in NEW_RATING.items():
            if slug in prog:
                prog[slug]["rating"] = new
        PROGRESS.write_text(json.dumps(prog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # 素材库分配说明
    lib = LIB.read_text(encoding="utf-8")
    lib = re.sub(
        r"- 分级：\*\*general 30 / sensitive 12 / nsfw 8\*\*，无 r18g（用户明确不要重口，原 r18g 的 2 张并入 nsfw）。",
        "- 分级（2026-11-19 按 Civitai / 社交平台通行标准重定）：**general 42 / sensitive 8 / nsfw 0**，无 r18g。\n"
        "  - general：日常/风景/穿着整齐；泳装、露肩、薄纱、运动装、浴巾等社交平台可直接公开发布的内容。\n"
        "  - sensitive：明确性暗示着装（lingerie / negligee / garter belt / corset 等），Softcore / Ecchi / Suggestive 范畴，无露点、无露骨行为。\n"
        "  - nsfw：真正露点 / 露骨性行为 / 性器官展示；本项目不生成此类内容。",
        lib,
    )
    LIB.write_text(lib, encoding="utf-8")

    # 方案生成脚本：避免下次重跑把旧分级带回来
    b = BUILDER.read_text(encoding="utf-8")
    b = b.replace('mk(f"gen50-s{i+1:02d}", f"{char} · {sc[0]}", "sensitive",\n           ["Anima","精细","敏感",sc[0][:12]]',
                  'mk(f"gen50-s{i+1:02d}", f"{char} · {sc[0]}", "general",\n           ["Anima","精细",sc[0][:12]]')
    b = b.replace('mk(f"gen50-n{i+1:02d}", f"{char} · 私密写真 {i+1}", "nsfw",\n           ["Anima","精细","NSFW"]',
                  'mk(f"gen50-n{i+1:02d}", f"{char} · 私密写真 {i+1}", "sensitive",\n           ["Anima","精细"]')
    BUILDER.write_text(b, encoding="utf-8")

    from collections import Counter
    print("reclassified:", len(changed))
    for slug, old, new in changed:
        print(f"  {slug}: {old} -> {new}")
    print("new distribution:", dict(Counter(j["rating"] for j in plan)))


if __name__ == "__main__":
    main()
