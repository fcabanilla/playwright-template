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
  // Navigation element selectors
  logo: '[name="store logo"]',
  cinemas: 'a[href="/cinema"]',
  movies: 'p.cursor-pointer:has-text("Film")',
  promotions: 'p.cursor-pointer:has-text("Offerte")',
  experiences: 'text=Esperienze',
  membership: 'a[href="/membership"]',
  eShop: 'text=e-Shop',
  signin: '.btn-icon',
};
