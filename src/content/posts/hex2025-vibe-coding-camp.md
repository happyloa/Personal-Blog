---
title: 用 AI 開發全端天氣 App？六角 Vibe Coding 體驗營心得分享
date: 2025-11-27 15:07:00
tags: [vibe-coding, 六角學院, 全端開發, ai, nuxt, typescript, nodejs, express, 學習心得]
---

說到學程式，你可能會想到那些一行一行手打 code、查文件查到眼睛脫窗的日子。但如果我說，現在用 AI 可以大幅加速開發流程，甚至讓你在短時間內完成一個全端專案呢？

最近參加了六角學院主辦的「**Vibe Coding 公益程式體驗營｜2025**」，透過這次課程，我不僅學到了如何善用 AI 工具來快速打造 MVP（最小可行產品），更在與同學們的交流互動中，找到了許多新的解題思路和靈感。今天就來跟大家分享一下這次的體驗！

## 專案簡介：台灣天氣預報全端系統

這次體驗營的主線任務四是開發一個**個人天氣 App 全端系統**，需要串接中央氣象署（CWA）的開放資料平台，提供台灣六都的 36 小時天氣預報。

### 🌐 專案成果

- **前端網站**：[https://cwaweather-frontend.pages.dev/](https://cwaweather-frontend.pages.dev/)
- **後端 API**：[https://hex2025-vibe-coding-week4.zeabur.app/](https://hex2025-vibe-coding-week4.zeabur.app/)
- **前端 GitHub**：[https://github.com/happyloa/CwaWeather-frontend](https://github.com/happyloa/CwaWeather-frontend)
- **後端 GitHub**：[https://github.com/happyloa/weather-backend](https://github.com/happyloa/weather-backend)

### 🎯 功能亮點

整個系統從前到後都是自己一手包辦，主要功能包括：

**前端部分**（Nuxt 4 + TypeScript + Tailwind CSS）：
- 🎨 進站時的 2 秒蓋版動畫，讓使用者體驗更流暢
- 🌓 深淺色主題切換，無論白天夜晚都好看不傷眼
- 🏙️ 六都快速切換功能，一鍵查看不同城市天氣
- 📱 完整的響應式設計，手機、平板、電腦都能完美瀏覽
- ✨ AOS 滾動動畫，讓整個頁面更生動
- 🔍 內建 Open Graph 標籤，方便社群分享

**後端部分**（Node.js + Express）：
- ⚡ 串接 CWA 氣象資料開放平台
- 🌦️ 提供台灣六都 36 小時天氣預報
- 🔒 環境變數管理，確保 API Key 安全
- 🌐 RESTful API 設計，易於擴展
- 🔄 CORS 支援，前後端分離無障礙

## 開發過程：AI 工具大顯身手

這次開發最大的特色，就是全程使用 **Google Antigravity IDE** 搭配 **Claude Sonnet 4.5** 模型，外加 **Codex Cloud** 來輔助開發。

### 💡 我的開發流程

1. **Fork 原始碼**：體驗營提供了基本的前後端框架，我先 fork 到自己的 GitHub
2. **客製化調整**：透過 AI 協助，調整配色、修改文案、更換 icon
3. **部署上線**：
   - 前端部署到 Cloudflare Pages
   - 後端部署到 Zeabur
4. **串接測試**：確保前端能成功呼叫後端 API，顯示正確的天氣資料

### 🤖 AI 加速開發的關鍵

說實話，如果沒有 AI 工具，要在短時間內完成這樣的全端專案真的不容易。以下是我覺得 AI 幫了大忙的幾個地方：

1. **快速理解框架**：Nuxt 4 對我來說算是比較新的框架，透過 AI 可以快速了解專案結構、Composables 的用法、以及如何使用 TypeScript 定義型別
2. **程式碼重構**：想要調整某個功能時，AI 可以快速幫我找到相關的程式碼片段，並提供重構建議
3. **除錯協助**：遇到奇怪的錯誤訊息時，AI 可以快速分析問題所在，省下大量 Google 的時間
4. **UI/UX 優化**：透過 prompt 描述想要的視覺效果，AI 可以提供對應的 Tailwind CSS class 組合

## 與同學交流：教學相長的美好

除了自己的專案開發，這次體驗營最有價值的部分，就是在 Discord 社群與其他同學的交流互動。

### 🤝 幫助同學排除疑難雜症

在課程進行期間，常常會看到同學在討論區提問，像是：
- 「為什麼我的前端部署後一片空白？」
- 「後端 API 回傳 CORS 錯誤怎麼辦？」
- 「環境變數要怎麼設定才不會洩漏 API Key？」

每次幫同學解決問題，其實也是在鞏固自己的知識。有時候別人遇到的問題，正好是我之前踩過的坑，分享自己的解決方法不僅能幫助他人，也讓我對這些概念理解得更深刻。

### 📈 專業上的成長

透過這次體驗營，我在幾個方面都有明顯的進步：

1. **問題拆解能力**：學會如何把一個大任務拆解成小步驟，逐步完成
2. **AI 協作技巧**：更了解如何下精準的 prompt，讓 AI 給出更符合需求的回答
3. **全端思維**：從 API 設計到前端呈現，學會用更全面的角度思考專案
4. **部署實戰**：實際操作 Cloudflare Pages 和 Zeabur 的部署流程

## 個人風格改造：打造獨特的天氣站

課程的 LV2 任務鼓勵我們進行「個人風格改造」，這部分真的非常有趣！

### 🎨 我的設計理念

雖然原始範例叫做「森森天氣」，但我選擇直接使用「台灣六都天氣預報」這個更直白的名稱，讓使用者一眼就知道這個服務的功能。

在視覺風格上，我採用了：
- **藍色系配色**：符合天氣主題的冷色調
- **漸層背景**：營造天空的視覺效果
- **卡片式設計**：清楚區分不同時段的天氣資訊
- **圖示化呈現**：透過天氣圖示讓資訊更直觀

### 🔧 技術細節

在技術實作上，有幾個值得一提的地方：

1. **狀態管理**：使用 Vue 3 的 Composition API，讓狀態管理更清晰
2. **型別安全**：全面採用 TypeScript，避免隱性型別錯誤
3. **載入狀態**：實作了 Loading Skeleton，提升使用者體驗
4. **錯誤處理**：當 API 呼叫失敗時，會顯示友善的錯誤訊息

## 學習心得：擁抱 AI 時代的開發方式

參加這次體驗營最大的收穫，就是真正體會到「**AI 驅動開發**」的威力。

### ✅ AI 能做什麼？

- **加速開發**：原本可能需要一週的專案，幾天甚至幾小時內就能完成
- **降低門檻**：即使對某個框架不熟悉，也能快速上手
- **提供靈感**：卡關時可以問 AI，獲得不同的解決思路

### ⚠️ 但仍需注意

- **AI 不是萬能**：還是需要自己理解程式邏輯，才能判斷 AI 的建議是否正確
- **除錯能力**：遇到問題時，基本的除錯能力還是很重要
- **程式觀念**：沒有基本的程式觀念，就算 AI 給了程式碼也不知道怎麼用

## 結語

這次參加六角學院的 Vibe Coding 體驗營，收穫真的超乎預期。不只是學到了新的開發技巧，更重要的是體會到了「**AI 協作**」的工作模式，以及透過「**社群互助**」帶來的成長。

如果你也對 AI 開發有興趣，或是想嘗試全端專案，非常推薦參加這類型的體驗營。在有經驗的講師引導下，搭配 AI 工具的輔助，真的能在短時間內做出很有成就感的作品！

有興趣的朋友可以到我的 GitHub 看看專案原始碼，也歡迎實際玩玩看這個天氣查詢網站。如果有任何問題或建議，都歡迎留言交流！

---

## 相關連結

- 🌐 前端部署網站：[https://cwaweather-frontend.pages.dev/](https://cwaweather-frontend.pages.dev/)
- 🔌 後端 API：[https://hex2025-vibe-coding-week4.zeabur.app/](https://hex2025-vibe-coding-week4.zeabur.app/)
- 💻 前端原始碼：[https://github.com/happyloa/CwaWeather-frontend](https://github.com/happyloa/CwaWeather-frontend)
- 💻 後端原始碼：[https://github.com/happyloa/weather-backend](https://github.com/happyloa/weather-backend)
- 🎓 六角學院：[https://www.hexschool.com/](https://www.hexschool.com/)

---
