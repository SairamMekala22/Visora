

let flashlightOverlay;

export function toggleDimmerOverlay(enabled) {
  if (enabled) {
    if (!flashlightOverlay) {

      flashlightOverlay = document.createElement("div");
      flashlightOverlay.id = "visora-dimmer-overlay";
      flashlightOverlay.style.position = "fixed";
      flashlightOverlay.style.top = "0";
      flashlightOverlay.style.left = "0";
      flashlightOverlay.style.width = "100%";
      flashlightOverlay.style.height = "100%";
      flashlightOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      flashlightOverlay.style.zIndex = "99999";
      flashlightOverlay.style.pointerEvents = "none";
      flashlightOverlay.style.visibility = "visible";
      document.body.appendChild(flashlightOverlay);

      document.addEventListener("mousemove", updateFlashlightPosition);
    }
    flashlightOverlay.style.display = "block";
    flashlightOverlay.style.visibility = "visible";
  } else {
    if (flashlightOverlay) {
      flashlightOverlay.style.display = "none";
      document.removeEventListener("mousemove", updateFlashlightPosition);
    }
  }
}

function updateFlashlightPosition(e) {
  const radius = 100;
  const flashlightStyle = `
    radial-gradient(circle ${radius}px at ${e.clientX}px ${e.clientY}px,
    transparent, transparent ${radius}px, rgba(0, 0, 0, 0.7) ${radius + 1}px)
  `;
  flashlightOverlay.style.background = flashlightStyle;
}
