

import { pipeline, env } from '@xenova/transformers';
let toggleImgListener;
let hideImages = false;

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "hideImagesEnabled":
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
      break;
    case "highContrastEnabled":
      applyHighContrast(request.enabled);
      break;
    case "highlightLinksEnabled":
      toggleLinkHighlight(request.enabled);
      break;
    case "flashContentEnabled":
      flashContent(request.enabled);
      break;
    case "focusLineEnabled":
      focusLineEnabled(request.enabled);
      break;
    case "dyslexiaFontEnabled":
      toggleDyslexiaFont(request.enabled);
      break;
    case "letterSpacingEnabled":
      toggleLetterSpacing(request.enabled);
      break;
    case "dimmerOverlayEnabled":
      toggleDimmerOverlay(request.enabled);
      break;
    case "largeCursorEnabled":
      toggleLargeCursor(request.enabled);
      break;
    case "cursorSizeEnabled":
      toggleCursorSize(request.enabled);
      break;
    case "autocompleteEnabled":
      enableAutocomplete();
      break;
    case "increaseFontSizeEnabled":
      toggleFontSize(request.enabled);
      break;
    case "increaseLineHeightEnabled":
      toggleLineHeight(request.enabled);
      break;
    case "limitContentWidthEnabled":
      toggleContentWidth(request.enabled);
      break;
    case "removePopupsEnabled":
      togglePopupBlocker(request.enabled);
      break;
    case "readingModeEnabled":
      toggleReadingMode(request.enabled);
      break;
    case "disableStickyEnabled":
      toggleStickyElements(request.enabled);
      break;
    case "disableHoverEnabled":
      toggleHoverEffects(request.enabled);
      break;
    case "applyFocusedReading":
      applyFocusedReadingToSelection();
      break;
    case "summarizeSelection":
      summarizeSelection();
      break;
    case "openMagnifiedImage":
      openMagnifiedImage(request.srcUrl);
      break;
    case "readImage":
      readImage(request.srcUrl);
      break;
    case "showDefinition":
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.title = request.definition;
      range.surroundContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
      break;
    case "alertUser":
      if (request.message) {
        alert(request.message);
      }
      break;
    case "updateLetterSpacing":
      applyCustomLetterSpacing(request.value);
      break;
    case "updateFontSize":
      applyCustomFontSize(request.value);
      break;
    case "updateLineHeight":
      applyCustomLineHeight(request.value);
      break;
    case "updateContentWidth":
      applyCustomContentWidth(request.value);
      break;
    case "updateCursorSize":
      applyCustomCursorSize(request.size);
      break;
    default:
      console.log("Unknown action: " + request.action);
  }
});

let wordList = [];

fetch(chrome.runtime.getURL("assets/words.json"))
  .then((response) => response.json())
  .then((json) => {
    wordList = Object.keys(json);
    console.log(wordList);
  })
  .catch((error) => console.error("Error loading word list:", error));

// ============================================================
// FEATURE: Image Visibility Control
// DEVELOPER: Team Member 4
// DESCRIPTION: Hides/shows images and background images to
//              reduce sensory overload for sensitive users
// ============================================================

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

let imageObserver;
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
}


function applyHighContrast(state) {
  const styleId = "high-contrast-style";
  let styleElement = document.getElementById(styleId);

  if (state) {
    // Apply inversion to everything
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";

    // Create style element to counter-invert images
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Counter-invert images and videos to keep them original
    styleElement.textContent = `
      img, 
      video, 
      picture,
      [style*="background-image"],
      iframe,
      canvas {
        filter: invert(1) hue-rotate(180deg) !important;
      }
    `;
  } else {
    // Remove inversion
    document.documentElement.style.filter = "";

    // Remove the style element
    if (styleElement) {
      styleElement.remove();
    }
  }
}


