// ============================================================
// FEATURE: Dimmer Overlay with Flashlight Effect
// DEVELOPER: Team Member 7
// DESCRIPTION: Creates a darkening overlay with circular spotlight
//              that follows cursor to reduce visual distractions
// ============================================================

let flashlightOverlay;

export function toggleDimmerOverlay(enabled) {
  if (enabled) {
    if (!flashlightOverlay) {
      // Create the dimmer overlay if it doesn't exist
      flashlightOverlay = document.createElement("div");
      flashlightOverlay.style.position = "fixed";
      flashlightOverlay.style.top = "0";
      flashlightOverlay.style.left = "0";
      flashlightOverlay.style.width = "100%";
      flashlightOverlay.style.height = "100%";
      flashlightOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Darker for flashlight effect
      flashlightOverlay.style.zIndex = "99999"; // High z-index to cover the page
      flashlightOverlay.style.pointerEvents = "none"; // Allows clicking through the overlay
      document.body.appendChild(flashlightOverlay);

      // Add mouse move listener to create flashlight effect
      document.addEventListener("mousemove", updateFlashlightPosition);
    }
    flashlightOverlay.style.display = "block";
  } else {
    if (flashlightOverlay) {
      flashlightOverlay.style.display = "none";
      document.removeEventListener("mousemove", updateFlashlightPosition);
    }
  }
}

function updateFlashlightPosition(e) {
  const radius = 100; // Radius of the flashlight circle
  const flashlightStyle = `
    radial-gradient(circle ${radius}px at ${e.clientX}px ${e.clientY}px, 
    transparent, transparent ${radius}px, rgba(0, 0, 0, 0.7) ${radius + 1}px)
  `;
  flashlightOverlay.style.background = flashlightStyle;
}
