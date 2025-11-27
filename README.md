# 個人部落格（Astro + Tailwind）

以 Astro 5 建置的靜態部落格，文章內容來自 `src/content/posts` 的 Markdown 檔，並運用 Tailwind CSS 進行樣式客製化。以下說明如何在本地端啟動，以及撰寫新文章時的建議流程。

## 環境需求
- Node.js 18.17 以上（建議使用 LTS 版本）
- npm 10 以上（Node.js 內建）

## 本地開發流程
1. 安裝相依套件
   ```bash
   npm install
   ```
2. 啟動開發伺服器（預設埠號為 4321，並支援熱重新整理）
   ```bash
   npm run dev
   ```
3. 建置與預覽（選擇性）
   ```bash
   npm run build   # 產生靜態輸出
   npm run preview # 以本地伺服器預覽 build 結果
   ```
4. 型別與設定檢查（選擇性）
   ```bash
   npm run check
   ```

## 新增文章指南
- 文章位於 `src/content/posts`，每個 Markdown 檔案對應一篇文章，檔名會成為文章的 slug（網址的一部分）。
- Frontmatter 必填與常用欄位如下，可依範例建立新檔案：
  ```markdown
  ---
  title: 我的新文章標題
  description: （選填）列表摘要，未填則會擷取正文前幾行
  date: 2024-12-01 10:00:00   # 用於排序與顯示，請維持可被 Date 解析的格式
  tags: [astro, tailwind]     # 標籤陣列，會自動生成 /tags/<tag>/ 頁面
  cover: ../assets/cover.png  # （選填）封面圖片，放置於專案可匯入的路徑
  draft: false                # 草稿請設為 true，正式發布記得改為 false
  ---
  
  這裡開始撰寫正文內容，可使用 Markdown 語法。
  ```

### 標籤（tags）注意事項
- `tags` 是字串陣列，頁面會直接以字面值生成 `/tags/<tag>/` URL，請盡量使用 URL 友善的寫法（如英文小寫加連字號）。
- 若要新增全新標籤，只需在 Frontmatter 加入對應字串；系統會於建置時自動建立標籤彙整頁面，無需額外設定。

### 草稿與發布
- `draft: true` 的文章不會出現在首頁、標籤列表或文章頁的靜態路由中。準備發布時，將 `draft` 改為 `false` 並確認 `date` 已設定，以確保排序與顯示正常。

### 其他撰寫建議
- 文章摘要：列表會優先使用 `description`，未填時會擷取正文的第一段文字並截斷至約 160 字元。
- 日期排序：首頁與標籤頁會依 `date` 由新到舊排序，未設定日期的文章會排在後面且顯示「未設定日期」。
- 連結與資源：若使用圖片或附件，請將檔案放於可被 Astro 匯入的路徑（例如 `src/assets`），並以相對路徑引用。

完成以上設定後提交 Markdown 檔案即可，建置時會自動生成對應的文章頁與標籤頁。
