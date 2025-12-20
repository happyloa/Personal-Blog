export function slugifyTag(tag: string): string {
  const normalized = tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized) {
    return normalized;
  }

  return encodeURIComponent(tag.trim().toLowerCase());
}
