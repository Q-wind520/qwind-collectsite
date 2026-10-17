import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const palettes = [
  ['#fbcfe8', '#f472b6', '#831843'],
  ['#bae6fd', '#38bdf8', '#0c4a6e'],
  ['#ddd6fe', '#a78bfa', '#4c1d95'],
  ['#fde68a', '#f59e0b', '#78350f'],
];

const makeSvg = (a, b, c, label) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <circle cx="300" cy="280" r="220" fill="#fff" opacity=".18"/>
  <circle cx="900" cy="600" r="300" fill="#fff" opacity=".1"/>
  <text x="60" y="830" fill="#fff" font-size="42" font-family="sans-serif" opacity=".85">${label}</text>
</svg>`;

const files = [
  ['src/assets/works/example-work/01.webp', 0, 'SAMPLE 01'],
  ['src/assets/works/example-work/02.webp', 1, 'SAMPLE 02'],
  ['src/assets/works/second-work/01.webp', 2, 'SAMPLE 03'],
  ['src/assets/works/protected-work/01.webp', 3, 'LOCKED'],
];

for (const [path, index, label] of files) {
  await mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
  const [a, b, c] = palettes[index];
  await sharp(Buffer.from(makeSvg(a, b, c, label))).webp({ quality: 82 }).toFile(path);
}

await mkdir('public/files', { recursive: true });
await writeFile('public/files/example.txt', 'This is a sample file for the collection.\n', 'utf8');

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#f9a8d4"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#312e81"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="300" text-anchor="middle" font-size="64" font-family="sans-serif" fill="#fff">QwQwind Archive</text>
  <text x="600" y="370" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#fff" opacity=".8">Images, Artists &amp; Notes</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-default.png');

console.log('placeholders written');
