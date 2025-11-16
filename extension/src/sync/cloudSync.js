// ============================================================
// VISORA EXTENSION - CLOUD SYNC MODULE
// Syncs extension settings with Visora app database
// ============================================================

// Configuration - Update these with your actual API endpoints
const API_BASE_URL = 'http://localhost:3000/api'; // Change to your production URL
const SYNC_INTERVAL = 30000; // Sync every 30 seconds

let syncInterval = null;
let isAuthenticated = false;
let authToken = null;
let userId = null;

// ============================================================
// AUTHENTICATION
// ============================================================

/**
 * Initialize sync system - check if user is logged in
 */
export async function initializeSync() {
  console.log('🔄 Initializing cloud sync...');
  
  // Check if user has auth token
  const result = await chrome.storage.sync.get(['authToken', 'userId', 'userEmail']);
  
  if (result.authToken && result.userId) {
    authToken = result.authToken;
    userId = result.userId;
    isAuthenticated = true;
    
    console.log('✅ User authenticated:', result.userEmail);
    
    // Fetch settings from database
    await fetchSettingsFromCloud();
    
    // Start periodic sync
    startPeriodicSync();
  } else {
    console.log('ℹ️ User not authenticated - sync disabled');
  }
}

/**
 * Handle successful login - store token and start sync
 */
export async function handleLogin(token, userIdParam, userEmail) {
  console.log('🔐 Handling login...');
  
  authToken = token;
  userId = userIdParam;
  isAuthenticated = true;
  
  // Store auth data
  await chrome.storage.sync.set({
    authToken: token,
    userId: userIdParam,
    userEmail: userEmail,
    lastSync: Date.now()
  });
  
  console.log('✅ Login successful:', userEmail);
  
  // Fetch settings from cloud
  await fetchSettingsFromCloud();
  
  // Start periodic sync
  startPeriodicSync();
  
  // Notify popup to update UI
  chrome.runtime.sendMessage({
    action: 'authStatusChanged',
    authenticated: true,
    userEmail: userEmail
  });
}

/**
 * Handle logout - clear token and stop sync
 */
export async function handleLogout() {
  console.log('🚪 Handling logout...');
  
  // Stop sync
  stopPeriodicSync();
  
  // Clear auth data
  await chrome.storage.sync.remove(['authToken', 'userId', 'userEmail', 'lastSync']);
  
  authToken = null;
  userId = null;
  isAuthenticated = false;
  
  console.log('✅ Logout successful');
  
  // Notify popup to update UI
  chrome.runtime.sendMessage({
    action: 'authStatusChanged',
    authenticated: false
  });
}

// ============================================================
// SYNC OPERATIONS
// ============================================================

/**
 * Fetch settings from cloud database
 */
async function fetchSettingsFromCloud() {
  if (!isAuthenticated) {
    console.log('⚠️ Not authenticated - skipping fetch');
    return;
  }
  
  try {
    console.log('⬇️ Fetching settings from cloud...');
    
    const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Authentication failed - logging out');
        await handleLogout();
        return;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Settings fetched from cloud:', data);
    
    // Apply settings to extension
    if (data.settings) {
      await applyCloudSettings(data.settings);
    }
    
    // Update last sync time
    await chrome.storage.sync.set({ lastSync: Date.now() });
    
  } catch (error) {
    console.error('❌ Error fetching settings from cloud:', error);
  }
}

/**
 * Push settings to cloud database
 */
export async function pushSettingsToCloud(settings) {
  if (!isAuthenticated) {
    console.log('⚠️ Not authenticated - skipping push');
    return;
  }
  
  try {
    console.log('⬆️ Pushing settings to cloud...');
    
    const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        settings: settings,
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Authentication failed - logging out');
        await handleLogout();
        return;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Settings pushed to cloud:', data);
    
    // Update last sync time
    await chrome.storage.sync.set({ lastSync: Date.now() });
    
  } catch (error) {
    console.error('❌ Error pushing settings to cloud:', error);
  }
}

/**
 * Apply settings from cloud to extension
 */
async function applyCloudSettings(cloudSettings) {
  console.log('📥 Applying cloud settings to extension...');
  
  // Get ALL tabs (not just current one)
  const tabs = await chrome.tabs.query({});
  
  if (tabs.length === 0) {
    console.warn('⚠️ No tabs found');
    return;
  }
  
  console.log(`📋 Applying settings to ${tabs.length} tabs`);
  
  // Apply each setting to ALL tabs
  for (const [key, value] of Object.entries(cloudSettings)) {
    // Get existing tab states
    const result = await chrome.storage.local.get(key);
    const tabState = result[key] || {};
    
    // Update state for all tabs
    for (const tab of tabs) {
      tabState[tab.id] = value;
    }
    
    // Save updated state
    await chrome.storage.local.set({ [key]: tabState });
    
    // Send message to each tab's content script
    for (const tab of tabs) {
      // Skip restricted pages
      if (tab.url && (
        tab.url.startsWith('chrome://') ||
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:')
      )) {
        continue;
      }
      
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: key,
          enabled: value
        });
      } catch (error) {
        // Content script not ready yet - settings will apply on page load
        console.log(`⏳ Tab ${tab.id} not ready, will apply on load`);
      }
    }
  }
  
  console.log('✅ Cloud settings applied to all tabs');
}

/**
 * Get all current settings from extension
 * Returns the most common setting across all tabs (majority vote)
 */
