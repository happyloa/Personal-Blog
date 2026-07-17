// 分類定義
export const categories = [
  {
    slug: "learning",
    name: "學習筆記",
    description: "技術學習、課程回顧、技巧整理",
    icon: "📚",
  },
  {
    slug: "tech-deep-dive",
    name: "技術探索",
    description: "深入原理、系統設計、效能優化",
    icon: "🔬",
  },
  {
    slug: "career",
    name: "職涯隨筆",
    description: "工作經驗、遠端工作、職涯分享",
    icon: "💼",
  },
  {
    slug: "project",
    name: "專案紀錄",
    description: "開發過程、踩坑記錄、技術選型",
    icon: "🛠️",
  },
  {
    slug: "web-basics",
    name: "網頁基礎",
    description: "用生活化比喻，帶你輕鬆搞懂網頁與網路的核心觀念",
    icon: "🌐",
  },
  {
    slug: "mindset",
    name: "心理",
    description: "心理調適、軟實力與個人成長",
    icon: "🫶",
  },
];

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

/**
 * 依 slug 查詢分類定義。
 * @param {string} slug 分類 slug（對應 content.config.js 的 category 列舉值）
 * @returns {{slug: string, name: string, description: string, icon: string} | undefined} 對應的分類定義，查無則回傳 undefined
 */
export function getCategoryBySlug(slug) {
  return categoryMap.get(slug);
}

/**
 * 統計每個分類的文章數量（首頁與分類索引共用）。
 * @param {Array<{data: {category: string}}>} posts 已發布文章集合
 * @returns {Map<string, number>} 以分類 slug 為 key 的文章數量統計
 */
export function getCategoryCounts(posts) {
  const counts = new Map();

  posts.forEach((post) => {
    counts.set(post.data.category, (counts.get(post.data.category) || 0) + 1);
  });

  return counts;
}
