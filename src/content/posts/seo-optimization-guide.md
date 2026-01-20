---
title: 網站 SEO 優化攻略 — 從技術面提升搜尋排名的實戰經驗
date: 2023-01-10
tags: [SEO, GA4, GSC, 網站優化, 前端]
---

之前在啟程教育學院工作的時候，有一段時間專注在網站的 SEO 優化。當時成功讓 5 組商業關鍵字在 4 週內攻佔搜尋排名前 3，網站的自然流量也成長了 120%。這篇來分享一下從技術面做 SEO 優化的經驗。

## SEO 是什麼

SEO（Search Engine Optimization）就是讓網站在搜尋引擎上更容易被找到。當使用者搜尋某個關鍵字，你的網站能排在越前面，就越容易被點進來。

SEO 可以分成幾個面向：

- **技術 SEO**：網站結構、速度、爬蟲友善度
- **內容 SEO**：關鍵字、文章品質、使用者意圖
- **外部 SEO**：反向連結、社群訊號

這篇主要聚焦在技術面，因為這是前端工程師比較能掌控的部分。

## 基本的 HTML 結構

### Title 和 Meta Description

每個頁面都要有獨特的 title 和 description：

```html
<title>公司名稱 | 服務項目 - 簡短描述</title>
<meta
  name="description"
  content="這裡寫 150-160 字的頁面描述，要包含目標關鍵字" />
```

Title 建議控制在 60 個字元以內，Description 控制在 160 個字元以內，超過會被截斷。

### Heading 結構

一個頁面只能有一個 `<h1>`，通常是頁面的主標題。接下來用 `<h2>`、`<h3>` 來建立層級結構：

```html
<h1>主標題（包含主要關鍵字）</h1>
<h2>次標題</h2>
<h3>子標題</h3>
<h2>次標題</h2>
```

不要跳過層級，不要為了字體大小而用錯層級的 heading。

### 語意化標籤

用正確的 HTML5 語意標籤，讓搜尋引擎更容易理解網頁結構：

```html
<header>網站標頭</header>
<nav>導覽列</nav>
<main>主要內容</main>
<article>文章內容</article>
<aside>側邊欄</aside>
<footer>頁尾</footer>
```

## 網站速度優化

Google 已經明確表示網站速度是排名因素之一。速度慢不只影響使用者體驗，也會影響 SEO。

主要的優化方向：

- 圖片壓縮和正確的格式（WebP）
- CSS 和 JavaScript 壓縮
- 使用 CDN
- 開啟 Gzip/Brotli 壓縮
- 減少第三方腳本

這些在之前的 LCP 優化文章有詳細說明。

## 結構化資料

結構化資料（Schema.org）可以讓搜尋引擎更了解網頁內容，也可能讓搜尋結果顯示更豐富的資訊：

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "公司名稱",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png"
  }
</script>
```

常見的類型有 Organization、Article、Product、FAQ 等，根據頁面內容選擇適合的 schema。

## 行動裝置友善

Google 是以行動版作為索引的主要版本，所以網站一定要對行動裝置友善：

- RWD 響應式設計
- 點擊目標要夠大（至少 48px）
- 文字大小要易讀
- 不要用 Flash

可以用 Google 的[行動裝置相容性測試](https://search.google.com/test/mobile-friendly)來檢查。

## Sitemap 和 Robots.txt

### Sitemap

Sitemap 告訴搜尋引擎網站有哪些頁面：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-01</lastmod>
  </url>
</urlset>
```

大部分的 CMS 和框架都有自動產生 sitemap 的功能。

### Robots.txt

Robots.txt 告訴爬蟲哪些頁面可以爬、哪些不行：

```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml
```

## Google Search Console 設定

[Google Search Console](https://search.google.com/search-console)（GSC）是必備的工具，可以：

- 提交 sitemap
- 查看網站的搜尋表現
- 看到 Google 爬蟲遇到的問題
- 檢查特定網址的索引狀態

設定完成後，記得定期檢查有沒有錯誤需要處理。

## Google Analytics 追蹤

[Google Analytics 4](https://analytics.google.com/)（GA4）可以追蹤網站流量和使用者行為：

- 哪些頁面最多人看
- 使用者從哪裡來
- 跳出率和停留時間
- 轉換目標追蹤

這些數據可以幫助你了解 SEO 成效，也可以找出需要改善的地方。

## 持續監控和調整

SEO 不是做一次就好，需要持續監控和調整：

1. **定期檢查 GSC**：看看有沒有新的問題出現
2. **追蹤關鍵字排名**：可以用工具或手動搜尋來確認
3. **分析競爭對手**：看看排名前面的網站做了什麼
4. **更新內容**：舊的內容要定期更新，保持新鮮度

## 實務經驗

做過幾個 SEO 專案後，有些經驗可以分享：

1. **技術 SEO 是基礎**：技術面沒做好，內容再好也很難排上去

2. **內容還是最重要**：技術只是讓內容更容易被找到，最終還是要有好的內容

3. **不要只看排名**：排名只是過程，真正重要的是有沒有帶來實際的轉換

4. **SEO 需要時間**：不是今天做了明天就會有效果，通常要幾週到幾個月才會看到成效

5. **避免黑帽手法**：刷排名、隱藏文字這些黑帽手法可能短期有效，但一旦被 Google 發現就會被懲罰

## 結語

SEO 是一個持續的過程，不是做一次就結束。把基本的技術面做好，持續產出優質內容，定期監控和調整，長期下來一定會看到效果。
