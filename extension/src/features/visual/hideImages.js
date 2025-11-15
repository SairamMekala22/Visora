

let hideImages = false;
let imageObserver = null;

export function toggleImagesVisibility() {
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

export function observeNewElements() {
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

export function setHideImages(value) {
  hideImages = value;
}

export function getImageObserver() {
  return imageObserver;
}

export function disconnectImageObserver() {
  if (imageObserver) {
    imageObserver.disconnect();
    imageObserver = null;
  }
}
