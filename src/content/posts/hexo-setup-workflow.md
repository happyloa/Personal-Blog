---
title: Hexo 8 安裝與本機開發流程
date: 2025-11-26 10:00:00
tags: [Hexo, setup, Node.js]
---

想快速搭建 Hexo 8 部落格？以下整理從安裝到本機開發的必要步驟，並提供常用指令範例。

<!-- more -->

## 環境準備（Node.js 18+）

Hexo 8 官方建議 Node.js 18+。可用下列指令確認版本：

```bash
node -v
npm -v
```

若尚未安裝，請至官方網站下載或使用套件管理工具安裝。

## 安裝 Hexo CLI（最新版）

以 npm 全域安裝並鎖定最新 Hexo CLI：

```bash
npm install -g hexo-cli@latest
```

安裝完成後檢查版本，確認 Hexo 核心與 CLI 均為 8.x：

```bash
hexo -v
```

## 初始化專案與安裝相依

在目標資料夾執行初始化，Hexo 會產生必要目錄結構與 `package.json`：

```bash
hexo init my-blog
cd my-blog
npm install
```

> `hexo init` 會下載預設佈景主題、建立 `_config.yml` 與基本目錄；`npm install` 會把 Hexo 8 核心套件安裝到專案中。

## 撰寫文章與前置資料

建立新文章會自動套用 scaffold，並含有 `title`、`date`、`tags` 等 Front Matter：

```bash
hexo new "新的文章標題"
```

可於 `source/_posts/` 內編輯 Markdown 內容，並透過 `tags` 或 `categories` 整理文章。

## 本機開發循環

啟動本機伺服器並監看檔案變化：

```bash
hexo server
```

當檔案更新時，Hexo 會重新編譯並在瀏覽器自動刷新。若只需靜態輸出，可使用：

```bash
hexo generate
```

此指令會將產生的 HTML 放在 `public/`，可進一步用於部署或進行差異檢查。

## 清理與重建

遇到快取或資源錯亂時，可用 `clean` 重新整理建置狀態：

```bash
hexo clean && hexo generate
```

這會刪除 `.deploy_git`、`public/` 與快取資料，確保之後的生成結果乾淨一致。
