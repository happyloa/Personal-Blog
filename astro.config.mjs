import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindvite from "@tailwindcss/vite";

export default defineConfig({
  site: "https://blog.worksbyaaron.com",
  integrations: [sitemap()],
  // 使用 Astro 內建 Fonts API：在 build 時下載並自架字型，毋須安裝 @fontsource 套件。
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
    {
      // 思源黑體（繁體）：中文內文與標題字型。
      provider: fontProviders.google(),
      name: "Noto Sans TC",
      cssVariable: "--font-noto-tc",
      weights: [400, 500, 700],
      fallbacks: [],
      optimizedFallbacks: false,
    },
  ],
  vite: {
    plugins: [tailwindvite()],
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
