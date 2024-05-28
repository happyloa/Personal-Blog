---
title: 用 CSS 隱藏網頁元素的三種方法
date: 2024-04-20 13:43:26
tags: [html, css, display, visibility]
---

想要隱藏頁面上的元素，可以透過這三種常見的方法：

1.  visibility: hidden;
2.  visibility: collapse;
3.  display: none;

以下針對這三種方法的特性來做介紹

## 1\. visibility: hidden;

```
（選擇器） {
    visibility: hidden;
}
```

單看字面上的意思，就是：看不見。

被指定這個 CSS [declaration](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration)  的元素，會在視覺上消失，但是這個元素所佔據的空間還是依然存在。如果該元素有包含子元素，且子元素的  `visibility`  設定為  `visible`  的話，那麼子元素就會被看見。

## 2\. visibility: collapse;

```
（選擇器） {
    visibility: collapse;
}
```

依照被指定的元素不同，會呈現出不同的效果：

- 如果是  `<table>`  元素的列或欄被指定，那麼該欄或是列就會被隱藏，且不會佔據任何空間（就像是被套用了  `display: none;`），但是整個  `<table>`  元素所含的儲存格數量還是會被計算。
- 如果是套用在 flex item 上，那麼該元素既會被隱藏起來，也不會佔據任何空間。
- 其餘的元素被套用這個  [declaration](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration)，所呈現出的效果跟  `visibility: hidden;`  相同。

## 3\. display: none;

```
（選擇器） {
    display: none;
}
```

顧名思義：不顯示。

被套用這個  [declaration](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration)  的元素，就好像不存在於網頁中一樣，既不會佔據任何空間，也不會被顯示出來。

---

參考資料：[visibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS/visibility)、[display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)
