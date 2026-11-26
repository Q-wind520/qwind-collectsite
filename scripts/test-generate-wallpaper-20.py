import importlib.util
from pathlib import Path

p = Path(__file__).parent / "generate-wallpaper-20.py"
spec = importlib.util.spec_from_file_location("wp", p)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def test_job_count_and_unique():
    assert len(m.JOBS) == 20
    assert len({j["slug"] for j in m.JOBS}) == 20
    assert len({j["seed"] for j in m.JOBS}) == 20
    for j in m.JOBS:
        assert j["slug"].startswith("wp20-")


def test_landscape_latent_and_params():
    for j in m.JOBS:
        g = m.build_prompt(j)
        assert g["7"]["inputs"] == {"width": 1360, "height": 768, "batch_size": 1}, j["slug"]
        k = g["8"]["inputs"]
        assert k["steps"] == 20 and k["cfg"] == 4.0, j["slug"]
        assert k["sampler_name"] == "euler_ancestral" and k["scheduler"] == "simple", j["slug"]
        assert g["2"]["inputs"]["lora_01"] == "None", j["slug"]
        assert g["2"]["inputs"]["lora_02"] == j["lora"], j["slug"]


def test_prompt_safety_and_quality():
    for j in m.JOBS:
        low = j["prompt"].lower()
        assert "adult" in low, j["slug"]
        assert not any(w in low for w in ("child", "loli", "shota")), j["slug"]
        pos = m.build_prompt(j)["5"]["inputs"]["text"]
        assert "aesthetic, very aesthetic" in pos, j["slug"]


def test_new_loras_installed():
    ldir = Path("/home/qwind/ComfyUI-Shared/models/loras")
    assert (ldir / "S1_Dramatic Lighting Anima_V2.safetensors").exists()
    assert (ldir / "anima-highres-aesthetic-boost.safetensors").exists()
