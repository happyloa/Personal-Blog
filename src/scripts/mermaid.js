const mermaidKeywords = [
  "sequenceDiagram",
  "flowchart ",
  "graph ",
  "classDiagram",
  "stateDiagram",
  "erDiagram",
  "gantt",
  "pie",
  "gitgraph",
];

// 將符合語法的 <pre> 轉成 mermaid 容器，並回傳轉換出的數量。
function prepareMermaidBlocks() {
  let count = 0;
  document.querySelectorAll("pre").forEach((pre) => {
    const text = pre.textContent.trim();
    if (!mermaidKeywords.some((keyword) => text.startsWith(keyword))) {
      return;
    }

    const shell = document.createElement("div");
    shell.className = "mermaid-shell";

    const diagram = document.createElement("div");
    diagram.className = "mermaid";
    diagram.textContent = text;

    shell.appendChild(diagram);
    pre.replaceWith(shell);
    count += 1;
  });
  return count;
}

// 只在頁面確實有圖時才動態載入 mermaid（約 488KB），並只初始化一次。
// 版本鎖定在明確的 patch 版本，避免 CDN 浮動 tag 在未經人工確認下悄悄換版。
let mermaidReady;
function loadMermaid() {
  mermaidReady ??= import(
    "https://cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.esm.min.mjs"
  ).then(({ default: mermaid }) => {
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
  if (prepareMermaidBlocks() === 0) return;
  const mermaid = await loadMermaid();
  await mermaid.run({
    querySelector: ".mermaid:not([data-processed='true'])",
  });
}
