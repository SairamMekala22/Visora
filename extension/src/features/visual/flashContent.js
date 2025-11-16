

let flashObserver = null;
let freezeGifsOnScroll = null;

export function flashContent(enabled) {
  const cssAnimationsStyleElement = document.createElement("style");
  document.head.appendChild(cssAnimationsStyleElement);

  if (enabled) {
    // Freeze CSS animations and transitions
    cssAnimationsStyleElement.textContent = `* {
      animation-play-state: paused !important;
      transition: none !important;
    }`;

    // Freeze GIF images
    [].slice.apply(document.images).filter(isGif).map(freezeGif);

    // Pause autoplay videos
    const videos = document.querySelectorAll("video[autoplay]");
    videos.forEach((video) => {
      video.pause();
    });

    // Set up a MutationObserver to watch for new images being added to the DOM
    flashObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Freeze new GIF images
          if (node.tagName === "IMG" && isGif(node)) {
            freezeGif(node);
          }
          // If a new node with child images is added, check those images too
          if (node.getElementsByTagName) {
            [].slice
              .apply(node.getElementsByTagName("img"))
              .filter(isGif)
              .map(freezeGif);
          }
          // Pause new videos that are added to the DOM
          if (node.tagName === "VIDEO" && node.autoplay) {
            node.pause();
          }
        });
      });
    });

    flashObserver.observe(document.body, { childList: true, subtree: true });

    // Add event listener for scroll events to handle any lazy-loaded GIFs
    freezeGifsOnScroll = window.addEventListener("scroll", function () {
      [].slice.apply(document.images).filter(isGif).map(freezeGif);
    });
  } else {
    // Resume CSS animations and transitions
    cssAnimationsStyleElement.textContent = "";

    // Resume autoplay videos
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.paused) {
        video.play();
      }
    });

    // Disconnect the observer and remove the scroll event listener
    if (flashObserver) {
      flashObserver.disconnect();
    }
    window.removeEventListener("scroll", freezeGifsOnScroll);

    // Reload the page to reset GIFs and videos
    document.location.reload();
  }
}

function isGif(i) {
  return /^(?!data:).*\.gif/i.test(i.src);
}

function freezeGif(i) {
  var c = document.createElement("canvas");
  var w = (c.width = i.width);
  var h = (c.height = i.height);
  c.getContext("2d").drawImage(i, 0, 0, w, h);
  try {
    i.src = c.toDataURL("image/gif"); // Try to change the source of the image
  } catch (e) {
    // Cross-domain images will throw an error, we handle them here
    for (var j = 0, a; (a = i.attributes[j]); j++) {
      c.setAttribute(a.name, a.value);
    }
    i.parentNode.replaceChild(c, i);
  }
}
