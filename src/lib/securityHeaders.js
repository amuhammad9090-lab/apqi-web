/**
 * Security Headers Utility
 * 
 * Note: Since this is a client-side application, strictly speaking we cannot set 
 * HTTP Response Headers directly. These headers are typically configured at the 
 * web server or CDN level (e.g., Netlify _headers, Vercel vercel.json, Nginx config).
 * 
 * However, this utility provides the configuration object that should be applied 
 * to server responses and can be used by Edge Functions or server-side logic.
 */

export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://supabase.co https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
};

/**
 * Returns a headers object for fetch requests that includes necessary security context.
 * Useful for communicating with backend services that expect specific headers.
 */
export const getClientSecurityHeaders = () => {
  return {
    'X-Client-Version': '1.0.0',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  };
};

/**
 * Applies security headers to a Response object (useful in Service Workers or Edge Functions)
 * @param {Response} response 
 * @returns {Response}
 */
export const applySecurityHeaders = (response) => {
  const newHeaders = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
};