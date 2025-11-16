
let recognition = null;
let isListening = false;
let voiceControlEnabled = false;
let continuousMode = false;
let restartTimeout = null;
let lastActivityTime = Date.now();
let keepAliveInterval = null; // Keep-alive to prevent timeouts
let watchdogInterval = null; // Watchdog to detect and fix stuck recognition
let sessionStartTime = null; // Track when current session started
let forceRestartTimeout = null; // Force restarExlait before browser timeout


// Voice command mappings - Keyword-based for flexible matching
// IMPORTANT: These action names MUST match the storageKey values in popup toggles!
const VOICE_COMMANDS = {
  // Enable commands - Focus on key words
  'dyslexia': { action: 'dyslexiaFontEnabled', enabled: true },
  'contrast': { action: 'highContrastEnabled', enabled: true },
  'hide images': { action: 'hideImagesEnabled', enabled: true },
  'highlight links': { action: 'highlightLinksEnabled', enabled: true },
  'disable animations': { action: 'flashContentEnabled', enabled: true },
  'focus line': { action: 'focusLineEnabled', enabled: true },
  'spacing': { action: 'letterSpacingEnabled', enabled: true },
  'dim': { action: 'dimmerOverlayEnabled', enabled: true },
  'cursor': { action: 'largeCursorEnabled', enabled: true },
  'autocomplete': { action: 'autocompleteEnabled', enabled: true },
  'font size': { action: 'increaseFontSizeEnabled', enabled: true },
  'line height': { action: 'increaseLineHeightEnabled', enabled: true },
  'limit width': { action: 'limitContentWidthEnabled', enabled: true },
  'block popups': { action: 'removePopupsEnabled', enabled: true },
  'reading': { action: 'readingModeEnabled', enabled: true },
  'disable sticky': { action: 'disableStickyEnabled', enabled: true },
  'disable hover': { action: 'disableHoverEnabled', enabled: true },

  // Disable commands - Use "off", "remove", "normal" keywords
  'show images': { action: 'hideImagesEnabled', enabled: false },
  'normal contrast': { action: 'highContrastEnabled', enabled: false },
  'off contrast': { action: 'highContrastEnabled', enabled: false },
  'unhighlight links': { action: 'highlightLinksEnabled', enabled: false },
  'enable animations': { action: 'flashContentEnabled', enabled: false },
  'remove focus': { action: 'focusLineEnabled', enabled: false },
  'normal font': { action: 'dyslexiaFontEnabled', enabled: false },
  'off dyslexia': { action: 'dyslexiaFontEnabled', enabled: false },
  'normal spacing': { action: 'letterSpacingEnabled', enabled: false },
  'off spacing': { action: 'letterSpacingEnabled', enabled: false },
  'remove dim': { action: 'dimmerOverlayEnabled', enabled: false },
  'off dim': { action: 'dimmerOverlayEnabled', enabled: false },
  'normal cursor': { action: 'largeCursorEnabled', enabled: false },
  'off cursor': { action: 'largeCursorEnabled', enabled: false },
  'off autocomplete': { action: 'autocompleteEnabled', enabled: false },
  'normal font size': { action: 'increaseFontSizeEnabled', enabled: false },
  'off font size': { action: 'increaseFontSizeEnabled', enabled: false },
  'normal line height': { action: 'increaseLineHeightEnabled', enabled: false },
  'off line height': { action: 'increaseLineHeightEnabled', enabled: false },
  'full width': { action: 'limitContentWidthEnabled', enabled: false },
  'off width': { action: 'limitContentWidthEnabled', enabled: false },
  'allow popups': { action: 'removePopupsEnabled', enabled: false },
  'off popups': { action: 'removePopupsEnabled', enabled: false },
  'normal reading': { action: 'readingModeEnabled', enabled: false },
  'off reading': { action: 'readingModeEnabled', enabled: false },
  'enable sticky': { action: 'disableStickyEnabled', enabled: false },
  'enable hover': { action: 'disableHoverEnabled', enabled: false },

  // Navigation commands
  'scroll down': { action: 'scrollDown' },
  'scroll up': { action: 'scrollUp' },
  'scroll top': { action: 'scrollToTop' },
  'scroll bottom': { action: 'scrollToBottom' },
  'go back': { action: 'goBack' },
  'go forward': { action: 'goForward' },
  'refresh': { action: 'refreshPage' },
  'click': { action: 'click' },
  'open link': { action: 'openLink' },

  // Help commands
  'help': { action: 'showHelp' },
  'stop': { action: 'stopListening' },
  'start': { action: 'startListening' }
};

