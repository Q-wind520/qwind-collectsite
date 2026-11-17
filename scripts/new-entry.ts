import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { slugFromTitle } from '../src/lib/slug';
import {
  WORK_EXPERIMENTS,
  WORK_KINDS,
  WORK_TIERS,
  type WorkExperiment,
  type WorkKind,
  type WorkTier,
} from '../src/lib/work-meta';

const TYPES = {
  work: { dir: 'works', ext: 'md' },
  artist: { dir: 'artists', ext: 'md' },
  link: { dir: 'links', ext: 'md' },
  note: { dir: 'notes', ext: 'mdx' },
  file: { dir: 'files', ext: 'md' },
} as const;

type EntryType = keyof typeof TYPES;

function readFlag(args: string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

async function main() {
  const [rawType, ...args] = process.argv.slice(2);
  if (!rawType || !(rawType in TYPES)) {
    console.error('Usage: pnpm new <work|artist|link|note|file> [--title ...] [--slug ...] [--tags ...] [--kind painting|style|composition] [--tier sketch|refined|showcase] [--experiment prompt,lora]');
    process.exit(1);
  }
  const type = rawType as EntryType;
  const rl = createInterface({ input, output });

  const title = readFlag(args, 'title') ?? (await rl.question('标题: '));
  const slugInput = readFlag(args, 'slug') ?? (await rl.question('slug（小写字母/数字/连字符）: '));
  const slug = slugInput || slugFromTitle(title);
  if (!slug) {
    console.error('无法从标题生成 slug，请显式传入 --slug。');
    process.exit(1);
  }
  const tags = (readFlag(args, 'tags') ?? (await rl.question('标签（逗号分隔，可留空）: ')))
    .split(',').map((tag) => tag.trim()).filter(Boolean);
  const summary = readFlag(args, 'summary') ?? '';
  const date = readFlag(args, 'date') ?? new Date().toISOString().slice(0, 10);
  const kind = readFlag(args, 'kind') ?? 'painting';
  if (!WORK_KINDS.includes(kind as WorkKind)) {
    console.error(`kind 必须是 ${WORK_KINDS.join('、')}。`);
    process.exit(1);
  }
  const tier = readFlag(args, 'tier') ?? 'refined';
  if (!WORK_TIERS.includes(tier as WorkTier)) {
    console.error(`tier 必须是 ${WORK_TIERS.join('、')}。`);
    process.exit(1);
  }
  const experiments = (readFlag(args, 'experiment') ?? '')
    .split(',').map((experiment) => experiment.trim()).filter(Boolean);
  for (const experiment of experiments) {
    if (!WORK_EXPERIMENTS.includes(experiment as WorkExperiment)) {
      console.error(`experiment 必须是 ${WORK_EXPERIMENTS.join('、')} 中的值。`);
      process.exit(1);
    }
  }
  const url = readFlag(args, 'url') ?? (type === 'link' ? await rl.question('URL: ') : '');
  const artist = readFlag(args, 'artist');
  const scene = readFlag(args, 'scene');
  rl.close();

  const file = `src/content/${TYPES[type].dir}/${slug}.${TYPES[type].ext}`;
  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `slug: ${slug}`,
    ...(summary ? [`summary: ${JSON.stringify(summary)}`] : []),
    `tags: [${tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
    `createdAt: ${date}`,
  ];

  if (type === 'work') {
    await mkdir(`src/assets/works/${slug}`, { recursive: true });
    lines.push(`kind: ${kind}`);
    lines.push(`tier: ${tier}`);
    lines.push(`experiment: [${experiments.join(', ')}]`);
    lines.push('images:', `  - ../../assets/works/${slug}/01.webp`);
    lines.push('prompt:', '  positive: ""', '  negative: ""');
    if (artist) lines.push(`  artist: ${JSON.stringify(artist)}`);
    if (scene) lines.push(`  scene: ${JSON.stringify(scene)}`);
    lines.push('  model: "NAI v5"', 'rating: general');
    console.log(`把展示图放到 src/assets/works/${slug}/01.webp 后再构建。`);
  }
  if (type === 'artist') {
    lines.push(`artistTag: ${JSON.stringify(`artist:${slug}`)}`);
  }
  if (type === 'link') {
    if (!url) { console.error('链接条目必须提供 --url。'); process.exit(1); }
    lines.push(`url: ${JSON.stringify(url)}`);
  }
  if (type === 'file') {
    lines.push(`filePath: "/files/${slug}.txt"`, 'external: false');
  }
  lines.push('---', '');

  await writeFile(file, lines.join('\n'), 'utf8');
  console.log(`created ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
