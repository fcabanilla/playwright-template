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

export const navbarSelectors: NavbarSelectors = {
  logo: "header .logo a:first-child",
  cines: 'nav.header-nav a[href="/cines/"]',
  peliculas: 'nav.header-nav a[href="/peliculas/"]',
  promociones: 'nav.header-nav a[href="/promociones/"]',
  experiencias: 'nav.header-nav a[href="/experiencias/"]',
  programas: 'nav.header-nav a[href="/programas/"]',
  bonos: 'nav.header-nav a[href*="promociones"], nav.header-nav a[href*="bonos"], nav.header-nav a:has-text("Bonos")',
  signup: '.header-sign-up',
  signin: '.header-sign-in',
};
