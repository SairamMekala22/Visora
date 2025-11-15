// ============================================================
// FEATURE: Image Visibility Control
// DESCRIPTION: Hides/shows images and background images to
//              reduce sensory overload for sensitive users
// ============================================================

let toggleImgListener;
let hideImages = false;
let imageObserver;

export function handleHideImages(request) {
  hideImages = request.enabled;
  toggleImagesVisibility();
  if (hideImages) {
    imageObserver = observeNewElements();
    toggleImgListener = window.addEventListener("scroll", () => {
      toggleImagesVisibility();
    });
  } else if (imageObserver) {
    imageObserver.disconnect();
    window.removeEventListener("scroll", toggleImgListener);
  }
}

function toggleImagesVisibility() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.style.visibility = hideImages ? "hidden" : "visible";
  });
  const elementsWithBackground = document.querySelectorAll("*");
  elementsWithBackground.forEach((el) => {
    if (el.style.backgroundImage !== "") {
      el.style.visibility = hideImages ? "hidden" : "visible";
    }
  });
}

// Function to observe new images added to the document and hide them if needed
function observeNewElements() {
  imageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // For <img> elements
        if (node.tagName === "IMG") {
          node.style.visibility = hideImages ? "hidden" : "visible";
        }
        // For elements with CSS background images
        if (node.nodeType === Node.ELEMENT_NODE) {
          const computedStyle = window.getComputedStyle(node);
          if (computedStyle.backgroundImage !== "none") {
            node.style.visibility = hideImages ? "hidden" : "visible";
          }
        }
      });
    });
  });

  imageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return imageObserver;
}
