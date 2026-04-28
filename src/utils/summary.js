export const toPlainTextExcerpt = (
  text,
  maxLength = 160,
) => {
  if (!text) return "";

  // 先去除連結語法再壓成純文字與固定長度，避免摘要帶有 Markdown 雜訊影響可讀性。
  const stripMarkdownLinks = (value) =>
    value.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

  return stripMarkdownLinks(text)
    .replace(/[#>*-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};
