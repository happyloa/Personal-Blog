// 分類定義
export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
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
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryMap.get(slug);
}

export type CategorySlug =
  | "learning"
  | "tech-deep-dive"
  | "career"
  | "project"
  | "web-basics";
