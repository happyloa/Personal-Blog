# 個人部落格（Astro 7 + Tailwind 4）

線上網址：**<https://blog.worksbyaaron.com>**

以 Astro 7 建置的靜態部落格，文章內容來自 `src/content/posts` 的 Markdown 檔，並運用 Tailwind CSS 4（透過 Vite plugin）進行樣式客製化。整合了目錄（TOC）、Mermaid 圖表、RSS、Sitemap 與結構化資料，打造高效能且 SEO 友善的個人網站。

字型採混合策略：

- **拉丁字型**（Inter / Outfit / JetBrains Mono）透過 Astro 內建的 Fonts API 於 build 時下載並自架，毋須安裝 `@fontsource` 套件。
- **中文思源黑體**（Noto Sans TC）走外部 Google Fonts `<link>`。自架時每一頁都要內嵌一份完整的 CJK `unicode-range` CSS（約 100KB 且無法跨頁快取），改用外部連結可讓這段 CSS 成為單一、可被瀏覽器跨頁快取的資源。

## 主要特色

- **核心架構**：Astro 7 + Tailwind CSS 4 + JavaScript（無 TypeScript）
- **內容管理**：使用 Content Collections 管理 Markdown 文章，具備 Zod 資料驗證
- **效能優化**：靜態生成（SSG）、字型自架、RSS 與 Sitemap 自動輸出
- **閱讀體驗**：
  - 自動生成目錄（TOC），支援桌面版固定目錄與行動版彈出選單
  - 閱讀時間估算與文章摘要自動生成
  - Mermaid 圖表支援
  - 簡潔深色介面，適合長時間閱讀與維護
- **SEO 與分享**：
  - 完整的 Open Graph 與 Twitter Card 設定
  - JSON-LD 結構化資料（WebSite / Person / BlogPosting / BreadcrumbList）
  - 自動生成 `sitemap-index.xml`（含 `lastmod`）與 `rss.xml`
  - 文章數少於 2 篇的標籤頁自動掛 `noindex` 並排除於 sitemap 之外

## 環境需求

- Node.js 22.12 以上（Astro 7 要求，建議使用 LTS 版本）
- npm 10 以上

## 本地開發流程

1. **安裝相依套件**

   ```bash
   npm install
   ```

2. **啟動開發伺服器**

   ```bash
   npm run dev
   ```

   預設埠號為 `4321`，支援熱重新整理（HMR）。

3. **建置與預覽**

   ```bash
   npm run build   # 產生靜態檔案至 dist 目錄
   npm run preview # 預覽 build 後的結果
   ```

4. **格式化**

   ```bash
   npm run format       # 用 Prettier 自動排版
   npm run format:check # 只檢查、不修改，CI 會跑這個
   ```

## 專案結構

```bash
src/
├── components/   # UI 元件 (PostCard, CategoryCard, TableOfContents)
├── content/      # 文章內容 (Content Collections)
│   └── posts/    # Markdown 檔案
├── layouts/      # 頁面佈局 (BaseLayout)
├── pages/        # 頁面路由 (首頁, 文章內頁, 分類頁, 標籤頁, RSS, 404)
├── scripts/      # 客戶端腳本 (TOC 與 Mermaid 邏輯)
├── styles/       # 全域樣式與字型設定
└── utils/        # 工具函式與站台設定 (日期, 分類, 標籤, 摘要, metadata)

public/
├── _headers      # Cloudflare Pages 的安全標頭與快取策略
├── images/posts/ # 文章內文圖片
├── robots.txt
├── favicon.svg
└── og-default.png
```

## 新增文章指南

文章位於 `src/content/posts`，每個 Markdown 檔案對應一篇文章，檔名即為網址 slug（請用全小寫英數與連字號）。

### Frontmatter 格式

```markdown
---
title: 我的新文章標題
description: （選填）未填則自動擷取內文第一段
date: 2026-01-27
updated: 2026-03-01 # （選填）內容有實質修訂時填寫，會反映在 sitemap 的 lastmod
tags: [Astro, 前端] # （選填）
category: learning # 必填，且只能是下表的六個值之一
cover: ../../assets/my-post-cover.png # （選填）封面圖片
draft: false # （選填）設為 true 則不會發布
---

這裡開始撰寫正文內容...
```

