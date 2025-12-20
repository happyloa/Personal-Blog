export const stripMarkdownLinks = (text: string): string =>
  text.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

export const toPlainTextExcerpt = (
  text: string,
  maxLength = 160,
): string => {
  if (!text) return "";

  return stripMarkdownLinks(text)
    .replace(/[#>*-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};
