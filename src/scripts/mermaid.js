// mermaid 圖表類型 → 中文名稱。用來給容器一個有意義的 aria-label，
// 而不是不管畫什麼都朗讀成「流程圖」。
/** @type {Record<string, string>} */
const DIAGRAM_LABELS = {
  flowchart: "流程圖",
  graph: "流程圖",
  sequenceDiagram: "循序圖",
  classDiagram: "類別圖",
  stateDiagram: "狀態圖",
  "stateDiagram-v2": "狀態圖",
  erDiagram: "實體關聯圖",
  journey: "使用者旅程圖",
  gantt: "甘特圖",
  pie: "圓餅圖",
  mindmap: "心智圖",
  timeline: "時間軸",
  gitGraph: "Git 線圖",
};

/** @param {string} source */
function labelFor(source) {
  const keyword = /^\s*([A-Za-z][\w-]*)/.exec(source)?.[1] ?? "";
  return DIAGRAM_LABELS[keyword] ?? "圖表";
}

// 將 ```mermaid 圍欄產生的 <pre data-language="mermaid"> 轉成 mermaid 容器。
// 直接用 Shiki 標好的屬性選取，不必比對內容開頭關鍵字，因此不會誤判一般程式碼範例，
// 也自動支援 journey / mindmap / timeline 等所有圖表類型。
function prepareMermaidBlocks() {
  /** @type {HTMLDivElement[]} */
  const shells = [];

  document.querySelectorAll('pre[data-language="mermaid"]').forEach((pre) => {
    const source = pre.textContent.trim();
    if (!source) return;

    const shell = document.createElement("div");
    shell.className = "mermaid-shell";
    // 圖表可能比容器寬，容器會水平捲動；沒有 tabindex 的話純鍵盤使用者看不到右側被截掉的部分。
    shell.tabIndex = 0;
    shell.setAttribute("role", "group");
    shell.setAttribute("aria-label", labelFor(source));

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

// 只在頁面確實有圖時才動態載入 mermaid，並只初始化一次。
// 實測（2026-07 量測建置產物）：一頁有 flowchart 會拉 23 個 chunk、1.2MB 未壓縮／292KB gzip。
// mermaid 內部各圖表類型與 katex／cytoscape 都是動態 import，用不到的類型不會下載。
// 套件為專案自架（package.json 的 mermaid），Vite 會切成帶 hash 的獨立 chunk：
// 「有圖才下載」的行為不變，但不再依賴第三方 CDN，CSP 也才能收回 script-src 'self'。
/** @type {Promise<import("mermaid").Mermaid> | undefined} */
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

  try {
    const mermaid = await loadMermaid();
    // suppressErrors 讓單一張圖的語法錯誤不會中斷同頁其他圖表的渲染。
    await mermaid.run({
      querySelector: ".mermaid:not([data-processed='true'])",
      suppressErrors: true,
    });
  } catch (error) {
    // chunk 載入失敗或初始化拋錯時清掉快取，讓下次換頁還有機會重試。
    mermaidReady = undefined;
    console.error("[mermaid] 圖表初始化失敗", error);
  } finally {
    // 無論成功或失敗都要放開佔位高度，否則整頁圖表會卡成空白框。
    shells.forEach((shell) => {
      shell.style.minHeight = "";
    });
  }
}
