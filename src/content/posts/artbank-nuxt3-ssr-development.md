---
title: 藝術銀行 Art Bank 會員系統開發紀錄 — Nuxt 3 + JWT 實戰經驗
date: 2025-01-15
tags: [Nuxt, 前端, 專案開發]
---

去年底接到一個蠻有挑戰性的案子——[藝術銀行 Art Bank](https://artbank.tfaf.org.tw/) 的會員前台系統開發。這是透過版塊設計接到的專案，從 2024 年底開始做，一直到 2025 年初才完成。藝術銀行是文化部的藝術作品租賃平台，讓企業和個人可以線上租借藝術品。這篇來分享一下我負責的會員系統開發過程。

## 我負責的部分

這個專案我主要負責的是會員前台的功能，包含：

- 會員登入與註冊流程
- 企業戶與個人戶的不同註冊表單
- 會員收藏藝術作品功能
- 會員中心相關頁面
- 藝術作品租賃流程表單

API 是別的工程師在處理，我就專注在會員相關的功能上。

## 技術選型考量

專案使用 **Nuxt 3** 搭配 **Tailwind CSS**，這些技術不是我決定的，但用下來覺得蠻適合這種需要 SEO 的政府網站。Nuxt 3 的 SSR 機制讓搜尋引擎可以正確抓取頁面內容，這對藝術品的曝光來說很重要。

Tailwind CSS 用過之後才發現，原來切版也可以這麼順。以前寫傳統 CSS 常常要在檔案之間跳來跳去，現在直接在元件上寫 class 就搞定了。搭配元件化開發的話，維護起來也很方便，尤其是這種多人協作的專案，不用擔心改到別人的 style。

## 會員系統的挑戰

這個專案的會員系統最麻煩的地方，在於要同時處理企業戶和個人戶兩種身份。兩者需要填的資料完全不同，企業戶要填統編、公司名稱、負責人等等，個人戶則是一般的個人資料。

### JWT 驗證機制

驗證這塊選用 JWT，後端會在登入成功後回傳 token，前端存到 cookie 裡面。之後每次打 API 都會帶上這個 token，後端就能知道這個請求是誰發的。

實作的時候我用 **Pinia** 來管理 JWT 的狀態。把 token 和使用者資訊都放在 store 裡面，這樣全站任何地方需要用到登入狀態，直接從 store 拿就可以了。Pinia 搭配 Nuxt 3 用起來很順，而且支援 SSR，不用額外處理 hydration 的問題。

登入狀態的維持也要處理好，使用者重新整理頁面的時候，要能夠自動帶入之前的登入狀態。這邊用 `useCookie` 搭配 Pinia 的 store 來處理，讓 SSR 和 CSR 的狀態可以同步：

```typescript
// stores/auth.ts
export const useAuthStore = defineStore("auth", () => {
  const tokenCookie = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 天
  });

  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => !!tokenCookie.value);

  return { token: tokenCookie, user, isLoggedIn };
});
```

這樣 `useCookie` 在 SSR 時會從 request header 讀 cookie，在 CSR 時從 document.cookie 讀，不用自己處理差異。

### VeeValidate 表單驗證

表單驗證用的是 VeeValidate 搭配 Yup，這個組合在 Vue 生態系應該算是標配了。但這個專案的表單比較複雜，因為企業戶和個人戶的欄位不同，驗證規則也要跟著動態切換。

舉例來說，選擇企業戶的時候，統一編號就是必填欄位，而且要驗證格式；選擇個人戶的時候，這個欄位就不需要了。這種動態驗證規則的切換，一開始踩了不少坑。

後來的做法是用 Yup 的 `when` 方法來做條件驗證，根據使用者選擇的身份類型，動態套用不同的驗證 schema：

```typescript
import * as yup from "yup";

const schema = yup.object({
  memberType: yup.string().required(),
  taxId: yup.string().when("memberType", {
    is: "corporate", // 企業戶時才驗證
    then: (schema) =>
      schema
        .required("請輸入統一編號")
        .matches(/^\d{8}$/, "請輸入 8 位數字的統一編號"),
    otherwise: (schema) => schema.notRequired(),
  }),
  companyName: yup.string().when("memberType", {
    is: "corporate",
    then: (schema) => schema.required("請輸入公司名稱"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
```

這樣寫法比較乾淨，也比較好維護。

另外，錯誤訊息的顯示也花了一些心思。不只是要顯示「這個欄位必填」，而是要給出有意義的提示，讓使用者知道該怎麼修正。像是統編格式錯誤的時候，就要明確說「請輸入 8 位數字的統一編號」（因為統編一定是 8 位數字）。

## 收藏功能實作

會員收藏藝術品的功能也是我負責的部分。這個功能看起來簡單，但實際做起來有一些眉角。

首先是狀態同步的問題。使用者點了愛心收藏之後，要馬上更新 UI，不能等 API 回傳才改變。所以採用樂觀更新的策略，先把 UI 改掉，如果 API 失敗再 rollback。

另外，收藏清單要能夠即時反映藝術品的狀態，像是這件作品是不是已經被租走了、價格有沒有變動等等。這邊透過 API 把最新狀態帶回來，前端再去更新顯示。

## Nuxt 3 開發心得

這個專案讓我對 Nuxt 3 有更深入的理解。以前用 Nuxt 2 的時候，Options API 寫久了會覺得沒什麼，但 Nuxt 3 搭配 Composition API 和 TypeScript，整個開發體驗提升很多。

這邊要特別提一個 `useFetch` 的坑。預設情況下，`useFetch` 會 watch 傳入的參數，只要參數有變化就會自動重新打 API。這聽起來很方便，但在表單的情境下就會出問題——使用者每改一個欄位的值，就會觸發一次 API 請求，這完全不是我們要的行為。解法是把 `watch` 選項設成 `false`：

```typescript
const formData = ref({ name: "", email: "" });

const { data, execute } = await useFetch("/api/submit", {
  method: "POST",
  body: formData,
  watch: false, // 關閉自動 watch，避免每次改值都打 API
  immediate: false, // 也不要立即執行
});

// 表單送出時才手動呼叫
const handleSubmit = async () => {
  await execute();
};
```

這樣就只會在手動呼叫 `execute()` 的時候才打 API。

還有一個常遇到的問題是 hydration mismatch。因為 SSR 和 CSR 的環境不同，有些東西在 server 端和 client 端會產生不一致。像是用到 `window` 或 `document` 的地方，就要用 `process.client` 來判斷，或是用 `ClientOnly` 元件包起來。

## 效能優化

雖然我主要負責會員系統，但也順手做了一些效能優化。會員中心頁面一開始載入蠻慢的，主要是因為一次撈了太多資料。

後來改成分頁載入，每次只撈當頁需要的資料。另外也加了 Skeleton Loading，在資料還沒回來之前先顯示骨架屏，讓使用者知道頁面正在載入中。這樣體驗比一片空白好很多。

圖片載入也做了懶載入，只有滾到可視範圍內的圖片才會真正去載入。這對收藏清單這種有大量圖片的頁面來說，改善很明顯。

## 遇到的問題與解法

開發過程中遇到最頭痛的問題，大概是企業戶註冊表單的複雜驗證邏輯。有些欄位是有相依性的，像是選了某個選項之後，另一個欄位才會變成必填。

一開始想說用 `watch` 來監聽變化，但寫到後來發現邏輯越來越亂。後來重構成用 computed 來算出當前的驗證 schema，再搭配 VeeValidate 的 `useForm` 來套用，這樣邏輯比較集中，也比較好 debug。

另一個問題是登入狀態在不同頁面之間的同步。有時候使用者在 A 頁面登入，跳到 B 頁面的時候狀態卻沒有帶過去。後來發現是 SSR 的問題，server 端 render 的時候拿不到 cookie。解法是把讀取 cookie 的邏輯放在 middleware 裡面處理。

## 學到什麼

這個專案做下來，對 Nuxt 3 的 SSR 機制理解更深了。尤其是 hydration 的原理、server 和 client 端的差異、狀態同步等等，這些以前只是知道大概，現在算是有實戰經驗了。

另外也體會到，企業級專案的表單處理真的不簡單。動態驗證規則、欄位相依性、錯誤訊息客製化，這些加在一起會讓程式碼變得很複雜。提早規劃好架構，把邏輯拆分清楚，後面維護才會輕鬆。

---

專案連結：[https://artbank.tfaf.org.tw/](https://artbank.tfaf.org.tw/)