// Initialize speech recognition
export function initVoiceControl() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Speech recognition not supported in this browser');
    return false;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  // IMPORTANT: Set continuous to true for longer sessions
  recognition.continuous = true;
  recognition.interimResults = true; // Show interim results for better feedback
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 5; // More alternatives for better matching

  // Chrome has a ~60 second limit, so we'll force restart before that

  recognition.onstart = () => {
    isListening = true;
    lastActivityTime = Date.now();
    sessionStartTime = Date.now();
    showRecordingButton(true);
    console.log('✅ Voice recognition started');

    // Start keep-alive mechanism to prevent browser timeouts
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }
    keepAliveInterval = setInterval(() => {
      if (voiceControlEnabled && isListening) {
        lastActivityTime = Date.now();
        console.log('🔄 Keep-alive ping');
      }
    }, 5000); // Ping every 5 seconds

    // Force restart after 50 seconds to prevent Chrome's 60-second timeout
    // This ensures continuous listening forever
    if (forceRestartTimeout) {
      clearTimeout(forceRestartTimeout);
    }
    forceRestartTimeout = setTimeout(() => {
      if (voiceControlEnabled && continuousMode && isListening) {
        console.log('🔄 Proactive restart (preventing browser timeout)...');
        try {
          recognition.stop(); // This will trigger onend which will restart
        } catch (e) {
          console.warn('Force restart stop failed:', e.message);
        }
      }
    }, 50000); // Restart every 50 seconds (before Chrome's 60s limit)
  };

  recognition.onend = () => {
    console.log('🔄 Recognition ended, continuous mode:', continuousMode, 'enabled:', voiceControlEnabled);

    // Clear any existing restart timeout
    if (restartTimeout) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }

    // IMPORTANT: Don't set isListening = false here to prevent UI flicker
    // Only set it to false if we're actually stopping
    if (!voiceControlEnabled || !continuousMode) {
      isListening = false;
      showRecordingButton(false);

      // Clear keep-alive interval
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
      return;
    }

    // Always restart immediately for continuous listening
    restartTimeout = setTimeout(() => {
      if (voiceControlEnabled && continuousMode) {
        try {
          console.log('▶️ Auto-restarting recognition for continuous listening...');
          recognition.start();
          lastActivityTime = Date.now();
        } catch (error) {
          // If already started, ignore the error
          if (error.message && error.message.includes('already started')) {
            console.log('✅ Recognition already running');
            isListening = true;
          } else {
            console.warn('⚠️ Error restarting recognition:', error.message || error);
            // Try again with exponential backoff
            let retryDelay = 500;
            const retryRestart = () => {
              if (voiceControlEnabled && continuousMode) {
                try {
                  console.log(`🔄 Retry restart (delay: ${retryDelay}ms)...`);
                  recognition.start();
                  lastActivityTime = Date.now();
                } catch (e) {
                  if (e.message && e.message.includes('already started')) {
                    console.log('✅ Recognition already running');
                    isListening = true;
                  } else if (retryDelay < 8000) {
                    // Exponential backoff up to 8 seconds
                    retryDelay *= 2;
                    restartTimeout = setTimeout(retryRestart, retryDelay);
                  } else {
                    console.error('❌ Failed to restart after multiple attempts');
                    showCommandFeedback('❌ Voice recognition stopped', 'error');
                  }
                }
              }
            };
            restartTimeout = setTimeout(retryRestart, retryDelay);
          }
        }
      }
    }, 100); // Very short delay for seamless restart
  };

  recognition.onerror = (event) => {
    console.log('🔴 Recognition error:', event.error);

    // Handle different error types with appropriate recovery strategies
    // IMPORTANT: Keep isListening = true for most errors so UI stays active
    switch (event.error) {
      case 'no-speech':
        // Normal - no speech detected, just continue
        console.log('ℹ️ No speech detected (normal behavior)');
        // Keep listening state active - will auto-restart via onend
        break;

      case 'aborted':
        // Recognition was aborted - show feedback but keep listening state
        console.log('ℹ️ Recognition aborted, restarting...');
        showCommandFeedback('⚠️ Restarting...', 'warning');
        // Keep isListening = true so UI doesn't flicker
        // Will restart via onend if still enabled
        break;

      case 'audio-capture':
        // Audio capture issue - show error but keep listening state
        console.log('⚠️ Audio capture issue - restarting');
        showCommandFeedback('❌ Audio not recognized, listening...', 'error');

        // Keep isListening = true so UI stays active
        // Will auto-restart via onend handler
        break;

      case 'network':
        // Network error - show error but keep listening state
        console.error('❌ Network error');
        showCommandFeedback('❌ Network error, retrying...', 'error');

        // Keep isListening = true so UI stays active
        // Will auto-restart via onend handler
        break;

      case 'not-allowed':
      case 'service-not-allowed':
        // Critical - microphone permission denied (only case where we stop)
        console.error('❌ Microphone access denied');
        voiceControlEnabled = false;
        continuousMode = false;
        isListening = false;

        showCommandFeedback('❌ Microphone access denied', 'error');
        showRecordingButton(false);

        // Update storage to reflect disabled state
        chrome.runtime.sendMessage({
          action: 'updateFeatureStorage',
          featureKey: 'voiceControlEnabled',
          enabled: false
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('Could not update voice control state:', chrome.runtime.lastError.message);
          }
        });

        // Notify user
        speakFeedback('Microphone access denied. Please allow microphone access in browser settings.');
        break;

      case 'bad-grammar':
      case 'language-not-supported':
        // Configuration error - show error but keep listening state
        console.error('❌ Configuration error:', event.error);
        showCommandFeedback('❌ Configuration error, retrying...', 'error');

        // Keep isListening = true so UI stays active
        // Will auto-restart via onend handler
        break;

      default:
        // Unknown error - show error but keep listening state
        console.warn('⚠️ Unknown recognition error:', event.error);
        showCommandFeedback('❌ Not recognized, listening...', 'warning');

        // Keep isListening = true so UI stays active
        // Will auto-restart via onend handler
        break;
    }
  };

  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const result = event.results[last];

    // Update last activity time
    lastActivityTime = Date.now();

    const transcript = result[0].transcript.toLowerCase().trim();
    const confidence = result[0].confidence;

    // Show interim results (what's being recognized in real-time)
    if (!result.isFinal) {
      showInterimTranscript(transcript);
      return;
    }

    // Clear interim display
    hideInterimTranscript();

    console.log('🎤 Voice command:', transcript, 'Confidence:', confidence);

    // Lower confidence threshold for better recognition
    if (confidence < 0.4) {
      console.log('⚠️ Low confidence, ignoring command');
      showCommandFeedback(`❌ Unclear: "${transcript}"`, 'warning');
      return;
    }

    // Show what was heard
    showCommandFeedback(`🎤 "${transcript}"`, 'info');

    // Process command after a brief delay to show the transcript
    setTimeout(() => {
      processVoiceCommand(transcript);
    }, 500);
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

  // Start watchdog to detect stuck recognition
  if (watchdogInterval) {
    clearInterval(watchdogInterval);
  }
  watchdogInterval = setInterval(() => {
    if (voiceControlEnabled && continuousMode) {
      const timeSinceActivity = Date.now() - lastActivityTime;
      const sessionDuration = sessionStartTime ? Date.now() - sessionStartTime : 0;

      console.log(`🐕 Watchdog check - Activity: ${Math.floor(timeSinceActivity / 1000)}s ago, Session: ${Math.floor(sessionDuration / 1000)}s, Listening: ${isListening}`);

      // If session has been running for more than 55 seconds, force restart
      if (sessionDuration > 55000 && isListening) {
        console.warn('⚠️ Watchdog: Session > 55s, forcing restart to prevent timeout...');
        try {
          recognition.stop();
        } catch (e) {
          console.warn('Watchdog stop failed:', e.message);
        }
        return;
      }

      // If no activity for 20 seconds and we think we're listening, force restart
      if (timeSinceActivity > 20000 && isListening) {
        console.warn('⚠️ Watchdog: No activity for 20s, forcing restart...');
        try {
          recognition.stop();
        } catch (e) {
          console.warn('Watchdog stop failed:', e.message);
        }
        return;
      }

      // If we should be listening but aren't, restart immediately
      if (!isListening && timeSinceActivity > 3000) {
        console.warn('⚠️ Watchdog: Should be listening but not, restarting NOW...');
        try {
          recognition.start();
          lastActivityTime = Date.now();
          sessionStartTime = Date.now();
        } catch (e) {
          if (!e.message.includes('already started')) {
            console.warn('Watchdog start failed:', e.message);
          } else {
            isListening = true;
          }
        }
      }
    }
  }, 5000); // Check every 5 seconds (more frequent)

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
  console.log('🛑 Stopping voice recognition...');
  voiceControlEnabled = false;
  continuousMode = false;

  // Clear any restart timeout
  if (restartTimeout) {
    clearTimeout(restartTimeout);
    restartTimeout = null;
  }

  // Clear keep-alive interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }

  // Clear watchdog interval
  if (watchdogInterval) {
    clearInterval(watchdogInterval);
    watchdogInterval = null;
  }

  // Clear force restart timeout
  if (forceRestartTimeout) {
    clearTimeout(forceRestartTimeout);
    forceRestartTimeout = null;
  }

  if (recognition && isListening) {
    recognition.stop();
  }

  isListening = false;
  sessionStartTime = null;
  showRecordingButton(false);
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

