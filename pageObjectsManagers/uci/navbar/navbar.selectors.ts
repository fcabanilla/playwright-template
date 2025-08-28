export interface NavbarSelectors {
  logo: string;
  cinemas: string;
  movies: string;
  promotions: string;
  experiences: string;
  membership: string;
  eShop: string;
  signin: string;
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
};
