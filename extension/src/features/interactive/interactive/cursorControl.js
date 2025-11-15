// ============================================================
// FEATURE: Large Cursor Enhancement & Cursor Size Control (Range)
// DEVELOPER: Team Member 8
// DESCRIPTION: Replaces default cursor with larger custom image
//              or allows custom cursor size (1-4×) for better visibility
// ============================================================

// Cursor Size with Custom Multiplier (Range Control)
export function applyCursorSize(multiplier) {
  const styleId = "visora-cursor-size-range-style";
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  const size = Math.round(multiplier * 32); // Base 32px cursor
  styleElement.textContent = `
    * {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><path d="M2 2 L2 28 L12 18 L18 28 L22 26 L16 16 L28 16 Z" fill="black" stroke="white" stroke-width="1"/></svg>') 0 0, auto !important;
    }
  `;
}

export function removeCursorSize() {
  const styleElement = document.getElementById("visora-cursor-size-range-style");
  if (styleElement) {
    styleElement.remove();
  }
}

// Legacy toggle function (kept for backward compatibility)
export function toggleLargeCursor(enabled) {
  const cursorUrl = chrome.runtime.getURL("assets/cursor.png"); // Path to your PNG cursor image
  const cursorStyleElement =
    document.getElementById("large-cursor-style") || createCursorStyleElement();

  if (enabled) {
    // Enlarge the cursor using the PNG cursor image
    cursorStyleElement.textContent = `body, body * { cursor: url('${cursorUrl}'), auto !important; }`;
  } else {
    // Reset to the default cursor
    cursorStyleElement.textContent = "";
  }
}

function createCursorStyleElement() {
  const style = document.createElement("style");
  style.id = "large-cursor-style";
  document.head.appendChild(style);
  return style;
}
