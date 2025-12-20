export function slugifyTag(tag: string): string {
  const trimmed = tag.trim();
  const normalized = trimmed
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || trimmed;
}
