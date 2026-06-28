import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindvite from "@tailwindcss/vite";

export default defineConfig({
  site: "https://blog.worksbyaaron.com",
  integrations: [sitemap()],
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
