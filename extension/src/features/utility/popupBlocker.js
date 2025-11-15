// ============================================================
// FEATURE: Intelligent Popup & Modal Blocker
// DEVELOPER: Team Member 12
// DESCRIPTION: Auto-detects and hides modals, dialogs, and
//              overlays to reduce cognitive load for autism/ADHD
// ============================================================

let popupObserver = null;

export function togglePopupBlocker(enabled) {
  const styleId = "visora-popup-blocker-style";
  let styleElement = document.getElementById(styleId);
  
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      [class*="modal"], [class*="popup"], [class*="overlay"],
      [id*="modal"], [id*="popup"], [id*="overlay"],
      [role="dialog"], [aria-modal="true"],
      div[style*="position: fixed"][style*="z-index"] {
        display: none !important;
      }
    `;
    
    // Watch for new popups
    popupObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const role = node.getAttribute('role');
            const ariaModal = node.getAttribute('aria-modal');
            const className = node.className || '';
            const id = node.id || '';
            
            if (role === 'dialog' || ariaModal === 'true' ||
                className.includes('modal') || className.includes('popup') ||
                id.includes('modal') || id.includes('popup')) {
              node.style.display = 'none';
            }
          }
        });
      });
    });
    
    popupObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    if (styleElement) {
      styleElement.remove();
    }
    if (popupObserver) {
      popupObserver.disconnect();
      popupObserver = null;
    }
  }
}
