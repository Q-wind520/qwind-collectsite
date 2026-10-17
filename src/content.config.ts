import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const base = {
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  summary: z.string().max(200).optional(),
  tags: z.array(z.string().min(1)).default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  protected: z.boolean().default(false),
  sourceUrl: z.url().optional(),
  license: z.string().optional(),
  related: z.array(z.string()).default([]),
};

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...base,
    kind: z.enum(['painting', 'style', 'composition']).default('painting'),
    images: z.array(image()).min(1),
    prompt: z.object({
      positive: z.string().default(''),
      negative: z.string().default(''),
      artist: z.string().optional(),
      character: z.string().optional(),
      scene: z.string().optional(),
      model: z.string().optional(),
    }),
    artists: z.array(reference('artists')).default([]),
    rating: z.enum(['general', 'sensitive', 'nsfw', 'r18g']).default('general'),
    originalUrl: z.url().optional(),
  }),
});

const artists = defineCollection({
  loader: glob({ base: './src/content/artists', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...base,
    avatar: image().optional(),
    artistTag: z.string().min(1),
    aliases: z.array(z.string()).default([]),
    relatedTags: z.array(z.string()).default([]),
    externalLinks: z.array(z.object({
      label: z.string(),
      url: z.url(),
    })).default([]),
    notes: z.string().optional(),
  }),
});

const links = defineCollection({
  loader: glob({ base: './src/content/links', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    url: z.url(),
    favicon: z.url().optional(),
    description: z.string().max(300).optional(),
    archivedUrl: z.url().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    readingTime: z.number().optional(),
    toc: z.boolean().default(true),
  }),
});

const files = defineCollection({
  loader: glob({ base: './src/content/files', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...base,
    filePath: z.string().min(1),
    size: z.number().optional(),
    mime: z.string().optional(),
    preview: image().optional(),
    sha256: z.string().optional(),
    external: z.boolean().default(false),
  }),
});

export const collections = { works, artists, links, notes, files };
