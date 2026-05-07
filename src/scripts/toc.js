export function initTOC() {
  const tocMobile = document.getElementById("toc-mobile");
  const tocOverlay = document.getElementById("toc-overlay");
  const tocFab = document.getElementById("toc-fab");
  const links = document.querySelectorAll(".toc-link, .toc-link-mobile");
  const headings = document.querySelectorAll("article h2[id], article h3[id]");

  if (!links.length || !headings.length) return;

  let isOpen = false;

  function setMobileOpen(nextOpen) {
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
  }

  function setActiveLink(slug) {
    links.forEach((link) => {
      const isActive = link.getAttribute("data-slug") === slug;
      link.classList.toggle("bg-surface-soft", isActive);
      link.classList.toggle("text-slate-100", isActive);
      link.classList.toggle("text-slate-500", !isActive && link.classList.contains("toc-link"));
      link.classList.toggle("text-slate-400", !isActive && link.classList.contains("toc-link-mobile"));
    });
  }

  tocFab?.addEventListener("click", () => setMobileOpen(!isOpen));
  tocOverlay?.addEventListener("click", () => setMobileOpen(false));

  document.querySelectorAll(".toc-link-mobile").forEach((link) => {
    link.addEventListener("click", () => setMobileOpen(false));
  });

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
