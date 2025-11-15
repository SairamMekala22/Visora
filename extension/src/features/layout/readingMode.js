// ============================================================
// FEATURE: Clutter-Free Reading Mode
// DESCRIPTION: Removes sidebars, ads, navigation to create
//              distraction-free reading experience
// ============================================================

export function toggleReadingMode(enabled) {
  const styleId = "visora-reading-mode-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      aside, nav, header, footer, 
      [class*="sidebar"], [class*="menu"], [class*="nav"],
      [id*="sidebar"], [id*="menu"], [id*="nav"],
      [class*="ad"], [class*="banner"], [class*="promo"],
      [id*="ad"], [id*="banner"], [id*="promo"],
      iframe[src*="ads"], iframe[src*="doubleclick"] {
        display: none !important;
      }
      body {
        background: #f5f5f5 !important;
        padding: 20px !important;
      }
      main, article, [role="main"] {
        background: white !important;
        padding: 40px !important;
        max-width: 800px !important;
        margin: 0 auto !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
