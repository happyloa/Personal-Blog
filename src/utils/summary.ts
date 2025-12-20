export const toPlainTextExcerpt = (
  text: string,
  maxLength = 160,
): string => {
  if (!text) return "";

  // 先去除連結語法再壓成純文字與固定長度，避免摘要帶有 Markdown 雜訊影響可讀性。
  const stripMarkdownLinks = (value: string): string =>
    value.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

  return stripMarkdownLinks(text)
    .replace(/[#>*-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};
