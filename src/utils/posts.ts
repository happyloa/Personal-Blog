import { getCollection, type CollectionEntry } from "astro:content";

type PostEntry = CollectionEntry<"posts">;

type GetPublishedPostsOptions = {
  filter?: (post: PostEntry) => boolean;
  sort?: (a: PostEntry, b: PostEntry) => number;
};

const defaultFilter = (post: PostEntry) => !post.data.draft;

const defaultSort = (a: PostEntry, b: PostEntry) => {
  const aDate = a.data.date ? new Date(a.data.date).getTime() : 0;
  const bDate = b.data.date ? new Date(b.data.date).getTime() : 0;
  return bDate - aDate;
};

export async function getPublishedPostsSorted(
  options: GetPublishedPostsOptions = {},
) {
  const { filter, sort } = options;
  const posts = await getCollection("posts", (post) => {
    if (!defaultFilter(post)) {
      return false;
    }
    return filter ? filter(post) : true;
  });

  return posts.sort(sort ?? defaultSort);
}

/**
 * 計算文章閱讀時間 (以每分鐘 200 字估算)
 * @param body 文章內容
 * @returns 預估閱讀分鐘數
 */
export function calculateReadingTime(body: string): number {
  const wordCount = body.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

/**
 * 取得文章描述 (優先使用 frontmatter description，若無則抓取內文第一段)
 * @param post 文章物件
 * @returns 文章描述字串
 */
export function getPostDescription(post: PostEntry): string {
  if (post.data.description) {
    return post.data.description;
  }
  // 取內文首個非空行
  return post.body.split("\n").find((line) => line.trim()) ?? "";
}
