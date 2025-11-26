---
title: Hexo 8 部署與客製化技巧
date: 2025-11-26 11:00:00
tags: [Hexo, deploy, customization]
---

完成文章後，接下來就是發布與持續優化。以下整理 Hexo 8 常用的部署流程與客製化建議，搭配指令示例。

<!-- more -->

## 產生與預覽輸出

部署前建議先重新產生靜態檔並做預覽：

```bash
hexo clean
hexo generate
hexo server --draft
```

`--draft` 會包含草稿頁面，方便檢查尚未發布的內容。

## 一鍵部署到遠端

若已在 `_config.yml` 設定部署目標（如 GitHub Pages 或 S3），即可直接發布：

```bash
hexo deploy
```

這會依照 `deploy` 區塊設定，將 `public/` 內容推送到指定平台。若要先檢查輸出後再部署，請先執行 `hexo generate`、確認 `public/` 或以 `hexo server` 預覽，完成檢查後再用以下指令發布：

```bash
hexo deploy
# 或確認無誤後一次生成並部署
hexo generate && hexo deploy
```

在 Hexo 8 中仍可搭配 git、rsync 或自訂腳本部署；若使用 GitHub Actions，亦可使用官方推薦的 Node.js 18 以上執行環境。

## 常見的部署檢查點

- 確認 `_config.yml` 的 `url` 與 `root` 設定正確，避免產生錯誤連結。
- 部署前執行 `hexo clean` 避免舊檔案殘留。
- 使用外掛（如 `hexo-algolia`、`hexo-minify`）時，建議鎖定與 Hexo 8 相容的版本並重新安裝。

## 佈景主題與樣式客製化

調整佈景主題的設定檔（例如 `themes/modern-dark/_config.yml`）即可改變導覽列、首頁英雄標題或社群連結：

```bash
# 修改標題或副標題後重新生成
hexo generate
```

若需要新增自訂樣式，通常可在佈景主題的 `source/css` 或 `source/_data` 中建立覆寫檔，再重新生成站點。

## 自動化部署與備份

可以結合 CI/CD 平台（GitHub Actions、GitLab CI 等）實現自動化發佈：

```bash
# 以 GitHub Actions 為例，工作流程步驟可能包含
npm ci
hexo generate
hexo deploy
```

此外，也建議將 `source/`、`themes/` 與 `_config.yml` 等設定推送到版本控制，確保客製化與文章內容都有備份。
