

let hideImages = false;
let imageObserver = null;

export function toggleImagesVisibility() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {

    if (img.id && img.id.startsWith('visora-')) return;

    if (img.closest('[id^="visora-"]')) return;
    img.style.visibility = hideImages ? "hidden" : "visible";
  });
  const elementsWithBackground = document.querySelectorAll("*");
  elementsWithBackground.forEach((el) => {

    if (el.id && el.id.startsWith('visora-')) return;

    if (el.closest('[id^="visora-"]')) return;

    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.backgroundImage !== "none" && computedStyle.backgroundImage !== "") {
      el.style.visibility = hideImages ? "hidden" : "visible";
    }
  });
}

export function observeNewElements() {
  imageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {

        if (node.id && node.id.startsWith('visora-')) return;

        if (node.tagName === "IMG") {

          if (node.closest('[id^="visora-"]')) return;
          node.style.visibility = hideImages ? "hidden" : "visible";
        }

        if (node.nodeType === Node.ELEMENT_NODE) {

          if (node.closest('[id^="visora-"]')) return;

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
