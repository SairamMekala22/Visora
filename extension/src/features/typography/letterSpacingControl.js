// ============================================================
// FEATURE: Letter Spacing Adjustment (Range Control)
// DESCRIPTION: Allows custom letter spacing (0-10px) for easier
//              reading, particularly helpful for dyslexia
// ============================================================

// Letter Spacing with Custom Pixels
export function applyLetterSpacing(pixels) {
  const styleId = "visora-letter-spacing-range-style";
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = `
    body, body *, p, li, div, span, h1, h2, h3, h4, h5, h6 {
      letter-spacing: ${pixels}px !important;
    }
  `;
}

export function removeLetterSpacing() {
  const styleElement = document.getElementById("visora-letter-spacing-range-style");
  if (styleElement) {
    styleElement.remove();
  }
}

// Legacy toggle function (kept for backward compatibility)
export function toggleLetterSpacing(enabled) {
  const styleId = "my-extension-letter-spacing-style";
  let styleElement = document.getElementById(styleId);
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `* { letter-spacing: 0.12em !important; }`; // Set desired letter-spacing value
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
