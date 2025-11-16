// ============================================================
// Visora EXTENSION - VANILLA JAVASCRIPT POPUP
// DEVELOPER: Team Member 4 (Frontend Lead)
// DESCRIPTION: Pure JavaScript implementation for popup UI
//              No React, no frameworks - just vanilla JS
// ============================================================

// ============================================================
// FEATURE CONFIGURATION DATA
// ============================================================

const FEATURE_TOGGLES = [
    {
        id: "voice-control",
        label: "Voice Control",
        description: "Control features using voice commands (say 'help' for commands).",
        storageKey: "voiceControlEnabled",
    },
    {
        id: "hide-images",
        label: "Hide Images",
        description: "Remove images from the page to reduce sensory load.",
        storageKey: "hideImagesEnabled",
    },
    {
        id: "high-contrast",
        label: "High Contrast",
        description: "Apply a high-contrast theme for easier reading.",
        storageKey: "highContrastEnabled",
    },
    {
        id: "dyslexia-font",
        label: "Dyslexia-Friendly Font",
        description: "Swap fonts with a dyslexia-friendly alternative.",
        storageKey: "dyslexiaFontEnabled",
    },
    {
        id: "highlight-links",
        label: "Highlight Links",
        description: "Improve link visibility across the page.",
        storageKey: "highlightLinksEnabled",
    },
    {
        id: "flash-content",
        label: "Disable Animations",
        description: "Stop CSS animations and autoplaying media.",
        storageKey: "flashContentEnabled",
    },
    {
        id: "focus-line",
        label: "Focus Line",
        description: "Add a horizontal guide that follows the cursor.",
        storageKey: "focusLineEnabled",
    },
    {
        id: "letter-spacing",
        label: "Letter Spacing",
        description: "Increase spacing between characters.",
        storageKey: "letterSpacingEnabled",
    },
    {
        id: "dimmer-overlay",
        label: "Dimmer Overlay",
        description: "Dim surrounding content to reduce distractions.",
        storageKey: "dimmerOverlayEnabled",
    },
    {
        id: "cursor-size",
        label: "Cursor Size",
        description: "Adjust cursor size for better visibility.",
        storageKey: "cursorSizeEnabled",
    },
    {
        id: "autocomplete",
        label: "Autocomplete",
        description: "Enable autocomplete for all inputs on the page.",
        storageKey: "autocompleteEnabled",
    },
    {
        id: "increase-font-size",
        label: "Increase Font Size",
        description: "Make all text larger for easier reading.",
        storageKey: "increaseFontSizeEnabled",
    },
    {
        id: "increase-line-height",
        label: "Increase Line Height",
        description: "Add more space between lines of text.",
        storageKey: "increaseLineHeightEnabled",
    },
    {
        id: "limit-content-width",
        label: "Limit Content Width",
        description: "Restrict line length for comfortable reading.",
        storageKey: "limitContentWidthEnabled",
    },
    {
        id: "remove-popups",
        label: "Block Popups",
        description: "Hide modals, overlays, and interruptions.",
        storageKey: "removePopupsEnabled",
    },
    {
        id: "reading-mode",
        label: "Reading Mode",
        description: "Remove clutter, ads, and distractions.",
        storageKey: "readingModeEnabled",
    },
    {
        id: "disable-sticky",
        label: "Disable Sticky Elements",
        description: "Remove fixed headers and footers.",
        storageKey: "disableStickyEnabled",
    },
    {
        id: "disable-hover",
        label: "Disable Hover Effects",
        description: "Prevent hover-triggered actions.",
        storageKey: "disableHoverEnabled",
    },
];

const PRESETS = {
    focus: {
        name: "Focus Mode",
        settings: {
            removePopupsEnabled: true,
            disableStickyEnabled: true,
        },
    },
    lowVision: {
        name: "Low Vision",
        settings: {
            increaseFontSizeEnabled: true,
            highContrastEnabled: true,
            highlightLinksEnabled: true,
            largeCursorEnabled: true,
        },
    },
    dyslexia: {
        name: "Dyslexia Support",
        settings: {
            dyslexiaFontEnabled: true,
            letterSpacingEnabled: true,
            increaseLineHeightEnabled: true,
        },
    },
    motor: {
        name: "Motor Assistance",
        settings: {
            largeCursorEnabled: true,
            autocompleteEnabled: true,
        },
    },
};

