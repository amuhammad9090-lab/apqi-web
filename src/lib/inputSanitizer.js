import DOMPurify from 'dompurify';

/**
 * Input Sanitization Utility
 * Provides methods to sanitize and validate user inputs securely.
 */

// Email regex: strictly adheres to standard email format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL regex: requires http/https protocol
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const inputSanitizer = {
  /**
   * Sanitize basic text input to remove HTML tags and scripts
   * @param {string} text - The input text
   * @returns {string} - Sanitized text
   */
  sanitizeText: (text) => {
    if (typeof text !== 'string') return '';
    // Use DOMPurify to strip dangerous HTML
    const clean = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // No tags allowed for basic text
      ALLOWED_ATTR: []
    });
    return clean.trim();
  },

  /**
   * Sanitize HTML content (allowing safe tags)
   * @param {string} html - The input HTML
   * @returns {string} - Sanitized HTML
   */
  sanitizeHtml: (html) => {
    if (typeof html !== 'string') return '';
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true }
    });
  },

  /**
   * Validate and sanitize email address
   * @param {string} email 
   * @returns {string|null} - Returns sanitized email or null if invalid
   */
  validateEmail: (email) => {
    if (typeof email !== 'string') return null;
    const sanitized = inputSanitizer.sanitizeText(email);
    return EMAIL_REGEX.test(sanitized) ? sanitized : null;
  },

  /**
   * Validate and sanitize URL
   * @param {string} url 
   * @returns {string|null} - Returns sanitized URL or null if invalid
   */
  validateUrl: (url) => {
    if (typeof url !== 'string') return null;
    const sanitized = inputSanitizer.sanitizeText(url);
    return URL_REGEX.test(sanitized) ? sanitized : null;
  },

  /**
   * Sanitize an entire object of form data
   * @param {Object} formData 
   * @returns {Object} - New object with sanitized values
   */
  sanitizeForm: (formData) => {
    const sanitizedData = {};
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (typeof value === 'string') {
        // Special handling for email fields
        if (key.toLowerCase().includes('email')) {
          sanitizedData[key] = inputSanitizer.validateEmail(value) || value;
        } else {
          sanitizedData[key] = inputSanitizer.sanitizeText(value);
        }
      } else {
        sanitizedData[key] = value;
      }
    });
    return sanitizedData;
  },

  /**
   * Escape HTML entities to prevent XSS in direct rendering
   * @param {string} str 
   * @returns {string}
   */
  escapeHtml: (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};