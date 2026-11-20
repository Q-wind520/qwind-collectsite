#!/usr/bin/env python3
"""回归测试：anima-t2i 与 anima-refine 必须使用标准控件的 Lora Loader Stack (rgthree)。

判定标准（每个工作流）：
  - 存在 1 个 `Lora Loader Stack (rgthree)` 节点
  - lora_01 预置 turbo
  - 该节点 MODEL 输出接入 KSampler.model，CLIP 输出接入所有 CLIPTextEncode.clip

运行：python3 scripts/check-anima-lora-stack.py
"""
import json
import sys

COMFY = "/home/qwind/ComfyUI-Installs/ComfyUI/ComfyUI/user/default/workflows"
UI_FILES = [
    (f"{COMFY}/anima-t2i.app.json", "应用 t2i"),
    ("public/files/conf/anima/anima-t2i.json", "节点图 t2i"),
    (f"{COMFY}/anima-refine.json", "应用 refine"),
    ("public/files/conf/anima/anima-refine.json", "节点图 refine"),
]
API_FILES = [
    ("public/files/conf/anima/anima-t2i-api.json", "API t2i"),
    ("public/files/conf/anima/anima-refine-api.json", "API refine"),
]
NODE_TYPE = "Lora Loader Stack (rgthree)"
failures = []


def check_ui(path, label):
    d = json.load(open(path))
    nodes = d.get("nodes", [])

    def link_src(link_id):
        for l in d.get("links", []):
            if l[0] == link_id:
                return l[1], l[2]
        return None, None

    def in_src(node, name):
        for i in (node.get("inputs") or []):
            if i.get("name") == name:
                return link_src(i.get("link"))
        return None, None

    stacks = [n for n in nodes if n.get("type") == NODE_TYPE]
    if len(stacks) != 1:
        failures.append(f"{label}: 期望 1 个 Lora Loader Stack，实际 {len(stacks)}")
        return
    st = stacks[0]
    sid = st["id"]

    wv = st.get("widgets_values") or []
    if len(wv) < 8:
        failures.append(f"{label}: widgets_values 不足 8 项（{len(wv)}）")
    elif "turbo" not in str(wv[0]):
        failures.append(f"{label}: lora_01 未预置 turbo（当前 {wv[0]!r}）")

    for s in [n for n in nodes if n.get("type") == "KSampler"]:
        src, _ = in_src(s, "model")
        if src != sid:
            failures.append(f"{label}: KSampler.model 未接到 Lora Loader Stack (src={src})")
    for c in [n for n in nodes if n.get("type") == "CLIPTextEncode"]:
        src, slot = in_src(c, "clip")
        if src != sid or slot != 1:
            failures.append(f"{label}: {c.get('title') or c['id']} 的 clip 未接到 Stack.CLIP")


def check_api(path, label):
    d = json.load(open(path))
    ids = [k for k, v in d.items() if v.get("class_type") == NODE_TYPE]
    if len(ids) != 1:
        failures.append(f"{label}: 期望 1 个 Lora Loader Stack，实际 {len(ids)}")
        return
    nid = ids[0]
    inp = d[nid].get("inputs", {})
    if "turbo" not in str(inp.get("lora_01", "")):
        failures.append(f"{label}: lora_01 未预置 turbo（当前 {inp.get('lora_01')!r}）")

    for v in d.values():
        if v.get("class_type") == "KSampler":
            m = v["inputs"].get("model")
            if not (isinstance(m, list) and m[0] == nid):
                failures.append(f"{label}: KSampler.model 未接到 Lora Loader Stack")
        if v.get("class_type") == "CLIPTextEncode":
            c = v["inputs"].get("clip")
            if not (isinstance(c, list) and c[0] == nid and c[1] == 1):
                failures.append(f"{label}: CLIPTextEncode.clip 未接到 Stack.CLIP")


for p, lbl in UI_FILES:
    check_ui(p, lbl)
for p, lbl in API_FILES:
    check_api(p, lbl)

if failures:
    print("FAIL — Lora Loader Stack 校验未通过：")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print("PASS — t2i / refine 均使用 Lora Loader Stack（标准控件·4 槽）并正确接入 model/clip")