// Normalize text for better matching (handle speech-to-text errors)
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/dyslexic/g, 'dyslexia') // Common variations
    .replace(/dislexia/g, 'dyslexia')
    .replace(/dislexic/g, 'dyslexia')
    .replace(/dimmer/g, 'dim')
    .replace(/dimer/g, 'dim')
    .replace(/popup/g, 'popups')
    .replace(/image/g, 'images')
    .replace(/link/g, 'links')
    .replace(/animation/g, 'animations');
}

// Extract key words from transcript
function extractKeywords(transcript) {
  const normalized = normalizeText(transcript);
  const words = normalized.split(' ');

  // Common words to ignore
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];

  return words.filter(word => !stopWords.includes(word) && word.length > 1);
}

// Check if transcript matches a command (flexible matching)
function matchesCommand(transcript, command) {
  const transcriptNorm = normalizeText(transcript);
  const commandNorm = normalizeText(command);

  // Exact match
  if (transcriptNorm === commandNorm) {
    return { match: true, score: 1.0, type: 'exact' };
  }

  // Contains match
  if (transcriptNorm.includes(commandNorm) || commandNorm.includes(transcriptNorm)) {
    return { match: true, score: 0.9, type: 'contains' };
  }

  // Keyword matching
  const transcriptKeywords = extractKeywords(transcript);
  const commandKeywords = extractKeywords(command);

  if (transcriptKeywords.length === 0 || commandKeywords.length === 0) {
    return { match: false, score: 0, type: 'none' };
  }

  // Count matching keywords
  let matchingKeywords = 0;
  for (const tWord of transcriptKeywords) {
    for (const cWord of commandKeywords) {
      if (tWord === cWord) {
        matchingKeywords += 1;
      } else if (tWord.includes(cWord) || cWord.includes(tWord)) {
        matchingKeywords += 0.7;
      } else if (levenshteinDistance(tWord, cWord) <= 1) {
        matchingKeywords += 0.5;
      }
    }
  }

  const score = matchingKeywords / Math.max(transcriptKeywords.length, commandKeywords.length);

  if (score >= 0.4) {
    return { match: true, score, type: 'keywords' };
  }

  return { match: false, score, type: 'none' };
}

