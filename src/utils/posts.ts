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
  options: GetPublishedPostsOptions = {}
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
