

export function toggleHoverEffects(enabled) {
  const styleId = "ability-disable-hover-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      * {
        pointer-events: auto !important;
      }
      *:hover {
        all: unset !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
