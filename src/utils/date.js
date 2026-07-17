/**
 * 格式化日期為繁體中文格式 (e.g., "2023年1月1日" 或 "2023年 1月 1日" 視 locale 而定，這裡預設 zh-TW)
 * @param {string|Date} date 日期物件或字串
 * @returns {string} 格式化後的日期字串 (yyyy年M月d日)
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * 將日期轉換為 ISO 字串 (用於 <time datetime="...">)
 * @param {string|Date} date 日期物件或字串
 * @returns {string} ISO 格式日期字串
 */
export function toISODate(date) {
  return new Date(date).toISOString();
}