// ============================================================
// STATE MANAGEMENT
// ============================================================

let currentTabId = null;
let toggleStates = {};
let ttsSettings = { rate: 1, pitch: 1, volume: 1, voice: "" };
let currentDomain = "";
let activePreset = null;

// ============================================================
// HELPER FUNCTION: Safe Message Sending
// ============================================================

function sendMessageToTab(tabId, message, callback) {
    if (!tabId) {
        console.log('No tab ID available');
        return;
    }

    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.log('Tab not found:', chrome.runtime.lastError.message);
            if (callback) callback(false);
            return;
        }

        // Check if tab is ready and not a restricted page
        if (tab && tab.status === 'complete' &&
            !tab.url.startsWith('chrome://') &&
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('edge://') &&
            !tab.url.startsWith('about:')) {

            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    // Content script not ready - feature will apply on page reload
                    console.log('Content script not ready. Feature saved and will apply on page reload.');
                    if (callback) callback(false);
                } else {
                    if (callback) callback(true);
                }
            });
        } else {
            console.log('Tab not ready or is a restricted page. Feature saved for next page load.');
            if (callback) callback(false);
        }
    });
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initializePopup();
});

// Listen for storage changes from voice commands
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && currentTabId) {
        // Update toggles when storage changes (from voice commands)
        for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
            // Check if this is a feature toggle
            const toggle = FEATURE_TOGGLES.find(t => t.storageKey === key);
            if (toggle && newValue && newValue[currentTabId] !== undefined) {
                const checkbox = document.getElementById(toggle.id);
                if (checkbox && checkbox.checked !== newValue[currentTabId]) {
                    checkbox.checked = newValue[currentTabId];
                    toggleStates[toggle.storageKey] = newValue[currentTabId];
                    console.log('🔄 Toggle updated from voice command:', toggle.id, newValue[currentTabId]);
                    
                    // Show/hide slider controls if applicable
                    const toggleItem = checkbox.closest('.toggle-item');
                    const sliderControl = toggleItem?.querySelector('.toggle-slider-control');
                    if (sliderControl) {
                        if (newValue[currentTabId]) {
                            sliderControl.classList.add('visible');
                        } else {
                            sliderControl.classList.remove('visible');
                        }
                    }
                }
            }
        }
        
        // Re-detect active preset after changes
        detectActivePreset();
    }
});

// Listen for tab changes to sync state
chrome.tabs.onActivated.addListener((activeInfo) => {
    currentTabId = activeInfo.tabId;
    // Reload popup state when switching tabs
    setTimeout(() => {
        loadToggleStates().then(() => {
            syncWithPageState();
        });
    }, 100);
});

// Listen for page updates to sync state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === currentTabId && changeInfo.status === 'complete') {
        // Sync when page finishes loading
        setTimeout(() => {
            syncWithPageState();
        }, 500);
    }
});

async function initializePopup() {
    // Get current tab
    await getCurrentTab();

    // Load TTS voices
    loadVoices();

    // Load TTS settings
    loadTtsSettings();

    // Generate toggle switches
    generateToggles();

    // Load toggle states
    await loadToggleStates();

    // Sync with actual page state
    await syncWithPageState();

    // Initialize advanced controls
    initializeAdvancedControls();

    // Detect active preset
    detectActivePreset();

    // Setup event listeners
    setupEventListeners();

    // Get current domain
    await getCurrentDomain();
    
    // Check authentication status and update UI
    await checkAuthStatus();
    
    // Listen for auth token from app (postMessage)
    window.addEventListener('message', handleAuthMessage);
}