// Process voice commands (improved matching)
function processVoiceCommand(transcript) {
  console.log('=== Processing command ===');
  console.log('Original transcript:', transcript);
  console.log('Normalized:', normalizeText(transcript));
  console.log('Keywords:', extractKeywords(transcript));

  let bestMatch = null;
  let bestScore = 0;
  let bestType = 'none';

  // Try to match against all commands
  for (const [command, commandData] of Object.entries(VOICE_COMMANDS)) {
    const result = matchesCommand(transcript, command);

    if (result.match && result.score > bestScore) {
      bestScore = result.score;
      bestMatch = { command, commandData };
      bestType = result.type;
    }
  }

  if (bestMatch && bestScore >= 0.4) {
    console.log('✅ MATCH FOUND:', bestMatch.command);
    console.log('   Type:', bestType, 'Score:', bestScore.toFixed(2));

    // Show executing command
    const action = bestMatch.commandData.action;
    const enabled = bestMatch.commandData.enabled;
    const featureName = action.replace('Enabled', '').replace(/([A-Z])/g, ' $1').trim();

    if (enabled !== undefined) {
      showCommandFeedback(`✅ ${featureName} ${enabled ? 'ON' : 'OFF'}`, 'executing');
    } else {
      showCommandFeedback(`✅ ${bestMatch.command}`, 'executing');
    }

    executeCommand(bestMatch.commandData, transcript);
  } else {
    console.log('❌ NO MATCH FOUND');
    console.log('Best score was:', bestScore.toFixed(2));
    console.log('Try saying one of these:');
    console.log('- "dyslexia" or "high contrast" or "hide images"');
    showCommandFeedback('❌ Command not recognized', 'warning');
    speakFeedback('Command not recognized. Try saying dyslexia, contrast, or hide images.');
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

// Find best matching command using fuzzy matching (more flexible)
function findBestMatch(transcript) {
  let bestMatch = null;
  let highestScore = 0;

  for (const [command, commandData] of Object.entries(VOICE_COMMANDS)) {
    const score = calculateSimilarity(transcript, command);
    if (score > highestScore && score > 0.5) { // Lowered threshold from 0.6 to 0.5
      highestScore = score;
      bestMatch = { command, commandData, score };
    }
  }

  return bestMatch;
}

// Calculate similarity between two strings (improved)
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  let matches = 0;
  let partialMatches = 0;

  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2) {
        matches += 1; // Exact match
      } else if (word1.includes(word2) || word2.includes(word1)) {
        partialMatches += 0.7; // Partial match
      } else if (levenshteinDistance(word1, word2) <= 2) {
        partialMatches += 0.5; // Similar spelling
      }
    }
  }

  const totalScore = matches + partialMatches;
  return totalScore / Math.max(words1.length, words2.length);
}

