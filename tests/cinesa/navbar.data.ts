import { NavbarSelectors } from '../../pageObjectsManagers/cinesa/navbar.selectors';

// Interfaz para representar un elemento de navegación y su URL esperada
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
}

// URL base del sitio
export const baseUrl = 'https://www.cinesa.es';

// Elementos de navegación interna
export const internalNavItems: NavItem[] = [
  { selectorKey: 'cines', expectedUrl: `${baseUrl}/cines/` },
  { selectorKey: 'peliculas', expectedUrl: `${baseUrl}/peliculas/` },
  { selectorKey: 'promociones', expectedUrl: `${baseUrl}/promociones/` },
  { selectorKey: 'experiencias', expectedUrl: `${baseUrl}/experiencias/` },
  { selectorKey: 'programas', expectedUrl: `${baseUrl}/programas/` },
];

// Elemento de navegación externa
export const externalNavItem: NavItem = {
  selectorKey: 'bonos',
  expectedUrl: 'https://www.cinesabusiness.es/promociones.html',
};
