const NAV_OFFSET_MOBILE = 112; // ~7rem — fixed pill + top inset
const NAV_OFFSET_DESKTOP = 144; // ~9rem

function getNavScrollOffset() {
  return window.matchMedia("(min-width: 640px)").matches
    ? NAV_OFFSET_DESKTOP
    : NAV_OFFSET_MOBILE;
}

export function scrollToElementWithNavOffset(
  id: string,
  extraOffset = 12
) {
  const el = document.getElementById(id);
  if (!el) return;

  const top =
    el.getBoundingClientRect().top +
    window.scrollY -
    getNavScrollOffset() -
    extraOffset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
