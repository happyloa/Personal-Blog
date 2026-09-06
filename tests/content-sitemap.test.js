import assert from "node:assert/strict";
import { test } from "node:test";
import { getSitemapMetadata } from "../src/integrations/content-sitemap.js";

test("sitemap 使用正式 HTML 的修訂日期，沒有修訂則採發布日期", () => {
  const html = `<head>
    <link rel="canonical" href="https://example.com/posts/test/">
    <meta property="article:published_time" content="2026-01-27T00:00:00.000Z">
    <meta property="article:modified_time" content="2026-03-01T00:00:00.000Z">
  </head>`;
  assert.equal(getSitemapMetadata(html).lastmod, "2026-03-01T00:00:00.000Z");
  assert.equal(
    getSitemapMetadata(
      html.replace(/<meta property="article:modified_time"[^>]+>/, ""),
    ).lastmod,
    "2026-01-27T00:00:00.000Z",
  );
});

test("sitemap 尊重零篇或單篇列表的 noindex，並正規化中文網址", () => {
  const page = getSitemapMetadata(`<head>
    <meta content='noindex, follow' name='robots'>
    <link href='https://example.com/tags/資安/' rel='canonical'>
  </head>`);
  assert.equal(page.noindex, true);
  assert.equal(page.url, "https://example.com/tags/%E8%B3%87%E5%AE%89/");
  assert.equal(page.lastmod, undefined);
});

test("正文中的範例 metadata 不影響 sitemap", () => {
  const page = getSitemapMetadata(`<html><head>
    <link rel="canonical" href="https://example.com/">
  </head><body><meta name="robots" content="noindex"></body></html>`);
  assert.equal(page.noindex, false);
});
