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
    container: '.account-container__content, .account-overview',
    title: '.section-box-list__item-title',
    welcomeMessage: '.v-member-context',
    sectionBoxList: '.section-box-list',
  },

  // Navigation cards/tiles to different sections
  navigation: {
    // Section 1: Overview/Dashboard
    overviewCard: '.account-overview',

    // Section 2: Bookings (Mis Entradas)
    bookingsCard: 'a[href="/mycinesa/mis-entradas/"]',
    bookingsIcon: '.section-box-list__item-title:has-text("Mis entradas")',

    // Section 3: Offers & Rewards (Ofertas y Recompensas)
    offersCard: 'a[href="/mycinesa/ofertas-y-recompensas/"]',
    offersIcon:
      '.section-box-list__item-title:has-text("Ofertas y recompensas")',

    // Section 4: Achievements (Mis Logros)
    achievementsCard: 'a[href="/mycinesa/mis-logros/"]',
    achievementsIcon: '.section-box-list__item-title:has-text("Mis logros")',

    // Section 5: Help/FAQs (Ayuda)
    helpCard: 'a[href="/que-es-mycinesa/"]',
    helpIcon: '.section-box-list__item-title:has-text("Ayuda")',

    // Generic section box items
    sectionBoxItems: '.section-box-list__item',
    sectionBoxTitle: '.section-box-list__item-title',
    sectionBoxSummary: '.section-box-list__item-summary',
    sectionBoxLink: '.section-box-list__item-link a',

    // Legacy selectors (for backward compatibility - not present in current HTML)
    preferencesCard: 'a[href="/mycinesa/preferencias/"]',
    membershipCard: 'a[href="/mycinesa/mis-suscripciones/"]',
    cardWalletCard: 'a[href="/mycinesa/mis-tarjetas/"]',
    profileCard: 'a[href="/mycinesa/mi-perfil/"]',
  },

  // User dashboard widgets (based on actual HTML structure)
  dashboard: {
    // Member context (user info area)
    memberContext: '.v-member-context',

    // Section summaries
    entriesSummary:
      '.section-box-list__item:has-text("Mis entradas") .section-box-list__item-summary',
    offersSummary:
      '.section-box-list__item:has-text("Ofertas y recompensas") .section-box-list__item-summary',
    achievementsSummary:
      '.section-box-list__item:has-text("Mis logros") .section-box-list__item-summary',

    // Legacy selectors (may not be present in current view)
    pointsWidget: '.points-widget, .loyalty-balance',
    pointsValue: '.points-value, .balance-amount',
    pointsLabel: '.points-label',
    watchedFilmsWidget: '.watched-films-widget, .films-counter',
    watchedFilmsValue: '.watched-films-value, .films-count',
    watchedFilmsLabel: '.watched-films-label',
    userName: '.user-name, .member-name, .account-name',
    userEmail: '.user-email, .account-email',
    recentBookings: '.recent-bookings-widget',
    bookingItem: '.booking-item',
    bookingsSummary: '.bookings-summary, .recent-bookings-summary',
    upcomingBookingsCount: '.upcoming-bookings-count',
    membershipStatus: '.membership-status-widget',
    membershipTier: '.membership-tier',
    membershipExpiry: '.membership-expiry',
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