// Sync popup toggles with actual page state
async function syncWithPageState() {
    if (!currentTabId) return;

    return new Promise((resolve) => {
        chrome.tabs.sendMessage(
            currentTabId,
            { action: 'getFeatureStates' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.log('Could not sync with page:', chrome.runtime.lastError.message);
                    resolve();
                    return;
                }

                if (response && response.states) {
                    console.log('Syncing with page state:', response.states);
                    
                    // Update each toggle based on actual page state
                    FEATURE_TOGGLES.forEach((toggle) => {
                        const actualState = response.states[toggle.storageKey];
                        if (actualState !== undefined) {
                            const checkbox = document.getElementById(toggle.id);
                            if (checkbox) {
                                checkbox.checked = actualState;
                                toggleStates[toggle.storageKey] = actualState;
                            }
                        }
                    });
                }
                resolve();
            }
        );
    });
}

// ============================================================
// TAB & DOMAIN DETECTION
// ============================================================

async function getCurrentTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                currentTabId = tabs[0].id;
            }
            resolve();
        });
    });
}

async function getCurrentDomain() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                try {
                    const url = new URL(tabs[0].url);
                    currentDomain = url.hostname;
                    document.getElementById('domainDescription').textContent =
                        `Save settings for ${currentDomain}`;

                    // Enable domain-specific buttons
                    document.getElementById('saveForSiteBtn').disabled = false;
                    document.getElementById('clearSiteBtn').disabled = false;
                    document.getElementById('perSiteToggle').disabled = false;

                    // Check if site settings exist
                    checkSiteSettings();
                } catch (e) {
                    currentDomain = "";
                }
            }
            resolve();
        });
    });
}

function checkSiteSettings() {
    if (!currentDomain) return;

    chrome.storage.sync.get(`site_${currentDomain}`, (result) => {
        const siteSettings = result[`site_${currentDomain}`];
        if (siteSettings) {
            document.getElementById('perSiteToggle').checked = true;
        }
    });
}

// ============================================================
// TTS VOICE MANAGEMENT
// ============================================================

function loadVoices() {
    chrome.tts.getVoices((voices) => {
        const voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';

        if (voices.length === 0) {
            voiceSelect.innerHTML = '<option value="">No voices available</option>';
            return;
        }

        voices.forEach((voice) => {
            const option = document.createElement('option');
            option.value = voice.voiceName;
            option.textContent = voice.voiceName;
            voiceSelect.appendChild(option);
        });
    });
}

function loadTtsSettings() {
    chrome.storage.local.get('ttsSettings', (result) => {
        if (result.ttsSettings) {
            ttsSettings = result.ttsSettings;

            // Update UI
            document.getElementById('rateSlider').value = ttsSettings.rate;
            document.getElementById('rateValue').textContent = `${ttsSettings.rate.toFixed(1)}×`;

            document.getElementById('pitchSlider').value = ttsSettings.pitch;
            document.getElementById('pitchValue').textContent = ttsSettings.pitch.toFixed(1);

            document.getElementById('volumeSlider').value = ttsSettings.volume;
            document.getElementById('volumeValue').textContent = ttsSettings.volume.toFixed(1);

            document.getElementById('voiceSelect').value = ttsSettings.voice;
        }
    });
}

