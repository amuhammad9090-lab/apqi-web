/**
 * Session Manager for Admin
 * Handles timeouts and activity tracking
 */

const ADMIN_SESSION_KEY = 'apqi_admin_session';
const LAST_ACTIVITY_KEY = 'apqi_admin_last_activity';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const sessionManager = {
  startAdminSession: () => {
    localStorage.setItem(ADMIN_SESSION_KEY, 'active');
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    // Simulate HttpOnly cookie by not exposing sensitive data in this storage
  },

  updateActivity: () => {
    if (localStorage.getItem(ADMIN_SESSION_KEY)) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  },

  checkSessionValid: () => {
    const isActive = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!isActive) return false;

    const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0');
    const now = Date.now();

    if (now - lastActivity > SESSION_TIMEOUT) {
      sessionManager.clearSession();
      return false;
    }
    
    return true;
  },

  clearSession: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }
};