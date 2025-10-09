/**
 * Selectors for the authenticated user navigation bar
 * Following ADR-0009: All selectors must be in separate .selectors.ts files
 *
 * This file contains selectors for the navbar elements visible after user authentication,
 * including account menu, logout button, and navigation to My Account sections.
 *
 * @module AuthenticatedNavbarSelectors
 */

export const AuthenticatedNavbarSelectors = {
  // Direct "Mi cuenta" link in navbar (appears after login)
  myAccountNavLink:
    '#my-account-nav-link a[href="/mycinesa/"], a[href="/mycinesa/"]',

  // Member context (user photo and name)
  memberContext: {
    container: '.v-member-context',
    memberPhoto: '.member-photo',
    memberName: '.member-name',
    memberPhotoPlaceholder: '.v-icon--member-photo-placeholder',
  },

  // User info displayed in navbar
  userInfo: {
    userName: '.member-name',
    memberTier: '.member-tier, .membership-badge',
    pointsBalance: '.points-balance, .member-points',
  },

  // Logout button
  logoutButton: 'a.header-sign-out, a:has-text("Cerrar sesión")',

  // Login button (for verification that user is NOT authenticated)
  loginButton: 'a.header-sign-in, a:has-text("Inicia sesión")',

  // Signup button
  signupButton: 'a.header-sign-up, a:has-text("Regístrate")',

  // Header sign container (shows different content when authenticated)
  headerSign: '.header-sign',
  headerMember: '.header-member',
} as const;

/**
 * Type-safe selector keys for autocomplete
 */
export type AuthenticatedNavbarSelectorKeys =
  keyof typeof AuthenticatedNavbarSelectors;
