import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return rss({
    title: "Aaron 的部落格",
    description: "用 Astro 打造、部署到 Cloudflare Pages 的全新部落格",
    site: context.site,
    items: posts
      .sort((a, b) => {
        const aDate = a.data.date ? new Date(a.data.date).getTime() : 0;
        const bDate = b.data.date ? new Date(b.data.date).getTime() : 0;
        return bDate - aDate;
      })
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date || new Date(),
        description: post.data.description,
        link: `/posts/${post.slug}/`,
      })),
    customData: `<language>zh-Hant</language>`,
  });
}
