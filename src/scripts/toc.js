// 在模組層保存 Escape 監聽器，避免每次 astro:page-load 重新初始化時於 document 上層層疊加。
let tocEscapeHandler;

export function initTOC() {
  const tocMobile = document.getElementById("toc-mobile");
  const tocOverlay = document.getElementById("toc-overlay");
  const tocFab = document.getElementById("toc-fab");
  const links = document.querySelectorAll(".toc-link, .toc-link-mobile");
  const headings = document.querySelectorAll("article h2[id], article h3[id]");

  if (!links.length || !headings.length) return;

  let isOpen = false;

  function setMobileOpen(nextOpen, { returnFocus = true } = {}) {
    isOpen = nextOpen;
    tocFab?.setAttribute("aria-expanded", String(isOpen));
    tocMobile?.setAttribute("aria-hidden", String(!isOpen));
    tocMobile?.classList.toggle("opacity-100", isOpen);
    tocMobile?.classList.toggle("pointer-events-auto", isOpen);
    tocMobile?.classList.toggle("opacity-0", !isOpen);
    tocMobile?.classList.toggle("pointer-events-none", !isOpen);
    tocOverlay?.classList.toggle("opacity-100", isOpen);
    tocOverlay?.classList.toggle("pointer-events-auto", isOpen);
    tocOverlay?.classList.toggle("opacity-0", !isOpen);
    tocOverlay?.classList.toggle("pointer-events-none", !isOpen);

    if (isOpen) {
      // 開啟時將焦點移入面板，讓鍵盤與螢幕報讀使用者能直接操作目錄。
      tocMobile?.querySelector("a")?.focus();
    } else if (returnFocus) {
      // 關閉時把焦點還給觸發按鈕。
      tocFab?.focus();
    }
  }

  function setActiveLink(slug) {
    links.forEach((link) => {
      const isActive = link.getAttribute("data-slug") === slug;
      link.classList.toggle("bg-surface-soft", isActive);
      link.classList.toggle("text-slate-100", isActive);
      link.classList.toggle("text-slate-500", !isActive && link.classList.contains("toc-link"));
      link.classList.toggle("text-slate-400", !isActive && link.classList.contains("toc-link-mobile"));
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  tocFab?.addEventListener("click", () => setMobileOpen(!isOpen));
  tocOverlay?.addEventListener("click", () => setMobileOpen(false));

  document.querySelectorAll(".toc-link-mobile").forEach((link) => {
    link.addEventListener("click", () => setMobileOpen(false, { returnFocus: false }));
  });

  // 以 Escape 關閉行動版目錄；先移除舊監聽器避免跨頁面累積。
  if (tocEscapeHandler) {
    document.removeEventListener("keydown", tocEscapeHandler);
  }
  tocEscapeHandler = (event) => {
    if (event.key === "Escape" && isOpen) {
      setMobileOpen(false);
    }
  };
  document.addEventListener("keydown", tocEscapeHandler);

  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
  );

  headings.forEach((heading) => headingObserver.observe(heading));
}
