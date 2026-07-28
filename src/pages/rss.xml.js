import rss from "@astrojs/rss";
import { getPostDescription, getPublishedPostsSorted } from "../utils/posts";
import { toPlainTextExcerpt } from "../utils/summary";
import { site } from "../utils/site";

export async function GET(context) {
  const posts = await getPublishedPostsSorted();
  const feedURL = new URL("/rss.xml", context.site).href;
  // 最新一篇的日期即為 feed 的最後更新時間；沒有文章時退回目前時間。
  const latest = posts[0]?.data.updated ?? posts[0]?.data.date ?? new Date();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: toPlainTextExcerpt(getPostDescription(post)),
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    // atom:link rel="self" 與 lastBuildDate 是 W3C Feed Validator 的建議項目，
    // 前者讓閱讀器知道 feed 的正規位置，後者避免每次抓取都當成有更新。
    customData: [
      `<language>zh-tw</language>`,
      `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>`,
      `<atom:link href="${feedURL}" rel="self" type="application/rss+xml" />`,
    ].join(""),
  });
}
