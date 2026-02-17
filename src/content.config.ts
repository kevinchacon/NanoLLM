import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tutorials = defineCollection({
	// Load Markdown and MDX files in the `src/content/tutorials/` directory.
	loader: glob({ base: './src/content/tutorials', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { tutorials };