const originalStyles = new Map();
// Apply or remove the highlight class from links
function toggleLinkHighlight(highlight) {
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



let flashObserver = null;
let freezeGifsOnScroll = null;
function flashContent(enabled) {
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
    flashObserver.disconnect();
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

// ============================================================
// FEATURE: Reading Focus Line Guide
// DEVELOPER: Team Member 6
// DESCRIPTION: Creates a horizontal line with triangle pointer
//              that follows cursor to assist with reading focus
// ============================================================

let focusLine = null;
let focusTriangle = null;
let focusLineTop = null;
let focusLineBottom = null;

function focusLineEnabled(enabled) {
  if (enabled) {
    if (!focusLine) {
      // Create the main focus line (semi-transparent)
      focusLine = document.createElement("div");
      focusLine.style.position = "fixed";
      focusLine.style.left = 0;
      focusLine.style.right = 0;
      focusLine.style.height = "2px";
      focusLine.style.backgroundColor = "rgba(59, 130, 246, 0.6)"; // Semi-transparent blue
      focusLine.style.pointerEvents = "none";
      focusLine.style.zIndex = "999999";
      focusLine.style.boxShadow = "0 0 8px rgba(59, 130, 246, 0.8)"; // Glow effect
      document.body.appendChild(focusLine);

      // Create top border line
      focusLineTop = document.createElement("div");
      focusLineTop.style.position = "fixed";
      focusLineTop.style.left = 0;
      focusLineTop.style.right = 0;
      focusLineTop.style.height = "1px";
      focusLineTop.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
      focusLineTop.style.pointerEvents = "none";
      focusLineTop.style.zIndex = "999999";
      document.body.appendChild(focusLineTop);

      // Create bottom border line
      focusLineBottom = document.createElement("div");
      focusLineBottom.style.position = "fixed";
      focusLineBottom.style.left = 0;
      focusLineBottom.style.right = 0;
      focusLineBottom.style.height = "1px";
      focusLineBottom.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
      focusLineBottom.style.pointerEvents = "none";
      focusLineBottom.style.zIndex = "999999";
      document.body.appendChild(focusLineBottom);

      // Create the triangle pointer
      focusTriangle = document.createElement("div");
      focusTriangle.style.position = "fixed";
      focusTriangle.style.width = "0";
      focusTriangle.style.height = "0";
      focusTriangle.style.borderLeft = "8px solid transparent";
      focusTriangle.style.borderRight = "8px solid transparent";
      focusTriangle.style.borderBottom = "8px solid rgba(59, 130, 246, 0.8)";
      focusTriangle.style.zIndex = "1000000";
      focusTriangle.style.pointerEvents = "none";
      focusTriangle.style.filter = "drop-shadow(0 0 3px rgba(59, 130, 246, 0.6))";
      document.body.appendChild(focusTriangle);
    }
    // Event listener to update position of focus line and triangle
    document.addEventListener("mousemove", function (e) {
      updateFocusLine(e, focusLine, focusTriangle, focusLineTop, focusLineBottom);
    });
  } else {
    document.removeEventListener("mousemove", updateFocusLine);
    // Remove the focus line and triangle if they exist
    if (focusLine) {
      focusLine.remove();
      focusLine = null;
    }
    if (focusTriangle) {
      focusTriangle.remove();
      focusTriangle = null;
    }
    if (focusLineTop) {
      focusLineTop.remove();
      focusLineTop = null;
    }
    if (focusLineBottom) {
      focusLineBottom.remove();
      focusLineBottom = null;
    }
  }
}

function updateFocusLine(e, focusLine, focusTriangle, focusLineTop, focusLineBottom) {
  if (focusLine !== null && focusTriangle !== null) {
    // Use clientY for vertical position to avoid issues with scrolling
    const yPosition = e.clientY;

    // Update main focus line position to follow the mouse cursor
    focusLine.style.top = `${yPosition}px`;

    // Update top border line (20px above)
    if (focusLineTop) {
      focusLineTop.style.top = `${yPosition - 20}px`;
    }

    // Update bottom border line (20px below)
    if (focusLineBottom) {
      focusLineBottom.style.top = `${yPosition + 20}px`;
    }

    // Update triangle position
    focusTriangle.style.left = `${e.clientX - 8}px`;
    focusTriangle.style.top = `${yPosition - 8}px`;
  }
}

// ============================================================
// FEATURE: Dyslexia-Friendly Font Injection
// DEVELOPER: Team Member 6
// DESCRIPTION: Replaces page fonts with OpenDyslexic font
//              designed specifically for readers with dyslexia
// ============================================================

function toggleDyslexiaFont(enableFont) {
  const styleId = "dyslexia-friendly-style";
  let styleElement = document.getElementById(styleId);

  if (enableFont) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Embed the font in the document
    styleElement.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('${chrome.runtime.getURL(
      "assets/OpenDyslexic.otf"
    )}') format('opentype');
        }

        body, button, input, textarea, select, p, li, span, div  {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      }
      `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Letter Spacing Adjustment
// DEVELOPER: Team Member 7
// DESCRIPTION: Increases spacing between letters for easier
//              reading, particularly helpful for dyslexia
// ============================================================

function toggleLetterSpacing(enabled) {
  const styleId = "my-extension-letter-spacing-style";
  let styleElement = document.getElementById(styleId);
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `* { letter-spacing: 0.12em !important; }`; // Set desired letter-spacing value
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Custom Letter Spacing Control
// DESCRIPTION: Dynamically adjust letter spacing with slider
// ============================================================

function applyCustomLetterSpacing(value) {
  const styleId = "custom-letter-spacing-style";
  let styleElement = document.getElementById(styleId);

  if (value > 0) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `* { letter-spacing: ${value}em !important; }`;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Custom Font Size Control
// DESCRIPTION: Dynamically adjust font size with slider (100% to 200%)
// ============================================================

function applyCustomFontSize(value) {
  const styleId = "custom-font-size-style";
  let styleElement = document.getElementById(styleId);

  if (value !== 100) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      html {
        font-size: ${value}% !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Custom Line Height Control
// DESCRIPTION: Dynamically adjust line height with slider (1.0 to 3.0)
// ============================================================

function applyCustomLineHeight(value) {
  const styleId = "custom-line-height-style";
  let styleElement = document.getElementById(styleId);

  if (value !== 1.5) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body, body *, p, li, div, span {
        line-height: ${value} !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Custom Content Width Control
// DESCRIPTION: Dynamically adjust content width with slider (600px to 1400px)
// ============================================================

function applyCustomContentWidth(value) {
  const styleId = "custom-content-width-style";
  let styleElement = document.getElementById(styleId);

  if (value < 1400) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body {
        max-width: ${value}px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      body > * {
        max-width: 100% !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Custom Cursor Size Control
// DESCRIPTION: Change cursor size (small, medium, large)
// ============================================================

function applyCustomCursorSize(size) {
  const styleId = "custom-cursor-size-style";
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  let cursorStyle = '';

  switch (size) {
    case 'small':
      cursorStyle = `body, body * { 
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0 L0 12 L4 9 L6 14 L8 13 L6 8 L10 8 Z" fill="black" stroke="white" stroke-width="1"/></svg>') 0 0, auto !important; 
      }`;
      break;
    case 'medium':
      cursorStyle = `body, body * { 
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L0 18 L6 13.5 L9 21 L12 19.5 L9 12 L15 12 Z" fill="black" stroke="white" stroke-width="1.5"/></svg>') 0 0, auto !important; 
      }`;
      break;
    case 'large':
      cursorStyle = `body, body * { 
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M0 0 L0 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z" fill="black" stroke="white" stroke-width="2"/></svg>') 0 0, auto !important; 
      }`;
      break;
    case 'default':
    default:
      cursorStyle = '';
      break;
  }

  styleElement.textContent = cursorStyle;
}



// ============================================================
// FEATURE: Dimmer Overlay with Flashlight Effect
// DEVELOPER: Team Member 7
// DESCRIPTION: Creates a darkening overlay with circular spotlight
//              that follows cursor to reduce visual distractions
// ============================================================

let flashlightOverlay;

function toggleDimmerOverlay(enabled) {
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

// ============================================================
// FEATURE: Large Cursor Enhancement
// DEVELOPER: Team Member 8
// DESCRIPTION: Replaces default cursor with larger custom image
//              for better visibility (motor impairment support)
// ============================================================

function toggleLargeCursor(enabled) {
  const cursorUrl = chrome.runtime.getURL("assets/cursor.png"); // Path to your PNG cursor image
  const cursorStyleElement =
    document.getElementById("large-cursor-style") || createCursorStyleElement();

  if (enabled) {
    // Enlarge the cursor using the PNG cursor image
    cursorStyleElement.textContent = `body, body * { cursor: url('${cursorUrl}'), auto !important; }`;
  } else {
    // Reset to the default cursor
    cursorStyleElement.textContent = "";
  }
}

function createCursorStyleElement() {
  const style = document.createElement("style");
  style.id = "large-cursor-style";
  document.head.appendChild(style);
  return style;
}

// ============================================================
// FEATURE: Cursor Size Toggle (New)
// DESCRIPTION: Enables cursor size adjustment feature
// ============================================================

function toggleCursorSize(enabled) {
  if (enabled) {
    // Load saved cursor size and apply it
    chrome.storage.local.get(['cursorSize'], (result) => {
      const size = result.cursorSize || 'default';
      applyCustomCursorSize(size);
    });
  } else {
    // Reset to default cursor
    applyCustomCursorSize('default');
  }
}

// ============================================================
// FEATURE: Intelligent Autocomplete System
// DEVELOPER: Team Member 8
// DESCRIPTION: Provides word suggestions for text inputs using
//              6.86MB dictionary to assist cognitive challenges
// ============================================================

function createAutocomplete(inputElement) {
  let autoCompleteDiv = document.createElement("div");
  autoCompleteDiv.className = "autocomplete-items";
  // Position the autocomplete items below the input element
  autoCompleteDiv.style.position = "absolute";
  autoCompleteDiv.style.border = "1px solid #d4d4d4";
  autoCompleteDiv.style.backgroundColor = "#fff";
  autoCompleteDiv.style.zIndex = "99";
  autoCompleteDiv.style.top = `${inputElement.offsetTop + inputElement.offsetHeight
    }px`;
  autoCompleteDiv.style.left = `${inputElement.offsetLeft}px`;
  autoCompleteDiv.style.width = `${inputElement.offsetWidth}px`;

  inputElement.parentNode.appendChild(autoCompleteDiv);

  inputElement.addEventListener("input", function () {
    // Get the current word the user is typing (the last word in the input)
    let currentInput = this.value;
    let currentWords = currentInput.split(/\s+/); // Split the input into words
    let currentWord = currentWords[currentWords.length - 1]; // Get the last word
    // Clear any existing autocomplete items
    while (autoCompleteDiv.firstChild) {
      autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
    }
    if (!currentWord) return false;
    // Filter the wordList based on the current word
    let matchedWords = wordList.filter(
      (word) =>
        word.substr(0, currentWord.length).toUpperCase() ===
        currentWord.toUpperCase()
    );
    // Sort the matched words by length
    // Sort the matched words by length, and then alphabetically for words of the same length
    matchedWords.sort((a, b) => {
      if (a.length === b.length) {
        return a.localeCompare(b); // Alphabetical order for words of the same length
      }
      return a.length - b.length; // Shortest words first
    }); // Limit the number of suggestions
    matchedWords.slice(0, 5).forEach((matchedWord) => {
      // Create a DIV element for each matching element
      let itemDiv = document.createElement("div");
      // Make the matching letters bold
      itemDiv.innerHTML = `<strong>${matchedWord.substr(
        0,
        currentWord.length
      )}</strong>${matchedWord.substr(currentWord.length)}`;
      itemDiv.addEventListener("click", function () {
        // Replace the last word with the selected word from autocomplete suggestions
        currentWords[currentWords.length - 1] = matchedWord;
        inputElement.value = currentWords.join(" ") + " "; // Add a space after the inserted word
        // Clear the items
        while (autoCompleteDiv.firstChild) {
          autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
        }
      });
      autoCompleteDiv.appendChild(itemDiv);
    });
  });

  // Close the list when the user clicks elsewhere
  document.addEventListener("click", function (e) {
    if (e.target !== inputElement && e.target.parentNode !== autoCompleteDiv) {
      while (autoCompleteDiv.firstChild) {
        autoCompleteDiv.removeChild(autoCompleteDiv.firstChild);
      }
    }
    e.stopPropagation(); // Stop the click event from closing the div prematurely
  });
}

// Query all text inputs and attach the autocomplete
function enableAutocomplete() {
  document
    .querySelectorAll('input[type="text"]:not([autocomplete="on"])')
    .forEach((inputElement) => {
      createAutocomplete(inputElement);
    });
}

// ============================================================
// FEATURE: Focused Reading (Bionic Reading Style)
// DEVELOPER: Team Member 9
// DESCRIPTION: Bolds first letters of words to create fixation
//              points for faster, easier reading comprehension
// ============================================================

function applyFocusedReadingToSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    const selectedText = range.toString();
    const processedText = processText(selectedText);
    const newNode = document.createElement('span');
    newNode.innerHTML = processedText;
    range.deleteContents();
    range.insertNode(newNode);
    selection.removeAllRanges();
  }
}

function processText(text) {
  // Split the text and wrap parts of it in <b> tags as per the logic in splitWord
  // Assuming splitWord returns an array of two strings: the part to be bolded and the rest
  return text.split(/\s+/).map(word => {
    const [firstPart, secondPart] = splitWord(word);
    return `<b>${firstPart}</b>${secondPart}`;
  }).join(' ');
}

function splitWord(word) {
  // Define the logic to split the word for bolding part of it
  // Here we're bolding the first letter or first few letters of each word
  const wordLength = word.length;
  let splitIndex = wordLength <= 4 ? 1 : 4;
  return [word.substring(0, splitIndex), word.substring(splitIndex)];
}

// ============================================================
// FEATURE: AI-Powered Text Summarization
// DEVELOPER: Team Member 9
// DESCRIPTION: Uses DistilBART neural network to generate
//              concise summaries of selected text (250MB model)
// ============================================================

function summarizeSelection() {
  createLoadingOverlay();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    summarizeText(range.toString());
  }
}

async function summarizeText(txt) {
  const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
  await summarizer(txt).then((response) => {
    const selectedText = "Summary: " + response[0].summary_text;
    removeLoadingOverlay();
    createPopup(selectedText)
  });
}

function createPopup(summary) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.bottom = '10px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '10px';
  popup.style.border = '1px solid #000';
  popup.style.zIndex = '1000';
  popup.style.maxWidth = '100vw';
  popup.style.overflowY = 'scroll';
  popup.textContent = summary;

  document.body.appendChild(popup);

  // Function to remove the popup
  function removePopup(event) {
    if (!popup.contains(event.target)) {
      document.body.removeChild(popup);
      document.removeEventListener('click', removePopup);
    }
  }

  // Add an event listener to detect clicks outside the popup
  setTimeout(() => {
    document.addEventListener('click', removePopup);
  }, 0);
}

// Add loading overlay
const createLoadingOverlay = () => {
  const overlay = document.createElement('div');
  overlay.id = 'loadingOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '10000';

  const spinner = document.createElement('div');
  spinner.style.border = '16px solid #f3f3f3';
  spinner.style.borderTop = '16px solid #3498db';
  spinner.style.borderRadius = '50%';
  spinner.style.width = '120px';
  spinner.style.height = '120px';
  spinner.style.animation = 'spin 2s linear infinite';

  overlay.appendChild(spinner);
  document.body.appendChild(overlay);

  // Add spinner animation
  const style = document.createElement('style');
  style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  document.head.appendChild(style);
};

// Remove loading overlay
const removeLoadingOverlay = () => {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.remove();
  }
};

// ============================================================
// FEATURE: AI Image Description Generator
// DEVELOPER: Team Member 10
// DESCRIPTION: Uses Vision Transformer + GPT-2 to generate
//              descriptive captions for images (350MB model)
// ============================================================

async function readImage(srcUrl) {
  createLoadingOverlay();
  const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
  await captioner(srcUrl).then((res) => {
    removeLoadingOverlay();
    createPopup("Image Details: " + res[0].generated_text);
  });
}

// ============================================================
// FEATURE: Image Magnification with Zoom Lens
// DEVELOPER: Team Member 10
// DESCRIPTION: Creates a magnifying glass effect with 2x zoom
//              for detailed image inspection (visual impairment support)
// ============================================================

function openMagnifiedImage(imageSrc) {
  // Create an underlay to dim the background content
  const underlay = document.createElement('div');
  underlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    cursor: pointer;
  `;
  document.body.appendChild(underlay);

  // Create a container for the magnified image and append it to underlay
  const imgContainer = document.createElement('div');
  imgContainer.className = 'img-magnifier-container';
  imgContainer.style.cssText = `
    position: relative;
    width: 80%;  // Set this to the desired width
    max-width: 600px;  // Set a max-width if needed
    margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  underlay.appendChild(imgContainer);

  // Create the magnified image itself and append it to the container
  const magnifiedImg = document.createElement('img');
  magnifiedImg.src = imageSrc;
  magnifiedImg.style.cssText = `
    width: 100%;  // Image takes the full width of its container
    height: auto;  // Height is set automatically to keep aspect ratio
    display: block;  // To prevent inline default spacing
  `;
  magnifiedImg.onload = () => {
    // Once the image is loaded, apply the magnifying glass effect
    magnify(magnifiedImg, 2);  // The second parameter is the zoom level
  };
  imgContainer.appendChild(magnifiedImg);

  // Event listener for closing the magnified image when the underlay is clicked
  underlay.addEventListener('click', function () {
    underlay.remove();
  });
}

function magnify(img, zoom) {
  var glass = document.createElement("DIV");
  glass.className = "img-magnifier-glass";
  glass.style.cssText = `
    position: absolute;
    border-radius: 50%;
    border: 3px solid #000;
    cursor: none;
    width: 100px;
    height: 100px !important;
    box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.85), 0 0 7px 7px rgba(0, 0, 0, 0.25);
    background-image: url('${img.src}');
    background-repeat: no-repeat;
    background-size: ${img.width * zoom}px ${img.height * zoom}px;
    visibility: hidden;  // Hide it initially
  `;
  // Insert magnifier glass
  img.parentElement.insertBefore(glass, img);

  // Event listeners for moving the magnifier glass
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);

  // Event listeners for touch screens
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);

  function moveMagnifier(e) {
    var pos, x, y;
    e.preventDefault();  // Prevent any other actions that may occur when moving over the image
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    // Prevent the magnifier glass from being positioned outside the image
    if (x > img.width - (glass.offsetWidth / zoom)) { x = img.width - (glass.offsetWidth / zoom); }
    if (x < glass.offsetWidth / zoom) { x = glass.offsetWidth / zoom; }
    if (y > img.height - (glass.offsetHeight / zoom)) { y = img.height - (glass.offsetHeight / zoom); }
    if (y < glass.offsetHeight / zoom) { y = glass.offsetHeight / zoom; }
    // Set the position of the magnifier glass
    glass.style.left = (x - glass.offsetWidth / 2) + "px";
    glass.style.top = (y - glass.offsetHeight / 2) + "px";
    // Display what the magnifier glass "sees"
    glass.style.backgroundPosition = `-${((x * zoom) - glass.offsetWidth / 2 + 3)}px -${((y * zoom) - glass.offsetHeight / 2 + 3)}px`;
    glass.style.visibility = 'visible';  // Show magnifier
  }

  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    a = img.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}

// ============================================================
// FEATURE: Font Size Adjustment
// DEVELOPER: Team Member 11
// DESCRIPTION: Increases all text size by 25% for better
//              readability (visual impairment support)
// ============================================================

// Font Size Control
function toggleFontSize(enabled) {
  const styleId = "ability-font-size-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      html {
        font-size: 125% !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Line Height Spacing Control
// DEVELOPER: Team Member 11
// DESCRIPTION: Doubles line spacing to reduce text density
//              and improve readability for dyslexia
// ============================================================

// Line Height Control
function toggleLineHeight(enabled) {
  const styleId = "ability-line-height-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body, body *, p, li, div, span {
        line-height: 2 !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Content Width Limiter
// DEVELOPER: Team Member 12
// DESCRIPTION: Restricts line length to 800px for optimal
//              reading (reduces eye fatigue)
// ============================================================

// Content Width Control
function toggleContentWidth(enabled) {
  const styleId = "ability-content-width-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body {
        max-width: 800px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      body > * {
        max-width: 100% !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Intelligent Popup & Modal Blocker
// DEVELOPER: Team Member 12
// DESCRIPTION: Auto-detects and hides modals, dialogs, and
//              overlays to reduce cognitive load for autism/ADHD
// ============================================================

// Popup Blocker
let popupObserver = null;

function togglePopupBlocker(enabled) {
  const styleId = "ability-popup-blocker-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      [class*="modal"], [class*="popup"], [class*="overlay"],
      [id*="modal"], [id*="popup"], [id*="overlay"],
      [role="dialog"], [aria-modal="true"],
      div[style*="position: fixed"][style*="z-index"] {
        display: none !important;
      }
    `;

    // Watch for new popups
    popupObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const role = node.getAttribute('role');
            const ariaModal = node.getAttribute('aria-modal');
            const className = node.className || '';
            const id = node.id || '';

            if (role === 'dialog' || ariaModal === 'true' ||
              className.includes('modal') || className.includes('popup') ||
              id.includes('modal') || id.includes('popup')) {
              node.style.display = 'none';
            }
          }
        });
      });
    });

    popupObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    if (styleElement) {
      styleElement.remove();
    }
    if (popupObserver) {
      popupObserver.disconnect();
      popupObserver = null;
    }
  }
}

