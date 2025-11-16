// ============================================================
// VISORA EXTENSION - CONTENT SCRIPT (MODULAR VERSION)
// DESCRIPTION: Main content script that imports and coordinates
//              all feature modules
// ============================================================

// Import configuration
import './modules/config.js';

// Import all feature modules
import { applyHighContrast } from './modules/highContrast.js';
import { 
  toggleImagesVisibility, 
  observeNewElements, 
  setHideImages,
  disconnectImageObserver,
  getImageObserver
} from './modules/imageVisibility.js';
import { toggleLinkHighlight } from './modules/linkHighlight.js';
import { flashContent } from './modules/animationControl.js';
import { focusLineEnabled } from './modules/focusLine.js';
import { toggleDyslexiaFont } from './modules/dyslexiaFont.js';
import { 
  toggleLetterSpacing, 
  applyCustomLetterSpacing,
  toggleFontSize,
  applyCustomFontSize,
  toggleLineHeight,
  applyCustomLineHeight,
  toggleContentWidth,
  applyCustomContentWidth
} from './modules/textAdjustments.js';
import { toggleDimmerOverlay } from './modules/dimmerOverlay.js';
import { 
  toggleLargeCursor, 
  toggleCursorSize, 
  applyCustomCursorSize 
} from './modules/cursorEnhancements.js';
import { enableAutocomplete } from './modules/autocomplete.js';
import { togglePopupBlocker } from './modules/popupBlocker.js';
import { toggleReadingMode } from './modules/readingMode.js';
import { toggleStickyElements } from './modules/stickyElements.js';
import { toggleHoverEffects } from './modules/hoverEffects.js';

// ============================================================
// STATE VARIABLES
// ============================================================

let toggleImgListener;
let hideImages = false;
let imageObserver;

// ============================================================
// FEATURE: Message Router & Feature Dispatcher
// DEVELOPER: Team Member 3
// DESCRIPTION: Central message handler that routes requests
//              from popup/background to appropriate feature functions
// ============================================================

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "hideImagesEnabled":
      hideImages = request.enabled;
      setHideImages(request.enabled);
      toggleImagesVisibility();
      if (hideImages) {
        imageObserver = observeNewElements();
        toggleImgListener = window.addEventListener("scroll", () => {
          toggleImagesVisibility();
        });
      } else if (getImageObserver()) {
        disconnectImageObserver();
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
      // applyFocusedReadingToSelection();
      break;
    case "summarizeSelection":
      // summarizeSelection();
      break;
    case "openMagnifiedImage":
      // openMagnifiedImage(request.srcUrl);
      break;
    case "readImage":
      // readImage(request.srcUrl);
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
