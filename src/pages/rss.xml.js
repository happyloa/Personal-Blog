import rss from "@astrojs/rss";
import { getPostDescription, getPublishedPostsSorted } from "../utils/posts";
import { toPlainTextExcerpt } from "../utils/summary";
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
      description: toPlainTextExcerpt(getPostDescription(post)),
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-tw</language>`,
  });
}
