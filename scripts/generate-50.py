#!/usr/bin/env python3
"""生成 50 张精细绘图（读方案 JSON），带 23:50 截止时间，支持断点续跑。

用法:
  python3 scripts/generate-50.py --all          # 生成全部未完成
  python3 scripts/generate-50.py --slug xxx      # 指定
  python3 scripts/generate-50.py --status
"""
from __future__ import annotations

import argparse
import json
import shutil
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMFY = "http://172.17.0.1:8190"
CLIENT_ID = "qwind-collectsite-gen50"
PLAN = ROOT / "scripts/.anima-50-jobs.json"
STAGING = ROOT / ".gen50-staging"          # 项目目录内，避免 /tmp 被清理
PROGRESS = ROOT / "scripts/.gen50-progress.json"
TEMPLATE = ROOT / "public/files/conf/anima/anima-t2i-api.json"
COMFY_OUT = Path("/home/qwind/.cache/anima-comfyui/output")
DEADLINE = None   # 用户要求全部跑完，不设截止时间


LAUNCHER = "http://172.17.0.1:8191"

def revive_comfy():
    """服务崩溃后通过 launcher 重新唤醒，最多等 40 秒。"""
    import time as _t
    try:
        urllib.request.urlopen(urllib.request.Request(
            LAUNCHER + "/start", data=b"{}", headers={"Content-Type": "application/json"},
            method="POST"), timeout=60).read()
    except Exception:
        pass
    for _ in range(20):
        try:
            urllib.request.urlopen(COMFY + "/system_stats", timeout=5).read()
            return True
        except Exception:
            _t.sleep(2)
    return False


def api(path, payload=None, timeout=60):
    """带一次重启重试的 API 调用（应对 ComfyUI 空闲/崩溃后的 502）。"""
    last = None
    for attempt in range(3):
        data = json.dumps(payload).encode() if payload is not None else None
        req = urllib.request.Request(COMFY + path, data=data,
            headers={"Content-Type": "application/json"}, method="POST" if data else "GET")
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            last = e
            if attempt < 2:
                print(f"  [api retry {attempt+1}] {path}: {e} -> revive comfy", flush=True)
                revive_comfy()
    raise RuntimeError(f"API failed after retries {path}: {last}")


def load_plan():
    return json.loads(PLAN.read_text(encoding="utf-8"))


def load_progress():
    return json.loads(PROGRESS.read_text(encoding="utf-8")) if PROGRESS.exists() else {}


def save_progress(p):
    PROGRESS.write_text(json.dumps(p, ensure_ascii=False, indent=2), encoding="utf-8")


def build_graph(job):
    g = json.loads(TEMPLATE.read_text(encoding="utf-8"))
    g["5"]["inputs"]["text"] = job["prompt"]
    g["6"]["inputs"]["text"] = job["negative"]
    g["8"]["inputs"]["seed"] = job["seed"]
    g["10"]["inputs"]["filename_prefix"] = f"anima/gen50/{job['slug']}"
    g["14"]["inputs"]["filename_prefix"] = f"anima/gen50/{job['slug']}-upscaled"
    return g


def wait_done(pid, slug=None, timeout=600):
    """等任务完成。优先从 ComfyUI 输出目录判断图是否已生成（history 在服务重启后可能丢失），
    不再用 /queue 判定丢失——那会把正在跑的任务误判掉。"""
    start = time.time()
    end = start + timeout
    out_dir = COMFY_OUT / "anima/gen50"
    while time.time() < end:
        # 输出目录出现该 slug 的放大图即视为完成（最可靠，不受 history 丢失影响）
        if slug and list(out_dir.glob(f"{slug}-upscaled*.png")):
            # 再等 history 稳定下来（用于拿到规范的 images 元数据），拿不到就返回空 outputs
            try:
                h = api(f"/history/{pid}").get(pid)
                if h and h.get("status", {}).get("completed"):
                    return h
            except Exception:
                pass
            # 图已生成但 history 不可用：构造最小 outputs 让 copy_outputs 从输出目录取
            return {"outputs": {"9": {"images": [{"filename": f"{slug}_00001_.png", "subfolder": "anima/gen50"}]},
                                "14": {"images": [{"filename": f"{slug}-upscaled_00001_.png", "subfolder": "anima/gen50"}]}}}
        h = api(f"/history/{pid}").get(pid)
        if h and h.get("status", {}).get("completed"):
            for m in h["status"].get("messages") or []:
                if m[0] == "execution_error":
                    raise RuntimeError(f"execution_error: {str(m[1])[:300]}")
            return h
        time.sleep(5)
    raise TimeoutError(pid)


def copy_outputs(job, h):
    d = STAGING / job["slug"]
    d.mkdir(parents=True, exist_ok=True)
    files = []
    for node in h.get("outputs", {}).values():
        for img in node.get("images", []):
            src = COMFY_OUT / img.get("subfolder", "") / img["filename"]
            if not src.exists():
                continue
            name = "01-upscaled.png" if "upscaled" in img["filename"] else "01.png"
            dst = d / name
            shutil.copy2(src, dst)
            files.append(str(dst))
    return files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--slug", action="append", default=[])
    ap.add_argument("--status", action="store_true")
    args = ap.parse_args()

    plan = load_plan()
    progress = load_progress()
    if args.status:
        from collections import Counter
        for j in plan:
            print(f"{j['slug']:<16} {j['rating']:<10} {progress.get(j['slug'],{}).get('state','pending')}")
        print("summary:", Counter(progress.get(j["slug"], {}).get("state", "pending") for j in plan))
        return

    selected = [j for j in plan if (args.all or j["slug"] in args.slug)
                and progress.get(j["slug"], {}).get("state") not in ("done",)]
    if not selected:
        print("no pending jobs"); return

    STAGING.mkdir(parents=True, exist_ok=True)
    for job in selected:
        # 截止时间检查（DEADLINE=None 表示不限制）
        if DEADLINE and datetime.now() >= DEADLINE:
            print(f"[{job['slug']}] DEADLINE {DEADLINE:%H:%M} reached -> PAUSE (remaining left pending)")
            break
        slug = job["slug"]
        print(f"[{slug}] {job['rating']} submit seed={job['seed']}", flush=True)
        try:
            r = api("/prompt", {"prompt": build_graph(job), "client_id": CLIENT_ID})
            pid = r["prompt_id"]
            progress[slug] = {"state": "running", "prompt_id": pid, "rating": job["rating"]}
            save_progress(progress)
            h = wait_done(pid, slug=slug)
            files = copy_outputs(job, h)
            # 兜底：若 history 未返回图，直接从输出目录补拷
            if not any("upscaled" in f for f in files):
                for img in (COMFY_OUT / "anima/gen50").glob(f"{slug}*.png"):
                    name = "01-upscaled.png" if "upscaled" in img.name else "01.png"
                    dst = STAGING / slug / name
                    STAGING.joinpath(slug).mkdir(parents=True, exist_ok=True)
                    shutil.copy2(img, dst)
                    if str(dst) not in files:
                        files.append(str(dst))
            progress[slug] = {"state": "done", "prompt_id": pid, "files": files, "rating": job["rating"]}
            save_progress(progress)
            print(f"  done -> {len(files)} files", flush=True)
        except Exception as e:
            # 服务重启导致任务丢失 -> 重置为 pending 以便下轮重试，不浪费一次机会
            state = "pending" if "task_lost_after_restart" in str(e) else "error"
            progress[slug] = {"state": state, "error": str(e), "rating": job["rating"]}
            save_progress(progress)
            print(f"  {state.upper()} {e}", flush=True)


if __name__ == "__main__":
    main()
