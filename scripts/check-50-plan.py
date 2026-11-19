#!/usr/bin/env python3
"""检查 50 张方案的质量与安全。"""
import json, re, sys
from pathlib import Path

p = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/anima-50-jobs.json")
jobs = json.loads(p.read_text(encoding="utf-8"))
for x in [jobs[0], jobs[15], jobs[30], jobs[42]]:
    print(f"=== {x['slug']} [{x['rating']}] ===")
    print("prompt:", x["prompt"][:320])
    print()
bad = [x["slug"] for x in jobs if re.search(r"\b(loli|shota|child|underage|teen)\b", x["prompt"], re.I)]
print("未成年词在正向提示词:", bad or "none")
resid = [x["slug"] for x in jobs if "::" in x["prompt"] or "{" in x["prompt"]]
print("NAI语法残留:", resid or "none")
print("分级:", {r: sum(1 for x in jobs if x["rating"] == r) for r in ("general", "sensitive", "nsfw")})
print("总提示词平均长度:", sum(len(x["prompt"]) for x in jobs) // len(jobs))