// ============================================================
// FEATURE: Clutter-Free Reading Mode
// DEVELOPER: Team Member 13
// DESCRIPTION: Removes sidebars, ads, navigation to create
//              distraction-free reading experience
// ============================================================

// Reading Mode
function toggleReadingMode(enabled) {
  const styleId = "ability-reading-mode-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      /* Hide navigation elements - more specific selectors */
      nav:not([role="main"]):not([role="article"]),
      header nav,
      [role="navigation"]:not([role="main"]),
      div[class*="navigation"]:not([role="main"]),
      div[class*="navbar"],
      div[class*="nav-bar"],
      div[id*="navigation"],
      div[id*="navbar"],
      ul[class*="menu"]:not([role="main"]),
      div[class*="menu"]:not([role="main"]) {
        display: none !important;
      }
      
      /* Hide sidebars - more specific */
      aside:not([role="main"]):not([role="article"]),
      div[class*="sidebar"]:not([role="main"]),
      div[class*="side-bar"]:not([role="main"]),
      div[id*="sidebar"]:not([role="main"]),
      section[class*="sidebar"],
      div[class*="widget"] {
        display: none !important;
      }
      
      /* Hide ads and promotional content - more specific */
      div[class*="advertisement"],
      div[class*="ad-container"],
      div[class*="ad-wrapper"],
      div[id*="advertisement"],
      div[id*="ad-container"],
      ins.adsbygoogle,
      iframe[src*="ads"],
      iframe[src*="doubleclick"],
      iframe[src*="googlesyndication"],
      iframe[src*="googleadservices"],
      div[class*="banner"]:not([role="banner"]),
      div[class*="promo"],
      div[id*="promo"],
      [data-ad-slot],
      [data-google-query-id] {
        display: none !important;
      }
      
      /* Make hyperlinks less distracting - use normal text color */
      a:not([role="button"]):not(.button):not(.btn),
      a:link:not([role="button"]):not(.button):not(.btn),
      a:visited:not([role="button"]):not(.button):not(.btn) {
        color: inherit !important;
        text-decoration: none !important;
        border-bottom: 1px dotted rgba(0, 0, 0, 0.3) !important;
      }
      
      a:hover:not([role="button"]):not(.button):not(.btn) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.5) !important;
      }
      
      /* Keep main content visible and clean */
      main, 
      article, 
      [role="main"],
      [role="article"],
      div[class*="content"]:not([class*="ad"]),
      div[class*="article"],
      div[class*="post"] {
        display: block !important;
        visibility: visible !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Sticky Element Disabler
// DEVELOPER: Team Member 13
// DESCRIPTION: Removes fixed headers/footers that obstruct
//              content (motor impairment & reading assistance)
// ============================================================

// Disable Sticky Elements
function toggleStickyElements(enabled) {
  const styleId = "ability-disable-sticky-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      * {
        position: static !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}

// ============================================================
// FEATURE: Hover Effect Disabler
// DEVELOPER: Team Member 14
// DESCRIPTION: Prevents hover-triggered actions to avoid
//              accidental activations (motor control issues)
// ============================================================

// Disable Hover Effects
function toggleHoverEffects(enabled) {
  const styleId = "ability-disable-hover-style";
  let styleElement = document.getElementById(styleId);

  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      * {
        pointer-events: auto !important;
      }
      *:hover {
        all: unset !important;
      }
    `;
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
}
