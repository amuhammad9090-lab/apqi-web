import CryptoJS from 'crypto-js';

/**
 * Request Signing Utility
 * Implements HMAC-SHA256 signing for API requests to prevent tampering.
 */

// In a real app, this secret should be derived from the user's session or a key exchange.
// Since we are client-side only, we'll simulate a client-secret.
const CLIENT_SECRET = 'apqi-client-secure-v1';

export const requestSigner = {
  /**
   * Generate a signature for a request
   * @param {string} path - The API path
   * @param {string} method - HTTP method
   * @param {Object} body - Request body
   * @param {number} timestamp - Current timestamp
   * @returns {string} - HMAC-SHA256 signature
   */
  signRequest: (path, method, body, timestamp) => {
    const payload = `${method.toUpperCase()}:${path}:${timestamp}:${body ? JSON.stringify(body) : ''}`;
    const signature = CryptoJS.HmacSHA256(payload, CLIENT_SECRET).toString(CryptoJS.enc.Hex);
    return signature;
  },

  /**
   * Get headers with signature
   * @param {string} path 
   * @param {string} method 
   * @param {Object} body 
   * @returns {Object} - Headers object
   */
  getSignedHeaders: (path, method = 'GET', body = null) => {
    const timestamp = Date.now();
    const signature = requestSigner.signRequest(path, method, body, timestamp);

    return {
      'X-Signature': signature,
      'X-Timestamp': timestamp.toString(),
      'X-Client-Id': 'web-client'
    };
  },

  /**
   * Verify signature (Utility for reference, normally used on backend)
   */
  verifySignature: (signature, path, method, body, timestamp) => {
    // Check if timestamp is within 5 minute window (replay protection)
    const now = Date.now();
    if (Math.abs(now - timestamp) > 300000) {
      return false;
    }

    const expectedSignature = requestSigner.signRequest(path, method, body, timestamp);
    return signature === expectedSignature;
  }
};