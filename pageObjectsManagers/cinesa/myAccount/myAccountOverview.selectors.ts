/**
 * Selectors for My Account Overview page
 * Following ADR-0009: All selectors must be in separate .selectors.ts files
 *
 * This is the main landing page after navigating to /mycinesa/mi-area-de-cliente/
 * Contains navigation to all My Account subsections.
 *
 * Reference: ADR-0008 - My Account Area Testing Strategy
 *
 * @module MyAccountOverviewSelectors
 */

export const MyAccountOverviewSelectors = {
  // Page identifiers
  page: {
    container:
      '.account-overview, .my-account-container, [data-page="account-overview"]',
    title: 'h1:has-text("Mi área de cliente"), h1:has-text("Mi cuenta")',
    welcomeMessage: '.welcome-message, .user-greeting',
  },

  // Navigation cards/tiles to different sections
  navigation: {
    // Section 1: Overview/Dashboard
    overviewCard:
      'a[href="/mycinesa/mi-area-de-cliente/"], [data-section="overview"]',

    // Section 2: Bookings (Mis Entradas)
    bookingsCard:
      'a[href="/mycinesa/mis-entradas/"], [data-section="bookings"]',
    bookingsIcon: '.bookings-icon, .v-icon--ticket',

    // Section 3: Preferences (Preferencias)
    preferencesCard:
      'a[href="/mycinesa/preferencias/"], [data-section="preferences"]',
    preferencesIcon: '.preferences-icon, .v-icon--settings',

    // Section 4: Membership (Suscripciones)
    membershipCard:
      'a[href="/mycinesa/mis-suscripciones/"], [data-section="membership"]',
    membershipIcon: '.membership-icon, .v-icon--card',

    // Section 5: Offers & Rewards (Ofertas y Recompensas)
    offersCard:
      'a[href="/mycinesa/ofertas-y-recompensas/"], [data-section="offers"]',
    offersIcon: '.offers-icon, .v-icon--gift',

    // Section 6: Card Wallet (Mis Tarjetas)
    cardWalletCard: 'a[href="/mycinesa/mis-tarjetas/"], [data-section="cards"]',
    cardWalletIcon: '.card-wallet-icon, .v-icon--wallet',

    // Section 7: Profile (Mi Perfil)
    profileCard: 'a[href="/mycinesa/mi-perfil/"], [data-section="profile"]',
    profileIcon: '.profile-icon, .v-icon--user',
  },

  // User dashboard widgets (if present)
  dashboard: {
    // Loyalty points widget
    pointsWidget: '.points-widget, .loyalty-balance',
    pointsValue: '.points-value, .balance-amount',
    pointsLabel: '.points-label',

    // Recent bookings widget
    recentBookings: '.recent-bookings-widget',
    bookingItem: '.booking-item',

    // Membership status widget
    membershipStatus: '.membership-status-widget',
    membershipTier: '.membership-tier',
    membershipExpiry: '.membership-expiry',

    // Active offers widget
    activeOffers: '.active-offers-widget',
    offerItem: '.offer-item',
  },

  // Quick actions
  quickActions: {
    container: '.quick-actions, .action-buttons',
    viewBookings: 'button:has-text("Ver entradas"), a:has-text("Ver entradas")',
    updateProfile:
      'button:has-text("Actualizar perfil"), a:has-text("Actualizar perfil")',
    viewOffers: 'button:has-text("Ver ofertas"), a:has-text("Ver ofertas")',
  },

  // Loading states
  loading: {
    spinner: '.v-loading-spinner, .loading-indicator',
    skeleton: '.skeleton-loader',
  },

  // Error states
  error: {
    container: '.error-message, .v-error',
    title: '.error-title',
    description: '.error-description',
    retryButton:
      'button:has-text("Reintentar"), button:has-text("Volver a intentar")',
  },
} as const;

/**
 * Type-safe selector keys for autocomplete
 */
export type MyAccountOverviewSelectorKeys =
  keyof typeof MyAccountOverviewSelectors;
