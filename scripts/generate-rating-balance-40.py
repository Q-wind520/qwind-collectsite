#!/usr/bin/env python3
"""批量生成 40 张补齐 rating 分级的 Anima 作品（20 sensitive / 20 nsfw）。

与 generate-sensitive-batch.py 同构，按分档使用不同负面词：
  - sensitive：轻微暴露，负面排除 nsfw/nude/child 等
  - nsfw：允许露骨成人内容，负面只排除 child/loli/shota

ComfyUI: http://172.17.0.1:8190（launcher 按需启动的 headless 实例）
模板: public/files/conf/anima/anima-t2i-api.json
用法: python3 scripts/generate-rating-balance-40.py --list | --verify | --status | --all | --slug SLUG
生成图暂存 /tmp/anima-rating40-out/<slug>/，再由 ingest-rating-balance-40.py 入库。
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMFY = "http://172.17.0.1:8190"
CLIENT_ID = "qwind-collectsite-rating40"
TEMPLATE = ROOT / "public/files/conf/anima/anima-t2i-api.json"
STAGING = Path("/tmp/anima-rating40-out")
LOG = Path("/tmp/anima-rating40-progress.json")

QUALITY = "safe, masterpiece, best quality, year 2025, newest, highres, detailed background"
# nsfw 档不加 safe（安全标签会压制露骨内容），与参考作品 comfy-88564943 一致。
NSFW_QUALITY = "masterpiece, best quality, year 2025, newest, highres, detailed background"
BASE_NEGATIVE = (
    "worst quality, low quality, score_1, score_2, score_3, artist name, blurry, "
    "jpeg artifacts, chromatic aberration, watermark, signature, text, logo"
)
SENSITIVE_NEGATIVE = BASE_NEGATIVE + (
    ", nsfw, nude, naked, explicit, nipples, areola, panties, see-through, "
    "revealing clothes, child, loli, shota"
)
NSFW_NEGATIVE = BASE_NEGATIVE + ", child, loli, shota"


def negative_for(rating: str) -> str:
    """按分级返回负面词，供生图与入库共用，避免两者漂移。"""
    if rating == "sensitive":
        return SENSITIVE_NEGATIVE
    if rating == "nsfw":
        return NSFW_NEGATIVE
    raise ValueError(f"unsupported rating: {rating}")


# 提示词结构：[质量词] [主体] [外观] [服装] [姿势/表情] [场景] [光照] [构图] [风格] [额外 tags]
# 所有角色均为 adult、虚构；sensitive 仅轻微暴露，nsfw 为露骨成人内容。
JOBS = [
    # ---------------- sensitive 20 ----------------
    {"slug": "bal40-s01", "rating": "sensitive", "seed": 540101, "artist": "askzy",
     "character": "hatsune miku", "scene": "夏日海岸 / 蓝天 / 海风",
     "title": "夏日海岸的初音未来", "tags": ["初音未来", "泳装", "夏日", "海岸"],
     "prompt": QUALITY + ", adult, 1girl, solo, hatsune miku \\(vocaloid\\), @askzy, aqua twin tails, aqua eyes, white bikini, bare shoulders, bright smile, sitting on warm sand, turquoise sea and blue sky, gentle sea breeze, soft afternoon light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s02", "rating": "sensitive", "seed": 540102, "artist": "ciloranko",
     "character": "raiden shogun", "scene": "泳池 / 夏日 / 阳光",
     "title": "泳池边的雷电将军", "tags": ["雷电将军", "泳装", "泳池", "夏日"],
     "prompt": QUALITY + ", adult, 1girl, solo, raiden shogun \\(genshin impact\\), @ciloranko, long violet hair, purple eyes, dark blue one-piece swimsuit, bare shoulders, calm smile, leaning by a poolside, clear blue water, strong summer sunlight, dutch angle, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s03", "rating": "sensitive", "seed": 540103, "artist": "askzy",
     "character": "hu tao", "scene": "夜祭 / 灯笼 / 浴衣",
     "title": "夜祭灯下的胡桃", "tags": ["胡桃", "浴衣", "夜祭", "灯笼"],
     "prompt": QUALITY + ", adult, 1girl, solo, hu tao \\(genshin impact\\), @askzy, long dark brown hair, red eyes, summer yukata, bare shoulders, playful grin, holding a paper lantern, night festival stalls, warm lantern light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s04", "rating": "sensitive", "seed": 540104, "artist": "guweiz",
     "character": "marin kitagawa", "scene": "海边 / 落日 / 沙滩",
     "title": "落日海滩的喜多川海梦", "tags": ["喜多川海梦", "泳装", "海边", "落日"],
     "prompt": QUALITY + ", adult, 1girl, solo, marin kitagawa \\(sono bisque doll\\), @guweiz, long pink-blonde hair, red eyes, white bikini with ribbons, bare shoulders, cheerful laugh, walking along a beach at sunset, golden hour backlight, wind in hair, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s05", "rating": "sensitive", "seed": 540105, "artist": "rella",
     "character": "fern", "scene": "河畔 / 夏日 / 树荫",
     "title": "河畔乘凉的菲伦", "tags": ["菲伦", "泳装", "夏日", "河畔"],
     "prompt": QUALITY + ", adult, 1girl, solo, fern \\(sousou no frieren\\), @rella, long dark hair, green eyes, modest one-piece swimsuit, bare shoulders, calm expression, sitting by a clear river, summer greenery, dappled sunlight through leaves, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s06", "rating": "sensitive", "seed": 540106, "artist": "hiten",
     "character": "chisato nishikigi", "scene": "训练场 / 运动 / 清晨",
     "title": "晨练的锦木千束", "tags": ["锦木千束", "运动", "露腰", "训练"],
     "prompt": QUALITY + ", adult, 1girl, solo, nishikigi chisato \\(lycoris recoil\\), @hiten, short blonde hair, green eyes, sports tank top, midriff, athletic shorts, bright smile, training gym, morning light through windows, dynamic pose, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s07", "rating": "sensitive", "seed": 540107, "artist": "wanke",
     "character": "takina ingo", "scene": "训练场 / 运动 / 清晨",
     "title": "训练中的井之上泷奈", "tags": ["井之上泷奈", "运动", "露腰", "训练"],
     "prompt": QUALITY + ", adult, 1girl, solo, takina ingo \\(lycoris recoil\\), @wanke, short silver hair, blue eyes, black sports bra, midriff, athletic shorts, determined expression, training gym, soft morning light, stretching pose, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s08", "rating": "sensitive", "seed": 540108, "artist": "fuzichoco",
     "character": "furina", "scene": "海边 / 度假 / 晴天",
     "title": "海边度假的芙宁娜", "tags": ["芙宁娜", "泳装", "海边", "度假"],
     "prompt": QUALITY + ", adult, 1girl, solo, furina \\(genshin impact\\), @fuzichoco, light blue hair, blue eyes, elegant white bikini, bare shoulders, gentle smile, standing on a seaside boardwalk, turquoise ocean, sunny sky, soft midday light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s09", "rating": "sensitive", "seed": 540109, "artist": "anmi",
     "character": "violet evergreen", "scene": "露台 / 黄昏 / 晚礼服",
     "title": "露台黄昏的薇尔莉特", "tags": ["薇尔莉特", "露肩", "黄昏", "晚礼服"],
     "prompt": QUALITY + ", adult, 1girl, solo, violet evergreen \\(violet evergreen garden\\), @anmi, long platinum blonde hair, blue eyes, off-shoulder evening dress, bare shoulders, gentle smile, standing on a balcony, golden hour light, distant cityscape, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s10", "rating": "sensitive", "seed": 540110, "artist": "krenz-cushart",
     "character": "zero two", "scene": "屋顶 / 黄昏 / 微风",
     "title": "屋顶黄昏的零二", "tags": ["零二", "露肩", "黄昏", "屋顶"],
     "prompt": QUALITY + ", adult, 1girl, solo, zero two \\(darling in the franxx\\), @krenz-cushart, long pink hair, red horns, green eyes, off-shoulder summer top, bare shoulders, confident grin, standing on a rooftop at dusk, glowing city lights, warm evening light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s11", "rating": "sensitive", "seed": 540111, "artist": "mika-pikazo",
     "character": "asuna yuuki", "scene": "泳池 / 夏日 / 水面",
     "title": "泳池中的亚丝娜", "tags": ["亚丝娜", "泳装", "泳池", "夏日"],
     "prompt": QUALITY + ", adult, 1girl, solo, asuna yuuki \\(sword art online\\), @mika-pikazo, long chestnut hair, brown eyes, white and red bikini, bare shoulders, playful smile, standing in a sunlit pool, water reflections, bright summer light, dutch angle, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s12", "rating": "sensitive", "seed": 540112, "artist": "lack",
     "character": "mai sakurajima", "scene": "阳台 / 夏日 / 午后",
     "title": "阳台午后的樱岛麻衣", "tags": ["樱岛麻衣", "露腰", "夏日", "阳台"],
     "prompt": QUALITY + ", adult, 1girl, solo, mai sakurajima \\(rascal does not dream\\), @lack, long dark hair, purple eyes, cropped summer blouse, midriff, casual shorts, gentle smile, leaning on a sunny balcony, potted plants, soft afternoon light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s13", "rating": "sensitive", "seed": 540113, "artist": "askzy",
     "character": "yae miko", "scene": "温泉 / 夜色 / 蒸汽",
     "title": "夜色温泉的八重神子", "tags": ["八重神子", "浴衣", "温泉", "夜色"],
     "prompt": QUALITY + ", adult, 1girl, solo, yae miko \\(genshin impact\\), @askzy, long pink hair, purple eyes, summer yukata, bare shoulders, teasing smile, sitting by an outdoor hot spring, steam and lantern light, night sky, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s14", "rating": "sensitive", "seed": 540114, "artist": "ciloranko",
     "character": "ningguang", "scene": "海边 / 遮阳伞 / 晴天",
     "title": "海边遮阳伞下的凝光", "tags": ["凝光", "泳装", "海边", "夏日"],
     "prompt": QUALITY + ", adult, 1girl, solo, ningguang \\(genshin impact\\), @ciloranko, long dark hair, amber eyes, elegant dark swimsuit, bare shoulders, composed smile, reclining under a beach parasol, blue sea behind, bright sunlight, dutch angle, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s15", "rating": "sensitive", "seed": 540115, "artist": "guweiz",
     "character": "megumin", "scene": "河畔 / 夏日 / 戏水",
     "title": "河畔戏水的惠惠", "tags": ["惠惠", "泳装", "夏日", "戏水"],
     "prompt": QUALITY + ", adult, 1girl, solo, megumin \\(konosuba\\), @guweiz, long dark hair, red eyes, modest swimsuit, bare shoulders, energetic smile, splashing water in a clear river, summer greenery, dappled sunlight, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s16", "rating": "sensitive", "seed": 540116, "artist": "rella",
     "character": "karyl", "scene": "庭园 / 夏日 / 花丛",
     "title": "庭园夏日的凯露", "tags": ["凯露", "泳装", "夏日", "庭园"],
     "prompt": QUALITY + ", adult, 1girl, solo, karyl \\(princess connect\\), @rella, long silver hair, blue eyes, light blue swimsuit, bare shoulders, cheerful smile, standing among summer flowers in a garden, warm sunlight, soft background bokeh, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s17", "rating": "sensitive", "seed": 540117, "artist": "hiten",
     "character": "jeanne d'arc", "scene": "露台 / 夜色 / 微风",
     "title": "露台夜色的贞德", "tags": ["贞德", "露肩", "夜色", "露台"],
     "prompt": QUALITY + ", adult, 1girl, solo, jeanne d'arc \\(fate\\), @hiten, long blonde hair, blue eyes, off-shoulder summer dress, bare shoulders, serene expression, standing on a balcony at night, city lights and a gentle breeze, cool moonlight, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s18", "rating": "sensitive", "seed": 540118, "artist": "wanke",
     "character": "frieren", "scene": "湖畔 / 夏日 / 树荫",
     "title": "湖畔夏日芙莉莲", "tags": ["芙莉莲", "泳装", "夏日", "湖畔"],
     "prompt": QUALITY + ", adult, 1girl, solo, frieren \\(sousou no frieren\\), @wanke, long silver hair, green eyes, modest one-piece swimsuit, bare shoulders, calm smile, sitting by a quiet lake, summer forest, soft dappled light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s19", "rating": "sensitive", "seed": 540119, "artist": "fuzichoco",
     "character": "astrid", "scene": "泳池 / 度假 / 午后",
     "title": "度假泳池的阿斯特丽德", "tags": ["原创角色", "泳装", "泳池", "度假"],
     "prompt": QUALITY + ", adult, 1girl, solo, original character, @fuzichoco, long blonde hair, blue eyes, striped bikini, bare shoulders, relaxed smile, lounging beside a resort pool, palm trees, bright afternoon light, cowboy shot, looking at viewer, anime coloring, cel shading"},
    {"slug": "bal40-s20", "rating": "sensitive", "seed": 540120, "artist": "anmi",
     "character": "katalina", "scene": "海边 / 傍晚 / 微风",
     "title": "海边傍晚的卡塔莉娜", "tags": ["原创角色", "露肩", "海边", "傍晚"],
     "prompt": QUALITY + ", adult, 1girl, solo, original character, @anmi, long silver hair, red eyes, off-shoulder blouse, bare shoulders, gentle smile, walking along a beach at dusk, soft evening light, sea breeze, cowboy shot, looking at viewer, anime coloring, cel shading"},

    # ---------------- nsfw 20 ----------------
    # 露骨成人内容，参考 comfy-88564943 的写法：明确性行为词汇 + 画师串 + censored。
    # 一律 adult、双方自愿、原创成年人；严禁 child/loli/shota 与 r18g。
    {"slug": "bal40-n01", "rating": "nsfw", "seed": 540201, "artist": "askzy",
     "character": "adult couple", "scene": "卧室 / 夜晚 / 传教士",
     "title": "卧室夜晚的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", (@askzy:1.1), adult, 1girl, 1boy, original adult characters, girl on back, lying on bed, missionary, vaginal sex, penis, vaginal, looking at viewer, caught, open mouth, blush, sweat, hold bed sheet, boy on top, naked, nipples, censored, folded clothes, (unworn clothes:2), night bedroom, warm lamplight, anime coloring, cel shading"},
    {"slug": "bal40-n02", "rating": "nsfw", "seed": 540202, "artist": "ciloranko",
     "character": "adult couple", "scene": "卧室 / 清晨 / 女上位",
     "title": "清晨卧室的女上位", "tags": ["原创角色", "成人", "卧室", "女上位"],
     "prompt": NSFW_QUALITY + ", @ciloranko, adult, 1girl, 1boy, original adult characters, girl on top, cowgirl position, riding, vaginal sex, penis, naked, nipples, blush, open mouth, sweat, clenched bed sheet, morning light through curtains, censored, anime coloring, cel shading"},
    {"slug": "bal40-n03", "rating": "nsfw", "seed": 540203, "artist": "guweiz",
     "character": "adult couple", "scene": "浴室 / 蒸汽 / 后入",
     "title": "蒸汽浴室的成年人后入", "tags": ["原创角色", "成人", "浴室", "后入"],
     "prompt": NSFW_QUALITY + ", @guweiz, adult, 1girl, 1boy, original adult characters, doggy style, sex from behind, vaginal, penis, girl on hands and knees, looking back at viewer, blush, open mouth, sweat, naked, nipples, steam, warm water droplets, censored, anime coloring, cel shading"},
    {"slug": "bal40-n04", "rating": "nsfw", "seed": 540204, "artist": "rella",
     "character": "adult couple", "scene": "沙发 / 夜晚 / 口交",
     "title": "夜晚沙发的成年口交", "tags": ["原创角色", "成人", "客厅", "口交"],
     "prompt": NSFW_QUALITY + ", @rella, adult, 1girl, 1boy, original adult characters, girl kneeling, oral sex, fellatio, penis in mouth, looking up at viewer, blush, tears, boy standing, hand on head, naked, nipples, dim living room, warm ambient light, censored, anime coloring, cel shading"},
    {"slug": "bal40-n05", "rating": "nsfw", "seed": 540205, "artist": "hiten",
     "character": "adult couple", "scene": "卧室 / 黄昏 / 侧入",
     "title": "黄昏卧室的成年人侧入", "tags": ["原创角色", "成人", "卧室", "侧入"],
     "prompt": NSFW_QUALITY + ", @hiten, adult, 1girl, 1boy, original adult characters, side entry, lying on side, vaginal sex, penis, girl moaning, open mouth, blush, sweat, naked, nipples, Golden hour light, censored, folded clothes, anime coloring, cel shading"},
    {"slug": "bal40-n06", "rating": "nsfw", "seed": 540206, "artist": "wanke",
     "character": "adult couple", "scene": "卧室 / 夜晚 / 传教士",
     "title": "夜晚床榻的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @wanke, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, girl on back, legs spread, looking at viewer, caught, blush, open mouth, boy thrusting, naked, nipples, rumpled sheets, warm lamplight, censored, anime coloring, cel shading"},
    {"slug": "bal40-n07", "rating": "nsfw", "seed": 540207, "artist": "fuzichoco",
     "character": "adult couple", "scene": "更衣室 / 夜晚 / 站立后入",
     "title": "更衣室的成年人站立后入", "tags": ["原创角色", "成人", "室内", "后入"],
     "prompt": NSFW_QUALITY + ", @fuzichoco, adult, 1girl, 1boy, original adult characters, standing sex from behind, vaginal, penis, girl bent over, looking back at viewer, blush, open mouth, naked, nipples, cool artificial light, censored, (unworn clothes:2), anime coloring, cel shading"},
    {"slug": "bal40-n08", "rating": "nsfw", "seed": 540208, "artist": "anmi",
     "character": "adult couple", "scene": "卧室 / 夜晚 / 女上位",
     "title": "台灯下的成年女上位", "tags": ["原创角色", "成人", "卧室", "女上位"],
     "prompt": NSFW_QUALITY + ", @anmi, adult, 1girl, 1boy, original adult characters, girl on top, cowgirl, riding penis, vaginal sex, naked, nipples, blush, open mouth, sweat, bedside lamp glow, censored, warm focused light, anime coloring, cel shading"},
    {"slug": "bal40-n09", "rating": "nsfw", "seed": 540209, "artist": "krenz-cushart",
     "character": "adult couple", "scene": "卧室 / 午后 / 传教士",
     "title": "午后卧室的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @krenz-cushart, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, girl on back, arms around boy, blush, open mouth, looking at viewer, naked, nipples, soft light through curtains, censored, anime coloring, cel shading"},
    {"slug": "bal40-n10", "rating": "nsfw", "seed": 540210, "artist": "mika-pikazo",
     "character": "adult couple", "scene": "卧室 / 夜晚 / 后入",
     "title": "夜晚床边的成年人后入", "tags": ["原创角色", "成人", "卧室", "后入"],
     "prompt": NSFW_QUALITY + ", @mika-pikazo, adult, 1girl, 1boy, original adult characters, doggy style, sex from behind, vaginal, penis, girl on hands and knees, looking back at viewer, open mouth, blush, naked, nipples, warm dim lighting, censored, anime coloring, cel shading"},
    {"slug": "bal40-n11", "rating": "nsfw", "seed": 540211, "artist": "lack",
     "character": "adult couple", "scene": "卧室 / 清晨 / 传教士",
     "title": "清晨阳光下的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @lack, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, girl on back, sunlit bedroom, bright warm sunlight, blush, open mouth, sweat, looking at viewer, naked, nipples, censored, anime coloring, cel shading"},
    {"slug": "bal40-n12", "rating": "nsfw", "seed": 540212, "artist": "askzy",
     "character": "adult couple", "scene": "浴室 / 夜晚 / 站立",
     "title": "夜晚浴室的成年人站立性事", "tags": ["原创角色", "成人", "浴室", "站立"],
     "prompt": NSFW_QUALITY + ", @askzy, adult, 1girl, 1boy, original adult characters, standing sex, vaginal, penis, girl against wall, leg around boy waist, looking at viewer, blush, open mouth, naked, nipples, warm water and soft light, censored, anime coloring, cel shading"},
    {"slug": "bal40-n13", "rating": "nsfw", "seed": 540213, "artist": "ciloranko",
     "character": "adult couple", "scene": "沙发 / 夜晚 / 女上位",
     "title": "夜晚沙发的成年女上位", "tags": ["原创角色", "成人", "客厅", "女上位"],
     "prompt": NSFW_QUALITY + ", @ciloranko, adult, 1girl, 1boy, original adult characters, girl on top, cowgirl, riding penis, vaginal sex, naked, nipples, blush, open mouth, sweat, soft lamplight, couch, censored, anime coloring, cel shading"},
    {"slug": "bal40-n14", "rating": "nsfw", "seed": 540214, "artist": "guweiz",
     "character": "adult couple", "scene": "卧室 / 夜色 / 侧入",
     "title": "月光下的成年人侧入", "tags": ["原创角色", "成人", "卧室", "侧入"],
     "prompt": NSFW_QUALITY + ", @guweiz, adult, 1girl, 1boy, original adult characters, side sex, lying on side, vaginal, penis, girl moaning, open mouth, blush, naked, nipples, soft moonlight through window, censored, anime coloring, cel shading"},
    {"slug": "bal40-n15", "rating": "nsfw", "seed": 540215, "artist": "rella",
     "character": "adult couple", "scene": "卧室 / 傍晚 / 传教士",
     "title": "傍晚卧室的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @rella, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, girl on back, holding boy, blush, open mouth, looking at viewer, naked, nipples, warm artificial light, censored, anime coloring, cel shading"},
    {"slug": "bal40-n16", "rating": "nsfw", "seed": 540216, "artist": "hiten",
     "character": "adult couple", "scene": "卧室 / 夜晚 / 传教士",
     "title": "床榻相拥的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @hiten, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, couple embraced, girl on back, blush, open mouth, sweat, naked, nipples, soft rumpled sheets, warm lamplight, censored, anime coloring, cel shading"},
    {"slug": "bal40-n17", "rating": "nsfw", "seed": 540217, "artist": "wanke",
     "character": "adult couple", "scene": "更衣室 / 夜晚 / 镜前",
     "title": "镜前的成年人后入", "tags": ["原创角色", "成人", "室内", "后入"],
     "prompt": NSFW_QUALITY + ", @wanke, adult, 1girl, 1boy, original adult characters, sex from behind, doggy style, vaginal, penis, mirror reflection, girl looking in mirror at viewer, blush, open mouth, naked, nipples, cool light, censored, anime coloring, cel shading"},
    {"slug": "bal40-n18", "rating": "nsfw", "seed": 540218, "artist": "fuzichoco",
     "character": "adult couple", "scene": "卧室 / 午后 / 传教士",
     "title": "午后床榻的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @fuzichoco, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, girl on back, relaxed pose, blush, open mouth, looking at viewer, naked, nipples, soft natural light, censored, anime coloring, cel shading"},
    {"slug": "bal40-n19", "rating": "nsfw", "seed": 540219, "artist": "anmi",
     "character": "adult couple", "scene": "卧室 / 夜晚 / 口交",
     "title": "台灯下的成年口交", "tags": ["原创角色", "成人", "卧室", "口交"],
     "prompt": NSFW_QUALITY + ", @anmi, adult, 1girl, 1boy, original adult characters, girl kneeling, oral sex, fellatio, penis in mouth, looking up at viewer, blush, boy standing, hand on head, naked, nipples, bedside lamp glow, censored, anime coloring, cel shading"},
    {"slug": "bal40-n20", "rating": "nsfw", "seed": 540220, "artist": "krenz-cushart",
     "character": "adult couple", "scene": "卧室 / 黎明 / 传教士",
     "title": "黎明卧室的成年性事", "tags": ["原创角色", "成人", "卧室", "传教士"],
     "prompt": NSFW_QUALITY + ", @krenz-cushart, adult, 1girl, 1boy, original adult characters, missionary, vaginal sex, penis, girl on back, blush, open mouth, looking at viewer, naked, nipples, first light through curtains, censored, anime coloring, cel shading"},
]


def api(path: str, payload: dict | None = None, timeout: int = 60) -> dict:
    url = COMFY + path
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST" if data else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {exc.code} {path}: {body[:800]}") from exc


def build_prompt(job: dict) -> dict:
    graph = json.loads(TEMPLATE.read_text(encoding="utf-8"))
    graph["5"]["inputs"]["text"] = job["prompt"]
    graph["6"]["inputs"]["text"] = negative_for(job["rating"])
    graph["8"]["inputs"]["seed"] = job["seed"]
    graph["10"]["inputs"]["filename_prefix"] = f"anima/rating40/{job['slug']}"
    graph["14"]["inputs"]["filename_prefix"] = f"anima/rating40/{job['slug']}-upscaled"
    return graph


def submit(job: dict) -> str:
    result = api("/prompt", {"prompt": build_prompt(job), "client_id": CLIENT_ID})
    if "prompt_id" not in result:
        raise RuntimeError(f"submit failed: {result}")
    return result["prompt_id"]


def history(prompt_id: str) -> dict | None:
    return api(f"/history/{prompt_id}").get(prompt_id)


def wait_done(prompt_id: str, timeout: int = 900) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        h = history(prompt_id)
        if h and h.get("status", {}).get("completed"):
            for m in h["status"].get("messages") or []:
                if m[0] == "execution_error":
                    raise RuntimeError(f"execution_error: {m[1]}")
            return h
        time.sleep(5)
    raise TimeoutError(f"prompt {prompt_id} timeout after {timeout}s")


def copy_outputs(job: dict, h: dict) -> list[str]:
    out_dir = STAGING / job["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)
    comfy_out = Path("/home/qwind/.cache/anima-comfyui/output")
    copied: list[str] = []
    for node in h.get("outputs", {}).values():
        for img in node.get("images", []):
            src = (
                comfy_out / img["subfolder"] / img["filename"]
                if img.get("subfolder")
                else comfy_out / img["filename"]
            )
            if not src.exists():
                print(f"  [warn] missing output {src}", file=sys.stderr)
                continue
            name = "01-upscaled.png" if "upscaled" in img["filename"] else "01.png"
            dst = out_dir / name
            shutil.copy2(src, dst)
            copied.append(str(dst))
    return copied


def load_progress() -> dict:
    return json.loads(LOG.read_text(encoding="utf-8")) if LOG.exists() else {}


def save_progress(p: dict) -> None:
    LOG.write_text(json.dumps(p, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--slug", action="append", default=[])
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--verify", action="store_true", help="离线校验提示词可序列化，不提交")
    args = ap.parse_args()

    if args.list:
        for j in JOBS:
            print(f"{j['slug']:<12} {j['rating']:<10} seed={j['seed']}  {j['title']}")
        return
    if args.status:
        p = load_progress()
        for j in JOBS:
            print(f"{j['slug']:<12} {p.get(j['slug'], {}).get('state', 'pending')}")
        return

    if args.all or args.verify:
        selected = JOBS
    elif args.slug:
        selected = [j for j in JOBS if j["slug"] in args.slug]
    else:
        print("未选择任务，使用 --all / --slug <slug> / --verify", file=sys.stderr)
        sys.exit(1)

    if args.verify:
        for j in selected:
            g = build_prompt(j)
            json.dumps(g)  # 可序列化校验
            print(f"  verify ok {j['slug']}: node5={len(g['5']['inputs']['text'])} chars, seed={g['8']['inputs']['seed']}")
        return

    progress = load_progress()
    for job in selected:
        slug = job["slug"]
        print(f"[{slug}] submit rating={job['rating']} seed={job['seed']}")
        try:
            pid = submit(job)
            progress[slug] = {"state": "running", "prompt_id": pid}
            save_progress(progress)
            h = wait_done(pid)
            files = copy_outputs(job, h)
            progress[slug] = {"state": "done", "prompt_id": pid, "files": files}
            save_progress(progress)
            print(f"  done -> {files}")
        except Exception as exc:  # noqa: BLE001
            progress[slug] = {"state": "error", "error": str(exc)}
            save_progress(progress)
            print(f"  ERROR: {exc}", file=sys.stderr)


if __name__ == "__main__":
    main()
