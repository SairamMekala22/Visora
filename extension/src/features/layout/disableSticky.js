// ============================================================
// FEATURE: Sticky Element Disabler
// DESCRIPTION: Removes fixed headers/footers that obstruct
//              content (motor impairment & reading assistance)
// ============================================================

export function toggleStickyElements(enabled) {
  const styleId = "visora-disable-sticky-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      * {
        position: static !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