function saveTtsSettings() {
    chrome.storage.local.set({ ttsSettings }, () => {
        const btn = document.getElementById('saveTtsBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

// ============================================================
// 🎯 TOGGLE SWITCHES GENERATION
// ============================================================

function generateToggles() {
    const container = document.getElementById('togglesContainer');

    FEATURE_TOGGLES.forEach((toggle) => {
        const toggleItem = document.createElement('div');
        toggleItem.className = 'toggle-item';

        toggleItem.innerHTML = `
            <div class="toggle-info">
                <label class="toggle-label" for="${toggle.id}">${toggle.label}</label>
                <p class="toggle-description">${toggle.description}</p>
            </div>
            <label class="switch">
                <input type="checkbox" id="${toggle.id}" data-storage-key="${toggle.storageKey}">
                <span class="switch-slider"></span>
            </label>
        `;

        container.appendChild(toggleItem);

        // Add slider control if applicable
        if (toggle.id === 'letter-spacing') {
            const sliderControl = createSliderControl(
                'letterSpacingSlider',
                'letterSpacingValue',
                'Letter Spacing',
                '0.00em',
                'Adjust spacing between letters (0em to 0.5em).',
                { min: 0, max: 0.5, step: 0.01, value: 0 }
            );
            toggleItem.appendChild(sliderControl);
        } else if (toggle.id === 'increase-font-size') {
            const sliderControl = createSliderControl(
                'fontSizeSlider',
                'fontSizeValue',
                'Font Size',
                '100%',
                'Adjust text size from 100% to 200%.',
                { min: 100, max: 200, step: 5, value: 100 }
            );
            toggleItem.appendChild(sliderControl);
        } else if (toggle.id === 'increase-line-height') {
            const sliderControl = createSliderControl(
                'lineHeightSlider',
                'lineHeightValue',
                'Line Height',
                '1.5',
                'Adjust spacing between lines (1.0 to 3.0).',
                { min: 1, max: 3, step: 0.1, value: 1.5 }
            );
            toggleItem.appendChild(sliderControl);
        } else if (toggle.id === 'limit-content-width') {
            const sliderControl = createSliderControl(
                'contentWidthSlider',
                'contentWidthValue',
                'Content Width',
                '100%',
                'Limit content width (600px to 1400px, 1400px = full width).',
                { min: 600, max: 1400, step: 50, value: 1400 }
            );
            toggleItem.appendChild(sliderControl);
        } else if (toggle.id === 'cursor-size') {
            const cursorControl = createCursorSizeControl();
            toggleItem.appendChild(cursorControl);
        }

        // Add event listener
        const checkbox = toggleItem.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            handleToggleChange(toggle.storageKey, e.target.checked);
            // Show/hide slider control
            const sliderControl = toggleItem.querySelector('.toggle-slider-control');
            if (sliderControl) {
                if (e.target.checked) {
                    sliderControl.classList.add('visible');
                } else {
                    sliderControl.classList.remove('visible');
                }
            }
        });
    });
}

// Helper function to create slider controls
function createSliderControl(sliderId, valueId, label, defaultValue, description, attrs) {
    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'toggle-slider-control';

    sliderDiv.innerHTML = `
        <div class="slider-label">
            <span>${label}</span>
            <span id="${valueId}">${defaultValue}</span>
        </div>
        <input type="range" id="${sliderId}" 
               min="${attrs.min}" 
               max="${attrs.max}" 
               step="${attrs.step}" 
               value="${attrs.value}" 
               class="slider">
        <p class="control-description">${description}</p>
    `;

    return sliderDiv;
}

// Helper function to create cursor size control
function createCursorSizeControl() {
    const cursorDiv = document.createElement('div');
    cursorDiv.className = 'toggle-slider-control';

    cursorDiv.innerHTML = `
        <label for="cursorSizeSelect" class="control-label">Cursor Size</label>
        <select id="cursorSizeSelect" class="control-select">
            <option value="default">Default</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
        </select>
        <p class="control-description">Change cursor size for better visibility.</p>
    `;

    return cursorDiv;
}

// ============================================================
// TOGGLE STATE MANAGEMENT
// ============================================================

async function loadToggleStates() {
    if (!currentTabId) return;

    const storageKeys = FEATURE_TOGGLES.map(t => t.storageKey);

    return new Promise((resolve) => {
        chrome.storage.local.get(storageKeys, (result) => {
            FEATURE_TOGGLES.forEach((toggle) => {
                const tabState = result[toggle.storageKey] || {};
                const enabled = tabState[currentTabId] || false;

                toggleStates[toggle.storageKey] = enabled;

                // Update UI
                const checkbox = document.getElementById(toggle.id);
                if (checkbox) {
                    checkbox.checked = enabled;
                }
            });

            resolve();
        });
    });
}

function handleToggleChange(storageKey, enabled) {
    if (!currentTabId) return;

    // Update local state
    toggleStates[storageKey] = enabled;

    // Save to storage
    chrome.storage.local.get(storageKey, (result) => {
        const tabState = result[storageKey] || {};
        tabState[currentTabId] = enabled;

        chrome.storage.local.set({ [storageKey]: tabState }, () => {
            // Send message to content script using helper function
            sendMessageToTab(currentTabId, { action: storageKey, enabled });
        });
    });

    // Re-detect active preset
    detectActivePreset();
}

// ============================================================
// PRESET SYSTEM
// ============================================================

function detectActivePreset() {
    activePreset = null;

    for (const [presetKey, preset] of Object.entries(PRESETS)) {
        let matches = true;

        // Check if all preset settings match current state
        for (const [key, value] of Object.entries(preset.settings)) {
            if (toggleStates[key] !== value) {
                matches = false;
                break;
            }
        }

        // Check if non-preset settings are disabled
        if (matches) {
            for (const toggle of FEATURE_TOGGLES) {
                if (!(toggle.storageKey in preset.settings) && toggleStates[toggle.storageKey]) {
                    matches = false;
                    break;
                }
            }
        }

        if (matches) {
            activePreset = presetKey;
            break;
        }
    }

    // Update preset button styles
    updatePresetButtons();
}

function updatePresetButtons() {
    document.querySelectorAll('.preset-btn').forEach((btn) => {
        const presetKey = btn.dataset.preset;

        // Check if preset exists
        if (!PRESETS[presetKey]) {
            console.warn(`Preset "${presetKey}" not found`);
            return;
        }

        if (presetKey === activePreset) {
            btn.classList.add('active');
            btn.textContent = PRESETS[presetKey].name + ' ✓';
        } else {
            btn.classList.remove('active');
            btn.textContent = PRESETS[presetKey].name;
        }
    });
}

function applyPreset(presetKey) {
    if (!currentTabId) return;

    const preset = PRESETS[presetKey];
    if (!preset) {
        console.warn(`Preset "${presetKey}" not found`);
        return;
    }

    // Set active preset
    activePreset = presetKey;

    // Build new toggle states (all off except preset settings)
    const newStates = {};
    FEATURE_TOGGLES.forEach((toggle) => {
        newStates[toggle.storageKey] = preset.settings[toggle.storageKey] || false;
    });

    // Update local state
    toggleStates = newStates;

    // Update all checkboxes
    FEATURE_TOGGLES.forEach((toggle) => {
        const checkbox = document.getElementById(toggle.id);
        if (checkbox) {
            checkbox.checked = newStates[toggle.storageKey];
        }

        // Save to storage
        chrome.storage.local.get(toggle.storageKey, (result) => {
            const tabState = result[toggle.storageKey] || {};
            tabState[currentTabId] = newStates[toggle.storageKey];
            chrome.storage.local.set({ [toggle.storageKey]: tabState });
        });

        // Send message to content script using helper function
        sendMessageToTab(
            currentTabId,
            { action: toggle.storageKey, enabled: newStates[toggle.storageKey] }
        );
    });

    // Update button styles
    updatePresetButtons();
}

// ============================================================
// PER-SITE SETTINGS
// ============================================================

function saveForThisSite() {
    if (!currentDomain) return;

    chrome.storage.sync.set(
        { [`site_${currentDomain}`]: toggleStates },
        () => {
            if (chrome.runtime.lastError) {
                alert('Error saving settings: ' + chrome.runtime.lastError.message);
                return;
            }
            alert(`Settings saved for ${currentDomain} (synced across devices)`);
            document.getElementById('perSiteToggle').checked = true;
        }
    );
}

function clearSiteSettings() {
    if (!currentDomain) return;

    chrome.storage.sync.remove(`site_${currentDomain}`, () => {
        if (chrome.runtime.lastError) {
            alert('Error clearing settings: ' + chrome.runtime.lastError.message);
            return;
        }
        alert(`Settings cleared for ${currentDomain}`);
        document.getElementById('perSiteToggle').checked = false;
    });
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    // Close buttons
    document.getElementById('closeBtn').addEventListener('click', () => window.close());
    document.getElementById('closeFooterBtn').addEventListener('click', () => window.close());

    // Auth buttons - Redirect to Visora app
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        // TODO: Replace with your actual Visora app URL
        const loginUrl = 'http://localhost:3000/login?source=extension'; // Change this to your app's login URL
        chrome.tabs.create({ url: loginUrl });
    });

    document.getElementById('signupBtn')?.addEventListener('click', () => {
        // TODO: Replace with your actual Visora app URL
        const signupUrl = 'http://localhost:3000/signup?source=extension'; // Change this to your app's signup URL
        chrome.tabs.create({ url: signupUrl });
    });
    
    // Logout button (if exists)
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to log out?')) {
            await handleLogout();
        }
    });
    
    // Sync now button (if exists)
    document.getElementById('syncNowBtn')?.addEventListener('click', async () => {
        await triggerManualSync();
    });

    // TTS Sliders
    document.getElementById('rateSlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        ttsSettings.rate = value;
        document.getElementById('rateValue').textContent = `${value.toFixed(1)}×`;
    });

    document.getElementById('pitchSlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        ttsSettings.pitch = value;
        document.getElementById('pitchValue').textContent = value.toFixed(1);
    });

    document.getElementById('volumeSlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        ttsSettings.volume = value;
        document.getElementById('volumeValue').textContent = value.toFixed(1);
    });

    document.getElementById('voiceSelect').addEventListener('change', (e) => {
        ttsSettings.voice = e.target.value;
    });

    // Save TTS button
    document.getElementById('saveTtsBtn').addEventListener('click', saveTtsSettings);

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            applyPreset(btn.dataset.preset);
        });
    });

    // Per-site buttons
    document.getElementById('saveForSiteBtn').addEventListener('click', saveForThisSite);
    document.getElementById('clearSiteBtn').addEventListener('click', clearSiteSettings);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function buildToggleDefaults() {
    const defaults = {};
    FEATURE_TOGGLES.forEach((toggle) => {
        defaults[toggle.storageKey] = false;
    });
    return defaults;
}

