

const originalStyles = new Map();

export function toggleLinkHighlight(highlight) {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (highlight) {

      if (!originalStyles.has(link)) {
        originalStyles.set(link, link.style.cssText);
      }

      link.style.cssText +=
        "; background-color: black !important; color: yellow !important; filter: invert(0%) !important;";
    } else {

      const originalStyle = originalStyles.get(link);
      if (originalStyle !== undefined) {
        link.style.cssText = originalStyle;
        originalStyles.delete(link);
      }
    }
  });
}

const style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule(
  `
  .highlight-links {
    background-color: yellow !important; /* Replace with color inversion logic if needed */
    color: black !important; /* Replace with color inversion logic if needed */
  }
`,
  0
);
