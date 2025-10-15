/**
 * Unified Navbar Selectors for both authenticated and unauthenticated states
 * Following ADR-0009: All selectors must be in separate .selectors.ts files
 *
 * The navbar displays different elements based on authentication state:
 * - Unauthenticated: Shows "Inicia sesión" and "Regístrate" buttons
 * - Authenticated: Shows user name, "Mi cuenta" link, and "Cerrar sesión" button
 *
 * @module NavbarSelectors
 */

export const NAVBAR_SELECTORS = {
  // Common navigation links (always visible)
  common: {
    logo: '.logo a',
    cines: 'nav.header-nav a[href="/cines/"]',
    peliculas: 'nav.header-nav a[href="/peliculas/"]',
    promociones: 'nav.header-nav a[href="/promociones/"]',
    experiencias: 'nav.header-nav a[href="/experiencias/"]',
    programas: 'nav.header-nav a[href="/programas/"]',
    bar: 'nav.header-nav a[href="/bar/compra/"]',
    bonos:
      'nav.header-nav a[target="_blank"][href="https://www.cinesabusiness.es/promociones.html"]',
  },

  // Selectors visible ONLY when user is NOT authenticated
  unauthenticated: {
    signInButton: 'a.header-sign-in, a:has-text("Inicia sesión")',
    signUpButton: 'a.header-sign-up, a:has-text("Regístrate")',
    headerSign: '.header-sign:not(.header-member)',
  },

  // Selectors visible ONLY when user IS authenticated
  authenticated: {
    // Direct "Mi cuenta" link in navbar (appears after login)
    myAccountLink:
      '#my-account-nav-link a[href="/mycinesa/"], a[href="/mycinesa/"]',

    // Member context (user photo and name) - SPECIFIC to header, not burger menu
    // Using .header-sign ancestor to avoid selecting mobile burger version
    memberContext: '.header-sign .v-member-context',
    memberPhoto: '.header-sign .member-photo',
    memberName: '.header-sign .member-name',
    memberPhotoPlaceholder: '.header-sign .v-icon--member-photo-placeholder',

    // User info
    userName: '.header-sign .member-name',
    memberTier: '.member-tier, .membership-badge',
    pointsBalance: '.points-balance, .member-points',

    // Logout button
    logoutButton: 'a.header-sign-out, a:has-text("Cerrar sesión")',

    // Header sign container when authenticated
    headerMember: '.header-member',
  },
} as const;

/**
 * Legacy interface for backward compatibility
 * @deprecated Use NAVBAR_SELECTORS.common instead
 */
export interface NavbarSelectors {
  logo: string;
  cines: string;
  peliculas: string;
  promociones: string;
  experiencias: string;
  programas: string;
  bonos: string;
  signup: string;
  signin: string;
}

/**
 * Legacy selectors export for backward compatibility
 * @deprecated Use NAVBAR_SELECTORS instead
 */
export const navbarSelectors: NavbarSelectors = {
  logo: NAVBAR_SELECTORS.common.logo,
  cines: NAVBAR_SELECTORS.common.cines,
  peliculas: NAVBAR_SELECTORS.common.peliculas,
  promociones: NAVBAR_SELECTORS.common.promociones,
  experiencias: NAVBAR_SELECTORS.common.experiencias,
  programas: NAVBAR_SELECTORS.common.programas,
  bonos: NAVBAR_SELECTORS.common.bonos,
  signup: NAVBAR_SELECTORS.unauthenticated.signUpButton,
  signin: NAVBAR_SELECTORS.unauthenticated.signInButton,
};
