// ============================================================
// VISORA EXTENSION - CONTENT SCRIPT (MODULAR VERSION)
// DESCRIPTION: Main content script that imports and coordinates
//              all feature modules
// ============================================================

// Import configuration
import './features/config.js';

// Import all feature modules
import { applyHighContrast } from './features/visual/highContrast.js';
import { 
  toggleImagesVisibility, 
  observeNewElements, 
  setHideImages,
  disconnectImageObserver,
  getImageObserver
} from './features/visual/hideImages.js';
import { toggleLinkHighlight } from './features/visual/highlightLinks.js';
import { flashContent } from './features/visual/flashContent.js';
import { focusLineEnabled } from './features/visual/focusLine.js';
import { toggleDyslexiaFont } from './features/typography/dyslexiaFont.js';
import { 
  toggleLetterSpacing, 
  applyCustomLetterSpacing,
  toggleFontSize,
  applyCustomFontSize,
  toggleLineHeight,
  applyCustomLineHeight,
  toggleContentWidth,
  applyCustomContentWidth
} from './features/typography/lineHeightControl.js';
import { toggleDimmerOverlay } from './features/interactive/dimmerOverlay.js';
import { 
  toggleLargeCursor, 
  toggleCursorSize, 
  applyCustomCursorSize 
} from './features/interactive/cursorControl.js';
import { enableAutocomplete } from './features/interactive/autocomplete.js';
import { togglePopupBlocker } from './features/utility/popupBlocker.js';
import { toggleReadingMode } from './features/layout/readingMode.js';
import { toggleStickyElements } from './features/layout/disableSticky.js';
import { toggleHoverEffects } from './features/layout/disableHover.js';
import { 
  toggleVoiceControl, 
  getVoiceControlStatus 
} from './features/utility/voiceControl.js';

// ============================================================
// STATE VARIABLES
// ============================================================

let toggleImgListener;
let hideImages = false;
let imageObserver;

// Track active feature states
let activeFeatureStates = {
  hideImagesEnabled: false,
  highContrastEnabled: false,
  highlightLinksEnabled: false,
  flashContentEnabled: false,
  focusLineEnabled: false,
  dyslexiaFontEnabled: false,
  letterSpacingEnabled: false,
  dimmerOverlayEnabled: false,
  largeCursorEnabled: false,
  cursorSizeEnabled: false,
  autocompleteEnabled: false,
  increaseFontSizeEnabled: false,
  increaseLineHeightEnabled: false,
  limitContentWidthEnabled: false,
  removePopupsEnabled: false,
  readingModeEnabled: false,
  disableStickyEnabled: false,
  disableHoverEnabled: false,
  voiceControlEnabled: false
};

// ============================================================
// VOICE COMMAND EVENT LISTENER
// ============================================================

document.addEventListener('visoraVoiceCommand', function(event) {
  const { action, enabled } = event.detail;
  handleFeatureToggle(action, enabled);
});

// ============================================================
// FEATURE HANDLER FUNCTION
// ============================================================

function handleFeatureToggle(action, enabled) {
  // Update state tracking
  if (activeFeatureStates.hasOwnProperty(action)) {
    activeFeatureStates[action] = enabled;
  }

  switch (action) {
    case "hideImagesEnabled":
      hideImages = enabled;
      setHideImages(enabled);
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
      applyHighContrast(enabled);
      break;
    case "highlightLinksEnabled":
      toggleLinkHighlight(enabled);
      break;
    case "flashContentEnabled":
      flashContent(enabled);
      break;
    case "focusLineEnabled":
      focusLineEnabled(enabled);
      break;
    case "dyslexiaFontEnabled":
      toggleDyslexiaFont(enabled);
      break;
    case "letterSpacingEnabled":
      toggleLetterSpacing(enabled);
      break;
    case "dimmerOverlayEnabled":
      toggleDimmerOverlay(enabled);
      break;
    case "largeCursorEnabled":
      toggleLargeCursor(enabled);
      break;
    case "cursorSizeEnabled":
      toggleCursorSize(enabled);
      break;
    case "autocompleteEnabled":
      enableAutocomplete();
      activeFeatureStates.autocompleteEnabled = true;
      break;
    case "increaseFontSizeEnabled":
      toggleFontSize(enabled);
      break;
    case "increaseLineHeightEnabled":
      toggleLineHeight(enabled);
      break;
    case "limitContentWidthEnabled":
      toggleContentWidth(enabled);
      break;
    case "removePopupsEnabled":
      togglePopupBlocker(enabled);
      break;
    case "readingModeEnabled":
      toggleReadingMode(enabled);
      break;
    case "disableStickyEnabled":
      toggleStickyElements(enabled);
      break;
    case "disableHoverEnabled":
      toggleHoverEffects(enabled);
      break;
  }
}

