#!/usr/bin/env python3
"""把未放大的粗图（experiment=[prompt,lora] 且图片宽度<=1300）从 refined 降为 sketch。

用 sharp 读图片元数据判断尺寸，不读图像内容。
"""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORKS = ROOT / "src/content/works"

# 脚本用 node 读图片尺寸（复用项目 sharp），输出 slug<TAB>width
PROBE = r"""
const sharp=require('sharp');const fs=require('fs');const path=require('path');
const dir=process.argv[2];
(async()=>{
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md'))){
    const md=fs.readFileSync(path.join(dir,f),'utf8');
    if(!/^experiment:\s*\[prompt, lora\]/m.test(md))continue;
    const im=/^images:\s*\n\s*-\s*(\S+)/m.exec(md);if(!im)continue;
    const p=path.resolve(dir,im[1]);if(!fs.existsSync(p))continue;
    const d=await sharp(p).metadata();
    console.log(f.slice(0,-3)+'\t'+d.width);
  }
})();
"""


def main():
    probe = ROOT / "scripts/.tier-probe.cjs"
    probe.write_text(PROBE, encoding="utf-8")
    try:
        out = subprocess.run(["node", str(probe), str(WORKS)], capture_output=True, text=True, check=True).stdout
    finally:
        probe.unlink(missing_ok=True)

    changed, skipped = [], []
    for line in out.strip().splitlines():
        slug, w = line.split("\t")
        if int(w) > 1300:
            skipped.append(slug)
            continue
        md = WORKS / f"{slug}.md"
        text = md.read_text(encoding="utf-8")
        if not re.search(r"^tier: refined$", text, re.M):
            continue
        new = re.sub(r"^tier: refined$", "tier: sketch", text, count=1, flags=re.M)
        md.write_text(new, encoding="utf-8")
        changed.append(slug)

    print(f"降为 sketch: {len(changed)} 张")
    print(f"跳过（放大版，保留 refined）: {len(skipped)} 张 -> {skipped}")
    print("样例:", changed[:8])


if __name__ == "__main__":
    main()
