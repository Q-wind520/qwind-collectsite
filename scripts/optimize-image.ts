import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const [input, outputPath] = process.argv.slice(2);
if (!input || !outputPath) {
  console.error('Usage: pnpm optimize-image <input> <output.webp>');
  process.exit(1);
}

await mkdir(dirname(outputPath), { recursive: true });
await sharp(input)
  .rotate()
  .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(outputPath);

console.log(`optimized ${input} -> ${outputPath}`);
