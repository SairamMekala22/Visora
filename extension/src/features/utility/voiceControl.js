
let recognition = null;
let isListening = false;
let voiceControlEnabled = false;
let continuousMode = false;

// Voice command mappings with explicit enable/disable states
// IMPORTANT: These action names MUST match the storageKey values in popup toggles!
const VOICE_COMMANDS = {
  // Enable commands - Match exact storageKey from FEATURE_TOGGLES
  'voice control': { action: 'voiceControlEnabled', enabled: true },
  'hide images': { action: 'hideImagesEnabled', enabled: true },
  'high contrast': { action: 'highContrastEnabled', enabled: true },
  'highlight links': { action: 'highlightLinksEnabled', enabled: true },
  'disable animations': { action: 'flashContentEnabled', enabled: true },
  'focus line': { action: 'focusLineEnabled', enabled: true },
  'dyslexia font': { action: 'dyslexiaFontEnabled', enabled: true },
  'dyslexic font': { action: 'dyslexiaFontEnabled', enabled: true }, // Alternative
  'letter spacing': { action: 'letterSpacingEnabled', enabled: true },
  'dimmer overlay': { action: 'dimmerOverlayEnabled', enabled: true },
  'dimer overlay': { action: 'dimmerOverlayEnabled', enabled: true }, // Common mishearing
  'dimmer': { action: 'dimmerOverlayEnabled', enabled: true }, // Short version
  'large cursor': { action: 'largeCursorEnabled', enabled: true },
  'big cursor': { action: 'largeCursorEnabled', enabled: true }, // Alternative
  'cursor size': { action: 'cursorSizeEnabled', enabled: true }, // For vanilla popup
  'autocomplete': { action: 'autocompleteEnabled', enabled: true },
  'increase font': { action: 'increaseFontSizeEnabled', enabled: true },
  'bigger font': { action: 'increaseFontSizeEnabled', enabled: true }, // Alternative
  'increase line height': { action: 'increaseLineHeightEnabled', enabled: true },
  'limit width': { action: 'limitContentWidthEnabled', enabled: true },
  'limit content width': { action: 'limitContentWidthEnabled', enabled: true }, // Full version
  'limit the width': { action: 'limitContentWidthEnabled', enabled: true }, // Natural variation
  'block popups': { action: 'removePopupsEnabled', enabled: true },
  'reading mode': { action: 'readingModeEnabled', enabled: true },
  'disable sticky': { action: 'disableStickyEnabled', enabled: true },
  'disable hover': { action: 'disableHoverEnabled', enabled: true },

  // Disable commands - Match exact storageKey from FEATURE_TOGGLES
  'disable voice control': { action: 'voiceControlEnabled', enabled: false },
  'show images': { action: 'hideImagesEnabled', enabled: false },
  'normal contrast': { action: 'highContrastEnabled', enabled: false },
  'unhighlight links': { action: 'highlightLinksEnabled', enabled: false },
  'enable animations': { action: 'flashContentEnabled', enabled: false },
  'remove focus line': { action: 'focusLineEnabled', enabled: false },
  'normal font': { action: 'dyslexiaFontEnabled', enabled: false },
  'normal spacing': { action: 'letterSpacingEnabled', enabled: false },
  'remove dimmer overlay': { action: 'dimmerOverlayEnabled', enabled: false },
  'remove dimmer': { action: 'dimmerOverlayEnabled', enabled: false },
  'turn off dimmer': { action: 'dimmerOverlayEnabled', enabled: false },
  'normal cursor': { action: 'largeCursorEnabled', enabled: false },
  'small cursor': { action: 'largeCursorEnabled', enabled: false }, // Alternative
  'default cursor': { action: 'cursorSizeEnabled', enabled: false }, // For vanilla popup
  'disable autocomplete': { action: 'autocompleteEnabled', enabled: false },
  'normal font size': { action: 'increaseFontSizeEnabled', enabled: false },
  'smaller font': { action: 'increaseFontSizeEnabled', enabled: false }, // Alternative
  'normal line height': { action: 'increaseLineHeightEnabled', enabled: false },
  'full width': { action: 'limitContentWidthEnabled', enabled: false },
  'remove width limit': { action: 'limitContentWidthEnabled', enabled: false },
  'unlimited width': { action: 'limitContentWidthEnabled', enabled: false },
  'allow popups': { action: 'removePopupsEnabled', enabled: false },
  'normal mode': { action: 'readingModeEnabled', enabled: false },
  'enable sticky': { action: 'disableStickyEnabled', enabled: false },
  'enable hover': { action: 'disableHoverEnabled', enabled: false },

  // Navigation commands (no enable/disable state)
  'scroll down': { action: 'scrollDown' },
  'scroll up': { action: 'scrollUp' },
  'scroll to top': { action: 'scrollToTop' },
  'scroll to bottom': { action: 'scrollToBottom' },
  'go back': { action: 'goBack' },
  'go forward': { action: 'goForward' },
  'refresh page': { action: 'refreshPage' },
  'click': { action: 'click' },
  'open link': { action: 'openLink' },

  // Help commands
  'help': { action: 'showHelp' },
  'stop listening': { action: 'stopListening' },
  'start listening': { action: 'startListening' }
};

