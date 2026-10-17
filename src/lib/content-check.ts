export type ContentFile = {
  file: string;
  slug: string;
  rating?: string;
  protected?: boolean;
};

export function validateContentFiles(entries: ContentFile[]): void {
  const seen = new Map<string, string>();

  for (const entry of entries) {
    const filename = entry.file.split('/').pop()?.replace(/\.(md|mdx)$/, '') ?? '';
    if (filename !== entry.slug) {
      throw new Error(`Slug mismatch: ${entry.file} declares "${entry.slug}"`);
    }
    if ((entry.rating === 'nsfw' || entry.rating === 'r18g') && !entry.protected) {
      throw new Error(`NSFW/R18G work must be protected: ${entry.file}`);
    }
    const existing = seen.get(entry.slug);
    if (existing) {
      throw new Error(`Duplicate slug "${entry.slug}" in ${existing} and ${entry.file}`);
    }
    seen.set(entry.slug, entry.file);
  }
}
