import rss from "@astrojs/rss";
import { getPublishedPostsSorted } from "../utils/posts";

export async function GET(context) {
  const posts = await getPublishedPostsSorted();
  return rss({
    title: "Aaron 的部落格",
    description: "用 Astro 打造、部署到 Cloudflare Pages 的全新部落格",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-Hant</language>`,
  });
}
