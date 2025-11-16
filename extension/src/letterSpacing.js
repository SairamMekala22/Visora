/**
 * Letter Spacing Control
 * Allows users to adjust letter spacing across the entire page
 */

function updateLetterSpacing(value) {
  const styleId = 'letter-spacing-control';
  
  // Remove existing style if present
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Only add style if value is greater than 0
  if (value > 0) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      * {
        letter-spacing: ${value}em !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateLetterSpacing') {
    updateLetterSpacing(request.value);
    sendResponse({ success: true });
  }
});

// Apply saved letter spacing on page load
chrome.storage.sync.get(['letterSpacing'], (result) => {
  if (result.letterSpacing !== undefined && result.letterSpacing > 0) {
    updateLetterSpacing(result.letterSpacing);
  }
});