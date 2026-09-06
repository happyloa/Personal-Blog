import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindvite from "@tailwindcss/vite";
import { slugifyTag } from "./src/utils/tags.js";

// astro.config 無法使用 astro:content 的 getCollection，因此直接讀 frontmatter，
// 取得 sitemap 需要的 lastmod，以及「只有一篇文章」的標籤（這些頁面掛了 noindex，
// 不應該再出現在 sitemap 裡，否則等於同時送出兩個互相矛盾的訊號）。
const POSTS_DIR = fileURLToPath(
  new URL("./src/content/posts", import.meta.url),
);

const postLastmod = new Map();
const tagCounts = new Map();
const categoryCounts = new Map();

for (const file of readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".md")) continue;

  const raw = readFileSync(`${POSTS_DIR}/${file}`, "utf8").replace(
    /^\uFEFF/,
    "",
  );
  const frontmatter = raw.split(/^---\s*$/m)[1] ?? "";
  /** @param {string} key */
  const field = (key) =>
    new RegExp(String.raw`^${key}:[ \t]*(.+)$`, "m")
      .exec(frontmatter)?.[1]
      ?.trim();

  if (field("draft") === "true") continue;

  const dateValue = field("updated") ?? field("date");
  const parsed = dateValue ? new Date(dateValue) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    postLastmod.set(`/posts/${file.replace(/\.md$/, "")}/`, parsed);
  }

  const tagList = field("tags")?.replace(/^\[|\]$/g, "") ?? "";
  for (const tag of tagList.split(",")) {
    const trimmed = tag.trim().replace(/^["']|["']$/g, "");
    if (!trimmed) continue;
    const slug = slugifyTag(trimmed);
    tagCounts.set(slug, (tagCounts.get(slug) ?? 0) + 1);
  }

  const category = field("category");
  if (category) {
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }
}

// 少於兩篇的列表頁會輸出 noindex（見 tags/[tag].astro 與 categories/[category].astro），
// 同時也要排除在 sitemap 之外，否則等於同時送出兩個互相矛盾的索引訊號。
const thinListingPaths = new Set([
  ...Array.from(tagCounts.entries())
    .filter(([, count]) => count < 2)
    .map(([slug]) => `/tags/${slug}/`),
  ...Array.from(categoryCounts.entries())
    .filter(([, count]) => count < 2)
    .map(([slug]) => `/categories/${slug}/`),
]);

export default defineConfig({
  site: "https://blog.worksbyaaron.com",
  integrations: [
    sitemap({
      // sitemap 給的是百分比編碼過的網址（中文標籤會變成 /tags/%E8%B3%87%E5%AE%89/），
      // 必須先解碼才能和 thinListingPaths 裡的原始 slug 比對。
      filter: (page) =>
        !thinListingPaths.has(decodeURIComponent(new URL(page).pathname)),
      serialize(item) {
        const lastmod = postLastmod.get(new URL(item.url).pathname);
        if (lastmod) {
          item.lastmod = lastmod.toISOString();
        }
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      // 單一深色主題。github-dark 的註解色 #6a737d 在本站程式碼底色（#0c0c10）上只有 4.05:1，
      // 未達 WCAG AA；github-dark-default 的 #8b949e 為 6.35:1。註解正是承載教學解說的部分。
      theme: "github-dark-default",
      transformers: [
        {
          // Shiki 會把主題底色寫成 <pre> 的 inline style，優先權高於任何樣式表，
          // 導致 global.css 的 .prose pre 底色永遠套不上。這裡把它拿掉，
          // 讓底色回歸 --color-code-surface 統一管理。
          pre(node) {
            const style = String(node.properties.style ?? "");
            node.properties.style = style
              .replace(/background-color:[^;]*;?/g, "")
              .trim();
          },
        },
      ],
    },
  },
  // 使用 Astro 內建 Fonts API：在 build 時下載並自架拉丁字型，毋須安裝 @fontsource 套件。
  // 中文思源黑體（Noto Sans TC）改回外部 Google Fonts <link>（見 BaseLayout.astro）：
  // 自架時每一頁都要內嵌一份完整的 CJK unicode-range CSS（約 103KB gzip 且無法跨頁快取），
  // 改用外部連結可讓這段 CSS 變成單一、可被瀏覽器跨頁/跨站快取的資源。
  // styles 一律限定 normal：站上沒有任何 <em>／italic 內文，預設會多產生一整套斜體 woff2
  // （約 85KB 永遠不會被下載使用），以及每頁 2KB 用不到的 inline @font-face。
  fonts: [
    // 拉丁字型不附加通用 fallback（sans-serif），讓中文能在字級串接中順位落到思源黑體；
    // 通用 fallback 統一在 global.css 的字型堆疊尾端補上。
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      fallbacks: [],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      weights: [600, 700],
      styles: ["normal"],
      fallbacks: [],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      weights: [400, 500],
      styles: ["normal"],
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
