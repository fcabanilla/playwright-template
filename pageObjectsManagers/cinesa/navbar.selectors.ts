export interface NavbarSelectors {
  // Selector para el logo (si se mantiene)
  logo: string;
  cines: string;
  peliculas: string;
  promociones: string;
  experiencias: string;
  programas: string;
  bonos: string;
}

export const navbarSelectors: NavbarSelectors = {
  logo: "[data-testid='navbar-logo']", // ...mantiene el selector de logo si aplica...
  cines: 'nav.header-nav a[href="/cines/"]',
  peliculas: 'nav.header-nav a[href="/peliculas/"]',
  promociones: 'nav.header-nav a[href="/promociones/"]',
  experiencias: 'nav.header-nav a[href="/experiencias/"]',
  programas: 'nav.header-nav a[href="/programas/"]',
  bonos:
    'nav.header-nav a[target="_blank"][href="https://www.cinesabusiness.es/promociones.html"]',
};