// ============================================================
// ADVANCED CONTROLS (Letter Spacing, Font Size, Line Height, Content Width, Cursor Size)
// ============================================================

function initializeAdvancedControls() {
    // Wait for DOM to be ready
    setTimeout(() => {
        const letterSpacingSlider = document.getElementById('letterSpacingSlider');
        const letterSpacingValue = document.getElementById('letterSpacingValue');
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const lineHeightSlider = document.getElementById('lineHeightSlider');
        const lineHeightValue = document.getElementById('lineHeightValue');
        const contentWidthSlider = document.getElementById('contentWidthSlider');
        const contentWidthValue = document.getElementById('contentWidthValue');
        const cursorSizeSelect = document.getElementById('cursorSizeSelect');

        // Letter Spacing
        if (letterSpacingSlider) {
            chrome.storage.local.get(['letterSpacing', 'letterSpacingEnabled'], (result) => {
                const savedValue = result.letterSpacing || 0;
                letterSpacingSlider.value = savedValue;
                letterSpacingValue.textContent = savedValue.toFixed(2) + 'em';

                // Show slider if toggle is enabled
                const sliderControl = letterSpacingSlider.closest('.toggle-slider-control');
                if (result.letterSpacingEnabled && result.letterSpacingEnabled[currentTabId]) {
                    sliderControl.classList.add('visible');
                }
            });

            letterSpacingSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                letterSpacingValue.textContent = value.toFixed(2) + 'em';
                chrome.storage.local.set({ letterSpacing: value });

                if (currentTabId) {
                    chrome.tabs.sendMessage(currentTabId, {
                        action: 'updateLetterSpacing',
                        value: value
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn('Letter spacing message failed:', chrome.runtime.lastError.message);
                        }
                    });
                }
            });
        }

        // Font Size
        if (fontSizeSlider) {
            chrome.storage.local.get(['fontSize', 'increaseFontSizeEnabled'], (result) => {
                const savedValue = result.fontSize || 100;
                fontSizeSlider.value = savedValue;
                fontSizeValue.textContent = savedValue + '%';

                const sliderControl = fontSizeSlider.closest('.toggle-slider-control');
                if (result.increaseFontSizeEnabled && result.increaseFontSizeEnabled[currentTabId]) {
                    sliderControl.classList.add('visible');
                }
            });

            fontSizeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                fontSizeValue.textContent = value + '%';
                chrome.storage.local.set({ fontSize: value });

                if (currentTabId) {
                    chrome.tabs.sendMessage(currentTabId, {
                        action: 'updateFontSize',
                        value: value
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn('Font size message failed:', chrome.runtime.lastError.message);
                        }
                    });
                }
            });
        }

        // Line Height
        if (lineHeightSlider) {
            chrome.storage.local.get(['lineHeight', 'increaseLineHeightEnabled'], (result) => {
                const savedValue = result.lineHeight || 1.5;
                lineHeightSlider.value = savedValue;
                lineHeightValue.textContent = savedValue.toFixed(1);

                const sliderControl = lineHeightSlider.closest('.toggle-slider-control');
                if (result.increaseLineHeightEnabled && result.increaseLineHeightEnabled[currentTabId]) {
                    sliderControl.classList.add('visible');
                }
            });

            lineHeightSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                lineHeightValue.textContent = value.toFixed(1);
                chrome.storage.local.set({ lineHeight: value });

                if (currentTabId) {
                    chrome.tabs.sendMessage(currentTabId, {
                        action: 'updateLineHeight',
                        value: value
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn('Line height message failed:', chrome.runtime.lastError.message);
                        }
                    });
                }
            });
        }

        // Content Width
        if (contentWidthSlider) {
            chrome.storage.local.get(['contentWidth', 'limitContentWidthEnabled'], (result) => {
                const savedValue = result.contentWidth || 1400;
                contentWidthSlider.value = savedValue;
                contentWidthValue.textContent = savedValue >= 1400 ? '100%' : savedValue + 'px';

                const sliderControl = contentWidthSlider.closest('.toggle-slider-control');
                if (result.limitContentWidthEnabled && result.limitContentWidthEnabled[currentTabId]) {
                    sliderControl.classList.add('visible');
                }
            });

            contentWidthSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                contentWidthValue.textContent = value >= 1400 ? '100%' : value + 'px';
                chrome.storage.local.set({ contentWidth: value });

                if (currentTabId) {
                    chrome.tabs.sendMessage(currentTabId, {
                        action: 'updateContentWidth',
                        value: value
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn('Content width message failed:', chrome.runtime.lastError.message);
                        }
                    });
                }
            });
        }

        // Cursor Size
        if (cursorSizeSelect) {
            chrome.storage.local.get(['cursorSize', 'cursorSizeEnabled'], (result) => {
                const savedSize = result.cursorSize || 'default';
                cursorSizeSelect.value = savedSize;

                // Show dropdown if toggle is enabled
                const cursorControl = cursorSizeSelect.closest('.toggle-slider-control');
                if (cursorControl && result.cursorSizeEnabled && result.cursorSizeEnabled[currentTabId]) {
                    cursorControl.classList.add('visible');
                }
            });

            cursorSizeSelect.addEventListener('change', (e) => {
                const size = e.target.value;
                chrome.storage.local.set({ cursorSize: size });

                if (currentTabId) {
                    chrome.tabs.sendMessage(currentTabId, {
                        action: 'updateCursorSize',
                        size: size
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn('Cursor size message failed:', chrome.runtime.lastError.message);
                        }
                    });
                }
            });
        }
    }, 100); // Small delay to ensure DOM is ready
}

