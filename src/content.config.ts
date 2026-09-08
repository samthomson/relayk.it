import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * All site content lives in src/content. Collections drive the docs sidebar
 * (see src/lib/nav.ts) — add a file, it appears in the nav.
 */

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  /** Sort order within its sidebar section. */
  order: z.number().default(99),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: baseSchema.extend({
    /** Which sidebar section a top-level page belongs to. */
    section: z.enum(['start', 'reference']),
  }),
});

const features = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: './src/content/features' }),
  schema: baseSchema,
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: baseSchema.extend({
    /** One-line pitch shown on cards and the comparison table. */
    tagline: z.string(),
    /** Service category: relay, media, gateway, tools… */
    type: z.string(),
    /** Upstream project homepage. */
    repo: z.string().url().optional(),
    /** NIPs this service is relevant to, e.g. ["NIP-01", "NIP-11"]. */
    nips: z.array(z.string()).default([]),
    /** Screenshots/videos in public/media, rendered on the page when present. */
    media: z.array(z.string()).default([]),
  }),
});

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: baseSchema,
});

export const collections = { pages, features, services, apps };
