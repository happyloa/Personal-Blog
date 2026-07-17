import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindvite from "@tailwindcss/vite";

export default defineConfig({
  site: "https://blog.worksbyaaron.com",
  integrations: [sitemap()],
  // 使用 Astro 內建 Fonts API：在 build 時下載並自架拉丁字型，毋須安裝 @fontsource 套件。
  // 中文思源黑體（Noto Sans TC）改回外部 Google Fonts <link>（見 BaseLayout.astro）：
  // 自架時每一頁都要內嵌一份完整的 CJK unicode-range CSS（約 103KB gzip 且無法跨頁快取），
  // 改用外部連結可讓這段 CSS 變成單一、可被瀏覽器跨頁/跨站快取的資源。
  fonts: [
    // 拉丁字型不附加通用 fallback（sans-serif），讓中文能在字級串接中順位落到思源黑體；
    // 通用 fallback 統一在 global.css 的字型堆疊尾端補上。
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600, 700],
      fallbacks: [],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      weights: [600, 700],
      fallbacks: [],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      weights: [400, 500],
      fallbacks: [],
      optimizedFallbacks: false,
    },
  ],
  vite: {
    plugins: [tailwindvite()],
    // 關閉小型腳本自動內嵌：Astro 預設會把體積小於 assetsInlineLimit 的 <script> chunk
    // 直接內嵌進 HTML（例如 TableOfContents 的 toc.js），這類 inline script 沒有 nonce/hash
    // 會被 public/_headers 的 CSP script-src 擋下。設為 0 讓所有腳本一律輸出成外部檔案，
    // 才能在不放寬 CSP、不必手動維護 hash 的情況下正常執行。
    build: {
      assetsInlineLimit: 0,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "viewport",
  },
});
