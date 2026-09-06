/**
 * 背景方格互動光暈效果（Interactive Grid Glow Effect）
 *
 * 當滑鼠滑過網頁背景的 48px 方格時，方格會平滑淡入（Fade-in）呈現淺色高亮，
 * 當滑鼠離開時則以自然的時間曲線平滑淡出（Fade-out），營造沉浸式的科技感視覺回饋。
 * 僅在具備精準指標（滑鼠/觸控板）的裝置上啟用，排除手機與平板觸控裝置。
 */

// 必須與 global.css 中的 background-size: 48px 48px 保持一致
const GRID_SIZE = 48;
// 淡入所需時間（毫秒），提供柔和且即時的反應，避免瞬間閃爍
const FADE_IN_DURATION = 140;
// 淡出所需時間（毫秒），提供柔和自然的尾韻
const FADE_OUT_DURATION = 1100;
// 最高透明度（亮度）
const MAX_OPACITY = 1.0;

/** @type {HTMLCanvasElement | null} */
let canvas = null;
/** @type {CanvasRenderingContext2D | null} */
let ctx = null;
/** @type {number | null} */
let animationFrameId = null;
let isAnimating = false;
let lastTime = 0;

// 正在變色或淡出的方格集合：key 為 "col,row" -> { col, row, currentOpacity, targetOpacity }
const cells = new Map();

// 當前游標所在的方格 key
/** @type {string | null} */
let currentHoveredKey = null;

/** @param {number} col @param {number} row */
function getKey(col, row) {
  return `${col},${row}`;
}

/**
 * 檢查當前裝置是否支援滑鼠懸停操作
 * @returns {boolean}
 */
function isMouseDevice() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * 處理游標移動事件：計算游標所在的方格座標並啟動淡入
 */
/** @param {PointerEvent} e */
function handlePointerMove(e) {
  // 僅限滑鼠指標操作，忽略觸控（touch）或觸控筆（pen）
  if (e.pointerType && e.pointerType !== "mouse") return;
  if (!canvas || !ctx) return;

  // 納入全域滾動偏移量，確保與 body 背景的 CSS 方格精準對齊
  const docX = e.clientX + window.scrollX;
  const docY = e.clientY + window.scrollY;

  const col = Math.floor(docX / GRID_SIZE);
  const row = Math.floor(docY / GRID_SIZE);
  const key = getKey(col, row);

  if (currentHoveredKey !== key) {
    // 游標移出先前的方格，將其目標透明度設為 0 開始淡出
    if (currentHoveredKey && cells.has(currentHoveredKey)) {
      const prev = cells.get(currentHoveredKey);
      prev.targetOpacity = 0;
    }
    currentHoveredKey = key;
  }

  // 激活當前方格並設定為淡入狀態
  let cell = cells.get(key);
  if (!cell) {
    cell = {
      col,
      row,
      currentOpacity: 0,
      targetOpacity: MAX_OPACITY,
    };
    cells.set(key, cell);
  } else {
    cell.targetOpacity = MAX_OPACITY;
  }

  startAnimation();
}

/**
 * 處理游標離開視窗事件：將最後懸停的方格轉為淡出
 */
function handlePointerLeave() {
  if (currentHoveredKey && cells.has(currentHoveredKey)) {
    const prev = cells.get(currentHoveredKey);
    prev.targetOpacity = 0;
  }
  currentHoveredKey = null;
}

/**
 * 調整 Canvas 尺寸並支援 Retina / 高解析度螢幕（Device Pixel Ratio）
 */
function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (
    canvas.width !== Math.round(width * dpr) ||
    canvas.height !== Math.round(height * dpr)
  ) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(0);
  }
}

/**
 * 渲染每一幀的方格發光狀態與淡入淡出數值
 * @param {number} deltaTime 距離上一幀的時間差（毫秒）
 * @returns {boolean} 是否仍有活躍的動畫中方格
 */
