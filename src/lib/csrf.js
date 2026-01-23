import { v4 as uuidv4 } from 'uuid';

/**
 * CSRF Protection Utility
 * Generates and validates tokens for form submissions
 */
export const csrf = {
  generateToken: () => {
    const token = uuidv4();
    sessionStorage.setItem('csrf_token', token);
    return token;
  },
  
  validateToken: (token) => {
    const stored = sessionStorage.getItem('csrf_token');
    return token && stored && token === stored;
  },
  
  getToken: () => sessionStorage.getItem('csrf_token'),
  
  clearToken: () => sessionStorage.removeItem('csrf_token')
};