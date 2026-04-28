# 個人部落格（Astro 6 + Tailwind 4）

以 Astro 6 建置的靜態部落格，文章內容來自 `src/content/posts` 的 Markdown 檔，並運用 Tailwind CSS 4（透過 Vite plugin）進行樣式客製化。採用本地端字型（`@fontsource-variable/noto-sans-tc`）優化載入效能，並整合了目錄（TOC）、RSS、Sitemap 等功能，打造高效能且 SEO 友善的個人網站。

## 主要特色

- **核心架構**：Astro 6 + Tailwind CSS 4 + JavaScript
- **內容管理**：使用 Content Collections 管理 Markdown 文章，具備 Zod 資料驗證
- **效能優化**：靜態生成（SSG）、圖片優化、字型預載
- **閱讀體驗**：
  - 自動生成目錄（TOC），支援桌面版懸浮與行動版彈出選單
  - 閱讀時間估算與文章摘要自動生成
  - 深色模式設計，長時間閱讀不刺眼
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
└── utils/        # 工具函式 (日期, 標籤, 摘要計算)
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
draft: false # （選填）設為 true 則不會發布
---

這裡開始撰寫正文內容...
```

### 撰寫建議

- **圖片**：建議將圖片放於 `src/assets` 並以相對路徑引用，Astro 會自動優化。
- **標籤**：系統會自動將標籤轉為小寫並移除特殊符號（Slugify），自動生成對應的 `/tags/[tag]/` 頁面。
- **目錄**：文章內頁會自動解析 `h2` 與 `h3` 標題生成目錄。

## 部署

本專案設定為 `output: "static"`，可部署至任何靜態主機（如 Cloudflare Pages, Vercel, Netlify）。

```bash
npm run build
```

建置完成後，將 `dist` 資料夾內容上傳即可。
