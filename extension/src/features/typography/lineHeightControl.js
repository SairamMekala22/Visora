// ============================================================
// FEATURE: Line Height Spacing Control (Range Control)
// DESCRIPTION: Allows custom line height (1-3×) to reduce text density
//              and improve readability for dyslexia
// ============================================================

// Line Height with Custom Multiplier
export function applyLineHeight(multiplier) {
  const styleId = "visora-line-height-range-style";
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = `
    body, body *, p, li, div, span {
      line-height: ${multiplier} !important;
    }
  `;
}

export function removeLineHeight() {
  const styleElement = document.getElementById("visora-line-height-range-style");
  if (styleElement) {
    styleElement.remove();
  }
}

// Legacy toggle function (kept for backward compatibility)
export function toggleLineHeight(enabled) {
  const styleId = "visora-line-height-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body, body *, p, li, div, span {
        line-height: 2 !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