// ============================================================
// AUTHENTICATION & CLOUD SYNC
// ============================================================

/**
 * Check if user is authenticated and update UI accordingly
 */
async function checkAuthStatus() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getAuthStatus' }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn('Could not get auth status:', chrome.runtime.lastError.message);
                showLoggedOutState(); // Show logged out state on error
                resolve();
                return;
            }
            
            if (response && response.authenticated) {
                console.log('✅ User is logged in:', response.userEmail);
                showLoggedInState(response.userEmail);
            } else {
                console.log('ℹ️ User is not logged in');
                showLoggedOutState();
            }
            resolve();
        });
    });
}

/**
 * Show logged-in state in UI
 */
function showLoggedInState(userEmail) {
    const authSection = document.getElementById('authSection') || document.querySelector('.auth-section');
    if (!authSection) {
        console.warn('⚠️ Auth section not found in DOM');
        return;
    }
    
    console.log('🎨 Showing logged-in state for:', userEmail);
    
    authSection.innerHTML = `
        <div class="auth-logged-in">
            <div class="auth-user-info">
                <span class="auth-icon">👤</span>
                <div class="auth-user-details">
                    <p class="auth-user-email">${userEmail}</p>
                    <p class="auth-sync-status">✅ Synced with cloud</p>
                </div>
            </div>
            <div class="auth-actions">
                <button class="btn btn-sm btn-outline" id="syncNowBtn">
                    🔄 Sync Now
                </button>
                <button class="btn btn-sm btn-outline" id="logoutBtn">
                    🚪 Logout
                </button>
            </div>
        </div>
    `;
    
    // Re-attach event listeners
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to log out?')) {
            await handleLogout();
        }
    });
    
    document.getElementById('syncNowBtn')?.addEventListener('click', async () => {
        await triggerManualSync();
    });
}

