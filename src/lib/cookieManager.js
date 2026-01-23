/**
 * Secure Cookie Manager
 * Handles setting and retrieving cookies with security best practices.
 */

export const cookieManager = {
  /**
   * Set a secure cookie
   * @param {string} name 
   * @param {string} value 
   * @param {number} days 
   */
  setCookie: (name, value, days = 7) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    
    // Construct cookie string with security flags
    // Note: HttpOnly cannot be set from client-side JavaScript. 
    // It must be set by the server. We set Secure and SameSite.
    let cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=Strict`;
    
    // Only add Secure flag if on HTTPS (or localhost)
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      cookie += '; Secure';
    }
    
    document.cookie = cookie;
  },

  /**
   * Get a cookie value safely
   * @param {string} name 
   * @returns {string|null}
   */
  getCookie: (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Remove a cookie
   * @param {string} name 
   */
  removeCookie: (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  /**
   * Clear all non-essential cookies
   */
  clearAll: () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
};