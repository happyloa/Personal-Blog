export function slugifyTag(tag: string): string {
  const trimmed = tag.trim();
  const normalized = trimmed
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized) {
    return normalized;
  }

  if (trimmed) {
    return encodeURIComponent(trimmed);
  }

  return `tag-${hashTag(tag)}`;
}

function hashTag(tag: string): number {
  let hash = 5381;

  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 33) ^ tag.charCodeAt(i);
  }

  return hash >>> 0;
}