/**
 * Show logged-out state in UI
 */
function showLoggedOutState() {
    const authSection = document.getElementById('authSection') || document.querySelector('.auth-section');
    if (!authSection) {
        console.warn('⚠️ Auth section not found in DOM');
        return;
    }
    
    console.log('🎨 Showing logged-out state');
    
    authSection.innerHTML = `
        <p class="auth-description">Connect to Visora App for cloud sync & more features</p>
        <div class="auth-buttons">
            <button class="btn btn-auth btn-login" id="loginBtn">
                <span class="auth-icon">🔐</span>
                Log In
            </button>
            <button class="btn btn-auth btn-signup" id="signupBtn">
                <span class="auth-icon">✨</span>
                Sign Up
            </button>
        </div>
    `;
    
    // Re-attach event listeners
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        const loginUrl = 'http://localhost:3000/login?source=extension';
        chrome.tabs.create({ url: loginUrl });
    });
    
    document.getElementById('signupBtn')?.addEventListener('click', () => {
        const signupUrl = 'http://localhost:3000/signup?source=extension';
        chrome.tabs.create({ url: signupUrl });
    });
}

/**
 * Handle logout
 */
async function handleLogout() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'logout' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Logout failed:', chrome.runtime.lastError.message);
                alert('Logout failed. Please try again.');
                resolve();
                return;
            }
            
            if (response && response.success) {
                showLoggedOutState();
                alert('Successfully logged out');
            } else {
                alert('Logout failed. Please try again.');
            }
            resolve();
        });
    });
}

