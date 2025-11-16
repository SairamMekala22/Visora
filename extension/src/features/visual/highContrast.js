

export function applyHighContrast(state) {
  const styleId = "high-contrast-style";
  let styleElement = document.getElementById(styleId);

  if (state) {
    // Apply inversion to everything
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";

    // Create style element to counter-invert images
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Counter-invert images and videos to keep them original
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
    // Remove inversion
    document.documentElement.style.filter = "";

    // Remove the style element
    if (styleElement) {
      styleElement.remove();
    }
  }
}
