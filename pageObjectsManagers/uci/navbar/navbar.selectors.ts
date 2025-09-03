export interface NavbarSelectors {
  logo: string;
  cinemas: string;
  movies: string;
  promotions: string;
  experiences: string;
  membership: string;
  eShop: string;
  signin: string;
  // Dropdown selectors for films navigation
  filmsDropdown: string;
  filmsAllMoviesLink: string;
  // Dynamic selectors for navigation
  filmsDirectLink: string;
  experiencesDirectLink: string;
  // Modal selectors
  promoModal: string;
}

// Constants for Navbar page - Centralized configuration
export const navbarConstants = {
  // Selector strings for primary navigation
  logoSelector: 'a[href="/"] img',
  cinemasSelector: 'a[href="/cinema"]',
  moviesTextSelector: 'p.cursor-pointer:has-text("Film")',
  promotionsTextSelector: 'p.cursor-pointer:has-text("Offerte")',
  experiencesTextSelector: 'p.cursor-pointer:has-text("Esperienze")',
  membershipSelector: 'a[href="/membership"]',
  eShopSelector: 'a[href="https://shop.ucicinemas.it"]',
  signinSelector: 'a[href*="login.ucicinemas.it"]',

  // Dropdown and dynamic navigation selectors
  filmsDropdownSelector: '.bg-blue-2.absolute.left-0.w-full',
  filmsAllMoviesLinkSelector: 'a[href="/film"]:has-text("Tutti i film")',
  filmsDirectLinkSelector: 'a[href="/film"], a[href*="/film"]',
  experiencesDirectLinkSelector:
    'a[href="/esperienze"], a[href*="/esperienze"]',
  promoModalSelector: 'div.bg-blue-1\\/80.fixed.w-full.h-full.z-40',

  // UCI-specific container selectors
  uciNavbarContainer: 'nav[data-v-navbar]',
  uciLogo: 'a[href="/"] img',

  // Timing configuration
  dropdownWaitTime: 1000,
  hoverWaitTime: 500,
  navigationTimeout: 15000,
  modalCheckDelay: 500,
  retryDelay: 1000,

  // Text constants for selectors
  filmsText: 'Film',
  promotionsText: 'Offerte',
  experiencesText: 'Esperienze',
  allMoviesText: 'Tutti i film',
  cinemasText: 'Cinema',
  membershipText: 'Membership',

  // Navigation messages
  navigationFailedMessage:
    'NAVIGATION FAILED - Unable to navigate to target page',
  dropdownNotVisibleMessage:
    'DROPDOWN NOT VISIBLE - Films dropdown could not be detected',
  modalHandlingMessage: 'Handling promotional modal before navigation',
  directNavSuccessMessage: 'Direct navigation successful',
  fallbackNavSuccessMessage: 'Fallback navigation successful',

  // URL patterns for validation
  homePattern: '/',
  cinemaPattern: '/cinema',
  filmsPattern: '/film',
  membershipPattern: '/membership',
  experiencesPattern: '/esperienze',
  promotionsPattern: '/offerte',
  shopPattern: 'shop.ucicinemas.it',
  loginPattern: 'login.ucicinemas.it',

  // External URLs
  eShopUrl: 'https://shop.ucicinemas.it',
  loginBaseUrl: 'login.ucicinemas.it',
} as const;

// Alternative navbar container selectors for enhanced robustness
export const alternativeNavbarSelectors = [
  'nav[data-v-navbar]',
  'nav.navbar',
  '.navigation-bar',
  'header nav',
  '[role="navigation"]',
  '.main-nav',
  '.navbar-container',
  '.top-navigation',
] as const;

// Alternative logo selectors for fallback strategies
export const alternativeLogoSelectors = [
  'a[href="/"] img',
  '.logo img',
  '.navbar-brand img',
  'img[alt*="UCI"]',
  'img[alt*="logo"]',
  'header img',
  '.brand img',
  'a.logo img',
] as const;

// Alternative navigation link selectors for robust element detection
export const alternativeMoviesSelectors = [
  'p.cursor-pointer:has-text("Film")',
  'a[href="/film"]',
  'nav a[href*="film"]',
  'li:has-text("Film")',
  '[data-nav="films"]',
  '.nav-films',
] as const;

// Alternative cinema selectors
export const alternativeCinemaSelectors = [
  'a[href="/cinema"]',
  'nav a[href*="cinema"]',
  'p.cursor-pointer:has-text("Cinema")',
  '[data-nav="cinema"]',
  '.nav-cinema',
] as const;

// Alternative promotional modal selectors
export const alternativePromoModalSelectors = [
  'div.bg-blue-1\\/80.fixed.w-full.h-full.z-40',
  '.modal-overlay',
  '.promotional-modal',
  '.popup-overlay',
  '[data-modal="promo"]',
  '.modal.show',
] as const;

export const navbarSelectors: NavbarSelectors = {
  // Primary navigation element selectors using centralized constants
  logo: navbarConstants.logoSelector,
  cinemas: navbarConstants.cinemasSelector,
  movies: navbarConstants.moviesTextSelector,
  promotions: navbarConstants.promotionsTextSelector,
  experiences: navbarConstants.experiencesTextSelector,
  membership: navbarConstants.membershipSelector,
  eShop: navbarConstants.eShopSelector,
  signin: navbarConstants.signinSelector,

  // Films dropdown navigation selectors
  filmsDropdown: navbarConstants.filmsDropdownSelector,
  filmsAllMoviesLink: navbarConstants.filmsAllMoviesLinkSelector,

  // Dynamic selectors for complex navigation strategies
  filmsDirectLink: navbarConstants.filmsDirectLinkSelector,
  experiencesDirectLink: navbarConstants.experiencesDirectLinkSelector,

  // Modal and overlay selectors
  promoModal: navbarConstants.promoModalSelector,
};
