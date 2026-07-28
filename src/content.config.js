import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      // 內容有實質修訂時填寫，會反映在 dateModified、article:modified_time 與 sitemap 的 lastmod。
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      category: z.enum([
        "learning",
        "tech-deep-dive",
        "career",
        "project",
        "web-basics",
        "mindset",
      ]),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
