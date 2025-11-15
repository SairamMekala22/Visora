// ============================================================
// FEATURE: Content Width Limiter (Range Control)
// DESCRIPTION: Restricts line length to optimal width for reading
//              (reduces eye fatigue) - customizable 600-1200px
// ============================================================

// Content Width with Custom Max Width
export function applyContentWidth(maxWidth) {
  const styleId = "visora-content-width-range-style";
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = `
    body {
      max-width: ${maxWidth}px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    body > * {
      max-width: 100% !important;
    }
  `;
}

export function removeContentWidth() {
  const styleElement = document.getElementById("visora-content-width-range-style");
  if (styleElement) {
    styleElement.remove();
  }
}

// Legacy toggle function (kept for backward compatibility)
export function toggleContentWidth(enabled) {
  const styleId = "visora-content-width-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body {
        max-width: 800px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      body > * {
        max-width: 100% !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
