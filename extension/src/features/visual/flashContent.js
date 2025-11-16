

let flashObserver = null;
let freezeGifsOnScroll = null;

export function flashContent(enabled) {
  const cssAnimationsStyleElement = document.createElement("style");
  document.head.appendChild(cssAnimationsStyleElement);

  if (enabled) {

    cssAnimationsStyleElement.textContent = `* {
      animation-play-state: paused !important;
      transition: none !important;
    }`;

    [].slice.apply(document.images).filter(isGif).map(freezeGif);

    const videos = document.querySelectorAll("video[autoplay]");
    videos.forEach((video) => {
      video.pause();
    });

    flashObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {

          if (node.tagName === "IMG" && isGif(node)) {
            freezeGif(node);
          }

          if (node.getElementsByTagName) {
            [].slice
              .apply(node.getElementsByTagName("img"))
              .filter(isGif)
              .map(freezeGif);
          }

          if (node.tagName === "VIDEO" && node.autoplay) {
            node.pause();
          }
        });
      });
    });

    flashObserver.observe(document.body, { childList: true, subtree: true });

    freezeGifsOnScroll = window.addEventListener("scroll", function () {
      [].slice.apply(document.images).filter(isGif).map(freezeGif);
    });
  } else {

    cssAnimationsStyleElement.textContent = "";

    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.paused) {
        video.play();
      }
    });

    if (flashObserver) {
      flashObserver.disconnect();
    }
    window.removeEventListener("scroll", freezeGifsOnScroll);

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
    i.src = c.toDataURL("image/gif");
  } catch (e) {

    for (var j = 0, a; (a = i.attributes[j]); j++) {
      c.setAttribute(a.name, a.value);
    }
    i.parentNode.replaceChild(c, i);
  }
}
