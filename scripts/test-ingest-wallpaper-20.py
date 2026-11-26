import importlib.util
from pathlib import Path

p = Path(__file__).parent / "ingest-wallpaper-20.py"
spec = importlib.util.spec_from_file_location("iw", p)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def test_yaml_str():
    s = m.yaml_str('abc"def')
    assert s.startswith('"') and s.endswith('"')


def test_entry_lines(tmp_path):
    job = {"slug": "wp20-01", "title": "T", "tags": ["x"], "scene": "S",
           "character": "c", "prompt": "p",
           "lora": "S1_Dramatic Lighting Anima_V2.safetensors", "rating": "general"}
    lines = m.build_entry_lines(job, "wp20-01")
    assert "rating: general" in lines
    assert "tier: refined" in lines
    assert "kind: painting" in lines
    assert "experiment: [lora]" in lines
    assert any("../../assets/works/wp20-01/01.webp" in ln for ln in lines)
    assert any("S1_Dramatic Lighting" in ln for ln in lines)


def test_tags_deduped():
    # job.tags 含与前缀重复的 "原创"/"壁纸"；条目里每个 tag 只能出现一次。
    job = {"slug": "wp20-01", "title": "T", "tags": ["原创", "壁纸", "赛博朋克"],
           "scene": "S", "character": "c", "prompt": "p",
           "lora": "S1_Dramatic Lighting Anima_V2.safetensors", "rating": "general"}
    lines = m.build_entry_lines(job, "wp20-01")
    tags_line = next(ln for ln in lines if ln.startswith("tags: "))
    import re
    tags = re.findall(r'"([^"]+)"', tags_line)
    assert len(tags) == len(set(tags)), tags
