// ============================================================
// FEATURE: Hover Effect Disabler
// DESCRIPTION: Prevents hover-triggered actions to avoid
//              accidental activations (motor control issues)
// ============================================================

export function toggleHoverEffects(enabled) {
  const styleId = "visora-disable-hover-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      * {
        pointer-events: auto !important;
      }
      *:hover {
        all: unset !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