完整的 schema 定義在 [`src/content.config.js`](src/content.config.js)。

### 分類一覽

`category` 是唯一必填且值受限的欄位，只能填以下六個 slug：

| slug             | 顯示名稱 | 說明                                       |
| ---------------- | -------- | ------------------------------------------ |
| `learning`       | 學習筆記 | 技術學習、課程回顧、技巧整理               |
| `tech-deep-dive` | 技術探索 | 深入原理、系統設計、效能優化               |
| `career`         | 職涯隨筆 | 工作經驗、遠端工作、職涯分享               |
| `project`        | 專案紀錄 | 開發過程、踩坑記錄、技術選型               |
| `web-basics`     | 網頁基礎 | 用生活化比喻，帶你搞懂網頁與網路的核心觀念 |
| `mindset`        | 心理     | 心理調適、軟實力與個人成長                 |

**要新增分類的話，必須同時改兩個地方**，只改其中一個不會生效：

1. [`src/content.config.js`](src/content.config.js) 的 `category` `z.enum([...])` —— 少了這裡，填新分類的文章會在 build 時被 Zod 擋下。
2. [`src/utils/categories.js`](src/utils/categories.js) 的 `categories` 陣列 —— 少了這裡，`/categories/<slug>/` 頁面根本不會生成（`getStaticPaths` 是從這個陣列產生的）。

### 撰寫建議

- **站內連結**：一律寫成帶尾斜線的 `/posts/<slug>/`。本站使用 Astro 的 `directory` 輸出格式，少了尾斜線會多一次 308 轉址。
- **圖片**：
  - 文章內文圖片放在 `public/images/posts/<slug>/`，在 Markdown 中以絕對路徑引用（例如 `/images/posts/my-post/photo.webp`）。這個路徑**不會**經過 Astro 的圖片優化管線，請自行先壓縮／轉檔（建議 WebP）再上傳，並在 `<img>` 上明確標註 `width`／`height`／`loading="lazy"` 以避免版面位移。
  - frontmatter 的 `cover` 欄位走 Astro 內建的 `image()` 優化管線，圖片必須放在 `src/` 底下（例如自行建立 `src/assets/`），路徑相對於**文章檔案本身**解析，因此從 `src/content/posts/foo.md` 指到 `src/assets/` 要寫 `../../assets/cover.png`。
- **標籤**：系統會自動將標籤轉為小寫並移除特殊符號（slugify），自動生成對應的 `/tags/<tag>/` 頁面。若兩個不同標籤 slugify 後撞在一起（例如 `Vue.js` 與 `VueJS`），build 會直接失敗並指出衝突。
- **目錄**：文章內頁會自動解析 `h2` 與 `h3` 標題生成目錄。正文請從 `h2` 開始，`h1` 已由文章標題佔用。
- **Mermaid 圖表**：用 ` ```mermaid ` 圍欄即可，客戶端會自動轉譯，且只有含圖表的頁面才會下載 Mermaid（約 488KB）。
- **表格**：寬表格請包在 `<div class="table-wrapper" tabindex="0" role="region" aria-label="表格">` 裡，讓它在窄螢幕能水平捲動、且鍵盤使用者可以聚焦捲動。

## 部署

本專案為靜態輸出（Astro 預設的 `static` 模式），實際部署在 **Cloudflare Pages**。

```bash
npm run build
```

建置完成後，將 `dist` 資料夾內容上傳即可。

> **注意**：[`public/_headers`](public/_headers) 承載了整站的 CSP、HSTS 等安全標頭與 `/_astro/*` 的 immutable 快取策略。這是 Cloudflare Pages 與 Netlify 的專屬格式，**Vercel 不會讀取這個檔案**。若改用 Vercel，必須把內容改寫成 `vercel.json` 的 `headers` 設定，否則所有安全標頭與快取策略都會失效。

## 授權

- **程式碼**：MIT License
- **文章內容**（`src/content/` 與 `public/images/`）：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hant)

詳見 [LICENSE](LICENSE)。
