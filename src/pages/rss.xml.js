import rss from "@astrojs/rss";
import { getPublishedPostsSorted } from "../utils/posts";
import { site } from "../utils/site";

export async function GET(context) {
  const posts = await getPublishedPostsSorted();
  return rss({
    title: site.title,
    description: site.description,
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
