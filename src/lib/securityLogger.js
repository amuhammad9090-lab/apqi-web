import { supabase } from '@/lib/customSupabaseClient';

/**
 * Security Logger Utility
 * Logs security-relevant events to console and optionally to a remote audit log.
 */
export const securityLogger = {
  /**
   * Log an authentication attempt
   * @param {string} email - The email used in the attempt (never log passwords!)
   * @param {boolean} success - Whether the attempt was successful
   * @param {string} method - e.g., 'password', 'magic_link'
   * @param {string} errorReason - Optional error message if failed
   */
  logAuthAttempt: async (email, success, method = 'password', errorReason = null) => {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILURE';
    
    // 1. Console Log (Safe version)
    console.log(`[SECURITY][${timestamp}] Auth Attempt:`, {
      email: email, // Email is generally considered safe to log in server logs, but be careful in client console if sensitive
      status,
      method,
      reason: errorReason
    });

    // 2. Optional: Log to database if needed (Implementation depends on having an audit table)
    // For now we just keep it client-side/console as requested for debugging.
  },

  /**
   * Log a system or network error related to security/auth
   * @param {string} context - Where the error happened (e.g., 'AdminLoginPage')
   * @param {object} error - The error object
   */
  logError: (context, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[SECURITY][${timestamp}] Error in ${context}:`, {
      message: error.message,
      code: error.code || 'UNKNOWN',
      details: error
    });
  },
  
  /**
   * Log suspicious activity
   */
  logSuspiciousActivity: (activity, details) => {
    console.warn(`[SECURITY] SUSPICIOUS: ${activity}`, details);
  }
};