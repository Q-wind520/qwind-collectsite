import importlib.util
from pathlib import Path

p = Path(__file__).parent / "ingest-rating-balance-40.py"
spec = importlib.util.spec_from_file_location("i", p)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def test_yaml_str():
    s = m.yaml_str('abc"def')
    assert s.startswith('"') and s.endswith('"')


def test_entry_lines_rating_and_tier(tmp_path):
    job = {"slug": "bal40-s01", "title": "T", "tags": ["x"], "scene": "S",
           "character": "c", "prompt": "p", "rating": "sensitive"}
    lines = m.build_entry_lines(job, "bal40-s01")
    assert "rating: sensitive" in lines
    assert "tier: refined" in lines
    assert "kind: painting" in lines
    assert "images:" in lines and any("../../assets/works/bal40-s01/01.webp" in ln for ln in lines)


def test_entry_negative_matches_rating():
    # 入库条目记录的负面词必须与生图所用负面词一致（pre-flight ruling）。
    s = m.build_entry_lines({"slug": "bal40-s01", "title": "T", "tags": [], "scene": "S",
                             "character": "c", "prompt": "p", "rating": "sensitive"}, "bal40-s01")
    n = m.build_entry_lines({"slug": "bal40-n01", "title": "T", "tags": [], "scene": "S",
                             "character": "c", "prompt": "p", "rating": "nsfw"}, "bal40-n01")
    s_neg = next(ln for ln in s if ln.startswith("  negative:"))
    n_neg = next(ln for ln in n if ln.startswith("  negative:"))
    assert "child" in s_neg and "nsfw" in s_neg  # sensitive negative
    assert "child" in n_neg and "nsfw" not in n_neg  # nsfw negative
