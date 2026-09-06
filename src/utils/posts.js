import { getCollection } from "astro:content";

/** @typedef {import("astro:content").CollectionEntry<"posts">} Post */

/**
 * @returns {Promise<Post[]>}
 */
export async function getPublishedPostsSorted() {
  const posts = await getCollection("posts", (post) => !post.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * 依中日韓字元數與拉丁單字數估算閱讀時間（分鐘）。
 * @param {string} body 文章正文（Markdown 原始內容）
 * @returns {number} 估算閱讀時間，最少 1 分鐘
 */
export function calculateReadingTime(body) {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWordCount = (
    text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? []
  ).length;

  return Math.max(1, Math.ceil(cjkCount / 400 + latinWordCount / 200));
}

/**
 * 取得文章描述：優先使用 frontmatter 的 description，缺少時退回內文第一個非空行。
 * @param {{data: {description?: string}, body?: string}} post 文章集合項目
 * @returns {string} 文章描述文字（可能包含 Markdown 語法，需要純文字時請搭配 toPlainTextExcerpt）
 */
export function getPostDescription(post) {
  if (post.data.description) {
    return post.data.description;
  }

  return (post.body ?? "").split("\n").find((line) => line.trim()) ?? "";
}
