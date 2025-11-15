// ============================================================
// FEATURE: Font Size Adjustment (Range Control)
// DESCRIPTION: Allows custom font size percentage (100-200%)
//              for better readability (visual impairment support)
// ============================================================

// Font Size with Custom Percentage
export function applyFontSize(percentage) {
  const styleId = "visora-font-size-range-style";
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  const scale = percentage / 100; // Convert 100-200% to 1.0-2.0
  styleElement.textContent = `
    body, body * {
      font-size: ${scale}em !important;
    }
  `;
}

export function removeFontSize() {
  const styleElement = document.getElementById("visora-font-size-range-style");
  if (styleElement) {
    styleElement.remove();
  }
}

// Legacy toggle function (kept for backward compatibility)
export function toggleFontSize(enabled) {
  const styleId = "visora-font-size-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body, body * {
        font-size: 1.25em !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
