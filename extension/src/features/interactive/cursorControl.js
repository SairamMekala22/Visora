
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

export function toggleCursorSize(enabled) {
  if (enabled) {
    // Load saved cursor size and apply it
    chrome.storage.local.get(['cursorSize'], (result) => {
      const size = result.cursorSize || 'default';
      applyCustomCursorSize(size);
    });
  } else {
    // Reset to default cursor
    applyCustomCursorSize('default');
  }
}

export function applyCustomCursorSize(size) {
  const styleId = "custom-cursor-size-style";
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  let cursorStyle = '';

  switch (size) {
    case 'small':
      cursorStyle = `body, body * { 
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0 L0 12 L4 9 L6 14 L8 13 L6 8 L10 8 Z" fill="black" stroke="white" stroke-width="1"/></svg>') 0 0, auto !important; 
      }`;
      break;
    case 'medium':
      cursorStyle = `body, body * { 
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L0 18 L6 13.5 L9 21 L12 19.5 L9 12 L15 12 Z" fill="black" stroke="white" stroke-width="1.5"/></svg>') 0 0, auto !important; 
      }`;
      break;
    case 'large':
      cursorStyle = `body, body * { 
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M0 0 L0 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z" fill="black" stroke="white" stroke-width="2"/></svg>') 0 0, auto !important; 
      }`;
      break;
    case 'default':
    default:
      cursorStyle = '';
      break;
  }

  styleElement.textContent = cursorStyle;
}