/**
 * Trigger manual sync
 */
async function triggerManualSync() {
    const syncBtn = document.getElementById('syncNowBtn');
    if (syncBtn) {
        syncBtn.disabled = true;
        syncBtn.textContent = '⏳ Syncing...';
    }
    
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'syncNow' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Sync failed:', chrome.runtime.lastError.message);
                alert('Sync failed. Please try again.');
            } else if (response && response.success) {
                // Reload settings from storage
                loadToggleStates().then(() => {
                    syncWithPageState();
                    alert('Settings synced successfully!');
                });
            } else {
                alert('Sync failed. Please try again.');
            }
            
            if (syncBtn) {
                syncBtn.disabled = false;
                syncBtn.textContent = '🔄 Sync Now';
            }
            resolve();
        });
    });
}

/**
 * Handle auth message from Visora app (postMessage)
 */
function handleAuthMessage(event) {
    // Verify origin (update with your production URL)
    const allowedOrigins = [
        'http://localhost:3000',
        'https://app.visora.com' // Add your production URL
    ];
    
    if (!allowedOrigins.includes(event.origin)) {
        return;
    }
    
    // Check if it's an auth message
    if (event.data && event.data.type === 'VISORA_AUTH') {
        const { token, userId, userEmail } = event.data;
        
        if (token && userId && userEmail) {
            // Send to background script to handle login
            chrome.runtime.sendMessage({
                action: 'login',
                token: token,
                userId: userId,
                userEmail: userEmail
            }, (response) => {
                if (response && response.success) {
                    showLoggedInState(userEmail);
                    alert('Successfully logged in! Your settings will now sync across devices.');
                } else {
                    alert('Login failed. Please try again.');
                }
            });
        }
    }
}

// Listen for auth status changes from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authStatusChanged') {
        if (message.authenticated) {
            showLoggedInState(message.userEmail);
        } else {
            showLoggedOutState();
        }
    }
});