// Initialize speech recognition
export function initVoiceControl() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Speech recognition not supported in this browser');
    return false;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    isListening = true;
    showVoiceIndicator('Listening...');
    console.log('Voice recognition started');
  };

  recognition.onend = () => {
    isListening = false;
    console.log('🔄 Recognition ended, continuous mode:', continuousMode, 'enabled:', voiceControlEnabled);

    if (voiceControlEnabled && continuousMode) {
      // Restart if continuous mode is enabled with a longer delay to prevent rapid restarts
      setTimeout(() => {
        if (voiceControlEnabled && !isListening) {
          try {
            console.log('▶️ Restarting recognition...');
            recognition.start();
          } catch (error) {
            // If already started, ignore the error
            if (error.message && error.message.includes('already started')) {
              console.log('✅ Recognition already running');
              isListening = true;
            } else {
              console.warn('⚠️ Error restarting recognition:', error.message || error);
              // Try again after a longer delay
              setTimeout(() => {
                if (voiceControlEnabled && !isListening) {
                  try {
                    recognition.start();
                  } catch (e) {
                    console.error('Failed to restart recognition:', e);
                  }
                }
              }, 1000);
            }
          }
        }
      }, 500);
    } else {
      hideVoiceIndicator();
    }
  };

  recognition.onerror = (event) => {
    // Handle different error types
    if (event.error === 'no-speech') {
      console.log('ℹ️ No speech detected (normal), will restart automatically');
      // Don't show warning, just restart - this is expected behavior
    } else if (event.error === 'aborted') {
      console.log('ℹ️ Recognition aborted (normal), will restart automatically');
      // Normal abort, will restart automatically
      isListening = false;
    } else if (event.error === 'audio-capture') {
      console.log('ℹ️ Audio capture ended (normal), will restart automatically');
      // Audio capture stopped, will restart
      isListening = false;
    } else if (event.error === 'not-allowed') {
      console.error('❌ Microphone access denied');
      showVoiceIndicator('Microphone access denied - please allow microphone access', 'error');
      voiceControlEnabled = false;
      continuousMode = false;
      isListening = false;
      
      // Update storage to reflect disabled state via background script
      chrome.runtime.sendMessage({
        action: 'updateFeatureStorage',
        featureKey: 'voiceControlEnabled',
        enabled: false
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Could not update voice control state:', chrome.runtime.lastError.message);
        }
      });
    } else if (event.error === 'network') {
      console.error('❌ Network error');
      showVoiceIndicator('Network error - check your connection', 'error');
      isListening = false;
    } else if (event.error === 'service-not-allowed') {
      console.error('❌ Speech service not allowed');
      showVoiceIndicator('Speech service not allowed', 'error');
      voiceControlEnabled = false;
      continuousMode = false;
      isListening = false;
    } else {
      console.warn('⚠️ Speech recognition error:', event.error);
      isListening = false;
    }
  };

  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const result = event.results[last];
    
    // Only process final results to avoid duplicate commands
    if (!result.isFinal) {
      return;
    }
    
    const transcript = result[0].transcript.toLowerCase().trim();
    const confidence = result[0].confidence;

    console.log('🎤 Voice command:', transcript, 'Confidence:', confidence);
    
    // Only process commands with reasonable confidence
    if (confidence < 0.5) {
      console.log('⚠️ Low confidence, ignoring command');
      showVoiceIndicator(`Unclear: "${transcript}"`, 'warning');
      return;
    }
    
    showVoiceIndicator(`Heard: "${transcript}"`, 'success');

    // Process command immediately
    processVoiceCommand(transcript);
  };

  return true;
}

// Start voice recognition
export function startVoiceRecognition(continuous = true) {
  if (!recognition) {
    if (!initVoiceControl()) {
      return false;
    }
  }

  voiceControlEnabled = true;
  continuousMode = continuous;

  // Don't try to start if already listening
  if (isListening) {
    console.log('✅ Voice recognition already active');
    return true;
  }

  try {
    recognition.start();
    return true;
  } catch (error) {
    // If already started, that's fine
    if (error.message && error.message.includes('already started')) {
      console.log('✅ Voice recognition already active');
      isListening = true;
      return true;
    }
    console.error('Failed to start voice recognition:', error);
    return false;
  }
}

// Stop voice recognition
export function stopVoiceRecognition() {
  voiceControlEnabled = false;
  continuousMode = false;

  if (recognition && isListening) {
    recognition.stop();
  }

  hideVoiceIndicator();
}

