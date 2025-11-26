---
title: Hexo 8 新增文章與草稿流程
date: 2025-11-26 12:00:00
tags: [Hexo, writing, markdown]
---

在 Hexo 8 中建立新文章十分簡單，以下整理新增文章、草稿與常用 Front Matter 的寫法，並附上指令範例。

<!-- more -->

## 建立正式文章

在專案根目錄執行 `hexo new`，會依照 `scaffolds/post.md` 產生檔案並填入標題與日期：

```bash
hexo new "我的第一篇文章"
```

預設會放在 `source/_posts/`，並包含 `title`、`date`、`tags` 等欄位，可直接以 Markdown 撰寫內容。

## 建立草稿再發布

尚未完成的文章可先建立草稿，避免出現在正式列表：

```bash
hexo new draft "尚未完成的文章"
```

草稿會放在 `source/_drafts/`。檢視草稿可啟動含草稿的開發伺服器：

```bash
hexo server --draft
```

完成後使用 `publish` 轉成正式文章：

```bash
hexo publish "尚未完成的文章"
```

## 常用 Front Matter 欄位

在文章開頭可調整以下欄位，幫助 SEO 與分類：

```yaml
title: 我的第一篇文章
date: 2025-11-26 12:34:00
tags: [Hexo, 教學]
categories: [技術, 部落格]
summary: 一段自訂的摘要，會顯示在列表或社群分享卡片。
```

- `tags`：用於標籤頁面聚合，可寫多個。
- `categories`：多層分類會自動生成巢狀路徑。
- `summary`：部分主題會以此欄位覆蓋自動摘要。

## 圖片與資產管理

若希望每篇文章有獨立的資產資料夾，可啟用 `post_asset_folder: true`（於 `_config.yml`）。啟用後：

```bash
hexo new "帶圖片的文章"
# 將圖片放到 source/_posts/帶圖片的文章/
```

Markdown 內可相對引用：

```markdown
![封面](帶圖片的文章/cover.png)
```

## 發布前的檢查

撰寫完成後，建議按以下順序檢查並發布：

```bash
hexo clean
hexo generate
hexo server --draft   # 最後一次預覽含草稿的狀態
hexo deploy           # 部署到遠端
```

搭配 Hexo 8 的最新版 CLI，可確保寫作與部署流程與官方相容。
