import { NavbarSelectors } from '../../../pageObjectsManagers/cinesa/navbar/navbar.selectors';
import { getCinesaUrls } from '../../../config/urls';

// Interfaz para representar un elemento de navegación y su URL esperada
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
}

/**
 * Obtiene los datos de navegación usando la configuración dinámica de entornos
 */
export function getNavbarData() {
  const urls = getCinesaUrls();

  // Elementos de navegación interna
  const internalNavItems: NavItem[] = [
    { selectorKey: 'cines', expectedUrl: `${urls.navigation.cinemas}/` },
    { selectorKey: 'peliculas', expectedUrl: `${urls.navigation.movies}/` },
    {
      selectorKey: 'promociones',
      expectedUrl: `${urls.navigation.promotions}/`,
    },
    {
      selectorKey: 'experiencias',
      expectedUrl: `${urls.navigation.experiences}/`,
    },
    { selectorKey: 'programas', expectedUrl: `${urls.navigation.membership}/` },
  ];

  // Elemento de navegación externa
  const externalNavItem: NavItem = {
    selectorKey: 'bonos',
    expectedUrl: 'https://www.cinesabusiness.es/promociones.html',
  };

  return {
    baseUrl: urls.base,
    internalNavItems,
    externalNavItem,
  };
}
