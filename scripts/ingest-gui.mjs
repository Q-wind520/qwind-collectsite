#!/usr/bin/env node
/**
 * 图形化入库工具（本地服务）
 *
 * 用法：node scripts/ingest-gui.mjs [--port 8790]
 * 浏览器打开：http://127.0.0.1:8790
 *
 * 只做本地入库：压缩图片为 WebP + 写入作品 Markdown 条目。
 * 不负责发布/部署，发布仍由用户自行 git push。
 * 分级选项与 content.config.ts 的 schema 一致：general / sensitive / nsfw / r18g。
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(__dirname, 'ingest-gui.html');
const WORKS_DIR = path.join(ROOT, 'src/content/works');
const ASSETS_DIR = path.join(ROOT, 'src/assets/works');

const COMFY = 'http://172.17.0.1:8190';
const COMFY_OUT = '/home/qwind/.cache/anima-comfyui/output';

// 简易 frontmatter 解析（不引入 gray-matter，避免 tsx/WASM 内存问题）
function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!m) return {};
  const out = {};
  let cur = null;
  for (const line of m[1].split('\n')) {
    const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (kv) { cur = kv[1]; out[cur] = kv[2].trim(); continue; }
    const sub = /^\s+([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (sub && cur) {
      out[cur] = out[cur] || {};
      out[cur][sub[1]] = sub[2].trim();
    }
  }
  return out;
}

function unquote(s) {
  if (typeof s !== 'string') return '';
  try { const v = JSON.parse(s); return typeof v === 'string' ? v : s; }
  catch { return s.replace(/^"|"$/g, '').replace(/\\"/g, '"'); }
}

async function comfyHistory() {
  const r = await fetch(`${COMFY}/history`, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`ComfyUI history HTTP ${r.status}`);
  return r.json();
}

const argPort = process.argv.indexOf('--port');
const PORT = argPort >= 0 ? Number(process.argv[argPort + 1]) : 8790;
const HOST = '127.0.0.1';

const DEFAULT_NEGATIVE =
  'worst quality, low quality, score_1, score_2, score_3, artist name, blurry, jpeg artifacts, ' +
  'chromatic aberration, watermark, signature, text, logo, nsfw, nude, naked, explicit, ' +
  'nipples, areola, panties, see-through, revealing clothes, child, loli, shota';

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;
const RATINGS = new Set(['general', 'sensitive', 'nsfw', 'r18g']);

function send(res, status, obj, type = 'application/json; charset=utf-8') {
  const body = type.includes('json') ? JSON.stringify(obj) : obj;
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': HOST === '127.0.0.1' ? '*' : HOST,
  });
  res.end(body);
}

function readBody(req, limit = 64 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('请求体过大（>64MB）'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function q(s) {
  return JSON.stringify(String(s ?? ''));
}

function buildMarkdown(f) {
  const tags = (Array.isArray(f.tags) ? f.tags : String(f.tags || '').split(/[,，]/))
    .map((t) => String(t).trim())
    .filter(Boolean);
  const artists = (Array.isArray(f.artists) ? f.artists : String(f.artists || '').split(/[,，]/))
    .map((a) => String(a).trim().replace(/^@/, '').replace(/\s+/g, '-'))
    .filter(Boolean);

  return [
    '---',
    `title: ${q(f.title || f.slug)}`,
    `slug: ${f.slug}`,
    `summary: ${q(f.summary || 'Anima Aesthetic v1.1 + Turbo LoRA 精细绘制')}`,
    'tags: [' + tags.map(q).join(', ') + ']',
    `createdAt: ${f.createdAt || new Date().toISOString().slice(0, 10)}`,
    'kind: painting',
    `tier: ${f.tier || 'refined'}`,
    `experiment: [${f.experiment || 'prompt'}]`,
    'artists: [' + artists.map(q).join(', ') + ']',
    'images:',
    `  - ../../assets/works/${f.slug}/01.webp`,
    'prompt:',
    `  positive: ${q(f.positive || '')}`,
    `  negative: ${q(f.negative || DEFAULT_NEGATIVE)}`,
    `  artist: ${q(f.artist || '')}`,
    `  character: ${q(f.character || '')}`,
    `  scene: ${q(f.scene || '')}`,
    `  model: ${q(f.model || 'Anima Aesthetic v1.1 + Turbo LoRA')}`,
    `rating: ${RATINGS.has(f.rating) ? f.rating : 'general'}`,
    '---',
    '',
  ].join('\n');
}

function validate(f) {
  const errs = [];
  if (!f.slug || !SLUG_RE.test(f.slug)) errs.push('slug 只能含小写字母、数字、连字符，且以字母或数字开头（最长 80 字符）');
  if (!f.title || !String(f.title).trim()) errs.push('title 不能为空');
  if (f.rating && !RATINGS.has(f.rating)) errs.push('rating 支持 general / sensitive / nsfw / r18g');
  if (!f.positive || !String(f.positive).trim()) errs.push('positive 提示词不能为空');
  return errs;
}

async function listSlugs() {
  const files = await fs.readdir(WORKS_DIR).catch(() => []);
  return files.filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const p = url.pathname;

  if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
    const html = await fs.readFile(HTML_PATH, 'utf8');
    return send(res, 200, html, 'text/html; charset=utf-8');
  }

  if (req.method === 'GET' && p === '/api/meta') {
    const slugs = await listSlugs();
    return send(res, 200, { ok: true, slugs, ratings: [...RATINGS], defaultNegative: DEFAULT_NEGATIVE });
  }

  // ComfyUI 当前会话的历史任务（提示词/seed/参数完整，服务重启会清空）
  if (req.method === 'GET' && p === '/api/history/comfy') {
    try {
      const h = await comfyHistory();
      const items = [];
      for (const [promptId, rec] of Object.entries(h)) {
        if (rec.status?.status_str !== 'success') continue;
        const nodes = rec.prompt?.[2] || {};
        const pos = nodes['5']?.inputs?.text || '';
        const neg = nodes['6']?.inputs?.text || '';
        const ks = nodes['8']?.inputs || {};
        const imgs = [];
        for (const outNode of Object.values(rec.outputs || {})) {
          for (const im of outNode.images || []) {
            imgs.push({ filename: im.filename, subfolder: im.subfolder, type: im.type });
          }
        }
        if (!imgs.length) continue;
        // 时间戳：从 status.messages 的 execution_start 取
        let ts = 0;
        for (const msg of rec.status?.messages || []) {
          if (msg[0] === 'execution_start' && msg[1]?.timestamp) { ts = msg[1].timestamp; break; }
        }
        items.push({
          source: 'comfy', id: promptId, ts,
          positive: pos, negative: neg,
          seed: ks.seed, steps: ks.steps, cfg: ks.cfg,
          sampler: ks.sampler_name, scheduler: ks.scheduler, denoise: ks.denoise,
          images: imgs,
          preview: imgs.find((i) => /upscaled/i.test(i.filename)) || imgs[0],
        });
      }
      items.sort((a, b) => b.ts - a.ts);
      return send(res, 200, { ok: true, count: items.length, items });
    } catch (e) {
      return send(res, 502, { ok: false, error: 'ComfyUI 不可用：' + e.message });
    }
  }

  // 已入库作品（含更早生成的，提示词完整；按文件时间倒序）
  if (req.method === 'GET' && p === '/api/history/works') {
    const files = await fs.readdir(WORKS_DIR).catch(() => []);
    const items = [];
    for (const f of files.filter((x) => x.endsWith('.md'))) {
      const slug = f.slice(0, -3);
      try {
        const text = await fs.readFile(path.join(WORKS_DIR, f), 'utf8');
        const fm = parseFrontmatter(text);
        const webp = path.join(ASSETS_DIR, slug, '01.webp');
        let mtime = 0;
        try { mtime = (await fs.stat(webp)).mtimeMs; } catch {}
        items.push({
          source: 'work', id: slug, slug, ts: Math.round(mtime),
          title: unquote(fm.title), rating: fm.rating || 'general',
          positive: unquote(fm.prompt?.positive), negative: unquote(fm.prompt?.negative),
          artist: unquote(fm.prompt?.artist), character: unquote(fm.prompt?.character),
          scene: unquote(fm.prompt?.scene), model: unquote(fm.prompt?.model),
          tags: String(fm.tags || '').replace(/^\[|\]$/g, '').split(/,\s*/).map(unquote).filter(Boolean),
          artists: String(fm.artists || '').replace(/^\[|\]$/g, '').split(/,\s*/).map(unquote).filter(Boolean),
          webp: `/api/work-image?slug=${encodeURIComponent(slug)}`,
        });
      } catch {}
    }
    items.sort((a, b) => b.ts - a.ts);
    return send(res, 200, { ok: true, count: items.length, items });
  }

  // 代理 ComfyUI 缩略图 / 已入库图片（避免前端跨域与文件权限问题）
  if (req.method === 'GET' && p === '/api/comfy-image') {
    const filename = url.searchParams.get('filename') || '';
    if (!/^[\w.\-]+$/.test(filename)) return send(res, 400, { ok: false, error: 'bad filename' });
    const subfolder = url.searchParams.get('subfolder') || '';
    try {
      const u = `${COMFY}/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=output`;
      const r = await fetch(u, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const buf = Buffer.from(await r.arrayBuffer());
      res.writeHead(200, { 'Content-Type': r.headers.get('content-type') || 'image/png', 'Cache-Control': 'no-store' });
      return res.end(buf);
    } catch (e) { return send(res, 502, { ok: false, error: e.message }); }
  }
  if (req.method === 'GET' && p === '/api/work-image') {
    const slug = url.searchParams.get('slug') || '';
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return send(res, 400, { ok: false, error: 'bad slug' });
    try {
      const buf = await fs.readFile(path.join(ASSETS_DIR, slug, '01.webp'));
      res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'no-store' });
      return res.end(buf);
    } catch (e) { return send(res, 404, { ok: false, error: e.message }); }
  }

  if (req.method === 'POST' && p === '/api/preview') {
    const body = JSON.parse(await readBody(req));
    return send(res, 200, { ok: true, markdown: buildMarkdown(body) });
  }

  if (req.method === 'POST' && p === '/api/ingest') {
    const body = JSON.parse(await readBody(req));
    const f = body.fields || {};
    const errs = validate(f);
    if (errs.length) return send(res, 400, { ok: false, errors: errs });

    const slugs = await listSlugs();
    if (slugs.includes(f.slug) && !body.overwrite) {
      return send(res, 409, { ok: false, error: `slug「${f.slug}」已存在`, exists: true });
    }

    if (!body.image || !/^data:image\/(png|jpeg|webp);base64,/.test(body.image)) {
      return send(res, 400, { ok: false, error: '缺少图片（支持 PNG / JPEG / WebP）' });
    }
    const b64 = body.image.slice(body.image.indexOf(',') + 1);
    const input = Buffer.from(b64, 'base64');

    const assetDir = path.join(ASSETS_DIR, f.slug);
    await fs.mkdir(assetDir, { recursive: true });
    const webpPath = path.join(assetDir, '01.webp');
    const info = await sharp(input)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpPath);

    const mdPath = path.join(WORKS_DIR, `${f.slug}.md`);
    await fs.writeFile(mdPath, buildMarkdown(f), 'utf8');

    return send(res, 200, {
      ok: true,
      slug: f.slug,
      md: path.relative(ROOT, mdPath),
      webp: path.relative(ROOT, webpPath),
      size: `${info.width}x${info.height}`,
      bytes: info.size,
    });
  }

  return send(res, 404, { ok: false, error: 'not_found' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    console.error('[error]', e);
    if (!res.headersSent) send(res, 500, { ok: false, error: e.message || String(e) });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`入库工具已启动：http://${HOST}:${PORT}`);
  console.log(`项目根目录：${ROOT}`);
});
