function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = header.querySelector(".menu-toggle");
  const menu = header.querySelector(".header-menu");
  let collapsible = null;

  function setOpen(open) {
    menu.hidden = collapsible && !open;
    toggle.setAttribute("aria-expanded", String(collapsible && open));
    toggle.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
  }

  function syncLayout() {
    const nextCollapsible = getComputedStyle(toggle).display !== "none";
    if (nextCollapsible === collapsible) return;

    const focusWillBeHidden = nextCollapsible && menu.contains(document.activeElement);
    collapsible = nextCollapsible;
    setOpen(false);
    if (focusWillBeHidden) toggle.focus();
  }

  header.classList.add("has-menu");
  syncLayout();

  toggle.addEventListener("click", () => setOpen(menu.hidden));
  menu.addEventListener("click", event => {
    if (collapsible && event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", event => {
    if (collapsible && !header.contains(event.target)) setOpen(false);
  });
  header.addEventListener("keydown", event => {
    if (event.key === "Escape" && collapsible && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
  header.addEventListener("focusout", event => {
    if (collapsible && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  window.addEventListener("resize", syncLayout);
}

initNavigation();
