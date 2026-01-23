# Security Documentation

This document outlines the security measures implemented in the APQI Web Application.

## 1. Content Security Policy (CSP)
We implement a strict Content Security Policy to mitigate Cross-Site Scripting (XSS) and other code injection attacks.
- **Default Src**: 'self'
- **Script Src**: 'self' 'unsafe-inline' (Required for Vite dev server) 'wasm-unsafe-eval'
- **Style Src**: 'self' 'unsafe-inline' (Required for Tailwind/CSS-in-JS)
- **Connect Src**: 'self' and Supabase domains

## 2. Input Sanitization
All user inputs are sanitized using `DOMPurify` before processing or rendering.
- HTML tags are stripped from basic text inputs.
- Email addresses are validated against strict regex.
- URLs are validated to ensure protocol security.

## 3. Authentication Security
- **Secure Storage**: Auth state is managed via Supabase's secure session handling.
- **Rate Limiting**: Client-side rate limiting prevents brute-force attempts on Login and Contact forms.
- **Password Policy**: Strong password requirements (min 8 chars, uppercase, lowercase, number) are enforced.

## 4. Cross-Site Scripting (XSS) Prevention
- React's default escaping protects against most XSS.
- `dangerouslySetInnerHTML` is never used without explicit sanitization via `inputSanitizer`.
- X-XSS-Protection header is enabled.

## 5. Network Security
- **Request Signing**: API requests can be signed using HMAC-SHA256 (via `src/lib/requestSigner.js`) to prevent tampering.
- **HTTPS**: The application forces HTTPS via HSTS (Strict-Transport-Security) configuration guidance.
- **CSRF**: `SameSite=Strict` cookies are used where applicable.

## 6. Logging
- **Privacy-First**: Security logs (`src/lib/securityLogger.js`) never contain PII (Personally Identifiable Information) or sensitive credentials.
- **Audit Trails**: Failed auth attempts and suspicious inputs are logged for monitoring.

## 7. Headers
The following security headers are configured for the application context:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restricts access to sensitive browser features.

## 8. Dependencies
- We minimize third-party dependencies.
- `sideEffects: false` enabled in `package.json` for tree-shaking and reduced attack surface.