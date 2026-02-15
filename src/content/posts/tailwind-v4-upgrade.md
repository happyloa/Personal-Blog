---
title: Tailwind CSS v4 來了！速度更快、體積更小、寫法更自由
description: Tailwind v4 正式發布，帶來了效能的飛躍與更靈活的配置。不用再煩惱 tailwind.config.js，直接在 CSS 變數裡定義你的 Design System。
date: 2026-02-19
tags: [CSS, Tailwind]
category: learning
---

Tailwind CSS v4 是近年來最大的版本更新。它不再只是「好用的 Utility-First CSS」，而是一個經過重新設計的 CSS 引擎。

## 最大的改變：速度與體積

v4 拋棄了原本的 JavaScript 配置檔 (`tailwind.config.js`)，轉而直接使用 **CSS 變數**。這意味著：

1.  **編譯速度快 10 倍**：不需要等待繁重的 JS 解析。
2.  **更小的打包體積**：只打包你真正用到的樣式。

## 全新的配置方式

以前我們要定義顏色、斷點，都要去 `tailwind.config.js` 改。現在，直接在 CSS 檔裡用 `@theme` 區塊定義：

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #ff5722;
  --font-family-sans: "Inter", sans-serif;
  --spacing-128: 32rem;
}
```

然後你就可以直接用 `text-brand-primary` 或 `p-128`。

## 動態數值 (Dynamic Values)

以前如果我們要用一個特定的數值，例如 `w-[350px]`，Tailwind 會生成一個 class。現在 v4 的引擎更聰明，它能即時處理這些任意值，而且**支援 CSS 運算**。

```html
<div class="w-[calc(100%-20px)] bg-brand-primary/50">...</div>
```

注意那個 `/50`，現在透明度也可以直接接在自定義顏色後面了！

## 容器查詢 (Container Queries) 正式轉正

以前要用 `@tailwindcss/container-queries` 外掛，現在直接內建：

```html
<div class="@container">
  <div class="@lg:grid-cols-2 grid">
    <!-- 當父容器大於 lg 時變兩欄 -->
  </div>
</div>
```

## 3D 變換 (3D Transforms)

v4 增加了對 3D 屬性的支援：

```html
<div class="transform-3d rotate-x-12 rotate-y-24">...</div>
```

再也不用自己寫 `transform: rotateX(...)` 了。

## 升級指南

如果你還在用 v3，升級其實很無痛。官方提供了一個遷移工具：

```bash
npx @tailwindcss/upgrade@next
```

它會自動幫你把 `tailwind.config.js` 的設定轉換成新的 CSS 變數格式。

## 結語

Tailwind v4 把 CSS 開發體驗推向了另一個層次。它更接近原生 CSS (Native CSS)，同時保留了 Utility Class 的便利性。如果你還在觀望，現在絕對是入坑的好時機。

---

站內相關文章：

- [現代 CSS 功能](/posts/modern-css-features)
- [Figma to Code 工作流](/posts/figma-to-code-workflow)
