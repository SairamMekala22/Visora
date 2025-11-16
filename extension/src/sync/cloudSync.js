

const API_BASE_URL = 'http://localhost:3000/api';
const SYNC_INTERVAL = 30000;

let syncInterval = null;
let isAuthenticated = false;
let authToken = null;
let userId = null;

export async function initializeSync() {
  console.log('🔄 Initializing cloud sync...');

  const result = await chrome.storage.sync.get(['authToken', 'userId', 'userEmail']);

  if (result.authToken && result.userId) {
    authToken = result.authToken;
    userId = result.userId;
    isAuthenticated = true;

    console.log('✅ User authenticated:', result.userEmail);

    await fetchSettingsFromCloud();

    startPeriodicSync();
  } else {
    console.log('ℹ️ User not authenticated - sync disabled');
  }
}

export async function handleLogin(token, userIdParam, userEmail) {
  console.log('🔐 Handling login...');

  authToken = token;
  userId = userIdParam;
  isAuthenticated = true;

  await chrome.storage.sync.set({
    authToken: token,
    userId: userIdParam,
    userEmail: userEmail,
    lastSync: Date.now()
  });

  console.log('✅ Login successful:', userEmail);

  await fetchSettingsFromCloud();

  startPeriodicSync();

  chrome.runtime.sendMessage({
    action: 'authStatusChanged',
    authenticated: true,
    userEmail: userEmail
  });
}

export async function handleLogout() {
  console.log('🚪 Handling logout...');

  stopPeriodicSync();

  await chrome.storage.sync.remove(['authToken', 'userId', 'userEmail', 'lastSync']);

  authToken = null;
  userId = null;
  isAuthenticated = false;

  console.log('✅ Logout successful');

  chrome.runtime.sendMessage({
    action: 'authStatusChanged',
    authenticated: false
  });
}

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

    if (data.settings) {
      await applyCloudSettings(data.settings);
    }

    await chrome.storage.sync.set({ lastSync: Date.now() });

  } catch (error) {
    console.error('❌ Error fetching settings from cloud:', error);
  }
}

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

    await chrome.storage.sync.set({ lastSync: Date.now() });

  } catch (error) {
    console.error('❌ Error pushing settings to cloud:', error);
  }
}

async function applyCloudSettings(cloudSettings) {
  console.log('📥 Applying cloud settings to extension...');

  const tabs = await chrome.tabs.query({});

  if (tabs.length === 0) {
    console.warn('⚠️ No tabs found');
    return;
  }

  console.log(`📋 Applying settings to ${tabs.length} tabs`);

  for (const [key, value] of Object.entries(cloudSettings)) {

    const result = await chrome.storage.local.get(key);
    const tabState = result[key] || {};

    for (const tab of tabs) {
      tabState[tab.id] = value;
    }

    await chrome.storage.local.set({ [key]: tabState });

    for (const tab of tabs) {

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

        console.log(`⏳ Tab ${tab.id} not ready, will apply on load`);
      }
    }
  }

  console.log('✅ Cloud settings applied to all tabs');
}

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

  const tabs = await chrome.tabs.query({});

  if (tabs.length === 0) {
    return {};
  }

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

    settings[key] = totalCount > 0 ? (enabledCount > totalCount / 2) : false;
  }

  return settings;
}

async function syncSettings() {
  if (!isAuthenticated) {
    return;
  }

  try {
    console.log('🔄 Syncing settings...');

    const localSettings = await getCurrentSettings();

    const { lastSync } = await chrome.storage.sync.get('lastSync');

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

    if (cloudTimestamp > (lastSync || 0)) {

      console.log('⬇️ Cloud settings are newer - applying...');
      await applyCloudSettings(cloudSettings);
    } else {

      console.log('⬆️ Local settings are newer - pushing...');
      await pushSettingsToCloud(localSettings);
    }

    console.log('✅ Sync complete');

  } catch (error) {
    console.error('❌ Error syncing settings:', error);
  }
}

function startPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  console.log(`🔄 Starting periodic sync (every ${SYNC_INTERVAL / 1000}s)`);

  syncInterval = setInterval(() => {
    syncSettings();
  }, SYNC_INTERVAL);
}

function stopPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('⏹️ Periodic sync stopped');
  }
}

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'local' || !isAuthenticated) {
    return;
  }

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

    if (window.syncDebounceTimeout) {
      clearTimeout(window.syncDebounceTimeout);
    }

    window.syncDebounceTimeout = setTimeout(async () => {
      const settings = await getCurrentSettings();
      await pushSettingsToCloud(settings);
    }, 2000);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    handleLogin(message.token, message.userId, message.userEmail)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
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

initializeSync();

console.log('✅ Cloud sync module loaded');
