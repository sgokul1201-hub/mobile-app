/**
 * Client-Side Storage Engine for AURA - Men's Wellness & Habit Tracker.
 * Manages collections in localStorage with SSR-safe checks.
 */

const KEYS = {
  USER_PROFILE: 'aura_user_profile',
  TRACKER_LOGS: 'aura_tracker_logs',
  APP_SETTINGS: 'aura_app_settings'
};

// Guard to ensure localStorage is only accessed on the client-side (browser)
const isBrowser = () => typeof window !== 'undefined';

/**
 * Reads a key from localStorage safely.
 */
const getItem = (key, defaultValue = null) => {
  if (!isBrowser()) return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Writes a key to localStorage safely.
 */
const setItem = (key, value) => {
  if (!isBrowser()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
    return false;
  }
};

/**
 * Authentication & Profile Operations
 */
export const storage = {
  isRegistered: () => {
    const profile = getItem(KEYS.USER_PROFILE);
    return !!profile;
  },

  registerUser: (profileData) => {
    const newProfile = {
      name: profileData.name || '',
      age: parseInt(profileData.age, 10) || 0,
      dob: profileData.dob || '',
      sex: profileData.sex || '',
      phone: profileData.phone || '',
      pin: profileData.pin || '', // Local security PIN
      termsAccepted: !!profileData.termsAccepted,
      registeredAt: new Date().toISOString()
    };
    return setItem(KEYS.USER_PROFILE, newProfile);
  },

  verifyPin: (pin) => {
    const profile = getItem(KEYS.USER_PROFILE);
    if (!profile) return false;
    return String(profile.pin) === String(pin);
  },

  getUserProfile: () => {
    return getItem(KEYS.USER_PROFILE);
  },

  updateUserProfile: (updatedFields) => {
    const current = getItem(KEYS.USER_PROFILE) || {};
    const updated = { ...current, ...updatedFields };
    return setItem(KEYS.USER_PROFILE, updated);
  },

  /**
   * Tracker Logs Operations
   */
  getLogs: () => {
    const logs = getItem(KEYS.TRACKER_LOGS, []);
    // Ensure logs are sorted chronologically descending (newest first)
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  addLog: (logEntry) => {
    const logs = getItem(KEYS.TRACKER_LOGS, []);
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: logEntry.timestamp || new Date().toISOString(),
      count: parseInt(logEntry.count, 10) || 1,
      partner: !!logEntry.partner,
      porn: !!logEntry.porn,
      notes: logEntry.notes || ''
    };
    
    logs.push(newLog);
    setItem(KEYS.TRACKER_LOGS, logs);
    return newLog;
  },

  deleteLog: (logId) => {
    const logs = getItem(KEYS.TRACKER_LOGS, []);
    const filteredLogs = logs.filter(log => log.id !== logId);
    return setItem(KEYS.TRACKER_LOGS, filteredLogs);
  },

  updateLog: (logId, updatedFields) => {
    const logs = getItem(KEYS.TRACKER_LOGS, []);
    const logIndex = logs.findIndex(log => log.id === logId);
    if (logIndex === -1) return false;

    logs[logIndex] = {
      ...logs[logIndex],
      ...updatedFields,
      // Convert count if modified
      count: updatedFields.count !== undefined ? parseInt(updatedFields.count, 10) || 1 : logs[logIndex].count
    };
    return setItem(KEYS.TRACKER_LOGS, logs);
  },

  /**
   * Settings & Theme Operations
   */
  getSettings: () => {
    return getItem(KEYS.APP_SETTINGS, { theme: 'dark', streakGoal: 7 });
  },

  updateSettings: (newSettings) => {
    const current = getItem(KEYS.APP_SETTINGS, { theme: 'dark', streakGoal: 7 });
    return setItem(KEYS.APP_SETTINGS, { ...current, ...newSettings });
  },

  /**
   * System Resets
   */
  clearAllData: () => {
    if (!isBrowser()) return false;
    try {
      localStorage.removeItem(KEYS.USER_PROFILE);
      localStorage.removeItem(KEYS.TRACKER_LOGS);
      localStorage.removeItem(KEYS.APP_SETTINGS);
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
};
