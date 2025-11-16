

export function toggleLetterSpacing(enabled) {
  const styleId = "my-extension-letter-spacing-style";
  let styleElement = document.getElementById(styleId);
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `* { letter-spacing: 0.12em !important; }`;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

export function applyCustomLetterSpacing(value) {
  const styleId = "custom-letter-spacing-style";
  let styleElement = document.getElementById(styleId);

  if (value > 0) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `* { letter-spacing: ${value}em !important; }`;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

export function toggleFontSize(enabled) {
  const styleId = "my-extension-font-size-style";
  let styleElement = document.getElementById(styleId);
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `html { font-size: 120% !important; }`;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

export function applyCustomFontSize(value) {
  const styleId = "custom-font-size-style";
  let styleElement = document.getElementById(styleId);

  if (value !== 100) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      html {
        font-size: ${value}% !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

export function toggleLineHeight(enabled) {
  const styleId = "my-extension-line-height-style";
  let styleElement = document.getElementById(styleId);
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `body, body *, p, li, div, span { line-height: 2.0 !important; }`;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

export function applyCustomLineHeight(value) {
  const styleId = "custom-line-height-style";
  let styleElement = document.getElementById(styleId);

  if (value !== 1.5) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body, body *, p, li, div, span {
        line-height: ${value} !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

export function toggleContentWidth(enabled) {
  const styleId = "my-extension-content-width-style";
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

export function applyCustomContentWidth(value) {
  const styleId = "custom-content-width-style";
  let styleElement = document.getElementById(styleId);

  if (value < 1400) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body {
        max-width: ${value}px !important;
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
