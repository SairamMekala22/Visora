

export function applyHighContrast(state) {
  const styleId = "high-contrast-style";
  let styleElement = document.getElementById(styleId);

  if (state) {

    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      img,
      video,
      picture,
      [style*="background-image"],
      iframe,
      canvas {
        filter: invert(1) hue-rotate(180deg) !important;
      }
    `;
  } else {

    document.documentElement.style.filter = "";

    if (styleElement) {
      styleElement.remove();
    }
  }
}
