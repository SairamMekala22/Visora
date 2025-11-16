

import * as CloudSync from './sync/cloudSync.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabId') {
        sendResponse({ tabId: sender.tab?.id });
        return true;
    }

    if (request.action === 'updateFeatureStorage') {
        const featureKey = request.featureKey;
        const enabled = request.enabled;
        const tabId = sender.tab?.id;

        if (tabId && featureKey) {
            chrome.storage.local.get(featureKey, (result) => {
                const tabState = result[featureKey] || {};
                tabState[tabId] = enabled;
                chrome.storage.local.set({ [featureKey]: tabState }, () => {
                    console.log('✅ Background: Storage updated for', featureKey, enabled);
                    sendResponse({ success: true });
                });
            });
            return true;
        } else {
            sendResponse({ success: false, error: 'Missing tabId or featureKey' });
        }
    }

});

chrome.runtime.onInstalled.addListener((details) => {
    chrome.contextMenus.create({
        id: "speak-selected-text",
        title: "Speak Selection",
        contexts: ["selection"],
    });

    chrome.contextMenus.create({
        id: "speech-to-text",
        title: "Speech-To-Text",
        contexts: ["editable"],
    });

    chrome.contextMenus.create({
        id: "summarize",
        title: "Summarize Selection",
        contexts: ["selection"],
    });

      chrome.contextMenus.create({
        id: 'magnify-image',
        title: 'Magnify',
        contexts: ['image'],
      });

      chrome.contextMenus.create({
        id: 'read-image',
      title: 'Describe',
      contexts: ['image'],
});

    if (details?.reason === 'install') {
        const iconUrl = chrome.runtime.getURL('assets/128.png');
        chrome.notifications?.create('visora-install-restart', {
            type: 'basic',
            iconUrl,
            title: 'visora is ready',
            message: 'If any features seem inactive, restart Chrome to finish enabling the extension.',
            requireInteraction: true
        }, () => {
            if (chrome.runtime.lastError) {
                console.warn('Install notification failed:', chrome.runtime.lastError.message);
            }
        });
    }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "speak-selected-text") {
        const { rate = 1, pitch = 1, volume = 1, voice = "native" } = await chrome.storage.local.get(["rate", "pitch", "volume", "voice"]);
        chrome.tts.speak(info.selectionText, {
            rate,
            pitch,
            volume,
            voiceName: voice,
            onEvent: function (event) {
                if (event.type === "error") {
                    console.error("TTS Error: ", event.errorMessage);
                }
            },
        });
    } else if (info.menuItemId === "speech-to-text") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: startSpeechToText,
        });
    } else if (info.menuItemId === 'summarize') {
        chrome.tabs.sendMessage(tab.id, {
          action: 'summarizeSelection'
        });
      }
      else if (info.menuItemId === 'magnify-image') {
        chrome.tabs.sendMessage(tab.id, {
          action: 'openMagnifiedImage',
          srcUrl: info.srcUrl
        });
      }
      else if (info.menuItemId === 'read-image') {
        chrome.tabs.sendMessage(tab.id, {
          action: 'readImage',
          srcUrl: info.srcUrl
        });
      }
});

function startSpeechToText() {
    const activeElement = document.activeElement;

    const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        if (activeElement) {
            activeElement.value += transcript;
            activeElement.dispatchEvent(new Event("input", { bubbles: true }));
        }
    };

    recognition.onerror = function (event) {
        console.error("Speech Recognition Error:", event.error);
    };

    recognition.onend = function () {

    };
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {

        setTimeout(() => {
            chrome.storage.local.get(null, function(allStates) {
                const actions = {
                    voiceControlEnabled: 'voiceControlEnabled',
                    focusLineEnabled: 'focusLineEnabled',
                    flashContentEnabled: 'flashContentEnabled',
                    highlightLinksEnabled: 'highlightLinksEnabled',
                    dyslexiaFontEnabled: 'dyslexiaFontEnabled',
                    highContrastEnabled: 'highContrastEnabled',
                    hideImagesEnabled: 'hideImagesEnabled',
                    letterSpacingEnabled: 'letterSpacingEnabled',
                    dimmerOverlayEnabled: 'dimmerOverlayEnabled',
                    largeCursorEnabled: 'largeCursorEnabled',
                    cursorSizeEnabled: 'cursorSizeEnabled',
                    autocompleteEnabled: 'autocompleteEnabled',
                    increaseFontSizeEnabled: 'increaseFontSizeEnabled',
                    increaseLineHeightEnabled: 'increaseLineHeightEnabled',
                    limitContentWidthEnabled: 'limitContentWidthEnabled',
                    removePopupsEnabled: 'removePopupsEnabled',
                    readingModeEnabled: 'readingModeEnabled',
                    disableStickyEnabled: 'disableStickyEnabled',
                    disableHoverEnabled: 'disableHoverEnabled',
                };

                Object.keys(allStates).forEach((stateKey) => {
                    const isEnabled = allStates[stateKey]?.[tabId];
                    const action = actions[stateKey];

                    if (action && isEnabled) {

                        chrome.tabs.sendMessage(tabId, {
                            action,
                            enabled: true
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.log('Feature will be restored by content script initialization:', stateKey);
                            }
                        });
                    }
                });
            });
        }, 100);
    }
});
