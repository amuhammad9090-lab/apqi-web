/**
 * Simple Rate Limiter for Login Attempts
 */
const ATTEMPTS_KEY = 'login_attempts';
const LOCKOUT_KEY = 'login_lockout';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const rateLimiter = {
  checkLimit: () => {
    const lockoutTime = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
      return false;
    }
    return true;
  },

  recordAttempt: (success) => {
    if (success) {
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      return;
    }

    let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
    attempts++;
    localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem(LOCKOUT_KEY, (Date.now() + LOCKOUT_TIME).toString());
    }
  },

  getRemainingTime: () => {
    const lockoutTime = localStorage.getItem(LOCKOUT_KEY);
    if (!lockoutTime) return 0;
    return Math.max(0, parseInt(lockoutTime) - Date.now());
  }
};