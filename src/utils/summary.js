/**
 * 將文字（可能含 Markdown 語法）去除連結與標記符號後，壓成單行純文字摘要。
 * @param {string} text 原始文字，可能含 Markdown 語法
 * @param {number} [maxLength=160] 摘要最大字元數
 * @returns {string} 去除 Markdown 語法並裁切長度後的純文字摘要
 */
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
