// ============================================================
// FEATURE: Link Highlighting System
// DESCRIPTION: Makes all links highly visible with yellow background
//              and black text for easier navigation
// ============================================================

const originalStyles = new Map();

export function toggleLinkHighlight(highlight) {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (highlight) {
      // Store original styles if not already stored
      if (!originalStyles.has(link)) {
        originalStyles.set(link, link.style.cssText);
      }

      // Apply styles directly, with increased specificity and !important
      link.style.cssText +=
        "; background-color: black !important; color: yellow !important; filter: invert(0%) !important;";
    } else {
      // Restore original styles
      const originalStyle = originalStyles.get(link);
      if (originalStyle !== undefined) {
        link.style.cssText = originalStyle;
        originalStyles.delete(link);
      }
    }
  });
}

// Add the style to the page
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
