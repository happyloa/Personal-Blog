// 將 ```mermaid 圍欄產生的 <pre data-language="mermaid"> 轉成 mermaid 容器。
// 直接用 Shiki 標好的屬性選取，不必比對內容開頭關鍵字，因此不會誤判一般程式碼範例，
// 也自動支援 journey / mindmap / timeline 等所有圖表類型。
function prepareMermaidBlocks() {
  const shells = [];

  document.querySelectorAll('pre[data-language="mermaid"]').forEach((pre) => {
    const source = pre.textContent.trim();
    if (!source) return;

    const shell = document.createElement("div");
    shell.className = "mermaid-shell";
    // 圖表可能比容器寬，容器會水平捲動；沒有 tabindex 的話純鍵盤使用者看不到右側被截掉的部分。
    shell.tabIndex = 0;
    shell.setAttribute("role", "group");
    shell.setAttribute("aria-label", "流程圖");

    // 先用原始碼區塊的高度撐住版面，等 SVG 算完再放開，避免圖以下的內容連續位移兩次。
    const height = pre.getBoundingClientRect().height;
    if (height) shell.style.minHeight = `${height}px`;

    const diagram = document.createElement("div");
    diagram.className = "mermaid";
    diagram.textContent = source;

    // 保留原始碼：mermaid 產生的 SVG 對螢幕閱讀器幾乎沒有意義，留一份可展開的純文字版本。
    const details = document.createElement("details");
    details.className = "mermaid-source";
    const summary = document.createElement("summary");
    summary.textContent = "圖表原始碼";
    details.append(summary, pre.cloneNode(true));

    shell.append(diagram, details);
    pre.replaceWith(shell);
    shells.push(shell);
  });

  return shells;
}

// 只在頁面確實有圖時才動態載入 mermaid（約 488KB），並只初始化一次。
// 套件改為專案自架（package.json 的 mermaid），Vite 會切成帶 hash 的獨立 chunk：
// 「有圖才下載」的行為不變，但不再依賴第三方 CDN，CSP 也才能收回 script-src 'self'。
let mermaidReady;
function loadMermaid() {
  mermaidReady ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        darkMode: true,
        background: "#111116",
        primaryColor: "#1f2937",
        primaryTextColor: "#f8fafc",
        primaryBorderColor: "#38bdf8",
        lineColor: "#64748b",
        secondaryColor: "#0f172a",
        tertiaryColor: "#18181f",
        fontFamily: "Inter, sans-serif",
      },
    });
    return mermaid;
  });
  return mermaidReady;
}

export async function initMermaid() {
  const shells = prepareMermaidBlocks();
  if (shells.length === 0) return;

  const mermaid = await loadMermaid();
  await mermaid.run({
    querySelector: ".mermaid:not([data-processed='true'])",
  });

  // SVG 已就位，放開佔位高度讓容器回到內容高度。
  shells.forEach((shell) => {
    shell.style.minHeight = "";
  });
}
