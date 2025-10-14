/**
 * Cloudflare Access selectors
 * Following architectural pattern: selectors in separate files
 */

export interface CloudflareSelectors {
  /** Page title selector */
  pageTitle: string;
  /** Cloudflare access login form */
  loginForm: string;
  /** Access denied message */
  accessDenied: string;
}

export const cloudflareSelectors: CloudflareSelectors = {
  pageTitle: 'title',
  loginForm: '[data-testid="login-form"], .cf-login-form',
  accessDenied: '.cf-error-details, [data-testid="access-denied"]',
} as const;