// Levenshtein distance for fuzzy string matching
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
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

// Show recording button (improved design)
function showRecordingButton(isRecording) {
  let container = document.getElementById('visora-mic-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'visora-mic-container';
    container.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 999998;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    `;

    // Microphone button
    const button = document.createElement('div');
    button.id = 'visora-recording-button';
    button.style.cssText = `
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, ${isRecording ? '#ef4444, #dc2626' : '#6b7280, #4b5563'});
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 4px solid white;
      position: relative;
    `;

    button.innerHTML = '🎤';
    button.title = isRecording ? 'Voice Control Active - Click to stop' : 'Voice Control Inactive - Click to start';

    button.addEventListener('click', () => {
      if (voiceControlEnabled) {
        stopVoiceRecognition();
        speakFeedback('Voice control stopped');
      } else {
        startVoiceRecognition(true);
        speakFeedback('Voice control started');
      }
    });

    // Status text
    const status = document.createElement('div');
    status.id = 'visora-mic-status';
    status.style.cssText = `
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: 'OpenDyslexic', Arial, sans-serif;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    `;
    status.textContent = isRecording ? 'Listening...' : 'Off';

    container.appendChild(button);
    container.appendChild(status);
    document.body.appendChild(container);

    // Add styles
    if (!document.getElementById('visora-mic-styles')) {
      const style = document.createElement('style');
      style.id = 'visora-mic-styles';
      style.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('${chrome.runtime.getURL('assets/OpenDyslexic.otf')}') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        @keyframes visora-pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4), 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.6), 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
        @keyframes visora-wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  const button = document.getElementById('visora-recording-button');
  const status = document.getElementById('visora-mic-status');

  if (button && status) {
    // Update button state
    button.style.background = isRecording
      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
      : 'linear-gradient(135deg, #6b7280, #4b5563)';
    button.title = isRecording ? 'Voice Control Active - Click to stop' : 'Voice Control Inactive - Click to start';

    // Update status
    status.textContent = isRecording ? 'Listening...' : 'Off';
    status.style.background = isRecording ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.8)';

    // Add pulsing animation when recording
    if (isRecording) {
      button.style.animation = 'visora-pulse 2s infinite';
    } else {
      button.style.animation = 'none';
    }

    container.style.display = 'flex';
  }
}

// Show interim transcript (what's being recognized in real-time)
function showInterimTranscript(text) {
  let interim = document.getElementById('visora-interim-transcript');

  if (!interim) {
    interim = document.createElement('div');
    interim.id = 'visora-interim-transcript';
    interim.style.cssText = `
      position: fixed;
      bottom: 120px;
      right: 30px;
      padding: 12px 20px;
      background: rgba(59, 130, 246, 0.95);
      color: white;
      border-radius: 8px;
      font-family: 'OpenDyslexic', Arial, sans-serif;
      font-size: 15px;
      font-weight: 500;
      z-index: 999999;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
      max-width: 350px;
      min-width: 200px;
      transition: all 0.2s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    document.body.appendChild(interim);
  }

  interim.textContent = `🎤 ${text}`;
  interim.style.opacity = '1';
  interim.style.transform = 'translateY(0)';
}

