// 在模組層保存鍵盤監聽器，避免每次 astro:page-load 重新初始化時於 document 上層層疊加。
let tocKeydownHandler;

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
    // 關閉時用 inert 讓面板內連結整體退出 Tab 順序與無障礙樹，避免與 aria-hidden 衝突。
    tocMobile?.toggleAttribute("inert", !isOpen);
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
      link.classList.toggle("text-slate-400", !isActive);
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
    link.addEventListener("click", () =>
      setMobileOpen(false, { returnFocus: false }),
    );
  });

  // 以 Escape 關閉行動版目錄，並在開啟時把 Tab 焦點侷限在面板內；先移除舊監聽器避免跨頁面累積。
  if (tocKeydownHandler) {
    document.removeEventListener("keydown", tocKeydownHandler);
  }
  tocKeydownHandler = (event) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      setMobileOpen(false);
      return;
    }

    if (event.key === "Tab" && tocMobile) {
      const focusable = tocMobile.querySelectorAll("a[href]");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener("keydown", tocKeydownHandler);

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
