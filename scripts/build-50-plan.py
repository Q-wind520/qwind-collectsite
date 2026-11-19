#!/usr/bin/env python3
"""生成 50 张精细绘图 JOBS 方案（精简版，低内存）。输出 /tmp/anima-50-jobs.json。"""
import json, random, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "docs/anima-prompt-library.md"
OUT = ROOT / "scripts/.anima-50-jobs.json"
random.seed(20261118)

def parse_lib():
    lines = LIB.read_text(encoding="utf-8").split("\n")
    secs = {"scene": [], "action": [], "outfit": []}
    cur = None
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("## 一、"): cur = "scene"
        elif line.startswith("## 二、"): cur = "action"
        elif line.startswith("## 三、"): cur = "outfit"
        elif line.startswith("## 四、"): cur = None
        if cur and re.match(r"^- \*\*.+\*\*", line) and i + 1 < len(lines) and "```text" in lines[i+1]:
            title = re.match(r"- \*\*(.+?)\*\*", line).group(1)
            badge = "nsfw?" in line
            j = i + 2
            buf = []
            while j < len(lines) and not lines[j].strip().startswith("```"):
                buf.append(lines[j]); j += 1
            tags = " ".join(buf).strip()
            if tags: secs[cur].append((title, tags, badge))
            i = j  # j 停在闭合 ``` 行；下一轮 i+=1 从 j+1 继续，可读到下一条标题
        i += 1
    return secs

NOISE = ["best quality","amazing quality","very aesthetic","absurdres","highres",
         "masterpiece","8k wallpaper","ultra-detailed","extremely detailed",
         "year 2023","year 2022","year 2024","year 2025","highly detailed",
         "detailed characters","film light and shadow","commercial light and shadow"]
SERIES = ["arknights","genshin impact","vocaloid","lycoris recoil","sousou no frieren",
          "honkai: star rail","blue archive","violet evergreen garden","sono bisque doll",
          "reverse:1999","fate","herrscher of flamescion","shoal beat","touhou"]

def conv(tags):
    s = tags
    def nw(m):
        w, inner = m.group(1), m.group(2)
        return ", ".join(f"({p.strip()}:{w})" for p in inner.split(",") if p.strip())
    s = re.sub(r"(\d+\.?\d*)::(.+?)::", nw, s)
    # 反复剥掉最内层花括号（支持 {{{x}}} 嵌套）
    prev = None
    while prev != s:
        prev = s
        s = re.sub(r"\{([^{}]*)\}", r"\1", s)
    s = re.sub(r"\[([^\[\]]+)\]", r"(\1:0.9)", s)
    for n in NOISE: s = s.replace(n, "")
    for name in SERIES: s = s.replace(f"({name})", f"\\({name}\\)")
    # 清除畸形残留：::weight:: 无配对、孤立括号权重、花括号
    s = re.sub(r"\([^()]*::[^()]*\)", "", s)   # (:::1.15) 之类
    s = re.sub(r"::[^,]*::", "", s)             # 残留 a::text::
    s = s.replace("::", "").replace("{", "").replace("}", "")
    # 移除擦边/不合适 tag（general 专用清洗，nsfw 不调用本函数）
    for bad in ("sideboob", "nude", "nsfw", "loli", "shota", "panties", "underwear",
                "see-through", "nipples", "areola", "cum", "bondage"):
        s = re.sub(r"\b" + re.escape(bad) + r"\b\s*,?\s*", "", s, flags=re.I)
    s = re.sub(r"\s+", " ", s).strip(" ,")
    return re.sub(r",\s*,+", ", ", s)

ARTISTS = ["@askzy","@rella","@ciloranko","@anmi","@fuzichoco","@hiten",
           "@krenz cushart","@lack","@mika pikazo","@wanke","@guweiz"]
CHARS = [("hatsune miku","vocaloid"),("frieren","sousou no frieren"),
         ("raiden shogun","genshin impact"),("furina","genshin impact"),
         ("violet evergreen","violet evergreen garden"),("hu tao","genshin impact"),
         ("kitagawa marin","sono bisque doll"),("nishikigi chisato","lycoris recoil"),
         ("takina ingo","lycoris recoil"),("fern","sousou no frieren"),
         ("raiden mei","honkai impact 3rd"),("kiana kaslana","honkai impact 3rd"),
         ("hoshino ai","oshi no ko"),("yae miko","genshin impact")]
SENS_OUTFIT = ["white bikini, bare shoulders","striped one-piece swimsuit, bare midriff",
    "bath towel wrapped around body, bare shoulders","sports bra, midriff, athletic shorts",
    "off-shoulder summer dress, bare shoulders","black one-piece swimsuit, wet hair",
    "cropped tank top, midriff, denim shorts","lace camisole, bare shoulders",
    "beach volleyball swimsuit","sleeveless hoodie, bare midriff","yellow bikini with sarong",
    "gym sportswear, crop top, midriff"]
