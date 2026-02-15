import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      category: z.enum([
        "learning",
        "tech-deep-dive",
        "career",
        "project",
        "web-basics",
        "frontend",
      ]),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
