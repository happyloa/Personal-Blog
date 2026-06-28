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

// 將文章集合彙整成依數量排序的標籤清單（首頁、標籤索引共用）。
// 同一個 slug 以「第一次出現」的顯示名稱為準。
export function getAllTags(posts) {
  const tagMap = new Map();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const slug = slugifyTag(tag);
      const current = tagMap.get(slug) ?? { slug, display: tag, count: 0 };
      tagMap.set(slug, { ...current, count: current.count + 1 });
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
}

// 將文章依標籤 slug 分組（標籤內頁 getStaticPaths 共用），保留原本的文章排序。
export function getPostsByTag(posts) {
  const tagMap = new Map();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const slug = slugifyTag(tag);
      if (!tagMap.has(slug)) {
        tagMap.set(slug, { slug, display: tag, posts: [] });
      }
      tagMap.get(slug).posts.push(post);
    });
  });

  return tagMap;
}
