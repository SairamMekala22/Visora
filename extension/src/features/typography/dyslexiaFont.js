
export function toggleDyslexiaFont(enableFont) {
  const styleId = "dyslexia-friendly-style";
  let styleElement = document.getElementById(styleId);

  if (enableFont) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Embed the font in the document
    styleElement.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('${chrome.runtime.getURL(
      "assets/OpenDyslexic.otf"
    )}') format('opentype');
        }

        body, button, input, textarea, select, p, li, span, div  {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      }
      `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
