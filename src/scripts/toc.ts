/**
 * 初始化目錄 (TOC) 功能
 * 包含：
 * 1. 桌面版：滾動監聽與透明度切換
 * 2. 行動版：浮動按鈕 (FAB) 開關與彈出視窗
 * 3. 雙向連動：滾動時高亮當前標題，點擊時平滑捲動
 */
export function initTOC() {
  const tocDesktop = document.getElementById("toc-desktop");

  const tocMobile = document.getElementById("toc-mobile");
  const tocOverlay = document.getElementById("toc-overlay");
  const tocFab = document.getElementById("toc-fab");
  const fabIconOpen = document.getElementById("toc-fab-icon-open");
  const fabIconClose = document.getElementById("toc-fab-icon-close");
  const mainContent = document.getElementById("main-content");

  if (!tocDesktop || !mainContent) return;

  let isMobileOpen = false;
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  // 1. 桌面版：使用 Intersection Observer 偵測是否進入文章區域
  // 避免 TOC 在 Banner 區塊就出現，干擾視覺
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocDesktop.classList.remove("opacity-0", "translate-x-4");
          tocDesktop.classList.add("opacity-100", "translate-x-0");
        } else {
          tocDesktop.classList.add("opacity-0", "translate-x-4");
          tocDesktop.classList.remove("opacity-100", "translate-x-0");
        }
      });
    },
    { threshold: 0, rootMargin: "-100px 0px -50% 0px" },
  );

  observer.observe(mainContent);

  // 2. 桌面版：捲動時 TOC 變更透明，減少閱讀干擾
  function handleScroll() {
    if (!tocDesktop) return;
    tocDesktop.classList.add("is-scrolling");

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      tocDesktop.classList.remove("is-scrolling");
    }, 600);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // 3. 行動版：切換 TOC 開關狀態
  function toggleMobileTOC() {
    isMobileOpen = !isMobileOpen;

    if (isMobileOpen) {
      // 開啟狀態：顯示選單與遮罩，FAB 轉為關閉圖示
      tocMobile?.classList.remove(
        "opacity-0",
        "scale-95",
        "pointer-events-none",
      );
      tocMobile?.classList.add(
        "opacity-100",
        "scale-100",
        "pointer-events-auto",
      );
      tocMobile?.setAttribute("aria-hidden", "false");
      tocOverlay?.classList.remove("opacity-0", "pointer-events-none");
      tocOverlay?.classList.add("opacity-100", "pointer-events-auto");
      tocFab?.setAttribute("aria-expanded", "true");
      fabIconOpen?.classList.add("opacity-0", "-rotate-90");
      fabIconClose?.classList.remove("opacity-0", "rotate-90");
    } else {
      // 關閉狀態：隱藏選單與遮罩，FAB 轉為選單圖示
      tocMobile?.classList.add("opacity-0", "scale-95", "pointer-events-none");
      tocMobile?.classList.remove(
        "opacity-100",
        "scale-100",
        "pointer-events-auto",
      );
      tocMobile?.setAttribute("aria-hidden", "true");
      tocOverlay?.classList.add("opacity-0", "pointer-events-none");
      tocOverlay?.classList.remove("opacity-100", "pointer-events-auto");
      tocFab?.setAttribute("aria-expanded", "false");
      fabIconOpen?.classList.remove("opacity-0", "-rotate-90");
      fabIconClose?.classList.add("opacity-0", "rotate-90");
    }
  }

  tocFab?.addEventListener("click", toggleMobileTOC);
  tocOverlay?.addEventListener("click", () => {
    if (isMobileOpen) toggleMobileTOC();
  });

  // 點擊行動版目錄連結後，自動關閉選單
  document.querySelectorAll(".toc-link-mobile").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileOpen) toggleMobileTOC();
    });
  });

  // 4. 雙向連動：設定 active 狀態與平滑捲動
  const tocLinks = document.querySelectorAll(".toc-link, .toc-link-mobile");

  function setActiveLink(slug: string) {
    tocLinks.forEach((link) => {
      if (link.getAttribute("data-slug") === slug) {
        link.classList.add("active");
        // 自動捲動桌面版 TOC container，讓 active 項目保持在可視範圍
        link.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      } else {
        link.classList.remove("active");
      }
    });
  }

  // 點擊 TOC 連結時立即設定 active
  document.querySelectorAll(".toc-link, .toc-link-mobile").forEach((link) => {
    link.addEventListener("click", () => {
      const slug = link.getAttribute("data-slug");
      if (slug) setActiveLink(slug);
    });
  });

  // 捲動內文時，高亮當前閱讀的標題（使用 Intersection Observer）
  const headings = document.querySelectorAll("article h2[id], article h3[id]");

  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveLink(id);
        }
      });
    },
    { threshold: 0, rootMargin: "-20% 0px -70% 0px" },
  );

  headings.forEach((heading) => headingObserver.observe(heading));
}
