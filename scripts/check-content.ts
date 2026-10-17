import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { validateContentFiles, type ContentFile } from '../src/lib/content-check';

const COLLECTIONS = ['works', 'artists', 'links', 'notes', 'files'] as const;
const entries: ContentFile[] = [];

for (const collection of COLLECTIONS) {
  const dir = `src/content/${collection}`;
  const files = (await readdir(dir, { recursive: true }))
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => `${dir}/${file}`);

  for (const file of files) {
    const parsed = matter(await readFile(file, 'utf8'));
    entries.push({
      file,
      slug: String(parsed.data.slug ?? ''),
      rating: parsed.data.rating ? String(parsed.data.rating) : undefined,
      protected: Boolean(parsed.data.protected),
    });
  }
}

validateContentFiles(entries);
console.log(`content check: ${entries.length} entries ok`);