// ============================================================
// FEATURE: Message Router & Feature Dispatcher
// DEVELOPER: Team Member 3
// DESCRIPTION: Central message handler that routes requests
//              from popup/background to appropriate feature functions
// ============================================================

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle getting current feature states
  if (request.action === "getFeatureStates") {
    sendResponse({ states: activeFeatureStates });
    return true; // Keep channel open for async response
  }

  // Handle voice control toggle
  if (request.action === "voiceControlEnabled") {
    toggleVoiceControl(request.enabled);
    activeFeatureStates.voiceControlEnabled = request.enabled;
    return;
  }
  
  if (request.action === "getVoiceControlStatus") {
    sendResponse(getVoiceControlStatus());
    return;
  }

  // Handle all other feature toggles
  if (request.action && request.enabled !== undefined) {
    handleFeatureToggle(request.action, request.enabled);
    return;
  }

  // Handle special cases
  switch (request.action) {
    case "applyFocusedReading":
      // applyFocusedReadingToSelection();
      break;
    case "summarizeSelection":
      summarizeSelection();
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


// ============================================================
// FEATURE: Text Summarization
// DESCRIPTION: Summarizes selected text using AI
// ============================================================

import { pipeline } from '@xenova/transformers';

async function summarizeSelection() {
  console.log('📝 Summarize selection called');
  
  // Always show loading overlay first
  createLoadingOverlay();
  console.log('✅ Loading overlay created');
  
  // Small delay to ensure overlay renders
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    removeLoadingOverlay();
    alert('Please select some text first.');
    return;
  }
  const range = selection.getRangeAt(0);
  const text = range.toString().trim();
  
  if (!text || range.collapsed) {
    removeLoadingOverlay();
    alert('Please select some text first.');
    return;
  }
  
  // Check text length
  const wordCount = text.split(/\s+/).length;
  console.log('📊 Text length:', wordCount, 'words');
  
  if (wordCount < 20) {
    removeLoadingOverlay();
    alert('Please select at least 20 words for summarization.');
    return;
  }
  
  if (wordCount > 1000) {
    removeLoadingOverlay();
    alert('Text too long. Please select less than 1000 words.');
    return;
  }
  
  console.log('✅ Text validation passed, starting summarization...');
  await summarizeText(text);
}

// Cache the summarizer to avoid reloading
let cachedSummarizer = null;

async function summarizeText(txt) {
  try {
    console.log('Starting summarization...');
    updateLoadingText('Loading AI model (first time may take 30-60 seconds)...');
    
    // Load or use cached summarizer
    if (!cachedSummarizer) {
      console.log('Loading model for first time...');
      cachedSummarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
      console.log('Model loaded and cached!');
    } else {
      console.log('Using cached model');
    }
    
    updateLoadingText('Summarizing text...');
    
    // Add timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Summarization timeout (60s)')), 60000)
    );
    
    const summarizePromise = cachedSummarizer(txt, {
      max_length: 100,
      min_length: 20,
      do_sample: false
    });
    
    const response = await Promise.race([summarizePromise, timeoutPromise]);
    
    const selectedText = "Summary: " + response[0].summary_text;
    console.log('Summarization complete!');
    
    removeLoadingOverlay();
    createPopup(selectedText);
  } catch (error) {
    console.error('Summarization error:', error);
    removeLoadingOverlay();
    
    let errorMessage = 'Error: Could not summarize text.\n\n';
    if (error.message.includes('timeout')) {
      errorMessage += 'The summarization took too long. Try selecting shorter text.';
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorMessage += 'Network error. Please check your internet connection.';
    } else if (error.message.includes('memory') || error.message.includes('allocation')) {
      errorMessage += 'Not enough memory. Try selecting shorter text.';
    } else {
      errorMessage += error.message;
    }
    
    alert(errorMessage);
  }
}

function createPopup(summary) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.bottom = '10px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '20px';
  popup.style.border = '2px solid #3b82f6';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  popup.style.zIndex = '1000000';
  popup.style.maxWidth = '80vw';
  popup.style.maxHeight = '300px';
  popup.style.overflowY = 'auto';
  popup.style.color = '#000';
  popup.style.fontFamily = 'Arial, sans-serif';
  popup.style.fontSize = '14px';
  popup.style.lineHeight = '1.5';
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
  // Remove existing overlay if any
  const existingOverlay = document.getElementById('loadingOverlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  console.log('🎨 Creating loading overlay...');
  
  const overlay = document.createElement('div');
  overlay.id = 'loadingOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '999999';
  overlay.style.flexDirection = 'column';

  const spinner = document.createElement('div');
  spinner.style.border = '8px solid #f3f3f3';
  spinner.style.borderTop = '8px solid #3b82f6';
  spinner.style.borderRadius = '50%';
  spinner.style.width = '60px';
  spinner.style.height = '60px';
  spinner.style.animation = 'spin 1s linear infinite';

  const text = document.createElement('div');
  text.id = 'loadingText';
  text.style.color = '#fff';
  text.style.marginTop = '20px';
  text.style.fontSize = '16px';
  text.style.textAlign = 'center';
  text.style.maxWidth = '80%';
  text.style.padding = '0 20px';
  text.textContent = 'Preparing to summarize...';

  // Add keyframes for spinner animation
  const style = document.createElement('style');
  style.id = 'spinner-style';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  // Only add style if not already present
  if (!document.getElementById('spinner-style')) {
    document.head.appendChild(style);
  }

  overlay.appendChild(spinner);
  overlay.appendChild(text);
  document.body.appendChild(overlay);
  
  console.log('✅ Loading overlay added to page');
};

// Update loading text
const updateLoadingText = (message) => {
  const text = document.getElementById('loadingText');
  if (text) {
    text.textContent = message;
  }
};

// Remove loading overlay
const removeLoadingOverlay = () => {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    document.body.removeChild(overlay);
  }
};