// Toggle voice control
export function toggleVoiceControl(enabled) {
  if (enabled) {
    return startVoiceRecognition(true);
  } else {
    stopVoiceRecognition();
    return true;
  }
}

// Process voice commands
function processVoiceCommand(transcript) {
  console.log('=== Processing command ===');
  console.log('Transcript:', transcript);
  console.log('Length:', transcript.length);

  let commandFound = false;
  let matchedCommand = null;

  // Check for exact matches first (prioritize longer commands)
  const sortedCommands = Object.entries(VOICE_COMMANDS).sort((a, b) => b[0].length - a[0].length);

  console.log('Checking against', sortedCommands.length, 'commands...');

  for (const [command, commandData] of sortedCommands) {
    // Try exact match
    if (transcript === command) {
      console.log('✅ EXACT MATCH:', command);
      matchedCommand = command;
      executeCommand(commandData, transcript);
      commandFound = true;
      break;
    }
    // Try contains match
    if (transcript.includes(command)) {
      console.log('✅ CONTAINS MATCH:', command, 'in', transcript);
      matchedCommand = command;
      executeCommand(commandData, transcript);
      commandFound = true;
      break;
    }
  }

  // If no command found, try fuzzy matching
  if (!commandFound) {
    console.log('No exact match, trying fuzzy matching...');
    const bestMatch = findBestMatch(transcript);
    if (bestMatch) {
      console.log('✅ FUZZY MATCH:', bestMatch.command, 'Score:', bestMatch.score);
      matchedCommand = bestMatch.command;
      executeCommand(bestMatch.commandData, transcript);
      commandFound = true;
    }
  }

  if (!commandFound) {
    console.log('❌ NO MATCH FOUND');
    console.log('Available commands:', Object.keys(VOICE_COMMANDS).slice(0, 10).join(', '), '...');
    showVoiceIndicator('Command not recognized', 'warning');
    speakFeedback('Command not recognized. Say "help" for available commands.');
  } else {
    console.log('✅ Command executed successfully:', matchedCommand);
  }
}

// Execute command
function executeCommand(commandData, transcript) {
  const action = commandData.action;

  // Handle special commands
  if (action === 'scrollDown') {
    window.scrollBy({ top: 300, behavior: 'smooth' });
    speakFeedback('Scrolling down');
    return;
  }

  if (action === 'scrollUp') {
    window.scrollBy({ top: -300, behavior: 'smooth' });
    speakFeedback('Scrolling up');
    return;
  }

  if (action === 'scrollToTop') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    speakFeedback('Scrolling to top');
    return;
  }

  if (action === 'scrollToBottom') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    speakFeedback('Scrolling to bottom');
    return;
  }

  if (action === 'goBack') {
    window.history.back();
    speakFeedback('Going back');
    return;
  }

  if (action === 'goForward') {
    window.history.forward();
    speakFeedback('Going forward');
    return;
  }

  if (action === 'refreshPage') {
    window.location.reload();
    return;
  }

  if (action === 'click') {
    clickAtCenter();
    speakFeedback('Clicking');
    return;
  }

  if (action === 'openLink') {
    openFirstLink();
    return;
  }

  if (action === 'showHelp') {
    showHelpDialog();
    return;
  }

  if (action === 'stopListening') {
    stopVoiceRecognition();
    speakFeedback('Voice control stopped');
    return;
  }

  if (action === 'startListening') {
    startVoiceRecognition(true);
    speakFeedback('Voice control started');
    return;
  }

  // Handle feature toggles - use explicit enabled state from command data
  const enabled = commandData.enabled !== undefined ? commandData.enabled : true;

  // Trigger feature directly via custom event
  const featureName = action.replace('Enabled', '').replace(/([A-Z])/g, ' $1').trim();

  console.log('Dispatching event:', action, 'enabled:', enabled);

  // Dispatch custom event immediately - content script will handle it
  const event = new CustomEvent('visoraVoiceCommand', {
    detail: {
      action: action,
      enabled: enabled
    }
  });
  document.dispatchEvent(event);

  // Update storage via background script to sync with popup
  // Send message to background script to update storage
  chrome.runtime.sendMessage({
    action: 'updateFeatureStorage',
    featureKey: action,
    enabled: enabled
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn('Storage update message failed:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ Storage updated for popup sync:', action, enabled);
    }
  });

  speakFeedback(`${featureName} ${enabled ? 'enabled' : 'disabled'}`);
}

// Find best matching command using fuzzy matching
function findBestMatch(transcript) {
  let bestMatch = null;
  let highestScore = 0;

  for (const [command, commandData] of Object.entries(VOICE_COMMANDS)) {
    const score = calculateSimilarity(transcript, command);
    if (score > highestScore && score > 0.6) {
      highestScore = score;
      bestMatch = { command, commandData, score };
    }
  }

  return bestMatch;
}

// Calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  let matches = 0;

  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
        matches++;
      }
    }
  }

  return matches / Math.max(words1.length, words2.length);
}

// Click at center of viewport
function clickAtCenter() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  const element = document.elementFromPoint(x, y);

  if (element) {
    element.click();
  }
}

// Open first visible link
function openFirstLink() {
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    const rect = link.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight) {
      link.click();
      speakFeedback('Opening link');
      return;
    }
  }
  speakFeedback('No visible links found');
}

// Show voice indicator
function showVoiceIndicator(message, type = 'info') {
  let indicator = document.getElementById('visora-voice-indicator');

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'visora-voice-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(indicator);
  }

  // Set color based on type
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  indicator.style.borderLeft = `4px solid ${colors[type] || colors.info}`;

  // Add microphone icon
  const icon = type === 'info' ? '🎤' : type === 'success' ? '✓' : type === 'warning' ? '⚠' : '✗';
  indicator.innerHTML = `<span style="font-size: 18px;">${icon}</span><span>${message}</span>`;

  indicator.style.display = 'flex';
  indicator.style.opacity = '1';

  // Auto-hide after 3 seconds for non-listening states
  if (type !== 'info') {
    setTimeout(() => {
      if (indicator && type !== 'info') {
        indicator.style.opacity = '0';
        setTimeout(() => {
          if (indicator && indicator.style.opacity === '0') {
            indicator.style.display = 'none';
          }
        }, 300);
      }
    }, 3000);
  }
}

// Hide voice indicator
function hideVoiceIndicator() {
  const indicator = document.getElementById('visora-voice-indicator');
  if (indicator) {
    indicator.style.opacity = '0';
    setTimeout(() => {
      if (indicator) {
        indicator.remove();
      }
    }, 300);
  }
}

// Speak feedback using text-to-speech
function speakFeedback(text) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  }
}

// Show help dialog with available commands
function showHelpDialog() {
  const helpDialog = document.createElement('div');
  helpDialog.id = 'visora-voice-help';
  helpDialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: black;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 1000000;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    font-family: Arial, sans-serif;
  `;

  // Organize commands by category
  const allCommands = Object.keys(VOICE_COMMANDS);

  // Separate enable and disable commands
  const enableCommands = allCommands.filter(cmd => {
    const data = VOICE_COMMANDS[cmd];
    return data.enabled === true;
  });

  const disableCommands = allCommands.filter(cmd => {
    const data = VOICE_COMMANDS[cmd];
    return data.enabled === false;
  });

  const navigationCommands = allCommands.filter(cmd => {
    const data = VOICE_COMMANDS[cmd];
    return data.enabled === undefined && !['showHelp', 'stopListening', 'startListening'].includes(data.action);
  });

  const controlCommands = allCommands.filter(cmd => {
    const data = VOICE_COMMANDS[cmd];
    return ['showHelp', 'stopListening', 'startListening'].includes(data.action);
  });

  helpDialog.innerHTML = `
    <h2 style="margin-top: 0; color: #3b82f6;">🎤 Voice Commands</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #10b981; margin-bottom: 10px;">✅ Enable Features</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${enableCommands.map(cmd => `<div style="padding: 6px 10px; background: #f0fdf4; border-radius: 4px; border-left: 3px solid #10b981; font-size: 13px;">• "${cmd}"</div>`).join('')}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #ef4444; margin-bottom: 10px;">❌ Disable Features</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${disableCommands.map(cmd => `<div style="padding: 6px 10px; background: #fef2f2; border-radius: 4px; border-left: 3px solid #ef4444; font-size: 13px;">• "${cmd}"</div>`).join('')}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #3b82f6; margin-bottom: 10px;">🧭 Navigation</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${navigationCommands.map(cmd => `<div style="padding: 6px 10px; background: #eff6ff; border-radius: 4px; border-left: 3px solid #3b82f6; font-size: 13px;">• "${cmd}"</div>`).join('')}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #8b5cf6; margin-bottom: 10px;">⚙️ Control</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${controlCommands.map(cmd => `<div style="padding: 6px 10px; background: #faf5ff; border-radius: 4px; border-left: 3px solid #8b5cf6; font-size: 13px;">• "${cmd}"</div>`).join('')}
      </div>
    </div>
    
    <button id="close-help" style="
      padding: 12px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
      font-weight: 600;
    ">Close</button>
  `;

  document.body.appendChild(helpDialog);

  document.getElementById('close-help').addEventListener('click', () => {
    helpDialog.remove();
  });

  speakFeedback('Showing available voice commands');
}

// Get voice control status
export function getVoiceControlStatus() {
  return {
    enabled: voiceControlEnabled,
    listening: isListening,
    continuous: continuousMode
  };
}
