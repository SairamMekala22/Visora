

function updateLetterSpacing(value) {
  const styleId = 'letter-spacing-control';

  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateLetterSpacing') {
    updateLetterSpacing(request.value);
    sendResponse({ success: true });
  }
});

chrome.storage.sync.get(['letterSpacing'], (result) => {
  if (result.letterSpacing !== undefined && result.letterSpacing > 0) {
    updateLetterSpacing(result.letterSpacing);
  }
});