// Hide interim transcript
function hideInterimTranscript() {
  const interim = document.getElementById('visora-interim-transcript');
  if (interim) {
    interim.style.opacity = '0';
    interim.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (interim && interim.style.opacity === '0') {
        interim.remove();
      }
    }, 300);
  }
}

// Show command feedback (temporary message)
function showCommandFeedback(message, type = 'info') {
  let feedback = document.getElementById('visora-command-feedback');

  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'visora-command-feedback';
    feedback.style.cssText = `
      position: fixed;
      bottom: 120px;
      right: 30px;
      padding: 14px 22px;
      background: rgba(0, 0, 0, 0.95);
      color: white;
      border-radius: 10px;
      font-family: 'OpenDyslexic', Arial, sans-serif;
      font-size: 15px;
      font-weight: 500;
      z-index: 999999;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      max-width: 350px;
      min-width: 200px;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;
    document.body.appendChild(feedback);
  }

  // Set color based on type
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    executing: '#8b5cf6'
  };

  feedback.style.borderLeft = `5px solid ${colors[type] || colors.info}`;
  feedback.textContent = message;
  feedback.style.opacity = '1';
  feedback.style.transform = 'translateY(0)';

  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (feedback) {
      feedback.style.opacity = '0';
      feedback.style.transform = 'translateY(10px)';
    }
  }, 3000);
}

// Legacy function for compatibility
function showVoiceIndicator(message, type = 'info') {
  showCommandFeedback(message, type);
}

// Legacy function for compatibility
function hideVoiceIndicator() {
  const feedback = document.getElementById('visora-command-feedback');
  if (feedback) {
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(10px)';
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
