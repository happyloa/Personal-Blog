export const toPlainTextExcerpt = (
  text: string,
  maxLength = 160,
): string => {
  if (!text) return "";

  const stripMarkdownLinks = (value: string): string =>
    value.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

  return stripMarkdownLinks(text)
    .replace(/[#>*-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};
