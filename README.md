# 個人部落格（Astro 7 + Tailwind 4）

以 Astro 7 建置的靜態部落格，文章內容來自 `src/content/posts` 的 Markdown 檔，並運用 Tailwind CSS 4（透過 Vite plugin）進行樣式客製化。字型透過 Astro 內建的 Fonts API 於 build 時下載並自架（毋須安裝 `@fontsource` 套件）：拉丁文字使用 Inter / Outfit / JetBrains Mono，中文使用思源黑體（Noto Sans TC），並以 `unicode-range` 子集化按需載入；同時整合了目錄（TOC）、RSS、Sitemap 等功能，打造高效能且 SEO 友善的個人網站。

## 主要特色

- **核心架構**：Astro 7 + Tailwind CSS 4 + JavaScript
- **內容管理**：使用 Content Collections 管理 Markdown 文章，具備 Zod 資料驗證
- **效能優化**：靜態生成（SSG）、本地字型、RSS 與 Sitemap 自動輸出
- **閱讀體驗**：
  - 自動生成目錄（TOC），支援桌面版固定目錄與行動版彈出選單
  - 閱讀時間估算與文章摘要自動生成
  - 簡潔深色介面，適合長時間閱讀與維護
- **SEO 與分享**：
  - 完整的 Open Graph 與 Twitter Card 設定
  - 自動生成 `sitemap-index.xml` 與 `rss.xml`

## 環境需求

- Node.js 18.17 以上（建議使用 LTS 版本）
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

## 專案結構

```bash
src/
├── components/   # UI 元件 (PostCard, TableOfContents...)
├── content/      # 文章內容 (Content Collections)
│   └── posts/    # Markdown 檔案
├── layouts/      # 頁面佈局 (BaseLayout)
├── pages/        # 頁面路由 (首頁, 文章內頁, 標籤頁)
├── scripts/      # 客戶端腳本 (例如 TOC 邏輯)
├── styles/       # 全域樣式與字型設定
└── utils/        # 工具函式與站台設定 (日期, 標籤, 摘要, metadata)
```

## 新增文章指南

文章位於 `src/content/posts`，每個 Markdown 檔案對應一篇文章。

### Frontmatter 格式

```markdown
---
title: 我的新文章標題
description: （選填）未填則自動擷取內文第一段
date: 2025-01-27
tags: [Astro, 前端]
cover: ../assets/cover.png # （選填）封面圖片
category: learning
draft: false # （選填）設為 true 則不會發布
---

這裡開始撰寫正文內容...
```

### 撰寫建議

- **圖片**：建議將圖片放於 `src/assets` 並以相對路徑引用，Astro 會自動優化。
- **標籤**：系統會自動將標籤轉為小寫並移除特殊符號（Slugify），自動生成對應的 `/tags/[tag]/` 頁面。
- **目錄**：文章內頁會自動解析 `h2` 與 `h3` 標題生成目錄。

## 部署

本專案為靜態輸出（Astro 預設的 `static` 模式），可部署至任何靜態主機（如 Cloudflare Pages, Vercel, Netlify）。

```bash
npm run build
```

建置完成後，將 `dist` 資料夾內容上傳即可。
