---
title: Nuxt 3 JWT 身份驗證實作筆記 — 搭配 Pinia 與 Cookie 管理登入狀態
date: 2025-03-05
tags: [Nuxt, 前端]
category: learning
---

最近幾個專案都有碰到會員系統的需求，JWT 驗證機制用了好幾次，這篇來整理一下在 Nuxt 3 專案中實作 JWT 驗證的心得。

## JWT 是什麼

JWT（JSON Web Token）是一種用來驗證使用者身份的機制。流程大概是這樣：

1. 使用者輸入帳號密碼登入
2. 後端驗證成功後，產生一組 JWT 回傳給前端
3. 前端把這個 token 存起來
4. 之後每次打 API 都帶上這個 token
5. 後端收到請求時，驗證 token 是否有效

JWT 的好處是後端不用維護 session，每個請求都是獨立的，比較好做水平擴展。

```mermaid
sequenceDiagram
    participant 使用者
    participant 前端Pinia
    participant 後端API

    使用者->>前端Pinia: 輸入帳號密碼
    前端Pinia->>後端API: POST /api/auth/login
    後端API-->>前端Pinia: 回傳 JWT Token
    前端Pinia->>前端Pinia: 存入 Cookie + Store
    使用者->>前端Pinia: 瀏覽需要登入的頁面
    前端Pinia->>後端API: GET /api/data（帶上 Token）
    後端API-->>前端Pinia: 回傳資料
```

## 前端需要處理什麼

前端在 JWT 驗證流程中要處理的事情：

1. 登入時把 token 存起來
2. 每次打 API 時自動帶上 token
3. 處理 token 過期的情況
4. 登出時清除 token
5. 重新整理頁面時恢復登入狀態

## Cookie + Pinia 雙層管理

實務上最常見的做法是 **Cookie 存 token，Pinia 管理狀態**。

Cookie 負責持久化儲存，這樣重新整理頁面或關掉瀏覽器再開，token 還會在。Pinia 則是讓全站都可以方便地存取登入狀態，不用每次都去讀 cookie。

```typescript
// stores/auth.ts
export const useAuthStore = defineStore("auth", () => {
  const tokenCookie = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 天
    secure: true,
    sameSite: "strict",
  });

  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => !!tokenCookie.value);

  const login = async (credentials: LoginCredentials) => {
    const { token, userData } = await $fetch("/api/auth/login", {
      method: "POST",
      body: credentials,
    });
    tokenCookie.value = token;
    user.value = userData;
  };

  const logout = () => {
    tokenCookie.value = null;
    user.value = null;
  };

  return { token: tokenCookie, user, isLoggedIn, login, logout };
});
```

用 `useCookie` 的好處是它在 SSR 和 CSR 都能用。Server 端 render 時會從 request header 讀 cookie，client 端就讀 document.cookie，不用自己處理這些差異。

## 自動帶上 Token

每次打 API 都要手動帶 token 太麻煩了，可以用 plugin 建立一個自動帶 token 的 fetch：

```typescript
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  const api = $fetch.create({
    onRequest({ options }) {
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout();
        navigateTo("/login");
      }
    },
  });

  return { provide: { api } };
});
```

這樣之後打 API 就用 `$api` 而不是 `$fetch`，就會自動帶上 token，401 時也會自動登出導向登入頁。

## 頁面權限控制

有些頁面只有登入後才能看，用 Nuxt 的 middleware 來控制：

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }
});
```

在需要保護的頁面加上 middleware：

```typescript
// pages/dashboard.vue
definePageMeta({
  middleware: "auth",
});
```

## 初始化登入狀態

頁面載入時要恢復登入狀態，可以在 plugin 處理：

```typescript
// plugins/auth.ts
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // 如果有 token，嘗試取得使用者資訊
  if (authStore.token) {
    try {
      const userData = await $fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      authStore.user = userData;
    } catch {
      // token 無效，清除登入狀態
      authStore.logout();
    }
  }
});
```

## 實務經驗

做過幾個專案後，有一些經驗：

1. **Token 不要存敏感資訊**：JWT 的 payload 只是 base64 編碼，不是加密，任何人都能解開來看

2. **設定合理的過期時間**：太長有安全風險，太短使用者體驗差。通常 access token 設幾小時到一天

3. **登出要確實清除**：cookie 要清，store 也要清

4. **錯誤處理要完整**：網路斷線、token 過期、權限不足，這些情況都要跟使用者說清楚

## 結語

JWT 驗證機制看起來簡單，但實作起來有不少細節要注意。Cookie + Pinia 這個組合在 Nuxt 3 專案中算是蠻標準的做法，既能處理 SSR 的問題，又能讓全站方便存取登入狀態。
