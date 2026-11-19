// 把已入库的 gen50 作品 WebP 拼成一张带编号/场景名/分级角标的总览图。
// 自动读方案 JSON 与进度文件，按 g → s → n 顺序排列。
// 用法：node scripts/make-overview.mjs [输出路径]
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'outputs', 'gen50-progress-overview.webp');

const plan = JSON.parse(await readFile(path.join(ROOT, 'scripts/.anima-50-jobs.json'), 'utf8'));
const progress = JSON.parse(await readFile(path.join(ROOT, 'scripts/.gen50-progress.json'), 'utf8'));

const jobs = plan.filter((j) => progress[j.slug]?.state === 'done');
const COLS = 5;
const ROWS = Math.ceil(jobs.length / COLS);
const TILE_W = 300;
const IMG_H = 438;
const LABEL_H = 46;
const GAP = 16;
const HEADER_H = 112;
const W = COLS * TILE_W + (COLS + 1) * GAP;
const H = HEADER_H + ROWS * (IMG_H + LABEL_H) + (ROWS + 1) * GAP;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = 'Noto Sans CJK SC, Noto Sans CJK JP, sans-serif';

const byRating = { general: 0, sensitive: 0, nsfw: 0 };
for (const j of jobs) byRating[j.rating] = (byRating[j.rating] || 0) + 1;
const pct = Math.round((jobs.length / plan.length) * 100);
const RATING_COLOR = { general: '#7c5cff', sensitive: '#e8913a', nsfw: '#e0506b' };

const header = `<svg width="${W}" height="${HEADER_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${HEADER_H}" fill="#12141a"/>
  <text x="32" y="50" font-family="${FONT}" font-size="34" font-weight="700" fill="#ffffff">ANIMA · 50 张精细绘图进度总览</text>
  <text x="32" y="84" font-family="${FONT}" font-size="19" fill="#9aa0b5">已完成 ${jobs.length} / ${plan.length}　·　general ${byRating.general}　·　sensitive ${byRating.sensitive}　·　nsfw ${byRating.nsfw}</text>
  <rect x="${W - 332}" y="38" width="300" height="12" rx="6" fill="#2a2e3a"/>
  <rect x="${W - 332}" y="38" width="${Math.round(300 * pct / 100)}" height="12" rx="6" fill="#7c5cff"/>
  <text x="${W - 332}" y="82" font-family="${FONT}" font-size="20" font-weight="700" fill="#b9a8ff">${pct}%</text>
</svg>`;

const composites = [{ input: Buffer.from(header), top: 0, left: 0 }];

for (let idx = 0; idx < jobs.length; idx++) {
  const job = jobs[idx];
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = GAP + col * (TILE_W + GAP);
  const y = HEADER_H + GAP + row * (IMG_H + LABEL_H + GAP);
  const img = path.join(ROOT, 'src/assets/works', job.slug, '01.webp');

  const thumb = await sharp(img).resize(TILE_W, IMG_H, { fit: 'cover', position: 'centre' }).toBuffer();
  composites.push({ input: thumb, top: y, left: x });

  const num = job.slug.replace('gen50-', '');
  const color = RATING_COLOR[job.rating] || '#7c5cff';
  const scene = esc(job.scene);
  const label = `<svg width="${TILE_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${TILE_W}" height="${LABEL_H}" rx="8" fill="#1c1f28"/>
    <rect x="10" y="11" width="46" height="24" rx="6" fill="${color}"/>
    <text x="33" y="29" font-family="${FONT}" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">${num}</text>
    <text x="66" y="30" font-family="${FONT}" font-size="19" fill="#e8e8ef">${scene}</text>
  </svg>`;
  composites.push({ input: Buffer.from(label), top: y + IMG_H, left: x });
}

await mkdir(path.dirname(OUT), { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: '#12141a' } })
  .composite(composites)
  .webp({ quality: 90 })
  .toFile(OUT);

console.log(`已生成：${OUT} (${W}x${H}, ${jobs.length} 张)`);
