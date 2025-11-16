
export function toggleReadingMode(enabled) {
  const styleId = "ability-reading-mode-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      /* Hide navigation elements - more specific selectors */
      nav:not([role="main"]):not([role="article"]),
      header nav,
      [role="navigation"]:not([role="main"]),
      div[class*="navigation"]:not([role="main"]),
      div[class*="navbar"],
      div[class*="nav-bar"],
      div[id*="navigation"],
      div[id*="navbar"],
      ul[class*="menu"]:not([role="main"]),
      div[class*="menu"]:not([role="main"]) {
        display: none !important;
      }
      
      /* Hide sidebars - more specific */
      aside:not([role="main"]):not([role="article"]),
      div[class*="sidebar"]:not([role="main"]),
      div[class*="side-bar"]:not([role="main"]),
      div[id*="sidebar"]:not([role="main"]),
      section[class*="sidebar"],
      div[class*="widget"] {
        display: none !important;
      }
      
      /* Hide ads and promotional content - more specific */
      div[class*="advertisement"],
      div[class*="ad-container"],
      div[class*="ad-wrapper"],
      div[id*="advertisement"],
      div[id*="ad-container"],
      ins.adsbygoogle,
      iframe[src*="ads"],
      iframe[src*="doubleclick"],
      iframe[src*="googlesyndication"],
      iframe[src*="googleadservices"],
      div[class*="banner"]:not([role="banner"]),
      div[class*="promo"],
      div[id*="promo"],
      [data-ad-slot],
      [data-google-query-id] {
        display: none !important;
      }
      
      /* Make hyperlinks less distracting - use normal text color */
      a:not([role="button"]):not(.button):not(.btn),
      a:link:not([role="button"]):not(.button):not(.btn),
      a:visited:not([role="button"]):not(.button):not(.btn) {
        color: inherit !important;
        text-decoration: none !important;
        border-bottom: 1px dotted rgba(0, 0, 0, 0.3) !important;
      }
      
      a:hover:not([role="button"]):not(.button):not(.btn) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.5) !important;
      }
      
      /* Keep main content visible and clean */
      main, 
      article, 
      [role="main"],
      [role="article"],
      div[class*="content"]:not([class*="ad"]),
      div[class*="article"],
      div[class*="post"] {
        display: block !important;
        visibility: visible !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
