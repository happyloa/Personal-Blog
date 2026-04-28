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