NSFW = [
 ("adult woman, lingerie set, black lace bra and panties","bedroom, morning light, sitting on bed, looking at viewer"),
 ("adult woman, silk robe, partially open, lace negligee beneath","hotel suite, evening, leaning against window"),
 ("adult woman, white lace lingerie, sheer babydoll","boudoir, soft candlelight, lying on sofa"),
 ("adult woman, black stockings and garter belt, lace corset","dimly lit room, standing, hand on hip"),
 ("adult woman, off-shoulder silk nightgown, bare shoulders","bedroom at night, sitting on edge of bed"),
 ("adult woman, red lace lingerie, satin sheets","warm lamp light, reclining, smile"),
 ("adult woman, sheer nightie, wet hair after shower","bathroom mirror, steam, towel around neck"),
 ("adult woman, velvet choker, lace bodysuit, thighhighs","private room, low angle, confident expression"),
]
Q = "safe, masterpiece, best quality, year 2025, newest, highres, detailed background"
QN = "masterpiece, best quality, year 2025, newest, highres, detailed background"
NB = "worst quality, low quality, score_1, score_2, score_3, artist name, blurry, jpeg artifacts, chromatic aberration, watermark, signature, text, logo"
NSAFE = NB + ", nsfw, nude, naked, explicit, nipples, areola, panties, see-through, revealing clothes, child, loli, shota"
NSENS = NB + ", nude, naked, explicit, nipples, areola, child, loli, shota"
NNSFW = NB + ", child, loli, shota, teen, underage, amputation, gore, scat, bestiality"

def main():
    lib = parse_lib()
    scenes = [e for e in lib["scene"] if not e[2]]
    actions = [e for e in lib["action"] if not e[2]]
    outfits = [e for e in lib["outfit"] if not e[2]]
    print(f"pools: {len(scenes)}/{len(actions)}/{len(outfits)}", flush=True)
    jobs = []
    def mk(slug, title, rating, tags, char, scene, artist, prompt, neg, seed, src):
        jobs.append(dict(slug=slug,title=title,rating=rating,tags=tags,character=char,
                         scene=scene,artist=artist,prompt=prompt,negative=neg,seed=seed,source=src))

    us, ua, uo = set(), set(), set()
    def pick(pool, used, i):
        rng = random.Random(i)
        cand = [e for e in pool if e[0] not in used]
        if not cand: used.clear(); cand = pool
        e = rng.choice(cand); used.add(e[0]); return e

    for i in range(30):
        sc = pick(scenes,us,1000+i)
        char, series = CHARS[i % len(CHARS)]
        artist = ARTISTS[i % len(ARTISTS)]
        # 场景词条已自带动作/服装/镜头/光照，信息完整自洽；不再叠加独立服装与动作词条，
        # 避免"古风场景+bloodborne猎装+日式校服"这类语义冲突。多样性由 64 个不同场景保证。
        prompt = f"{Q}, 1girl, solo, {char} \\({series}\\), {artist}, {conv(sc[1])}"
        mk(f"gen50-g{i+1:02d}", f"{sc[0]} · {char}", "general",
           ["Anima","精细",sc[0][:12]], char, sc[0], artist, prompt, NSAFE, 600001+i,
           dict(scene=sc[0]))
    print("general done", flush=True)

    SENS_CHARS = [("raiden shogun","genshin impact"),("violet evergreen","violet evergreen garden"),
                  ("yae miko","genshin impact"),("kitagawa marin","sono bisque doll"),
                  ("raiden mei","honkai impact 3rd"),("hoshino ai","oshi no ko"),
                  ("rosaria","genshin impact"),("kiana kaslana","honkai impact 3rd"),
                  ("furina","genshin impact"),("hatsune miku","vocaloid"),
                  ("frieren","sousou no frieren"),("nishikigi chisato","lycoris recoil")]
    for i in range(12):
        sc = pick(scenes,us,4000+i)
        char, series = SENS_CHARS[i]
        artist = ARTISTS[(i+2) % len(ARTISTS)]
        outfit = SENS_OUTFIT[i]
        prompt = f"{Q}, 1girl, solo, adult, {char} \\({series}\\), {artist}, {outfit}, {conv(sc[1])}, looking at viewer"
        mk(f"gen50-s{i+1:02d}", f"{char} · {sc[0]}", "general",
           ["Anima","精细",sc[0][:12]], char, sc[0], artist, prompt, NSENS, 610001+i,
           dict(scene=sc[0],outfit=outfit))
    print("sensitive done", flush=True)

    # NSFW 只用明确成年外观的角色，排除体型偏少女/未成年的角色
    NSFW_CHARS = [("raiden shogun","genshin impact"),("violet evergreen","violet evergreen garden"),
                  ("yae miko","genshin impact"),("kitagawa marin","sono bisque doll"),
                  ("raiden mei","honkai impact 3rd"),("kiana kaslana","honkai impact 3rd"),
                  ("hoshino ai","oshi no ko"),("rosaria","genshin impact")]
    for i,(outfit,pose) in enumerate(NSFW):
        char, series = NSFW_CHARS[i % len(NSFW_CHARS)]
        artist = ARTISTS[(i+4) % len(ARTISTS)]
        prompt = f"{QN}, 1girl, solo, adult woman, {char} \\({series}\\), {artist}, {outfit}, {pose}, detailed face, soft lighting"
        mk(f"gen50-n{i+1:02d}", f"{char} · 私密写真 {i+1}", "sensitive",
           ["Anima","精细"], char, pose.split(",")[0], artist, prompt, NNSFW, 620001+i,
           dict(outfit=outfit,pose=pose))
    print("nsfw done", flush=True)

    OUT.write_text(json.dumps(jobs, ensure_ascii=False, indent=2), encoding="utf-8")
    from collections import Counter
    print(f"wrote {len(jobs)} -> {OUT}", Counter(j["rating"] for j in jobs), flush=True)

if __name__ == "__main__":
    main()
