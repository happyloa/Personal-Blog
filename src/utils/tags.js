/**
 * 將標籤轉成適合放進 URL 的 slug（小寫英數與連字號）。
 * @param {string} tag 原始標籤文字
 * @returns {string} slug 化後的字串；若轉換後為空則退回原始文字
 */
export function slugifyTag(tag) {
  const trimmed = tag.trim();
  // 使用小寫英數與連字號的保守規則，確保 URL 乾淨且跨語系不易出錯。
  const normalized = trimmed
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || trimmed;
}

/**
 * 將文章依標籤 slug 分組（標籤內頁 getStaticPaths 共用），保留原本的文章排序。
 * 同一個 slug 以「第一次出現」的顯示名稱為準。
 * @param {Array<{data: {tags: string[]}}>} posts 已發布文章集合
 * @returns {Map<string, {slug: string, display: string, posts: Array}>} 以 slug 為 key 的分組結果
 */
export function getPostsByTag(posts) {
  const tagMap = new Map();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const slug = slugifyTag(tag);
      const existing = tagMap.get(slug);

      if (!existing) {
        tagMap.set(slug, { slug, display: tag, posts: [] });
      } else if (existing.display !== tag) {
        // slug 化會抹掉大小寫、空白與符號，因此「Vue.js」與「VueJS」會撞成同一個 slug，
        // 兩組標籤的文章會被靜默合併進同一頁。與其讓它悄悄發生，不如讓 build 直接失敗。
        throw new Error(
          `標籤 slug 衝突：「${existing.display}」與「${tag}」都會產生 /tags/${slug}/。` +
            `請統一用其中一種寫法（出現於 ${post.id}）。`,
        );
      }

      tagMap.get(slug).posts.push(post);
    });
  });

  return tagMap;
}

/**
 * 將文章集合彙整成依數量排序的標籤清單（首頁、標籤索引共用）。
 * 重用 getPostsByTag 的分組結果，避免兩份重複的走訪邏輯。
 * @param {Array<{data: {tags: string[]}}>} posts 已發布文章集合
 * @returns {Array<{slug: string, display: string, count: number}>} 依文章數量由多到少排序的標籤清單
 */
export function getAllTags(posts) {
  const tagMap = getPostsByTag(posts);

  return Array.from(tagMap.values())
    .map(({ slug, display, posts: taggedPosts }) => ({
      slug,
      display,
      count: taggedPosts.length,
    }))
    .sort((a, b) => b.count - a.count);
}
