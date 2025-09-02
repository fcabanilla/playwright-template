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

export const navbarSelectors: NavbarSelectors = {
  // Navigation element selectors based on HTML structure
  logo: 'a[href="/"] img', // Logo image inside link to home
  cinemas: 'a[href="/cinema"]',
  movies: 'p.cursor-pointer:has-text("Film")',
  promotions: 'p.cursor-pointer:has-text("Offerte")',
  experiences: 'p.cursor-pointer:has-text("Esperienze")',
  membership: 'a[href="/membership"]',
  eShop: 'a[href="https://shop.ucicinemas.it"]',
  signin: 'a[href*="login.ucicinemas.it"]',

  // Films dropdown selectors
  filmsDropdown: '.bg-blue-2.absolute.left-0.w-full', // The dropdown container
  filmsAllMoviesLink: 'a[href="/film"]:has-text("Tutti i film")', // Specific link to all films

  // Dynamic selectors for complex navigation
  filmsDirectLink: 'a[href="/film"], a[href*="/film"]',
  experiencesDirectLink: 'a[href="/esperienze"], a[href*="/esperienze"]',

  // Modal and overlay selectors
  promoModal: 'div.bg-blue-1\\/80.fixed.w-full.h-full.z-40',
};
