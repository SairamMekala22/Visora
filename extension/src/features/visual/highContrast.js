// ============================================================
// FEATURE: High Contrast Mode
// DESCRIPTION: Inverts page colors for better visibility
//              for users with visual impairments
// ============================================================

export function applyHighContrast(state) {
  document.documentElement.style.filter = state
    ? "invert(1) hue-rotate(180deg)"
    : "";
}
