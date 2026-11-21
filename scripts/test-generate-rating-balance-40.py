import importlib.util
from pathlib import Path

p = Path(__file__).parent / "generate-rating-balance-40.py"
spec = importlib.util.spec_from_file_location("g", p)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def test_job_counts_and_unique():
    assert len(m.JOBS) == 40
    assert sum(j["rating"] == "sensitive" for j in m.JOBS) == 20
    assert sum(j["rating"] == "nsfw" for j in m.JOBS) == 20
    assert len({j["slug"] for j in m.JOBS}) == 40
    assert len({j["seed"] for j in m.JOBS}) == 40


def test_slug_prefix_no_collision():
    # Baseline-aware: our own bal40- output is expected to exist after ingestion;
    # only a collision with a pre-existing (non-bal40) work is a defect.
    preexisting = {
        p.stem for p in Path("src/content/works").glob("*.md")
        if not p.stem.startswith("bal40-")
    }
    for j in m.JOBS:
        assert j["slug"].startswith("bal40-")
        assert j["slug"] not in preexisting


def test_negative_words_per_rating():
    for j in m.JOBS:
        neg = m.build_prompt(j)["6"]["inputs"]["text"].lower()
        if j["rating"] == "sensitive":
            for w in ("nsfw", "nude", "explicit", "child", "loli", "shota"):
                assert w in neg, (j["slug"], w)
        else:
            for w in ("nsfw", "nude", "explicit"):
                assert w not in neg, (j["slug"], w)
            for w in ("child", "loli", "shota"):
                assert w in neg, (j["slug"], w)


def test_no_minors_and_adult():
    for j in m.JOBS:
        assert "adult" in j["prompt"], j["slug"]
        assert not any(w in j["prompt"].lower() for w in ("loli", "shota", "child")), j["slug"]


def test_template_wiring():
    for j in m.JOBS:
        g = m.build_prompt(j)
        assert g["7"]["inputs"] == {"width": 832, "height": 1216, "batch_size": 1}
        assert g["8"]["inputs"]["steps"] == 8 and g["8"]["inputs"]["sampler_name"] == "euler_ancestral"
