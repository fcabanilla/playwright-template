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
  // Main account button/icon in navbar
  accountButton: {
    // The icon clicked in Codegen: page.getByRole('banner').filter({ hasText: 'CinesPelí' }).locator('use').first()
    // More specific selector needed - will use class or data attribute
    container: '[role="banner"]',
    iconButton:
      'button[aria-label*="cuenta"], button[aria-label*="account"], .header-account-button',
    // Alternative: by icon class
    icon: '.v-icon--user, .v-icon--account',
  },

  // Dropdown menu that appears after clicking account button
  accountMenu: {
    container: '.account-dropdown, .v-dropdown-menu, .user-menu',
    menuList: '.v-dropdown-menu__list, .user-menu__list',

    // Menu items
    myAccountLink:
      'a[href="/mycinesa/mi-area-de-cliente/"], a:has-text("Mi área de cliente")',
    myBookingsLink: 'a[href="/mycinesa/mis-entradas/"]',
    myProfileLink: 'a[href="/mycinesa/mi-perfil/"]',
    myPreferencesLink: 'a[href="/mycinesa/preferencias/"]',
    myMembershipLink: 'a[href="/mycinesa/mis-suscripciones/"]',
    logoutButton:
      'button:has-text("Cerrar sesión"), a:has-text("Cerrar sesión")',
  },

  // User info displayed in navbar
  userInfo: {
    userName: '.user-name, .member-name',
    memberTier: '.member-tier, .membership-badge',
    pointsBalance: '.points-balance, .member-points',
  },

  // Login button (for verification that user is NOT authenticated)
  loginButton: 'button:has-text("Inicia sesión")',

  // Signup button
  signupButton: 'button:has-text("Regístrate"), a:has-text("Regístrate")',
} as const;

/**
 * Type-safe selector keys for autocomplete
 */
export type AuthenticatedNavbarSelectorKeys =
  keyof typeof AuthenticatedNavbarSelectors;
