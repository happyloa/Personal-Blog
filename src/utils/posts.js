import { getCollection } from "astro:content";

const defaultFilter = (post) => !post.data.draft;

const defaultSort = (a, b) => {
  const aDate = a.data.date ? new Date(a.data.date).getTime() : 0;
  const bDate = b.data.date ? new Date(b.data.date).getTime() : 0;
  return bDate - aDate;
};

export async function getPublishedPostsSorted(options = {}) {
  const { filter, sort } = options;
  const posts = await getCollection("posts", (post) => {
    if (!defaultFilter(post)) {
      return false;
    }
    return filter ? filter(post) : true;
  });

  return posts.sort(sort ?? defaultSort);
}

export function calculateReadingTime(body) {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWordCount = (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? [])
    .length;

  return Math.max(1, Math.ceil(cjkCount / 400 + latinWordCount / 200));
}

export function getPostDescription(post) {
  if (post.data.description) {
    return post.data.description;
  }

  return (post.body ?? "").split("\n").find((line) => line.trim()) ?? "";
}