function render(deltaTime) {
  if (!ctx || !canvas) return false;

  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let hasActiveCells = false;

  for (const [key, cell] of cells.entries()) {
    // 依據時間差平滑插值更新透明度
    if (deltaTime > 0) {
      if (cell.currentOpacity < cell.targetOpacity) {
        // 淡入過渡
        const step = (deltaTime / FADE_IN_DURATION) * MAX_OPACITY;
        cell.currentOpacity = Math.min(
          cell.targetOpacity,
          cell.currentOpacity + step,
        );
      } else if (cell.currentOpacity > cell.targetOpacity) {
        // 淡出過渡
        const step = (deltaTime / FADE_OUT_DURATION) * MAX_OPACITY;
        cell.currentOpacity = Math.max(
          cell.targetOpacity,
          cell.currentOpacity - step,
        );
      }
    }

    // 當透明度降至極低且不再懸停時，從 Map 移除以節省計算資源
    if (cell.currentOpacity <= 0.005 && cell.targetOpacity === 0) {
      cells.delete(key);
      continue;
    }

    hasActiveCells = true;

    // 計算方格在當前視窗中的相對螢幕座標
    const screenX = cell.col * GRID_SIZE - scrollX;
    const screenY = cell.row * GRID_SIZE - scrollY;

    // 視窗外剔除（Culling），避免繪製超出可視範圍的方格
    if (
      screenX + GRID_SIZE < 0 ||
      screenX > width ||
      screenY + GRID_SIZE < 0 ||
      screenY > height
    ) {
      continue;
    }

    const alpha = cell.currentOpacity;

    // 繪製方格內部淺色發光底色（淺天藍與微亮白光，維持質感不刺眼）
    ctx.fillStyle = `rgba(56, 189, 248, ${0.08 * alpha})`;
    ctx.fillRect(screenX + 1, screenY + 1, GRID_SIZE - 1, GRID_SIZE - 1);

    ctx.fillStyle = `rgba(255, 255, 255, ${0.06 * alpha})`;
    ctx.fillRect(screenX + 1, screenY + 1, GRID_SIZE - 1, GRID_SIZE - 1);

    // 繪製方格發光邊框，凸顯網格輪廓
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.28 * alpha})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX + 0.5, screenY + 0.5, GRID_SIZE, GRID_SIZE);
  }

  return hasActiveCells;
}

/**
 * requestAnimationFrame 動畫迴圈
 */
/** @param {number} currentTime */
function animate(currentTime) {
  if (!lastTime) lastTime = currentTime;
  const deltaTime = Math.min(currentTime - lastTime, 100);
  lastTime = currentTime;

  const hasActive = render(deltaTime);

  if (hasActive) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    // 當所有方格都完全淡出後，停止動畫迴圈以達成 0% 閒置 CPU 消耗
    isAnimating = false;
    lastTime = 0;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
}

/**
 * 啟動動畫迴圈（若尚未執行）
 */
function startAnimation() {
  if (!isAnimating) {
    isAnimating = true;
    lastTime = 0;
    animationFrameId = requestAnimationFrame(animate);
  }
}

/**
 * 處理捲動事件，確保畫面捲動時方格位置同步更新
 */
function handleScroll() {
  if (cells.size > 0) {
    startAnimation();
  }
}

/**
 * 初始化背景方格發光效果
 */
export function initGridGlow() {
  // 手機、平板等觸控裝置（無精準滑鼠指標）或偏好減少動態效果者不啟用
  if (!isMouseDevice()) {
    cleanupGridGlow();
    return;
  }

  canvas = document.querySelector("canvas#grid-glow-canvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  resizeCanvas();

  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", handlePointerLeave);
  window.removeEventListener("resize", resizeCanvas);
  window.removeEventListener("scroll", handleScroll);

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerleave", handlePointerLeave, {
    passive: true,
  });
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * 清理資源與事件監聽器（供 Astro View Transitions 換頁時呼叫）
 */
export function cleanupGridGlow() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  isAnimating = false;
  cells.clear();
  currentHoveredKey = null;
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", handlePointerLeave);
  window.removeEventListener("resize", resizeCanvas);
  window.removeEventListener("scroll", handleScroll);
}