async function getCurrentSettings() {
  const settingsKeys = [
    'voiceControlEnabled',
    'hideImagesEnabled',
    'highContrastEnabled',
    'dyslexiaFontEnabled',
    'highlightLinksEnabled',
    'flashContentEnabled',
    'focusLineEnabled',
    'letterSpacingEnabled',
    'dimmerOverlayEnabled',
    'cursorSizeEnabled',
    'autocompleteEnabled',
    'increaseFontSizeEnabled',
    'increaseLineHeightEnabled',
    'limitContentWidthEnabled',
    'removePopupsEnabled',
    'readingModeEnabled',
    'disableStickyEnabled',
    'disableHoverEnabled'
  ];
  
  const result = await chrome.storage.local.get(settingsKeys);
  
  // Get all tabs
  const tabs = await chrome.tabs.query({});
  
  if (tabs.length === 0) {
    return {};
  }
  
  // For each setting, use majority vote across all tabs
  const settings = {};
  for (const key of settingsKeys) {
    const tabState = result[key] || {};
    let enabledCount = 0;
    let totalCount = 0;
    
    for (const tab of tabs) {
      if (tabState[tab.id] !== undefined) {
        totalCount++;
        if (tabState[tab.id]) {
          enabledCount++;
        }
      }
    }
    
    // If more than half of tabs have it enabled, consider it enabled
    // If no tabs have this setting, default to false
    settings[key] = totalCount > 0 ? (enabledCount > totalCount / 2) : false;
  }
  
  return settings;
}

/**
 * Sync settings (two-way sync with conflict resolution)
 */
async function syncSettings() {
  if (!isAuthenticated) {
    return;
  }
  
  try {
    console.log('🔄 Syncing settings...');
    
    // Get current local settings
    const localSettings = await getCurrentSettings();
    
    // Get last sync time
    const { lastSync } = await chrome.storage.sync.get('lastSync');
    
    // Fetch latest from cloud
    const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        await handleLogout();
        return;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const cloudSettings = data.settings || {};
    const cloudTimestamp = data.timestamp || 0;
    
    // Conflict resolution: use most recent
    if (cloudTimestamp > (lastSync || 0)) {
      // Cloud is newer - apply cloud settings
      console.log('⬇️ Cloud settings are newer - applying...');
      await applyCloudSettings(cloudSettings);
    } else {
      // Local is newer or same - push to cloud
      console.log('⬆️ Local settings are newer - pushing...');
      await pushSettingsToCloud(localSettings);
    }
    
    console.log('✅ Sync complete');
    
  } catch (error) {
    console.error('❌ Error syncing settings:', error);
  }
}

/**
 * Start periodic sync
 */
function startPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  console.log(`🔄 Starting periodic sync (every ${SYNC_INTERVAL / 1000}s)`);
  
  syncInterval = setInterval(() => {
    syncSettings();
  }, SYNC_INTERVAL);
}

/**
 * Stop periodic sync
 */
function stopPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('⏹️ Periodic sync stopped');
  }
}

// ============================================================
// STORAGE CHANGE LISTENER
// ============================================================

/**
 * Listen for setting changes and push to cloud
 */
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'local' || !isAuthenticated) {
    return;
  }
  
  // Check if any feature setting changed
  const featureKeys = [
    'voiceControlEnabled',
    'hideImagesEnabled',
    'highContrastEnabled',
    'dyslexiaFontEnabled',
    'highlightLinksEnabled',
    'flashContentEnabled',
    'focusLineEnabled',
    'letterSpacingEnabled',
    'dimmerOverlayEnabled',
    'cursorSizeEnabled',
    'autocompleteEnabled',
    'increaseFontSizeEnabled',
    'increaseLineHeightEnabled',
    'limitContentWidthEnabled',
    'removePopupsEnabled',
    'readingModeEnabled',
    'disableStickyEnabled',
    'disableHoverEnabled'
  ];
  
  const changedFeatures = Object.keys(changes).filter(key => featureKeys.includes(key));
  
  if (changedFeatures.length > 0) {
    console.log('📝 Settings changed, pushing to cloud...');
    
    // Debounce: wait 2 seconds before pushing
    if (window.syncDebounceTimeout) {
      clearTimeout(window.syncDebounceTimeout);
    }
    
    window.syncDebounceTimeout = setTimeout(async () => {
      const settings = await getCurrentSettings();
      await pushSettingsToCloud(settings);
    }, 2000);
  }
});

// ============================================================
// MESSAGE LISTENER (for auth from popup)
// ============================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    handleLogin(message.token, message.userId, message.userEmail)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (message.action === 'logout') {
    handleLogout()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (message.action === 'syncNow') {
    syncSettings()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (message.action === 'getAuthStatus') {
    chrome.storage.sync.get(['authToken', 'userId', 'userEmail'], (result) => {
      sendResponse({
        authenticated: !!(result.authToken && result.userId),
        userEmail: result.userEmail || null
      });
    });
    return true;
  }
  
  if (message.action === 'initializeFromCloud') {
    // Fetch settings from cloud when new page loads
    if (isAuthenticated) {
      fetchSettingsFromCloud()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    } else {
      sendResponse({ success: false, error: 'Not authenticated' });
    }
    return true;
  }
});

// ============================================================
// INITIALIZATION
// ============================================================

// Initialize sync when extension loads
initializeSync();

console.log('✅ Cloud sync module loaded');
